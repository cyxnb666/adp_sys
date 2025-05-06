<template>
  <div class="decision">
    <div class="app-container">
      <ComponentDimension ref="ComponentDimension" :active-name="activeName" :export-button-show="exportButtonShow" :label="label" :node-id="nodeId" :edge-id="edgeId" @search="search" />
      <!-- 该管理维度下的决策路径 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="决策路径" name="RuleDetail">
          <RuleList
            v-if="showComponent === 'DecisionBase'"
            :table-data="tableData"
            :table-head="tableHead"
            :add-decision-select-list="addDecisionSelectList"
            :decision-add-component-list="decisionAddComponentList"
            :dim-settings.sync="form"
            :node-id="nodeId"
            @refresh="search"
            @toggleComponent="toggleComponent"
          />
          <!-- 规则设置决策设置 -->
          <RuleDetail
            v-else-if="showComponent === 'RuleDetail'"
            :dim-settings.sync="form"
            v-bind="{ currentRule, decisionUrlId, tableData, tableHead, addDecisionSelectList, decisionAddComponentList, nodeId }"
            @toggleComponent="toggleComponent"
          />
        </el-tab-pane>
        <el-tab-pane label="规则流" name="ruleSet">
          <RuleFlowList
            v-if="showComponent === 'ruleFlowList'"
            :table-data="tableData"
            :table-head="tableHead"
            :add-decision-select-list="addDecisionSelectList"
            :decision-add-component-list="decisionAddComponentList"
            :dim-settings.sync="form"
            :node-id="nodeId"
            @refresh="search"
            @toggleComponentRuleFlow="toggleComponentRuleFlow"
          />
          <writeRule
            v-else-if="showComponent === 'ruleSetDetail'"
            :flow-setting-obj="flowSettingObj"
            :dim-settings.sync="form"
            v-on="{ savaRule, toggleComponentRuleFlow }"
          />
        </el-tab-pane>
        <el-tab-pane label="决策树" name="decisionTree">
          <decisionTreeList
            v-if="showComponent === 'decisionTreeList'"
            :table-data="tableData"
            :tree-setting-id="treeSettingId"
            :table-head="tableHead"
            :add-decision-select-list="addDecisionSelectList"
            :decision-add-component-list="decisionAddComponentList"
            :dim-settings.sync="form"
            :node-id="nodeId"
            @refresh="search"
            @toggleDim="toggleDim"
            @toggleComponent="toggleDecisionTreeComponent"
          />
          <decisionTree v-if="showComponent === 'decisionTreeDetail'" ref="decisionTreeDetail" :table-data-list="tableData" :tree-setting-id="treeSettingId" :flow-setting-obj="flowSettingObj" :dim-settings.sync="form" @toggleComponent="toggleDecisionTreeComponent" />
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import { decisionFlowChartDecisionFlow } from '@/api/systemManage/rule-manage'
import { deciurlTabular, deciurlField, GetFindDecisionUrlIdIdByDim } from '@/api/mainPages/deci'
import { decisionTreeGetDecisionTree, getDecisionTreeList } from '@/api/mainPages/decisionTree.js'
import { decisionFlowChartTabular, findDimCombine } from '@/api/mainPages/ruleFlow'
import RuleList from './components/RuleList'
import RuleFlowList from './components/RuleFlowList'
import decisionTreeList from './components/decisionTreeList'
import RuleDetail from './components/RuleDetail'
import ComponentDimension from '../components/ComponentDimension'
import writeRule from '../ruleFlow/ruleFlow.vue'
import decisionTree from '../ruleFlow/decisionTree.vue'
import { unique } from '@/utils/utils'
export default {
  name: 'Decision',
  components: {
    RuleList,
    RuleDetail,
    ComponentDimension,
    RuleFlowList,
    writeRule,
    decisionTree,
    decisionTreeList
  },
  data() {
    return {
      decisionHeight: 78,
      showAllSelect: false,
      showComponent: 'DecisionBase',
      searchLoading: false, // 是否加载中
      decisionDimList: [], // 维度的字段
      decisionDimComponentList: {}, // 维度字段的select值列表
      form: [], // 选择维度值的form
      tableData: [], // 表格数据
      tableHead: [], // 表头
      addDecisionSelectList: [], // 新决策路径的select列表
      decisionAddComponentList: {}, // 查询新增决策路径的select值列表
      currentRule: {}, // 当前决策路径数据
      decisionUrlId: '',
      data: null,
      exportButtonShow: '',
      label: '',
      nodeId: '',
      tabType: null,
      activeName: 'RuleDetail',
      treeSettingId: '',
      flowSettingObj: null
    }
  },
  created() {
    // this.init()
    this.deciurlField()
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    this.label = urlParams.get('label')
    this.nodeId = urlParams.get('nodeId')
    this.edgeId = urlParams.get('edgeId')
  },
  methods: {
    // 保存规则流方法
    savaRule(formData, callback) {
      decisionFlowChartDecisionFlow(formData).then(res => {
        callback(true)
      }).catch(_ => callback())
    },
    handleClick(tab) {
      if (tab.name === 'ruleSet') {
        this.showComponent = 'ruleFlowList'
      } else if (tab.name === 'decisionTree') {
        this.showComponent = 'decisionTreeList'
      } else {
        this.showComponent = 'DecisionBase'
      }
      this.search()
    },
    codedatas(serviceKeys, dataKey) {
      const codeService = unique(serviceKeys)
      if (!codeService) return
      this.$store
        .dispatch('app/SET_CODESERVICE', codeService.toString())
        .then(res => {
          Object.keys(res).forEach(k => {
            if (dataKey === 'decisionDimComponentList') {
              this.$set(this.decisionDimComponentList, k, res[k]) // 查询维度字段的select列表
            } else if (dataKey === 'decisionAddComponentList') {
              this.$set(this.decisionAddComponentList, k, res[k]) // 查询新增决策路径的select列表
            }
          })
        })
    },

    // 表头
    deciurlField() {
      const data = {
        applicationId: this.$store.state.app.applicationId
      }
      deciurlField(data).then(res => {
        console.log(res)
        const tableHeadArray = [] // 表头
        const addDecisionSelectListArray = [] // 新增决策路径的select列表(需要去除编号,决策规则数量)
        const codeService = [] // 查询codeService
        res.forEach(item => {
          if (
            !(
              item.createdBy === null ||
              item.codeService === null
            )
          ) {
            addDecisionSelectListArray.push(item)
          }
          // item.decisionNodeField = item.decisionNodeField.toUpperCase()
          if (item.decisionNodeFieldName !== this.$t('ruleList.num')) tableHeadArray.push(item)
          codeService.push(item.codeService)
        })
        tableHeadArray.splice(-1, 0, {
          bomModelId: null,
          codeService: null,
          decisionNodeField: 'DECISION_FLOW_NUM',
          decisionNodeFieldId: null,
          decisionNodeFieldName: '规则流数量',
          decisionNodeFieldPath: null,
          decisionNodeFieldType: null,
          decisionNodeService: null,
          status: null
        })
        tableHeadArray.splice(-1, 0, {
          bomModelId: null,
          codeService: null,
          decisionNodeField: 'DECISION_TREE_NUM',
          decisionNodeFieldId: null,
          decisionNodeFieldName: '决策树数量',
          decisionNodeFieldPath: null,
          decisionNodeFieldType: null,
          decisionNodeService: null,
          status: null
        })
        this.tableHead = tableHeadArray
        this.addDecisionSelectList = addDecisionSelectListArray
        this.codedatas(codeService, 'decisionAddComponentList')
      })
    },
    // 查找列表
    async search(data) {
      if (data) this.data = data
      this.tableData = []
      const temp = []
      this.data.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: this.data.flag,
        applicationId: this.data.applicationId,
        processNodeId: this.nodeId,
        ...temp
      }
      this.form = this.data.dimSettings
      if (this.activeName === 'RuleDetail') {
        await deciurlTabular(resData).then(res => {
          this.tableData = res
          // this.showComponent = 'DecisionBase'
        })
      } else if (this.activeName === 'decisionTree') {
        await getDecisionTreeList(resData).then(res => {
          this.tableData = res
          // this.showComponent = 'decisionTreeList'
        })
      } else {
        await decisionFlowChartTabular(resData).then(res => {
          this.tableData = res
          // this.showComponent = 'ruleFlowList'
        })
      }
    },
    // 切换组件
    async toggleComponent(name, decisionUrlId) {
      // this.exportButtonShow = name
      const res = await GetFindDecisionUrlIdIdByDim(decisionUrlId)
      this.toggleDim(res, decisionUrlId)
      this.decisionUrlId = decisionUrlId
      this.showComponent = name
    },
    // 切换流程图组件
    async toggleComponentRuleFlow(name, controls, obj) {
      if (controls === 'add') {
        this.flowSettingObj = null
      } else {
        this.flowSettingObj = obj || null
      }
      this.showComponent = name
      if (name === 'ruleFlowList') {
        this.search()
      } else if (controls !== 'add') {
        const res = await findDimCombine(obj.dimView.dimSetComId)
        this.toggleDim(res)
      }
    },
    async toggleDim(res, num) {
      const newDimList = res.map(item => {
        return {
          dimId: item.dimId,
          dimValue: item.dimValue,
          // label: item.dimValue,
          key: item.dimValue
        }
      })
      if (num && num === 2) {
        this.$refs.ComponentDimension.setFormData(newDimList, num)
        return false
      } else {
        this.form = newDimList
        this.$refs.ComponentDimension.setFormData(newDimList)
      }
    },
    // 切换组件
    async toggleDecisionTreeComponent(name, controls, row) {
      if (name === 'decisionTreeDetail') {
        if (controls === 'add') {
          if (this.tableData.length > 0) {
            this.$message({
              type: 'warning',
              message: '该管理维度下已有决策树'
            })
            return
          } else {
            this.showComponent = name
            this.$nextTick(() => {
              this.$refs.decisionTreeDetail.addTreeData()
            })
          }
        } else {
          this.showComponent = name
          const res = await findDimCombine(row.dimView.dimSetComId)
          this.toggleDim(res)
          await decisionTreeGetDecisionTree({ treeSettingId: row.treeSettingId }).then(res => {
            this.$refs.decisionTreeDetail.loadTreeData(res)
          })
        }
      } else {
        this.showComponent = name
        this.search()
      }
    }
  }
}
</script>

<style lang="scss">
.decision {
  .btn-background {
    height: 34px;
    // line-height: 34px;
  }
  .btn-border {
    height: 34px;
  }
  .decisionTable {
    min-height: 50vh;
    ;
  }
  .el-table {
    td {
      padding: 0 5px;
    }
  }
  .el-tabs__header{
    background: #fff!important;
    margin: 15px 0 0 0!important;
    border-radius: 5px 5px 0 0;
    padding:0 5px;
  }
  .el-card.is-always-shadow{
    border-radius:0!important;
  }
  .el-card{
    border:none!important;
  }
}
</style>
