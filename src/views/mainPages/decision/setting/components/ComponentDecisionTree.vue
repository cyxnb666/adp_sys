/* eslint-disable no-dupe-keys */
<template>
  <div class="ruleSetting" @scroll="handleScroll">
    <div class="mt-15 padding-15 flex-wrap justify-content-between">
      <div class="card-head-style1 clearfix">
        <span>{{ $t('ruleSetting.ruleSetting') }}</span>
      </div>
      <div>
        <el-input
          v-model="condition"
          placeholder="请输入内容"
          style="width: 500px"

          clearable
          @change="findRule"
        >
          <el-button slot="append" icon="el-icon-search" @click="findRule" />
        </el-input>
        <el-button style="margin-left:20px" class="btn-border" @click="openRuleList">{{ $t('ruleSetting.openRuleList') }}</el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="loading" class="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <ApproveDecisionTreeList
        ref="decisionTreeList"
        :rule-data.sync="ruleData"
        @toggleComponent="(name, row) => $emit('decisionTreeDetail', name, row)"
      />
    </transition>

    <div class="footer-btn-wrap app-container">
      <div />
      <div class="text-center">
        <el-button class="btn-border medium" @click="resetRule">{{ $t('common.reset') }}</el-button>
        <el-button class="btn-background medium" @click="postRule">{{ $t('common.saveChange') }}</el-button>
      </div>
      <div />
    </div>
  </div>
</template>

<script>
import ApproveDecisionTreeList from '@/views/mainPages/decision/approve/components/ApproveDecisionTreeList'

const flatten = function(list) {
  const resArr = []
  list.forEach((item) => {
    resArr.push(item)
    if (item.children) {
      resArr.push(item.children)
    }
  })
  return resArr
}

