<template>
  <span class="guid-rule-editor-expression">
    <span v-for="val, index in node.expressionArray" :key="val.uuid">

      <!-- 替换的bom字段 -->
      <template v-if="val.type === 'root'">
        <GuidEditorBomField
          v-bind="{ node: val, nodeType: node.originNode[index].returnType }"
          v-on="{ insertCondition: () => insertCondition(originNode, index + 1), selectCondition: menu => selectCondition(menu, index) }"
        />

        <!-- <GuidEditorOperator v-if="!!index || type === 'joint'" v-model="node.operator" :type="originNode.returnType"></GuidEditorOperator>
                <GuidEditorCol v-bind="{ root: node, nodeType: originNode.returnType, node, }" @selectCondition="menu => selectCondition(menu. index)"></GuidEditorCol>

                <i v-if="!disabled && ['string', 'int'].includes(originNode.returnType) && node.children" class="el-icon-circle-plus-outline plr-5" @click.stop="insertCondition(originNode, index + 1)" /> -->
      </template>
      <template v-else>

        <span v-if="['actualTypeNames', 'field'].includes(val.type)" :class="{ field: val.type === 'field', 'plr-5': true }">{{ parentNode.labelPath || '' }}</span>

        <span v-else-if="['text', 'symbol'].includes(val.type)" class="plr-5">{{ (val.desc || '').trim() }}</span>

        <span v-else>
          <GuidEditorSelect
            v-if="['selector-multiple', 'selector'].includes(val.type)"
            :node="val"
            :origin-node="node"
            :prev-node="getPrevNode(node.expressionArray, index)"
            :options="() => getSelectionOptions(val, index)"
            :placeholder="`<选择一个${ { boolean: '布尔值' }[node.returnType] || '字符串' }>`"
          />

          <!-- <GuidEditorSelect v-else-if="val.type == 'selector-multiple'" :node="val"
                  :prevNode="node.expressionArray[index - 2] || parentNode"
                  :options="() => getSelectionOptions(val, index)" placeholder="<选择一个字符串>">
                  </GuidEditorSelect> -->

          <GuidEditorString
            v-else-if="val.returnType === 'string'" replace
            v-bind="{ node: val, addIcon, placeholder: '<输入一个字符串>' }"
            v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index) }"
          />

          <GuidEditorNumber
            v-else-if="numberTypes.includes(val.returnType)" replace
            v-bind="{ node: val, addIcon, type: 'linkedList', placeholder: '<输入一个数字>' }"
            v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index) }"
          />

          <GuidEditorDate
            v-else-if="['date', 'time'].includes(val.returnType)" replace
            v-bind="{ node: val, addIcon, type: 'linkedList', placeholder: '<输入一个日期>' }"
            v-on="{ replaceCondition: (node) => replaceCondition(node, index), insertCondition: (node) => insertCondition(node, index) }"
          >
            <!-- @addExprParam="addExprParam(val, index)" -->
          </GuidEditorDate>

        </span>
      </template>
    </span>

    <GuidEditorExpress
      v-if="node.next"
      v-contextmenu.click="{
        options: () => getDropdownMenus(node.next, 'child'),
        callback: menu => selectNextCondition(menu, node)
      }"
      :node="node.next"
      :parent-node="parentNode || node"
      v-on="{ selectNextCondition }"
    />
  </span>
</template>

<script>

