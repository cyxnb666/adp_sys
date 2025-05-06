<template>
  <span class="guid-rule-editor-col" :class="{ isError }">
    <GuidEditorExpress
      v-if="node.expressionArray"
      v-contextmenu.click="{ options: () => getDropdownMenus(node, 'child'), callback: menu => $emit('selectCondition', menu)}"
      :node="node"
      :parent-node="node"
    />
    <span v-else class="guid-rule-editor-root">

      <span
        v-contextmenu.click="{
          options: () => getDropdownMenus(node, 'sibling'),
          callback: menu => $emit('selectCondition', menu)
        }"
        class="underline plr-5"
      >{{ separator }}{{ node.label }}</span>

      <!-- 方法节点 -->
      <template v-if="node.detailsList">
        <span class="plr-5">(</span>
        <GuidEditorForm v-for="item, idx in node.detailsList" :key="idx" :nodes="item" :origin-node="node.originDetailsList[idx]">
          <span v-if="idx" class="plr-5">，</span>
        </GuidEditorForm>
        <span class="plr-5">)</span>
      </template>

      <template v-if="node.next">
        <!-- 表达式前面拼接节点 -->
        <i v-if="['string', 'int', 'double'].includes(node.returnType)" class="el-icon-circle-plus-outline plr-5" @click.stop="addAppendNodeParam(node)" />
        <GuidEditorForm v-if="node.appendNodeList" :nodes="node.appendNodeList" :origin-node="node.copyAppendNode" />

        <!-- 表达式 -->
        <GuidEditorExpress
          v-if="node.next.expressionArray"
          v-contextmenu.click="{ options: () => getDropdownMenus(node, 'child'), callback: menu => selectNextCondition(menu, node) }"
          :node="node.next"
          :parent-node="node"
        />

        <GuidEditorCol v-else v-bind=" { node: node.next, root, separator: '的', nodeType }" @selectCondition="menu => selectNextCondition(menu, node)" />
      </template>

      <span v-else-if="node.children && node.type!=='void'" v-contextmenu.click="{ options: () => getDropdownMenus(node, 'child'), callback: menu => selectNextCondition(menu, node) }" class="plr-5">是</span>
    </span>

  </span>
