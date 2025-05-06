<template>
  <div class="decisionBase">
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <!-- 该管理维度下的决策路径 -->
        <span>该管理维度下的规则流</span>
      </div>
      <div class="content">
        <div class="mt-15 mb-15">
          <div class="flex-wrap">
            <div class="mr-15">
              <el-button
                class="btn-border"
                @click="openDialog"
              > 新增规则流 </el-button>
            </div>
            <div>
              <el-input
                v-model="search"
                clearable
                class="input-background"
                :placeholder="$t('ruleList.searchEnter')"
                suffix-icon="el-input__icon el-icon-search"
                @keyup.enter.native="searchEnter()"
              />
            </div>
          </div>
        </div>
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
        >
          <!-- 操作 -->
          <el-table-column prop="date" :label="$t('common.operation')">
            <template slot-scope="scope">
              <div class="table-btn-wrap">
                <el-button size="mini" class="btn-set" type="text" @click="toSetting(scope.row)">{{ $t('common.set') }}</el-button>
                <!-- <el-button size="mini" type="text" @click="toggleExpand(scope.row)">查看维度</el-button> -->
                <el-button size="mini" class="btn-set" type="text" @click="delBtnFn(scope.row)">{{ $t('pending.del') }}</el-button>

                <!-- 删除确认框 -->
                <el-dialog
                  :title="$t('common.hint')"
                  :visible.sync="dialogDelVisible"
                  width="30%"
                >
                  <span>{{ $t('ruleList.delIsOk') }}</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDelVisible = false">{{ $t('button.cancel') }}</el-button>
                    <el-button type="primary" @click="delPathFn(scope.row)">{{ $t('button.OK') }}</el-button>
                  </span>
                </el-dialog>
              </div>
            </template>
          </el-table-column>
          <!-- 决策表数量 -->
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
    <!-- {{ addDecisionSelectList }} -->
    <br>
  </div>
</template>

<script>
import { PostDeciurl, delDeciurl } from '@/api/mainPages/deci'
import { delDecisionFlow } from '@/api/mainPages/ruleFlow'
import Bus from '@/utils/bus'
export default {
  name: 'RuleList',
  props: {
    ruleSet: Boolean,
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableHead: {
      type: Array,
      default: function() {
        return []
      }
    },
    addDecisionSelectList: {
      // 新决策路径的select列表
      type: Array,
      default: function() {
        return []
      }
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
    },
    nodeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      search: '',
      changeDimSettings: [],
      dialogFormVisible: false,
      addForm: null, // 表单
      decisionNodeList: [], // 新增决策路径的select组合
      dialogDelVisible: false,
      flowSettingId: null
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? 'auto' : '100px'
      }
    },
    grid() {
      return {
        grid: this.lang === 'en' ? 24 : 12
      }
    }
  },
  watch: {
    addDecisionSelectList(newValue, oldValue) {
      this.initForm()
    }
  },
  created() {
    this.initForm()
    Bus.$on('ComponentDimensionChange', (data) => { this.changeDimSettings = data })
  },
  methods: {
    getApprovalstatus(val) {
      let label = ''
      switch (val) {
	        case '0':
	        case '1':
	        case '2':
	            label = '待审批'
	            break
	        case '3':
	            label = '审批通过'
	            break
	        case '4':
	            label = '退回修改'
	            break
	        case '5':
	            label = '无需审批'
	            break
	        case '6':
	            label = '审批不通过'
          break
        default:
	            label = ''
          break
      }
      return label
    },
    // 删除按钮
    delBtnFn(row) {
      this.dialogDelVisible = true
      this.flowSettingId = row.flowSettingId
    },
    // 删除空的路径
    async delPathFn() {
      await delDecisionFlow(this.flowSettingId)
      this.dialogDelVisible = false
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.$emit('refresh')
    },
    searchEnter() {
      console.log(this.search)
    },
    initForm() {
      const arr = this.addDecisionSelectList.map(item => {
        return {
          option: { key: 'ALL', label: this.$t('common.all') },
          nodeField: item.decisionNodeField,
          nodeFieldPath: item.decisionNodeFieldPath
        }
      })
      this.addForm = arr
    },

    toggleExpand(row) {
      const $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    // PostDeciurl 新增决策路径
    PostDeciurl() {
      let dimSettings = []
      if (this.changeDimSettings.length) { dimSettings = this.changeDimSettings } else { dimSettings = this.dimSettings }
      const decisionNodeList = []
      this.addForm.forEach(item => {
        if (item.option) {
          const obj = {
            ...item,
            nodeFieldBusinessCode: item.option.key,
            nodeFieldValue: item.option.label
          }
          decisionNodeList.push(obj)
        }
      })
      const data = {
        dimViewModel: {
          applicationId: this.$store.state.app.applicationId,
          processNodeId: this.nodeId,
          dimSettings
        },
        decisionUrl: {
          decisionNodeList
        }
      }
      this.dialogFormVisible = false
      PostDeciurl(data).then(res => {
        Bus.$emit('searchPath') // 调用搜索
      })
    },
    // 新增规则流
    openDialog() {
      this.$emit('toggleComponentRuleFlow', 'ruleSetDetail', 'add')
    },
    // 去规则设置组件
    toSetting(item) {
      this.$emit('toggleComponentRuleFlow', 'ruleSetDetail', 'edit', item)
    }
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
