<template>
  <div v-loading="fullscreenLoading" class="dashboard app-container width-auto">
    <el-row :gutter="15">
      <el-col :span="16">
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('dashboard.monMes') }}</span>
          </div>
          <div
            style="min-height:440px;max-width:1100px;margin:0 auto"
            class="scroll"
          >
            <div
              id="main"
              class="charts"
              style="height:436px;min-width:1100px;"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('dashboard.statsInfo') }}</span>
          </div>
          <div class="text-right">
            <el-date-picker
              v-model="dataTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              :range-separator="$t('dashboard.to')"
              :start-placeholder="$t('dashboard.startDate')"
              :end-placeholder="$t('dashboard.endDate')"
              align="right"
              @change="updateChart"
              style="width: 100%;"
            />
          </div>
          <div id="chart" class="charts" />
        </el-card>
      </el-col>
      <el-col :span="16" class="mt-15">
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('dashboard.decPro') }}</span>
          </div>
          <div class="content text-center">
            <img v-if="lang==='zh'" class="img" src="./images/img-1.png" alt="">
            <img v-else class="img" src="./images/img-2.png" alt="">
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="mt-15">
        <el-card>
          <div slot="header" class="card-head-style1 flex-wrap">
            <span>{{ $t('dashboard.basicInfo') }}</span>
            <span
              style="margin-left:auto"
              class="base-message"
            ><span class="name f17" style="width:auto">{{ $t('dashboard.updateTime') }}:</span><span>{{ ruleSetting.time }}</span></span>
          </div>
          <div class="content flex-wrap flex-column" :style="{'padding':lang==='en'?'0px':'30px'}">
            <ul class="base-message">
              <li>
                <span :class="lang==='en'?'enWidth':'name'"> {{ $t('dashboard.approvalRuleNum') }}: </span>
                <span class="value"> {{ ruleSetting.approvalRuleNum }}</span>
              </li>
              <li>
                <span :class="lang==='en'?'enWidth':'name'"> {{ $t('dashboard.testRuleNum') }}: </span>
                <span class="value">{{ ruleSetting.testRuleNum }}</span>
              </li>
              <li>
                <span :class="lang==='en'?'enWidth':'name'"> {{ $t('dashboard.allRuleNum') }}: </span>
                <span class="value"> {{ ruleSetting.allRuleNum }}</span>
              </li>
              <li>
                <span :class="lang==='en'?'enWidth':'name'"> {{ $t('dashboard.decisionUrlNum') }}: </span>
                <span class="value"> {{ ruleSetting.decisionUrlNum }}</span>
              </li>
            </ul>
            <div style="margin-top:auto" class="card-footer-wrap text-center" :style="{'top':lang==='en'?'-20px':'30px'}">
              <span>{{ $t('dashboard.version') }}：{{ presentVersion }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import { getStatist } from '@/api/mainPages/dashboard'
import {
  GetPresentVersion
} from '@/api/mainPages/version-management'
import {
  appExecuteResult,
  appRuleSetting,
  getStatistRealTime
} from '@/api/mainPages/dashboard'
import bus from './event-bus'
import { bomClassAndField, getbomClassAndUpdateTime, getUpateDate } from '@/api/systemManage/bom'
const color = ['#00B1FF', '#00E5DD', '#FFB800', '#FF8487', '#8AE438', '#0069E9']
export default {
  name: 'Dashboard',
  data() {
    let _minTime = null
    let _maxTime = null
    return {
      presentVersion: null,
      lang: this.$store.state.settings.lang,
      dataTime: [],
      pieChartOption: [], // 饼图的数据
      lineChartOption: [], // 折线图的数据
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
      ruleSetting: {
        // 规则统计
        approvalRuleNum: 0, // 待审核规则数
        testRuleNum: 0, // 试运行
        allRuleNum: 0, // 总规则
        decisionUrlNum: 0 // 总决策路径
      },
      fullscreenLoading: true // 页面loading状态
    }
  },
  created() {
    const now = new Date()
    const start = new Date(now.getTime() - 3600 * 1000 * 24 * 1)
    this.dataTime = [start, now] // 默认值往前面推一天
    this.appExecuteResult()
    this.appRuleSetting()
    this.GetPresentVersion()
    this.getbomClassAndUpdateTime()
    // this.getBomClassAndField()
    // this.getUpateDate()
  },
  mounted() {
    this.initChartLine()
    this.initChartPie()
    this.intervalLineChart = setInterval(this.updateStatist, 1000 * 60)
  },
  beforeDestroy() {
    this.intervalLineChart && clearInterval(this.intervalLineChart)
  },
  methods: {
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = await this.$forage.getItem('bomBaseInfoId_Time')
      if (res1 && res1.updatedDate === time) {
        const storedData = await this.$forage.getItem('bomBaseInfoId')
        this.treeDataArry = [storedData]
      } else {
        this.getBomClassAndField()
      }
    },
    // 获取bom信息存入缓存，以便后续使用
    async getBomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo,
        loadChildren: true
      }
      bus.$emit('fullscreenLoading', this.fullscreenLoading)
      try {
        let data1 = []
        await bomClassAndField(data).then(async res => {
          data1 = res
          if (data1) {
            // this.fullscreenLoading = false
            bus.$emit('fullscreenLoading', this.fullscreenLoading)
          }
          const data2 = [res]
          await this.GetIdExpressionId(data2[0])
        })

        const res = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
        await this.$forage.setItem('bomBaseInfoId', data1)
        await this.$forage.setItem('bomBaseInfoId_Time', res.updatedDate)
      } catch (error) {
        console.error('Error:', error)
      }
    },
    GetIdExpressionId(data) {
      if (data.dataType === 'method') {
        const obj = {
          beforeParamType: data.type,
          codeService: data.codeService,
          expressionArray: data.detailsList,
          expressionDesc: data.label,
          expressionId: data.path,
          returnType: data.returnType,
          dataType: data.dataType
        }
        const existingData = JSON.parse(localStorage.getItem('IdExpressionList'))
        existingData[(obj.expressionId).toUpperCase()] = (obj)
        localStorage.setItem('IdExpressionList', JSON.stringify(existingData))
      }
      if (data.children) {
        for (const child of data.children) {
          this.GetIdExpressionId(child)
        }
      }
    },
    // // 查看更新时间
    // async getUpateDate() {
    //   const data = {
    //     bomBaseInfoId: this.$store.state.bom.bomBaseInfo
    //   }
    //   await getUpateDate(data).then(async res => {
    //     const time = await this.$forage.getItem('bomBaseInfoId_Time')
    //     if (res.updatedDate === time) {
    //     } else {
    //       this.getBomClassAndField()
    //     }
    //   })
    // },
    // 获取版本
    GetPresentVersion() {
      GetPresentVersion(this.$store.state.app.applicationId).then(res => {
        if (res && res.versionNo) {
          this.presentVersion = res.versionNo
        }
      })
    },
    updateChart() {
      this.appExecuteResult()
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
              itemStyle: { color: '#F56C6C' }
            }
          }
          return {
            value: result.count,
            name: result.resultName + ' ' + result.count
          }
        })
        this.pieChart.setOption({
          series: [{ data: this.pieChartOption }],
          legend: {
            data: this.pieChartOption.map(item => item.name)
          }
        })
      })
    },

    // 饼图初始化
    initChartPie() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10
        },
        color: color,
        series: [
          {
            name: this.$t('dashboard.info'),
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{ value: 0, name: '' }]
          }
        ]
      }
      this.pieChart = echarts.init(document.getElementById('chart'))
      this.pieChart.setOption(option)
    },

    // 十分钟一次 拉取折线图数据
    updateStatist() {
      const lastTime = this._.last(this.lineChartOption)
      const data = {
        applicationId: this.$store.state.app.applicationId,
        time: lastTime[0]
      }
      // 删除第一个，追加最新数据
      getStatistRealTime(data).then(res => {
        this.lineChartOption.push(res)
        this.lineChartOption.shift()
        this.lineChart.setOption({ series: [{ data: this.lineChartOption }] }) // 更新图表数据
      })
    },

    // 折线图初始化
    async initChartLine() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          color: color,
          backgroundColor: '#fff',
          padding: 10,
          textStyle: {
            fontSize: 12,
            color: '#152934',
            lineHeight: 24
          },
          extraCssText:
            'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); border-radius: 0;'
        },
        grid: {
          left: '35',
          right: '22',
          bottom: '30',
          top: '34'
        },
        dataZoom: [
          // X轴滚动条
          {
            show: true,
            type: 'slider'
          }
        ],
        yAxis: [
          {
            boundaryGap: [0, '100%'],
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#5A6872',
              fontSize: 11
            },
            axisTick: { show: false },
            type: 'value'
          }
        ],
        xAxis: [
          {
            type: 'time', // x轴为 时间轴
            splitLine: { show: false },
            axisLine: {
              lineStyle: { width: 0 }
            },
            axisLabel: {
              color: '#5A6872',
              fontSize: 11
            },
            splitNumber: 24,
            axisTick: { show: false },
            boundaryGap: false
          }
        ],
        series: [
          {
            name: this.$t('dashboard.app'),
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#F0F5FF'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ])
            },
            showSymbol: false,
            hoverAnimation: false,
            color: '#4CB3FF'
          }
        ]
      }
      // 基于准备好的dom，初始化echarts实例
      this.lineChart = echarts.init(document.getElementById('main'))
      this.lineChart.setOption(option)
      // 给折线图标塞数据
      getStatist(this.$store.state.app.applicationId).then(res => {
        this.lineChartOption = res
        this.lineChart.setOption({ series: [{ data: res }] })
      })
    },

    // 查询规则的统计信息
    appRuleSetting() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      appRuleSetting(data).then(res => {
        this.fullscreenLoading = false
        this.ruleSetting = {
          ...res,
          time: moment(new Date(res.time)).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  .img {
    max-width: 100%;
    max-height: 250px;
  }
  .charts {
    max-width: 100%;
    height: 400px;
  }
  .content {
    height: 300px;
    padding: 30px;
  }
  .base-message {
    list-style: none;
    padding: 0px;
    .name {
      display: inline-block;
      width: 160px;
      color: #60769c;
    }
    .enWidth{
      display: inline-block;
      width: 300px;
      color: #60769c;
    }
    .value {
      color: #273756;
    }
    li {
      margin-bottom: 22px;
      font-size: 20px;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        background-image: url('./images/icon-5.png');
        background-size: 100%;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }
    }
  }
  .card-footer-wrap {
    position: relative;
    top: 30px;
    color: #60769c;
    font-size: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: inline-block;
      font-size: 14px;
      margin: 0 5px;
    }
    &::before {
      content: '';
      width: 67px;
      height: 1px;
      display: inline-block;
      background: linear-gradient(
        243deg,
        #ced5db 0%,
        rgba(206, 213, 219, 0) 100%
      );
    }
    &::after {
      content: '';
      width: 67px;
      height: 1px;
      display: inline-block;
      background: linear-gradient(
        90deg,
        #ced5db 0%,
        rgba(206, 213, 219, 0) 100%
      );
    }
  }
}
</style>
