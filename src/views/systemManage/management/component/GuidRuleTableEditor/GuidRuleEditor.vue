<template>
  <div class="guid-rule-editor-content" @contextmenu.capture.prevent="validateRule">
    <div class="guid-rule-selector-editor">
      <span v-for="rule, index in ruleList" :key="rule.key">
        <span
          v-if="rule.type === 'bracket'"
          v-contextmenu="{
            options: _ => getRightClickMenus('common'),
            callback: menu => conditionOperation(rule, menu, index)
          }"
          class="plr-5"
        >{{ rule.label }}</span>
  
        <template v-else>
          <template v-if="rule.nodes">
            <GuidEditorCol
              v-contextmenu="{ options: menusOptions, callback: menu => conditionOperation(rule, menu, index)}"
              :node="rule.nodes"
              :root="rule"
              @selectCondition="node => selectCondition(rule, node)"
            />
  
            <span
              v-for="bracket, idx in rule.brackets"
              :key="bracket.key"
              v-contextmenu="{ options: _ => getRightClickMenus('common'), callback: menu => conditionOperation(rule, { value: 'delBracketRight' }, idx)}"
              class="plr-5"
            >{{ bracket.label }}</span>
          </template>
  
          <span
            v-else
            v-contextmenu.click="{
              options: _ => getDropdownMenus({ type: 'root' }, 'sibling'),
              callback: menu => selectCondition(rule, menu)
            }"
            v-contextmenu="{
              options: _ => getRightClickMenus('common'),
              callback: menu => conditionOperation(rule, menu, index)
            }"
            class="underline plr-5"
          >{{ rule.ruleType === 'decision' ? '<选择一个操作>' : '<选择一个条件>' }}</span>
  
          <!-- 不成立 -->
          <span v-if="rule.right" class="plr-5">{{ rule.right.label }}</span>
  
          <!-- 决策列没有交集并集 -->
          <template v-if="rule.ruleType === 'data'">
            <span
              v-if="rule.logic"
              v-contextmenu.click="{ options: logicOpts, callback: menu => rule.logic = menu
              }"
              class="underline plr-5 symbol"
            >{{ rule.logic.label }}</span>
  
            <span v-else class="plr-5" @click.stop.capture="closeRule(ruleList.length - 1)">[并且/或者]</span>
          </template>
        </template>
      </span>
    </div>
    <div v-if="errorInfo" class="error">{{ errorInfo }}</div>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import broadcast from './utils'

// function broadcast(componentName, eventName, params) {
//   this.$children.forEach(child => {
//     var name = child.$options.componentName

