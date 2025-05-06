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
const CUSTOM_TYPE = ['time', 'date', 'input', 'selector', 'selector-multiple']
import Vinput from './Vinput'
import PocVinput from './PocVinput2.vue'
import ArrayPocVinput from './Array_PocVinput.vue'
export default {
  props: {
    node: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: null
    }
  },
  computed: {
    ExpressionCodeService() {
      return (formatItem, fieldItem) => {
        let codeService = null
        let listSource = null
        const tempNode = this._.get(fieldItem, `paramValue[${formatItem.listSourceKey}]`)
        if (formatItem.listSource === 'param-codeService') {
          tempNode ? codeService = tempNode.codeService : codeService = null
          listSource = 'codeService'
        } else if (formatItem.listSource === 'expression-codeService') {
          codeService = fieldItem.codeService
          listSource = 'codeService'
        } else if (formatItem.listSource === 'param-field') {
          tempNode ? codeService = tempNode.field : codeService = null
          listSource = 'param-field'
          this.$store.dispatch('app/SET_LISTBYFIELD', { classPath: tempNode.classPath, field: tempNode.field }) // 获取对应子级列表
        }

        return { listSource, codeService, listSourceFilter: formatItem.listSourceFilter }
      }
    }
  },
  render(createElement) {
    const self = this
    // 检查是否存在节点 node，如果不存在则返回一个空字符串，即不进行渲染
    if (!this.node) {
      return ''
    }
    // 判断节点的类型，根据不同的节点类型进行不同的渲染
    // 比较 字段 计算 括号 逻辑
    // 对于类型为 NODE_TYPE.COMPARISON、NODE_TYPE.FIELD、NODE_TYPE.CALCULATE、NODE_TYPE.BRACKETS 和 NODE_TYPE.LOGICAL 的节点，创建一个 <span> 元素，并根据节点类型添加不同的类名。
    if ((this.node && !this.node.exprNode && this.node.nodeType === NODE_TYPE.COMPARISON) || [NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS, NODE_TYPE.LOGICAL].includes(this.node.nodeType)
    ) {
      return <span
        class={`mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
        onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) }}
        onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }}
      >{this.node.text ? this.node.text : this.node.label}</span>
    }
    if ((this.node && this.node.nodeType === NODE_TYPE.COMPARISON) || [NODE_TYPE.FIELD].includes(this.node.nodeType)) {
      if (this.node && this.node.exprNode) {
        const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
        const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
        if (IdExpressionList1[this.node.exprNode.expressionId.toUpperCase()].expressionArray) {
          return createElement(
            'span',
            {
              class: { flex: false }
            },
            [
              createElement(
                'span',
                {
                  class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                  on: {
                    click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                    contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                  }
                },
                this.node.exprNode.methodName
              ),
              ...IdExpressionList1[
                this.node.exprNode.expressionId.toUpperCase()
              ].expressionArray.map((formatItem) => {
                if (Array.isArray(this.node.exprNode.paramValue[formatItem.paramId])) {
                  return createElement('span', [
                    // text文本
                    formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                    formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param0.label`).toString()
              ),
                    formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
                    custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node.exprNode,
                  paramId: formatItem.paramId,
                  path: this.path,
                  index: this.index,
                  hideIcon: 'hideIcon',
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
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
                } else {
                  return createElement('span', [
                    // text文本
                    formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                    formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param0.label`).toString()
              ),
                    formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
                    custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node.exprNode,
                  paramId: formatItem.paramId,
                  hideIcon: 'hideIcon',
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
                }
              }),
              createElement(
                'span',
                {
                  class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                  on: {
                    click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                    contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                  }
                },
                `的${this.node.label}`
              ),
              // createElement(
              //   'i',
              //   {
              //     class: 'el-input__icon el-icon-circle-plus-outline',
              //     slot: 'suffix',
              //     on: {
              //       click: (e) => { this.$emit(this.node.methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: this.node, index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
              //     }
              //   }
              // )
            ]
          )
        } else {
          return createElement(
            'span',
            {
              class: { flex: false }
            },
            [
              createElement(
                'span',
                {
                  class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                  on: {
                    click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                    contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                  }
                },
                this.node.exprNode.methodName
              ),
              createElement(
                'span',
                {
                  class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                  on: {
                    click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                    contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                  }
                },
                `的${this.node.label}`
              ),
              // createElement(
              //   'i',
              //   {
              //     class: 'el-input__icon el-icon-circle-plus-outline',
              //     slot: 'suffix',
              //     on: {
              //       click: (e) => { this.$emit(this.node.methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: this.node, index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
              //     }
              //   }
              // )
            ]
          )
        }
      }
      if (this.node.methodField) {
        return <span
          class={`mr-5 field`}
        // onClick={(e) => { this.$emit('clickTemplate', { node: node, event: e, index: this.index }) }}
        // onContextmenu={(e) => { this.$emit('rightTemplate', { node: node, event: e, index: this.index }) }}
        >{this.node.text}</span>
      } else {
        return <span
          class={`mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
          onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) }}
          onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }}
        >{this.node.text ? this.node.text : this.node.label}</span>
      }
    }
    // 此处渲染 方法的参数中的字段
    // NESTING 渲染嵌套节点.
    // 类型为 NODE_TYPE.NESTING 的节点。
    if (this.node && this.node.nodeType === NODE_TYPE.NESTING) {
      return createElement(
        'span',
        // 遍历 node.arr，处理其中的每个子节点，并递归调用 createElement 函数进行渲染
        this.node.arr.map((item, index) => {
          // 对于字段、计算和括号类型的子节点，创建一个 <span> 元素，并设置相应的类名和 innerHTML 属性。
          if ([NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS].includes(item.nodeType)) {
            return <span class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
              onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index, i: index, changeExp: 'changeExp', path: this.path }) }}
              onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }}
            >{item.label}</span>
          }

          if (item && item.nodeType === NODE_TYPE.FIELD) {
            return <span class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
              onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) }}
              onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, i: index, insertBracket: 'insertBracket', path: this.path }) }}
            >{item.label}</span>
          }
          // 对于表达式类型的子节点，也进行渲染，根据表达式类型不同，创建不同类型的子组件 Vinput 进行渲染
          if (item && item.nodeType === NODE_TYPE.EXPRESSION) {
            const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
            return createElement(
              'span',
              {
                class: { 'margin-5': true }
              },
              this.$store.state.app.IdExpressionList[
                item.expressionId
              ].expressionArray.map((formatItem) => {
                if (item.paramValue[formatItem.paramId] && item.paramValue[formatItem.paramId].exprNode) {
                  const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
                  const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
                  if (IdExpressionList1[item.paramValue[formatItem.paramId].exprNode.expressionId.toUpperCase()].expressionArray) {
                    return createElement(
                      'span',
                      {
                        class: { flex: false }
                      },
                      [
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${item.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                            }
                          },
                          item.paramValue[formatItem.paramId].exprNode.methodName
                        ),
                        ...IdExpressionList1[
                          item.paramValue[formatItem.paramId].exprNode.expressionId.toUpperCase()
                        ].expressionArray.map((formatItem) => {
                          if (Array.isArray(item.paramValue[formatItem.paramId].exprNode.paramValue[formatItem.paramId])) {
                            return createElement('span', [
                              // text文本
                              formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.paramValue[formatItem.paramId],
                        left: item.paramValue[formatItem.paramId].paramValue.param1,
                        right: item.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.paramValue[formatItem.paramId],
                        left: item.paramValue[formatItem.paramId].paramValue.param1,
                        right: item.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                              formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.paramValue[formatItem.paramId], `paramValue.param0.label`).toString()
              ),
                              formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId].paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId].paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.paramValue[formatItem.paramId].paramValue[formatItem.paramId]
                  ? item.paramValue[formatItem.paramId].paramValue[formatItem.paramId].label
                  : ''
              ),
                              custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.paramValue[formatItem.paramId].exprNode,
                  paramId: formatItem.paramId,
                  path: this.path,
                  index: this.index,
                  hideIcon: 'hideIcon',
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.paramValue[formatItem.paramId]
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
                          } else {
                            return createElement('span', [
                              // text文本
                              formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.paramValue[formatItem.paramId],
                        left: item.paramValue[formatItem.paramId].paramValue.param1,
                        right: item.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.paramValue[formatItem.paramId],
                        left: item.paramValue[formatItem.paramId].paramValue.param1,
                        right: item.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                              formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.paramValue[formatItem.paramId], `paramValue.param0.label`).toString()
              ),
                              formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId].paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId].paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.paramValue[formatItem.paramId].paramValue[formatItem.paramId]
                  ? item.paramValue[formatItem.paramId].paramValue[formatItem.paramId].label
                  : ''
              ),
                              custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.paramValue[formatItem.paramId].exprNode,
                  paramId: formatItem.paramId,
                  hideIcon: 'hideIcon',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.paramValue[formatItem.paramId]
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
                          }
                        }),
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${item.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                            }
                          },
                          `的${item.paramValue[formatItem.paramId].label}`
                        ),
                        // createElement(
                        //   'i',
                        //   {
                        //     class: 'el-input__icon el-icon-circle-plus-outline',
                        //     slot: 'suffix',
                        //     on: {
                        //       click: (e) => { this.$emit(item.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: item.paramValue[formatItem.paramId], index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
                        //     }
                        //   }
                        // )
                      ]
                    )
                  } else {
                    return createElement(
                      'span',
                      {
                        class: { flex: false }
                      },
                      [
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${item.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                            }
                          },
                          item.paramValue[formatItem.paramId].exprNode.methodName
                        ),
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${item.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                            }
                          },
                          `的${item.paramValue[formatItem.paramId].label}`
                        ),
                        // createElement(
                        //   'i',
                        //   {
                        //     class: 'el-input__icon el-icon-circle-plus-outline',
                        //     slot: 'suffix',
                        //     on: {
                        //       click: (e) => { this.$emit(item.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: this.node, index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
                        //     }
                        //   }
                        // )
                      ]
                    )
                  }
                } else {
                  return createElement('span', [
                    formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                    formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                    formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
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
                        path: this.path,
                        i: this.i,
                        index: this.index,
                        nodeT: 'EXPRESSION',
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
                }
              })
            )
          }
          if (item && item.dataType === 'method' || item.nodeType === 'METHOD') {
            const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
            const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
            if (IdExpressionList1[item.expressionId.toUpperCase()].expressionArray) {
              return createElement(
                'span',
                {
                  class: { 'margin-5': true }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                      }
                    },
                    item.label
                  ),
                  ...IdExpressionList1[
                    item.expressionId.toUpperCase()
                  ].expressionArray.map((formatItem) => {
                    return createElement('span', [
                      formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                      formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                      formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                      custom.includes(formatItem.type) &&
                    createElement(PocVinput, {
                      props: {
                        treeData: this.treeData,
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
                ]
              )
            } else {
              return createElement(
                'span',
                {
                  class: { 'margin-5': true }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                      }
                    },
                    item.methodName
                  )
                ]
              )
            }
          }
          // 类型为 NODE_TYPE.CUSTOM 的节点，也是创建一个 Vinput 子组件进行渲染，传入相应的参数进行处理
          if (item && item.nodeType === NODE_TYPE.CUSTOM) {
            return createElement(Vinput, {
              props: {
                format: item, // 传入props
                node: item,
                i: index,
                index: this.index,
                path: this.path,
                nodeT: 'NESTING',
                paramId: this.paramId,
                selectListInfo: {
                  codeService: item.codeService
                }
              }
            })
          }

          return ''
        })
      )
    } if (this.node && this.node.nodeType === 'TREE_EX') {
      const arrayToMap = this.node.arr ? this.node.arr : this.node.nodeSet
      return createElement(
        'span',
        // 遍历 node.arr，处理其中的每个子节点，并递归调用 createElement 函数进行渲染
        arrayToMap.map((item, index) => {
          // 对于字段、计算和括号类型的子节点，创建一个 <span> 元素，并设置相应的类名和 innerHTML 属性。
          // 渲染运算符或者括号
          if ([NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS].includes(item.nodeType)) {
            return <span class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
              onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index, i: index, changeExp: 'changeExp', path: this.path }) }}
              onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }}
            >{item.label}</span>
          }
          // 渲染字段
          if ([NODE_TYPE.FIELD].includes(item.nodeType)) {
            if (item && item.exprNode) {
              const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
              const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
              if (IdExpressionList1[item.exprNode.path.toUpperCase()].expressionArray) {
                return createElement(
                  'span',
                  {
                    class: { flex: false }
                  },
                  [
                    createElement(
                      'span',
                      {
                        class: `mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                        on: {
                          click: (e) => { this.$emit('clickTemplate', { node: item, event: e, index: this.index }) },
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item, event: e, index: this.index }) }
                        }
                      },
                      item.exprNode.methodName
                    ),
                    ...IdExpressionList1[
                      item.exprNode.path.toUpperCase()
                    ].expressionArray.map((formatItem) => {
                      if (Array.isArray(item.exprNode.paramValue[formatItem.paramId])) {
                        return createElement('span', [
                        // text文本
                          formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                          formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.exprNode, `paramValue.param0.label`).toString()
              ),
                          formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.exprNode.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.exprNode.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.exprNode.paramValue[formatItem.paramId]
                  ? item.exprNode.paramValue[formatItem.paramId].label
                  : ''
              ),
                          custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.exprNode,
                  paramId: formatItem.paramId,
                  path: this.path,
                  hideIcon: 'hideIcon',
                  index: this.index,
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.exprNode
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
                      } else {
                        return createElement('span', [
                        // text文本
                          formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                          formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.exprNode, `paramValue.param0.label`).toString()
              ),
                          formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.exprNode.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.exprNode.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.exprNode.paramValue[formatItem.paramId]
                  ? item.exprNode.paramValue[formatItem.paramId].label
                  : ''
              ),
                          custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.exprNode,
                  paramId: formatItem.paramId,
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.exprNode
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
                      }
                    }),
                    createElement(
                      'span',
                      {
                        class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                        on: {
                          click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                        }
                      },
                      `的${item.label}`
                    ),
                    // createElement(
                    //   'i',
                    //   {
                    //     class: 'el-input__icon el-icon-circle-plus-outline',
                    //     slot: 'suffix',
                    //     on: {
                    //       click: (e) => { this.$emit(this.node.methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { event: e, node: this.node, i: index, index: this.index, type: 'FIELD', path: this.path }) }
                    //     }
                    //   }
                    // )
                  ]
                )
              } else {
                return createElement(
                  'span',
                  {
                    class: { flex: false }
                  },
                  [
                    createElement(
                      'span',
                      {
                        class: `mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                        on: {
                          click: (e) => { this.$emit('clickTemplate', { node: item, event: e, index: this.index }) },
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item, event: e, index: this.index }) }
                        }
                      },
                      item.exprNode.methodName
                    ),
                    createElement(
                      'span',
                      {
                        class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                        on: {
                          click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                        }
                      },
                      `的${item.label}`
                    ),
                    // createElement(
                    //   'i',
                    //   {
                    //     class: 'el-input__icon el-icon-circle-plus-outline',
                    //     slot: 'suffix',
                    //     on: {
                    //       click: (e) => { this.$emit(this.node.methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { event: e, node: this.node, i: index, index: this.index, type: 'FIELD', path: this.path }) }
                    //     }
                    //   }
                    // )
                  ]
                )
              }
            } else {
              return <span
                class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
                onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index, i: index, path: this.path, changeField: 'changeField' }) }}
                onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, i: index, insertBracket: 'insertBracket', path: this.path }) }}
              >{item.label}</span>
            }
          }
          // 对于表达式类型的子节点，也进行渲染，根据表达式类型不同，创建不同类型的子组件 Vinput 进行渲染
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
              {
                class: { 'margin-5': true }
              },
              this.$store.state.app.IdExpressionList[
                item.expressionId
              ].expressionArray.map((formatItem) => {
                return createElement('span', [
                  formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                  formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                  formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
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
          if (item && item.nodeType === 'METHOD') {
            const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
            const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
            if (IdExpressionList1[item.expressionId.toUpperCase()].expressionArray) {
              return createElement(
                'span',
                {
                  class: { 'margin-5': true }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, insertBracket: 'insertBracket', path: this.path, i: index }) }
                      }
                    },
                    item.methodName
                  ),
                  ...IdExpressionList1[
                    item.expressionId.toUpperCase()
                  ].expressionArray.map((formatItem) => {
                    if (Array.isArray(item.paramValue[formatItem.paramId])) {
                      return createElement('span', [
                        formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                        formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                        formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                        custom.includes(formatItem.type) &&
                    createElement(ArrayPocVinput, {
                      props: {
                        treeData: this.treeData,
                        format: item, // 传入props
                        node: item,
                        path: this.path,
                        index: this.index,
                        arrItemIndex: this.arrItemIndex,
                        i: index,
                        nodeT: 'method2',
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
                    // return item.paramValue[formatItem.paramId].map(element => {
                    //   return recursiveRender(element)
                    // })
                    } else {
                      return createElement('span', [
                        formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                        formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                        formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                        custom.includes(formatItem.type) &&
                    createElement(PocVinput, {
                      props: {
                        treeData: this.treeData,
                        format: formatItem, // 传入props
                        node: item,
                        path: this.path,
                        index: this.index,
                        i: index,
                        nodeT: 'method2',
                        arrItemIndex: this.arrItemIndex,
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
                    }
                  })
                ]
              )
            } else {
              return createElement(
                'span',
                {
                  class: { 'margin-5': true }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, insertBracket: 'insertBracket', path: this.path, i: index }) }
                      }
                    },
                    item.methodName
                  )
                ]
              )
            }
          }

          // 类型为 NODE_TYPE.CUSTOM 的节点，也是创建一个 Vinput 子组件进行渲染，传入相应的参数进行处理
          if (item && item.nodeType === NODE_TYPE.CUSTOM) {
            return createElement(Vinput, {
              props: {
                format: item, // 传入props
                node: item,
                i: index,
                index: this.index,
                path: this.path,
                nodeT: 'TREE_EX',
                paramId: this.paramId,
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
      if (typeof this.node.paramValue === 'object' && this.node.paramValue !== null) {
        if (Object.prototype.toString.call(this.node.paramValue) === '[object Object]') {
          return createElement(PocVinput, {
            props: {
              treeData: this.treeData,
              format: this.node, // 传入props
              node: this.node,
              index: this.index,
              path: this.path,
              paramId: this.paramId,
              methodParamInput: this.node.methodParamInput ? 'methodParamInput' : '',
              selectListInfo: {
                codeService: this.node.codeService
              }
            }
          })
        }
      } else {
        return createElement(Vinput, {
          props: {
            treeData: this.treeData,
            format: this.node, // 传入props
            node: this.node,
            index: this.index,
            path: this.path,
            paramId: this.paramId,
            i: this.i,
            arrItemIndex: this.arrItemIndex,
            methodParamInput: this.node.methodParamInput ? 'methodParamInput' : '',
            selectListInfo: {
              codeService: this.node.codeService
            }
          }
        })
      }
    }

    // EXPRESSION 表达式节点
    if (this.node && this.node.nodeType === NODE_TYPE.EXPRESSION) {
      const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
      return createElement(
        'span',
        {
          class: { flex: false }
        },
        this.$store.state.app.IdExpressionList[
          this.node.expressionId
        ].expressionArray.map((formatItem) => {
          if (this.node.paramValue[formatItem.paramId] && this.node.paramValue[formatItem.paramId].nodeType === 'TREE_EX') {
            const arrayToMap = this.node.paramValue[formatItem.paramId].arr ? this.node.paramValue[formatItem.paramId].arr : this.node.paramValue[formatItem.paramId].nodeSet
            return createElement(
              'span',
              // 遍历 node.arr，处理其中的每个子节点，并递归调用 createElement 函数进行渲染
              arrayToMap.map((item, index) => {
                // 对于字段、计算和括号类型的子节点，创建一个 <span> 元素，并设置相应的类名和 innerHTML 属性。
                // 渲染运算符或者括号
                if ([NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS].includes(item.nodeType)) {
                  return <span class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
                    onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index, i: index, changeExp: 'changeExp', path: this.path }) }}
                    onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }}
                  >{item.label}</span>
                }
                // 渲染字段
                if ([NODE_TYPE.FIELD].includes(item.nodeType)) {
                  if (item && item.exprNode) {
                    const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
                    const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
                    if (IdExpressionList1[item.exprNode.path.toUpperCase()].expressionArray) {
                      return createElement(
                        'span',
                        {
                          class: { flex: false }
                        },
                        [
                          createElement(
                            'span',
                            {
                              class: `mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                              on: {
                                click: (e) => { this.$emit('clickTemplate', { node: item, event: e, index: this.index }) },
                                contextmenu: (e) => { this.$emit('rightTemplate', { node: item, event: e, index: this.index }) }
                              }
                            },
                            item.exprNode.methodName
                          ),
                          ...IdExpressionList1[
                            item.exprNode.path.toUpperCase()
                          ].expressionArray.map((formatItem) => {
                            if (Array.isArray(item.exprNode.paramValue[formatItem.paramId])) {
                              return createElement('span', [
                                // text文本
                                formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                                formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.exprNode, `paramValue.param0.label`).toString()
              ),
                                formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.exprNode.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.exprNode.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.exprNode.paramValue[formatItem.paramId]
                  ? item.exprNode.paramValue[formatItem.paramId].label
                  : ''
              ),
                                custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.exprNode,
                  paramId: formatItem.paramId,
                  path: this.path,
                  hideIcon: 'hideIcon',
                  index: this.index,
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.exprNode
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
                            } else {
                              return createElement('span', [
                                // text文本
                                formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...item.exprNode,
                        left: item.exprNode.paramValue.param1,
                        right: item.exprNode.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                                formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(item.exprNode, `paramValue.param0.label`).toString()
              ),
                                formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: item.exprNode.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: item.exprNode.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                item.exprNode.paramValue[formatItem.paramId]
                  ? item.exprNode.paramValue[formatItem.paramId].label
                  : ''
              ),
                                custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: item.exprNode,
                  paramId: formatItem.paramId,
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    item.exprNode
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
                            }
                          }),
                          createElement(
                            'span',
                            {
                              class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                              on: {
                                click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                                contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                              }
                            },
                            `的${item.label}`
                          ),
                          // createElement(
                          //   'i',
                          //   {
                          //     class: 'el-input__icon el-icon-circle-plus-outline',
                          //     slot: 'suffix',
                          //     on: {
                          //       click: (e) => { this.$emit(this.node.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { event: e, node: this.node, i: index, index: this.index, type: 'FIELD', path: this.path }) }
                          //     }
                          //   }
                          // )
                        ]
                      )
                    } else {
                      return createElement(
                        'span',
                        {
                          class: { flex: false }
                        },
                        [
                          createElement(
                            'span',
                            {
                              class: `mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                              on: {
                                click: (e) => { this.$emit('clickTemplate', { node: item, event: e, index: this.index }) },
                                contextmenu: (e) => { this.$emit('rightTemplate', { node: item, event: e, index: this.index }) }
                              }
                            },
                            item.exprNode.methodName
                          ),
                          createElement(
                            'span',
                            {
                              class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                              on: {
                                click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                                contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                              }
                            },
                            `的${item.label}`
                          ),
                          // createElement(
                          //   'i',
                          //   {
                          //     class: 'el-input__icon el-icon-circle-plus-outline',
                          //     slot: 'suffix',
                          //     on: {
                          //       click: (e) => { this.$emit(this.node.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { event: e, node: this.node, i: index, index: this.index, type: 'FIELD', path: this.path }) }
                          //     }
                          //   }
                          // )
                        ]
                      )
                    }
                  } else {
                    return <span
                      class={`mr-5 ${item.nodeType === NODE_TYPE.FIELD ? 'field' : ''}`}
                      onClick={(e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index, i: index, path: this.path, changeField: 'changeField' }) }}
                      onContextmenu={(e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, i: index, insertBracket: 'insertBracket', path: this.path }) }}
                    >{item.label}</span>
                  }
                }
                // 对于表达式类型的子节点，也进行渲染，根据表达式类型不同，创建不同类型的子组件 Vinput 进行渲染
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
                    {
                      class: { 'margin-5': true }
                    },
                    this.$store.state.app.IdExpressionList[
                      item.expressionId
                    ].expressionArray.map((formatItem) => {
                      return createElement('span', [
                        formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                        formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                        formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
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
                if (item && item.nodeType === 'METHOD') {
                  const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
                  const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
                  if (IdExpressionList1[item.expressionId.toUpperCase()].expressionArray) {
                    return createElement(
                      'span',
                      {
                        class: { 'margin-5': true }
                      },
                      [
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, insertBracket: 'insertBracket', path: this.path, i: index }) }
                            }
                          },
                          item.methodName
                        ),
                        ...IdExpressionList1[
                          item.expressionId.toUpperCase()
                        ].expressionArray.map((formatItem) => {
                          if (Array.isArray(item.paramValue[formatItem.paramId])) {
                            return createElement('span', [
                              formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                              formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                              formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                              custom.includes(formatItem.type) &&
                    createElement(ArrayPocVinput, {
                      props: {
                        treeData: this.treeData,
                        format: item, // 传入props
                        node: item,
                        path: this.path,
                        index: this.index,
                        arrItemIndex: this.arrItemIndex,
                        i: index,
                        nodeT: 'method2',
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
                            // return item.paramValue[formatItem.paramId].map(element => {
                            //   return recursiveRender(element)
                            // })
                          } else {
                            return createElement('span', [
                              formatItem.type === 'text' &&
                    createElement('span', {
                      on: {
                        click: (e) => {
                          switch (item.expressionId) {
                            case 'STR_NOT_INCLUDE':
                            case 'STR_NOT_START_WITH':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                            case 'OBJECT_CENTRE_FIELD_STRING':
                            case 'OBJECT_CENTRE_FIELD_DOUBLE':
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index].paramValue.param1 }, event: e, index: this.index })
                              break
                            default:
                              this.$emit('clickTemplate', { node: { left: this.node.paramValue[formatItem.paramId].arr[index - 1] }, event: e, index: this.index })
                              break
                          }
                        }
                      }
                    }, formatItem.desc),
                              formatItem.type === 'actualTypeNames' &&
                    createElement(
                      'span', {
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => { this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }) }
                        }
                      },
                      _.get(
                        item,
                        `paramValue.param1.actualTypeNames`
                      ).toString()
                    ),
                              formatItem.type === 'field' &&
                    createElement(
                      'span',
                      {
                        class: {
                          field: true
                        },
                        on: {
                          click: (e) => this.$emit('clickTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index }),
                          contextmenu: (e) => this.$emit('rightTemplate', { node: item.paramValue[formatItem.paramId], event: e, index: this.index })
                        }
                      },
                      item.paramValue[formatItem.paramId]
                        ? item.paramValue[formatItem.paramId].label
                        : ''
                    ),
                              custom.includes(formatItem.type) &&
                    createElement(PocVinput, {
                      props: {
                        treeData: this.treeData,
                        format: formatItem, // 传入props
                        node: item,
                        path: this.path,
                        index: this.index,
                        i: index,
                        nodeT: 'method2',
                        arrItemIndex: this.arrItemIndex,
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
                          }
                        })
                      ]
                    )
                  } else {
                    return createElement(
                      'span',
                      {
                        class: { 'margin-5': true }
                      },
                      [
                        createElement(
                          'span',
                          {
                            class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                            on: {
                              click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                              contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index, insertBracket: 'insertBracket', path: this.path, i: index }) }
                            }
                          },
                          item.methodName
                        )
                      ]
                    )
                  }
                }

                // 类型为 NODE_TYPE.CUSTOM 的节点，也是创建一个 Vinput 子组件进行渲染，传入相应的参数进行处理
                if (item && item.nodeType === NODE_TYPE.CUSTOM) {
                  return createElement(Vinput, {
                    props: {
                      format: item, // 传入props
                      node: item,
                      i: index,
                      index: this.index,
                      path: this.path,
                      nodeT: 'TREE_EX',
                      paramId: this.paramId,
                      selectListInfo: {
                        codeService: item.codeService
                      }
                    }
                  })
                }

                return ''
              })
            )
          } else if (this.node.paramValue[formatItem.paramId] && this.node.paramValue[formatItem.paramId].exprNode) {
            const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
            const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
            if (IdExpressionList1[this.node.paramValue[formatItem.paramId].exprNode.expressionId.toUpperCase()].expressionArray) {
              return createElement(
                'span',
                {
                  class: { flex: false }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                      }
                    },
                    this.node.paramValue[formatItem.paramId].exprNode.methodName
                  ),
                  ...IdExpressionList1[
                    this.node.paramValue[formatItem.paramId].exprNode.expressionId.toUpperCase()
                  ].expressionArray.map((formatItem) => {
                    if (Array.isArray(this.node.paramValue[formatItem.paramId].exprNode.paramValue[formatItem.paramId])) {
                      return createElement('span', [
                        // text文本
                        formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node.paramValue[formatItem.paramId],
                        left: this.node.paramValue[formatItem.paramId].paramValue.param1,
                        right: this.node.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node.paramValue[formatItem.paramId],
                        left: this.node.paramValue[formatItem.paramId].paramValue.param1,
                        right: this.node.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                        formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node.paramValue[formatItem.paramId], `paramValue.param0.label`).toString()
              ),
                        formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId].label
                  : ''
              ),
                        custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node.paramValue[formatItem.paramId].exprNode,
                  paramId: formatItem.paramId,
                  path: this.path,
                  index: this.index,
                  hideIcon: 'hideIcon',
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    this.node.paramValue[formatItem.paramId]
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
                    } else {
                      return createElement('span', [
                        // text文本
                        formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node.paramValue[formatItem.paramId],
                        left: this.node.paramValue[formatItem.paramId].paramValue.param1,
                        right: this.node.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node.paramValue[formatItem.paramId],
                        left: this.node.paramValue[formatItem.paramId].paramValue.param1,
                        right: this.node.paramValue[formatItem.paramId].paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                        formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node.paramValue[formatItem.paramId], `paramValue.param0.label`).toString()
              ),
                        formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].paramValue[formatItem.paramId].label
                  : ''
              ),
                        custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node.paramValue[formatItem.paramId].exprNode,
                  paramId: formatItem.paramId,
                  hideIcon: 'hideIcon',
                  selectListInfo: this.ExpressionCodeService(
                    formatItem,
                    this.node.paramValue[formatItem.paramId]
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
                    }
                  }),
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                      }
                    },
                    `的${this.node.paramValue[formatItem.paramId].label}`
                  ),
                  // createElement(
                  //   'i',
                  //   {
                  //     class: 'el-input__icon el-icon-circle-plus-outline',
                  //     slot: 'suffix',
                  //     on: {
                  //       click: (e) => { this.$emit(this.node.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: this.node.paramValue[formatItem.paramId], index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
                  //     }
                  //   }
                  // )
                ]
              )
            } else {
              return createElement(
                'span',
                {
                  class: { flex: false }
                },
                [
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                      }
                    },
                    this.node.paramValue[formatItem.paramId].exprNode.methodName
                  ),
                  createElement(
                    'span',
                    {
                      class: `mr-5 ${this.node.paramValue[formatItem.paramId].nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                      on: {
                        click: (e) => { this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) },
                        contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }) }
                      }
                    },
                    `的${this.node.paramValue[formatItem.paramId].label}`
                  ),
                  // createElement(
                  //   'i',
                  //   {
                  //     class: 'el-input__icon el-icon-circle-plus-outline',
                  //     slot: 'suffix',
                  //     on: {
                  //       click: (e) => { this.$emit(this.node.paramValue[formatItem.paramId].methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { arrItemIndex: this.arrItemIndex, node: this.node, index: this.index, type: 'FIELD', path: this.path, i: this.i, paramId: this.paramId }) }
                  //     }
                  //   }
                  // )
                ]
              )
            }
          } else {
            return createElement('span', [
            // text文本
              formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
              formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param1.label`).toString()
              ),
              formatItem.type === 'field' && this.node.paramValue[formatItem.paramId].nodeType !== 'METHOD' && !this.node.paramValue[formatItem.paramId].exprNode &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
              formatItem.type === 'field' && this.node.paramValue[formatItem.paramId].nodeType === 'METHOD' &&
            createElement(PocVinput, {
              class: { 'mr-5': true },
              props: {
                format: formatItem, // 传入props
                node: this.node,
                path: this.path,
                index: this.index,
                i: this.i,
                arrItemIndex: this.arrItemIndex,
                paramId: formatItem.paramId,
                nodeT: 'EXPRESSION',
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
            }),
              custom.includes(formatItem.type) &&
              createElement(Vinput, {
                class: { 'mr-5': true },
                props: {
                  format: formatItem, // 传入props
                  node: this.node,
                  paramId: formatItem.paramId,
                  nodeT: 'EXPRESSION',
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
          }
        })
      )
    }
    if (this.node && this.node.dataType === 'method' || this.node.nodeType === 'METHOD') {
      const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
      const custom = ['time', 'date', 'input', 'selector', 'selector-multiple', 'string', 'int', 'double', 'integer']
      if (IdExpressionList1[this.node.expressionId.toUpperCase()].expressionArray) {
        return createElement(
          'span',
          {
            class: { flex: false }
          },
          [
            createElement(
              'span',
              {
                class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                on: {
                  click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                  contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                }
              },
              this.node.methodName
            ),
            ...IdExpressionList1[
              this.node.expressionId.toUpperCase()
            ].expressionArray.map((formatItem) => {
              if (Array.isArray(this.node.paramValue[formatItem.paramId])) {
                return createElement('span', [
                  // text文本
                  formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                  formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param0.label`).toString()
              ),
                  formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
                  custom.includes(formatItem.type) &&
              createElement(ArrayPocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node,
                  path: this.path,
                  index: this.index,
                  arrItemIndex: this.arrItemIndex,
                  nodeT: 'method2',
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
              } else {
                return createElement('span', [
                  // text文本
                  formatItem.type === 'text' &&
              createElement(
                'span',
                { class: { 'mr-5': true },
                  on: {
                    click: (e) => {
                      this.$emit('clickTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    },
                    contextmenu: (e) => {
                      this.$emit('rightTemplate', { node: {
                        ...this.node,
                        left: this.node.paramValue.param1,
                        right: this.node.paramValue.param2
                      }, event: e, index: this.index })
                    }
                  }},
                formatItem.desc
              ),
                  formatItem.type === 'actualTypeNames' &&
              createElement(
                'span',
                _.get(this.node, `paramValue.param0.label`).toString()
              ),
                  formatItem.type === 'field' &&
              createElement(
                'span',
                {
                  class: { 'mr-5': true, field: true },
                  on: {
                    click: (e) => this.$emit('clickTemplate', { node: this.node.paramValue[formatItem.paramId], event: e, index: this.index }),
                    contextmenu: (e) => this.$emit('rightTemplate', { node: this.node.paramValue[formatItem.paramId], id: formatItem.paramId, event: e, index: this.index })
                  }
                },
                this.node.paramValue[formatItem.paramId]
                  ? this.node.paramValue[formatItem.paramId].label
                  : ''
              ),
                  custom.includes(formatItem.type) &&
              createElement(PocVinput, {
                class: { 'mr-5': true },
                props: {
                  treeData: this.treeData,
                  format: formatItem, // 传入props
                  node: this.node,
                  path: this.path,
                  index: this.index,
                  i: this.i,
                  arrItemIndex: this.arrItemIndex,
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
              }
            })
          ]
        )
      } else {
        return createElement(
          'span',
          {
            class: { flex: false }
          },
          [
            createElement(
              'span',
              {
                class: `mr-5 ${this.node.nodeType === NODE_TYPE.FIELD ? 'field' : 'field'}`,
                on: {
                  click: (e) => { this.$emit('clickTemplate', { node: this.node, event: e, index: this.index }) },
                  contextmenu: (e) => { this.$emit('rightTemplate', { node: this.node, event: e, index: this.index }) }
                }
              },
              this.node.methodName
            ),
            // createElement(
            //   'i',
            //   {
            //     class: 'el-input__icon el-icon-circle-plus-outline',
            //     slot: 'suffix',
            //     on: {
            //       click: (e) => { this.$emit(this.node.methodParamField ? 'methodParamIconClick' : 'plusIconRightclick', { event: e, node: this.node, i: this.i, index: this.index, type: 'FIELD', path: this.path }) }
            //     }
            //   }
            // )
          ]
        )
      }
    }
    return ''
  }
}
</script>
