<template>
  <div class="approve">
    <div class="app-container">
      <ComponentDimension ref="ComponentDimension" :active-name="activeName" :export-button-show="exportButtonShow" @search="search" />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="决策路径" name="RuleDetail">
          <ApproveList
            v-show="showComponent === 'RuleList'"
            :rule-data.sync="rulData"
            @toggleComponent="toggleComponent"
          />
          <ApproveDetail
            v-show="showComponent === 'RuleDetail'"
            ref="approveShowDetail"
            :current-rule="currentRule"
            :decision-url-id="decisionUrlId"
             :flow-setting-obj="flowSettingObj"
             :rule-data.sync="rulData"
            :dim-settings.sync="form"
            @toggleComponent="toggleComponent"
          />
        </el-tab-pane>
        <el-tab-pane label="规则流" name="ruleSet">
          <ApproveRuleList v-show="showComponent === 'ruleFlowList'" ref="approveRuleList" :decision-url-id="decisionUrlId" :rule-data.sync="rulData" @toRuleFlowApprove="toRuleFlowApprove" />
          <writeRule v-if="showComponent === 'ruleSetDetail'" ref="writeRule" :dim-settings.sync="form" :flow-setting-obj="flowSettingObj" :is-approvel="true" @toRuleFlowApprove="toRuleFlowApprove" />
          <!-- <pageDetail v-if="showComponent === 'ruleSetDetail'" ref="flowPage1" :height="height" :width="width" :flow-setting-obj="flowSettingObj" /> -->
        </el-tab-pane>
        <el-tab-pane label="决策树" name="decisionTree">
          <ApproveDecisionTreeList
            v-if="showComponent === 'decisionTreeList'"
            ref="decisionTreeList"
            :rule-data.sync="rulData"
            @toggleComponent="toRuleFlowApprove"
          />
          <decisionTree
            v-if="showComponent === 'decisionTreeDetail'"
            ref="decisionTree"
            :is-approvel="true"
            :table-data-list="tableData"
            :tree-setting-id="treeSettingId"
            :flow-setting-obj="flowSettingObj"
            :dim-settings.sync="form"
            @toggleComponent="toRuleFlowApprove"
          />
        </el-tab-pane>
      </el-tabs>
      <!-- toggleComponent -->
    </div>
  </div>
</template>

<script>
import { GetFindDecisionUrlIdIdByDim } from '@/api/mainPages/deci'
import { findDimCombine } from '@/api/mainPages/ruleFlow'
import { decisionTreeGetDecisionTree } from '@/api/mainPages/decisionTree.js'
import decisionTree from '../ruleFlow/decisionTree.vue'
import ComponentDimension from '../components/ComponentDimension'
import ApproveList from './components/ApproveList'
import ApproveRuleList from './components/ApproveRuleList'
import ApproveDecisionTreeList from './components/ApproveDecisionTreeList'
import ApproveDetail from './components/ApproveDetail'
import writeRule from '../ruleFlow/ruleFlow.vue'
export default {
  name: 'Approve',
  components: {
    ComponentDimension,
    ApproveList,
    ApproveDetail,
    ApproveRuleList,
    writeRule,
    decisionTree,
    ApproveDecisionTreeList
  },
  data() {
    return {
      rulData: null,
      showComponent: 'RuleList',
      decisionUrlId: null,
      currentRule: [],
      exportButtonShow: 'Approve',
      flowSettingObj: null,
      form: [], // 选择维度值的form
      activeName: 'RuleDetail'
    }
  },
  methods: {
    async toRuleFlowApprove(name, row) {
      this.showComponent = name
      if (name === 'ruleSetDetail' || name === 'decisionTreeDetail') {
        this.flowSettingObj = row
        if (row.dimView) {
          const res = await findDimCombine(row.dimView.dimSetComId)
          const newDimList = res.map(item => {
            return {
              dimId: item.dimId,
              dimValue: item.dimValue,
              // label: item.dimValue,
              key: item.dimValue
            }
          })
          this.$refs.ComponentDimension.setFormData(newDimList)
        }
        if (name === 'decisionTreeDetail') {
          await decisionTreeGetDecisionTree({ treeSettingId: row.treeSettingId }).then(res => {
            this.$refs.decisionTree.loadTreeData(res)
          })
        }
      } else if (name === 'ruleFlowList') {
        this.$refs.approveRuleList.ruleTableData()
      } else if (name === 'decisionTreeList') {
        this.$refs.decisionTreeList.ruleTableData()
      } else {
        const data1 = { ...this.ruleData }
        this.ruleData = {}
        this.ruleData = data1
      }
    },
    async handleClick(tab) {
      if (tab.name === 'ruleSet') {
        this.showComponent = 'ruleFlowList'
      } else if (tab.name === 'decisionTree') {
        this.showComponent = 'decisionTreeList'
      } else {
        this.showComponent = 'RuleList'
      }
      this.search()
    },
    async search(data) {
      if (!data) return
      this.rulData = data

      this.form = _.cloneDeep(data.dimSettings)
      // if (this.activeName === 'decisionTree') {
      //   this.tableData = []
      //   const temp = []
      //   data.dimSettings.forEach(item => {
      //     temp[item.dimId] = item.dimValue
      //   })
      //   const resData = {
      //     flag: data.flag,
      //     applicationId: data.applicationId,
      //     processNodeId: this.nodeId,
      //     ...temp
      //   }
      //   await decisionTreeGetDecisionTree(resData).then(res => {
      //     this.showComponent = 'decisionTreeDetail'
      //     this.$refs.decisionTree.loadTreeData(res)
      //   })
      // }
    },
    toggleComponent(name, decisionUrlId) {
      this.showComponent = name
      if (name === 'RuleDetail') {
        GetFindDecisionUrlIdIdByDim(decisionUrlId)
          .then(res => {
            const newDimList = res.map(item => {
              return {
                dimId: item.dimId,
                dimValue: item.dimValue,
                // label: item.dimValue,
                key: item.dimValue
              }
            })
            this.$refs.ComponentDimension.setFormData(newDimList)
          })
        
        this.decisionUrlId = decisionUrlId
        if (name === 'RuleDetail') {
          // 调用子组件的一次查询接口
          this.$refs.approveShowDetail.GetRuleApprovalTabular(this.decisionUrlId)
        }
      } else if (name === 'RuleDetail') {

      }
    }
  }
}
</script>

<style lang="scss">
.approve {
  .btn-background {
    height: 34px;
    // line-height: 34px;
  }
  .btn-border {
    height: 34px;
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
