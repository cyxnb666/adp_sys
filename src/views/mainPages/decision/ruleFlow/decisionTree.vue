<template>
  <div class="decisionTreeDiv">
    <div class="app-container">
      <el-card class="mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <span> 决策树设置 </span>
          <div class="contentBtnDiv">
            <el-button type="info" size="mini" @click="returnList">
              返回决策树列表
            </el-button>
            <el-button v-show="!isApprovel" type="primary" size="mini" @click="saveTree">
              保存决策树
            </el-button>
          </div>
        </div>
        <div class="content">
          <div id="container" ref="container" class="decisionTreeDivContainer">
            <div id="treeContainer" ref="graphContainer" class="graph-container" style="position: relative;" />
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="选择规则" class="chooseRuleDialog" :visible.sync="chooseRuleDialog">
      <ruleTree ref="ruleTree" :single-choice="true" :rule-results-f="RuleResults" :node="{'type':'node'}" :checked-tables-f="checkedTables" :checked-nodes-f="checkedNodes" :tree-data="treeDataArry" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseRuleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseRule">确 定</el-button>
      </div>
    </el-dialog>
    <div class="rightDiv">
      <div v-show="isApprovel" class="approvelDiv">
        <el-button type="primary" size="mini" @click="approveClick(1)">审批通过</el-button>
        <el-button type="danger" size="mini" @click="approveClick(0)">审批不通过</el-button>
      </div>
      <div v-show="!activeNode" class="treeNameDiv">
        决策树名称 <el-input v-model="treeName" :disabled="isApprovel" placeholder="请输入决策树名称" />
      </div>
      <el-button v-show="activeNode && !isApprovel" id="delButton" type="danger" size="mini">删除节点</el-button>
      <div v-if="activeNode && activeNode.shape === 'TREE_RULE'" class="bomTextDiv">
        <span class="title">规则选择</span>
        <div v-show="!isApprovel" class="btnDiv">
          <el-button v-show="activeNode && activeNode.shape === 'TREE_RULE'" type="primary" size="mini" @click="chooseRule">选择规则</el-button>
          <!-- <el-button v-show="activeNode && activeNode.shape === 'TREE_RULE'" class="delButton" type="danger" size="mini" @click="delNode">删除节点</el-button> -->
        </div>
      </div>
      <div v-if="activeNode && activeNode.shape === 'TREE_DECIDE'" class="bomTextDiv">
        <span class="title">字段选择</span>
        <div v-show="!isApprovel" class="btnDiv">
          <el-button v-show="activeNode && activeNode.shape === 'TREE_DECIDE'" type="primary" size="mini" @click="chooseBom">选择字段</el-button>
        </div>
        <div class="divLine">
          <div>
            {{ '字段名称：' }} <span class="textSpan">{{ activeNode.label || '未选择' }}</span>
          </div>
          <div>
            {{ '字段类型：' }} <span class="textSpan">{{ activeNode.data.treeFieldType || '未选择' }}</span>
          </div>
        </div>
      </div>
      <el-table
        v-show="activeNode && activeNode.shape === 'TREE_RULE'"
        :data="chooseRuleData"
        border
        style="width: 100%"
        max-height="625"
      >
        <el-table-column
          prop="date"
          label="已选规则"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.decisionTablePath">
              {{ scope.row.decisionTablePath + '/' + scope.row.decisionTableName }}
            </span>
            <span v-else>
              {{ scope.row.path + '/' + scope.row.ruleName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button v-show="scope.row.ruleId && !isApprovel" type="text" size="mini" @click="editRule(scope.row, scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="activeNode && activeNode.shape === 'mindmap-edge'" class="formulaDiv">
        <span class="title">分支条件</span>
        <el-form ref="ruleForm" :disabled="isApprovel" :model="ruleForm" :rules="rules" label-width="0px" class="demo-ruleForm">
          <el-form-item label="" prop="expressionLabel">
            <el-select v-model="ruleForm.expressionLabel" placeholder="请选择" @change="expressionLabelChange">
              <el-option
                v-for="item in retrunExpression(activeEdgeSourceNode.data.treeFieldType)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="!(ruleForm.expressionLabel === 'IS_TRUE' ||
              ruleForm.expressionLabel === 'IS_FALSE' ||
              ruleForm.expressionLabel === 'IS_NULL' ||
              ruleForm.expressionLabel === 'IS_NOT_NULL')"
            label=""
            prop="expressionValue"
            :rules="
              (ruleForm.expressionLabel === 'IS_TRUE' ||
                ruleForm.expressionLabel === 'IS_FALSE' ||
                ruleForm.expressionLabel === 'IS_NULL' ||
                ruleForm.expressionLabel === 'IS_NOT_NULL')
                ? { required: false }
                : { required: true, message: '请完善分支条件' }
            "
          >
            <el-input
              v-model="ruleForm.expressionValue"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
        <el-button v-show="!isApprovel" type="primary" size="small" @click="saveDecide">确定</el-button>
      </div>
    </div>
    <el-dialog title="选择字段" class="chooseRuleDialog" :visible.sync="bomTreeDataDialog">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="bomTree"
        :default-expand-all="false"
        :default-expanded-keys="[bomTreeData && bomTreeData[0].children[0].fieldId]"
        :data="bomTreeData"
        show-checkbox
        node-key="fieldId"
        :props="defaultProps"
        @check-change="changeBom"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="bomTreeDataDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseBom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="规则编辑" class="WriteRuleDialog" :visible.sync="editRuleDialog">
      <!-- 规则展示部分 -->
      <EditRule v-if="editRuleDialog" ref="editRuleForm" :tree-data="bomTreeData" :rule-results-list="RuleResults" @saveNodeRule="saveNodeRule" @cancelDiag="editRuleDialog = false" />
    </el-dialog>
  </div>
</template>
<script>
// import treeJs from './editor/components/tree/tree.js'
import ruleTree from '@/components/ruleTreeChoose/index'
import EditRule from './editor/components/writeRule/index'
import { decisionTreeSaveOrUpdate, decisionTreeApprovalDecisionTree } from '@/api/mainPages/decisionTree.js'
import { approvalDecisionTreeInDecUrl } from '@/api/mainPages/decision-table.js'
import { getRuleResults, getDecisionRepositoryDetail } from '@/api/mainPages/decision'
import { Graph, Path } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import Hierarchy from '@antv/hierarchy'
import insertCss from 'insert-css'
import branch from './editor/assets/icons/branch.png'
import rule from './editor/assets/icons/rule.png'
import { bomClassAndField, getbomClassAndUpdateTime } from '@/api/systemManage/bom'
import Bus from '@/utils/bus'

/* TODO: 流程图的展示模式是否直接使用dagre来进行自动布局？
*/

export default {
  components: {
    ruleTree,
    EditRule
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    treeDataList: {
      type: Object,
      default: null
    },
    nodeId: {
      type: String,
      default: ''
    },
    isApprovel: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    decisionUrlId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeSettingId: '',
      treeName: '',
      ruleForm: {
        expressionLabel: '',
        expressionValue: ''
      },
      rules: {
        expressionLabel: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        expressionValue: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      treeDataAdd: {
        id: '1',
        treeType: 'TREE_DECIDE', // 条件节点
        treeName: '',
        treeSettingId: '',
        treeFieldType: '',
        treeLabel: '点击选择字段新建决策树',
        decide: {
          operator: '',
          paramValue: ''// 判断条件
        },
        width: 160,
        height: 50,
        children: []
      },
      applicationId: this.$store.state.app.applicationId,
      checkedNodes: [],
      checkedTables: [],
      treeDataArry: [],
      chooseRuleDialog: false,
      bomTreeData: null,
      RuleResults: [],
      chooseRuleData: [],
      changeField: '',
      bomTreeDataDialog: false,
      editRuleDialog: false,
      filterText: '',
      activeNode: null,
      chooseBomData: null,
      activeEdgeSourceNode: null,
      activeEdgeTargetNode: null,
      expressionLabel: '',
      expressionValue: '',
      dimSettingsVal: null,
      graph: null,
      dimViewModel: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.bomTree.filter(val)
    },
    dimSettings(val) {
      this.dimSettingsVal = val
    },
    treeDataList(val) {
      this.treeData = val
    }
  },
  created() {
    this.dimSettingsVal = this.dimSettings
    let changeDimSettings = []
    Bus.$on('ComponentDimensionChange', (data) => { changeDimSettings = data })
    if (changeDimSettings.length > 0) { this.dimSettingsVal = changeDimSettings }
  },
  async mounted() {
    this.getDecisionRepositoryDetail()
    this.getRuleResults()
    this.bomClassAndField()
  },
  methods: {
    addTreeData() {
      this.treeData = this.treeDataAdd
      this.init()
    },
    // 审批
    approveClick(num) {
      if (this.type === 'descisionTree') {
        const resData = {
          approvalStatus: num,
          decisionUrlId: this.decisionUrlId,
          treeSettingId: this.treeSettingId
        }
        approvalDecisionTreeInDecUrl(resData).then(res => {
          this.$message({ type: 'success', message: '审批成功' })
          this.$emit('toggleComponent', 'decisionTreeList')
        })
      } else {
        decisionTreeApprovalDecisionTree({
          treeSettingId: this.treeSettingId,
          approvalStatus: num
        }).then(res => {
          this.$message({
            type: 'success',
            message: '审批成功'
          })
          this.$emit('toggleComponent', 'decisionTreeList')
        })
      }
    },
    // 表达式改变
    expressionLabelChange(expressionLabel) {
      if (expressionLabel === 'true' ||
            expressionLabel === 'false' ||
            expressionLabel === 'IS_NULL' ||
            expressionLabel === 'IS_NOT_NULL') {
        this.ruleForm.expressionValue = ''
      }
    },
    loadTreeData(res) {
      if (res.decisionTreeNodeDTO) {
        this.treeData = res.decisionTreeNodeDTO
        this.treeSettingId = res.treeSettingId
        this.treeName = res.treeName
      } else {
        this.treeData = this.treeDataAdd
      }
      this.$nextTick(() => {
        // 清空画布
        this.graph && this.graph.clearCells()
        this.init()
      })
    },
    returnList() {
      this.$emit('toggleComponent', 'decisionTreeList')
    },
    saveTree() {
      const treeData = this.getTreeData()
      if (!treeData) return
      if (!this.treeName) {
        this.activeNode = null
        this.$message({
          type: 'warning',
          message: '请填写决策树名称'
        })
        return
      }
      this.dimViewModel = {
        applicationId: this.applicationId,
        processNodeId: this.nodeId,
        dimSettings: this.dimSettingsVal
      }
      const formData = {
        applicationId: this.applicationId,
        decisionTreeNodeDTO: treeData,
        dimView: this.dimViewModel,
        treeSettingId: this.treeSettingId,
        treeName: this.treeName,
        approvalStatus: '',
        treeStatus: this.treeSettingId ? '0' : '1'
      }

      if (this.type === 'decisionTree') { // 决策路径下新增决策树
        const params = {
          decisionUrlId: this.decisionUrlId,
          decisionTreeDTO: formData
        }
        return this.$emit('saveOrUpdateTreeInDecUrl', params)
      }

      decisionTreeSaveOrUpdate(formData).then(res => {
        this.$emit('toggleComponent', 'decisionTreeList')
      })
    },
    returnLabel(data) {
      const list = [
        {
          label: '等于',
          value: 'EQ'
        },
        {
          label: '不等于',
          value: 'NE'
        },
        {
          label: '小于',
          value: 'LT'
        },
        {
          label: '大于',
          value: 'GT'
        },
        {
          label: '大于等于',
          value: 'GE'
        },
        {
          label: '为空',
          value: 'IS_NULL'
        },
        {
          label: '不为空',
          value: 'IS_NOT_NULL'
        },
        {
          label: '为true',
          value: 'IS_TRUE'
        },
        {
          label: '为false',
          value: 'IS_FALSE'
        }
      ]
      const value = []
      list.map(res => {
        if (res.value === data) {
          value.push(res)
        }
      })
      return value
    },
    // 返回下拉类型
    retrunExpression(type) {
      let list = []
      switch (type) {
        case 'double':
        case 'float':
        case 'BigDecimal':
        case 'long':
          list = [
            {
              label: '等于',
              value: 'EQ'
            },
            {
              label: '不等于',
              value: 'NE'
            },
            {
              label: '小于',
              value: 'LT'
            },
            {
              label: '大于',
              value: 'GT'
            },
            {
              label: '大于等于',
              value: 'GE'
            },
            {
              label: '为空',
              value: 'IS_NULL'
            },
            {
              label: '不为空',
              value: 'IS_NOT_NULL'
            }
          ]
          break
        case 'string':
          list = [
            {
              label: '等于',
              value: 'EQ'
            },
            {
              label: '不等于',
              value: 'NE'
            },
            {
              label: '为空',
              value: 'IS_NULL'
            },
            {
              label: '不为空',
              value: 'IS_NOT_NULL'
            }
          ]
          break
        case 'object':
          list = [
            {
              label: '为空',
              value: 'IS_NULL'
            },
            {
              label: '不为空',
              value: 'IS_NOT_NULL'
            }
          ]
          break
        case 'boolean':
          list = [
            {
              label: '为true',
              value: 'IS_TRUE'
            },
            {
              label: '为false',
              value: 'IS_FALSE'
            }
          ]
          break
        default:
          list = []
          break
      }
      return list
    },
    // 点击dom节点选择规则后保存
    saveChooseRule() {
      this.chooseRuleData = [...this.$refs.ruleTree.checkedNodes, ...this.$refs.ruleTree.checkedTables]
      this.chooseRuleDialog = false
      let label = ''
      if (this.chooseRuleData.length > 0) {
        label += '◆ ' + (this.chooseRuleData[0].ruleName ? this.chooseRuleData[0].ruleName : this.chooseRuleData[0].decisionTableName)
        if (this.chooseRuleData.length > 1) {
          label += '\n' + '…等' + this.chooseRuleData.length + '个规则'
        }
        // label = this.chooseRuleData[0].ruleName ? this.chooseRuleData[0].ruleName : this.chooseRuleData[0].decisionTableName
      }
      this.activeNode.setLabel(label)
      const item = this.activeNode.getData()
      this.activeNode.replaceData({
        ...item,
        definedRuleDTOS: this.$refs.ruleTree.checkedNodes,
        tableDTOS: this.$refs.ruleTree.checkedTables
      })
    },
    findItem(obj, id) {
      if (obj.id === id) {
        return {
          parent: null,
          node: obj
        }
      }
      const { children } = obj
      if (children) {
        for (let i = 0, len = children.length; i < len; i += 1) {
          const res = this.findItem(children[i], id)
          if (res) {
            return {
              parent: res.parent || obj,
              node: res.node
            }
          }
        }
      }
      return null
    },
    // 编辑规则点击保存
    saveNodeRule(data) {
      this.chooseRuleData = data
      const item = this.activeNode.getData()
      this.activeNode.replaceData({
        ...item,
        definedRuleDTOS: data
      })
    },
    // 点击列表编辑 node：节点数据
    editRule(item) {
      this.editRuleDialog = true
      this.$nextTick(() => {
        // this.$refs.editRuleForm.getRuleDefinedDetail(ruleId, index)
        this.$refs.editRuleForm.getRuleDefinedDetail1(item, 0)
      })
    },
    // 选择字段保存
    saveChooseBom() {
      this.chooseBomData = this.$refs.bomTree.getCheckedNodes()
      this.bomTreeDataDialog = false
      const item = this.activeNode.getData()
      this.activeNode.replaceData({
        ...item,
        treeLabel: this.chooseBomData[0].label,
        treePath: this.chooseBomData[0].fieldPath,
        treeFieldType: this.chooseBomData[0].type,
        classPath: this.chooseBomData[0].classPath,
        field: this.chooseBomData[0].field
        // bomObj: this.chooseBomData[0]
      })
      this.activeNode.setLabel(this.chooseBomData[0].label, { silent: false })
    },
    changeBom(data, isCheck) {
      if (isCheck) {
        this.$refs.bomTree.setCheckedKeys([data.fieldId])
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    chooseRule() {
      this.chooseRuleDialog = true
      this.$nextTick(() => {
        this.$refs.ruleTree.checkTreeNode([...this.checkedTables, ...this.checkedNodes])
      })
    },
    chooseBom() {
      this.bomTreeDataDialog = true
    },
    // 根据bomBaseInfoId加载所有类和字段
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(async res => {
        this.bomTreeData = [res]
        const data1 = res
        const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
        await this.$forage.setItem('bomBaseInfoId', data1)
        await this.$forage.setItem('bomBaseInfoId_Time', res1.updatedDate)
      })
    },
    // 根据时间判断得到的是否是最新的数据
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = await this.$forage.getItem('bomBaseInfoId_Time')
      if (res1.updatedDate === time) {
        const storedData = await this.$forage.getItem('bomBaseInfoId')
        this.bomTreeData = [storedData]
      } else {
        this.bomClassAndField()
      }
    },
    // 查询决策库信息，包含决策库基本信息、关联规则信息等
    async getDecisionRepositoryDetail() {
      await getDecisionRepositoryDetail(this.$store.state.app.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeDataArry = decisionRepositoryModel.catalogueList
        }
      })
      return Promise.resolve()
    },
    // 获取规则执行不通过结果定义列表
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
        // this.RuleResults.forEach((item, index) => {
        //   this.RuleResultsList[item.resultCode] = (item.resultName)
        // })
      })
    },
    init() {
      // 中心主题或分支主题
      Graph.registerNode(
        'TREE_DECIDE',
        {
          inherit: 'rect',
          markup: [
            {
              tagName: 'rect',
              selector: 'body'
            },
            {
              tagName: 'image',
              selector: 'img'
            },
            {
              tagName: 'image',
              selector: 'imgBranch'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              rx: 6,
              ry: 6,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              event: 'branch:click',
              strokeWidth: 1
            },
            img: {
              ref: 'body',
              refX: '100%',
              refY: '30%',
              refY2: -8,
              width: 16,
              height: 16,
              'xlink:href': branch,
              event: 'add:topic',
              class: 'topic-image'
            },
            imgBranch: {
              ref: 'body',
              refX: '100%',
              refY: '70%',
              refY2: -8,
              width: 16,
              height: 16,
              'xlink:href': rule,
              event: 'addBranch:topic',
              class: 'topic-image'
            },
            label: {
              fontSize: 14,
              event: 'branch:click',
              fill: '#262626'
            }
          }
        },
        true
      )

      // 子主题
      Graph.registerNode(
        'TREE_RULE',
        {
          inherit: 'rect',
          markup: [
            {
              tagName: 'rect',
              selector: 'body'
            },
            {
              tagName: 'text',
              selector: 'label'
            },
            {
              tagName: 'text',
              selector: 'title'
            },
            {
              tagName: 'path',
              selector: 'line'
            }
          ],
          attrs: {
            body: {
              fill: '#ffffff',
              strokeWidth: 0,
              event: 'rule:click',
              stroke: '#5F95FF'
            },
            title: {
              text: '规则',
              refX: 20,
              refY: 8,
              fontSize: 12,
              color: '#0079FF',
              event: 'rule:click',
              fill: '#0079FF',
              'text-anchor': 'start'
            },
            label: {
              fontSize: 14,
              refX: 20,
              refY: 25,
              fill: '#262626',
              event: 'rule:click',
              textVerticalAnchor: 'top'
            },
            line: {
              stroke: '#5F95FF',
              strokeWidth: 2,
              event: 'rule:click',
              d: 'M 0 15 L 60 15'
            }
          }
        },
        true
      )

      // 连接器
      Graph.registerConnector(
        'mindmap',
        (sourcePoint, targetPoint, routerPoints, options) => {
          const midX = sourcePoint.x + -30
          const midY = sourcePoint.y + 20
          const ctrX = (targetPoint.x - midX) / 1 + midX
          const ctrY = targetPoint.y
          const pathData = `
          M ${sourcePoint.x} ${sourcePoint.y}
          L ${midX} ${midY}
          Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}`
          return options.raw ? Path.parse(pathData) : pathData
        },
        true
      )

      // 边
      Graph.registerEdge(
        'mindmap-edge',
        {
          inherit: 'edge',
          event: 'edge:click',
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: ''
            }
          },
          zIndex: 0
        },
        true
      )

      this.graph = new Graph({
        container: document.getElementById('container'),
        panning: true,
        connecting: {
          connectionPoint: 'anchor'
        },
        mousewheel: { enabled: true }
      })

      this.graph.use(new Selection())
      this.graph.use(new Keyboard())

      const render = () => {
        const result = Hierarchy.compactBox(this.treeData, {
          direction: 'V',
          getHeight(d) {
            return d.height
          },
          getWidth(d) {
            return d.width
          },
          getHGap() {
            return 60
          },
          getVGap() {
            return 40
          },
          getSide: () => {
            return 'right'
          }
        })
        const cells = []
        const traverse = (hierarchyItem) => {
          if (hierarchyItem) {
            const { data, children } = hierarchyItem
            let label = ''
            if (data.treeType === 'TREE_DECIDE') {
              label = data.treeLabel
            } else {
              const list = [...data.definedRuleDTOS || [], ...data.tableDTOS || []]
              if (list.length > 0) {
                label += '◆ ' + (list[0].ruleName ? list[0].ruleName : list[0].decisionTableName)
                if (list.length > 1) {
                  label += '\n' + '…等' + list.length + '个规则'
                }
              }
            }
            cells.push(
              this.graph.createNode({
                id: data.id,
                shape: data.treeType,
                x: hierarchyItem.x,
                y: hierarchyItem.y,
                width: data.width,
                height: data.height,
                label: label,
                type: data.treeType,
                definedRuleDTOS: data.definedRuleDTOS || [],
                tableDTOS: data.tableDTOS || [],
                data: data
              })
            )
            if (children) {
              children.forEach((item) => {
                const { id } = item
                cells.push(
                  this.graph.createEdge({
                    shape: 'mindmap-edge',
                    label: item.data.decide.operator ? this.returnLabel(item.data.decide.operator)[0].label + item.data.decide.paramValue : '',
                    source: {
                      cell: hierarchyItem.id,
                      anchor: 'center'
                    },
                    target: {
                      cell: id,
                      anchor: 'center'
                    }
                  })
                )
                traverse(item)
              })
            }
          }
        }
        traverse(result)
        this.graph.resetCells(cells)
        this.graph.centerContent()
        const BBox = this.graph.getContentArea()
        this.graph.positionRect({
          x: BBox.x,
          y: BBox.y - 25,
          width: BBox.width,
          height: BBox.height
        }, 'top')
      }
      const findItem = (
        obj,
        id
      ) => {
        if (obj.id === id) {
          return {
            parent: null,
            node: obj
          }
        }
        const { children } = obj
        if (children) {
          for (let i = 0, len = children.length; i < len; i += 1) {
            const res = findItem(children[i], id)
            if (res) {
              return {
                parent: res.parent || obj,
                node: res.node
              }
            }
          }
        }
        return null
      }

      const addChildNode = (id, type, num) => {
        const loadTreeData = this.getTreeData()
        if (!loadTreeData) return
        this.treeData = loadTreeData
        const res = findItem(this.treeData, id)
        const dataItem = res?.node
        if (dataItem) {
          let item = null
          const length = dataItem.children ? dataItem.children.length : 0
          if (num === '0') {
            item = {
              id: `${id}-${length + 1}`,
              treeType: 'TREE_DECIDE',
              treeLabel: ``,
              width: 100,
              height: 40,
              treeNodeId: '',
              decide: {
                operator: '',
                paramValue: ''
              }
            }
          } else if (num === '1') {
            item = {
              id: `${id}-${length + 1}`,
              treeType: 'TREE_RULE',
              treeLabel: ``,
              width: 60,
              height: 20,
              treeNodeId: '',
              decide: {
                operator: '',
                paramValue: ''
              },
              definedRuleDTOS: null,
              tableDTOS: null
            }
          }
          if (item) {
            if (dataItem.children) {
              dataItem.children.push(item)
            } else {
              dataItem.children = [item]
            }
            return item
          }
        }
        return null
      }

      const removeNode = (id) => {
        const res = findItem(this.treeData, id)
        const dataItem = res?.parent
        if (dataItem && dataItem.children) {
          const { children } = dataItem
          const index = children.findIndex((item) => item.id === id)
          return children.splice(index, 1)
        }
        return null
      }

      this.graph.on('add:topic', ({ node }) => {
        const { id } = node
        const type = node.prop('type')
        if (addChildNode(id, type, '0')) {
          render()
        }
      })
      this.graph.on('blank:click', ({ e, x, y }) => {
        this.activeNode = null
      })
      this.graph.on('addBranch:topic', ({ node }) => {
        const { id } = node
        const type = node.prop('type')
        if (addChildNode(id, type, '1')) {
          render()
        }
      })
      // 点击边节点
      this.graph.on('edge:click', ({ e, x, y, edge, view }) => {
        this.activeNode = edge
        this.activeEdgeSourceNode = edge.getSourceCell()
        this.activeEdgeTargetNode = edge.getTargetCell()
        const targetData = this.activeEdgeTargetNode.getData()
        this.ruleForm.expressionLabel = targetData.decide.operator
        this.ruleForm.expressionValue = targetData.decide.paramValue
      })
      // 点击分支节点
      this.graph.on('branch:click', ({ node }) => {
        this.activeNode = node
      })
      // 点击规则节点
      this.graph.on('rule:click', ({ node }) => {
        this.activeNode = node
        // const item = node.data.definedRuleDTOS || node.data.tableDTOS
        this.checkedTables = node.data.tableDTOS ? [...node.data.tableDTOS] : []
        this.checkedNodes = node.data.definedRuleDTOS ? [...node.data.definedRuleDTOS] : []
        this.chooseRuleData = [...this.checkedTables, ...this.checkedNodes]
      })
      const delNode = () => {
        this.$confirm('此操作将永久删除该节点及下级节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectedNodes = this.graph.getSelectedCells().filter((item) => item.isNode())
          if (selectedNodes.length) {
            const { id } = selectedNodes[0]
            if (id === '1') {
              this.$message({
                type: 'warning',
                message: '跟节点无法删除，请直接更换字段'
              })
              return
            }
            if (removeNode(id)) {
              render()
            }
          }
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      }
      this.graph.bindKey(['backspace', 'delete'], () => {
        delNode()
      })
      document.getElementById('delButton').addEventListener('click', delNode)
      this.graph.bindKey('tab', (e) => {
        e.preventDefault()
        const selectedNodes = this.graph.getSelectedCells().filter((item) => item.isNode())
        if (selectedNodes.length) {
          const node = selectedNodes[0]
          const type = node.prop('type')
          if (addChildNode(node.id, type)) {
            render()
          }
        }
      })

      render()

      insertCss(`
      .topic-image {
        visibility: hidden;
        cursor: pointer;
      }
      .x6-node:hover .topic-image {
        visibility: visible;
      }
      .x6-node-selected rect {
        stroke-width: 2px;
      }
    `)
    },
    // 保存边数据
    saveDecide() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const item = this.activeEdgeTargetNode.getData()
          this.activeEdgeTargetNode.replaceData({
            ...item,
            decide: {
              operator: this.ruleForm.expressionLabel,
              paramValue: this.ruleForm.expressionValue
            }
          })
          const labelList = this.returnLabel(this.ruleForm.expressionLabel)
          if (labelList && labelList.length > 0) {
            this.activeNode.setLabels(this.returnLabel(this.ruleForm.expressionLabel)[0].label + this.ruleForm.expressionValue, { silent: false })
          }
        } else {
          return false
        }
      })
    },
    getTreeData() {
      this.messageLabel = null
      let data = this.getChildrenData(this.treeData)
      if (this.messageLabel) {
        data = null
        this.$message({
          type: 'warning',
          message: this.messageLabel
        })
      }
      return data
    },
    getChildrenData(res) {
      let data = {}
      data = this.graph.getCellById(res.id).getData()
      if (data.treeType === 'TREE_DECIDE') {
        if (!data.treeFieldType) {
          this.messageLabel = '请完善字段信息'
        }
        if ((!data.decide || !data.decide.operator) && data.id !== '1') {
          this.messageLabel = `请完善"${data.treeLabel}"分支条件`
        }
      } else if (data.treeType === 'TREE_RULE') {
        if ((!data.definedRuleDTOS || data.definedRuleDTOS.length === 0) && (!data.tableDTOS || data.tableDTOS.length === 0)) {
          this.messageLabel = '请完善规则信息'
        }
        if (!data.decide.operator) {
          this.messageLabel = `请完善分支条件`
        }
      }
      // data.treeNodeId = data.id
      data.children = []
      if (res.children && res.children.length > 0) {
        res.children.forEach(item => {
          data.children.push(this.getChildrenData(item))
        })
      }
      return data
    }
  }
}
</script>

