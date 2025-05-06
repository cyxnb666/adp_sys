<template>
  <div class="RuleDetail">
    <!-- 当前的决策路径 -->
    <ComponentCurrentDecisionPath :decision-url-id="decisionUrlId">
      <el-button class="btn-background" @click="toggleComponent">
        {{ $t('ruleDetail.resselectPath') }}
      </el-button>
    </ComponentCurrentDecisionPath>

    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" class="mt-30">
      <!-- 初始化-->
      <!-- <el-tab-pane label="初始化">
        <Initialize
          :decision-url-id="decisionUrlId"
          @toggleComponent="toggleComponent"
        />
      </el-tab-pane> -->
      <!-- 规则设置 -->
      <!-- <el-tab-pane :label="$t('ruleDetail.ruleSet')">
        <RuleSetting
          :decision-url-id="decisionUrlId"
          @toggleComponent="toggleComponent"
        />
      </el-tab-pane> -->
      <el-tab-pane name="RuleDetail">
        <span slot="label"><i class="el-icon-document" /> 决策规则设置</span>
        <!-- 回填-->
        <wtiteBack
          :decision-url-id="decisionUrlId"
          @toggleComponent="toggleComponent"
        />
      </el-tab-pane>
      <el-tab-pane name="ruleTableSet">
        <span slot="label"><i class="el-icon-date" /> {{ $t('ruleDetail.ruleTableSet') }}</span>
        <!-- 决策表设置 -->
        <ComponentDecisionTable :decision-url-id="decisionUrlId" />
      </el-tab-pane>

      <el-tab-pane name="ruleSet">
        <!-- 规则流设置 -->
        <span slot="label"><i class="el-icon-date" /> {{ $t('ruleDetail.ruleFlowSet') }}</span>
        <!-- <ApproveRuleList v-if="showComponent === 'ruleFlowList'" ref="approveRuleList"
        style="margin-top:20px;" ruleSet
        v-bind="{ decisionUrlId, rulData }" v-on="{ toggleComponentRuleFlow, toRuleFlowApprove }" /> -->
        <RuleFlowList
            v-if="showComponent === 'ruleFlowList'"
            v-bind="{ tableData: ruleFlowSetList, tableHead, addDecisionSelectList, decisionAddComponentList, nodeId }"
            :dim-settings.sync="form"
            v-on="{ refresh: search, toggleComponentRuleFlow, toRuleFlowApprove }"
          />
        <write-rule v-if="showComponent === 'ruleSetDetail'"
        v-bind="{ flowSettingObj, dimSettings, type: 'flowSet', decisionUrlId }"
        v-on="{ savaRule, toggleComponentRuleFlow, toRuleFlowApprove }"
        ref="writeRule"/>
      </el-tab-pane>

      <el-tab-pane name="decisionTree">
        <!-- 决策树设置 -->
        <span slot="label"><i class="el-icon-date" /> {{ $t('ruleDetail.ruleTreeSet') }}</span>
        <!-- <ApproveDecisionTreeList
          v-if="showComponent === 'decisionTreeList'"
          ref="decisionTreeList"
          :rule-data.sync="rulData"
          @toggleComponent="toRuleFlowApprove"
        /> -->
        <decisionTreeList
            v-if="showComponent === 'decisionTreeList'"
            style="margin-top:20px;"
            v-bind="{ tableData: rulData, treeSettingId, tableHead, addDecisionSelectList, decisionAddComponentList, nodeId }"
            :dim-settings.sync="dimSettings"
            @refresh="search"
            @toggleComponent="toggleDecisionTreeComponent"
          />
        <decision-tree
          v-if="showComponent === 'decisionTreeDetail'"
          ref="decisionTreeDetail"
          v-bind="{ treeSettingId, flowSettingObj, type: 'decisionTree', nodeId }"
          :table-data-list="rulData"
          :dim-settings.sync="dimSettings"
          :decisionUrlId="decisionUrlId"
          @toggleComponent="toRuleFlowApprove"
          @saveOrUpdateTreeInDecUrl="saveOrUpdateTreeInDecUrl"
        />
      </el-tab-pane>

      <el-tab-pane name="end">
        <span slot="label"><i class="el-icon-tickets" /> 尾处理</span>
        <!-- 回填-->
        <TailTreatment
          :decision-url-id="decisionUrlId"
          @toggleComponent="toggleComponent"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findDimCombine, decisionFlowChartDecisionFlow, decisionFlowSet } from '@/api/mainPages/ruleFlow'
