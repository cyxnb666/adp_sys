<template>
  <div id="mountNode">
    <div class="editor">
      <context-menu />
      <!--toolbar-->
      <toolbar v-if="!isApprovel" ref="toolbarPage" @savaRuleFlow="savaRuleFlow" />
      <div v-else class="approvelBtn">
        <!-- <span class="statusSpan"> {{ resForm.flowStatus === '0' ? '修改' : resForm.flowStatus === '1' ? '新增' : '删除' }} </span> -->
        <el-button size="mini" :loading="approvelLoad" @click="approvelClick(0)">退回修改</el-button>
        <el-button size="mini" :disabled="falg" :loading="approvelLoad" type="primary" @click="approvelClick(1)">审核通过</el-button>
      </div>
      <div style="height: 42px;" />
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel v-if="!isApprovel" />
        <!--detailpannel-->
        <detail-panel
          v-if="!isApprovel"
          ref="detailPanel"
          v-bind="{ type, decisionUrlId, isApprovel, flowSettingObj, dimSettings, resForm: resFormVal, }"
          v-on="{ queryDetail, chooseRule, editRule }"
        />
        <!--page-->
        <page ref="flowPage" :height="height" :width="width" :data="data" />
      </div>
    </div>
    <Flow />
    <el-dialog title="选择规则" class="chooseRuleDialog" :visible.sync="chooseRuleDialog">
      <!-- <div class="tree-btn-wrap">
        <slot name="pre" />
        <el-button class="btn-tree" type="text" @click="setAllExpand(true)">
          {{ $t('common.fullExpansion') }}
        </el-button>
        <span class="btn-line">|</span>
        <el-button class="btn-tree" type="text" @click="setAllExpand(false)">
          {{ $t('common.fullFold') }}

        </el-button>
      </div> -->
      <el-input
        v-model="filterText"
        size="mini"
        placeholder="输入关键字进行过滤"
      />
      <div class="tree-container scroll">
        <el-tree
          ref="domTree"
          class="filter-tree mt-15  tree"
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="node.checkRules"
          :default-checked-keys="node.checkRules"
          :filter-node-method="filterNode"
          @check-change="checkChange"
        >
          <!-- @check="treeNodeCheck" -->
          <!-- 顶部的按钮插槽 -->
          <!-- <template #pre>
            <span class="btn-line">|</span>
          </template> -->
          <!-- 树结构的自定义标题插槽 -->
          <template #default="{ node }">
            <!-- {{ node }} -->
            <div class="tree-text">
              <template>
                <i v-if="node.isLeaf" class="el-icon-tickets" />
                <i v-else class="el-icon-folder-opened" />
                <span :class="{ 'catalogNode': !node.isLeaf }">{{ node.label }}</span>
              </template>
            </div>
          </template>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseRuleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseRule">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="规则编辑" class="WriteRuleDialog" :visible.sync="editRuleDialog">
      <!-- 规则展示部分 -->
      <EditRule v-if="editRuleDialog" ref="editRuleForm" :tree-data="treeDataArry" :rule-results-list="RuleResults" @saveNodeRule="saveNodeRule" @cancelDiag="editRuleDialog = false" />
    </el-dialog>
    <el-dialog title="规则流详情" class="WriteRuleDialog" :visible.sync="queryDetailDialog" @close="queryDetailDialog = false">
      <pageDetail v-if="queryDetailDialog=== true" ref="flowPage1" :height="height" :width="width" :flow-setting-obj="detailRow" />
    </el-dialog>
  </div>
</template>