<style scoped lang="scss">
.graph-container{
  height:100%;
}
.app-container{
    padding: 0;
    min-width: 1138px;
    max-width: 1400px;
    margin: 0 auto;
}
.selected{
  background-color: #17d56b;
}
  .contentBtnDiv{
    position: absolute;
    right:320px;
    top:8px;
  }
  .decisionTreeDiv{
    position: relative;
    .rightDiv{
      position: absolute;
      right:0;
      top:0;
      height: 100%;
      width:300px;
      background: #fff;
      border-left: 1px solid #0079FF;
      .treeNameDiv{
        padding:10px 5px;
        font-size: 14px;
      }
      .approvelDiv {
        text-align: center;
        padding-top: 8px;
      }
      #delButton {
        width:100%;
        border-radius: 0px;
        margin-top:1px;
      }
      .bomTextDiv {
        clear: both;
        padding:10px;
        .title {
          font-size: 14px;
          display: inline-block;
          color:#0079FF;
          margin:10px 0;
        }
        .divLine{
          margin-top:10px;
          padding: 8px;
          border: 1px dotted #0079FF;
          font-size: 14px;
          :first-child{
            margin-bottom: 10px;
          }
        }
        .btnDiv{
          float: right;
        }
      }
    }
    .decisionTreeDivContainer{
      text-align: center;
      font-size: 14px;
      height: 810px;
      width: calc(100% - 300px);
    }
  }
  .textSpan{
    color: #0079FF
  }
  .formulaDiv{
    padding:10px;
    .el-select{
      width:100%;
      margin-bottom: 10px;
    }
    .el-button--primary{
      margin-top: 10px;
      width: 100%;
    }
    .title{
      font-size: 14px;
      color:#0079FF;
      display: inline-block;
      margin-bottom: 15px;
    }
  }
</style>
