<template>
  <span @click.stop v-clickoutside="() => handleClose(node)">
    <!-- :remote-method="remoteMethod" :remote="!!remoteMethod" -->
    <span v-show="editor" @contextmenu.capture.stop>
      <el-select
        v-model="node.value"
        clearable
        filterable
        :multiple="node.type === 'selector-multiple'"
        class="express-select plr-5"
        :collapse-tags="node.type === 'selector-multiple'"
        :placeholder="placeholder"
        :popper-append-to-body="false"
        size="mini"
        @change="handleChange"
        >
        <el-option v-for="item in selectOpts" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </span>
    <span v-show="!editor" class="underline values plr-5" @click="fillValue(node)">{{ transformValue(node.value) }}</span>
    <!-- <template v-else>
            <span v-if="node.type === 'selector'" @click="fillValue(node)" class="underline values plr-5">{{ node.value?.label || placeholder }}</span>
            <span v-else @click="fillValue(node)" class="underline values plr-5">
                <template v-if="!node.value?.length">{{ placeholder }}</template>
                <template v-else>
                    <span v-for="item in node.value" :key="item.id">{{ item.label || placeholder }}</span>
                </template>
            </span>
        </template> -->
  </span>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Emitter from 'element-ui/src/mixins/emitter'

export default {
  directives: { Clickoutside },
  mixins: [Emitter],
  props: {
    disabled: Boolean,
    node: {
      type: Object,
      default: () => ({})
    },
    originNode: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: '<一个字符串>'
    },
    // options: {
    //     type: Array | Function,
    //     default: () => []
    // },
    prevNode: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['ruleEditor'],
  data() {
    return {
      selectOpts: [],
      editor: false
    }
  },
  created() {
    this.ruleEditor.paramValue.push(this)
    
    const codeService = this.node.codeService = this.originNode.codeService || this.prevNode.codeService
    this.ruleEditor.getCodeServiceMenus(codeService, res => {
      if (res.resp) {
        // this.selectOpts = res.resp?.secondaryComService || []
        this.selectOpts = res.resp[codeService] || []
      }
    })
  },
  // beforeMount() {
  //   if (['selector', 'selector-multiple'].includes(this.prevNode.type)) { // 表格中的列通过上一节点fieldPath获取下拉列表
  //     // this.node.fieldPath = this.prevNode.id
  //   } else {
  //     this.node.fieldPath = this.node.fieldPath || this.prevNode?.fieldPath
  //   }
  //   this.selectOpts = this.ruleEditor.getFormDropdownMenus(this.node) || []
  // },
  methods: {
    transformValue(value) {
      let placeholder = ''
      if (Array.isArray(value)) {
        const labels = this.selectOpts.reduce((acc, v) => {
          value.includes(v.key) && acc.push(v.label)
          return acc
        }, [])
        placeholder = labels.length ? `{ ${labels.toString()} }` : ''
      } else {
        placeholder = this.selectOpts.reduce((acc, v) => (v.key === value && (acc += v.label), acc), '')
      }
      return placeholder || this.placeholder
    },
    handleClose(node) {
      this.hiddenForm(node)
    },
    fillValue(node) {
      if (!this.disabled && this.ruleEditor.disabledRule()) return
      this.editor = true
    },
    hiddenForm(node) {
      this.editor = false
      // setTimeout(() => { this.editor = false; this.$forceUpdate() }, 100)
    },
    // 下拉列表的数据
    // remoteMethod(query) {
    //   // let list = this.options && this.options() || []
    //   let list = []
    //   if (list.then) {
    //     list.then(res => {
    //       list = res
    //     })
    //   } else {
    //     //  搜索过滤
    //     if (query !== '' && query !== undefined) {
    //       this.selectList = list.filter(item => {
    //         return item.label.indexOf(query) > -1
    //       })
    //     } else {
    //       this.selectList = list
    //     }
    //   }
    // },
    handleChange() {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')
    },
    setValue(value) {
      this.node.value = value
    }
  },
  beforeDestroy() {
    this.ruleEditor.paramValue.splice(this.ruleEditor.paramValue.indexOf(this), 1)
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .el-select {
//     line-height: initial;
//     .el-input, .el-input input {
//         width: 110px!important;
//         padding: 0;
//     }
// }

</style>
<style lang="scss">
.express-select {
    text-align: left;
    .el-select-dropdown__item.selected {
      color: #028229;
    }
    .el-select-dropdown__empty {
      line-height: initial;
    }
}
</style>
