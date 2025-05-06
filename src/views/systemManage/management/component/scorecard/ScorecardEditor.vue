<template>
  <el-dialog
    :title="isAdd ? '新增评分卡' : '修改评分卡'"
    :visible.sync="dialogVisible"
    width="80%"
    append-to-body
    custom-class="scorecard-editor-dialog"
    :before-close="handleClose"
    @closed="onDialogClosed"
  >
    <div class="scorecard-editor-container" v-loading="loading">
      <el-form ref="scorecardForm" :model="scorecardData" :rules="rules" label-position="top">
        <!-- 1. 基础信息 -->
        <div class="form-section basic-info-section">
          <div class="formItemDiv">
            <el-form-item label="评分卡名称" prop="scorecardName">
              <el-input v-model="scorecardData.scorecardName" placeholder="请输入评分卡名称"></el-input>
            </el-form-item>
          </div>
          <div class="formItemDiv">
            <el-form-item label="路径" prop="scorecardPath">
              <el-input v-model="scorecardData.scorecardPath" disabled></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 2. 前置规则 -->
        <el-form-item class="add-decision-table-item">
          <div class="title">
            <span>前置规则</span>
          </div>
          <div>
            <div class="rule-preview">
              <div class="rule-wrap">
                <div class="rule-view">
                  <span class="value">如果：</span>
                  <span class="value valueContent" style="word-break: break-all;" v-html="(scorecardData.rule && scorecardData.rule.ruleDesc) || '-'"/>
                </div>
                <el-button type="text" size="small" @click="addDecisionRule">{{ isAdd || !(scorecardData.rule && scorecardData.rule.ruleId) ? '新增规则' : '编辑规则' }}</el-button>
                <el-button type="text" size="small" @click="delDecisionRule">删除规则</el-button>
              </div>
            </div>
            <el-input v-model="scorecardData.rule && scorecardData.rule.ruleContent" type="hidden" style="display: none;"/>
          </div>
        </el-form-item>

        <!-- 3. 评分容器 -->
        <scorecard-score-container
          :scorecard-data="scorecardData"
          :bom-base-info-id="bomBaseInfoId"
        />

        <!-- 4. 评分卡路径 -->
        <div class="add-decision-table-item">
          <div class="title">
            <span>评分卡路径</span>
          </div>
          <el-form-item label="" label-width="0px">
            <div>
              <!-- 属性组管理 -->
              <scorecard-attribute-group
                :attribute-groups="scorecardData.attributeGroups"
                :active-group-index="activeGroupIndex"
                :bom-base-info-id="bomBaseInfoId"
                @scroll-to-group="scrollToGroup"
                @rename-group="renameGroup"
                @delete-group="deleteGroup"
                @add-group="addGroup"
                @attribute-added="handleAttributeAdded"
              />

              <!-- 评分卡表格 -->
              <scorecard-table
                :key="tableKey"
                :table-data="tableData"
                :attribute-groups="scorecardData.attributeGroups"
                :bom-base-info-id="bomBaseInfoId"
                @attribute-change="handleAttributeChange"
                @attribute-added="handleAttributeAdded"
                @open-condition-editor="openConditionEditor"
                @delete-row="deleteRow"
                @add-condition-row="addConditionRow"
                @weight-change="handleWeightChange"
                @score-change="handleScoreChange"
              />
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="saveScorecard">保 存</el-button>
    </div>

    <!-- 前置规则编辑器弹窗 -->
    <RuleEditorDialog
      v-if="ruleEditorDialogVisible"
      v-model="ruleEditorDialogVisible"
      :rule="scorecardData.rule"
      :add="!scorecardData.rule.ruleId"
      @submitRule="addPreRule"
      @changeEditPage="changeEditPage"
    />

    <!-- 条件编辑器弹窗 -->
    <ScorecardConditionSelector
      v-if="conditionEditorVisible"
      :visible.sync="conditionEditorVisible"
      :condition-data="currentEditingCondition"
      :attribute-type="currentEditingAttributeType"
      @submit="handleConditionSubmit"
    />

    <!-- BOM 字段选择器弹窗 -->
    <el-dialog
      title="选择字段"
      :visible.sync="bomSelectorVisible"
      width="50%"
      append-to-body
    >
      <div v-if="bomSelectorVisible">
        <el-input
          placeholder="输入关键字过滤"
          v-model="bomFilterText"
          clearable
        >
        </el-input>
        <div style="height: 400px; overflow-y: auto; margin-top: 10px;">
          <el-tree
            ref="bomTree"
            :data="bomTreeData"
            :props="bomTreeProps"
            :filter-node-method="filterBomNode"
            node-key="fieldId"
            default-expand-all
            @node-click="handleBomNodeClick"
          >
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bomSelectorVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBomSelection">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
// 导入组件和工具
import RuleEditorDialog from '../RuleEditorDialog.vue'
import ScorecardConditionSelector from './ScorecardConditionSelector.vue'
import ScorecardScoreContainer from './ScorecardScoreContainer.vue'
import ScorecardAttributeGroup from './ScorecardAttributeGroup.vue'
import ScorecardTable from './ScorecardTable.vue'
import {
  formatScorecardForSubmission,
  initScorecardData,
  generateTableData,
  generateConditionRowsFromAttributes
} from './ScorecardUtils.js'

