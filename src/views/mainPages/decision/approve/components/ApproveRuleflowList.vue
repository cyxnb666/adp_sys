<template>
  <div class="decisionBase">
    <!-- <el-card class="mt-15">
      <div class="content">
        <el-table
          ref="table"
          class="decisionTable"
          :data="tableData"
          style="width: 100%;"
          stripe
          :empty-text="$t('common.noData')"
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="flowName" label="规则流名称" />
          <el-table-column prop="flowName" label="规则流类型">
            <template slot-scope="scope">
              <div> {{ scope.row.flowType === '1' ? '主流程' : '子流程' }} </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="审批状态">
            <template slot-scope="scope">
              <div> {{ scope.row.flowType === '1' ? getApprovalstatus(scope.row.approvalStatus) : '' }} </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <br>
    <div class="footer-btn-wrap">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >{{ $t('common.allSelect') }}</el-checkbox>
      <div>
        <el-button
          class="btn-border medium"
          @click="handleApprove('4')"
        >{{ $t('approvelDetail.returnChange') }}</el-button>
        <el-button
          class="btn-background medium"
          @click="handleApprove('3')"
        >{{ $t('approvelDetail.approvalPass') }}</el-button>
      </div>
      <div />
    </div> -->
    <ApproveRuleList v-show="showComponent === 'ruleFlowList'" type="approveFlow" ref="approveRuleList" :decision-url-id="decisionUrlId" @toRuleFlowApprove="toRuleFlowApprove" :ruleData="ruleData" />
    <writeRule v-if="showComponent === 'ruleSetDetail'" type="approveFlow" ref="writeRule" :dim-settings.sync="dimSettings" 
    :decision-url-id="decisionUrlId" :flow-setting-obj="flowSettingObj" :is-approvel="true" @toRuleFlowApprove="toRuleFlowApprove" />
  </div>
</template>

<script>
import { getDecisionFlowList } from '@/api/mainPages/rule-approval'
import ApproveRuleList from './ApproveRuleList'
import writeRule from '../../ruleFlow/ruleFlow.vue'
export default {
  name: 'ApproveRuleflowList',
  props: {
    ruleData: {
      type: Object,
      default: null
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    nodeId: {
      type: String,
      default: null
    },
    decisionUrlId: {
      type: String,
      default: null
    },
    flowSettingObj: {
      type: Object,
      default: null
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
  },
  components: {
    ApproveRuleList,
    writeRule
  },
  data() {
    return {
      showComponent: 'ruleFlowList',
    }
  },
  mounted() {
    // this.getDecisionFlowList()
  },
  methods: {
    getDecisionFlowList() {
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
        getDecisionFlowList(resData).then(res => {
          this.tableData = res
        })
    },
    toRuleFlowApprove(name, row) {
      this.showComponent = name
      if (name === 'ruleSetDetail') {
        this.flowSettingObj = row
        // if (row.dimView) {
        //   const res = findDimCombine(row.dimView.dimSetComId)
        //   const newDimList = res.map(item => {
        //     return {
        //       dimId: item.dimId,
        //       dimValue: item.dimValue,
        //       // label: item.dimValue,
        //       key: item.dimValue
        //     }
        //   })
          // this.$emit('toggleComponent', newDimList)
        // }
      } else {
        this.$nextTick(() => {
          this.$refs.approveRuleList.ruleTableData()
        })
      }
    },
  }
}
</script>

<style lang="scss">
.decisionBase {
  .el-table th.gutter:last-of-type {
    display: table-cell!important;
  }
  .el-table__expand-icon {
    opacity: 0;
  }
  .table-expand-wrapper {
    background: #e6f2ff;
    margin: 0 -5px;
    padding: 15px;
    color: #82848a;
    font-size: 12px;
  }
}
.table-btn-wrap {
  padding: 10px 0;
}
.btn-set {
  span {
    display: flex;
    align-items: center;
  }
  .set {
    width: 17px;
    height: 17px;
    margin-right: 3px;
  }
}
.form-label-noPadding label {
  padding: 0;
}
</style>
