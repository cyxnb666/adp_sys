<template>
  <div>
    <!-- 属性组管理按钮 -->
    <div class="attribute-groups-header">
      <div class="button-group">
        <el-button type="primary" size="small" @click="addAttributeGroup">添加属性组</el-button>
      </div>
    </div>

    <!-- 属性BOM选择器 -->
    <scorecard-bom-selector
      :visible.sync="bomSelectorVisible"
      :bom-base-info-id="bomBaseInfoId"
      :group-id="currentGroupId"
      return-type="attribute"
      @attribute-selected="handleAttributeSelected"
    />

    <!-- 属性组标签导航 -->
    <div class="attribute-groups-tabs">
      <el-tag
        v-for="(group, index) in attributeGroups"
        :key="group.scorecardAttributeGroupId"
        :type="index === activeGroupIndex ? '' : 'info'"
        effect="plain"
        class="group-tab"
        @click="scrollToGroup(group.scorecardAttributeGroupId, index)"
      >
        <span>{{ group.groupName || `属性组 ${index + 1}` }}</span>
        <span class="group-actions">
          <i class="el-icon-edit" @click.stop="openRenameDialog(group)" title="重命名"></i>
          <i class="el-icon-delete" @click.stop="confirmDeleteGroup(group.scorecardAttributeGroupId)" v-if="attributeGroups.length > 1" title="删除"></i>
        </span>
      </el-tag>
      <!-- 移除滚动提示 -->
    </div>

    <!-- 重命名对话框 -->
    <el-dialog
      title="重命名属性组"
      :visible.sync="renameDialogVisible"
      width="30%"
      append-to-body
    >
      <el-form>
        <el-form-item label="属性组名称">
          <el-input v-model="renameGroupName" placeholder="请输入属性组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRenameGroup">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加属性组对话框 -->
    <el-dialog
      title="添加属性组"
      :visible.sync="addGroupDialogVisible"
      width="30%"
      append-to-body
    >
      <el-form>
        <el-form-item label="属性组名称">
          <el-input v-model="newGroupName" placeholder="请输入属性组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddGroup">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import ScorecardBomSelector from './ScorecardBomSelector.vue'

export default {
  name: 'ScorecardAttributeGroup',
  components: {
    ScorecardBomSelector
  },
  props: {
    attributeGroups: {
      type: Array,
      required: true
    },
    activeGroupIndex: {
      type: Number,
      default: 0
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      renameDialogVisible: false,
      addGroupDialogVisible: false,
      bomSelectorVisible: false,
      renameGroupName: '',
      newGroupName: '',
      currentEditingGroupId: '',
      currentGroupId: ''
    };
  },
  methods: {
    // 滚动到指定属性组
    scrollToGroup(groupId, index) {
      this.$emit('scroll-to-group', groupId, index);
    },

    // 打开重命名对话框
    openRenameDialog(group) {
      this.renameGroupName = group.groupName;
      this.currentEditingGroupId = group.scorecardAttributeGroupId;
      this.renameDialogVisible = true;
    },

    // 确认重命名属性组
    confirmRenameGroup() {
      if (!this.renameGroupName.trim()) {
        this.$message.warning('属性组名称不能为空');
        return;
      }

      this.$emit('rename-group', this.currentEditingGroupId, this.renameGroupName.trim());
      this.renameDialogVisible = false;
    },

    // 确认删除属性组
    confirmDeleteGroup(groupId) {
      // 确保至少保留一个属性组
      if (this.attributeGroups.length <= 1) {
        this.$message.warning('至少需要保留一个属性组');
        return;
      }

      this.$confirm('删除属性组将同时删除该组下的所有属性和条件，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete-group', groupId);
      }).catch(() => {});
    },

    // 添加属性组
    addAttributeGroup() {
      this.newGroupName = `属性组 ${this.attributeGroups.length + 1}`;
      this.addGroupDialogVisible = true;
    },

    // 确认添加属性组
    confirmAddGroup() {
      if (!this.newGroupName.trim()) {
        this.$message.warning('属性组名称不能为空');
        return;
      }

      this.$emit('add-group', this.newGroupName.trim());
      this.addGroupDialogVisible = false;
    },

    // 处理属性选择
    handleAttributeSelected(attributeData) {
      // 触发事件，将选中的属性数据传递给父组件
      this.$emit('attribute-added', attributeData);

      // 显示成功消息
      this.$message.success('属性添加成功');
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute-groups-header {
  display: flex;
  margin-bottom: 10px;

  .button-group {
    display: flex;
    gap: 10px; // 按钮之间的间距
  }
}

.attribute-groups-tabs {
  display: flex;
  overflow-x: auto;
  padding: 5px 0;
  margin-bottom: 10px;

  .group-tab {
    margin-right: 10px;
    cursor: pointer;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    min-width: 100px;
    justify-content: space-between;

    .group-actions {
      display: flex;
      align-items: center;
      margin-left: 5px;

      i {
        margin-left: 5px;
        font-size: 14px;
        display: inline-block;
        visibility: visible;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  .scroll-hint {
    display: flex;
    align-items: center;
    color: #909399;
    font-size: 12px;
  }
}
</style>
