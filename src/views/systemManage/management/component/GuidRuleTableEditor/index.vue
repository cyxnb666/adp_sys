<template>
  <!-- <el-dialog :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false"> -->
  <div class="guid-rule-table-editor" @contextmenu.capture="decisionTableDisabled">
    <div class="guid-rule-tools">
      <el-button type="text" :disabled="!undoStacks.length || rowIndex > -1" @click="popUndoStacks">
        <svg-icon icon-class="revoke" />
      </el-button>
      <el-button type="text" :disabled="!redoStacks.length || rowIndex > -1" @click="popRedoStacks">
        <svg-icon icon-class="revoke" style="transform: rotateY(180deg)" />
      </el-button>
      <el-button type="text" :disabled="rowIndex > -1" @click="insertRule(ruleList.length - 1)">
        <svg-icon icon-class="insert" />
      </el-button>
      <el-button icon="el-icon-close" type="text" :disabled="!ruleList.length || rowIndex > -1" @click="deleteRule" />
      <!-- <el-button icon="el-icon-check" type="text" @click="saveRule" :disabled="!undoStacks.length || rowIndex > -1"></el-button> -->
      <el-button icon="el-icon-check" type="text" @click="saveRule" />
    </div>
    <div class="guid-rule-selector">
      <GuidRuleEditor ref="guidRuleEditor" v-model="ruleList" v-on="{ change: conditionOperation, insertRule }" />
      <!-- <div v-if="errorInfo" class="error">{{ errorInfo }}</div> -->
    </div>
    <EditableDecisionTable
      ref="decisionTable"
      v-bind="{ tableData: ruleTableData, colIndex, rowIndex, validRuleTable, disabled }"
      v-on="{ selectTableColumn, selectTableRow, editColumn, editRow }"
    />
  </div>
  <!-- </el-dialog> -->
</template>

<script>

import { uuidv4 } from 'uuidv7'
import broadcast from './utils'
import Emitter from 'element-ui/src/mixins/emitter'
// import { tableData } from './data.js'

import {
  bomClassAndField,
  getComparisonOperators,
  getBomModelId,
  getRuleExpressionsAll,
  getOperatorsArithmetic,
  getMethodList,
  getCodeService,
  getCodeServiceList
} from '../../api.js'

import { allTypes, conditionMenus, placeholderMaps, comparison, arithmeticMaps, maps } from './dataset.js'