import Emitter from 'element-ui/src/mixins/emitter'
import { allTypes, numberTypes } from './dataset.js'
export default {
  mixins: [Emitter],
  name: 'GuidEditorExpress',
  componentName: 'GuidEditorExpress',
  props: {
    parentNode: {
      type: Object,
      default: () => ({})
    },
    node: {
      type: Object,
      default: () => ({})
    },
    type: String
  },
  data() {
    return {
      originNode: {},
      selection: [],
      numberTypes: Object.freeze(numberTypes)
    }
  },
  inject: ['ruleEditor'],
  computed: {
    addIcon() {
      return this.node.nodeType !== 'EXPRESSION'
    }
  },
  beforeMount() {
    this.$on('getParamValue', this.getParamValue)

    // 挂载原始数据到node上，用于撤销操作
    this.node.originNode = this.node.originNode || _.cloneDeep(this.node.expressionArray)
  },
  methods: {
    getParamValue(callback) {
      callback(this.node.expressionArray.filter(v => allTypes.includes(v.returnType)))
    },
    // 下拉找到上一表单元素节点
    getPrevNode(nodes, index) {
      while (index--) {
        if (['selector', 'selector-multiple'].includes(nodes[index].type)) {
          return nodes[index]
        }
      }
      return this.parentNode
    },
    // getSelectionOptions(node) {
    //     // if (node.listSource === 'param-field') {
    //     //     // 记录上一个下拉列表节点
    //     //     th,is.selection.push(node)
    //     //     return this.parentNode.children || []
    //     // } else if  (node.listSource === 'param-codeService') {
    //     //     const curr = this.selection[this.selection.length - 1] // 取上一个下拉列表节点
    //     //     if (curr && curr.value && curr.value.codeService) {
    //     //         if (curr.listSource === 'param-field') {
    //     //             if (curr.value.codeService) {
    //     //                 return this.getCodeServiceList(curr.value.codeService || '')
    //     //             }
    //     //         }
    //     //     } else if (this.parentNode.codeService){ // 没有上一个下拉节点
    //     //         return this.getCodeServiceList(this.parentNode.codeService || '')
    //     //     }
    //     // }

    //     this.getSelectionOptions = (next) => {
    //         this.getSelectionOptions = this.getSelectionOptions
    //         if (next.listSource === 'param-codeService') {
    //             if (node && node.value && node.value.codeService) {
    //                 if (node.listSource === 'param-field') {
    //                     return this.getCodeServiceList(node.value.codeService || '')
    //                 }
    //             } else if (this.parentNode.codeService){ // 没有上一个下拉节点
    //                 return this.getCodeServiceList(this.parentNode.codeService || '')
    //             }
    //         } else if (next.listSource === 'param-field') {
    //             return this.parentNode.children || []
    //         }
    //     }

    //     return this.getSelectionOptions(node)
    // },
    replaceCondition(node, index) {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')
      // this.originNode = node.expressionArray[index] || {}
      this.node.expressionArray.splice(index, index, _.cloneDeep({ ...node, id: node.id || `${Date.now()}-${Math.random()}` }))
    },
    insertCondition(node, index) {
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')
      this.node.expressionArray.splice(index, index, _.cloneDeep({ ...node, id: node.id || `${Date.now()}-${Math.random()}` }))
    },
    getDropdownMenus(item) {
      return this.ruleEditor.getDropdownMenus(item, 'sibling', true)
    },
    selectNextCondition(item, node) {
      // item = _.cloneDeep(item)
      // if (!node.next || node.next.fieldPath !== item.fieldPath) {

      //     this.dispatch('GuidRuleEditor', 'pushUndoStacks'); // 记录操作步骤

      //     // STR_LENGTH内容长度
      //     if (['STR_LENGTH', 'STR_BEGIN_WITH_NUM', 'STR_END_WITH_NUM', 'STR_STR_WITH_NUM'].includes(item.expressionId)) {
      //         const data = this.ruleEditor.getExpressNextNode(item.returnType)
      //         if (data) item.next = _.cloneDeep(data[0])
      //     }

      //     this.$set(node, 'next', item)
      // }
      this.dispatch('GuidEditorCol', 'selectNextCondition', [item, node]) // 通过父级修改数据
    }
    // handleClickExpr(node, expr) {
    //     this.dispatch('GuidEditorCol', 'selectNextCondition', expr) // 通过父级修改数据

    // },
    // addExprParam(node, index) {
    //     if (this.node.expressionArray)
    //     this.node.expressionArray.splice(index, 0, _.cloneDeep(node))
    // }
  }
}
</script>

<style lang="scss" scoped>
.guid-rule-editor-expression {
    .field {
        // color:#767602;
        font-weight: initial;
    }
    .el-input {
        width: initial;
        display: inline-block;
    }
    .el-input__inner {
        width: initial;
    }
}
</style>