//     broadcast.apply(child, [componentName, eventName].concat([params]))
//     if (name === componentName) {
//       child.$emit.apply(child, [eventName].concat(params))
//     } else {
//     }
//   })
// }
export default {
  name: 'GuidRuleEditor',
  mixins: [Emitter],
  model: {
    prop: 'ruleList'
  },
  props: {
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      logicOpts: Object.freeze([{
        nodeType: 'LOGICAL',
        label: '并且',
        returnType: 'boolean',
        value: 0
      }, {
        nodeType: 'LOGICAL',
        label: '或者',
        returnType: 'boolean',
        value: 1
      }]),
      menusOptions: Object.freeze([{
        label: '插入规则',
        value: 'insertRule',
        paramType: 'common'
      }, {
        label: '向规则节点前插入"（"',
        value: 'insertBeforeNode',
        paramType: 'insert'
      }, {
        label: '向规则节点后插入"）"',
        value: 'insertAfterNode',
        paramType: 'insert'
      }, {
        label: '删除条件',
        value: 'delCondition',
        paramType: 'common'
      }, {
        label: '回退',
        value: 'undo',
        paramType: 'common'
      }, {
        label: '重做',
        value: 'redo',
        paramType: 'common'
      }, {
        label: '不成立',
        value: 'false',
        paramType: 'common'
      }]),
      errorInfo: ''
    }
  },
  inject: ['ruleEditor'],
  // provide() {
  //   return {
  //     ruleEditor: this,
  //   }
  // },
  watch: {
    ruleList:{
      handler() {
        this.$nextTick(() => {
          this.errorInfo = ''
          broadcast.apply(this, ['GuidEditorCol', 'clearValidateRuleValue'])
        })
      },
      deep: true,
    } 
  },
  methods: {
    validateRule(e) {
      if (['underline values plr-5', 'el-dropdown-link'].includes(e.srcElement._prevClass)) {
        debugger
        return
      }
      if (this.ruleEditor.disabledRule()) { // 下拉表单阻止冒泡
        e.stopPropagation()
      }
    },
    validateAllRuleValue(callback) {

      let promise = null
      let promiseResolve = ''
      let promiseReject = ''
      
      this.errorInfo = ''

      const validate = (error) => {

        // if (this.errorInfo) return

        if (error) {
          this.errorInfo = error
          return promiseReject(error)
        }

        error = this.matchBracket(this.ruleList, this.ruleList.length - 1)
        
        if (error) {
          promiseReject(error)
        } else {
          this.ruleList.map(v => {
            if (!v.nodes && v.type !== 'bracket') {
              error = v.ruleType !== 'decision' ? '选择一个条件' : '选择一个操作'
            }
          })
          if (error) {
            this.errorInfo = error
            promiseReject(error)
          } else {
            promiseResolve()
          }
        }
      }
      
      if (typeof callback !== 'function' && window.Promise) {
        promise = new Promise((resolve, reject) => {
          promiseResolve = resolve
          promiseReject = reject
          callback = validate
        })
      }

      broadcast.apply(this, ['GuidEditorCol', 'validateRuleValue', callback])

      return promise
    },
    getRightClickMenus(str) {
      return this.menusOptions.filter(v => str.includes(v.paramType))
    },
    closeRule(index) {
      this.$emit('insertRule', index)
    },
    conditionOperation(rule, menu, index) {
      if (menu.value === 'false') {
        if (!this.matchBracket(this.ruleList, index)) {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          this.$set(rule, 'right', {
            label: '等于 不成立',
            nodeType: 'CUSTOM',
            returnType: 'boolean',
            paramValue: 'false',
            type: 'input'
          })
          this.$emit('change', rule, menu, index)
        }
      } else {
        if (menu.value === 'insertRule') {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          this.closeRule(index)
        } else if (menu.value === 'insertBeforeNode') {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          this.ruleList.splice(index, 0, {
            label: '(',
            type: 'bracket',
            key: `${Date.now()}-${Math.random()}`
          })
        } else if (menu.value === 'insertAfterNode') {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          rule.brackets.push({
            label: ')',
            type: 'bracket',
            key: `${Date.now()}-${Math.random()}`
          })
        } else if (menu.value === 'delCondition') {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          this.ruleList.splice(index, 1)
          let ruleList = this.ruleList
          const last = ruleList[ruleList.length - 1]
          if (last) {
            last.logic = null
          } else {
            ruleList = this.$parent.generateRuleDate()
          }
          this.$emit('input',  ruleList)
        } else if (menu.value === 'delBracketRight') {
          this.dispatch('GuidRuleEditor', 'pushUndoStacks');
          rule.brackets.splice(idx, 1)
        } else if (menu.value === 'undo') { // 回退
          this.dispatch('GuidRuleEditor', 'popUndoStacks');
        } else if (menu.value === 'redo') { // 重做
          this.dispatch('GuidRuleEditor', 'popRedoStacks');
        }
        this.$emit('change', rule, menu, index)
      }
    },
    // 从右往左查找匹配括号
    matchBracket(nodes, index) {
      let bracketNum = 0
      // 找到当前节点左括号"（"，与右括号 "）"数量
      for (let i = index; i >= 0; i--) {
        if (nodes[i].brackets) { // 统计右括号"）"数量
          for (let j = nodes[i].brackets.length; j--;) {
            bracketNum++
          }
        } else { // 匹配左括号 "（"
          bracketNum--
        }
      }

      // 匹配完成
      if (bracketNum === 0) {
        return this.errorInfo = ''
      }

      if (bracketNum < 0) {
        this.errorInfo = '规则缺少右括号！'
        return this.errorInfo = '规则缺少右括号！'
      } else if (bracketNum > 0) {
        this.errorInfo = '规则缺少左括号！'
        return this.errorInfo = '规则缺少右括号！'
      }
    },
    selectCondition(rule, item) {
      // this.pushUndoStacks()
      this.dispatch('GuidRuleEditor', 'pushUndoStacks')
      this.$set(rule, 'nodes', _.cloneDeep({ ...item, key: `${Date.now()}-${Math.random()}` }))
    },
    // disabledRule() {
    //   return this.$parent.disabledRule()
    // },
    // getExpressNextNode(type) {
    //   return this.$parent.getExpressNextNode(type)
    // },
    getDropdownMenus(item, type) {
      return this.ruleEditor.getDropdownMenus(item, type, this.nodeType)
    },
    // getCodeServiceMenus() {
    //   return this.$parent.getCodeServiceMenus(...arguments)
    // }
  }
}
</script>

<style scoped lang="scss">
.guid-rule-editor-content {
  cursor: pointer;
  // margin-bottom: 10px;
  padding: 0 10px;
  .guid-rule-selector-editor {
    border-bottom: 1px solid #EBEEF5;
    line-height: 32px;
    min-height: 32px;
      .underline:hover {
          text-decoration: underline;
      }
      ::v-deep .symbol {
          color: blue;
          font-weight: bold;
      }
      ::v-deep .pr-10 {
          padding-right: 10px;
      }
      ::v-deep .plr-5 {
          padding: 0 5px;
      }
      ::v-deep .ml-10 {
          margin-left: 10px;
      }
      ::v-deep .guid-rule-editor-col {
          cursor: pointer;
          .underline:hover {
              text-decoration: underline;
          }
          .el-input {
              width: initial;
              // display: inline-block;
          }
          .el-input__inner {
              width: initial;
          }
          .values {
              color: #028229;
              font-weight: bold;
              &.disabled {
                  color: gray!important;
              }
          }
          // .el-date-editor.input {
          //     .el-input__inner {
          //         padding-left: 30px;s
          //         width: 190px!important;
          //     }
          // }
          .input, .el-select {
              .el-tag:has(.el-tag__close) {
                .el-select__tags-text {
                  max-width: 60px!important;
                }
              }
              .el-input__inner {
                  width: 170px!important;
                  // padding: 0;
                  // height: initial;
                  // line-height: initial;
              }
              .el-input__icon {
                  line-height: 32px;
              }
          }
          .el-select {
              .el-input__inner {
                  padding: 0;
              }
          }
          input {
              // border: none;
              border-color: #8dc3ff;
          }
          input:focus {
              &::placeholder {
                  opacity: 0.3;
              }
          }
          input:focus-visible {
              outline-color: #8dc3ff;
          }
          input::placeholder {
              font-weight: bold;
              opacity: 1;
              color: #028229;
          }
      }
  }
  .error {
    // position: absolute;
    // left: 10px;
    // bottom: -15px;
    font-size: 12px;
    color: red;
    margin: 5px;
  }
}
</style>

