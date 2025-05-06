<template>
  <div class="thirdColumn">
    <FourthRow class="chart"/>
    <!--        <div class="chart thirdColumnLineChart"></div>-->
    <div class="chart lowTriggerMonitorRule">
      <div class="chartHeader">
        <div class="fourthRowTitle">低触发规则监控</div>
        <div class="more" @click="more">更多</div>
      </div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in lowTriggerMonitorRule" :key="index">
          <div class="ordinal">{{ index + 1 }}、</div>
          <div class="ruleCode">{{ item.ruleId }}</div>
          <div class="description" :title="item.ruleName">{{ item.ruleName }}</div>
          <div class="dailyTriggerCount">日均触发<span style="color: #E17373">{{ item.count }}</span>次
          </div>
        </div>
        <div class="noDataYet" v-if="!lowTriggerMonitorRule.length">
          <img src="../images/noDataYet.png" alt="">
        </div>
      </div>
    </div>
    <div class="chartMini">
      <el-date-picker
          class="date"
          v-model="dataTime"
          type="daterange"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        @change="updateChart"
      </el-date-picker>
      <div class="thirdColumnPieCharts"></div>
    </div>
    <el-dialog
        title="低触发规则监控"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="closeFn"
        width="900px">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="规则ID">
              <el-input v-model="queryForm.ruleId" placeholder="请输入规则ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规则名称">
              <el-input v-model="queryForm.ruleName" placeholder="请输入规则名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <div class="onSearch">
            <el-button type="primary" @click="onSearch">查询</el-button>
          </div>
        </el-row>
      </el-form>
      <el-table :data="tableData" border style="width: 100%" height="800px"
                :empty-text="$t('common.noData')"
                max-height="680"
                class="mt-20"
                :header-cell-style="{
              background: '#EFF4F8',
              color: '#60769C',
              'font-weight': 'normal'
            }"
                :cell-style="{ color: '#435475' }" v-loading="tableLoading">
        <el-table-column type="index" label="序号" align="center" width="50"/>
        <el-table-column prop="ruleId" label="规则ID" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" class="result-popper" v-html="scope.row.ruleDesc"></div>
              <div>{{ scope.row.ruleId }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" class="result-popper" v-html="scope.row.ruleDesc"></div>
              <div>{{ scope.row.ruleName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="日均触发次数" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content" class="result-popper" v-html="scope.row.ruleDesc"></div>
              <div>{{ scope.row.count }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

import echarts from 'echarts'
import moment from "moment";
import {appExecuteResult} from "@/api/mainPages/dashboard";
import FourthRow from "@/views/mainPages/dashboard/components/fourthRow.vue";
import {getLowHitRule, getLowHitRuleList} from "@/views/mainPages/dashboard/api";
import Treeselect from "@riophae/vue-treeselect";

const color = ['#00B1FF', '#00E5DD', '#FFB800', '#FF8487', '#8AE438', '#0069E9']
export default {
  name: 'thirdColumn',
  components: {Treeselect, FourthRow},
  props: {},
  data() {
    let _minTime = null
    let _maxTime = null
    return {
      dataTime: [],
      lowTriggerMonitorRule: [],
      pieChart: null,
      pickerOptions: {
        onPick(time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            const timeRange = 7 * 24 * 60 * 60 * 1000 // 7天
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate(time) {
          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime
          }
        },
        shortcuts: [
          {
            text: this.$t('dashboard.week'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      pieChartOption: [], // 饼图的数据
      tableData: [],
      dialogVisible: false,
      tableLoading: false,
      queryForm: {
        ruleId: '',
        ruleName: ''
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    const now = new Date()
    const start = new Date(now.getTime() - 3600 * 1000 * 24 * 1)
    this.dataTime = [start, now] // 默认值往前面推一天
  },
  mounted() {
    // this.setLineChart();
    this.getLowHitRuleFn();
    this.setPieCharts();
    this.appExecuteResult()
  },
  methods: {
    setLineChart() {
      const myChart = echarts.init(document.querySelector('.thirdColumnLineChart'));
      const option = {
        title: {
          text: '当日执行情况',
          textStyle: {
            color: '#3D3D3D',
            fontSize: 16,
            fontWeight: 600
          },
          left: '30px',
          top: '20px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          right: '30px',
          top: '20px'
        },
        xAxis: {
          type: 'category',
          data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '试运行',
            data: [7891, 234, 5678, 901, 3456, 789, 1234, 567, 8901, 234, 6789, 123, 4567],
            type: 'line',
            itemStyle: {
              color: '#FAC458'
            },
            smooth: true
          },
          {
            name: '正式运行',
            data: [4567, 321, 9876, 543, 2109, 876, 4321, 654, 987, 1230, 456, 7891, 234],
            type: 'line',
            itemStyle: {
              color: '#5B8FF9'
            },
            smooth: true
          },
        ]
      };
      myChart.setOption(option);
      window.addEventListener('resize', function () {
        if (myChart) {
          myChart.resize();
        }
      })
    },
    updateChart() {
      this.appExecuteResult()
    },
    closeFn() {
      this.queryForm = {
        ruleId: '',
        ruleName: ''
      }
    },
    more() {
      this.onSearch()
      this.dialogVisible = true
    },
    onSearch() {
      const applicationId = this.$store.state.app.applicationId
      const params = {
        ...this.queryForm,
        limit: 0
      }
      this.tableLoading = true
      getLowHitRuleList(applicationId, params).then((res) => {
        console.log(res)
        this.tableData = res.resp
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getLowHitRuleFn() {
      const applicationId = this.$store.state.app.applicationId
      getLowHitRule(applicationId, 30).then((res) => {
        console.log(res)
        this.lowTriggerMonitorRule = res.resp
      })
    },
    // 饼图数据
    appExecuteResult() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        begin: moment(this.dataTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(this.dataTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      appExecuteResult(data).then(res => {
        this.pieChartOption = res.map(result => {
          // 执行异常单独设为红色
          if (result.resultCode === '-1') {
            return {
              value: result.count,
              name: result.resultName + ' ' + result.count,
              itemStyle: {color: '#F56C6C'}
            }
          }
          return {
            value: result.count,
            name: result.resultName + ' ' + result.count
          }
        })
        this.pieChart.setOption({
          series: [{data: this.pieChartOption}],
          legend: {
            data: this.pieChartOption.map(item => item.name)
          }
        })
      })
    },
    setPieCharts() {
      const option = {
        title: {
          text: '统计信息',
          textStyle: {
            color: '#3D3D3D',
            fontSize: 16,
            fontWeight: 600
          },
          left: '20px',
          top: '20px'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          left: '20px',
          top: '50px',
          orient: 'vertical'
        },
        color: color,
        series: [
          {
            name: this.$t('dashboard.info'),
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{value: 0, name: ''}]
          }
        ]
      }
      this.pieChart = echarts.init(document.querySelector('.thirdColumnPieCharts'))
      this.pieChart.setOption(option)
      window.addEventListener('resize', function () {
        if (this.pieChart) this.pieChart.resize();

      })
    }
  },
}


</script>

<style lang="scss" scoped>
.thirdColumn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .chart {
    width: calc((75% / 2) + 9px);
    border-radius: 4px;
    height: 430px;
    margin-right: 20px;
    background-color: #FFFFFF;
  }

  .lowTriggerMonitorRule {
    padding: 20px;

    .chartHeader {
      height: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .fourthRowTitle{
        font-weight: 600;
        color: #3d3d3d;
        padding-left: 10px;
      }
      .more {
        cursor: pointer;
      }
    }

    .list {
      height: calc(100% - 28px);
      overflow-y: auto;

      .list-item {
        display: flex;
        margin-bottom: 10px;
        .ordinal{
          width: 30px;
        }
        .ruleCode{
          width: 110px;
          margin-right: 10px;
        }
        .dailyTriggerCount{
          width: 100px;
        }
        .description {
          width: calc(100% - 250px);
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
      }
    }
  }

  .chartMini {
    width: 25%;
    height: 430px;
    background-color: #FFFFFF;
    position: relative;
    border-radius: 4px;

    .date {
      width: 280px;
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 999999;
    }

    .thirdColumnPieCharts {
      width: 100%;
      height: 100%;
    }
  }
}

.noDataYet {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.onSearch {
  height: 82px;
  display: flex;
  align-items: flex-end;
}

.result-popper {
  max-height: 650px !important; /* 限制最大高度 */
  max-width: 700px !important; /* 限制最大高度 */
  overflow-y: auto !important; /* 添加垂直滚动条 */
  padding-right: 15px !important; /* 给滚动条留出空间 */
  line-height: 22px !important; /* 增加行高提升可读性 */
  font-size: 13px;
}

.el-form-item {
  margin: 0;
}
</style>

