<template>
  <div class="page">
    <div :id="pageId" ref="graphContainer" class="graph-container1" style="position: relative;" />
    <div class="divBox"></div>
  </div>
</template>
<script>
import G6 from '@antv/g6'
import { initBehavors } from '../../behavior'
import { decisionFlowChartDetail } from '@/api/mainPages/ruleFlow'
import start from '../../assets/icons/start.png'
import finish from '../../assets/icons/finish.png'
import sublevel from '../../assets/icons/sublevel.png'
import branch from '../../assets/icons/branch.png'
import rule from '../../assets/icons/rule.png'

/* TODO: 流程图的展示模式是否直接使用dagre来进行自动布局？
*/

export default {
  props: {
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 850
    },
    flowSettingObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageId: 'graph-container1',
      graph: null
    }
  },
  created() {
    initBehavors()
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
      if (this.flowSettingObj && this.flowSettingObj.flowSettingId) {
        this.getRuleFlow()
      }
    })
  },
  methods: {
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
          checkNodes: res.ruleSetting || []
        }
      })
      return arr
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
          checkNodes: res.ruleSetting || []
        }
      })
      return arr
    },
    async getRuleFlow() {
      await decisionFlowChartDetail(this.flowSettingObj.flowSettingId).then(res => {
        this.resForm = { ...res }
        const dataObj = {
          nodes: this.getNode(res.nodes),
          edges: this.getCondition(res.conditions)
        }
        this.readAllData(dataObj)
      })
    },
    init() {
      // const height = this.height - 42
      // const width = this.width - 400

      const graphContainer = this.$refs.graphContainer
      const width = graphContainer.offsetWidth
      const height = graphContainer.offsetHeight
      this.graph = new G6.Graph({
        container: 'graph-container1',
        height: height,
        width: width,
        groupType: 'rect',
        groupStyle: {
          default: {},
          hover: {},
          collapse: {}
        },
        modes: {
          // 支持的 behavior
          default: [
            'drag-canvas',
            'zoom-canvas',
            'hover-node',
            'select-node',
            'hover-edge',
            'keyboard',
            'customer-events',
            'add-menu',
            'drag-node'
          ],
          mulitSelect: ['mulit-select'],
          addEdge: ['add-edge']
          // moveNode:[ "drag-item"]
        }
      })
      this.readData()
    },
    readAllData(data) {
      this.graph.read(data)
    },
    readData() {
      const data = this.data
      if (data) {
        this.graph.read(data)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page{
  height:100%;
  position: relative;
  .divBox{
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index: 99;
  }
}
#graph-container1{
  height:100%;
  height:500px;
}
</style>