</template>
<script>
import Emitter from 'element-ui/src/mixins/emitter'
import GuidEditorExpress from './GuidEditorExpress'
import GuidEditorForm from './GuidEditorForm'
export default {
  name: 'GuidEditorCol',
  componentName: 'GuidEditorCol',
  components: {
    GuidEditorExpress,
    GuidEditorForm
  },
  mixins: [Emitter],
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    separator: {
      type: String,
      default: ''
    },
    nodeType: {
      type: String,
      default: null
    },
    root: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['ruleEditor'],
  data() {
    return {
      isError: false
    }
  },
  // watch: {
  //   node(val) {
  //     if (val.type === 'void' && val.label.includes('()')) {
  //       val.label = val.label.slice(0, -2)
  //     } else if (val.next.type === 'void' && val.next.label.includes('()')) {
  //       val.next.label = val.next.label.slice(0, -2)
  //     }
  //   }
  // },
  beforeMount() {
    this.$on('selectNextCondition', this.selectNextCondition)
    this.$on('validateRuleValue', this.validateRuleValue)
    this.$on('clearValidateRuleValue', this.clearValidateRuleValue)
  },
  methods: {
    validateRuleValue(callback) {
      
      callback = callback || function() {}

      if (this.node.type === 'root') {
        this.isError = false
        let node = this.node
        const nodeType = this.nodeType
        while (node) {
          if (nodeType) { // 嵌套节点
            if (!node.next && node.returnType !== nodeType) {
              this.isError = true
              return callback('规则类型不匹配')
            }
          } else {
            if (!node.next && !['EXPRESSION', 'COMPARISON'].includes(node.nodeType)) { // 最后一个节点不是表达式或者比较节点
              this.isError = true
              return callback('规则信息不完整')
            }
          }
          node = node.next
        }

        callback('')
      }
    },
    clearValidateRuleValue() {
      this.isError = false
    },
    // replaceCondition(item, index) {
    //     this.dispatch('GuidRuleEditor', 'pushUndoStacks');
    //     this.node.detailsList.splice(index, 1, _.cloneDeep(item))
    // },
    // setNesting(bool) {
    //     this.$set(this.root, 'isNesting', bool)
    // },
    addAppendNodeParam(node) {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks') // 记录操作步骤
      if (!node.appendNodeList) {
        node.copyAppendNode = { type: 'input', returnType: node.type, id: `${Date.now()}-${Math.random()}` }
        this.$set(node, 'appendNodeList', [_.cloneDeep(node.copyAppendNode)])
      } else {
        node.appendNodeList.unshift(_.cloneDeep({ ...node.copyAppendNode, id: `${Date.now()}-${Math.random()}` }))
      }
    },
    getDropdownMenus(item, type) {
      return this.ruleEditor.getDropdownMenus(item, type, this.nodeType)
      // if (item.returnType === 'list' && type === 'child') {
      //     return this.ruleEditor.getExpressNextNode(item.returnType)
      // } else {

      // }
    },
    //         selectNextExpression(node, item) {
    //             item = _.cloneDeep(item)

    //             if (!node.next || node.next.fieldPath !== item.fieldPath) {

    //                 this.dispatch('GuidRuleEditor', 'pushUndoStacks'); // 记录操作步骤

    //                 // STR_LENGTH内容长度
    //                 if (!item.children && !item.expressionArray) {
    //                     const data = this.ruleEditor.getExpressNextNode(item.returnType)
    //                     if (data) item.next = _.cloneDeep(data[0])
    //                 }

    //                 this.$set(node, 'next', item)
    //             }
    //         },
    selectNextCondition(item, node) {
      item = _.cloneDeep(item)
      // this.validateRuleValue(() => {})

      if (!node.next || node.next.fieldPath !== item.fieldPath) {
        this.dispatch('GuidRuleEditor', 'pushUndoStacks') // 记录操作步骤

        // 不是嵌套节点，并且编辑的不是决策列时, 最后一个节点，自动带出表达式
        if (!this.nodeType && this.root.ruleType !== 'decision') {
          //   if (item.returnType === 'list') {
          //     item.children = !!item.children
          //   }
          // STR_LENGTH内容长度
          const other = ['STR_LENGTH', 'STR_BEGIN_WITH_NUM', 'STR_END_WITH_NUM', 'STR_STR_WITH_NUM'] // 其他可拼接表达式的节点
          if (!item.children && !item.expressionArray || other.includes(item.expressionId)) {
            const data = this.ruleEditor.getExpressNextNode(item.returnType)
            if (data) item.next = _.cloneDeep(data[0])
          }
        }

        this.$set(node, 'next', item)
      }
    }
    // toggleCondition(item) {
    //     this.$emit('selectCondition', item)
    // },
  }
}
</script>

<style lang="scss" scoped>
.guid-rule-editor-col {
    // position: relative;
    padding: 10px 0;
    &.isError{
        .guid-rule-editor-root {
            color: #606266;
        }
        background: radial-gradient(circle at 10px -7px, transparent 8px, currentColor 0, currentColor 9px, transparent 0) repeat-x,
                    radial-gradient(circle at 10px 27px, transparent 8px, currentColor 0, currentColor 9px, transparent 0) repeat-x;
        background-size: 20px 20px;
        background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
        color: red;

    }
    // &.isError::after {
    //     background: radial-gradient(circle at 10px -7px, transparent 8px, currentColor 0, currentColor 9px, transparent 0) repeat-x,
    //                 radial-gradient(circle at 10px 27px, transparent 8px, currentColor 0, currentColor 9px, transparent 0) repeat-x;
    //     background-size: 20px 20px;
    //     background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
    //     color: red;
    // }
    // &::after {
    //     display: inline-block;
    //     content: '';
    //     position: absolute;
    //     bottom: -10px;
    //     left: 0;
    //     right: 0;
    //     height: 10px;
    // }
}
</style>
