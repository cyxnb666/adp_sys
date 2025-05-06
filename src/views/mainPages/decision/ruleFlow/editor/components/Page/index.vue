<template>
  <div class="page">
    <div :id="pageId" ref="graphContainer" class="graph-container" style="position: relative;" />
  </div>
</template>
<script>
import G6 from '@antv/g6'
import { initBehavors } from '../../behavior'

/* TODO: 流程图的展示模式是否直接使用dagre来进行自动布局？
*/

export default {
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageId: 'graph-container',
      // graph: null
    }
  },
  created() {
    initBehavors()
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      // const height = this.height - 42
      // const width = this.width - 400

      const graphContainer = this.$refs.graphContainer
      const width = graphContainer.offsetWidth
      const height = graphContainer.offsetHeight
      this.graph = new G6.Graph({
        container: 'graph-container',
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
      const { editor, command } = this.$parent
      editor.emit('afterAddPage', { graph: this.graph, command })

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

<style scoped>
.page{
  margin-left:140px;
  margin-right: 300px;
  height:100%;
}
#graph-container{
  height:100%;
}
</style>
