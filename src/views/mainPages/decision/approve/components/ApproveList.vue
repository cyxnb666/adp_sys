<template>
  <div class="decisionBase">
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('ruleList.decPath') }}</span>
      </div>
      <div class="content">
        <el-table
          v-if="tableHead"
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
          <el-table-column prop="DECISION_TABLE_NUM" :label="$t('ruleList.decTableNum')" />
          <el-table-column
            v-for="item in tableHead"
            :key="item.decisionNodeFieldId"
            :label="item.decisionNodeFieldName"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row[item.decisionNodeField] || '--' }} -->
              <!-- {{ scope.row[item.decisionNodeField.toUpperCase()] || '全部' }} -->
              <span v-if="'defaultPath' !== item.decisionNodeField">
                {{ scope.row[item.decisionNodeField.toUpperCase()] || 0 }}
              </span>
              <span v-else>
                {{ scope.row[item.decisionNodeField] || $t('common.all') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { deciurlField } from '@/api/mainPages/deci'
import { GetRuleApprovalList } from '@/api/mainPages/rule-approval'
export default {
  name: 'ShowTable',
  props: {
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
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      search: '',
      tableHead: null, // Duplicated key 'tableHead'
      tableData: []
    }
  },
  watch: {
    ruleData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.ruleTableData(newValue)
        }
      },
      deep: true
    }
  },

  created() {
    this.deciurlField()
  },
  methods: {
    // 去规则审核详情组件
    toSetting(currentRule) {
      this.$emit(
        'toggleComponent',
        'RuleDetail',
        currentRule['DECISION_URL_ID']
      )
    },

    // 表头
    deciurlField() {
      const data = {
        applicationId: this.$store.state.app.applicationId
      }
      deciurlField(data).then(res => {
        const tableHeadArray = [] // 表头
        res.forEach(item => {
          if (item.decisionNodeField === 'DECISION_URL_NUM') return
          tableHeadArray.push(item)
        })

        tableHeadArray.splice(-1, 0, {
          bomModelId: null,
          codeService: null,
          decisionNodeField: "DECISION_FLOW_NUM",
          decisionNodeFieldId: null,
          decisionNodeFieldName: "规则流数量",
          decisionNodeFieldPath: null,
          decisionNodeFieldType: null,
          decisionNodeService: null,
          status: null,
        })
        tableHeadArray.splice(-1, 0, {
          bomModelId: null,
          codeService: null,
          decisionNodeField: "DECISION_TREE_NUM",
          decisionNodeFieldId: null,
          decisionNodeFieldName: "决策树数量",
          decisionNodeFieldPath: null,
          decisionNodeFieldType: null,
          decisionNodeService: null,
          status: null,
        })

        this.tableHead = tableHeadArray
      })
    },

    // 表格data
    ruleTableData(data) {
      const temp = []
      data.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: data.flag,
        applicationId: data.applicationId,
        ...temp
      }
      GetRuleApprovalList(resData).then(res => {
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
