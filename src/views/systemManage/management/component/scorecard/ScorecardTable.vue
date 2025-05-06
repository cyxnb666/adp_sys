<template>
  <div class="scorecard-table-container">
    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" size="small" @click="openAddAttributeDialog">添加属性</el-button>
    </div>

    <!-- 评分卡表格 -->
    <el-table
      ref="scorecardTable"
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px;"
      row-key="rowId"
      class="scorecard-table"
      :span-method="spanMethod"
    >
      <!-- 序号列 -->
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
      ></el-table-column>

      <!-- 动态生成属性组列 -->
      <el-table-column
        v-for="group in attributeGroups"
        :key="group.scorecardAttributeGroupId || 'default-group'"
        :label="group.groupName || '属性组'"
        align="center"
      >
        <!-- 属性列 -->
        <el-table-column
          :prop="`attribute_${group.scorecardAttributeGroupId || 'default-group'}`"
          :class-name="`attribute-column-${group.scorecardAttributeGroupId || 'default-group'}`"
          width="280"
          align="center"
          header-align="center"
        >
          <template slot="header">
            <span class="column-title attribute-title">属性</span>
          </template>
          <template slot-scope="scope">
            <!-- 属性列内容居中显示 -->
            <div class="cell-content-center" :class="{'merged-cell': scope.row.isFirstRow}" :rowspan="scope.row.isFirstRow ? scope.row.spanRows : 1">
              <el-tooltip
                :content="scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] ? getAttributeDisplayName(scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId, group.attributes) : ''"
                placement="top"
                :disabled="!scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] || !getAttributeDisplayName(scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId, group.attributes)"
              >
                <el-input
                  :value="scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] ? getAttributeDisplayName(scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId, group.attributes) : ''"
                  readonly
                  placeholder="点击选择属性"
                  :key="`attr_input_${scope.row.rowId}_${group.scorecardAttributeGroupId || 'default-group'}_${scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] ? scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId : 'empty'}`"
                  class="centered-input"
                >
                  <el-button slot="append" icon="el-icon-search" @click="openAttributeSelector(group.scorecardAttributeGroupId || 'default-group', scope.row.rowId)">选择</el-button>
                </el-input>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <!-- 条件列 -->
        <el-table-column
          :prop="`condition_${group.scorecardAttributeGroupId || 'default-group'}`"
          :class-name="`condition-column-${group.scorecardAttributeGroupId || 'default-group'}`"
          width="280"
          align="center"
          header-align="center"
        >
          <template slot="header">
            <span class="column-title condition-title">条件</span>
          </template>
          <template slot-scope="scope">
            <div class="cell-content-center">
              <el-tooltip
                :content="scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`] ? (scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`].conditionDescription || '点击编辑条件') : '点击编辑条件'"
                placement="top"
                :disabled="!scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`] || !scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`].conditionDescription"
              >
                <el-input
                  :value="scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`] ? (scope.row[`condition_${group.scorecardAttributeGroupId || 'default-group'}`].conditionDescription || '点击编辑条件') : '点击编辑条件'"
                  readonly
                  :disabled="!scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] || !scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId"
                  @click.native="scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] && scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId ? openConditionEditor(scope.row.rowId, group.scorecardAttributeGroupId || 'default-group', scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId) : $message.warning('请先选择属性')"
                >
                  <el-button slot="append" icon="el-icon-edit" :disabled="!scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`] || !scope.row[`attribute_${group.scorecardAttributeGroupId || 'default-group'}`].scorecardAttributeId">编辑</el-button>
                </el-input>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 权重列 -->
      <el-table-column
        prop="weight"
        label="权重 [0-1]"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <div class="custom-input-number weight-input" :data-row-id="scope.row.rowId">
            <el-input-number
              :value="scope.row.weight"
              :min="0"
              :max="1"
              :precision="2"
              :step="0.1"
              controls-position="right"
              style="width: 100%; min-width: 130px;"
              @change="(value) => handleWeightChange(value, scope.row)"
            ></el-input-number>
          </div>
        </template>
      </el-table-column>

      <!-- 分值列 -->
      <el-table-column
        prop="scoreValue"
        label="分值"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <div class="custom-input-number score-input" :data-row-id="scope.row.rowId">
            <el-input-number
              :value="scope.row.scoreValue"
              :precision="2"
              :step="1"
              controls-position="right"
              style="width: 100%; min-width: 130px;"
              @change="(value) => handleScoreChange(value, scope.row)"
            ></el-input-number>
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-plus"
            @click.stop="handleAddConditionRow(scope.row)"
          >添加条件行</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="deleteRow(scope.row.rowId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 属性BOM选择器 -->
    <scorecard-bom-selector
      :visible.sync="attributeSelectorVisible"
      :bom-base-info-id="bomBaseInfoId"
      :group-id="currentGroupId"
      return-type="attribute"
      @attribute-selected="handleAttributeSelected"
    />

    <!-- 选择属性组对话框 -->
    <el-dialog
      title="选择属性组"
      :visible.sync="selectGroupDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      :destroy-on-close="true"
    >
      <el-form>
        <el-form-item label="属性组">
          <el-select v-model="selectedGroupId" placeholder="请选择属性组" style="width: 100%;">
            <el-option
              v-for="group in attributeGroups"
              :key="group.scorecardAttributeGroupId"
              :label="group.groupName || `属性组 ${attributeGroups.indexOf(group) + 1}`"
              :value="group.scorecardAttributeGroupId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddAttribute">取消</el-button>
        <el-button type="primary" @click="confirmAddAttribute">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ScorecardBomSelector from './ScorecardBomSelector.vue'

