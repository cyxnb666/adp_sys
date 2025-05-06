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
          <span>{{ $t('listReport.listReport') }}</span>
        </div>
        <div class="content">
          <el-form ref="formInline" label-width="75px" :inline="true" :model="formInline" label-position="left" class="demo-form-inline">
                <el-row>
                  <el-col :span="7">
                    <!-- 业务单号 -->
                    <el-form-item :label="$t('listReport.businessKey')">
                      <el-input v-model="formInline.businessKey" :placeholder="$t('listReport.enterBusinessKey')" style="width: 203px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="15">
                    <!-- 时间范围 -->
                    <el-form-item :label="$t('listReport.timeHor')">
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
                  <el-col :span="2">
                    <!-- <span class="more" @click="unfoldFn">
                      <i :class="unfold ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
                      {{ unfold?$t('listReport.packUp'):$t('listReport.more') }}
                    </span> -->
                    <el-button type="text" style="margin-left: auto;">
                      <span class="more" @click="unfoldFn">
                        {{ unfold?$t('listReport.packUp'):$t('listReport.more') }}
                        <i :class="unfold ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
                      </span>
                    </el-button>
                  </el-col>
                </el-row>

                <el-row
                  v-if="unfold"
                  ref="selectContent"
                  :gutter="10"
                  class="decision-select-content"
                  :class="{ showAll: showAllSelect }"
                >
                  <el-col
                    v-for="(item, index) in decisionDimList"
                    :key="item.dimId"
                    :xs="10"
                    :sm="7"
                    :xl="5"
                  >
                    <!-- 维度列 -->
                    <el-form-item>
                      <template #label>
                        <span class="overflow" v-popper.overflow="{ content: item.dimName, options: { placement: 'top-start' } }">{{ item.dimName }}</span>
                      </template>
                      <el-select
                        v-model="form[index]"
                        value-key="key"
                        filterable
                        :placeholder="$t('common.pleaseChoose')"
                        @change="changeSelect(item, index)"
                      >
                        <el-option :label="$t('common.all')" :value="{ key: 'ALL', value: $t('common.all') }" />
                        <el-option
                          v-for="items in decisionDimComponentList[index]"
                          :key="items.key"
                          :label="items.key + items.label"
                          :value="items"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
          </el-form>
          <!-- <el-row> style="margin-top: 20px;"
            <el-col :span="24" :offset="17">
              <el-button type="primary" @click="searchBtn">{{ $t('listReport.inquire') }}</el-button>
              <el-button type="primary" @click="resetFn">{{ $t('listReport.reset') }}</el-button>
              <el-button type="primary" :loading="isLoading" @click="downloadFn">{{ $t('listReport.downloadReport') }}</el-button>
              <el-button type="primary" :loading="isLoading" @click="downloadFn">测试环境批量执行</el-button>
            </el-col>
          </el-row> -->

          <div>
            <el-button type="primary" @click="searchBtn">{{ $t('listReport.inquire') }}</el-button>
            <el-button type="primary" @click="resetFn">{{ $t('listReport.reset') }}</el-button>
            <el-button type="primary" :loading="isLoading" @click="downloadFn">{{ $t('listReport.downloadReport') }}</el-button>
          </div>

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
              width="80"
              :label="$t('common.num')"
            />

            <el-table-column
              prop="applicationId"
              :label="$t('versionList.applicationId')"
              width="100"
            />
            <el-table-column
              prop="businessKey"
              :label="$t('listReport.businessKey')"
              width="100"
            />
            <el-table-column
              prop="resultName"
              :label="$t('listReport.resultName')"
              width="110"
            />
            <el-table-column
              prop="testResultName"
              :label="$t('listReport.testResultName')"
              width="150"
            />
            <el-table-column
              prop="executeDate"
              :label="$t('listReport.executeDate')"
              width="140"
            />
            <el-table-column
              prop="useTimes"
              :label="$t('listReport.useTimes')+'（ms）'"
              width="100"
            />
            <el-table-column
              :label="$t('listReport.useSuccess')"
              width="110"
            />

            <el-table-column
              prop="errMessage"
              :label="$t('listReport.errMessage')"
              width="140"
            />
            <el-table-column
              :label="$t('common.operation')"
            >
              <template slot-scope="scope">
                <el-button
                  class="btn-border mini"
                  @click="listDetail(scope.row.appExecuteResultId)"
                >{{ $t('listReport.viewDetail') }}</el-button>
              </template>
            </el-table-column>
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
import { getAppExecuteResultsList, getAppExecuteResultDetail } from '@/api/mainPages/dashboard'
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
      decisionDimComponentList: [], // 维度字段的select值列表
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
        businessKey: ''
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
      this.form = this.decisionDimList.map(item => {
        return {
          dimId: item.dimId,
          dimValue: '',
          key: '',
          value: ''
        }
      })
      this.formInline.businessKey = ''
      this.datetimerange = []
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
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return
      await decisionDim(applicationId).then(res => {
        this.decisionDimList = res
        this.form = res.map(item => {
          return {
            dimId: item.dimId,
            dimValue: '',
            key: '',
            value: ''
          } // 给维度字段默认值
        })
      })
      // 查询接口维度值列表数据
      const codeService = this.decisionDimList.map(item => {
        return item.codeService
      })
      codeService.length && this.getDimCodeData(codeService.toString())
    },
    // 查询getDimCodeData
    getDimCodeData(codeServices) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        codeServices: codeServices
      }
      getDimCodeData(data).then(res => {
        this.decisionDimList.forEach((item, index) => {
          if (res[item.codeService]) {
            const obj = JSON.parse(JSON.stringify(res[item.codeService]))
            this.decisionDimComponentList.push(obj)
          }
        })
      })
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getAppExecuteResultsList()
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
    // 点击按钮查看清单中的规则详情
    listDetail(id) {
      this.listDialog = true
      this.appExecuteResultId = id
      const data = {
        appExecuteResultId: id,
        pageNum: this.detailPageNum,
        pageSize: this.pageSize,
        applicationId: this.$store.state.app.applicationId
      }
      getAppExecuteResultDetail(data).then(res => {
        this.listData = res.list
        this.detailPageTotal = res.total
        console.log(this.listData)
        console.log(this.detailPageTotal)
      })
    },
    //
    detailPageFn(pageNum) {
      this.detailPageNum = pageNum
      this.listDetail(this.appExecuteResultId)
      this.detailPageNum = 1
    },
    searchBtn() {
      this.pageNum = 1
      this.getAppExecuteResultsList()
    },
    // 点击查询按钮根据关键字查询业务清单
    getAppExecuteResultsList() {
      const data = {
        businessKey: this.formInline.businessKey,
        applicationId: this.$store.state.app.applicationId,
        begin: moment(this.datetimerange[0]).format('YYYY-MM-DDTHH:mm:ss'),
        end: moment(this.datetimerange[1]).format('YYYY-MM-DDTHH:mm:ss'),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        appExecuteResultDims: this.appExecuteResultDims
      }
      getAppExecuteResultsList(data).then(res => {
        this.tableData = res.list
        this.pageTotal = res.total
        this.getSpanArr(res.list)
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
      .overflow {
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        width: 75px;
        padding-right: 1px;
        text-overflow: ellipsis;
        line-height: 32px;
      }
      .el-form-item__label {
        line-height: initial;
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
