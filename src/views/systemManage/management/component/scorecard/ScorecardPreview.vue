<template>
  <div class="scorecard-preview-container" v-loading="loading">
    <div v-if="!localScorecardData">
      <div>正在加载评分卡数据...</div>
      <div v-if="loadError" class="error-message">
        <el-alert
          title="加载失败"
          type="error"
          :description="loadError"
          show-icon
        ></el-alert>
      </div>
    </div>
    <div v-else>
      <!-- 基本信息区域 -->
      <div class="form-section basic-info-section">
        <div class="formItemDiv">
          <div class="info-item">
            <span class="label">评分卡名称：</span>
            <span class="value">{{ localScorecardData && localScorecardData.scorecardName || '未指定' }}</span>
          </div>
        </div>
        <div class="formItemDiv">
          <div class="info-item">
            <span class="label">路径：</span>
            <span class="value">{{ localScorecardData && localScorecardData.scorecardPath || '/' }}</span>
          </div>
        </div>
      </div>

      <!-- 非回收站模式显示详细信息 -->
      <template v-if="!isReset">
        <!-- 2. 前置规则 -->
        <div class="add-decision-table-item">
          <div class="title">
            <span>前置规则</span>
          </div>
          <div class="rule-preview">
            <div class="rule-wrap">
              <div class="rule-view">
                <span class="value">如果：</span>
                <span class="value valueContent" style="word-break: break-all;" v-html="localScorecardData && localScorecardData.rule && localScorecardData.rule.ruleDesc || '-'"/>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 评分容器 -->
        <div class="add-decision-table-item">
          <div class="title">
            <span>评分容器</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="form-item-container">
                <div class="form-item-label">选择存储总分的字段</div>
                <div class="form-item-content">
                  <el-tooltip :content="localScorecardData && localScorecardData.scoreContainerFieldName || '未指定'" placement="top" :disabled="!localScorecardData || !localScorecardData.scoreContainerFieldName">
                    <span class="field-display" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">{{ localScorecardData && localScorecardData.scoreContainerFieldName || '未指定' }}</span>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="form-item-container">
                <div class="form-item-label">总分</div>
                <div class="form-item-content">
                  <span class="total-score-display">{{ localScorecardData && localScorecardData.totalScore || '-' }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 4. 评分卡路径 -->
        <div class="add-decision-table-item">
          <div class="title">
            <span>评分卡路径</span>
          </div>

          <!-- 属性组标签导航 -->
          <div class="attribute-groups-tabs">
            <el-tag
              v-for="(group, index) in (localScorecardData && localScorecardData.attributeGroups || [])"
              :key="group.scorecardAttributeGroupId"
              type="info"
              effect="plain"
              class="group-tab"
            >
              <span>{{ group.groupName || `属性组 ${index + 1}` }}</span>
            </el-tag>
          </div>

          <!-- 评分卡表格 -->
          <el-table
            :data="formattedTableData"
            border
            style="width: 100%; margin-top: 10px;"
            empty-text="没有评分卡数据"
            row-key="rowId"
            class="scorecard-table"
            :span-method="spanMethod"
          >
          <!-- 序号列 -->
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>

          <!-- 动态生成属性组列 -->
          <template v-for="group in (localScorecardData && localScorecardData.attributeGroups || [])">
            <el-table-column
              :key="group.scorecardAttributeGroupId"
              :label="group.groupName || '属性组'"
              align="center"
            >
              <!-- 属性列 -->
              <el-table-column
                :prop="`attribute_${group.scorecardAttributeGroupId}`"
                :class-name="`attribute-column-${group.scorecardAttributeGroupId}`"
                width="280"
                align="center"
                header-align="center"
              >
                <template slot="header">
                  <span class="column-title attribute-title">属性</span>
                </template>
                <template slot-scope="scope">
                  <div class="cell-content-center" :class="{'merged-cell': scope.row.isFirstRow}">
                    <div v-if="scope.row[`attribute_${group.scorecardAttributeGroupId}`]">
                      <!-- 显示属性名称，不显示类型 -->
                      <el-tooltip :content="scope.row[`attribute_${group.scorecardAttributeGroupId}`].attributeName || '-'" placement="top" :disabled="!(scope.row[`attribute_${group.scorecardAttributeGroupId}`] && scope.row[`attribute_${group.scorecardAttributeGroupId}`].attributeName)">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;">
                          {{ scope.row[`attribute_${group.scorecardAttributeGroupId}`].attributeName || '-' }}
                        </div>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </div>
                </template>
              </el-table-column>

              <!-- 条件列 -->
              <el-table-column
                :prop="`condition_${group.scorecardAttributeGroupId}`"
                :class-name="`condition-column-${group.scorecardAttributeGroupId}`"
                label="条件"
                min-width="200"
                align="center"
                header-align="center"
              >
                <template slot="header">
                  <span class="column-title condition-title">条件</span>
                </template>
                <template slot-scope="scope">
                  <div class="cell-content-center">
                    <div v-if="scope.row[`condition_${group.scorecardAttributeGroupId}`]">
                      <!-- 显示条件描述 -->
                      <el-tooltip :content="scope.row[`condition_${group.scorecardAttributeGroupId}`].display || '-'" placement="top" :disabled="!(scope.row[`condition_${group.scorecardAttributeGroupId}`] && scope.row[`condition_${group.scorecardAttributeGroupId}`].display)">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">
                          {{ scope.row[`condition_${group.scorecardAttributeGroupId}`].display || '-' }}
                        </div>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </template>

          <!-- 权重列 -->
          <el-table-column label="权重" prop="weight" width="100" align="center">
            <template slot="header">
              <span class="column-title weight-title">权重</span>
            </template>
            <template slot-scope="scope">
              <div class="cell-content-center">
                {{ scope.row.weight || 0 }}
              </div>
            </template>
          </el-table-column>

          <!-- 分值列 -->
          <el-table-column label="分值" prop="scoreValue" width="100" align="center">
            <template slot="header">
              <span class="column-title score-title">分值</span>
            </template>
            <template slot-scope="scope">
              <div class="cell-content-center">
                {{ scope.row.scoreValue || 0 }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </template>

      <!-- 操作按钮 -->
      <div v-if="!readOnly" style="margin-top: 20px; text-align: center;">
        <!-- 测试评分卡功能将在后续版本实现 -->
        <!-- <el-button type="success" @click="handleTest">测试评分卡</el-button> -->
        <el-button v-if="!isReset" type="primary" @click="handleEdit">修改评分卡</el-button>
        <el-button v-if="!isReset" type="danger" @click="handleDelete">删除评分卡</el-button>
        <el-button v-if="isReset" type="primary" class="btn-background mini" @click="handleRestore">还原</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入评分卡相关的API
import { getScorecardDetail, deleteScorecard, restoreScorecard } from '@/api/mainPages/scorecard'
import { generateTableData, generateConditionRowsFromAttributes } from './ScorecardUtils'

// 操作符定义
const OPERATORS = {
  COMMON: [
    { label: '等于 (==)', value: '==' }, { label: '不等于 (!=)', value: '!=' },
    { label: '为空 (IS NULL)', value: 'IS NULL' }, { label: '不为空 (IS NOT NULL)', value: 'IS NOT NULL' },
    { label: '包含于 (IN)', value: 'IN' }, { label: '不包含于 (NOT IN)', value: 'NOT IN' }
  ],
  NUMERIC: [
    { label: '等于 (==)', value: '==' }, { label: '不等于 (!=)', value: '!=' },
    { label: '大于 (>)', value: '>' }, { label: '小于 (<)', value: '<' },
    { label: '大于等于 (>=)', value: '>=' }, { label: '小于等于 (<=)', value: '<=' },
    { label: '大于等于 a, 小于等于 b', value: '[]' },
    { label: '大于 a, 小于等于 b', value: '(]' },
    { label: '大于等于 a, 小于 b', value: '[)' },
    { label: '大于 a, 小于 b', value: '()' },
    { label: '为空 (IS NULL)', value: 'IS NULL' }, { label: '不为空 (IS NOT NULL)', value: 'IS NOT NULL' },
    { label: '包含于 (IN)', value: 'IN' }, { label: '不包含于 (NOT IN)', value: 'NOT IN' }
  ]
};

const ALL_OPERATORS = [...OPERATORS.COMMON, ...OPERATORS.NUMERIC];

export default {
  name: 'ScorecardPreview',
  props: {
    currentNode: {
      type: Object,
      default: null
    },
    scorecardData: {
      type: Object,
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      localScorecardData: {
        scorecardInfoId: '',
        scorecardName: '',
        scorecardPath: '/',
        rule: {
          id: null,
          ruleId: null,
          ruleContent: null,
          ruleDesc: ''
        },
        scoreContainerFieldPath: '',
        scoreContainerFieldName: '',
        scoreContainerFieldType: '',
        attributeGroups: [],
        conditionRows: [],
        totalScore: null
      },
      formattedTableData: [],
      loadError: null // 加载错误信息
    };
  },
  created() {
    // 初始化数据
    if (this.scorecardData) {
      // 如果传入了 scorecardData，直接使用
      this.localScorecardData = this.scorecardData;
      this.formatTableData();
    } else if (this.currentNode) {
      // 如果没有传入 scorecardData，则加载评分卡数据
      this.loadScorecardData();
    }
  },
  methods: {
    // 加载评分卡数据
    loadScorecardData() {
      // 重置数据和状态
      this.loading = true;
      this.loadError = null;
      this.formattedTableData = [];

      // 检查当前节点是否是评分卡节点
      if (!this.currentNode || this.currentNode.leafType !== 'SCORECARD' || !this.currentNode.scorecardId) {
        // 不显示错误提示，只是不加载数据
        this.loading = false;
        return;
      }

      // 从后端获取评分卡数据

      getScorecardDetail(this.currentNode.scorecardId)
        .then(res => {


          // 将评分卡数据映射到前端需要的结构
          const data = res;

          // 与编辑页面完全一致的数据映射
          this.localScorecardData = {
            scorecardInfoId: data.scorecardInfoId,
            scorecardName: data.scorecardName,
            scorecardPath: data.scorecardPath || '/',
            decisionRepositoryId: data.decisionRepositoryId,
            decisionRepCatalogueId: data.decisionRepCatalogueId,
            rule: {
              id: data.ruleId,  // 添加id字段，与编辑页面保持一致
              ruleId: data.ruleId,
              ruleContent: data.ruleContent,
              ruleDesc: data.ruleDesc || ''
            },
            scoreContainerFieldPath: data.scoreContainerFieldPath || '',
            scoreContainerFieldName: data.scoreContainerFieldName || '',
            scoreContainerFieldType: data.scoreContainerFieldType || '',
            attributeGroups: data.attributeGroups || [],
            conditionRows: data.conditionRows || []
          };


          this.formatTableData();
        })
        .catch(err => {
          console.error('获取评分卡数据失败:', err);
          this.$message.error('获取评分卡数据失败');

          // 如果获取数据失败，使用当前节点的基本信息
          this.loadError = err.message || '获取评分卡数据失败';



          // 初始化为空数据
          this.localScorecardData = {
            scorecardInfoId: this.currentNode.id,
            scorecardName: this.currentNode.label,
            scorecardPath: '/',  // 错误情况下使用根路径
            decisionRepositoryId: '',
            decisionRepCatalogueId: '',
            rule: {
              id: null,
              ruleId: null,
              ruleContent: null,
              ruleDesc: ''
            },
            scoreContainerFieldPath: '',
            scoreContainerFieldName: '',
            scoreContainerFieldType: '',
            attributeGroups: [],
            conditionRows: []
          };

          // 即使在错误情况下也要格式化表格数据
          this.formatTableData();
        })
        .finally(() => {
          this.loading = false;

        });
    },

    // 格式化表格数据
    formatTableData() {
      // 使用本地的 localScorecardData
      const data = this.localScorecardData;

      if (!data) {
        this.formattedTableData = [];
        return;
      }

      // 确保评分卡数据包含必要的属性
      if (!data.attributeGroups) data.attributeGroups = [];
      if (!data.scoreContainer) data.scoreContainer = { fieldName: '', fieldPath: '', fieldType: '' };

      // 如果没有conditionRows，从属性组中生成
      if (!data.conditionRows || data.conditionRows.length === 0) {
        data.conditionRows = generateConditionRowsFromAttributes(data.attributeGroups);
      }

      // 直接使用生成的条件行，而不是通过generateTableData函数处理
      this.formattedTableData = data.conditionRows;
    },

    // 表格合并单元格方法
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 如果是序号列或权重列或分值列，不进行合并
      if (columnIndex === 0 || column.property === 'weight' || column.property === 'score') {
        return { rowspan: 1, colspan: 1 };
      }

      // 如果是属性列，进行合并
      if (column.property && column.property.startsWith('attribute_')) {
        // 获取属性组ID
        const groupId = column.property.replace('attribute_', '');

        // 如果是第一行，直接返回
        if (rowIndex === 0) {
          // 计算当前属性值相同的行数
          let count = 1;
          const currentAttrId = row[column.property] ? row[column.property].attributeId : null;

          // 如果没有属性ID，不进行合并
          if (!currentAttrId) {
            return { rowspan: 1, colspan: 1 };
          }

          // 向下查找相同属性的行
          for (let i = 1; i < this.formattedTableData.length; i++) {
            const nextRow = this.formattedTableData[i];
            const nextAttr = nextRow[column.property];
            if (nextAttr && nextAttr.attributeId === currentAttrId) {
              count++;
            } else {
              break;
            }
          }

          return { rowspan: count, colspan: 1 };
        } else {
          // 非第一行，检查是否需要隐藏
          const prevRow = this.formattedTableData[rowIndex - 1];
          const currentAttrId = row[column.property] ? row[column.property].attributeId : null;
          const prevAttrId = prevRow[column.property] ? prevRow[column.property].attributeId : null;

          // 如果当前行的属性ID与上一行相同，隐藏当前行
          if (currentAttrId && prevAttrId && currentAttrId === prevAttrId) {
            return { rowspan: 0, colspan: 0 };
          }

          // 否则，计算当前属性值相同的行数
          let count = 1;

          // 如果没有属性ID，不进行合并
          if (!currentAttrId) {
            return { rowspan: 1, colspan: 1 };
          }

          // 向下查找相同属性的行
          for (let i = rowIndex + 1; i < this.formattedTableData.length; i++) {
            const nextRow = this.formattedTableData[i];
            const nextAttr = nextRow[column.property];
            if (nextAttr && nextAttr.attributeId === currentAttrId) {
              count++;
            } else {
              break;
            }
          }

          return { rowspan: count, colspan: 1 };
        }
      }

      // 默认不合并
      return { rowspan: 1, colspan: 1 };
    },

    // 从属性组中生成条件行 - 使用公共方法

    // 处理测试按钮点击
    handleTest() {
      // 优先使用 props 中的 scorecardData，如果没有则使用本地的 localScorecardData
      const data = this.scorecardData || this.localScorecardData;

      this.$message({
        message: '测试功能待实现',
        type: 'info'
      });
      // TODO: 调用测试API
      // this.$emit('test', this.currentNode || (data && { id: data.id, leafType: 'SCORECARD' }));
    },

    // 处理编辑按钮点击
    handleEdit() {
      // 优先使用 props 中的 scorecardData，如果没有则使用本地的 localScorecardData
      const data = this.scorecardData || this.localScorecardData;

      // 获取评分卡ID，优先使用data.id，如果没有则使用currentNode.scorecardId
      const scorecardId = (data && data.id) || (this.currentNode && this.currentNode.scorecardId);


      // 检查评分卡ID是否存在
      if (!scorecardId) {
        this.$message({
          message: '无法编辑评分卡：评分卡ID不存在',
          type: 'error'
        });
        return;
      }

      // 触发编辑事件，传递完整的节点信息
      const nodeInfo = this.currentNode || { id: scorecardId, leafType: 'SCORECARD' };
      this.$emit('edit', nodeInfo);
    },

    // 处理删除按钮点击
    handleDelete() {
      // 优先使用 props 中的 scorecardData，如果没有则使用本地的 localScorecardData
      const data = this.scorecardData || this.localScorecardData;

      // 获取评分卡ID，优先使用data.id，如果没有则使用currentNode.scorecardId
      const scorecardId = (data && data.id) || (this.currentNode && this.currentNode.scorecardId);


      // 检查评分卡ID是否存在
      if (!scorecardId) {
        this.$message({
          message: '无法删除评分卡：评分卡ID不存在',
          type: 'error'
        });
        return;
      }

      this.$confirm('此操作将删除该评分卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除API
        this.loading = true;
        deleteScorecard(scorecardId)
          .then(res => {
            this.loading = false;
            this.$message({
              message: '删除评分卡成功',
              type: 'success'
            });
            // 触发事件，通知父组件刷新数据
            // 确保传递完整的节点信息，包括父路径
            const nodeInfo = this.currentNode || { id: scorecardId, leafType: 'SCORECARD' };
            // 如果没有父路径，但有路径，则从路径中提取父路径
            if (!nodeInfo.parentPath && nodeInfo.path) {
              const pathParts = nodeInfo.path.split('/');
              pathParts.pop(); // 移除最后一个元素（当前节点名称）
              nodeInfo.parentPath = pathParts.join('/');
            }
            // 触发刷新决策库树形结构事件
            this.$emit('getDecisionRepositoryDetail', nodeInfo.parentPath);
            // 触发刷新恢复规则列表事件
            this.$emit('getRestoreRuleList');
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: '删除评分卡失败: ' + (err.message || err),
              type: 'error'
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 处理还原按钮点击
    handleRestore() {
      // 获取评分卡ID
      const data = this.scorecardData || this.localScorecardData;
      const scorecardId = (data && data.scorecardInfoId) || (this.currentNode && this.currentNode.scorecardId);

      // 检查评分卡ID是否存在
      if (!scorecardId) {
        this.$message({
          message: '无法还原评分卡：评分卡ID不存在',
          type: 'error'
        });
        return;
      }

      this.$confirm('此操作将还原该评分卡, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用还原API
        this.loading = true;
        restoreScorecard(scorecardId)
          .then(res => {
            this.loading = false;
            this.$message({
              message: '还原评分卡成功',
              type: 'success'
            });
            // 触发事件，通知父组件刷新数据
            const nodeInfo = this.currentNode || { id: scorecardId, leafType: 'SCORECARD' };
            // 如果没有父路径，但有路径，则从路径中提取父路径
            if (!nodeInfo.parentPath && nodeInfo.path) {
              const pathParts = nodeInfo.path.split('/');
              pathParts.pop(); // 移除最后一个元素（当前节点名称）
              nodeInfo.parentPath = pathParts.join('/');
            }
            // 触发刷新决策库树形结构事件
            this.$emit('getDecisionRepositoryDetail', nodeInfo.parentPath);
            // 触发刷新恢复规则列表事件
            this.$emit('getRestoreRuleList');
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: '还原评分卡失败: ' + (err.message || err),
              type: 'error'
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消还原'
        });
      });
    }
  },
  watch: {
    // 监听 currentNode 的变化，当切换评分卡节点时重新加载数据
    currentNode: {
      handler(newNode, oldNode) {
        if (newNode && (!oldNode || newNode.id !== oldNode.id)) {

          this.loadScorecardData();
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.scorecard-preview-container {
  padding: 20px;

  .form-section {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    .formItemDiv {
      flex: 1;
      min-width: 300px;
      margin-right: 20px;
    }
  }

  .basic-info-section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;

    h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 10px;
    }

    .info-item {
      margin-bottom: 10px;

      .label {
        font-weight: bold;
        margin-right: 10px;
        color: #606266;
      }

      .value {
        color: #303133;
      }
    }
  }

  .add-decision-table-item {
    margin-bottom: 20px;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }

  .rule-preview {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f5f7fa;

    .rule-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rule-view {
        flex: 1;

        .value {
          font-size: 14px;

          &.valueContent {
            color: #606266;
          }
        }
      }
    }
  }

  .form-item-container {
    margin-bottom: 18px;
  }

  .form-item-label {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .form-item-content {
    position: relative;
  }

  .field-display {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 100%;
    background-color: #f5f7fa;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }



  .total-score-display {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 100%;
    background-color: #f5f7fa;
    color: #606266;
  }

  .attribute-groups-tabs {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .group-tab {
      cursor: pointer;
      margin-right: 5px;
      margin-bottom: 5px;
      padding: 5px 10px;
      display: flex;
      align-items: center;

      .group-actions {
        margin-left: 5px;
        display: flex;
        align-items: center;

        i {
          margin-left: 5px;
          cursor: pointer;
          font-size: 14px;

          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }

  .scorecard-table {
    margin-bottom: 20px;
  }

  .cell-content-center {
    display: flex;
    justify-content: center;
  }

  .column-title {
    font-weight: bold;
  }

  .field-type {
    color: #909399;
    font-size: 12px;
    margin-left: 5px;
  }

  .error-message {
    margin-top: 15px;
  }
}
</style>
