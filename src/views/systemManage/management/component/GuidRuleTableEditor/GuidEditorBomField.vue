<template>
  <span>
    <!-- <span v-if="showOperator" v-contextmenu.click="{ options: () => getDropdownMenus(node.returnType), callback: menu => toggleOperator(menu) }" class="plr-5">
            {{ operator.value }}
        </span> -->
    <GuidEditorOperator v-if="showOperator" v-model="node.operator" :type="nodeType" />
    <GuidEditorCol v-bind="{ root: node, nodeType, node, }" @selectCondition="menu => $emit('selectCondition', menu)" />

    <i v-if="!disabled && ['string', 'int', 'double'].includes(nodeType) && node.children" class="el-icon-circle-plus-outline plr-5" @click.stop="$emit('insertCondition')" />
  </span>
</template>

<script>

export default {
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    nodeType: {
      type: String,
      default: null
    },
    // replace: {
    //     type: Boolean,
    //     default: true
    // },
    showOperator: Boolean
    // type: String,
    // placeholder: String
  },
  inject: ['ruleEditor'],
  data() {
    return {
      // operator: { label: '加', code: 'ADD', value: '+' }
    }
  },
  computed: {
    disabled() {
      return this.ruleEditor.disabledRule()
    }
  },
  created() {
    // this.showOperator && (this.node.operator = this.operator)
  },
  methods: {
    // toggleOperator(item) {
    //     this.operator = item
    //     this.$set(this.node, 'operator', item)
    // },
    // getDropdownMenus(type) {
    //     return {
    //         'string': [{ label: '加', code: 'ADD', value: '+' }],
    //         'date': [{ label: '加', code: 'ADD', value: '+' }, { label: '减', code: 'SUB', value: '-' }, { label: '乘', code: 'MULTIPLY', value: '*' }, { label: '除', code: 'DIVIDE', value: '/' }],
    //         'int': [{ label: '加', code: 'ADD', value: '+' }, { label: '减', code: 'SUB', value: '-' }, { label: '乘', code: 'MULTIPLY', value: '*' }, { label: '除', code: 'DIVIDE', value: '/' }]
    //     }[type]
    // },
  }
}
</script>
