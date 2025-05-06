<template>
  <div class="list-report">
    <div class="app-container">
      <!-- <el-card class="mt-15">
          <div slot="header" class="card-head-style1 clearfix">
            <span>清单报表</span>
          </div>
          <div class="content">  <ManageDimension @search="search" /> </div>
        </el-card> -->

      <el-card class="mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <span>操作记录</span>
        </div>
        <div class="content">
          <el-row>
            <el-col :span="24">
              <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
                <el-col :span="8">
                  <!-- 业务单号 -->
                  <el-form-item label="用户名">
                    <el-input v-model="formInline.userId" placeholder="请输入用户信息" />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <!-- 时间范围 -->
                  <el-form-item :label="$t('listReport.timeHor')+':'">
                    <el-date-picker
                      v-model="datetimerange"
                      type="datetimerange"
                      :range-separator="$t('dashboard.to')"
                      :start-placeholder="$t('dashboard.startDate')"
                      :end-placeholder="$t('dashboard.endDate')"
                      :picker-options="pickerOptions"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" @click="searchBtn">{{ $t('listReport.inquire') }}</el-button>
                  <el-button type="primary" @click="resetFn">{{ $t('listReport.reset') }}</el-button>
                  <!-- <el-button type="primary" :loading="isLoading" @click="downloadFn">{{ $t('listReport.downloadReport') }}</el-button> -->
                </el-col>
              </el-form>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%;"
            :empty-text="$t('common.noData')"
            max-height="680"
            border
            class="mt-20"
            :header-cell-style="{
              background: '#EFF4F8',
              color: '#60769C',
              'font-weight': 'normal'
            }"
            :cell-style="{ color: '#435475' }"
          >

            <el-table-column
              type="index"
              :label="$t('common.num')"
              width="100"
            />

            <el-table-column
              prop="userId"
              label="用户名称"
            />
            <el-table-column
              prop="operationName"
              label="操作名称"
            />
            <el-table-column
              prop="operationDate"
              label="操作时间"
            />
          </el-table>

          <!-- 查看规则详情弹框 -->
          <el-dialog
            :title="$t('listReport.detail')"
            :visible.sync="listDialog"
            width="60%"
          >
            <el-table
              :data="listData"
              style="width: 100%;"
              max-height="680"
              border
              class="mt-20"
              :empty-text="$t('common.noData')"
              :header-cell-style="{
                background: '#EFF4F8',
                color: '#60769C',
                'font-weight': 'normal'
              }"
              :cell-style="{ color: '#435475' }"
            >
              <el-table-column
                prop="ruleId"
                :label="$t('ruleManage.destRuleId')"
              />
              <el-table-column
                prop="ruleName"
                :label="$t('ruleManage.destRuleName')"
              />
              <el-table-column
                prop="ruleSettingDesc"
                :label="$t('listReport.ruleContent')"
              >
                <template slot-scope="scope">
                  <div v-html="scope.row.ruleSettingDesc" />
                  <!-- <div>{{ scope.row }}</div> -->
                </template>
              </el-table-column>>
              <el-table-column
                prop="ruleExecuteResultName"
                :label="$t('listReport.ruleRes')"
                width="120"
              />
              <el-table-column
                prop="ruleForward"
                :label="$t('ruleSetting.forwardAndRe')"
              />
              <el-table-column
                prop="ruleTest"
                :label="$t('ruleSetting.trial')"
              />
              <el-table-column
                prop="ruleErrMessage"
                :label="$t('listReport.ruleError')"
                width="140"
              />
              <el-table-column
                prop="createdBy"
                :label="$t('listReport.createdBy')"
                width="80"
              />
              <el-table-column
                prop="updatedBy"
                :label="$t('listReport.updatedBy')"
                width="80"
              />
            </el-table>
            <div class="text-center mt-30">
              <el-pagination
                v-if="listDialog"
                background
                layout="prev, pager, next"
                :total="detailPageTotal"
                :page-size="pageSize"
                :current-page="detailPageNum"
                @current-change="detailPageFn"
              />
            </div>
          </el-dialog>
        </div>
        <div class="text-center mt-30">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageTotal"
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="PageCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import ManageDimension from '@/components/ManageDimension/index'
import { getAppExecuteResultsList, getAppExecuteResultDetail, getUserOperations } from '@/api/mainPages/dashboard'
import { downloadFile } from '@/utils/utils'
import { decisionDim } from '@/api/mainPages/decision'
import { getDimCodeData } from '@/api/base'
export default {
  name: 'ListReport',
  components: {
    // ManageDimension
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      unfold: false, // 维度是否展开
      appExecuteResultDims: [], // 选择后的维度数组
      form: [],
      showAllSelect: false,
      decisionDimList: [], // 维度的字段
      decisionDimComponentList: {}, // 维度字段的select值列表
      datetimerange: [],
      tableData: [],
      spanArr: [], // 记录合并行数
      pageNum: 1,
      pageTotal: 10,
      pageSize: 10,
      detailPageNum: 1,
      detailPageTotal: 0,
      listDialog: false,
      formInline: {
        userId: ''
      },
      listData: [], // 弹窗清单明细表格数据
      appExecuteResultId: '', // 查看明细的应用id
      pickerOptions: {
        // disabledDate(time) {
        //   const curDate = (new Date()).getTime()
        //   const three = 180 * 24 * 3600 * 1000
        //   const threeMonths = curDate - three
        //   return time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonths
        // }
        disabledDate: (time) => {
          const minDate = new Date()
          minDate.setMonth(minDate.getMonth() - 6)
          minDate.setHours(0, 0, 0, 0)

          const maxDate = new Date()
          maxDate.setDate(maxDate.getDate() + 1)
          maxDate.setHours(0, 0, 0, 0)

          return time.getTime() < minDate.getTime() || time.getTime() > maxDate.getTime()
        }
      },
      isLoading: false
    }
  },
  computed: {
    grid() {
      return {
        grid: this.lang === 'en' ? 8 : 6
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 点击更多出现维度列
    unfoldFn() {
      this.unfold = !this.unfold
    },
    // 重置函数
    resetFn() {
      this.formInline.userId = ''
      this.datetimerange = []
      this.tableData = []
      this.pageTotal = 1
    },
    // 维度选择函数
    changeSelect(item, index) {
      this.form[index].dimId = item.dimId
      this.appExecuteResultDims = this.form.map(item => {
        return { dimId: item.dimId, dimValue: item.key }
      })
    },
    // 维度渲染函数
    async init() {
      this.searchBtn()
    },

    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getUserOperationsList()
    },
    // 合并列
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row.appExecuteResultId, column)
      // this.tableData.filter()

      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) { // 开始合并的列的下标
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },

    //
    detailPageFn(pageNum) {
      this.detailPageNum = pageNum
      this.listDetail(this.appExecuteResultId)
      this.detailPageNum = 1
    },
    searchBtn() {
      this.pageNum = 1
      this.getUserOperationsList()
    },
    // 点击查询按钮根据关键字查询业务清单
    getUserOperationsList() {
      const data = {
        userId: this.formInline.userId,
        startDate: this.datetimerange.length > 0 ? moment(this.datetimerange[0]).format('YYYY-MM-DDTHH:mm:ss') : null,
        endDate: this.datetimerange.length > 0 ? moment(this.datetimerange[1]).format('YYYY-MM-DDTHH:mm:ss') : null,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getUserOperations(data).then(res => {
        this.tableData = res.list
        this.pageTotal = res.total
        this.tableData.forEach(item => {
          const date = new Date(item.operationDate)
          const formattedDate = date.getFullYear() + '年' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '月' +
                    ('0' + date.getDate()).slice(-2) + '日 ' +
                    ('0' + date.getHours()).slice(-2) + '时' +
                    ('0' + date.getMinutes()).slice(-2) + '分' +
                    ('0' + date.getSeconds()).slice(-2) + '秒'
          item.operationDate = formattedDate
          // item.operationName = item.operationName.substring(2, item.operationName.length - 2)
        })
        console.log(this.tableData)
      })
    },
    // 创建一个数组,用来记录合并索引和行数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        // debugger
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].appExecuteResultId === data[i - 1].appExecuteResultId) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    async downloadFn() {
      if (!this.isLoading) {
        if (this.timerId) {
          clearTimeout(this.timerId)
          this.timerId = null
        }
        this.isLoading = true
        if (this.datetimerange.length === 0) {
          this.isLoading = false
          this.$message.error(this.$t('listReport.selectDate'))
          return
        } else {
          this.$message.success('操作成功')
          const data = {
            applicationId: this.$store.state.app.applicationId,
            begin: moment(this.datetimerange[0]).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(this.datetimerange[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          await downloadFile('/downloadAppExecuteResults', data, this.$t('listReport.ruleResTable'))
          this.timerId = setTimeout(() => {
            this.isLoading = false
          }, 2000)
        }
      }
    }

  }

}

</script>
  <style lang='scss'>
  .list-report {
    .label {
      color: #435475;
      font-weight: normal;
      margin-bottom: 5px;
      font-size: 14px;
      height: 20px;
      width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: MicrosoftYaHei;
      &:hover {
        overflow: visible;
      }
    }
    .el-input__inner {
      border: 1px solid #CED5DB;
      border-radius: 0;
      height: 34px;
      line-height: 34px;
    }
    .el-select .el-input .el-select__caret {
      line-height: 34px;
    }
    .decision-btn-wrap {
        min-width: 250px;
    }
    .decision-select-wrap {
        overflow: hidden;
        transition: all .5s;
    }
    .decision-select-content {
        transition: all .5s ease;
        &.showAll {
          max-height: 1000px;
        }
    }
    .demo-form-inline{
      margin-top: 20px;
    }
    .el-card__body{
      padding: 0 20px 20px 20px;
    }
    .more{
      font-size: 14px;
      margin-top: 10px;
      &:hover{
        cursor: pointer;
      }
      img{
        width: 13px;
        height: 13px;
        z-index: 1;
        padding-top: 3px;
        padding-right: 3px;
      }
    }

  }

  </style>
