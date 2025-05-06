<template>
  <span @click.stop>

    <GuidEditorOperator v-if="showOperator" v-model="node.operator" :type="node.returnType" />

    <i
      v-if="replace"
      v-contextmenu.click="{
        options: () => ruleEditor.getDropdownMenus({ type: 'root' }, 'sibling'),
        callback: menu => replaceCondition(node, menu) }"
      class="el-icon-caret-bottom plr-5"
    />

    <input v-if="editor" ref="stringRef" v-model="node.value" class="underline values plr-5" size="11" @blur="handlerBlur(node)">
    <span v-else class="underline values plr-5" @click="fillValue(node)">{{ node.value || placeholder }}</span>
    <i v-if="!editable && addIcon" class="el-icon-circle-plus-outline plr-5" @click.stop="addExprParam" />

    <GuidEditorString v-if="node.next" v-bind="{ replace, placeholder, node: node.next, type }" show-operator />
  </span>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'GuidEditorString',
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
  },
  beforeDestroy() {
    this.ruleEditor.paramValue.splice(this.ruleEditor.paramValue.indexOf(this), 1)
  },
  methods: {
    replaceCondition(node, item) {
      // this.dispatch('GuidEditorForm', 'replaceCondition', [node, item]);
      !this.editable && this.$emit('replaceCondition', _.cloneDeep(item))
    },
    addExprParam() {
      if (this.type === 'linkedList') {
        this.dispatch('GuidRuleEditor', 'pushUndoStacks')
        const next = this.node.next
        this.$set(this.node, 'next', _.cloneDeep({
          ...this.node,
          value: '',
          // operator: { label: '加', code: 'ADD', value: '+' },
          next
        }))
      } else {
        this.$emit('insertCondition', this.node)
      }
    },
    // getDropdownMenus(type) {
    //     return {
    //         'string': [{ label: '加', code: 'ADD', value: '+' }],
    //         'int': [{ label: '加', code: 'ADD', value: '+' }, { label: '减', code: 'SUB', value: '-' }, { label: '乘', code: 'MULTIPLY', value: '*' }, { label: '除', code: 'DIVIDE', value: '/' }]
    //     }[type]
    // },
    // toggleOperator(item) {
    //     this.$set(this.node, 'operator', item)
    //     this.operator = item
    // },
    fillValue(node) {
      if (this.disabled && this.editable) return

      // this.$set(node, 'edit', true)
      this.editor = true
      this.$nextTick(() => {
        this.$refs.stringRef.focus()
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
    }
  }
}
</script>