export default {
  componentName: 'GuidRuleEditor',
  mixins: [Emitter],
  props: {
    bomBaseInfoId: {
      type: String,
      required: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    predefineTreeData: {
      type: Array,
      default: () => []
    },
    row: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      visible: true,
      treeData: [],
      rows: 1, // 默认行数
      columns: 2, // 默认列数
      rowIndex: -1, // 选中的行
      colIndex: 0, // 选中的列
      ruleTableData: [],
      ruleList: [], // 规则列表
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
      nodeTypeList: [],
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
      undoStacks: [], // 回退栈
      redoStacks: [], // 重做栈
      errorInfo: '',
      bomModelId: '',
      MethodList: [],
      paramValue: []
    }
  },
  watch: {
    treeData: {
      handler(nVal) {
        let unWatch = null
        const callback = (data, status) => {
          if (status === 'add') {
            this.ruleTableData = this.generateTableData(this.columns, this.rows) || []
            this.ruleList = this.generateRuleDate()
          } else {
            console.log('是我吗')
            const list = this.formatRuleTableData(this.columns, this.rows, data) || []
            this.ruleTableData = list
            console.log(list)

            this.ruleList = list[0].rule || this.generateRuleDate()
            console.log(this.ruleList)
          }
          if (unWatch) {
            unWatch()
            unWatch = null
          }
          this.$emit('input', false)
        }

        if (this.status === 'add') {
          callback(_.cloneDeep(this.tableData), 'add')
        } else {
          console.log(this.tableData)

          if (this.tableData.length) {
            console.log(222)

            callback(_.cloneDeep(this.tableData))
          } else {
            console.log(111)

            unWatch = this.$watch('tableData', (val) => {
              if (val.length) callback(_.cloneDeep(val))
            }, { immediate: true })
            // 5秒后unWatch还存在，则没有数据
            // console.log(unWatch)
            // unWatch && setTimeout(() => callback(this.tableData), 5000)
          }
        }
      },
      // once: true
    },
    predefineTreeData: {
      handler(newval) {
        this.toChangeTree(this.predefineTreeData)
      }
    }
    // row: {
    //   handler(val) {
    //     console.log(val)
    //     this.rows = val
    //   }
    // }
  },
  provide() {
    return {
      ruleEditor: this
    }
  },
  created() {
    if (this.predefineTreeData.length > 0) {
      console.log(this.predefineTreeData)
    } else {
      this.bomClassAndField()
    }
    this.$on('insertRule', this.insertRule)
    this.$on('popUndoStacks', this.popUndoStacks)
    this.$on('pushUndoStacks', this.pushUndoStacks)
    this.$on('pushRedoStacks', this.pushRedoStacks)
    this.$on('popRedoStacks', this.popRedoStacks)
    console.log(this.row)
  },
  methods: {
    decisionTableDisabled(e) {
      if (this.disabled) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    // validateRule(e) {
    //     if (['underline values mr-10', 'el-dropdown-link'].includes(e.srcElement._prevClass)) return
    //     if (this.disabledRule()) {
    //         e.stopPropagation()
    //     }
    // },
    pushUndoStacks() {
      this.undoStacks.push(_.cloneDeep(this.ruleList))
    },
    popUndoStacks() {
      if (this.undoStacks.length) {
        this.pushRedoStacks()
        const ruleList = this.undoStacks.pop()
        ruleList.map(v => v.key = uuidv4())
        this.ruleList = ruleList
      }
    },
    pushRedoStacks() {
      this.redoStacks.push(_.cloneDeep(this.ruleList))
    },
    popRedoStacks() {
      if (this.redoStacks.indexOf(this.ruleList) < 0 && this.redoStacks.length) {
        this.pushUndoStacks()
        this.ruleList = this.redoStacks.pop(this.ruleList)
      }
    },
    conditionOperation(rule, menu, index) {
      // if (menu.value === 'insertRule') {
      //   return
      // } else if (menu.value === 'false') {
      //   // if (!this.matchBracket(this.ruleList, index)) return
      // } else if (['insertBeforeNode', 'insertAfterNode', 'delCondition'].includes(menu.value)) {
      //   this.pushUndoStacks()
      //   return
      // } else { // ['delCondition', 'delBracketRight', 'undo', 'redo']
      // }
      // this.popRedoStacks()

      // if (menu.value === 'redo') {
      //   this.popRedoStacks()
      // } else if (menu.value === 'undo') {
      //   this.pushRedoStacks()
      //   this.popUndoStacks()
      // } else {
      //   this.pushUndoStacks()
      // }
    },
    getRightClickMenus(str) {
      return this.menusOptions.filter(v => str.includes(v.paramType))
    },
    // getExpressDropdownMenus(item) {
    //     let data = this.nodeTypeList.filter(val => val.beforeParamType.includes(item.returnType))
    //     return data
    // },
    /**
         *
         * @param type 取兄弟 beforeParamType
         */
    getExpressNextNode(type) {
      const data = this.nodeTypeList.filter(val => val.beforeParamType.includes(type))
      return data
    },
    /**
         *
         * @param item 当前选择的节点
         * @param type child 取子节点，sibling还是取兄弟节点
         * @param parentType 父级节点类型
         */
    filterData(data) {
      return data
        .filter(node => {
          if (node.children && node.children.length > 0) {
            node.children = this.filterData(node.children)
            return true
          }

          return (node.type === 'void')
        })
        .map(node => {
          const { ...rest } = node
          return rest
        })
    },
    getDropdownMenus(item, type, parentType) {

      let menus = []
      let express = []
      if (this.disabledRule()) return menus // 禁用表格不显示下拉菜单

      const column = this.ruleTableData[this.colIndex] || {}
      if (item.expressionArray) { // 表达式节点
        express = this.getExpressNextNode(item.returnType)
      } else {
        const column = this.ruleTableData[this.colIndex] || {}
        console.log(type, parentType, column.columnType)
        console.log(item)

        if (type === 'child') { // 点击‘是’取子级菜单
          menus = this.treeFlatMaps[item.fieldPath] || []
          console.log(item)
          if (!item.children) { // 最后一级取表达式菜单
            if (column.columnType === 'condition') {
              express = conditionMenus // 兼容以前数据条件列
            } else {
              express = this.getExpressNextNode(item.returnType)
            }
          }
        } else if (type === 'sibling') {
          if (item.type === 'root') { // 第一级节点
            menus = this.treeData
          } else {
            menus = this.treeFlatMaps[item.beforeFieldPath || 'root'] || []
          }
        }
        if (parentType) { // 嵌套节点不需要表达式
          const typeList = ['root', 'object', 'list', parentType]
          const callback = function(obj, nodeType) {
            if (nodeType === obj.type) return true
            if (obj.children && obj.children.length) {
              for (const item of obj.children) {
                if (callback(item, nodeType)) return true
              }
            }
          }
          menus = menus.filter(v => typeList.includes(v.type) && callback(v, parentType))
          express = []
        } else if (column.columnType === 'decision') { // 编辑决策表的决策列时
          console.log(menus)
          // menus = menus.filter(v => {
          //   const shouldKeep = v.fieldPath.includes('bomRuleResultVo')
          //   const hasChildren = v.children && v.children.length > 0
          //   const validChildren = hasChildren ? v.children.filter(child => child.type === 'void' || (child.children && child.children.length > 0)) : []

          //   v.children = validChildren
          //   return shouldKeep || validChildren.length > 0 || v.type === 'void'
          // })

          // express = []
          menus = menus.filter(v => v.dataType !== 'method' || v.dataType === 'method' && v.type === 'void')
          express = []
        } else if (column.columnType === 'data') {
          menus = menus.filter(v => v.type !== 'void')
        }

        // 去掉多余的children
        menus = menus.map(res => ({ ...res, children: !!res.children }))
      }

      return _.cloneDeep(express.concat(menus))
    },
    getCodeServiceMenus(codeService, callback) {
      if (!codeService) return

      const params = { codeServices: codeService.toString() }

      getCodeServiceList(params).then(res => callback(res))

      // let options = {
      //   boolean: [{ label: 'true - 是', fieldPath: true }, { label: 'false - 否', fieldPath: false }] // 用fieldPath统一下拉格式
      // }
      // // 表达式与表达式子表单返回的类型不一致，此处只能写死
      // if (node.desc === '<是,否>') {
      //   options = options.boolean
      // } else {
      //   options = options[node.returnType]
      // }

      // if (!options) {
      //   options = this.treeFlatMaps[node.fieldPath] || []
      // }
      // return options
    },
    // 从右往左查找匹配括号
    matchBracket(nodes, index) {
      let bracketNum = null
      // 找到当前节点左括号"（"，与右括号 "）"数量
      for (let i = index; i >= 0; i--) {
        if (nodes[i].brackets) { // 统计右括号"）"数量
          for (let j = nodes[i].brackets.length; j--;) {
            bracketNum++
          }
        } else { // 匹配左括号 "（"
          bracketNum--
        }
        // 匹配完成
        if (bracketNum === 0) {
          this.errorInfo = ''
          return true
        }
      }

      if (bracketNum < 0) {
        this.errorInfo = '规则缺少右括号！'
      } else if (bracketNum > 0) {
        this.errorInfo = '规则缺少左括号！'
      }
    },
    selectCondition(rule, item) {
      this.pushUndoStacks()
      this.$set(rule, 'nodes', _.cloneDeep({ ...item, key: `${Date.now()}-${Math.random()}` }))
    },
    disabledRule() {
      // 选中行、查看禁用表格
      return this.rowIndex > -1 || this.disabled
    },
    insertRule(index) {
      let rule = this.ruleList[index]
      if (rule.ruleType === 'decision') return

      this.pushUndoStacks()

      if (index === this.ruleList.length - 1) { // 往最后追加
        rule.logic = _.cloneDeep(this.logicOpts[0])
        rule = this.generateRuleDate()[0]
      } else { // 往中间追加
        rule = this.generateRuleDate()[0]
        rule.logic = _.cloneDeep(this.logicOpts[0])
      }

      this.ruleList.splice(index + 1, 0, rule)
    },
    // toggleLogic(rule, item) {
    //     rule.logic = item
    // },
    deleteRule() {
      this.pushUndoStacks()
      this.ruleList = this.generateRuleDate()
    },
    generateRuleDate() {
      const column = this.ruleTableData[this.colIndex] || {}

      return [{
        nodes: null,
        logic: null,
        brackets: [],
        right: null,
        key: `${Date.now()}-${Math.random()}`,
        ruleType: column.columnType
      }]
    },
    generateLinkedList(nodes, path, cellValue) {
      const fieldPath = path.split('.')
      for (let i = 1; i <= fieldPath.length; i++) {
        if (nodes.children) {
          const field = fieldPath.slice(0, i).join('.')

          for (const item of nodes.children) {
            if (item.fieldPath === field) {
              nodes.next = item
              nodes.children = !!nodes.children
              nodes = item
              break
            }
          }
        }
      }
      if (cellValue[0] === '=') {
        nodes.next = comparison['=']
        cellValue.shift()
      }
      if (cellValue[0] === '==') {
        nodes.next = comparison['==']
        cellValue.shift()
      }
      if (cellValue[0] === '>=') {
        nodes.next = comparison['>=']
        cellValue.shift()
      }
      if (cellValue[0] === '<=') {
        nodes.next = comparison['<=']
        cellValue.shift()
      }
      if (cellValue[0] === '>') {
        nodes.next = comparison['>']
        cellValue.shift()
      }
      if (cellValue[0] === '<') {
        nodes.next = comparison['<']
        cellValue.shift()
      }
      return nodes
    },
    formatRuleTableData(column, row, data) {
      // 找到决策列的位置，少了需要补列数
      let lastColumnIndex = -1; let maxRow = this.rows
      console.log(data)
      data.map((val, idx) => {
        val.headers.map(v => {
          if (v.cellValue === '【决策列】' && lastColumnIndex < 0) { // 数据列的表头有两行
            lastColumnIndex = idx
          }
        })
        // 最大行数
        if (val.columns && val.columns.length > maxRow) {
          maxRow = val.columns.length
        }
      })
      data.map((val, idx) => {
        const header = []
        const rowHeader = []
        let columnType = ''

        let headCellValue = null
        val.headers.map(v => {
          if (v.rowNum === 1 && !headCellValue) {
            v.valueType = JSON.parse(v.valueType) || {}
            header.push([{ ...v, value: v.alias }])
            headCellValue = v.cellValue
          }
          if (v.rowNum === 2) {
            if (!columnType) columnType = v.cellValue
            const valueType = JSON.parse(v.valueType) || {}
            rowHeader.push({
              cellValue: v.cellValue,
              value: v.alias,
              valueType: valueType,
              placeholder: placeholderMaps[valueType.returnType] || '一个字符串'
            })
            // if (v.cellValue  === '【数据列】') { }
          }
        })

        val.columnType = { '【数据列】': 'data', '【决策列】': 'decision' }[columnType] || 'condition'

        // 数据列的表头有两行

        if (rowHeader.length > 1) header.push(rowHeader)

        if (!val.rule) { // 老数据兼容新格式
          let nodes = _.cloneDeep(this.treeData[0])
          let rule = {
            nodes: nodes,
            logic: null,
            brackets: [],
            right: null,
            key: `${Date.now()}-${Math.random()}`,
            ruleType: val.columnType
          }

          if (val.columnType === 'data') {
            const alias = []
            val.dtFieldPathMappings.filter(v => {
              const name = v.headName.split('_')
              if (v.fieldName === name[name.length - 1] && !alias.some(val => val.fieldPath === v.fieldPath)) { // 取最后一个节点（可以匹配完整路径）跟去重
                alias.push(v)
              }
            })
            const rules = []
            const copyRule = _.cloneDeep(rule)
            const copyRootNode = _.cloneDeep(nodes)
            headCellValue = headCellValue.match(/[\-\*\|=+/><&!]+|[^=><+\-\*/!%s]+/ig) || []

            const sortAlias = []
            // 排序，跟headCellValue取到的值保持一致
            headCellValue.map((v, i) => {
              if (v !== '&&' || v !== '||') {
                sortAlias.push(...alias.filter((val, i) => val.headName === v))
              }
            })

            sortAlias.map(v => {
              headCellValue = headCellValue.filter(val => val !== v.headName) // 删除相同的数据
              this.generateLinkedList(nodes, v.fieldPath || '', headCellValue)

              if (headCellValue[0] === '&&') {
                rule.logic = this.logicOpts[0]
                headCellValue.shift()
              }

              if (headCellValue[0] === '||') {
                rule.logic = this.logicOpts[1]
                headCellValue.shift()
              }
              rules.push(rule)

              rule = _.cloneDeep(copyRule)
              nodes = rule.nodes = _.cloneDeep(copyRootNode)
            })
            val.rule = rules
          } else if (val.dtFieldPathMappings) {
            const alias = val.dtFieldPathMappings[val.dtFieldPathMappings.length - 1]
            if (alias) {
              const type = columnType.match(/[\-\*=+/><&!]+/ig) || []

              this.generateLinkedList(nodes, alias.fieldPath, type)

              val.rule = [rule]
            }
          }
        } else {
          try {
            val.rule = JSON.parse(val.rule)
          } catch (err) {}
        }

        delete val.dtFieldPathMappings

        val.headers = header

        // 补充行数据 开始
        // const obj = {}; const columns = []
        // if (val.columns) {
        //   debugger
        //   val.columns.reduce((acc, val) => {
        //     val.map(v => {
        //       // try {
        //       //   v = { ...v, value: v.cellValue }
        //       // } catch (err) {

        //       // }
        //       acc[v.frontX] = v
        //     })
        //     return acc
        //   }, obj)
        // }
        // const headerLastLine = val.headers[val.headers.length - 1] || [] // 取表格表头最后一行
        // for (let i = 0; i < maxRow; i++) {
        //   const rows = []
        //   for (let j = 0; j < headerLastLine.length; j++) {
        //     if (obj[`${i}${j}`]) {
        //       const valueType = headerLastLine[j].valueType || {}
        //       const item = obj[`${i}${j}`]
        //       // 字符串被后端加上了引号，去掉后才能显示下拉列表数据
        //       if (valueType.type === 'selector') {
        //         item.value = item.cellValue?.slice(1, -1)
        //       } else if (valueType.type === 'selector-multiple') {
        //         item.value = item.cellValue?.slice(1, -1).split(',')
        //       } else {
        //         item.value = item.cellValue
        //       }
        //       rows.push({ ...item, ...valueType, valueType })
        //     } else {
        //       let item = headerLastLine[j]
        //       if (item.valueType) { // 没有数据直接取valueType
        //         item = item.valueType
        //       }
        //       rows.push(...this.getRowCell([item])) // 生成空单元格
        //     }
        //   }
        //   columns.push(rows)
        // }
        // val.columns = columns
        // 补充行数据 结束

        const headerLastLine = val.headers[val.headers.length - 1] || [] // 取表格表头最后一行

        val.columns.map(val => {
          val.map((item, j) => {
            const valueType = headerLastLine[j].valueType || {}
            // 字符串被后端加上了引号，去掉后才能显示下拉列表数据
            if (valueType.type === 'selector') {
              item.value = item.cellValue?.slice(1, -1)
            } else if (valueType.type === 'selector-multiple') {
              item.value = item.cellValue?.slice(1, -1).split(',')
            } else {
              item.value = item.cellValue
            }
            Object.assign(item, { ...valueType, valueType } )
          })
          return val
        })
      })

      // 补充列数据
      // if (lastColumnIndex > -1) {
      //     if (lastColumnIndex < 3) { // 缺少数据列
      //         for (let i = 3 - lastColumnIndex; i--;) {
      //             data.splice(lastColumnIndex, 0, ...this.generateTableData(1, this.rows, 'data'))
      //         }
      //     }
      // } else {
      //     if (data.length < 4) {
      //         for (let i = data.length; i < 4; i++) {
      //             let type =  i >= 3 ? 'decision' : 'data'
      //             data.splice(i, 0, ...this.generateTableData(1, this.rows, type))
      //         }
      //     } else { // 补充决策列就可以了
      //         data.push(...this.generateTableData(1, this.rows, 'decision'))
      //     }
      // }
      this.columns = data.length // 默认列
      this.rows = data[0]?.columns.length // 默认列

      // 合并表头
      const max = Math.max.apply(null, data.map(v =>  v.headers.length))

      if (max > 1) {
        data.map(column => {
          column.headers.map((val, idx, arr) => {
            val.map(v => v.rowspan = (arr.length > 1 ? 1 : max))
          })
        })
      }
      console.log(data)
      return data
    },
    getRowCell(headLastRow) {
      const rows = []
      for (const val of headLastRow) {
        rows.push({ ...val, next: null, operator: null })
      }
      return rows
    },
    getColumnCell(rowNum, headLastRow = []) {
      const columns = []
      for (let j = 0; j < rowNum; j++) {
        columns.push(this.getRowCell(headLastRow))
      }
      return columns
    },
    generateTableData(colNum, rowNum, columnType) {
      const rows = []

      const max = Math.max.apply(null, this.ruleTableData.map(v => v.headers.length))

      for (let i = 0; i < colNum; i++) {
        const headers = [{ name: '', value: '', rowspan: max }]

        const columns = this.getColumnCell(rowNum, headers)

        rows.push({
          rule: null,
          columns: columns,
          headers: [headers],

          columnType: columnType || (i ? 'decision' : 'data')
        })
      }

      return rows
    },
    /**
         *
         * @param data 表头数据
         * @param colspan 合并的列数
         */
    generateTableHead(data, colspan) {
      if (!data) return []

      const list = data.map(v => {
        if (colspan) v.colspan = colspan
        const item = { ...v, placeholder: v.placeholder || placeholderMaps[v.returnType], key: `${Date.now()}-${Math.random()}` }
        delete item.next
        return item
      })

      return list
    },
    getRuleFormList(rules) {
      const children = []
      // const allTypes = ['string', 'date', 'int', 'selector', 'int,integer,double,float,long', 'int,integer,double,double,float,long']
      const callback = (list) => {
        if (!list) return
        list.map(v => {
          do {
            if (Array.isArray(v)) {
              callback(v)
            } else if (v.appendNodeList) {
              callback(v.appendNodeList)
            } else if (v.detailsList) {
              if (v.type === 'boolean' && !v.returnType) {
                v.returnType = v.type
                v.type = 'selector'
              }
              callback(v.detailsList)
            } else if (['input', 'date', 'selector', 'selector-multiple'].includes(v.type) && !v.disabled && allTypes.includes(v.returnType)) {
              children.push(v)
            }
            v = v.next
          } while (v)
        })
      }
      rules.map(v => {
        if (v.type === 'bracket') return

        if (!v.nodes) {
          return children.push({ type: 'custom', placeholder: '条件' })
        }

        let next = v.nodes.next

        while (next) {
          callback(next.detailsList)

          callback(next.appendNodeList)

          callback(next.expressionArray)

          next = next.next
        }
      })
      return children
    },
    getRuleParamValue() {
      let paramsValue = []
      const componentNames = ['GuidEditorForm', 'GuidEditorExpress']
      broadcast.apply(this, [componentNames, 'getParamValue', (param) => {
        paramsValue = paramsValue.concat(param)
      }])
      return paramsValue
    },
    formatTableList(index) {
      // 禁用已填写数据的规则表单
      this.setDisabledRuleForm()

      // 获取规则中未禁用的表单数据，重新拆分数据列
      // let paramsValue = this.getRuleFormList(this.ruleList)
      let paramsValue = this.getRuleParamValue()

      const column = this.ruleTableData[index]
      if (column) {
        let list = []
        // 列的数据类型valueType挂在表头的最后一行
        if (paramsValue.length > 1) { // 一大列分为多小列时
          const item = paramsValue.map(val => {
            return {
              placeholder: val.placeholder,
              returnType: val.returnType,
              valueType: {
                type: val.type,
                label: val.value,
                returnType: val.returnType,
                codeService: val.codeService
                // fieldPath: val.fieldPath
              }
            }
          })
          list = [
            this.generateTableHead(column.headers[0], item.length),
            this.generateTableHead(item)
          ]
        } else {
          const item = [{ ...column.headers[0][0], valueType: paramsValue[0] }]
          list = [this.generateTableHead(item)]
          paramsValue = paramsValue.length ? paramsValue : [{}]
        }

        column.headers = list
        column.columns = this.getColumnCell(this.rows, paramsValue)
      }

      // 获取表头最大行数
      let max = Math.max.apply(null, this.ruleTableData.map(v => v.headers.length))

      // 重置合并的表头
      this.ruleTableData.map((v, i) => {
        v.headers.map((v, i, a) => {
          v.map((val) => val.rowspan = (a.length > 1 ? 1 : max))
        })
      })
    },
    saveRule() {
      console.log('save')
      // this.errorInfo = ''
      const column = this.ruleTableData[this.colIndex]
      if (column.columnType !== 'decision') {
        this.$refs.guidRuleEditor.validateAllRuleValue().then(v => {
          this.generateTableColumn()
        }) /** , (err) => { his.errorInfo = err.info}**/
      } else { // 决策列
        this.generateTableColumn()
      }
    },
    generateTableColumn() {
      if (this.colIndex > -1) {
        const column = this.ruleTableData[this.colIndex]
        if (this.rowIndex < 0) { // 选中表列,重新生成列
          // 没有选中行，替换表头列数，后续需要计算表头的行
          // column.headers = this.generateTableHead([{ ...column.headers[0][0], children: paramsValue.length > 1 ? paramsValue : null }])
          // 替换表格内容区行数
          this.formatTableList(this.colIndex)
        } else { // 选中表行 替换行中单元格数据
          this.saveRuleTableParamsValue('save')
        }

        // 给当前列赋值规则selector
        column.rule = _.cloneDeep(this.ruleList)

        this.undoStacks.length = 0
        this.redoStacks.length = 0
        this.$message.success('保存成功')
      }
    },
    validate(callback) {
      let promise = void 0
      let error
      let promiseResolve = null
      let promiseReject = null
      if (typeof callback !== 'function' && window.Promise) {
        promise = new Promise((resolve, reject) => {
          promiseResolve = resolve
          promiseReject = reject
          callback = bool => { if (!bool && error === undefined) error = !bool }
        })
      }

      this.$refs.decisionTable.validate(callback)

      error ? promiseReject(error) : promiseResolve()

      return promise
    },
    saveTableData() {
      console.log(this.ruleTableData)
      if (this.ruleTableData.some(v => !v.rule)) {
        this.$message.error('请填写完整数据')
        throw new Error('Please fill in the complete data')
      }

      const dtDetailList = []; const fieldPathMappings = []
      // columnType 0 条件列 1决策列 2数据列
      const generateMappings = (node, columnType) => {
        let copyNode = node; let headName = ''
        let prevDataType = ''; let fieldPath = ''
        while (copyNode) {
          if (!copyNode.expressionArray) {
            if (prevDataType === 'method' && copyNode.dataType === 'field') {
            } else {
              headName += (headName ? `_${copyNode.label}` : copyNode.label)
            }
          }

          prevDataType = copyNode.dataType // 上一节点数据类型

          copyNode = copyNode.next
        }

        prevDataType = ''
        while (node) {
          if (!node.expressionArray) {
            fieldPath = node.fieldPath
            if (prevDataType === 'method' && node.dataType === 'field') {
              headName = `_${node.label}`
              fieldPath = `.${node.field}`
            }
            if (node.type === 'void') {
              fieldPath = node.fieldPath.slice(0, -2)
            }
            fieldPathMappings.push({
              headName: headName,
              columnType: columnType,
              fieldName: node.label,
              fieldPath: fieldPath,
              fieldType: node.type
            })
          }
          prevDataType = node.dataType // 上一节点数据类型
          node = node.next
        }
      }

      const callback = (node, ruleType) => {
        return node.reduce((acc, node) => {
          let text = ''
          if (['input', 'date', 'selector', 'selector-multiple'].includes(node.type)) {
            if (node.operator && node.operator.value) {
              if (acc[acc.length - 1] === ',' || acc[acc.length - 1] === '_') {
                acc = acc.slice(0, -1) // 去掉最后一个拼接符
              }
              text += node.operator.value
            }
            // if (node.value && typeof node.value === 'object') {
            //   text += node.value.fieldPath
            // } else {
            //   if (node.returnType === 'date') {
            //     text += node.value || `%s`
            //   } else {
            //   }
            // }
            text += (node.disabled ? node.value : `%s,`)
            if (node.next) {
              if (text[text.length - 1] === ',' || text[text.length - 1] === '_') {
                text = text.slice(0, -1) // 去掉最后一个拼接符
              }
              text += callback([node.next], ruleType)
            }
          } else {
            if (node.type === 'bracket') {
              text += `(`
            } else {
              let item = node
              if (item.operator) {
                if (item.type !== 'root' || acc[acc.length - 1] === '_' || acc[acc.length - 1] === ',') {
                  acc = acc.slice(0, -1) // 去掉最后一个拼接符
                }
                text += item.operator.value
              }

              // 生成fieldPathMappings对象
              if (item.type === 'root') {
                generateMappings(item.next, ruleType)
                item = item.next || {}
              } else if (node.ruleType) { // 规则列表最外层数据
                item = node.nodes ? node.nodes.next || node.nodes : {} // 去掉根节点

                // 生成fieldPathMappings对象
                if (Object.keys(item).length) {
                  generateMappings(item, ruleType)
                }

                if (acc) text.replace(/&&|\|\|/g, '') // 替换 && 与 ||
              }

              while (item) {
                if (!item.expressionArray && item.label) {
                  let label = item.label
                  if (item.dataType === 'method' && label.lastIndexOf('()') > -1) { // 表头方法去掉（）
                    label = label.slice(0, -2)
                  }
                  text += `${label}_`
                }

                if (item.detailsList) { // 嵌套方法
                  console.log(123)
                  if (text[text.length - 1] === '_') text = text.slice(0, -1) // 去掉最后一个 "_"
                  text += '('
                  item.detailsList.map(v => {
                    text += callback(v, ruleType).replace(/_$/g, ',') // 嵌套节点，替换最后一个拼接符

                    // 问题出现再这
                    if (text[text.length - 1] !== ',') text += ','
                  })
                  text = text.slice(0, -1) // 去掉最后一个拼接符
                  text += `)`
                  if (item.children) text += `_`
                }

                if (item.appendNodeList) {
                  if (text[text.length - 1] === '_') text = text.slice(0, -1) // 去掉最后一个 "_"

                  text += callback(item.appendNodeList, ruleType)

                  if (text[text.length - 1] === ',' || text[text.length - 1] === '_') {
                    text = text.slice(0, -1) // 去掉最后一个拼接符
                  }
                }

                if (item.expressionArray) {
                  if (text[text.length - 1] === '_') text = text.replace(/_$/g, '') // 替换最后一个 "_"
                  const flag = ['TIME_BETWEEN', 'STR_BELONG_TO_MUL', 'STR_BELONG_TO', 'STR_NOT_BELONG_TO', 'STR_NOT_BELONG_TO_MUL'].includes(item.code) // 属于（单选，多选）、不属于（单选，多选）
                  if (item.nodeType === 'COMPARISON' && !flag || item.nodeType === 'CALCULATE') {
                    text += arithmeticMaps[item.code || 'STR_EQ']
                  } else if (item.nodeType === 'EXPRESSION') { // 表达式拼接逗号后，再拼接参数 %s
                    text += ','
                  }
                  if (item.nodeType === 'COMPARISON' && flag) {
                    const date = callback(item.expressionArray, ruleType)
                    text = maps[item.code] ? `${maps[item.code]}(${text},${date})` : text
                  } else {
                    text += callback(item.expressionArray, ruleType)
                  }
                  if (text[text.length - 1] === ',' || text[text.length - 1] === '_') {
                    text = text.slice(0, -1) // 去掉最后一个拼接符
                  }
                  if (item.nodeType === 'EXPRESSION') {
                    text = maps[item.expressionId] ? `${maps[item.expressionId]}(${text})` : text
                  }
                }

                item = item.next
              }

              if (node.brackets && node.brackets.length) {
                node.brackets.map(v => text += `)`)
              }
              if (node.logic) {
                if (text[text.length - 1] === ',') text = text.slice(0, -1) // 去掉最后一个 ","
                text += ['&&', '||'][node.logic.value]
              }
            }
          }
          acc += text

          if (node.right) acc = `!${acc}` // 不成立

          return acc
        }, '')
      }

      let word = 65; let words = ''; let frontWord = 64; let frontWords = ''
      this.ruleTableData.map((column, index) => {
        // 前端需要的列号
        if (word > 90) {
          frontWords += 'A'
          frontWord = 65
        }
        frontWord++

        if (!column.rule) return // 后端不能空行，没有规则，当前列没有数据

        if (word > 90) {
          words += 'A'
          word = 65
        }

        let copyWord = word

        if (column.rule) {
          const type = { condition: '0', decision: '1', data: '2' }[column.columnType]
          let cellValue = callback(column.rule || [], type)
          if (cellValue[cellValue.length - 1] === '_') cellValue = cellValue.slice(0, -1)

          // 取表头的最后一行
          const tableHeaderLastRows = column.headers[column.headers.length - 1] || []
          tableHeaderLastRows.map(val => {

            val.valueType && delete val.valueType.value

            const columnNum = words + String.fromCharCode(copyWord)
            dtDetailList.push({
              cellAddress: `${columnNum}1`,
              cellType: 'STRING',
              cellValue,
              columnNum,
              rowNum: 1,
              valueType: JSON.stringify(val.valueType),
              alias: column.headers[0][0].value, // 别名，取表头第一行
              rule: JSON.stringify(column.rule)
            })
            // const paramsValue  = this.getRuleFormList(column.rule)
            // TODO cellValue条件列需修改
            dtDetailList.push({
              cellAddress: `${columnNum}2`,
              cellType: 'STRING',
              cellValue: { condition: '【条件列】', decision: '【决策列】', data: '【数据列】' }[column.columnType],
              columnNum,
              alias: val.value, // 别名，取表头第最后一行
              rowNum: 2,
              valueType: JSON.stringify(val.valueType || {})
            })

            copyWord++
          })

          let rowNum = 2
          const types = {
            string: 'STRING',
            boolean: 'BOOLEAN',
            number: 'NUMERIC',
            int: 'NUMERIC',
            integer: 'NUMERIC',
            float: 'NUMERIC',
            long: 'NUMERIC',
            'int,integer,double,float,long': 'NUMERIC',
            'int,integer,double,double,float,long': 'NUMERIC',
            date: 'STRING'
          }
          console.log(column)

          column.columns.map((val, idx) => {
            rowNum++
            copyWord = word - 1 // 重置
            val.map((item, index) => {
              const columnNum = words + String.fromCharCode(++copyWord)
              let cellValue = item.value || null

              if (item.type === 'selector') {
                cellValue = item.value || null
              } else if (item.type === 'selector-multiple') {
                cellValue = item.value?.toString()
              }

              dtDetailList.push({
                cellAddress: `${columnNum}${rowNum}`,
                cellType: types[item.returnType] || item.cellType,
                cellValue,
                columnNum,
                rowNum,
                frontY: frontWords + String.fromCharCode(frontWord),
                frontX: `${idx}${index}`
                // valueType: JSON.stringify({
                //   type: item.type || null,
                //   returnType: item.returnType || null,
                //   fieldPath: item.fieldPath || null,
                //   value: item.value || null
                // })
              })
            })
          })
        }

        word = ++copyWord
      })

      return { dtDetailList, fieldPathMappings }
    },
    saveRuleTableParamsValue(type) {
      const column = this.ruleTableData[this.colIndex]
      const row = column.columns[this.rowIndex]
      const paramsValue = this.getRuleFormList(this.ruleList)
      // let paramsValue = this.getRuleParamValue()
      if (row.length === paramsValue.length) {
        if (type === 'sync') { // 同步数据到规则
          row.map((v, i) => { paramsValue[i].value = v.value })
        } else if (type === 'save') { // 保存数据到单元格
          paramsValue.map((v, i) => {
            const item = { ...v }
            delete item.next
            delete item.operator
            this.$set(row, i, item)
          })
        }
      }
    },
    setDisabledRuleForm() {
      // 选中的列
      const flag = this.colIndex > -1 && this.rowIndex < 0
      const callback = (list) => {
        if (!list) return
        list.map(v => {
          if (v.returnType === 'boolean' && !v.type) {
            console.log(111111)
            v.type = 'selector'
            v.returnType = 'boolean'
          }
          do {
            if (Array.isArray(v)) {
              callback(v)
            } else if (v.appendNodeList) {
              callback(v.appendNodeList)
            } else if (v.detailsList) {
              console.log(v)

              callback(v.detailsList)
            } else if (['input', 'selector', 'selector-multiple'].includes(v.type)) {
              // 保存时禁用已填写数据的列
              if (['selector-multiple'].includes(v.type)) {
                v.disabled = flag && v.value && v.value.length
              } else {
                v.disabled = flag && v.value
                //  && allTypes.includes(v.returnType)
              }
            } else if (v.type === 'date' && v.dataType !== 'field') {
              // 保存时禁用已填写数据的列
              if (['selector-multiple'].includes(v.type)) {
                v.disabled = flag && v.value && v.value.length
              } else {
                v.disabled = flag && v.value
                //  && allTypes.includes(v.returnType)
              }
            } else if (v.type === 'date' && v.dataType === 'field') {
              v.disabled = true
            }
            v = v.next
          } while (v)
        })
      }
      this.ruleList.map(v => {
        console.log(v)
        if (!v.nodes) return

        let next = v.nodes.next

        while (next) {
          callback(next.detailsList)

          callback(next.appendNodeList)

          callback(next.expressionArray)

          next = next.next
        }
      })
    },
    diffRule() {
      return new Promise((resolve, reject) => {
        const rule = this.ruleTableData[this.colIndex]
        if (!rule || JSON.stringify(this.ruleList) === JSON.stringify(rule.rule)) {
          resolve()
        } else {
          // this.$msgbox({
          //   title: '消息',
          //   message: '有未保存的信息，是否保存',
          //   showCancelButton: true,
          //   confirmButtonText: '是',
          //   cancelButtonText: '否',
          // }).then(action => {
          //   this.$refs.guidRuleEditor.validateAllRuleValue().then(v => { // 验证后
          //     this.ruleTableData[this.colIndex].rule = this.ruleList
          //     resolve(this.ruleList)
          //   }, reject)
          // }, resolve)
          this.$message.error('保存后再切换！')
        }
      })
    },
    selectTableRow(colIndex, rowIndex, rule) { // 选择行
      // this.errorInfo = ''

      // this.diffRule().then(res => {})
      this.rowIndex = rowIndex
      this.colIndex = colIndex
      this.ruleList = rule ? _.cloneDeep(rule) : this.generateRuleDate()

      if (colIndex > -1) {
        // 替换规则中的参数值
        this.saveRuleTableParamsValue('sync')
      }
    },
    selectTableColumn(index, rule) { // 选择列
      this.colIndex = index
      this.rowIndex = -1
      this.ruleList = rule ? _.cloneDeep(rule) : this.generateRuleDate()

      // 替换规则中的参数值，清空未禁用的参数
      // const paramsValue = this.getRuleFormList(this.ruleList)
      const paramsValue = this.getRuleParamValue()

      paramsValue.length && paramsValue.map((v, i) => { v.value = null })
    },
    editColumn(colIndex, type) {
      const { columnType } = this.ruleTableData[colIndex]
      if (type === 'addLeftColumn') {
        this.ruleTableData.splice(colIndex, 0, ...this.generateTableData(1, this.rows, columnType))
        this.colIndex = colIndex + 1
      } else if (type === 'addRightColumn') {
        this.ruleTableData.splice(colIndex + 1, 0, ...this.generateTableData(1, this.rows, columnType))
      } else if (type === 'deleteColumn') {
        const frontColumn = this.ruleTableData[colIndex - 1] || {}
        const behindColumn = this.ruleTableData[colIndex + 1] || {}
        if (columnType === 'decision' && frontColumn.columnType !== 'decision' && !this.ruleTableData[colIndex + 1]) {
          return this.$message.error('最少有一列决策列')
        } else if (columnType === 'data' && frontColumn.columnType !== 'data' && behindColumn.columnType !== 'data') {
          return this.$message.error('最少有一列数据列')
        } else {
          this.ruleTableData.splice(colIndex, 1)
        }
      }

      // this.ruleList = this.generateRuleDate()
    },
    editRow(rowIndex, type) {
      if (type === 'addUpRow') {
        this.ruleTableData.map((v, i) => {
          const arr = []
          v.headers[v.headers.length - 1].forEach(item => {
            if (item.valueType) {
              arr.push({ ...item.valueType })
            } else {
              arr.push({ returnType: null, type: null })
            }
          })
          const rows = this.getColumnCell(1, arr)
          v.columns.splice(rowIndex, 0, ...rows)
        })
        this.rows++
        this.rowIndex++
        console.log(this.ruleTableData)
      } else if (type === 'addDownRow') {
        this.ruleTableData.map((v, i) => {
          const arr = []

          v.headers[v.headers.length - 1].forEach(item => {
            if (item.valueType) {
              arr.push({ ...item.valueType })
            } else {
              arr.push({ returnType: null, type: null })
            }
          })
          const rows = this.getColumnCell(1, arr)
          v.columns.splice(rowIndex + 1, 0, ...rows)
        })
        this.rows++
        // this.ruleTableData.map((v, i) => {
        //   const rows = this.getColumnCell(1, v.headers[v.headers.length - 1])
        //   v.columns.splice(rowIndex + 1, 0, ...rows)
        // })
        // this.rows++
      } else if (type === 'deleteRow') {
        this.ruleTableData.map((v, i) => v.columns.splice(rowIndex, 1))
        this.rows--
      }
    },
    validRuleTable(bool) {
      if (bool) {
        this.errorInfo = ''
      } else {
        this.errorInfo = '表达式不能有占位符'
      }
    },
    getPocExpressionsAll() {
      getBomModelId(this.bomBaseInfoId).then((res) => {
        getMethodList(res.resp).then((res) => {
          res = res.resp
          this.MethodList = res.map((item1, index) => {
            return {
              'beforeParamType': item1.beforeParamType,
              'codeService': item1.codeService,
              'expressionArray': item1.expressionArray,
              'fieldId': item1.fieldId,
              'label': item1.methodName,
              'paramType': item1.returnType,
              'returnType': item1.returnType
            }
          })
          const maps = res.reduce((result, item) => {
            result[item.expressionId] = item
            return result
          }, {})

          this.PocList = Object.freeze(maps)
        })
      })
    },
    setTreeNodePath(children, parent) {
      children.map((v) => {
        if (v.type !== 'root') { v.labelPath = parent.labelPath ? `${parent.labelPath}的${v.label}` : v.label }

        v.parentLabelPath = parent.labelPath
        v.parentPath = parent.path

        v.returnType = v.type

        if (v.detailsList) {
          if (v.type === 'void' && /()$/g.test(v.label)) {
            v.label = v.label.slice(0, -2)
          }
        }

        if (v.children && v.children.length) {
          this.setTreeNodePath(v.children || [], v)
          // const data = this.nodeTypeList.filter(val => val.beforeParamType.includes(v.type))
          // v.children = data.concat(v.children) // 子级菜单
        }
      })
    },
    getOperatorsArithmetic() {
      return new Promise((resolve, reject) => {
        getOperatorsArithmetic().then((res) => {
          const NativeCalculate = res.resp.map((item) => {
            return {
              beforeParamType: item.paramType,
              codeService: '',
              code: item.code,
              element: item.element,
              nodeType: 'CALCULATE',
              uuid: uuidv4(),
              expressionArray: [{
                desc: item.desc,
                type: 'text'
              }, {
                ...item,
                type: item.element,
                ...{ units: item.units ? item.units.reverse() : null },
                returnType: item.paramType, // item.paramType
                // value: '',
                uuid: uuidv4()
              }],
              label: item.desc,
              paramType: item.paramType,
              returnType: item.paramType,
              fieldPath: item.code
            }
          })
          resolve(NativeCalculate)
        })
      })
    },
    getComparisonOperators() {
      return new Promise((resolve, reject) => {
        getComparisonOperators().then((res) => {
          const NativeCompareList = []
          res.resp.map((item) => {
            // if (!['STR_BELONG_TO', 'STR_NOT_BELONG_TO', 'STR_BELONG_TO_MUL', 'STR_NOT_BELONG_TO_MUL'].includes(item.code)) {} // 去掉属于（多选）、不属于（多选）、属于（多选）、不属于（多选）
            // 统一格式
            NativeCompareList.push({
              beforeParamType: item.paramType,
              codeService: '',
              code: item.code,
              element: item.element,
              nodeType: 'COMPARISON',
              uuid: uuidv4(),
              expressionArray: [{
                desc: item.desc,
                type: 'text'
              }, {
                code: item.code,
                type: item.element, // item.element,
                returnType: item.paramType,
                // value: '',
                uuid: uuidv4()
              }],
              label: item.desc,
              paramType: item.paramType,
              returnType: item.paramType,
              fieldPath: item.code
            })
          })
          resolve(NativeCompareList)
        }).catch(() => reject())
      })
    },
    getIdExpressionId(data, parent, bomMaps, idMaps, treeFlatMaps) {
      // 获取菜单
      data.beforeParamType = parent.type
      data.beforeFieldPath = parent.fieldPath
      data.returnType = data.type

      if (data.type === 'object' || data.type === 'object') {
        (bomMaps[data.field] || (bomMaps[data.field] = [])).push(...(data.children || []))
      }

      if (data.detailsList) {
        data.uuid = uuidv4()
        data.originDetailsList = data.detailsList
        data.detailsList = data.detailsList.map(v => {
          v.returnType = v.type
          // v.type = { string: 'input', int: 'input', date: 'date', selector: 'input', 'selector-multiple': 'input' }[v.type]
          v.type = { string: 'input', int: 'input', date: 'date' }[v.type] || 'input'
          // v.value = ''
          v.uuid = uuidv4()
          return [v]
        })
      }

      if (data.dataType === 'method') {
        const obj = {
          beforeParamType: data.type,
          codeService: data.codeService,
          expressionArray: data.detailsList,
          expressionDesc: data.label,
          expressionId: data.path,
          returnType: data.returnType,
          dataType: data.dataType
        }
        idMaps[obj.expressionId.toUpperCase()] = obj
      }

      if (data.children) {
        treeFlatMaps[data.fieldPath || 'root'] = data.children || []
        for (const child of data.children) {
          this.getIdExpressionId(child, data, bomMaps, idMaps, treeFlatMaps)
        }
      }
    },
    getRuleExpressionsAll(treeData) {
      return new Promise((resolve, reject) => {
        getRuleExpressionsAll().then((res) => {
          res = res.resp

          const IdList = {} // 按照id来分类
          const typeList = {} // 按照基本类型分类
          let bomListMaps = {} // 表单的下拉数据
          const treeFlatMaps = {}

          const codeServiceList = []

          res.forEach(v => {
            v.nodeType = 'EXPRESSION'
            v.expressionArray = v.expressionArray.filter(v => v.paramId !== 'param1') // 去掉第一个空的表达式
            v.label = v.expressionDesc.replace(/\&1 /g, '')
            v.fieldPath = v.expressionId

            // 表达式分类： 基本类型的数组集合
            const type = v.beforeParamType.toLowerCase();
            (typeList[type] || (typeList[type] = [])).push(v)

            // 表达式分类： id对象的集合
            IdList[v.expressionId] = v

            v.paramType = v.returnType
            v.codeService && codeServiceList.push(v.codeService)
          })

          this.getIdExpressionId(treeData, {}, bomListMaps, IdList, treeFlatMaps)

          getCodeService(codeServiceList).then(bomList => {
            bomListMaps = Object.assign(bomListMaps, bomList)
            resolve(_.cloneDeep({ typeList, IdList, bomListMaps, list: res, treeFlatMaps }))
          })
        })
          .catch(() => reject())
      })
    },
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.bomBaseInfoId,
        loadChildren: true
      }
      bomClassAndField(data).then((res) => {
        this.toChangeTree(res.resp)
      })
    },
    toChangeTree(res) {
      res.type = 'root'
      res.fieldPath = 'root'
      // 挂载数据
      this.setTreeNodePath([res], {})

      this.getPocExpressionsAll()

      // 获取初始化的数据【表达式列表】
      const params = [
        this.getOperatorsArithmetic(),
        this.getComparisonOperators(),
        this.getRuleExpressionsAll(res)
      ]
      Promise.all(params).then(([nativeCompare, comparison, expression]) => {
        const { list, IdList, typeList, bomListMaps, treeFlatMaps } = expression

        // this.BaseTypeList = Object.freeze(typeList)

        // this.IdTypeList = Object.freeze(IdList)

        this.treeFlatMaps = treeFlatMaps // 拍平后的树节点，目的获取子级下拉菜单

        this.nodeTypeList = Object.freeze([...comparison, ...nativeCompare, ...list])

        this.collectTypeOpts = Object.freeze(bomListMaps)

        this.treeData = Object.freeze([res])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.guid-rule-table-editor {
    border: 1px solid #CED5DB;
    .guid-rule-selector {
        // margin-bottom: 20px;
        // margin: 0 6px ;
        // position: relative;
        // .error {
        //     // position: absolute;
        //     // left: 10px;
        //     // bottom: -15px;
        //     font-size: 12px;
        //     color: red;
        //     margin: 5px 10px;
        // }
        // .guid-rule-selector-editor {
        //     cursor: pointer;
        //     border-bottom: 1px solid #EBEEF5;
        //     line-height: 32px;
        //     // margin-bottom: 10px;
        //     padding: 0 10px;
        //     min-height: 32px;
        //     .underline:hover {
        //         text-decoration: underline;
        //     }
        //     ::v-deep.symbol {
        //         color: blue;
        //         font-weight: bold;
        //     }
        //     ::v-deep .mr-10 {
        //         margin-right: 10px;
        //     }
        //     ::v-deep .ml-10 {
        //         margin-left: 10px;
        //     }
        //     ::v-deep .guid-rule-editor-col {
        //         cursor: pointer;
        //         .underline:hover {
        //             text-decoration: underline;
        //         }
        //         .el-input {
        //             width: initial;
        //             // display: inline-block;
        //         }
        //         .el-input__inner {
        //             width: initial;
        //         }
        //         .values {
        //             color: #028229;
        //             font-weight: bold;
        //             &.disabled {
        //                 color: gray!important;
        //             }
        //         }
        //         // .el-date-editor.input {
        //         //     .el-input__inner {
        //         //         padding-left: 30px;
        //         //         width: 190px!important;
        //         //     }
        //         // }
        //         .input, .el-select {
        //             .el-input__inner {
        //                 width: 110px!important;
        //                 // padding: 0;
        //                 // height: initial;
        //                 // line-height: initial;
        //             }
        //             .el-input__icon {
        //                 line-height: 32px;
        //             }
        //         }
        //         .el-select {
        //             .el-input__inner {
        //                 padding: 0;
        //             }
        //         }
        //         input {
        //             // border: none;
        //             border-color: #8dc3ff;
        //         }
        //         input:focus {
        //             &::placeholder {
        //                 opacity: 0.3;
        //             }
        //         }
        //         input:focus-visible {
        //             outline-color: #8dc3ff;
        //         }
        //         input::placeholder {
        //             font-weight: bold;
        //             opacity: 1;
        //             color: #028229;
        //         }
        //     }
        // }
    }
    .guid-rule-tools {
        font-size: 18px;
        // margin-bottom: 10px;
        padding: 0 15px;
        cursor: pointer;
        background: #0079ff;
        background: #627890;
        ::v-deep .el-icon-close, ::v-deep .el-icon-check {
            color: #32373B;
            color: white;
        }
    }
}
</style>