export default {
  name: 'ScorecardTable',
  components: {
    ScorecardBomSelector
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    attributeGroups: {
      type: Array,
      required: true
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      attributeSelectorVisible: false,
      selectGroupDialogVisible: false,
      selectedGroupId: '',
      currentGroupId: '',
      currentRowId: '',
      mergedCells: {}
    };
  },

  mounted() {
    // 在表格渲染完成后处理属性列的合并单元格
    this.$nextTick(() => {
      this.handleMergedCells();
    });
  },
  updated() {
    // 在表格数据更新后重新处理属性列的合并单元格
    this.$nextTick(() => {
      this.handleMergedCells();
    });
  },
  watch: {
    // 监听属性组变化
    attributeGroups: {
      handler() {
        // 强制更新视图
        this.$nextTick(() => {
          this.handleMergedCells();
        });
      },
      deep: true
    },
    // 监听表格数据变化
    tableData: {
      handler() {
        // 强制更新视图
        this.$nextTick(() => {
          this.handleMergedCells();
        });
      },
      deep: true
    }
  },
  methods: {
    // 获取属性显示名称
    getAttributeDisplayName(attributeId, attributes) {
      if (!attributeId || !attributes || !attributes.length) return '';

      const attribute = attributes.find(attr => attr.scorecardAttributeId === attributeId);
      return attribute ? attribute.attributeFieldName : '';
    },

    // 打开属性选择器
    openAttributeSelector(groupId, rowId) {
      this.currentGroupId = groupId;
      this.currentRowId = rowId;
      this.attributeSelectorVisible = true;
    },

    // 打开添加属性对话框
    openAddAttributeDialog() {
      if (this.attributeGroups.length === 0) {
        this.$message.warning('请先添加属性组');
        return;
      }

      // 默认选中第一个属性组
      this.selectedGroupId = this.attributeGroups[0].scorecardAttributeGroupId;
      this.selectGroupDialogVisible = true;
    },

    // 取消添加属性
    cancelAddAttribute() {
      this.selectGroupDialogVisible = false;
      this.selectedGroupId = '';
    },

    // 确认添加属性
    confirmAddAttribute() {
      if (!this.selectedGroupId) {
        this.$message.warning('请选择属性组');
        return;
      }

      // 设置当前属性组ID
      this.currentGroupId = this.selectedGroupId;

      // 打开BOM选择器
      this.attributeSelectorVisible = true;

      // 关闭选择属性组对话框
      this.selectGroupDialogVisible = false;
    },

    // 处理属性选择
    handleAttributeSelected(attributeData) {
      // 设置属性组ID
      attributeData.scorecardAttributeGroupId = this.currentGroupId;

      // 如果有当前行ID，则设置行ID
      if (this.currentRowId) {
        attributeData.rowId = this.currentRowId;

        // 先触发属性添加事件，确保属性已添加到属性组
        this.$emit('attribute-added', attributeData);

        // 然后触发属性变更事件
        this.$nextTick(() => {
          this.$emit('attribute-change', this.currentRowId, this.currentGroupId, attributeData.scorecardAttributeId);
        });
      } else {
        // 触发属性添加事件
        this.$emit('attribute-added', attributeData);
      }

      // 显示成功消息
      this.$message.success('属性添加成功');
    },

    // 处理属性变更
    handleAttributeChange(rowId, scorecardAttributeGroupId, scorecardAttributeId) {
      this.$emit('attribute-change', rowId, scorecardAttributeGroupId, scorecardAttributeId);
    },

    // 打开条件编辑器
    openConditionEditor(rowId, scorecardAttributeGroupId, scorecardAttributeId) {
      this.$emit('open-condition-editor', rowId, scorecardAttributeGroupId, scorecardAttributeId);
    },

    // 处理权重变更
    handleWeightChange(value, row) {
      // 如果有行对象，则更新原始数据
      if (row && row.rowId) {
        // 直接更新行的权重
        row.weight = value;

        // 如果有原始行引用，也更新原始行的权重
        if (row._originalRow) {
          row._originalRow.weight = value;
        }

        // 触发数据变更事件，并传递行ID和新的权重值
        this.$emit('weight-change', row.rowId, value);
      }
    },

    // 处理分值变更
    handleScoreChange(value, row) {
      // 如果有行对象，则更新原始数据
      if (row && row.rowId) {
        // 直接更新行的分值
        row.scoreValue = value;

        // 如果有原始行引用，也更新原始行的分值
        if (row._originalRow) {
          row._originalRow.scoreValue = value;
        }

        // 触发数据变更事件，并传递行ID和新的分值
        this.$emit('score-change', row.rowId, value);
      }
    },

    // 检查行是否有有效的属性
    hasValidAttribute(row) {
      // 确保属性组不为空
      if (!this.attributeGroups || this.attributeGroups.length === 0) {
        return false;
      }

      // 检查所有属性组是否都有有效的属性
      for (const group of this.attributeGroups) {
        const attributeKey = `attribute_${group.scorecardAttributeGroupId}`;

        // 检查属性是否存在且有效
        if (!row[attributeKey] || !row[attributeKey].scorecardAttributeId) {
          return false;
        }

        // 检查属性ID是否对应了属性组中的实际属性
        const attributeId = row[attributeKey].scorecardAttributeId;

        // 如果属性组没有属性，则跳过检查
        if (!group.attributes || group.attributes.length === 0) {
          continue;
        }

        // 查找属性
        const attribute = group.attributes.find(attr => attr.scorecardAttributeId === attributeId);

        if (!attribute) {
          return false;
        }

        // 检查属性是否有字段路径和字段名称
        if (!attribute.attributeFieldPath || !attribute.attributeFieldName) {
          return false;
        }
      }

      return true;
    },

    // 处理添加条件行
    handleAddConditionRow(row) {
      // 确保属性组不为空
      if (!this.attributeGroups || this.attributeGroups.length === 0) {
        this.$message.warning('没有可用的属性组');
        return;
      }

      // 检查行是否有有效的属性
      const isValid = this.hasValidAttribute(row);

      if (!isValid) {
        this.$message.warning('请先选择属性');
        return;
      }

      // 触发添加条件行事件
      this.$emit('add-condition-row', row.rowId);
    },

    // 删除行
    deleteRow(rowId) {
      this.$confirm('确定要删除此条件行吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete-row', rowId);
      }).catch(() => {});
    },

    // 处理属性列的合并单元格
    handleMergedCells() {
      // 强制更新表格
      this.$nextTick(() => {
        if (this.$refs.scorecardTable) {
          this.$refs.scorecardTable.doLayout();
        }
      });
    },

    // 表格合并单元格方法
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 如果不是属性列，不进行合并
      if (!column.property || !column.property.startsWith('attribute_')) {
        return { rowspan: 1, colspan: 1 };
      }

      // 获取属性组ID
      const groupId = column.property.replace('attribute_', '');

      // 获取当前行的属性对象
      const attribute = row[`attribute_${groupId}`];
      if (!attribute) {
        return { rowspan: 1, colspan: 1 };
      }

      // 如果没有属性ID，不进行合并
      if (!attribute.scorecardAttributeId) {
        return { rowspan: 1, colspan: 1 };
      }

      // 如果是第一行，显示并合并
      if (attribute.isFirstRow) {
        // 确保 spanRows 至少为 1
        const spanRows = Math.max(1, attribute.spanRows || 1);
        return { rowspan: spanRows, colspan: 1 };
      }

      // 如果有父行，不显示
      if (attribute.parentRowId) {
        return { rowspan: 0, colspan: 0 };
      }

      // 默认不合并
      return { rowspan: 1, colspan: 1 };
    }
  }
}
</script>

