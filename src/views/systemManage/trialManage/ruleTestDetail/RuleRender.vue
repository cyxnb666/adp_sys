<template>
  <span>
    <span v-for="(items, i) in ruleArray" :key="i">
      <template v-if="Array.isArray(items.left)">
        <IfRuleRender :rule-array="items.left" :tree-data="treeData" />
      </template>

      <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag123">
        <template v-if="items && items.left && items.left.nodeType && items.left.nodeType === NODE_TYPE.COMPARISON">
          <span class="node-tag" :class="{ error: validate(items.left.left), pass: validate1(items.left.left) }">
            <RuleRender :tree-data="treeData" :node="items.left.left" />
          </span>
          <span class="node-tag" :class="{ error: validate(items.left),pass:validate1(items.left) }">
            <RuleRender :tree-data="treeData" :node="items.left" />
          </span>
          <span class="node-tag" :class="{ error: validate(items.left.right),pass:validate1(items.left.right) }">
            <RuleRender :tree-data="treeData" :node="items.left.right" />
          </span>
        </template>
        <template v-else>
          <span class="node-tag" :class="{ error: validate(items.left),pass:validate1(items.left) }">
            <RuleRender :tree-data="treeData" :node="items.left" />
          </span>
        </template>
        <span class="node-tag" :class="{ error: validate(items),pass:validate1(items) }">
          <RuleRender :tree-data="treeData" :node="items" />
        </span>
        <span class="node-tag" :class="{ error: validate(items.right),pass:validate1(items.right) }">
          <RuleRender :tree-data="treeData" :node="items.right" />
        </span>
      </span>
      <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag symbol">
        <RuleRender :tree-data="treeData" :node="items" />
      </span>
      <span v-else class="node-tag" :class="{ error: validate(items),pass:validate1(items) }">
        <RuleRender :tree-data="treeData" :node="items" />
      </span>

    </span>
  </span>

</template>
<script>
import RuleRender from './PocRender/PocRender'
export default {
  name: 'IfRuleRender',
  components: {
    RuleRender
  },
  props: {
    ruleArray: {
      type: Array || Object,
      default: null
    },
    approvalStatus: {
      type: String,
      default: null
    },
    children: {
      type: Array || Object,
      default: null
    },
    treeData: {
      type: Array || Object,
      default: null
    },
    ruleTestList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      NODE_TYPE: {
        LOGICAL: 'LOGICAL', // 逻辑
        COMPARISON: 'COMPARISON', // 比较
        EXPRESSION: 'EXPRESSION', // 表达式
        FIELD: 'FIELD', // 字段
        CUSTOM: 'CUSTOM', // 用户输入节点
        NESTING: 'NESTING', // 嵌套节点
        BRACKETS: 'BRACKETS', // 括号
        CALCULATE: 'CALCULATE'// 算术
      }
    }
  },
  created() {
    // console.log(this.ruleArray)
  },
  methods: {
    validate(item) {
      let falg = false
      this.ruleTestList.forEach(item1 => {
        if (item.nodeType !== this.NODE_TYPE.BRACKETS && item.path === item1.path && item1.pass === '0') {
          falg = true
        }
      })
      return falg
    },
    validate1(item) {
      let falg = false
      this.ruleTestList.forEach(item1 => {
        console.log(item1)
        if (item.nodeType !== this.NODE_TYPE.BRACKETS && item.path === item1.path && item1.pass === '1') {
          console.log(11111111111111111111)
          falg = true
        }
      })
      return falg
    }
  }
}
</script>

<style>
.error {
  background: radial-gradient(circle at 10px -7px, transparent 8px, red 0, red 9px, transparent 0) repeat-x,
              radial-gradient(circle at 10px 27px, transparent 8px, red 0, red 9px, transparent 0) repeat-x;
  background-size: 20px 20px;
  background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
  padding-bottom: 16px;
  /* font-weight: initial;
  color: #606266; */
}
.pass {
  background: radial-gradient(circle at 10px -7px, transparent 8px, green 0, green 9px, transparent 0) repeat-x,
              radial-gradient(circle at 10px 27px, transparent 8px, green 0, green 9px, transparent 0) repeat-x;
  background-size: 20px 20px;
  background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
  padding-bottom: 16px;
  /* font-weight: initial;
  color: #606266; */
}
</style>
