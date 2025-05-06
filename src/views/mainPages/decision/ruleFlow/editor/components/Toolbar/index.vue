<template>
  <div class="toolbar">
    <link
      rel="stylesheet"
      type="text/css"
      href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
    >
    <i
      class="command iconfont icon-undo"
      title="撤销"
      :class="undoList.length>0?'':'disable'"
      @click="handleUndo"
    />
    <i
      class="command iconfont icon-redo"
      title="重做"
      :class="redoList.length>0?'':'disable'"
      @click="handleRedo"
    />
    <span class="separator" />
    <!-- <i data-command="copy" class="command iconfont icon-copy-o disable" title="复制"></i>
    <i data-command="paste" class="command iconfont icon-paster-o disable" title="粘贴"></i>-->
    <i
      data-command="delete"
      class="command iconfont icon-delete-o"
      title="删除"
      :class="selectedItem?'':'disable'"
      @click="handleDelete"
    />
    <span class="separator" />
    <i
      data-command="zoomIn"
      class="command iconfont icon-zoom-in-o"
      title="放大"
      @click="handleZoomIn"
    />
    <i
      data-command="zoomOut"
      class="command iconfont icon-zoom-out-o"
      title="缩小"
      @click="handleZoomOut"
    />
    <i
      data-command="autoZoom"
      class="command iconfont icon-fit"
      title="适应画布"
      @click="handleAutoZoom"
    />
    <i
      data-command="resetZoom"
      class="command iconfont icon-actual-size-o"
      title="实际尺寸"
      @click="handleResetZoom"
    />
    <span class="separator" />
    <i
      data-command="toBack"
      class="command iconfont icon-to-back"
      :class="selectedItem?'':'disable'"
      title="层级后置"
      @click="handleToBack"
    />
    <i
      data-command="toFront"
      class="command iconfont icon-to-front"
      :class="selectedItem?'':'disable'"
      title="层级前置"
      @click="handleToFront"
    />
    <span class="separator" />
    <span class="separator" />
    <i
      data-command="multiSelect"
      class="command iconfont icon-select"
      :class="multiSelect?'disable':''"
      title="多选"
      @click="handleMuiltSelect"
    />
    <!-- <i
      data-command="addGroup"
      class="command iconfont icon-group"
      title="成组"
      :class="addGroup?'':'disable'"
      @click="handleAddGroup"
    ></i> -->
    <!-- <i data-command="unGroup" class="command iconfont icon-ungroup disable" title="解组"></i> -->
    <el-button type="primary" :loading="saveLoad" size="mini" @click="consoleData">保存规则流</el-button>
  </div>
</template>

<script>
import * as Util from '@antv/util'
import { uniqueId, getBox } from '../../utils'
import eventBus from '../../utils/eventBus'

