<template>
  <div class="ruleflow">
    <div class="app-container">
      <el-card class="mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <span> {{ isApprovel ? '规则流审批' + '-' + resForm.flowName : '规则流设置' }} </span>
          <el-button class="btn-background" @click="toggleComponentRuleFlow">
            重新选择规则流
          </el-button>
        </div>
        <div class="content">
          <div ref="container" class="container">
            <G6Editor ref="G6Editor" mode="edit" :dim-settings.sync="dimSettings"
            v-bind="{ flowSettingObj, isApprovel, resForm, type, decisionUrlId }"
            v-on="{ savaRule: (data, cb) => $emit('savaRule', data, cb), toggleComponentRuleFlow }"/>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { decisionFlowChartDetail } from '@/api/mainPages/ruleFlow'
import G6Editor from './editor/components/G6Editor/index'
import start from './editor/assets/icons/start.png'
import finish from './editor/assets/icons/finish.png'
import sublevel from './editor/assets/icons/sublevel.png'
import branch from './editor/assets/icons/branch.png'
import rule from './editor/assets/icons/rule.png'

export default {
  components: { G6Editor },
  props: {
    type: String,
    decisionUrlId: String,
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    isApprovel: {
      type: Boolean,
      default: false
    },
    flowSettingObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      graph: null,
      resForm: {
        flowName: '',
        flowSettingId: '',
        flowType: '1'
      },
      flowSettingId: '',
      data: {
      }
    }
  },
  watch: {
    // dimSettings(val) {
    //   this.dimSettingsVal = val
    // }
  },
  mounted() {
    this.flowSettingObj ? this.flowSettingId = this.flowSettingObj.flowSettingId : ''
    // 在节点的配置中定义状态样式
    G6.registerNode(
      'sql',
      {
        drawShape(cfg, group) {
          const rect = group.addShape('rect', {
            attrs: {
              x: -50,
              y: -25,
              width: 100,
              height: 50,
              radius: 10,
              stroke: 'red',
              fill: 'red',
              lineWidth: 1
            },
            name: 'rect-shape'
          })
          return rect
        }
      },
      'single-node'
    )
    // this.initGraph()
    if (this.flowSettingId) {
      this.getRuleFlow()
    }
  },
  created() {
  },
  methods: {
    saveRule($event) {
      this.$emit('saveRule', $event)
    },
    // 去规则设置组件
    toggleComponentRuleFlow() {
      if (this.isApprovel) {
        this.$emit('toRuleFlowApprove', 'ruleFlowList', 'return')
      } else {
        this.$emit('toggleComponentRuleFlow', 'ruleFlowList', 'return')
      }
    },
    getCondition(data) {
      const arr = data.map(res => {
        return {
          sourceId: res.preFlowNodeId,
          targetId: res.nextFlowNodeId,
          source: res.preFlowNodeId,
          target: res.nextFlowNodeId,
          label: res.conditionName,
          shape: 'customEdge',
          type: 'edge',
          id: res.flowConditionId,
          checkNodes: res.ruleSetting || [],
          checkedTables: res.decisionTables || []
        }
      })
      return arr
    },
    getNode(data) {
      const arr = data.map(res => {
        return {
          childFlowDefId: res.childFlowDefId || '', // 子流节点所设置的规则流IS
          label: res.flowNodeName,
          id: res.flowNodeId,
          flowNodeType: res.flowNodeType,
          image: res.flowNodeType === 'START_NODE' ? start : res.flowNodeType === 'END_NODE'
            ? finish : res.flowNodeType === 'CHILD_FLOW_NODE' ? sublevel : res.flowNodeType === 'JUDGMENT_NODE' ? branch
              : res.flowNodeType === 'PACKET_NODE' ? rule : '',
          isDoingEnd: true,
          type: 'node',
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          offsetX: res.offsetX,
          offsetY: res.offsetY,
          x: res.x,
          y: res.y,
          color: '#1890ff',
          shape: res.flowNodeType === 'JUDGMENT_NODE' ? 'customPolygon' : 'customNode',
          checkNodes: res.ruleSetting || [],
          checkedTables: res.decisionTables || []
        }
      })
      return arr
    },
    async getRuleFlow() {
      await decisionFlowChartDetail(this.flowSettingId).then(res => {
        this.resForm = { ...res }
        const dataObj = {
          nodes: this.getNode(res.nodes),
          edges: this.getCondition(res.conditions)
        }
        this.$refs.G6Editor.readData(dataObj)
      })
    },
    nodeType(node) {
      var dataType = ''
      if (node === 'START_NODE') {
        dataType = 'sql'
      }
      if (node === 'PACKET_NODE') {
        dataType = 'alps'
      }
      if (node === 'JUDGMENT_NODE') {
        dataType = 'diamond'
      }
      if (node === 'END_NODE') {
        dataType = 'sql'
      }
      return dataType
    }
  }
}
</script>

<style scoped>
.app-container{
    padding: 20px;
    min-width: 1138px;
    max-width: 1400px;
    margin: 0 auto;
}
.container {
  width: 100%;
  height: 810px;
  text-align: center;
  font-size: 14px;
  padding-left: 0!important;
}
.selected{
  background-color: #17d56b;
}
  .btn-background{
    position: absolute;
    right:20px;
    top:5px;
  }
</style>