<style lang="scss" scoped>
.scorecard-table-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.cell-content-center {
  display: flex;
  justify-content: center;
}

.column-title {
  font-weight: bold;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  z-index: 1;
}

:deep(.el-input-number .el-input__inner) {
  padding-right: 50px !important;
  text-overflow: ellipsis;
}

/* 自定义输入框样式 */
.custom-input-number {
  position: relative;
  width: 100%;
}

/* 自定义按钮样式 */
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__decrease),
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__increase) {
  border: none;
  background: #f5f7fa;
}

/* 修改按钮内的图标样式 */
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__decrease i),
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__increase i) {
  transform: scale(0.8);
}

/* 隐藏按钮上的点 */
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__decrease::after),
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__increase::after) {
  display: none !important;
}

/* 悬停样式 */
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__decrease:hover),
:deep(.custom-input-number .el-input-number.is-controls-right .el-input-number__increase:hover) {
  color: #409EFF;
  background: #f5f7fa;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-input__inner) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* 属性列合并单元格样式 */
.cell-content-center[rowspan] {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 隐藏非第一行的属性列 */
.el-table__row:not(:first-child) .attribute-column .cell-content-center:not([rowspan]) {
  display: none;
}

/* 属性列内容居中 */
.attribute-column-group1 .cell,
[class*="attribute-column-"] .cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 确保属性列的输入框居中 */
.attribute-column-group1 .el-input,
[class*="attribute-column-"] .el-input {
  width: 100%;
}

/* 调整属性列的高度，使其在合并单元格时保持垂直居中 */
.el-table__row .attribute-column-group1 .cell-content-center,
.el-table__row [class*="attribute-column-"] .cell-content-center {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 合并单元格的样式 */
.merged-cell {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 居中输入框的样式 */
.centered-input {
  width: 100%;
}

/* 确保表格单元格内容垂直居中 */
.el-table__cell {
  vertical-align: middle !important;
}

/* 调整合并单元格的高度 */
.el-table__row .el-table__cell[rowspan] {
  vertical-align: middle !important;
}

/* 调整属性列的内边距 */
[class*="attribute-column-"] .cell {
  padding: 8px !important;
}
/* 表格工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
