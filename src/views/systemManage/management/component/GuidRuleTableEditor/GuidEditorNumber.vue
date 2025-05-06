<template>
  <span @click.stop>
    <!-- <span v-if="showOperator" v-contextmenu.click="{ options: () => getDropdownMenus(node.returnType), callback: menu => toggleOperator(menu) }" class="plr-5">
            {{ operator.value }}
        </span> -->
    <GuidEditorOperator v-if="showOperator" v-model="node.operator" :type="node.returnType" :number-operator="node.operator" />

    <i v-if="replace" v-contextmenu.click="{ options: () => ruleEditor.getDropdownMenus({ type: 'root' }, 'sibling'), callback: menu => replaceCondition(node, menu) }" class="el-icon-caret-bottom plr-5" />

    <input v-if="editor" ref="numberRef" v-model="node.value" type="number" class="underline values plr-5" style="width: 106px;" @blur="handlerBlur(node)">
    <span v-else class="underline values plr-5" @click="fillValue(node)">{{ node.value || placeholder }}</span>
    <i v-if="!editable && addIcon" class="el-icon-circle-plus-outline plr-5" @click.stop="addExprParam" />

    <GuidEditorNumber v-if="node.next" v-bind="{ replace, placeholder, node: node.next, showOperator: true }" />
  </span>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'GuidEditorNumber',
  mixins: [Emitter],
  props: {
    disabled: Boolean,
    node: {
      type: Object,
      default: () => ({})
    },
    replace: {
      type: Boolean,
      default: false
    },
    showOperator: Boolean,
    addIcon: {
      type: Boolean,
      default: true
    },
    type: String,
    placeholder: String
  },
  data() {
    return {
      editor: false
    }
  },
  inject: ['ruleEditor'],
  computed: {
    editable() {
      return this.ruleEditor.disabledRule()
    }
  },
  created() {
    this.value = this.node.value
    // this.showOperator && (this.node.operator = this.operator)
  },
  beforeDestroy() {
    // this.ruleEditor.paramValue.splice(this.ruleEditor.paramValue.indexOf(this), 1)
  },
  methods: {
    replaceCondition(node, item) {
      this.$emit('replaceCondition', item)
    },
    addExprParam() {
      if (this.type === 'linkedList') {
        const next = this.node.next
        this.$set(this.node, 'next', {
          ...this.node,
          value: '',
          // operator: { label: '加', code: 'ADD', value: '+' },
          next: next
        })
      } else {
        this.$emit('insertCondition', this.node)
      }
    },
    fillValue(node) {
      if (this.disabled && this.editable) return

      // this.$set(node, 'edit', true)
      this.editor = true
      this.$nextTick(() => {
        this.$refs.numberRef.focus()
      })
    },
    handlerBlur(node) {
      this.editor = false

      if (this.value !== node.value) {
        this.dispatch('GuidRuleEditor', 'pushUndoStacks')
      }
    },
    setValue(value) {
      this.node.value = value
      this.$emit('input', value)
    }
  }
}
</script>