export default {
  data() {
    return {
      page: {},
      graph: {},
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      selectedItem: null,
      multiSelect: false,
      addGroup: false,
      saveLoad: false
    }
  },
  watch: {
    selectedItem(val) {
      if (val && val.length > 1) {
        this.addGroup = true
      } else {
        this.addGroup = false
      }
    }
  },
  created() {
    this.init()
    this.bindEvent()
  },
  methods: {
    init() {
      const { editor, command } = this.$parent
      this.editor = editor
      this.command = command
    },
    bindEvent() {
      const self = this
      eventBus.$on('afterAddPage', page => {
        self.page = page
        self.graph = self.page.graph
      })
      eventBus.$on('add', data => {
        this.redoList = data.redoList
        this.undoList = data.undoList
      })
      eventBus.$on('update', data => {
        this.redoList = data.redoList
        this.undoList = data.undoList
      })
      eventBus.$on('delete', data => {
        this.redoList = data.redoList
        this.undoList = data.undoList
      })
      eventBus.$on('updateItem', item => {
        this.command.executeCommand('update', [item])
      })
      eventBus.$on('addItem', item => {
        this.command.executeCommand('add', [item])
      })
      eventBus.$on('nodeselectchange', () => {
        this.selectedItem = this.graph.findAllByState('node', 'selected')
        this.selectedItem = this.selectedItem.concat(
          ...this.graph.findAllByState('edge', 'selected')
        )
      })
      eventBus.$on('deleteItem', () => {
        this.handleDelete()
      })
      eventBus.$on('muliteSelectEnd', () => {
        this.multiSelect = false
        this.selectedItem = this.graph.findAllByState('node', 'selected')
      })
    },
    handleUndo() {
      if (this.undoList.length > 0) this.command.undo()
    },
    handleRedo() {
      if (this.redoList.length > 0) this.command.redo()
    },
    handleDelete() {
      if (this.selectedItem.length > 0) {
        this.command.executeCommand('delete', this.selectedItem)
        this.selectedItem = null
      }
    },
    getFormatPadding() {
      /**
       * turn padding into [top, right, bottom, right]
       * @param  {Number|Array} padding input padding
       * @return {array} output
       */
      function formatPadding(padding) {
        let top = 0
        let left = 0
        let right = 0
        let bottom = 0

        if (Util.isNumber(padding) || Util.isString(padding)) {
          top = left = right = bottom = padding
        } else if (Util.isArray(padding)) {
          top = padding[0]
          right = !Util.isNil(padding[1]) ? padding[1] : padding[0]
          bottom = !Util.isNil(padding[2]) ? padding[2] : padding[0]
          left = !Util.isNil(padding[3]) ? padding[3] : right
        }
        return [top, right, bottom, left]
      }
      return formatPadding(this.graph.get('fitViewPadding'))
    },
    getViewCenter() {
      const padding = this.getFormatPadding()
      const graph = this.graph
      const width = this.graph.get('width')
      const height = graph.get('height')
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      }
    },
    handleZoomIn() {
      const currentZoom = this.graph.getZoom()
      this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter())
    },
    handleZoomOut() {
      const currentZoom = this.graph.getZoom()
      this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter())
    },
    handleToBack() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          item.toBack()
          this.graph.paint()
        })
      }
    },
    handleToFront() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          if (item.getType() === 'edge') {
            // const nodeGroup = this.graph.get("nodeGroup");
            // const edgeGroup = item.get("group");
            // nodeGroup.toFront();
            // edgeGroup.toFront()
          } else {
            item.toFront()
          }

          this.graph.paint()
        })
      }
    },
    handleAutoZoom() {
      this.graph.fitView(20)
    },
    handleResetZoom() {
      this.graph.zoomTo(1, this.getViewCenter())
    },
    handleMuiltSelect() {
      this.multiSelect = true
      this.graph.setMode('mulitSelect')
    },
    consoleData() {
      // eslint-disable-next-line no-console
      const isOk = this.verify()
      if (isOk) {
        this.saveLoad = true
        this.$emit('savaRuleFlow', this.graph.save())
      }
    },
    saveLoadFlase() {
      this.saveLoad = false
    },
    verify() {
      const findStart = this.graph.find('node', node => {
        return node.get('model').flowNodeType === 'START_NODE'
      })
      const findfinish = this.graph.find('node', node => {
        return node.get('model').flowNodeType === 'END_NODE'
      })
      const findStartSource = this.graph.findAll('edge', node => {
        return node.get('source').get('model').flowNodeType === 'START_NODE'
      })
      const findfinishSource = this.graph.findAll('edge', node => {
        return node.get('target').get('model').flowNodeType === 'END_NODE'
      })
      if (findStart === undefined || findfinish === undefined || findStartSource.length === 0 || findfinishSource.length === 0) {
        this.$message({
          showClose: true,
          message: '请连接开始与结束节点',
          type: 'error',
          offset: 100
        })
        return false
      }
      return true
    }
  }
}
</script>
<style scoped>
.toolbar {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e9e9e9;
  line-height: 42px;
  height: 42px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
}
.toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
.toolbar .command {
  box-sizing: border-box;
  width: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 4px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}
.toolbar .command:hover {
  cursor: pointer;
  border: 1px solid #e9e9e9;
}
.toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}
.toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
</style>
