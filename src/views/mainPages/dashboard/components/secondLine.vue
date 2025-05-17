<template>
  <div class="secondLine">
    <div class="chart Histogram"></div>
    <div class="chart LineChart"></div>
    <div class="chartMini PieCharts"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
import {getStatist, getStatistRealTime} from "@/api/mainPages/dashboard";
import {getLineGraph, getPieChart} from "@/views/mainPages/dashboard/api";

const color = ['#00B1FF', '#00E5DD', '#FFB800', '#FF8487', '#8AE438', '#0069E9']
export default {
  name: 'secondLine',
  components: {},
  props: {},
  data() {
    return {
      lineChartOption: [],
      lineChart: null
    };
  },
  computed: {},
  watch: {
  },
  created() {
  },
  beforeDestroy() {
    console.log('离开')
    clearInterval(this.intervalLineChart)
  },
  mounted() {
    this.intervalLineChart = setInterval(this.updateStatist, 1000 * 60)
    this.setHistogram();
    this.setLineChart();
    this.setPieCharts();
  },
  methods: {
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
        this.lineChart.setOption({series: [{data: this.lineChartOption}]}) // 更新图表数据
      })
    },
    setHistogram() {
      const option = {
        title: {
          text: '监控信息',
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
        legend: {
          show: true,
          right: '30px',
          top: '20px'
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
            axisTick: {show: false},
            type: 'value'
          }
        ],
        xAxis: [
          {
            type: 'time', // x轴为 时间轴
            splitLine: {show: false},
            axisLine: {
              lineStyle: {width: 0}
            },
            axisLabel: {
              color: '#5A6872',
              fontSize: 11
            },
            splitNumber: 24,
            axisTick: {show: false},
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
      this.lineChart = echarts.init(document.querySelector('.Histogram'))
      this.lineChart.setOption(option)
      // 给折线图标塞数据
      getStatist(this.$store.state.app.applicationId).then(res => {
        this.lineChartOption = res
        this.lineChart.setOption({series: [{data: res}]})
      })
      window.addEventListener('resize', function () {
        if (this.lineChart) this.lineChart.resize();
      })
    },
    async setLineChart() {
      const applicationId = this.$store.state.app.applicationId
      const {resp: {failed, success, time}} = await getLineGraph(applicationId)
      const myChart = echarts.init(document.querySelector('.LineChart'));
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
          data: time || []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '失败',
            data: failed || [],
            type: 'line',
            itemStyle: {
              color: '#FA8658'
            },
            smooth: true
          },
          {
            name: '成功',
            data: success || [],
            type: 'line',
            itemStyle: {
              color: '#91CC75'
            },
            smooth: true
          },
        ]
      };
      myChart.setOption(option);
      window.addEventListener('resize', function () {
        if (myChart) myChart.resize();
      })
    },
    async setPieCharts() {
      const res = await getPieChart(this.$store.state.app.applicationId)
      console.log(res)
      const myChart = echarts.init(document.querySelector('.PieCharts'));
      const option = {
        title: {
          text: '规则分布',
          textStyle: {
            color: '#3D3D3D',
            fontSize: 16,
            fontWeight: 600
          },
          left: '30px',
          top: '20px'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: true,
          right: '30px',
          top: '20px',
          // 竖着排列
          orient: 'vertical'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            top: '30px',
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: res.resp.simpleRuleCount, name: '一般规则', itemStyle: {color: '#7AE0B7'}},
              {value: res.resp.tableCount, name: '决策表', itemStyle: {color: '#7BA5FA'}},
              {value: res.resp.ruleFlowCount, name: '规则流', itemStyle: {color: '#7C8BA7'}},
              {value: res.resp.ruleTreeCount, name: '决策树', itemStyle: {color: '#E4B936'}},
            ]
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener('resize', function () {
        if (myChart) myChart.resize();
      })
    }
  },
}


</script>

<style lang="scss" scoped>
.secondLine {
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

  .chartMini {
    width: 25%;
    height: 430px;
    border-radius: 4px;
    background-color: #FFFFFF;
  }
}
</style>