import decisionTree from '@/views/mainPages/decision/ruleFlow/decisionTree.vue'
import writeRule from '@/views/mainPages/decision/ruleFlow/ruleFlow.vue'
// import ApproveRuleList from '@/views/mainPages/decision/approve/components/ApproveRuleList'
import ApproveDecisionTreeList from '@/views/mainPages/decision/approve/components/ApproveDecisionTreeList'
import { decisionTreeGetDecisionTree, saveOrUpdateTreeInDecUrl, getDecisionTreeListInDecisionUrl } from '@/api/mainPages/decisionTree.js'
import decisionTreeList from './decisionTreeList'
import RuleFlowList from './RuleFlowList'
export default {
  name: 'RuleDetail',
  components: {
    writeRule,
    decisionTree,
    // ApproveRuleList,
    RuleFlowList,
    ApproveDecisionTreeList,
    decisionTreeList,
    ComponentCurrentDecisionPath: () =>
      import('../../components/ComponentCurrentDecisionPath'),
    ComponentDecisionTable: () => import('./ComponentDecisionTable'),
    // RuleSetting: () => import('./ruleSetting'),
    // Initialize: () => import('./initialize.vue'),
    wtiteBack: () => import('./writeBack.vue'),
    TailTreatment: () => import('./tailTreatment.vue')
  },
  props: {
    nodeId: {
      type: String,
      default: null
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableHead: {
      type: Array,
      default: () => []
    },
    addDecisionSelectList: {
      type: Array,
      default: () => []
    },
    decisionAddComponentList: {
      type: Object,
      default: () => ({})
    },
    decisionUrlId: {
      type: String,
      default: ''
    },
    dimSettings: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleList: [], // 展示新增规则列表，
      drawer: false,
      RuleResults: [], // 执行结果
      // search: '', // 搜索关键字
      beforeUnload_time: null,
      gap_time: null,
      timer: null,
      ruleFlowSetList: [],
      rulData: null,
      showComponent: 'ruleDetailList',
      currentRule: [],
      exportButtonShow: 'Approve',
      flowSettingObj: null,
      // form: [], // 选择维度值的form
      activeName: 'RuleDetail'
    }
  },
  created() {
    this.$store.dispatch('app/SET_GETRULEEXPRESSIONSALL')
    this.$store.dispatch('bom/SET_GETPOCEXPRESSIONSALL')
  },
  mounted() {
    // 设置定时器时间
    // this.timer = setInterval(this.logout, 30 * 60 * 1000)
    // // this.timer = setInterval(this.logout, 15)
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // window.addEventListener('unload', (e) => this.unloadHandler(e))
    // document.addEventListener('mousemove', this.resetTimer)
    // document.addEventListener('keydown', this.resetTimer)
    // document.addEventListener('click', this.resetTimer)
  },
  // beforeDestroy() {
  //   this.beforeUnload_time = new Date().getTime()
  // },
  // destroyed() {
  //   this.gap_time = new Date().getTime() - this.beforeUnload_time
  //   fetch('/logout').then((res) => {
  //   })
  //   document.removeEventListener('mousemove', this.resetTimer)
  //   document.removeEventListener('keydown', this.resetTimer)
  //   document.removeEventListener('click', this.resetTimer)
  //   // this.$router.push('/')
  //   window.location.reload()
  // },
  methods: {
    saveOrUpdateTreeInDecUrl(params) {
      saveOrUpdateTreeInDecUrl(params).then(res => {
        this.$emit('toggleComponent', 'DecisionBase', 'decisionTreeList')
      })
    },
    toggleComponent(data, toggleType) {
      this.$emit('toggleComponent', 'DecisionBase', toggleType)
    },
    async handleClick(tab) {
      if (tab.name === 'ruleSet') {
        this.showComponent = 'ruleFlowList'
      } else if (tab.name === 'decisionTree') {
        this.showComponent = 'decisionTreeList'
      } else if (tab.name === 'ruleTableSet') {
        this.showComponent = 'ruleTableSetList'
      } else {
        this.showComponent = 'ruleDetailList'
      }
      this.search()
    },
    savaRule(formData, callback) {
      formData = {
        decisionUrlId: this.decisionUrlId,
        decisionFlowSettingModel: formData
      }
      decisionFlowChartDecisionFlow(formData).then(res => {
        callback(true)
      }).catch(_ => callback())
    },
    // 查找列表
    search(data) {
      if (data) this.data = data
      this.rulData = []
      const temp = []
      this.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: 0,
        applicationId: this.$store.state.app.applicationId,
        decisionUrlId: this.decisionUrlId,
        ...temp
      }
      // this.form = this.dimSettings
      if (this.activeName === 'RuleDetail') {
        deciurlTabular(resData).then(res => {
          this.rulData = res
        })
      } else if (this.activeName === 'decisionTree') {
        getDecisionTreeListInDecisionUrl(resData).then(res => {
          this.rulData = res
        })
      } else if (this.activeName === 'ruleSet'){
        this.decisionFlowSet()
      }
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
        this.decisionFlowSet()
      } else if (controls !== 'add') {
        const res = await findDimCombine(obj.dimView.dimSetComId)
        this.$emit('toggleDim', res)
        // this.toggleDim(res)
      }
    },
    decisionFlowSet() {
      const temp = []
      this.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: 0,
        applicationId: this.$store.state.app.applicationId,
        decisionUrlId: this.decisionUrlId,
        ...temp
      }
      decisionFlowSet(resData).then(res => {
        this.ruleFlowSetList = res
      })
    },
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
          // this.$refs.ComponentDimension.setFormData(newDimList)
          this.$emit('toggleDim', newDimList)
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
    // 切换组件
    async toggleDecisionTreeComponent(name, controls, row) {
      if (name === 'decisionTreeDetail') {
        if (controls === 'add') {
          // if (this.tableData.length > 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '该管理维度下已有决策树'
          //   })
          //   return
          // } else {
          //   }
            this.showComponent = name
            this.$nextTick(() => {
              this.$refs.decisionTreeDetail.addTreeData()
            })
        } else {
          console.log(row)
          this.showComponent = name
          const res = await findDimCombine(row.dimView.dimSetComId)
          // this.toggleDim(res)
          this.$emit('toggleDim', res)
          await decisionTreeGetDecisionTree({ treeSettingId: row.treeSettingId }).then(res => {
            this.$refs.decisionTreeDetail.loadTreeData(res)
          })
        }
      } else {
        this.showComponent = name
        this.search()
      }
    },
    // // 重置定时器
    // resetTimer() {
    //   clearInterval(this.timer)
    //   // this.timer = setInterval(this.logout, 15000)
    //   this.timer = setInterval(this.logout, 30 * 60 * 1000)
    // },
    // logout() {
    //   // this.$router.push('/test2')
    //   window.location.reload()
    // },

    // beforeunloadHandler(e) {
    //   this.beforeUnload_time = new Date().getTime()
    // },
    // unloadHandler(e) {
    //   this.gap_time = new Date().getTime() - this.beforeUnload_time
    //   // 判断是窗口关闭还是刷新
    //   if (this.gap_time <= 5) {
    //     // 请求接口
    //     fetch('logout')
    //   }
    // }
  }
}
</script>

<style lang="scss">
.RuleDetail {
  margin-bottom: 50px;
  @import '../../style.scss';
  @import '@/styles/rule/decisionRule.scss';
  .decisionBase .content>.mt-15{
    margin-top: 0;
  }
  .item-wrap {
    margin-bottom: 30px;
  }
  .drawer-wrapper {
    padding: 23px;
    .content {
      height: calc(100vh - 225px);
      .rule-item {
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #ccc;
      }
    }
  }

  .left {
    // width: 0 !important;
  }
  .ruleSetting .setting_item {
    margin-right: 10px !important;
    max-width: 30% !important;
  }
}
</style>
