<script>
const NODE_TYPE = {
  LOGICAL: 'LOGICAL', // 且或节点
  COMPARISON: 'COMPARISON', // 比较节点
  EXPRESSION: 'EXPRESSION', // 表达式节点
  FIELD: 'FIELD', // 字段节点
  CUSTOM: 'CUSTOM', // 用户输入节点（控件）
  NESTING: 'NESTING', // 嵌套节点
  BRACKETS: 'BRACKETS', // 括号
  CALCULATE: 'CALCULATE' // 算术（加减乘除、拼接）
}

import Vinput from './Vinput'
import _ from 'lodash'
import store from '@/store'
import { SET_LISTBYFIELD } from '@/utils/utils'
export default {
  name: 'RuleEditorRender',
  props: {
    node: {
      type: Object,
      default: null
    }
  },
  computed: {
    ExpressionCodeService() {
      return (formatItem, fieldItem) => {
        let codeService = null
        let listSource = null
        const tempNode = _.get(
          fieldItem,
          `paramValue[${formatItem.listSourceKey}]`
        )
        if (formatItem.listSource === 'param-codeService') {
          tempNode ? (codeService = tempNode.codeService) : (codeService = null)
          listSource = 'codeService'
        } else if (formatItem.listSource === 'expression-codeService') {
          codeService = fieldItem.codeService
          listSource = 'codeService'
        } else if (formatItem.listSource === 'param-field') {
          tempNode ? (codeService = tempNode.field) : (codeService = null)
          listSource = 'param-field'
          SET_LISTBYFIELD({
            classPath: tempNode.classPath,
            field: tempNode.field
          }) // 获取对应子级列表
        }

        return {
          listSource,
          codeService,
          listSourceFilter: formatItem.listSourceFilter
        }
      }
    }
  },

  render(createElement) {
    const self = this
    if (!this.node) {
      return ''
    }
    // 比较 字段 计算 括号 逻辑
    if (
      (this.node && this.node.nodeType === NODE_TYPE.COMPARISON) ||
      [
        NODE_TYPE.FIELD,
        NODE_TYPE.CALCULATE,
        NODE_TYPE.BRACKETS,
        NODE_TYPE.LOGICAL
      ].includes(this.node.nodeType)
    ) {
      return createElement('span', {
        class: { 'mr-5': true, field: this.node.nodeType === NODE_TYPE.FIELD },
        // DOM property
        domProps: { innerHTML: this.node.label }
      })
    }
    // NESTING 渲染嵌套节点
    if (this.node && this.node.nodeType === NODE_TYPE.NESTING) {
      return createElement(
        'span',
        this.node.arr.map((item) => {
          if (
            (item && item.nodeType === NODE_TYPE.FIELD) ||
            [NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS].includes(item.nodeType)
          ) {
            return createElement('span', {
              class: { 'mr-5': true, field: item.nodeType === NODE_TYPE.FIELD },
              // DOM property
              domProps: { innerHTML: item.label }
            })
          }
          if (item && item.nodeType === NODE_TYPE.EXPRESSION) {
            const custom = [
              'time',
              'date',
              'input',
              'selector',
              'selector-multiple'
            ]
            return createElement(
              'span',
              { class: { 'margin-5': true }},
              store.state.app.IdExpressionList[
                item.expressionId
              ].expressionArray.map((formatItem) => {
                return createElement('span', [
                  formatItem.type === 'text' &&
                    createElement('span', formatItem.desc),
                  formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span',
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                  formatItem.type === 'field' &&
                    createElement(
                      'span',
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                  custom.includes(formatItem.type) &&
                    createElement(Vinput, {
                      props: {
                        format: formatItem, // 传入props
                        node: item,
                        paramId: formatItem.paramId,
                        selectListInfo: this.ExpressionCodeService(
                          formatItem,
                          item
                        )
                      },
                      on: {
                        // 需要强制渲染数据通信
                        changeSelect() {
                          self.$forceUpdate()
                        }
                      }
                    })
                ])
              })
            )
          }

          if (item && item.nodeType === NODE_TYPE.CUSTOM) {
            return createElement(Vinput, {
              props: {
                format: item, // 传入props
                node: item,
                selectListInfo: {
                  codeService: item.codeService
                }
              }
            })
          }

          return ''
        })
      )
    }
    // CUSTOM 渲染用户输入节点
    if (this.node && this.node.nodeType === NODE_TYPE.CUSTOM) {
      return createElement(Vinput, {
        props: {
          format: this.node, // 传入props
          node: this.node,
          selectListInfo: {
            codeService: this.node.codeService
          }
        }
      })
    }
    // EXPRESSION 表达式节点
    if (this.node && this.node.nodeType === NODE_TYPE.EXPRESSION) {
      const custom = ['time', 'date', 'input', 'selector', 'selector-multiple']
      return createElement(
        'span',
        {
          class: { flex: false }
        },
        store.state.app.IdExpressionList[
          this.node.expressionId
        ].expressionArray.map((formatItem) => {
          return createElement('span', [
            // text文本
            formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true }},
                formatItem.desc
              ),
            formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param1.actualTypeNames`).toString()
              ),
            formatItem.type === 'field' &&
              createElement(
                'span',
                { class: { 'mr-5': true, field: true }},
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
            custom.includes(formatItem.type) &&
              createElement(Vinput, {
                class: { 'mr-5': true },
                props: {
                  format: formatItem, // 传入props
                  node: this.node,
                  paramId: formatItem.paramId,
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    this.node
                  )
                },
                on: {
                  // 需要强制渲染数据通信
                  changeSelect() {
                    self.$forceUpdate()
                  }
                }
              })
          ])
        })
      )
    }
    return ''
  }
}
</script>
