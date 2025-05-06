<template>
  <div class="decisionBase">
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span>该管理维度下的规则流</span>
      </div>
      <div class="content">
        <el-table
          :empty-text="$t('common.noData')"
          class="decisionTable"
          :data="tableData"
          style="width: 100%;"
          stripe
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
        >
          <el-table-column prop="date" :label="$t('approvelList.exeRule')">
            <template slot-scope="scope">
              <el-button
                class="btn-set"
                type="text"
                @click="toSetting(scope.row)"
              >
                <svg-icon icon-class="content" />
                <span>{{ $t('approvelList.audit') }}</span>
              </el-button>
            </template>
          </el-table-column>
          <!-- 决策表数量 -->
          <el-table-column prop="flowName" label="规则流名称" />
          <el-table-column prop="date" label="数据状态">
            <template slot-scope="scope">
              {{ scope.row.flowStatus === '0' ? '修改' : scope.row.flowStatus === '1' ? '新增' : '删除' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDecisionFlowList } from '@/api/mainPages/rule-approval'
export default {
  name: 'ShowTable',
  props: {
    type: String,
    ruleData: {
      type: Object,
      default: null
    },
    decisionAddComponentList: {
      // 查询新增决策路径的select值列表
      type: Object,
      default: function() {
        return {}
      }
    },
    decisionUrlId: {
      type: String,
      default: null
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
  },
  data() {
    return {
      search: '',
      tableData: [],
      ruleDataSet: null,
    }
  },
  watch: {
    ruleData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.ruleDataSet = newValue
          this.ruleTableData()
        }
      },
      deep: true
    }
  },
  created() {
    this.ruleDataSet = this.ruleData
    this.ruleTableData()
  },
  methods: {
    // 去规则审核详情组件
    toSetting(row) {
      this.$emit(
        'toRuleFlowApprove',
        'ruleSetDetail',
        row
      )
    },

    // 表格data
    ruleTableData() {
      if (!this.ruleDataSet) return
      const temp = []
      this.ruleDataSet.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: this.ruleDataSet.flag,
        applicationId: this.ruleDataSet.applicationId,
        ...temp
      }
      // 规则审批-决策路径-规则流审批参数
      if (this.type === 'approveFlow') {
        resData.decisionUrlId = this.decisionUrlId
      }
      
      getDecisionFlowList(resData).then(res => {
        this.tableData = res
      })
    }
  }
}
</script>

<style lang="scss">
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
.decisionBase {
  .el-table th.gutter:last-of-type {
    display: table-cell !important;
  }
}
</style>