export default {
  components: {
    ApproveDecisionTreeList
  },
  props: {
    decisionUrlId: {
      type: String,
      default: ''
    },
    ruleData: {
      type: Array,
      default: _ => []
    },
    rule: {
      type: Object,
      default: function() {
        return {
          id: null, // id
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          ruleTips: null, // 规则不通过提示信息
          ruleId: null // 规则id}
        }
      }
    }
  },
  data() {
    return {
      search: '',
      applicationDecisionTableList: [], // 该应用里所有的决策表
      decisionTableList: [], // 该决策路径下所有的决策表
      drawer: false, // 右侧列表
      dialogFormVisible: false, // 显示编辑弹框
      currentModel: '', // 当前编辑操作的决策表
      time: [-28800000, 3155731200000], // 生效时间-失效时间
      dragging: false,
      // 以上是决策表原始数据
      lang: this.$store.state.settings.lang,
      bomModelId: '',
      showRule: false,
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleSetList: [],
      InceptionRuleSetList: [],
      ruleList: [], // 展示抽屉新增规则列表，
      RuleResults: [], // 执行结果
      currentPageData: [], // 当前页数据
      showPagination: false, // 是否显示分页器
      value: '',
      CopyDialogVisible: false,
      CopyDialogVisible2: false,
      treeData: [],
      field: {},
      params: {},
      node: {},
      fieldId: '',
      keyValue: '',
      listData: null,
      listData2: null,
      searchListData: null,
      searchListData2: null,
      currentIndex: null,
      currentIndex2: null,
      tempNode: null,
      ruleMethodList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      selectList: [], // 列表
      vInputValue: [], // 普通控件存值
      vDateExpressionValue: null,
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null, // 节点值的单位
      isContextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      changeField: '',
      structure: 1,
      options: 0,
      inputIndex: '',
      vInputValueLength: 0,
      startPos: 0, // 获取光标起始位置
      endPos: 0, // 获取光标结束位置
      jvaneedparam: {},
      fieldParsing: [],
      needFieldPath: [],
      errorText: '',
      isValidInput: true,
      allLabels: [],
      directionList: { 0: '反向', 1: '正向' },
      operationList: { 0: '正式运行', 1: '试运行' },
      condition: '',
      pageNum1: 1,
      pageSize1: 20,
      saveRuleList: [],
      handleScrollFlag: true,
      queryflag: false,
      searchValue: '',
      thenList: [],
      elseList: [],
      RuleResultsList: [],
      checkedNodes: [{}],
      // 树
      treeDataArry: [],
      chooseRuleDialog: false,
      tableEditIndex: 0
    }
  },
  computed: {
    // ruleDesc() {
    //   let str = ''
    //   if (this.ruleSetListForm.ruleSetList.ruleSettingDesc) {
    //     str = this.ruleSetListForm.ruleSetList.ruleSettingDesc.replaceAll('并且', '<br><span class="symbol">并且</span>').replaceAll('或者', '<br/><span class="symbol">或者</span>')
    //   }
    //   return str
    // },
    applicationRuleForward() {
      return this.$store.state.app.applicationRuleForward
    },
    baseURL() {
      return this.$store.state.settings.adp_config.baseURL
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    vInputValue: {
      async handler(newValue) {
        if (!this.treeData) {
          await this.bomClassAndField()
        }
        newValue.forEach((item, index) => {
          if (this.fieldParsing[index]) {
            const regex1 = /\${(.*?)}/g
            const matches1 = [...this.fieldParsing[index].matchAll(regex1)]
            const foundStrings = matches1.map(match => match[1])
            if (this.needFieldPath[index]) {
              this.needFieldPath[index] = [...this.needFieldPath[index], ...foundStrings]
            } else {
              this.needFieldPath[index] = []
              this.needFieldPath[index] = [...this.needFieldPath[index], ...foundStrings]
            }
          }
          if (item) {
            if (!this.needFieldPath[index]) {
              this.needFieldPath[index] = []
            }
            if (this.needFieldPath[index].length !== 0) {
              for (let i = 0; i < this.needFieldPath[index].length; i++) {
                const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
                const parentLabel = this.findParentLabel(treeDataCopy, this.needFieldPath[index][i])
                const result = parentLabel.join('的')
                if (newValue.indexOf(result)) {
                  item = item.replace(result, '${' + this.needFieldPath[index][i] + '}')
                }
                this.fieldParsing[index] = item
              }
            } else {
              this.fieldParsing[index] = item
            }
          }
          this.ruleSetListForm.ruleSetList[index].form.rulePassCode = newValue[index]
        })
        newValue.forEach((item, index) => {
          if (!this.fieldParsing[index]) return
          const regex = /[^+\-*/]+/g
          const checkout = this.fieldParsing[index].match(regex)
          if (checkout) {
            checkout.forEach((item1, index1) => {
              if (!(item1.startsWith('\${') && item1.endsWith('\}'))) {
                const isNumber = /^\d+$/.test(item1)
                if (!isNumber) {
                  if (!(item1.startsWith('"') && item1.endsWith('"'))) {
                    this.isValidInput = false
                  } else {
                    this.isValidInput = true
                  }
                }
              }
            })
          }
        })
      }
    },
    ruleSetListForm: {
      handler(newValue) {
        // console.log(newValue)
      }
    },
    params(newValue) {
      this.field = newValue
    },
    fieldId(newValue) {
      this.keyValue++
    }
  },
  mounted() {
    setTimeout(() => {
      if ((this.ruleSetListForm.ruleSetList).length === 1) {
        this.vInputValue.push((this.ruleSetListForm.ruleSetList)[0].form.rulePassCode || '')
      } else {
        (this.ruleSetListForm.ruleSetList).forEach((item, index) => {
          this.vInputValue.push(item.form.rulePassCode || '')
        })
      }
    }, 1000)
  },
  beforeDestroy() {
  },
  async created() {
    this.GetDecisionTableList()
    this.handleStatus = handleStatus
    this.tableStatus = tableStatus
    // 以上是决策表原始数据
    this.ruleEditor = new RuleEditor()
    this.NODE_TYPE = NODE_TYPE
    this.getRuleResults()
    this.getbomClassAndUpdateTime()
    this.getDecisionRepositoryDetail()
    getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
      this.bomModelId = res
    })
    this.loading = true
    this.getQueryRuleSetting1()
  },
  methods: {
    delRuleFn(item, index) {
      this.tableEditIndex = index
      const item1 = { ...item, ruleId: null, ruleSetting: null, elseList: null, thenList: null }
      this.$set(this.ruleSetListForm.ruleSetList, index, item1)
      this.searchNode(item1)
    },
    // 点击dom节点选择规则后保存
    saveChooseRule() {
      this.chooseRuleDialog = false
      getRuleDefinedDetail(this.$refs.ruleTree.checkedNodes[0].ruleId).then(async(item) => {
        this.searchNode(item)
      })
    },
    // 现在规则获取规则详细数据
    searchNode(item) {
      let obj2 = {
        time: [
          item.effectiveDate || -28800000,
          item.invalidatedDate || 3155731200000
        ],
        isEdit: true }
      if (item.ruleSetting) {
        obj2 = { form: {
          ruleForward: item.ruleSetting.ruleForward,
          ruleResult: item.ruleSetting.ruleResult || '不通过',
          ruleTest: item.ruleSetting.ruleTest,
          rulePassCode: item.ruleSetting.rulePassCode
        },
        time: [
          item.effectiveDate || -28800000,
          item.invalidatedDate || 3155731200000
        ],
        isEdit: true,
        ruleSettingDesc: item.ruleSetting.ruleSettingDesc,
        ruleSettingContent: JSON.parse(item.ruleSetting.ruleSettingContent),
        ruleId: item.ruleSetting.ruleId,
        ruleName: item.ruleSetting.ruleName,
        fieldParsing: item.ruleSetting.fieldParsing,
        // id: item.ruleSetting.id,
        // path: item.ruleSetting.path,
        returnOpinion: item.ruleSetting.returnOpinion,
        parentState: item.ruleSetting.parentState,
        parentId: item.ruleSetting.parentId,
        approvalStatus: item.ruleSetting.approvalStatus //   0-待审批，1-审批通过，2-退回修改，3-无需审批,4-审批不通过}
        }
        this.fieldParsing.push = item.ruleSetting.fieldParsing
      }
      const obj3 = { ...this.ruleSetListForm.ruleSetList[this.tableEditIndex] }
      const obj1 = { ...obj3, ...obj2 }
      // 编辑赋值
      this.editToSetList(obj1, this.tableEditIndex)
      obj2['elseListText'] = this.getText(item.elseList || [])
      obj2['thenListText'] = this.getText(item.thenList || [])
      const res = {
        elseList: item.elseList || [],
        thenList: item.thenList || []
      }
      this.$set(this.ruleMethodList, this.tableEditIndex, res)
      // this.ruleMethodList.push(res)
      const transformedData = this.ruleMethodList.map(item1 => {
        const newItem = {
          bomModelId: this.bomModelId,
          decisionUrlId: this.decisionUrlId,
          decisionTableId: item1.decisionTableId || obj3.decisionTableId,
          ruleId: item1.ruleId || (item.ruleSetting && item.ruleId) || null,
          elseList: item1.elseList ? item1.elseList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            codeService: elseItem.codeService,
            expressionId: elseItem.expressionId,
            returnType: elseItem.returnType,
            paramValue: elseItem.paramValue,
            fieldParsings: elseItem.fieldParsings
          })) : [],
          thenList: item1.thenList ? item1.thenList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            codeService: elseItem.codeService,
            fieldParsings: elseItem.fieldParsings,
            expressionId: elseItem.expressionId,
            returnType: elseItem.returnType,
            paramValue: elseItem.paramValue
          })) : []
        }
        return newItem
      })
      this.ruleMethodList = transformedData
    },
    // 编辑规则获取详情数据
    getDecisionTableSettingDetail(item) {
      getDecisionTableSettingDetail(this.decisionUrlId, item.decisionTableId).then(async(item) => {
        this.searchNode(item)
      })
    },
    // handleEnter() {
    //   // 在这里写入需要触发的事件代码
    //   const data = {
    //     applicationId: this.$store.state.app.applicationId,
    //     decisionTableName: this.search
    //   }
    //   FindDecisionTable(data).then(res => {
    //     // this.decisionTableList = res.map((item) => {
    //     //   return { ...item, showPreviewExcel: false, url: `${this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API}/export/decisionTable/${item.decisionTableId}` }
    //     // })
    //     if (res === undefined) {
    //       this.applicationDecisionTableList = []
    //     } else {
    //       this.applicationDecisionTableList = res
    //     }
    //   })
    // },
    retrieveData() {
      this.getQueryRuleSetting1()
    },
    tableItemClick() {
      const draggingItems = document.querySelectorAll('.rule-border')
      draggingItems.forEach(item => item.classList.add('dragging'))
    },
    onStart() {
      const draggingItems = document.querySelectorAll('.rule-border')
      draggingItems.forEach(item => item.classList.add('dragging'))
      this.dragging = true
    },
    onEnd() {
      // 清除拖拽样式
      const draggingItems = document.querySelectorAll('.dragging')
      draggingItems.forEach(item => item.classList.remove('dragging'))
      // 这里是拖拽结束后的处理逻辑
      this.dragging = false
    },
    checkMove: function(e) {
    },
    // 查询应用下所有的决策表
    GetDecisionTableList() {
      GetDecisionTableList(this.$store.state.app.applicationId).then(res => {
        this.applicationDecisionTableList = res.map((item) => {
          return { ...item, showPreviewExcel: false, url: `${this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API}/export/decisionTable/${item.decisionTableId}` }
        })
      })
    },
    // 添加一条决策表
    addList(item) {
      const obj = {
        // 决策表数据
        decisionTableId: item.decisionTableId,
        decisionTableSettingId: item.decisionTableSettingId,
        decisionTableTest: item.decisionTableTest,
        decisionUrlId: this.decisionUrlId,
        time: [
          new Date('1970-1-1'),
          new Date('2070-1-1')
        ],
        decisionTableName: item.decisionTableName,
        approvalStatus: item.approvalStatus,
        path: item.path,
        showPreviewExcel: false,
        iseEdit: false,
        url: `${this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API}/export/decisionTable/${item.decisionTableId}`
      }
      this.addToSetList(obj, true)
      // editToSetList(nativeItem, index)
      this.ruleSetListForm.ruleSetList = this.listTree(
        this.ruleSetListForm.ruleSetList
      )
    },

    // 决策表是否被添加
    hasTableId(id) {
      return this.ruleSetListForm.ruleSetList.some(item => {
        return item.decisionTableId === id
      })
    },
    // 下载决策表
    downloadUserTemplate(item) {
      downloadFile('/export/decisionTable/' + item.decisionTableId, null, item.decisionTableName)
    },
    // 增加前置规则
    addPrefixRule(item, index) {
      this.tableEditIndex = index
      this.chooseRuleDialog = true
      this.$refs.ruleTree.setCheckNode([item.ruleId])
    },
    // DeleteDecisionTable 删除
    DeleteDecisionTable(item) {
      const data = {
        'decisionTableId': item.decisionTableId,
        'decisionUrlId': this.decisionUrlId
      }
      DeleteDecisionTable(data).then(() => {
        this.getQueryRuleSetting1()
      })
    },
    //  打开决策表编辑框
    modifyDecisionTable(item) {
      this.dialogFormVisible = true
      this.time = [item.effectiveDate, item.invalidatedDate]
      this.currentModel = item
    },
    // 更新决策表设置信息
    handlePutDecisionTable() {
      const data = {
        'decisionTableId': this.currentModel.decisionTableId,
        'decisionUrlId': this.decisionUrlId,
        'effectiveDate': this.time[0],
        'invalidatedDate': this.time[1]
      }
      PutDecisionTable(data).then(() => {
        this.GetDecisionTable()
        this.dialogFormVisible = false
      })
    },

    // 新增决策规则
    async openNewPage(url) {
      this.drawer = false
      const routeData = this.$router.resolve({
        // 这里打开新页面有路由切换、权限切换
        path: url,
        query: { terrace: 'system' }
      })
      window.open(routeData.href, '_blank')
    },
    // -----------------------------------------------------------------------------以上是决策表原始数据
    // 查找数据
    findRule() {
      this.getQueryRuleSetting1(true)
    },
    // 获取数据列表信息
    getText(treeNode) {
      let html = ''
      treeNode.forEach((item, index) => {
        if (index !== 0) {
          html += '<br>'
        }
        html += (index + 1) + '. '
        html += '<span class="fields">' + item.expressionArray[0].desc + '</span>'
        Object.values(item.paramValue).forEach(valueItem => {
          html += ' <span class="values">' + valueItem + '</span>;'
        })
      })
      return html
    },
    getQueryRuleSettingRuleIds() {
      queryRuleSettingRuleIds(this.decisionUrlId).then(res => {
        this.InceptionRuleSetList = [...res]
        this.ruleSetList = [...res]
      }).catch(res => {

      })
    },
    // 查询决策路径下所有决策表
    GetDecisionTable() {
      const data = {
        decisionUrlId: this.decisionUrlId,
        decisionTableName: ''
      }
      GetDecisionTable(data).then(res => {
        this.decisionTableList = res.forEach((item, index) => {
          // const itemData = { ...item, }
          this.getRuleDefinedDetail1(item, index)
        })
      })
    },
    async getQueryRuleSetting1(query) {
      this.ruleSetListForm.ruleSetList = []
      this.saveRuleList = []
      this.ruleSetList = [...this.InceptionRuleSetList]
      await getDecisionTableSetting(this.decisionUrlId, this.condition).then(async res => {
        this.buildData(res)
      }).catch((e) => {
        this.queryflag = false
      })
    },
    buildData(res) {
      res.forEach(async(item, index) => {
        let obj = {
          // 决策表数据
          time: [
            item.effectiveDate || -28800000,
            item.invalidatedDate || 3155731200000
          ],
          iseEdit: false,
          decisionTableId: item.decisionTableId,
          decisionTableSettingId: item.decisionTableSettingId,
          decisionTableTest: item.decisionTableTest,
          decisionUrlId: item.decisionUrlId,
          decisionTableName: item.decisionTableName,
          approvalStatus: item.approvalStatus,
          path: item.path,
          showPreviewExcel: false,
          url: `${this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API}/export/decisionTable/${item.decisionTableId}`
        }
        let obj2 = {}
        if (item.ruleSetting) {
          obj2 = { form: {
            ruleForward: item.ruleSetting.ruleForward,
            ruleResult: item.ruleSetting.ruleResult,
            ruleTest: item.ruleSetting.ruleTest,
            rulePassCode: item.ruleSetting.rulePassCode
          },
          ruleSettingDesc: item.ruleSetting.ruleSettingDesc,
          ruleSettingContent: JSON.parse(item.ruleSetting.ruleSettingContent),
          ruleId: item.ruleSetting.ruleId,
          ruleName: item.ruleSetting.ruleName,
          fieldParsing: item.ruleSetting.fieldParsing,
          // id: item.ruleSetting.id,
          // path: item.ruleSetting.path,
          returnOpinion: item.ruleSetting.returnOpinion,
          parentState: item.ruleSetting.parentState,
          parentId: item.ruleSetting.parentId
          }
          this.fieldParsing[index] = item.ruleSetting.fieldParsing
        }
        obj = { ...obj, ...obj2 }
        obj['elseListText'] = this.getText(item.elseList || [])
        obj['thenListText'] = this.getText(item.thenList || [])
        this.addToSetList(obj)
        const res = {
          elseList: item.elseList || [],
          thenList: item.thenList || []
        }
        this.$set(this.ruleMethodList, index, res)
        const transformedData = this.ruleMethodList.map(item1 => {
          const newItem = {
            bomModelId: this.bomModelId,
            decisionUrlId: item.decisionUrlId,
            decisionTableId: item.decisionTableId,
            ruleId: item.ruleSetting ? item.ruleSetting.ruleId : null,
            elseList: item1.elseList ? item1.elseList.map(elseItem => ({
              nodeType: 'EXPRESSION',
              codeService: elseItem.codeService,
              expressionId: elseItem.expressionId,
              returnType: elseItem.returnType,
              paramValue: elseItem.paramValue,
              fieldParsings: elseItem.fieldParsings
            })) : [],
            thenList: item1.thenList ? item1.thenList.map(elseItem => ({
              nodeType: 'EXPRESSION',
              codeService: elseItem.codeService,
              fieldParsings: elseItem.fieldParsings,
              expressionId: elseItem.expressionId,
              returnType: elseItem.returnType,
              paramValue: elseItem.paramValue
            })) : []
          }
          return newItem
        })
        this.ruleMethodList = transformedData
      })
      this.ruleSetListForm.ruleSetList = this.listTree(
        this.ruleSetListForm.ruleSetList
      )
      // this.total1 = this.ruleSetListForm.ruleSetList.length
      this.loading = false
      this.queryflag = false
    },
    // 更改数据格式
    async editRule(item, index) {
      this.tableEditIndex = index
      if (item.ruleId) {
        this.getDecisionTableSettingDetail(item)
      } else {
        const item1 = {
          ...item,
          effectiveDate: item.time[0], // 失效时间
          invalidatedDate: item.time[1] // 失效时间
        }
        this.searchNode(item1)
      }
    },
    // 错误提示
    validateInput() {
      // 在此处编写验证逻辑
      // 如果输入内容不符合标准，将 this.isValidInput 设置为 false
      this.isValidInput = true // 默认为 true
      // 示例验证逻辑：输入内容必须为纯数字
      if (this.errorText !== '') {
        this.isValidInput = false
      }
    },
    // 鼠标右击事件
    rightClick(index, event) {
      this.inputIndex = index
      this.structure = 1
      this.isContextMenuVisible = true
      this.contextMenuX = event.clientX
      this.contextMenuY = event.clientY
    },
    hideContextMenu() {
      this.isContextMenuVisible = false
    },
    inputBlur(e) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
    },
    clickOperation() {
      this.structure = 2
    },
    findParentLabel(treeData, fieldPath) {
      // 将 fieldPath 拆分为字段名数组
      const pathElements = fieldPath.split('.')
      // 初始化一个变量来存储父级节点的 label
      const parentLabel = []

      // 递归函数，用于在树结构中查找匹配的字段名
      function findLabelRecursively(node, index) {
        if (index >= pathElements.length) {
          return // 已经遍历完所有路径元素
        }
        const fieldName = pathElements[index]

        let found = false // 用于标记是否找到匹配的字段

        for (const item of node) {
          if (item.field === fieldName) {
            parentLabel.push(item.label)
            found = true
            if (item.children) {
              findLabelRecursively(item.children, index + 1) // 递归查找下一个路径元素
            }
            break // 找到匹配的字段后，不再继续搜索当前层级的其他节点
          }
        }

        if (!found) {
          // 如果当前层级没有找到匹配的字段，继续查找下一个节点
          for (const item of node) {
            if (item.children) {
              findLabelRecursively(item.children, index)
            }
          }
        }
      }

      // 从根节点开始查找
      findLabelRecursively(treeData, 0)

      // 返回父级节点的 label
      return parentLabel
    },
    addParamsFn(changeField, index) {
      this.isContextMenuVisible = false
      const vInputValue1 = changeField
      let fieldPath1 = ''
      for (let i = 1; i < vInputValue1.length; i++) {
        fieldPath1 += vInputValue1[i] + '.'
      }
      // this.needFieldPath[this.inputIndex]=new Array
      if (Array.isArray(this.needFieldPath[this.inputIndex])) {
        this.needFieldPath[this.inputIndex].push(fieldPath1.slice(0, fieldPath1.length - 1))
      } else {
        this.needFieldPath[this.inputIndex] = new Array()
        this.needFieldPath[this.inputIndex].push(fieldPath1.slice(0, fieldPath1.length - 1))
      }
      const needFieldPath1 = fieldPath1.slice(0, fieldPath1.length - 1)
      const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
      const parentLabel = this.findParentLabel(treeDataCopy, needFieldPath1)
      const result = parentLabel.join('的')
      let txt = this.vInputValue[this.inputIndex] === 'undefined' ? '' : this.vInputValue
      txt = String(this.vInputValue[this.inputIndex])
      if (txt.slice(0, this.startPos) || txt.slice(this.endPos)) {
        if (txt.slice(this.endPos) === 'undefined') {
          var newValue = txt.slice(0, this.startPos) + result
          // this.fieldParsing[this.inputIndex] ='"'+txt.slice(0, this.startPos)+'"'+"${"+needFieldPath+"}"
          // this.jvaneedparam = `${txt.slice(0, this.startPos)}'${needFieldPath}'`
        } else {
          var newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
          // this.fieldParsing[this.inputIndex] ='"'+txt.slice(0, this.startPos)+'"'+"${"+needFieldPath+"}"+'"'+txt.slice(this.endPos)+'"'
          // this.jvaneedparam = `${txt.slice(0, this.startPos)}'${needFieldPath}'${txt.slice(this.endPos)}`
        }
        this.vInputValue[this.inputIndex] = newValue// 更新输入框的值
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
      } else {
      // this.jvaneedparam = `'${needFieldPath}'`
      // this.fieldParsing[this.inputIndex] = "${"+needFieldPath+"}"
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
        this.vInputValue[this.inputIndex] = result
      }
    },
    init() {
      let value = null
      if (this.paramId) {
        // 表达式存值
        value = this.node.paramValue[this.paramId]
      } else {
        // 普通节点存值
        value = this.node.paramValue
      }
      if (
        this.format.type === 'selector' ||
        this.format.type === 'selector-multiple'
      ) {
        this.vSelectValue = value
      } else {
        if (this.format.type === 'date') {
          this.vInputValue = new Date(value)
        }
        this.vInputValue = value
      }
    },
    // 滚动加载
    handleScroll() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const windowHeight = window.innerHeight
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollHeight - (scrollTop + windowHeight + (scrollHeight / 2)) <= 0) {
        if (this.handleScrollFlag) {
          this.getQueryRuleSetting1()
        }
      }
    },
    listTree(list) {
      list.forEach((element, index) => {
        if (element.parentId) {
          list.forEach((item) => {
            if (item.id === element.parentId) {
              item.children = element
              list.splice(index, 1)
            }
          })
        }
      })
      return list
    },
    // 删除表达式
    delElseListFn(index, i) {
      this.ruleMethodList[index].elseList.splice(i, 1)
    },
    delThenListFn(index, i) {
      this.ruleMethodList[index].thenList.splice(i, 1)
    },
    delElseListFn2(index, i) {
      this.ruleMethodList[index].elseList.splice(i, 1)
    },
    delThenListFn2(index, i) {
      this.ruleMethodList[index].thenList.splice(i, 1)
    },
    // 点击加号出现弹窗
    addExpressionFn(index) {
      getMethodList(this.bomModelId).then(res => {
        this.listData = res
        this.searchListData = res
      })
      this.CopyDialogVisible = true
      this.currentIndex = index
    },
    addExpressionFn2(index) {
      getMethodList(this.bomModelId).then(res => {
        this.listData2 = res
        this.searchListData2 = res
      })
      this.CopyDialogVisible2 = true
      this.currentIndex2 = index
    },
    // 将表达式结构的数据转换成可渲染到页面的数据格式
    expressionTransferFn(items) {
      const paramValue = {}

      items.expressionArray.forEach((item) => {
        if (item.type === 'input') {
          paramValue[item.paramId] = ''
        }
      })

      const expressionNode = {}
      // expressionNode.label = expressDesc
      expressionNode.nodeType = NODE_TYPE.EXPRESSION // 节点类型
      expressionNode.codeService = items.codeService
      expressionNode.expressionId = items.expressionId
      expressionNode.returnType = items.returnType
      expressionNode.paramValue = paramValue

      return expressionNode
    },
    expressionTransferFn1(items) {
      const paramValue = {}

      items.expressionArray.forEach((item) => {
        if (item.type === 'input') {
          paramValue[item.paramId] = ''
        }
      })

      const expressionNode = {}
      // expressionNode.label = expressDesc
      expressionNode.nodeType = NODE_TYPE.EXPRESSION // 节点类型
      expressionNode.codeService = items.codeService
      expressionNode.expressionId = items.expressionId
      expressionNode.returnType = items.returnType
      expressionNode.paramValue = items.paramValue

      return expressionNode
    },
    filterTreeArray(tree) {
      return tree.filter(item => {
        return item.leaf === false
      }).map(item => {
        item = Object.assign({}, item)
        if (item.children) {
          item.children = this.filterTreeArray(item.children)
        }
        return item
      })
    },
    // 点击弹窗中的确定按钮，将该条表达式添加到规则中
    copyExpressionToThenlist(item) {
      const expressionNode = this.expressionTransferFn(item)
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex].decisionTableId === item.decisionTableId) {
          this.ruleMethodList[this.currentIndex].thenList.push(expressionNode)
        }
      })
      this.CopyDialogVisible = false
      this.searchValue = ''
    },
    copyExpressionToElselist(item) {
      const expressionNode = this.expressionTransferFn(item)
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex2].decisionTableId === item.decisionTableId) {
          this.ruleMethodList[this.currentIndex2].elseList.push(expressionNode)
        }
      })
      this.CopyDialogVisible2 = false
      this.searchValue = ''
    },
    // 根据级联选择器的id获取对应的对象
    handleChange(selectedValues) {
      selectedValues.map((value, index) => {
        // 根据选中的值在数据源中查找相应的节点信息
        if (index === selectedValues.length - 1) {
          const id = value
          this.treeData.forEach(item => {
            item.children.forEach(item2 => {
              item2.children.forEach(item3 => {
                if (item3.fieldId === id) {
                  this.params = { ...item3, returnType: item3.type }
                }
              })
            })
          })
        }
      })
    },
    // 接收规则模板的对象
    submitRule(root, toRuleText) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.rule.ruleContent = JSON.stringify(root)
          this.rule.ruleDesc = toRuleText
          this.saveRuleDefinedEdit()
        } else {
          return false
        }
      })
    },
    // 保存规则
    saveRuleDefinedEdit() {
      if (!this.currentNodePath) {
        console.error('currentNodePath')
        return
      }
      if (!this.decisionRepositoryModelId) {
        console.error('decisionRepositoryModelId')
        return
      }
      const data = {
        path: this.currentNodePath,
        decisionRepositoryId: this.decisionRepositoryModelId,
        decisionRepCatalogueId: this.rule.id,
        ...this.rule,
        codeServices: []
      }
      saveRuleDefinedEdit(data).then(async() => {
        this.$emit('PreviewRuleComponents', this.rule) // 切换回预览状态，高亮当前规则
      })
    },
    // 查询决策库信息，包含决策库基本信息、关联规则信息等
    async getDecisionRepositoryDetail() {
      await getDecisionRepositoryDetail(this.$store.state.app.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeDataArry = decisionRepositoryModel.catalogueList
          // this.bomBaseInfo = res.bomBaseInfo
          // this.bomName.bomName = res.decisionRepositoryModel.repositoryName
        }
      })
      return Promise.resolve()
    },
    // 根据bomBaseInfoId加载所有类和字段
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(async res => {
        // const val = [res]
        // this.treeData = this.filterTreeArray(val)
        this.treeData = [res]
        const data1 = res
        const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
        await this.$forage.setItem('bomBaseInfoId', data1)
        await this.$forage.setItem('bomBaseInfoId_Time', res1.updatedDate)
      })
    },
    // 根据时间判断得到的是否是最新的数据
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = await this.$forage.getItem('bomBaseInfoId_Time')
      if (res1.updatedDate === time) {
        const storedData = await this.$forage.getItem('bomBaseInfoId')
        this.treeData = [storedData]
      } else {
        this.bomClassAndField()
      }
    },
    // 处理单条规则数据
    addToSetList(nativeItem, isAdd) {
      const addItem = this._.cloneDeep(nativeItem)
      if (!nativeItem.form) {
        addItem.form = {
          ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
          ruleResult: '2',
          ruleTest: '1',
          rulePassCode: ''
        }
      }
      addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
        this._.cloneDeep(nativeItem.ruleSettingContent),
        []
      )
      if (isAdd) {
        this.saveRuleList.push(addItem)
      }
      this.ruleSetListForm.ruleSetList.push(addItem)
    },
    // 新增规则回调
    addToSetListFn(e) {
      if (e[0]) {
        const addItem = this._.cloneDeep(e[0])
        if (!e[0].ruleSettingContent) return
        if (!e[0].form) {
          addItem.approvalStatus = '0'
          addItem.form = {
            time: [-28800000, 3155731200000],
            ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
            ruleResult: '2',
            ruleTest: '1',
            rulePassCode: ''
          }
        }
        addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
          this._.cloneDeep(e[0].ruleSettingContent),
          []
        ) // 把treeNode转换为nodeArray

        this.ruleSetListForm.ruleSetList.push(addItem)
        this.ruleSetList.push(addItem.ruleId)
        this.saveRuleList.push(addItem)
        const method = {
          bomModelId: this.bomModelId,
          decisionUrlId: this.decisionUrlId,
          ruleId: addItem.ruleId,
          thenList: e[1] || [],
          elseList: e[2] || []
        }
        this.ruleMethodList.push(method)
        this.drawer = false
      } else {
        const addItem = this._.cloneDeep(e)
        if (!e.ruleSettingContent) return
        if (!e.form) {
          addItem.approvalStatus = '0'
          addItem.form = {
            time: [-28800000, 3155731200000],
            ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
            ruleResult: '2',
            ruleTest: '1',
            rulePassCode: ''
          }
        }
        addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
          this._.cloneDeep(e.ruleSettingContent),
          []
        ) // 把treeNode转换为nodeArray
        this.ruleSetListForm.ruleSetList.push(addItem)
        this.ruleSetList.push(addItem.ruleId)
        const method = {
          bomModelId: this.bomModelId,
          decisionUrlId: this.decisionUrlId,
          ruleId: addItem.ruleId,
          thenList: e[1] || [],
          elseList: e[2] || []
        }
        this.ruleMethodList.push(method)
        this.drawer = false
      }
    },
    editToSetList(nativeItem, index) {
      const addItem = this._.cloneDeep(nativeItem)
      if (!nativeItem.form) {
        addItem.isEdit = true
        addItem.form = {
          time: [-28800000, 3155731200000],
          ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
          ruleResult: '2',
          ruleTest: '1',
          rulePassCode: ''
        }
      }
      addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
        this._.cloneDeep(nativeItem.ruleSettingContent),
        []
      )
      this.$set(this.ruleSetListForm.ruleSetList, index, addItem)
      // this.ruleSetListForm.ruleSetList[index] = addItem
      let isEdit = false
      for (let i = 0; i < this.saveRuleList.length; i++) {
        if (this.saveRuleList[i].decisionTableId === nativeItem.decisionTableId) {
          this.saveRuleList[i] = addItem
          isEdit = true
          return
        }
      }
      if (!isEdit) {
        this.saveRuleList.push(addItem)
      }
    },
    // 查询规则列表
    async getRuleList() {
      this.drawerLoading = true
      getRuleList(this.$store.state.app.applicationId, { pageNum: this.pageNum, pageSize: this.pageSize, queryKey: this.search }).then((res) => {
        this.ruleList = res.list.map((item) => {
          return {
            ...item,
            ruleSettingContent: JSON.parse(item.ruleContent)
          }
        })
        this.drawerLoading = false
        this.total = res.total
      })
    },

    // 搜索规则
    querySearch: _.throttle(async function() {
      if (this.search === '') {
        this.getRuleList()
      } else {
        await getRuleList(this.$store.state.app.applicationId, { pageNum: this.pageNum, pageSize: this.pageSize, queryKey: this.search }).then((res) => {
          this.ruleList = res.list.map((item) => {
            return {
              ...item,
              ruleSettingContent: JSON.parse(item.ruleContent)
            }
          })
          this.total = this.ruleList.length
        })
      }
    }, 1000),

    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getRuleList()
    },
    // 恢复规则
    deleteTestRule(id) {
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.id === id
      })
      // this.ruleSetListForm.ruleSetList[index].ruleChildren = ''
      this.$nextTick(() => {
        const newRule = this._.cloneDeep(
          this.ruleSetListForm.ruleSetList[index].ruleArray
        )
        this.ruleSetListForm.ruleSetList[index].children.ruleArray = newRule
      })
      this.showRule = true
      setTimeout(() => {
        this.showRule = false
      }, 1000)

      this.$forceUpdate()
    },
    // 移除该规则
    deleteRule(obj, i) {
      obj.operate = 2
      this.vInputValue.splice(i, 1)
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      const index3 = this.ruleSetList.findIndex((item) => {
        return item === obj.ruleId
      })
      const index1 = this.saveRuleList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      if (obj.children && obj.children.parentState === '1') {
        this.ruleSetListForm.ruleSetList[index].children = null
      } else {
        this.ruleSetListForm.ruleSetList.splice(index, 1)
        this.ruleSetList.splice(index3, 1)
        if (index1 === -1) {
          this.saveRuleList.push(obj)
        } else {
          this.saveRuleList.splice(index1, 1)
        }
      }

      // this.showRule = true
      // setTimeout(() => {
      //   this.showRule = false
      // }, 1000)

      const index2 = this.ruleMethodList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      this.ruleMethodList.splice(index2, 1)
    },

    // 获取规则执行不通过结果定义列表
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
        this.RuleResults.forEach((item, index) => {
          this.RuleResultsList[item.resultCode] = (item.resultName)
        })
      })
    },

    // 保存规则
    async postRule() {
      const isValid = await this.$refs.obs.validate()
      if (!isValid) {
        return false
      }
      if (this.saveRuleList.length === 0) return
      this.$refs.ruleSectionForm.validate((valid) => {
        if (valid) {
          const newRuleList = flatten(this.saveRuleList)
          var ruleSettings = newRuleList.map((item, index) => {
            const rootTreeNode = this.ruleEditor.parseRuleNode(
              null,
              this._.cloneDeep(item.ruleArray)
            ) // 把nodeArray 组成treeNode
            var text = this.ruleEditor.getText(
              this._.cloneDeep(rootTreeNode),
              ''
            )
            let elseList = null
            let thenList = null
            this.ruleMethodList.forEach((item1) => {
              if (item1.decisionTableId === item.decisionTableId) {
                if (item1.thenList.length > 1) {
                  item1.thenList.forEach((res, index) => {
                    if (!res.fieldParsings) {
                      res.fieldParsings = this.fieldParsings || {}
                    }
                  })
                } else if (item1.thenList.length === 1) {
                  if (!item1.thenList[0].fieldParsings) {
                    item1.thenList[0].fieldParsings = this.fieldParsings || {}
                  }
                }
                if (item1.elseList.length > 1) {
                  item1.elseList.forEach((res, index) => {
                    if (!res.fieldParsings) {
                      res.fieldParsings = this.fieldParsings || {}
                    }
                  })
                } else if (item1.elseList.length === 1) {
                  if (!item1.elseList[0].fieldParsings) {
                    item1.elseList[0].fieldParsings = this.fieldParsings || {}
                  }
                }
                elseList = item1.elseList
                thenList = item1.thenList
              }
            })
            return {
              'approvalBy': item.approvalBy,
              'approvalDate': item.approvalDate,
              'approvalStatus': item.approvalStatus,
              'decisionTableId': item.decisionTableId,
              'decisionTableName': item.decisionTableName,
              'decisionTableOrder': item.decisionTableOrder,
              'decisionTableSettingId': item.decisionTableSettingId,
              'decisionTableStatus': item.decisionTableStatus,
              'decisionTableTest': item.decisionTableTest,
              'decisionUrlId': this.decisionUrlId,
              effectiveDate: item.time[0], // 失效时间
              invalidatedDate: item.time[1], // 失效时间
              'path': item.path,
              'prdDecisionTableOrder': item.prdDecisionTableOrder,
              'tableExeOrder': this.ruleSetListForm.ruleSetList.findIndex(val => { return val.decisionTableId === item.decisionTableId }),
              ruleSetting: item.ruleId ? {
                ruleForward: item.form.ruleForward, // 规则正反向，1-正向，0-反向
                ruleResult: item.form.ruleResult, // 规则不通过选项
                ruleTest: item.form.ruleTest, // 试运行
                ruleId: item.ruleId,
                ruleName: item.ruleName,
                id: item.id,
                parentId: item.parentId,
                ruleSettingContent: JSON.stringify(rootTreeNode), // 数结构 node
                ruleSettingDesc: text, // 规则描述
                // ruleSettingDesc: text,
                rulePassCode: item.form.rulePassCode,
                approvalStatus: item.approvalStatus, // 状态
                fieldParsing: this.fieldParsing[index] || '',
                operate: item.operate
              } : null,
              elseList: elseList,
              thenList: thenList
            }
          })
          PostDecisionTableList(ruleSettings).then(res1 => {
            this.getQueryRuleSetting1()
          })
        } else {
          return false
        }
      })
    },
    // 打开添加规则list抽屉
    openRuleList() {
      // this.getRuleList()
      this.GetDecisionTableList()
      this.drawer = true
    },

    // 撤销全部修改
    resetRule() {
      this.getQueryRuleSetting1(true)
    },

    // 右侧的规则全选
    selectAll() {
      this.ruleList.forEach(async(item, i) => {
        item.operate = 0
        const data = {
          bomModelId: this.bomModelId,
          ruleId: item.ruleId
        }
        await getMethodSettingDefine(data).then(res => {
          const thenListArr = []
          if (res.thenList) {
            res.thenList.forEach(item => {
              thenListArr.push(this.expressionTransferFn1(item))
            })
          }
          const elseListArr = []
          if (res.elseList) {
            res.elseList.forEach(item => {
              elseListArr.push(this.expressionTransferFn1(item))
            })
          }
          this.thenList = thenListArr
          this.elseList = elseListArr
          const e = [item, this.thenList, this.elseList]
          this.addToSetListFn(e)
        })
      })
    },
    thenSearch() {
      this.searchListData = this.listData.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
    },
    elseSearch() {
      this.searchListData2 = this.listData2.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
    }
  }
}
</script>
<style lang="scss">
.ruleSetting {
.item-wrap .r-body{
  .item{
    max-width: 28% !important;
    .value {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .flex-wrap>:first-child{
    min-width: 390px;
  }
}
.el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
  width: 368cpx;
}
  .rule-else,
  .rule-error {
    padding-top: 10px;

    .rule-else-item {
      .el-form-item__label {
        padding-right: 20px;
      }

      .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .is-border {
    border: 2px solid #1785ff;
  }

  .no-data {
    text-align: center;
    padding: 20px;
  }

  .pagination {
    margin-left: 22px;
  }

  .name {
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;
    /* 强制不换行 */
  }

  .hidden {
    width: 40px;
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;
    /* 强制不换行 */
    display: inline-block;

    &:hover {
      overflow: hidden !important;
    }
  }

  .value {
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;

    /* 强制不换行 */
    &:hover {
      overflow: visible;
    }
    font-size: 14px;
  }
  .value_cut {

  }

  .el-cascader {
    width: 160px;
    height: 30px !important;
  }

  .el-input--medium .el-input__inner {
    height: 34px !important;
  }

  .menuBox {
    position: fixed;
    background: #fff;
    z-index: 99;
  }

  .context-menu {
    // width:400px;
    // height:700px
    border: 1px solid #ddd;
    padding: 5px 10px;
    font-size: 12px;

    .funBtn {
      cursor: pointer;
      padding: 5px;
    }

    .funBtn:hover {
      color: #0079ff
    }
  }
}
.col-right{
  float: right;
}
.checkBox{
  display: inline-block;
  margin:5px 0 0 20px;
}
.tree-wrapper{
  position: relative;
.delRuleIcon{
  position: absolute;
  top:5px;
  right:10px;
  color: #0079ff;
  font-size: 20px;
  cursor: pointer;
}
}
.editBtn{
  margin-right: 8px!important
}
</style>
