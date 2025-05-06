<template>
  <span>
    <span v-for="(items, i) in ruleArray" :key="i">
      <template v-if="Array.isArray(items.left)">
        <IfRuleRender
          :rule-array="items.left"
          :tree-data="treeData"
        />
      </template>
      <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
        <template v-if="items &&items.left&&items.left.nodeType&& items.left.nodeType === NODE_TYPE.COMPARISON">
          <RuleRender
            :tree-data="treeData"
            :disabled="approvalStatus === '1' ||
              approvalStatus === '2' ||
              (children ? true : false)
            "
            :node="items.left.left"
          />
          <RuleRender
            :tree-data="treeData"
            :disabled="approvalStatus === '1' ||
              approvalStatus === '2' ||
              (children ? true : false)
            "
            :node="items.left"
          />
          <RuleRender
            :tree-data="treeData"
            :disabled="approvalStatus === '1' ||
              approvalStatus === '2' ||
              (children ? true : false)
            "
            :node="items.left.right"
          />
        </template>
        <template v-else>
          <RuleRender
            :tree-data="treeData"
            :disabled="approvalStatus === '1' ||
              approvalStatus === '2' ||
              (children ? true : false)
            "
            :node="items.left"
          />
        </template>
        <RuleRender
          :tree-data="treeData"
          :disabled="approvalStatus === '1' ||
            approvalStatus === '2' ||
            (children ? true : false)
          "
          :node="items"
        />
        <RuleRender
          :tree-data="treeData"
          :disabled="approvalStatus === '1' ||
            approvalStatus === '2' ||
            (children ? true : false)
          "
          :node="items.right"
        />
      </span>
      <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
        <RuleRender
          :tree-data="treeData"
          :disabled="approvalStatus === '1' ||
            approvalStatus === '2' ||
            (children ? true : false)
          "
          :node="items"
        />
      </span>
      <span v-else class="node-tag">
        <RuleRender
          :tree-data="treeData"
          :disabled="approvalStatus === '1' ||
            approvalStatus === '2' ||
            (children ? true : false)
          "
          :node="items"
        />
      </span>

    </span>
  </span>

</template>
<script>
import RuleRender from '@/components/PocRender/PocRender'
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
  }
}
</script>
