<template>
  <el-dialog
    title="选择字段"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    @closed="handleDialogClosed"
  >
    <div v-loading="loading">
      <el-input
        placeholder="输入关键字过滤"
        v-model="filterText"
        clearable
        prefix-icon="el-icon-search"
        style="margin-bottom: 10px;"
      >
      </el-input>
      <div style="height: 400px; overflow-y: auto; border: 1px solid #EBEEF5; border-radius: 4px;">
        <el-tree
          ref="bomTree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          node-key="fieldId"
          highlight-current
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span :class="{ 'is-field': isFieldNode(data) }">
              {{ node.label }}
              <span v-if="data.type" class="field-type">({{ data.type }})</span>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmSelection">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bomClassAndField } from '@/api/systemManage/bom'

export default {
  name: 'ScorecardBomSelector',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    },
    bomBaseData: {
      type: Array,
      default: null
    },
    fieldTypeFilter: {
      type: Array,
      default: () => []
    },
    // 新增props
    returnType: {
      type: String,
      default: 'simple', // 'simple' 或 'attribute'
      validator: value => ['simple', 'attribute'].includes(value)
    },
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      filterText: '',
      treeData: [],
      selectedNode: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.loadBomData();
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    },
    filterText(val) {
      this.$refs.bomTree && this.$refs.bomTree.filter(val);
    }
  },
  mounted() {
    if (this.dialogVisible) {
      this.loadBomData();
    }
  },
  methods: {
    // 加载BOM数据
    loadBomData() {
      if (this.bomBaseData) {
        this.treeData = this.bomBaseData;
        // 为树节点设置完整路径
        this.formatTreeNode(this.treeData, {});
        return;
      }

      if (!this.bomBaseInfoId) {
        return;
      }

      this.loading = true;
      bomClassAndField({ bomBaseInfoId: this.bomBaseInfoId })
        .then(res => {
          this.treeData = [res];
          // 为树节点设置完整路径
          this.formatTreeNode(this.treeData, {});
          this.loading = false;
        })
        .catch(() => {
          this.$message.error('加载 BOM 数据失败');
          this.loading = false;
        });
    },

    // 为树节点设置完整路径
    formatTreeNode(children, parent) {
      if (!children || !children.length) return;

      children.forEach(node => {
        // 设置当前节点的完整路径
        node.fullLabelPath = parent.fullLabelPath ? `${parent.fullLabelPath} 的 ${node.label}` : node.label;

        // 递归处理子节点
        if (node.children && node.children.length) {
          this.formatTreeNode(node.children, node);
        }
      });
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().includes(value.toLowerCase());
    },

    // 判断是否为字段节点
    isFieldNode(data) {
      return data.isField || data.fieldPath;
    },

    // 处理节点点击
    handleNodeClick(data) {
      if (!this.isFieldNode(data)) {
        return;
      }

      // 如果有类型过滤，检查类型是否符合要求（不区分大小写）
      if (this.fieldTypeFilter && this.fieldTypeFilter.length > 0) {
        // 将数据类型转换为小写进行比较
        const dataType = data.type ? data.type.toLowerCase() : '';
        const allowedTypes = this.fieldTypeFilter.map(type => type.toLowerCase());

        if (!allowedTypes.includes(dataType)) {
          this.$message.warning('选择的字段必须为数值类型');
          return;
        }
      }

      this.selectedNode = data;
    },

    // 确认选择
    confirmSelection() {
      if (!this.selectedNode) {
        this.$message.warning('请选择一个字段');
        return;
      }

      // 根据returnType返回不同的数据结构
      if (this.returnType === 'attribute') {
        // 属性选择器模式
        const attributeData = {
          scorecardAttributeId: 'attr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), // 使用临时ID，后端会生成正式UUID
          attributeFieldPath: this.selectedNode.fieldPath,
          attributeFieldName: this.selectedNode.fullLabelPath || this.selectedNode.label,
          attributeFieldType: this.selectedNode.type,
          scorecardAttributeGroupId: this.groupId
        };

        this.$emit('attribute-selected', attributeData);
      } else {
        // 简单选择器模式（默认）
        const fieldData = {
          fieldPath: this.selectedNode.fieldPath,
          fieldName: this.selectedNode.fullLabelPath || this.selectedNode.label,
          fieldType: this.selectedNode.type
        };

        this.$emit('field-selected', fieldData);
      }

      this.dialogVisible = false;
    },

    // 对话框关闭处理
    handleDialogClosed() {
      this.selectedNode = null;
      this.filterText = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.is-field {
  font-weight: bold;
}

.field-type {
  color: #909399;
  font-size: 12px;
  margin-left: 5px;
}
</style>
