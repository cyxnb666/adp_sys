export default {
  getEvents() {
    return {
      'node:mouseover': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
      'node:mousedown': 'onMousedown'
    }
  },
  onMouseover(e) {
    const self = this
    const item = e.item
    const graph = self.graph
    const group = item.getContainer()
    if (e.target.attrs.isOutPointOut || e.target.attrs.isOutPoint) {
      group.find(g => {
        if (g.attrs.isInPoint || g.attrs.isOutPoint) {
          g.attr('fill', '#fff')
        }
        if (g.attrs.isOutPoint) {
          if (g.attrs.id === e.target.attrs.parent) {
            group.find(gr => {
              if (gr.attrs.id === g.attrs.id) {
                gr.attr('fill', '#1890ff')
                gr.attr('opacity', 1)
              }
            })
          }
          if (g.attrs.id === e.target.attrs.id) {
            g.attr('fill', '#1890ff')
            g.attr('opacity', 1)
          }
        }
      })
      e.target.attr('cursor', 'crosshair')
      this.graph.paint()
    }
    if (item.hasState('selected')) {
      return
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'hover', true)
      }
    }
    graph.paint()
  },
  onMouseleave(e) {
    const self = this
    const item = e.item
    const graph = self.graph
    const group = item.getContainer()
    group.find(g => {
      if (g.attrs.isInPoint || g.attrs.isOutPoint) {
        g.attr('fill', '#fff')
      }
    })
    if (self.shouldUpdate.call(self, e)) {
      if (!item.hasState('selected')) { graph.setItemState(item, 'hover', false) }
    }
    graph.paint()
  },
  onMousedown(e) {
    if (e.target.attrs.isOutPoint || e.target.attrs.isOutPointOut) {
      this.graph.setMode('addEdge')
    } else {
      // this.graph.setMode('moveNode')
    }
  }
}
