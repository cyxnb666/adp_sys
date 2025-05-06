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
// const expressionList = JSON.parse(localStorage.getItem('expressionList'))
import Vinput from './PocVinput.vue'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }, node: {},
    treeData: {
      type: Array,
      default: Array
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
  // span 元素创建  就是各种按钮
  render(createElement, context) {
    const self = this
    // 如果这个节点不存在  直接返回空
    if (!this.node) {
      return ''
    }
    // 节点存在并且 节点的类型等于比较节点 或者等于字段节点 或者等于算术  或者等于括号  或者等于且或节点
    if (this.node && this.node.nodeType === NODE_TYPE.COMPARISON || this.node.nodeType === NODE_TYPE.FIELD || this.node.nodeType === NODE_TYPE.CALCULATE || this.node.nodeType === NODE_TYPE.BRACKETS || this.node.nodeType === NODE_TYPE.LOGICAL) {
      // 返回创建一个span元素 在里面加入该节点的内容
      return createElement('span', {
        'class': { 'mr-5': true },
        // DOM property
        domProps: { innerHTML: this.node.label }
      })
    }
    // 节点存在并且 节点的类型等于嵌套节点
    if (this.node && this.node.nodeType === NODE_TYPE.NESTING) {
      // 返回创建一个span元素
      return createElement('span', this.node.arr.map(item => {
        // 将节点下的arr数组循环
        // 循环项存在并且节点类型等于字段节点 或者等于算术 或者等于括号
        if (item && item.nodeType === NODE_TYPE.FIELD || item.nodeType === NODE_TYPE.CALCULATE || item.nodeType === NODE_TYPE.BRACKETS) {
          // 创建span元素  将循环项中的内容放入span中
          return createElement('span', {
            'class': { 'mr-5': true },
            // DOM property
            domProps: { innerHTML: item.label }
          })
        }
        // 循环项存在并且节点类型等于表达式节点
        if (item && item.nodeType === NODE_TYPE.EXPRESSION) {
          return createElement('span', this.$store.state.bom.expressionList[item.expressionId].expressionArray.map((formatItem) => {
            return createElement('span', [
              formatItem.type === 'text' && createElement('span', formatItem.desc),
              formatItem.type === 'actualTypeNames' && createElement('span', this._.get(item, `paramValue.param1.actualTypeNames`).toString()),
              formatItem.type === 'field' && createElement('span', item.paramValue[formatItem.paramId] ? item.paramValue[formatItem.paramId].label : ''),
              CUSTOM_TYPE.includes(formatItem.type) && createElement(Vinput, {
                props: {
                  treeData: this.treeData,
                  disabled: this.disabled,
                  format: formatItem, // 传入props
                  node: item,
                  paramId: formatItem.paramId,
                  selectListInfo: this.ExpressionCodeService(formatItem, item)
                },
                on: {
                  // 需要强制渲染数据通信
                  changeSelect() {
                    self.$forceUpdate()
                  }
                }
              })
            ])
          }))
        }
        // 循环项存在并且节点类型等于用户输入节点
        if (item && item.nodeType === NODE_TYPE.CUSTOM) {
          return createElement(Vinput, {
            props: {
              treeData: this.treeData,
              disabled: this.disabled,
              format: item, // 传入props
              node: item,
              selectListInfo: {
                codeService: item.codeService
              }
            }
          })
        }

        return ''
      }))
    }

    // 节点存在并且 节点的类型等于用户输入节点
    if (this.node && this.node.nodeType === NODE_TYPE.CUSTOM) {
      // 创建元素时将vinput组件作为元素来使用  将props传入组件渲染出来
      return createElement(Vinput, {
        props: {
          treeData: this.treeData,
          format: this.node, // 传入props
          node: this.node,
          disabled: this.disabled,
          selectListInfo: {
            codeService: this.node.codeService
          }
        }
      })
    }

    // 节点存在并且 节点的类型等于表达式节点
    if (this.node && this.node.nodeType === NODE_TYPE.EXPRESSION) {
      return createElement('span', this.$store.state.bom.expressionList[this.node.expressionId].expressionArray.map((formatItem) => {
        return createElement('span', [
          formatItem.type === 'text' && createElement('span', formatItem.desc),
          formatItem.type === 'actualTypeNames' && createElement('span', this._.get(this.node, `paramValue.param1.actualTypeNames`).toString()),
          formatItem.type === 'field' && createElement('span', this.node.paramValue[formatItem.paramId] ? this.node.paramValue[formatItem.paramId].label : ''),
          CUSTOM_TYPE.includes(formatItem.type) && createElement(Vinput, {
            props: {
              treeData: this.treeData,
              disabled: this.disabled,
              format: formatItem, // 传入props
              node: this.node,
              paramId: formatItem.paramId,
              selectListInfo: this.ExpressionCodeService(formatItem, this.node)
            },
            on: {
              // 需要强制渲染数据通信
              changeSelect() {
                self.$forceUpdate()
              }
            }
          })
        ])
      }))
    }
    return ''
  }

}
</script>