<script>
import Toolbar from '../Toolbar'
import ItemPanel from '../ItemPanel'
import DetailPanel from '../DetailPanel'
import Page from '../Page'
import PageDetail from '../Page/indexCopy'
import Flow from '../Flow'
import ContextMenu from '../ContextMenu'
import Editor from '../Base/Editor'
import EditRule from '../writeRule'
import command from '../../command'
import {
  getDecisionRepositoryDetail
} from '@/api/mainPages/decision'
import {
  decisionFlowChartDecisionFlow,
  getRuleDefinedDetail
} from '@/api/systemManage/rule-manage'
import { decisionFlowApprovalInDecUrl } from '@/api/mainPages/decision-table'
import { decisionFlowChartApproval } from '@/api/mainPages/rule-approval'
import { getRuleResults } from '@/api/mainPages/decision'
import { bomClassAndField, getbomClassAndUpdateTime } from '@/api/systemManage/bom'
import Bus from '@/utils/bus'
export default {
  name: 'G6Editor',
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Page,
    ContextMenu,
    Flow,
    EditRule,
    PageDetail
  },
  props: {
    type: String,
    decisionUrlId: String,
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
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
    flowSettingObj: {
      type: Object,
      default: null
    },
    isApprovel: {
      type: Boolean,
      default: false
    },
    resForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      resFormVal: null,
      editor: {},
      command: null,
      // 树
      treeData: [],
      applicationId: this.$store.state.app.applicationId,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      defaultCheckedList: [],
      form: {},
      // 弹窗
      chooseRuleDialog: false,
      editRuleDialog: false,
      checkedNodes: [{}],
      checkedTables: [{}],
      editRuleContent: {},
      ruleMethodList: {},
      node: {},
      dimViewModel: null,
      dimSettingsVal: null,
      approvelLoad: false,
      queryDetailDialog: false,
      detailRow: {},
      RuleResults: [],
      treeDataArry: [],
      falg: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.domTree.filter(val)
    },
    dimSettings(val) {
      this.dimSettingsVal = val
    },
    resForm(val) {
      this.resFormVal = val
    }
  },
  async created() {
    this.resFormVal = this.resForm
    this.dimSettingsVal = this.dimSettings
    this.init()
    this.getRuleResults()
    this.getbomClassAndUpdateTime()
    // this.treeDataArry = this.$forage.getItem('bomBaseInfoId')
    let changeDimSettings = []
    Bus.$on('ComponentDimensionChange', (data) => { changeDimSettings = data })
    if (changeDimSettings.length > 0) { this.dimSettingsVal = changeDimSettings }
    this.dimViewModel = {
      applicationId: this.$store.state.app.applicationId,
      processNodeId: this.nodeId,
      dimSettings: this.dimSettingsVal
    }
  },
  methods: {
    // 根据bomBaseInfoId加载所有类和字段
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(async res => {
        // const val = [res]
        // this.treeData = this.filterTreeArray(val)
        this.treeDataArry = [res]
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
        this.treeDataArry = [storedData]
      } else {
        this.bomClassAndField()
      }
    },
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
      })
    },
    // 获取规则执行不通过结果定义列表
    toRuleFlowApprove() {},
    queryDetail(row) {
      this.detailRow = row
      this.queryDetailDialog = true
    },
    readData(data) {
      this.falg = false
      this.$refs.flowPage.readAllData(data)
    },
    // 审核规则流
    approvelClick(num) {
      this.approvelLoad = true
      if (this.type === 'approveFlow') { // 规则审批-决策路径-规则流审批
        const data = {
          approvalResult: num,
          flowSettingId: this.resFormVal.flowSettingId,
          decisionUrlId: this.decisionUrlId
        }
        decisionFlowApprovalInDecUrl(data).then(res => {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          this.approvelLoad = false
          this.$emit('toggleComponentRuleFlow')
        })
      } else {
        decisionFlowChartApproval({ approvalResult: num, flowSettingId: this.resFormVal.flowSettingId }).then(res => {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          this.approvelLoad = false
          this.$emit('toggleComponentRuleFlow')
        }).catch(res => {
          this.approvelLoad = false
        })
      }
    },
    saveNodeRule(data) {
      this.$refs.detailPanel.saveNodeRule(data)
    },
    // 保存规则流方法
    savaRuleFlow(data) {
      const form = this.$refs.detailPanel.$data.form
      if (!form.flowName) {
        this.$message({
          type: 'warning',
          message: '请点击空白处填写规则流名称'
        })
        this.$refs.toolbarPage.saveLoadFlase()
        return
      }

      // 规则节点是否有字节点, checkNodes规则子节点， checkedTables规则表节点
      const bool = data.nodes.some(node => {
        return node.flowNodeType === 'PACKET_NODE' && !(node.checkNodes && node.checkNodes.length) && !(node.checkedTables && node.checkedTables.length)
      })
      if (bool) { // 主流必须选择规则
        this.$message({
          message: '请选择规则',
          type: 'error'
        })
        this.$refs.toolbarPage.saveLoadFlase()
        return
      }

      const formData = {
        applicationId: this.applicationId,
        flowName: form.flowName || '',
        flowType: form.flowType || '1',
        flowSettingId: form.flowSettingId || '',
        conditions: this.getCondition(data.edges, data.nodes),
        nodes: this.getNode(data.nodes),
        dimView: this.dimViewModel
      }
      this.$emit('savaRule', formData, (bool) => {
        this.$refs.toolbarPage.saveLoadFlase()
        if (bool) {
          this.$emit('toggleComponentRuleFlow')
        }
      })
      // decisionFlowChartDecisionFlow(formData).then(res => {
      //   this.$refs.toolbarPage.saveLoadFlase()
      //   this.$emit('toggleComponentRuleFlow')
      // }).catch(res => {
      //   this.$refs.toolbarPage.saveLoadFlase()
      // })
    },
    getCondition(data, node) {
      const arr = data.map(res => {
        let relationshipType = 'SEQUENCE_FLOW'
        node.forEach(element => {
          if (element.id === res.sourceId) {
            if (element.flowNodeType === 'JUDGMENT_NODE') {
              relationshipType = 'CONDITION_FLOW'
            }
          }
        })
        return {
          preFlowNodeId: res.sourceId,
          nextFlowNodeId: res.targetId,
          conditionName: res.label || '',
          flowConditionId: res.id,
          relationshipType: relationshipType,
          ruleSetting: res.checkNodes || [],
          decisionTables: res.checkedTables || []
        }
      })
      return arr
    },
    getNode(data) {
      const arr = data.map(res => {
        return {
          childFlowDefId: res.childFlowDefId || '', // 子流节点所设置的规则流IS
          flowNodeName: res.label || '',
          flowNodeId: res.id,
          flowNodeType: res.flowNodeType,
          offsetX: res.offsetX,
          offsetY: res.offsetY,
          x: res.x,
          y: res.y,
          ruleSetting: res.checkNodes || [],
          decisionTables: res.checkedTables || []
        }
      })
      return arr
    },
    savaDecisionFlowChartDecisionFlow() {
    },
    init() {
      this.editor = new Editor()
      // eslint-disable-next-line new-cap
      this.command = new command(this.editor)
      this.getDecisionRepositoryDetail()
    },
    // 点击选择规则按钮 node：节点数据
    chooseRule(node) {
      this.node = node
      this.checkedNodes = [...node.checkNodes || []]
      this.checkedTables = [...node.checkedTables || []]
      const checkRules = this.getCheckRules([...this.checkedNodes, ...this.checkedTables])
      this.chooseRuleDialog = true
      this.$nextTick(() => {
        // 回显选中 因为决策表没有ruleID 不知道怎么弄
        this.$refs.domTree.setCheckedKeys(checkRules || [], true)
      })
    },
    getCheckRules(arr) {
      const ids = []
      arr.forEach(res => {
        if (res.ruleId) {
          ids.push(res.ruleId)
        } else if (res.decisionTableId) {
          ids.push(res.decisionTableId)
        }
      })
      return ids
    },
    // 点击dom节点选择规则后保存
    saveChooseRule() {
      this.$refs.detailPanel.saveChooseRule(this.checkedNodes, this.checkedTables)
      this.chooseRuleDialog = false
    },
    // 点击列表编辑 node：节点数据
    editRule(item, node) {
      this.node = node
      this.editRuleDialog = true
      this.$nextTick(() => {
        // this.$refs.editRuleForm.getRuleDefinedDetail(ruleId, index)
        this.$refs.editRuleForm.getRuleDefinedDetail1(item, 0)
      })
    },
    // 折叠与展开
    setAllExpand(state) {
      this.$nextTick(() => {
        var nodes = this.$refs.domTree.store.nodesMap
        for (var i in nodes) {
          nodes[i].expanded = state
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 查重规则的详细数据
    async searchNode(data) {
      const result = new Promise((resolve, reject) => {
        getRuleDefinedDetail(data.ruleId).then(async(res1) => {
          resolve(res1)
        })
      })
      return result
    },
    // 选中规则
    async checkChange(data, isCheck) {
      if (data.ruleId) {
        if (this.node.type === 'edge' && isCheck) {
          await this.searchNode(data).then(res => {
            const item = { ...res.ruleSetting,
              ruleResult: this.RuleResults[0].resultCode,
              elseList: res.elseList,
              thenList: res.thenList,
              id: data.id,
              ruleId: data.id,
              path: data.path }
            this.checkedNodes = [item]
          })
          // 如果选择超过一个节点，则只保留最后一个节点
          this.$refs.domTree.setCheckedKeys([data.id])
        } else {
          let isFind = false
          this.checkedNodes.forEach((res, index) => {
            if (res.ruleId === data.id) {
              isFind = true
            }
          })
          if (isCheck) {
            if (!isFind) {
              await this.searchNode(data).then(res => {
                const item = { ...res.ruleSetting,
                  ruleResult: this.RuleResults[0].resultCode,
                  elseList: res.elseList,
                  thenList: res.thenList,
                  id: data.id,
                  ruleId: data.id,
                  path: data.path }
                this.checkedNodes.push(item)
              })
            }
          } else {
            this.checkedNodes.forEach((res, index) => {
              if (res.ruleId === data.id) {
                this.checkedNodes.splice(index, 1)
              }
            })
          }
        }
      } else if (data.decisionTableId) {
        if (this.node.type === 'edge' && isCheck) {
          this.$message({
            type: 'warning',
            message: '条件分支仅支持决策规则'
          })
          if (this.checkedNodes === 2) {
            this.$refs.domTree.setCheckedKeys([this.checkedNodes[0].id])
          } else {
            this.$refs.domTree.setCheckedKeys([])
          }
        }
        if (this.node.type === 'node') {
          if (isCheck) {
            let isFind = false
            this.checkedTables.forEach((res, index) => {
              if (res.decisionTableId === data.id) {
                isFind = true
              }
            })
            if (!isFind) {
              this.checkedTables.push({
                decisionTableId: data.id,
                id: data.id,
                decisionTableName: data.label,
                path: data.path
              })
            }
          } else {
            this.checkedTables.forEach((res, index) => {
              if (res.decisionTableId === data.id) {
                this.checkedTables.splice(index, 1)
              }
            })
          }
        }
      }
    },
    // 查询决策库信息，包含决策库基本信息、关联规则信息等
    async getDecisionRepositoryDetail() {
      await getDecisionRepositoryDetail(this.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeData = decisionRepositoryModel.catalogueList
          // this.bomBaseInfo = res.bomBaseInfo
          // this.bomName.bomName = res.decisionRepositoryModel.repositoryName
        }
      })
      return Promise.resolve()
    }
  }
}
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
  height: calc(100% - 42px);
}
.el-card__body{
  padding:0!important;
}
#mountNode{
  width: 100%;
  height: 100%;
}
</style>
<style  lang="scss">
.WriteRuleDialog{
  .el-dialog{
    min-width: 900px;
  }
}
.chooseRuleDialog{
  .el-dialog__body{
    max-height: 500px;
    overflow-y: scroll;
  }
}
.approvelBtn{
  text-align: center;
  .statusSpan {
    float: left;
    color: #0079FF
  }
}
.el-card.is-always-shadow{
  margin-top:0;
}
.ruleflow .app-container{
  padding:0!important;
}
.catalogNode{
  font-weight: 700;
}
</style>
