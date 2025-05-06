<template>
  <span @click.stop>

    <slot v-if="$scopedSlots.default" :index="index" :node="node" />

    <span v-for="node, index in nodes" :key="node.id">
      <!-- 替换的bom字段 -->
      <template v-if="node.type === 'root'">
        <GuidEditorBomField
          v-bind="{ node, nodeType: originNode.returnType }"
          :show-operator="!!index && evaluateTypes.includes(originNode.returnType)"
          v-on="{ insertCondition: () => insertCondition(originNode, index + 1), selectCondition: menu => selectCondition(menu, index) }"
        />

        <!-- <GuidEditorOperator v-if="!!index || type === 'joint'" v-model="node.operator" :type="originNode.returnType"></GuidEditorOperator>
                <GuidEditorCol v-bind="{ root: node, nodeType: originNode.returnType, node, }" @selectCondition="menu => selectCondition(menu. index)"></GuidEditorCol>

                <i v-if="!disabled && ['string', 'int'].includes(originNode.returnType) && node.children" class="el-icon-circle-plus-outline plr-5" @click.stop="insertCondition(originNode, index + 1)" /> -->
      </template>

      <template v-else>
        
        <GuidEditorOperator v-if="!!index && evaluateTypes.includes(node.returnType)" v-model="node.operator" :type="node.returnType" />

        <GuidEditorString
          v-if="node.returnType === 'string'"
          replace
          v-bind="{ node, placeholder: '<输入一个字符串>' }"
          v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index + 1) }"
        />

        <GuidEditorNumber
          v-if="numberTypes.includes(node.returnType)"
          replace
          v-bind="{ node, placeholder: '<输入一个数字>' }"
          v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index + 1)}"
        />

        <GuidEditorDate
          v-if="['date', 'time'].includes(node.returnType)"
          replace
          v-bind="{ node, placeholder: '<输入一个日期>' }"
          v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index + 1)}"
        />
        <GuidEditorSelect
          v-if="node.returnType === 'boolean'"
          replace
          v-bind="{ node, placeholder: '<选择一个布尔值>' }"
          v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index)}"
        />
      </template>
    </span>
  </span>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import { allTypes, numberTypes } from './dataset.js'
// import GuidEditorCol from './GuidEditorCol.vue'
export default {
  name: 'GuidEditorForm',
  componentName: 'GuidEditorForm',
  mixins: [Emitter],
  props: {
    nodes: {
      type: Array,
      default: _ => []
    },
    separator: {
      type: String,
      default: ''
    },
    root: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    },
    originNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // paramsType: [], // 嵌套节点类型
      numberTypes: Object.freeze(numberTypes),
      evaluateTypes: Object.freeze(numberTypes.concat('string'))
    }
  },
  inject: ['ruleEditor'],
  computed: {
    disabled() {
      return this.ruleEditor.disabledRule()
    }
  },
  created() {
    console.log(this.nodes)
    // this.$on('replaceCondition', this.replaceCondition)

    this.$on('getParamValue', this.getParamValue)
  },
  methods: {
    getParamValue(callback) {
      callback(this.nodes.filter(v => allTypes.includes(v.returnType)))
    },
    replaceCondition(node, index) {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')

      this.nodes.splice(index, 1, _.cloneDeep({ ...node, id: node.id || `${Date.now()}-${Math.random()}`, value: null }))
    },
    insertCondition(node, index) {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')
      this.nodes.splice(index, 0, _.cloneDeep({ ...node, id: node.id || `${Date.now()}-${Math.random()}`, value: null }))
    },
    selectCondition(item, index) {
      this.nodes.splice(index, 1, _.cloneDeep({ ...item, id: node.id || `${Date.now()}-${Math.random()}`, value: null }))
    }
  }
}
</script>

<style scoped>

</style>