// API 导入
import { getRuleSettingId } from '@/api/systemManage/rule-manage'
import { saveOrUpdatePredefine, checkPredefine, getPredefineByRuleId } from '@/api/mainPages/decision'
import { bomClassAndField } from '@/api/systemManage/bom'

export default {
  name: 'ScorecardEditor',
  components: {
    RuleEditorDialog,
    ScorecardConditionSelector,
    ScorecardScoreContainer,
    ScorecardAttributeGroup,
    ScorecardTable
  },
  props: {
    scorecardId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    editScorecardId: {
      type: String,
      default: null
    },
    currentNode: {
      type: Object,
      default: null
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    },
    bomBaseData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      tableKey: 0, // 添加tableKey属性，用于强制重新渲染表格
      scorecardData: this.initScorecardData(),
      rules: {
        scorecardName: [{ required: true, message: '请输入评分卡名称', trigger: 'blur' }],
        scoreContainerFieldName: [{ required: true, message: '请选择存储总分的字段', trigger: ['blur', 'change'] }]
      },

      // 弹窗状态
      ruleEditorDialogVisible: false,
      bomSelectorVisible: false,
      conditionEditorVisible: false,

      // BOM 选择器相关
      currentBomSelectorTarget: null, // 'container' 或 'attribute'
      bomFilterText: '',
      selectedBomNode: null,
      bomTreeProps: {
        children: 'children',
        label: 'label'
      },
      bomTreeData: [],

      // 条件编辑器相关
      currentEditingRowId: '',
      currentEditingGroupId: '',
      currentEditingAttributeId: '',
      currentEditingConditionId: '',
      currentEditingCondition: null,
      currentEditingAttributeType: '',

      // 属性组管理相关
      activeGroupIndex: 0,

      // 预定义相关
      predefine: {},
      predefineTreeData: [],

      // 表格数据
      tableData: []
    };
  },
  computed: {
    isAdd() {
      return !this.scorecardId && !this.editScorecardId;
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;

      if (val) {
        if (this.editScorecardId) {
          this.fetchScorecardDetails(this.editScorecardId);
        } else {
          this.scorecardData = this.initScorecardData();

          // 初始化表格数据
          this.tableData = generateTableData(this.scorecardData);

          if (this.currentNode && !this.currentNode.leaf) {
            this.scorecardData.scorecardPath = this.currentNode.path;
            this.scorecardData.decisionRepCatalogueId = this.currentNode.id;
          } else {
            this.scorecardData.scorecardPath = '/';
            this.scorecardData.decisionRepCatalogueId = null;
          }
        }
      }
    },

    dialogVisible(val) {
      this.$emit('update:visible', val);
    },

    bomFilterText(val) {
      this.$refs.bomTree && this.$refs.bomTree.filter(val);
    },

    // 添加对 editScorecardId 的监听
    editScorecardId: {
      immediate: true,
      handler(val) {
        if (val && this.dialogVisible) {
          this.fetchScorecardDetails(val);
        }
      }
    }
  },
  mounted() {
    this.loadBomData();
    this.activeGroupIndex = 0;

    // 初始化表格数据
    this.tableData = generateTableData(this.scorecardData);
  },
  methods: {
    // 初始化评分卡数据
    initScorecardData() {
      return initScorecardData({
        decisionRepositoryId: this.decisionRepositoryId,
        scorecardPath: this.currentNode?.path || '/',
        decisionRepCatalogueId: this.currentNode?.id || null
      });
    },

    // 加载 BOM 数据
    loadBomData() {
      if (this.bomBaseData) {
        this.bomTreeData = this.bomBaseData;
        return;
      }

      if (!this.bomBaseInfoId) {
        console.warn('No bomBaseInfoId provided');
        return;
      }

      this.loading = true;
      bomClassAndField({ bomBaseInfoId: this.bomBaseInfoId })
        .then(res => {
          this.bomTreeData = [res];
          this.loading = false;
        })
        .catch(err => {
          console.error('Failed to load BOM data:', err);
          this.$message.error('加载 BOM 数据失败');
          this.loading = false;
        });
    },

    // 获取评分卡详情
    fetchScorecardDetails(id) {
      this.loading = true;

      import('@/api/mainPages/scorecard').then(api => {
        api.getScorecardDetail(id).then(res => {
          // 直接使用 res，而不是 res.data
          let data = res;

          // 如果 res 本身就有 data 属性，则使用 res.data
          if (res && res.data && typeof res.data === 'object' && res.data.scorecardInfoId) {
            data = res.data;
          }

          // 确保数据结构正确
          this.scorecardData = {
            scorecardInfoId: data.scorecardInfoId,
            scorecardName: data.scorecardName,
            scorecardPath: data.scorecardPath || '/',
            decisionRepositoryId: data.decisionRepositoryId,
            decisionRepCatalogueId: data.decisionRepCatalogueId,
            rule: {
              ruleTips: null, // 提示
              ruleContent: data.ruleContent, // 规则详情
              ruleDesc: data.ruleDesc || '', // 规则中文描述
              ruleName: null, // 规则名称
              ruleId: data.ruleId, // 规则id
              predefineText: data.predefineText || null, // 预定义文本
              editPredefineText: data.editPredefineText || null, // 编辑预定义文本
              predefine: null // 预定义对象
            },
            scoreContainerFieldPath: data.scoreContainerFieldPath,
            scoreContainerFieldName: data.scoreContainerFieldName,
            scoreContainerFieldType: data.scoreContainerFieldType || '',
            attributeGroups: data.attributeGroups || [],
            conditionRows: data.conditionRows || []
          };

          this.loading = false;

          // 创建原始数据的深拷贝，确保不会修改原始数据
          const scorecardDataCopy = JSON.parse(JSON.stringify(this.scorecardData));

          // 从属性组中生成条件行
          if (scorecardDataCopy.attributeGroups && scorecardDataCopy.attributeGroups.length > 0) {
            // 使用公共方法生成条件行
            scorecardDataCopy.conditionRows = generateConditionRowsFromAttributes(scorecardDataCopy.attributeGroups);

            // 更新原始数据
            this.scorecardData.conditionRows = JSON.parse(JSON.stringify(scorecardDataCopy.conditionRows));
          }

          // 使用 ScorecardUtils.js 中的 generateTableData 方法生成表格数据
          this.tableData = generateTableData(scorecardDataCopy);

          // 确保权重和分值与原始数据一致
          this.tableData.forEach(row => {
            const originalRow = this.scorecardData.conditionRows.find(r => r.rowId === row.rowId);
            if (originalRow) {
              row.weight = originalRow.weight;
              row.scoreValue = originalRow.scoreValue;
            }
          });

          // 强制刷新表格数据
          this.tableKey += 1;

          // 强制更新视图
          this.$nextTick(() => {
            if (this.$refs.scorecardForm) {
              this.$refs.scorecardForm.$forceUpdate();
            }
            this.$forceUpdate();
          });
        }).catch(err => {
          console.error('Failed to fetch scorecard details:', err);
          this.$message.error('获取评分卡详情失败');
          this.loading = false;
        });
      }).catch(err => {
        console.error('Failed to load API:', err);
        this.$message.error('加载 API 失败');
        this.loading = false;
      });
    },

    // --- 前置规则相关方法 ---
    async addDecisionRule() {
      // 如果没有ruleId，先获取一个新的ruleId
      if (!this.scorecardData.rule.ruleId) {
        try {
          const ruleId = await getRuleSettingId();
          this.scorecardData.rule.ruleId = ruleId;
        } catch (error) {
          console.error('获取规则ID失败:', error);
          this.$message.error('获取规则ID失败');
          return;
        }
      }
      this.ruleEditorDialogVisible = true;
    },

    delDecisionRule() {
      this.$confirm('确定要删除前置规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.scorecardData.rule = {
          ruleTips: null, // 提示
          ruleContent: null, // 规则详情
          ruleDesc: '', // 规则中文描述
          ruleName: null, // 规则名称
          ruleId: null, // 规则id
          predefineText: null, // 预定义文本
          editPredefineText: null, // 编辑预定义文本
          predefine: null // 预定义对象
        };
      }).catch(() => {});
    },

    async addPreRule(ruleContent, ruleDesc, thenList, elseList, predefine) {
      this.scorecardData.rule.ruleContent = JSON.stringify(ruleContent);
      this.scorecardData.rule.ruleDesc = ruleDesc;

      // 将predefine对象保存到组件实例中
      if (predefine) {
        this.predefine = predefine;
        // 设置相关属性
        if (predefine.content) {
          this.scorecardData.rule.predefineText = predefine.content;
          this.scorecardData.rule.editPredefineText = predefine.content;
        }
        // 设置rule.predefine属性
        this.scorecardData.rule.predefine = predefine;
      } else {
        // 如果没有predefine对象，确保相关属性为null
        this.predefine = {};
        this.scorecardData.rule.predefineText = null;
        this.scorecardData.rule.editPredefineText = null;
        this.scorecardData.rule.predefine = null;
      }

      this.ruleEditorDialogVisible = false;

      if (this.predefine && this.predefine.content) {
        const data = {
          bomBaseInfoId: this.predefine.bomBaseInfoId,
          content: this.predefine.content
        };
        try {
          await checkPredefine(data).then(res => {
            // 与决策表保持一致，存储预定义树数据
            this.predefineTreeData = res;
          });
        } catch (error) {
          this.$message.error(error);
        }
      }

      // 只有当predefine对象存在且有content时才调用saveOrUpdatePredefine
      if (this.scorecardData.rule.ruleId && this.predefine && this.predefine.content) {
        const predefineQuery = {
          ruleId: this.scorecardData.rule.ruleId,
          content: this.predefine.content,
          predefineId: this.predefine.predefineId || null,
          bomBaseInfoId: this.bomBaseInfoId
        };
        // 直接调用saveOrUpdatePredefine
        saveOrUpdatePredefine(predefineQuery);
      }
    },

    changeEditPage() {
      // 处理规则编辑页面变化
    },

    // --- BOM 选择器相关方法 ---
    openBomSelector(target) {
      this.currentBomSelectorTarget = target;
      this.selectedBomNode = null;
      this.bomSelectorVisible = true;
    },

    filterBomNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().includes(value.toLowerCase());
    },

    handleBomNodeClick(data) {
      // 检查是否为字段节点
      if (!data.isField) return;
      this.selectedBomNode = data;
    },

    confirmBomSelection() {

      // 如果没有选中节点，直接关闭对话框
      if (!this.selectedBomNode) {
        this.bomSelectorVisible = false;
        return;
      }

      if (this.currentBomSelectorTarget === 'container') {
        // 对于评分容器，检查类型是否为数值类型（不区分大小写）
        const numericTypes = ['Integer', 'Double', 'Float', 'Long', 'BigDecimal', 'int', 'double', 'float', 'long'];
        const nodeType = this.selectedBomNode.type ? this.selectedBomNode.type.toLowerCase() : '';
        const allowedTypes = numericTypes.map(type => type.toLowerCase());

        if (!allowedTypes.includes(nodeType)) {
          this.$message.error('评分容器必须选择数值类型的字段');
          return;
        }

        // 更新数据模型
        this.scorecardData.scoreContainerFieldPath = this.selectedBomNode.fieldPath;
        this.scorecardData.scoreContainerFieldName = this.selectedBomNode.fullLabelPath || this.selectedBomNode.label;
        this.scorecardData.scoreContainerFieldType = this.selectedBomNode.type;
      } else if (this.currentBomSelectorTarget === 'attribute') {
        if (!this.currentEditingGroupId) {
          this.$message.warning('请先选择属性组');
          return;
        }

        const group = this.scorecardData.attributeGroups.find(g => g.scorecardAttributeGroupId === this.currentEditingGroupId);
        if (!group) {
          console.error('Group not found with ID:', this.currentEditingGroupId);
          this.$message.warning('属性组不存在');
          return;
        }

        const newAttribute = {
          scorecardAttributeId: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          attributeFieldPath: this.selectedBomNode.fieldPath,
          attributeFieldName: this.selectedBomNode.fullLabelPath || this.selectedBomNode.label,
          attributeFieldType: this.selectedBomNode.type
        };

        group.attributes.push(newAttribute);

        // 强制刷新表格数据
        this.refreshTableData();
      }

      // 关闭对话框
      this.bomSelectorVisible = false;

      // 显示成功消息
      this.$message.success('字段选择成功');
    },

    // --- 条件编辑相关方法 ---
    openConditionEditor(rowId, groupId, attributeId) {
      const row = this.scorecardData.conditionRows.find(r => r.rowId === rowId);
      if (!row) return;

      const group = this.scorecardData.attributeGroups.find(g => g.scorecardAttributeGroupId === groupId);
      if (!group) return;

      const attribute = group.attributes.find(a => a.scorecardAttributeId === attributeId);
      if (!attribute || !attribute.attributeFieldPath) {
        this.$message.warning('请先选择属性');
        return;
      }

      const condition = row.conditions.find(c => c.scorecardAttributeGroupId === groupId);
      if (!condition) return;

      this.currentEditingRowId = rowId;
      this.currentEditingGroupId = groupId;
      this.currentEditingAttributeId = attributeId;
      this.currentEditingConditionId = condition.scorecardConditionId;

      this.currentEditingCondition = JSON.parse(JSON.stringify(condition || {}));
      this.currentEditingAttributeType = attribute.attributeFieldType;
      this.conditionEditorVisible = true;
    },

    handleConditionSubmit(newCondition) {
      const row = this.scorecardData.conditionRows.find(r => r.rowId === this.currentEditingRowId);
      if (!row) return;

      const conditionIndex = row.conditions.findIndex(c => c.scorecardConditionId === this.currentEditingConditionId);
      if (conditionIndex === -1) return;

      row.conditions.splice(conditionIndex, 1, {
        ...row.conditions[conditionIndex],
        conditionOperator: newCondition.conditionOperator,
        conditionValue: newCondition.conditionValue,
        conditionDescription: newCondition.conditionDescription
      });

      // 强制刷新表格数据
      this.refreshTableData();

      this.currentEditingRowId = '';
      this.currentEditingGroupId = '';
      this.currentEditingAttributeId = '';
      this.currentEditingConditionId = '';
      this.currentEditingCondition = null;
      this.currentEditingAttributeType = '';
    },

    // --- 属性组管理方法 ---
    addGroup(groupName) {
      // 使用临时ID，后端会生成正式UUID
      const newGroupId = 'group_' + Date.now();

      // 计算新属性组的顺序
      const groupOrder = this.scorecardData.attributeGroups.length + 1;

      this.scorecardData.attributeGroups.push({
        scorecardAttributeGroupId: newGroupId,
        groupName: groupName,
        groupOrder: groupOrder, // 设置属性组顺序
        attributes: [] // 初始化为空数组，不预创建属性
      });

      // 对每一行条件添加新属性组的条件
      if (this.scorecardData.conditionRows && this.scorecardData.conditionRows.length > 0) {
        this.scorecardData.conditionRows.forEach(row => {
          row.conditions.push({
            scorecardAttributeGroupId: newGroupId,
            scorecardAttributeId: '',
            scorecardConditionId: 'cond_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), // 使用临时ID
            conditionOperator: '',
            conditionValue: '',
            conditionDescription: '点击编辑条件'
          });
        });
      }
    },

    renameGroup(groupId, newName) {
      const group = this.scorecardData.attributeGroups.find(g => g.scorecardAttributeGroupId === groupId);
      if (group) {
        group.groupName = newName;
      }
    },

    deleteGroup(groupId) {
      const index = this.scorecardData.attributeGroups.findIndex(g => g.scorecardAttributeGroupId === groupId);
      if (index === -1) return;

      this.scorecardData.attributeGroups.splice(index, 1);

      // 从每一行条件中删除该属性组的条件
      this.scorecardData.conditionRows.forEach(row => {
        const condIndex = row.conditions.findIndex(c => c.scorecardAttributeGroupId === groupId);
        if (condIndex !== -1) {
          row.conditions.splice(condIndex, 1);
        }
      });

      // 更新当前激活的属性组索引
      if (this.activeGroupIndex >= this.scorecardData.attributeGroups.length) {
        this.activeGroupIndex = Math.max(0, this.scorecardData.attributeGroups.length - 1);
      }
    },

    scrollToGroup(groupId, index) {
      this.activeGroupIndex = index;
    },



    // 处理属性添加
    handleAttributeAdded(attributeData) {
      // 查找属性组
      const group = this.scorecardData.attributeGroups.find(g => g.scorecardAttributeGroupId === attributeData.scorecardAttributeGroupId);
      if (!group) {
        this.$message.warning('属性组不存在');
        return;
      }

      // 添加属性
      const newAttribute = {
        scorecardAttributeId: attributeData.scorecardAttributeId,
        attributeFieldPath: attributeData.attributeFieldPath,
        attributeFieldName: attributeData.attributeFieldName,
        attributeFieldType: attributeData.attributeFieldType,
        attributeOrder: group.attributes ? group.attributes.length + 1 : 1, // 设置属性顺序
        attributeName: attributeData.attributeFieldName.split(' 的 ').pop() || attributeData.attributeFieldName // 使用字段名称的最后一部分作为属性名称
      };

      // 确保属性组有attributes属性
      if (!group.attributes) {
        this.$set(group, 'attributes', []);
      }

      // 检查属性是否已存在
      const existingAttribute = group.attributes.find(attr => attr.scorecardAttributeId === attributeData.scorecardAttributeId);
      if (existingAttribute) {
        this.$message.warning('属性已存在');
        return;
      }

      // 直接添加属性
      group.attributes.push(newAttribute);

      // 如果没有条件行，创建一个新的条件行
      if (!this.scorecardData.conditionRows || this.scorecardData.conditionRows.length === 0) {
        this.addDefaultConditionRow();
      }

      // 处理条件行
      if (attributeData.rowId) {
        // 如果有指定的行 ID，说明是在特定行上添加属性
        const row = this.scorecardData.conditionRows.find(r => r.rowId === attributeData.rowId);
        if (row) {
          // 查找该行中该属性组的条件
          let condition = row.conditions.find(c => c.scorecardAttributeGroupId === group.scorecardAttributeGroupId);

          // 如果没有找到条件，则创建一个新的条件
          if (!condition) {
            condition = {
              scorecardAttributeGroupId: group.scorecardAttributeGroupId,
              scorecardAttributeId: '',
              scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              conditionOperator: '',
              conditionValue: '',
              conditionDescription: '点击编辑条件',
              conditionOrder: 1 // 设置条件顺序号
            };
            row.conditions.push(condition);
          }

          // 设置属性ID
          condition.scorecardAttributeId = attributeData.scorecardAttributeId;
        }
      } else {
        // 如果没有指定行 ID，创建一个新行
        // 创建新行的条件
        const newConditions = [];

        // 为每个属性组创建条件
        this.scorecardData.attributeGroups.forEach(g => {
          const condition = {
            scorecardAttributeGroupId: g.scorecardAttributeGroupId,
            scorecardAttributeId: g.scorecardAttributeGroupId === group.scorecardAttributeGroupId ? attributeData.scorecardAttributeId : '',
            scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conditionOperator: '',
            conditionValue: '',
            conditionDescription: '点击编辑条件',
            conditionOrder: 1 // 设置条件顺序号
          };
          newConditions.push(condition);
        });

        // 创建新行
        const newRowId = `row_${Date.now()}`;
        const newRow = {
          rowId: newRowId,
          conditions: newConditions,
          weight: 0,
          scoreValue: 0
        };

        // 添加新行
        this.scorecardData.conditionRows.push(newRow);
      }

      // 强制刷新表格数据
      this.refreshTableData();

      // 强制更新视图
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },



    // 强制刷新表格数据
    refreshTableData() {
      // 创建原始数据的深拷贝，确保不会修改原始数据
      const scorecardDataCopy = JSON.parse(JSON.stringify(this.scorecardData));

      // 重新生成表格数据
      this.tableData = generateTableData(scorecardDataCopy);

      // 确保权重和分值与原始数据一致
      this.tableData.forEach(row => {
        const originalRow = this.scorecardData.conditionRows.find(r => r.rowId === row.rowId);
        if (originalRow) {
          row.weight = originalRow.weight;
          row.scoreValue = originalRow.scoreValue;
        }
      });

      // 更新 tableKey，强制重新渲染表格
      this.tableKey += 1;

      // 强制更新视图
      this.$nextTick(() => {
        if (this.$refs.scorecardForm) {
          this.$refs.scorecardForm.$forceUpdate();
        }
        this.$forceUpdate();
      });
    },

    // 添加默认条件行
    addDefaultConditionRow() {
      const newRowId = `row_${Date.now()}`;
      const newConditions = [];

      // 为每个属性组创建条件
      this.scorecardData.attributeGroups.forEach(group => {
        newConditions.push({
          scorecardAttributeGroupId: group.scorecardAttributeGroupId,
          scorecardAttributeId: '',
          scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conditionOperator: '',
          conditionValue: '',
          conditionDescription: '点击编辑条件',
          conditionOrder: 1 // 默认条件行的顺序号设置为1
        });
      });

      // 添加新的条件行
      this.scorecardData.conditionRows.push({
        rowId: newRowId,
        conditions: newConditions,
        weight: 0,
        scoreValue: 0
      });
    },

    // --- 条件行操作 ---
    addConditionRow(rowId) {
      if (this.scorecardData.attributeGroups.length === 0) {
        this.$message.warning('请先添加属性组');
        return;
      }

      // 如果提供了rowId，则为指定行添加条件行
      if (rowId) {
        // 查找现有行
        const existingRow = this.scorecardData.conditionRows.find(r => r.rowId === rowId);
        if (!existingRow) {
          console.error('Row not found with ID:', rowId);
          return;
        }

        // 复制现有行的条件，使用相同的属性ID，但生成新的conditionId
        const newConditions = existingRow.conditions.map(condition => ({
          scorecardAttributeGroupId: condition.scorecardAttributeGroupId,
          scorecardAttributeId: condition.scorecardAttributeId, // 保持相同的属性ID
          scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conditionOperator: '',
          conditionValue: '',
          conditionDescription: '点击编辑条件',
          conditionOrder: this.scorecardData.conditionRows.length + 1 // 明确设置条件顺序号
        }));

        // 创建新行，使用默认的权重和分值
        const newRowId = `row_${Date.now()}`;
        const newRow = {
          rowId: newRowId,
          conditions: newConditions,
          weight: 0, // 新行使用默认权重
          scoreValue: 0 // 新行使用默认分值
        };

        // 在现有行后面插入新行
        const existingRowIndex = this.scorecardData.conditionRows.findIndex(r => r.rowId === rowId);
        this.scorecardData.conditionRows.splice(existingRowIndex + 1, 0, newRow);

        // 强制刷新表格数据
        this.refreshTableData();

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate();
        });

        this.$message.success('条件行添加成功');
        return;
      }

      // 如果没有提供行ID，则创建新行
      const newRowId = `row_${Date.now()}`;
      const newConditions = [];

      this.scorecardData.attributeGroups.forEach(group => {
        // 不设置默认属性ID，避免表格错乱
        newConditions.push({
          scorecardAttributeGroupId: group.scorecardAttributeGroupId,
          scorecardAttributeId: '', // 初始化为空，而不是使用默认属性ID
          scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conditionOperator: '',
          conditionValue: '',
          conditionDescription: '点击编辑条件',
          conditionOrder: this.scorecardData.conditionRows.length + 1 // 明确设置条件顺序号
        });
      });

      this.scorecardData.conditionRows.push({
        rowId: newRowId,
        conditions: newConditions,
        weight: 0,
        scoreValue: 0
      });

      // 强制刷新表格数据
      this.refreshTableData();

      // 强制更新视图
      this.$nextTick(() => {
        this.$forceUpdate();
      });

      this.$message.success('条件行添加成功');
    },

    deleteRow(rowId) {
      const index = this.scorecardData.conditionRows.findIndex(r => r.rowId === rowId);
      if (index !== -1) {
        this.scorecardData.conditionRows.splice(index, 1);

        // 强制刷新表格数据
        this.refreshTableData();

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate();
        });

        this.$message.success('条件行删除成功');
      }
    },

    handleAttributeChange(rowId, groupId, attributeId) {
      // 查找属性组
      const group = this.scorecardData.attributeGroups.find(g => g.scorecardAttributeGroupId === groupId);
      if (!group) {
        console.error('Group not found with ID:', groupId);
        return;
      }

      // 查找属性
      const attribute = group.attributes.find(attr => attr.scorecardAttributeId === attributeId);
      if (!attribute) {
        console.error('Attribute not found with ID:', attributeId);
        return;
      }

      // 查找行
      const row = this.scorecardData.conditionRows.find(r => r.rowId === rowId);
      if (!row) {
        console.error('Row not found with ID:', rowId);
        return;
      }

      // 查找条件
      const condition = row.conditions.find(c => c.scorecardAttributeGroupId === groupId);
      if (!condition) {
        console.error('Condition not found for group:', groupId);
        return;
      }

      // 更新条件的属性ID
      condition.scorecardAttributeId = attributeId;
      condition.conditionOperator = '';
      condition.conditionValue = '';
      condition.conditionDescription = '点击编辑条件';

      // 强制刷新表格数据
      this.refreshTableData();

      // 强制更新视图
      this.$nextTick(() => {
        if (this.$refs.scorecardForm) {
          this.$refs.scorecardForm.$forceUpdate();
        }
        this.$forceUpdate();
      });
    },

    // 处理权重变更
    handleWeightChange(rowId, weight) {
      // 直接查找行并更新权重
      const row = this.scorecardData.conditionRows.find(r => r.rowId === rowId);
      if (!row) return;

      // 使用 Vue.set 确保响应式更新
      this.$set(row, 'weight', weight);
    },

    // 处理分值变更
    handleScoreChange(rowId, score) {
      // 直接查找行并更新分值
      const row = this.scorecardData.conditionRows.find(r => r.rowId === rowId);
      if (!row) return;

      // 使用 Vue.set 确保响应式更新
      this.$set(row, 'scoreValue', score);
    },



    // --- 保存与取消 ---
    saveScorecard() {
      // 验证表单
      this.$refs.scorecardForm.validate(valid => {
        if (valid) {
          // 验证评分容器已由表单验证完成

          // 验证属性组
          if (!this.scorecardData.attributeGroups || this.scorecardData.attributeGroups.length === 0) {
            this.$message.warning('请添加至少一个属性组');
            return false;
          }

          // 验证每个属性组是否有属性
          for (const group of this.scorecardData.attributeGroups) {
            if (!group.attributes || group.attributes.length === 0) {
              this.$message.warning(`属性组 "${group.groupName}" 没有属性，请添加属性`);
              return false;
            }
          }

          // 验证条件行
          if (!this.scorecardData.conditionRows || this.scorecardData.conditionRows.length === 0) {
            this.$message.warning('请添加至少一个条件行');
            return false;
          }

          // 验证每个条件行是否有有效的条件
          for (const row of this.scorecardData.conditionRows) {
            if (!row.conditions || row.conditions.length === 0) {
              this.$message.warning('有条件行没有条件，请添加条件');
              return false;
            }

            // 检查每个条件是否有属性ID和条件值
            for (const condition of row.conditions) {
              // 检查属性ID
              if (!condition.scorecardAttributeId) {
                this.$message.warning('有条件没有关联属性，请选择属性');
                return false;
              }

              // 检查操作符
              if (!condition.conditionOperator) {
                this.$message.warning('有条件没有设置操作符，请编辑条件');
                return false;
              }

              // 如果操作符不是 IS NULL 或 IS NOT NULL，则需要检查值
              if (condition.conditionOperator !== 'IS NULL' && condition.conditionOperator !== 'IS_NULL' &&
                  condition.conditionOperator !== 'IS NOT NULL' && condition.conditionOperator !== 'IS_NOT_NULL') {
                if (!condition.conditionValue && condition.conditionValue !== 0) {
                  this.$message.warning('有条件没有设置值，请编辑条件');
                  return false;
                }
              }
            }
          }

          // 显示加载中
          this.loading = true;

          // 格式化数据用于提交
          const payload = formatScorecardForSubmission(this.scorecardData);

          // 动态导入API模块
          import('@/api/mainPages/scorecard').then(api => {

            // 调用保存API
            api.saveScorecard(payload).then(res => {

              // 如果是新增，更新ID
              if (!this.scorecardData.scorecardInfoId && res.data) {
                this.scorecardData.scorecardInfoId = res.data;
              }

              // 关闭加载中状态
              this.loading = false;

              // 显示成功消息
              this.$message.success('评分卡保存成功');

              // 触发成功事件
              this.$emit('addSuccess', res.data || payload.scorecardName);

              // 关闭对话框
              this.handleClose();
            }).catch(err => {
              // 处理错误
              this.loading = false;

              // 输出详细错误信息
              console.error('保存评分卡失败:', err);
              console.error('错误详情:', err.response ? err.response.data : err);

              // 显示错误消息
              let errorMsg = '保存失败';
              if (err.response && err.response.data && err.response.data.message) {
                errorMsg = err.response.data.message;
              } else if (err.message) {
                errorMsg = err.message;
              }

              this.$message.error(errorMsg);
            });
          }).catch(err => {
            this.loading = false;
            console.error('加载API模块失败:', err);
            this.$message.error('加载API模块失败');
          });
        } else {
          // 表单验证失败
          this.$message.warning('请检查评分卡名称和评分容器字段是否已填写');
          return false;
        }
      });
    },

    handleClose() {
      this.dialogVisible = false;
      this.$emit('update:visible', false);
      this.$emit('close');
    },

    onDialogClosed() {
      this.scorecardData = this.initScorecardData();
    }
  }
};
</script>

<style lang="scss">
.scorecard-editor-dialog {
  .el-dialog__body {
    padding: 10px 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.scorecard-editor-container {
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

  .add-decision-table-item {
    margin-bottom: 20px;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;

      &.required:after {
        content: '*';
        color: #f56c6c;
        margin-left: 4px;
      }
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
}

.bom-selector-dialog {
  .custom-tree-node {
    .field-type {
      color: #909399;
      font-size: 12px;
      margin-left: 4px;
    }

    .is-field {
      color: #409eff;
    }
  }
}
</style>
