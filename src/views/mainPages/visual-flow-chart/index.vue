<template>
  <div class="visual-flow-chart">
    <div class="app-container">

      <el-card class="mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <!-- 可视化流程图 -->
          <span>{{ $t('flowChart.flowChart') }}</span>
        </div>
        <div class="content">
          <div ref="container" class="container" style="" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'

export default {
  data() {
    return {
      graph: null,
      data: {
        nodes: [
          {
            id: '1',
            dataType: 'alps',
            label: '开始'
          },
          {
            id: '2',
            type: 'diamond',
            label: '险种'
            // conf: [
            //   {
            //     label: "conf",
            //     value: "pai_graph.conf"
            //   },
            //   {
            //     label: "dot",
            //     value: "pai_graph.dot"
            //   },
            //   {
            //     label: "init",
            //     value: "init.rc"
            //   }
            // ]
          },
          {
            id: '3',
            dataType: 'alps',
            label: '险种(全部) 路径包'
          },
          {
            id: '4',
            dataType: 'sql',
            label: '险种(商业险) 路径包',
            conf: [
              {
                label: 'path1',
                value: 'rule1'
              },
              {
                label: 'path2',
                value: 'rule2'
              },
              {
                label: 'path3',
                value: 'rule3'
              }
            ]
          },
          {
            id: '5',
            dataType: 'sql',
            label: '结束'
          }
        ],
        edges: [
          {
            source: '1',
            target: '2'
          },
          {
            source: '2',
            target: '3',
            label: '全部'
          },
          {
            source: '2',
            target: '4',
            label: '商业险'
          },
          {
            source: '4',
            target: '3'
          },
          {
            source: '3',
            target: '5'
          }
        ]
      }
    }
  },
  mounted() {
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
              stroke: '#5B8FF9',
              fill: '#eff4ff',
              lineWidth: 1
            },
            name: 'rect-shape'
          })
          // 悬浮黑色弹窗的内容设置
          if (cfg.name) {
            group.addShape('text', {
              attrs: {
                text: cfg.name,
                x: 200,
                y: 100,
                fill: '#00287E',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'middle',
                fontWeight: 'bold'
              },
              name: 'text-shape'
            })
          }
          return rect
        }
      },
      'single-node'
    )
    // G6.registerNode(
    //   "diamond",
    //   {
    //     drawShape(cfg, group) {
    //       const dia = group.addShape("diamond", {
    //         attrs: {
    //           x: -50,
    //           y: -25,
    //           width: 100,
    //           height: 50,
    //           radius: 10,
    //           stroke: "#5B8FF9",
    //           fill: "#C6E5FF",
    //           lineWidth: 1
    //         },
    //         name: "diamond-shape"
    //       });
    //       return dia;
    //     }
    //   },
    //   "diamond-node"
    // );
    this.initGraph()
    this.renderGraph()
  },
  methods: {
    initGraph() {
      const container = this.$refs.container
      const width = container.offsetWidth
      const height = container.offsetHeight
      this.graph = new G6.Graph({
        container: container,
        width,
        height,
        layout: {
          type: 'dagre',
          // rankdir: 'TB',
          // rankdir: "LR", // 可选，默认为图的中心
          // align: "DL", // 可选
          nodesep: 500, // 可选
          ranksep: 40, // 可选
          controlPoints: false, // 可选
          nodesepFunc: d => {
            if (d.id === '3') {
              return 10
            }
            return 100
          }
          // ranksep: 70,
          // controlPoints: true
        },
        modes: {
          default: [
            'drag-canvas',
            // 'drag-node', // 是否允许拖动节点
            'zoom-canvas',
            {
              // type: "collapse-expand-combo",
              type: 'tooltip',
              relayout: false,
              formatText(model) {
                const cfg = model.conf
                const text = []
                cfg.forEach(row => {
                  text.push(row.label + ':' + row.value + '<br>')
                })
                return text.join('\n')
              },
              offset: 30
            }
          ]
        },
        defaultNode: {
          type: 'sql',
          // shape: "diamond",
          // style: {
          //   stroke: "#333",
          //   fill: "#fff",
          //   lineWidth: 1
          // },
          size: [100, 50]
          // labelCfg: {
          //   style: {
          //     fill: "#000",
          //     fontSize: 14
          //   },
          //   position: "center"
          // }
        },
        // 线的设置
        defaultEdge: {
          type: 'polyline',
          style: {
            radius: 10, // 线的转角弯曲程度
            offset: 5, // 起点的线头离框框的距离
            endArrow: true, // 是否显示箭头
            lineWidth: 2,
            stroke: '#C2C8D5'
          }
        }
      })
    },
    renderGraph() {
      const { nodes, edges } = this.data
      this.graph.data({ nodes, edges })
      this.graph.render()
    },
    setData(data) {
      this.data = data
      this.renderGraph()
    }
  }
}
</script>

<style>
/* 样式文件 */
.container {
  width: 100%;
  height: 810px;
  text-align: center;
  padding-left: 200px;
}
</style>
