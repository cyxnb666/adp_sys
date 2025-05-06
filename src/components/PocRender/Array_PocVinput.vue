<template>
  <div class="relative treeInput" :class="{ 'express-node': paramId }" style="display:flex;display: inline-flex;">
    <!-- 节点： -->
    <span v-if="paramId === start && paramId !== null" class="mr-5" style="font-weight: 700;"> ( </span>
    <span v-for="(item,index1) in node.paramValue[paramId]" :key="index1">
      <template v-if="item.dataType && item.dataType === 'field' || item.nodeType && item.nodeType === 'FIELD'">
        <RenderTemplate :param-id="paramId" :i="i" :path="path" :arr-item-index="index1" :index="index" :tree-data="treeData" :node="item" @rightTemplate="rightTemplate" @methodParamIconClick="methodParamIconClick" />
      </template>
      <template v-if="item.nodeType && item.nodeType === 'CALCULATE'">
        <span class="mr-5">
          {{ item.label }}
        </span>
      </template>
      <template v-if="item.nodeType && item.nodeType === 'CUSTOM'">
        <span style="width: 90%;display:flex;display: inline-flex;" @contextmenu.prevent="rightClick($event,index1)">
          <span>
            <el-input
              ref="addParamsInput"
              v-model="vInputValue[index1]"
              class="input"
              :placeholder="format.desc"
              :rows="1"
              resize="both"
              @blur="inputBlur($event,index1)"
              @focus="inputFocus($event, index1)"
            >
              <el-select
                v-if="format.unitsList"
                slot="append"
                v-model="node.paramValueUnit"
                value-key="key"
              >
                <el-option
                  v-for="item in format.unitsList"
                  :key="item.key"
                  :value="item"
                  :label="item.label"
                />
              </el-select>
              <!-- <i slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="clickAddIcon(...arguments)" /> -->
            </el-input>
            <span v-if="!isValidInput" style="color: red">文本内容需要用双引号包裹</span>
          </span>
        </span>

      </template>
      <template v-if="item.dataType && item.dataType === 'method' || item.nodeType && item.nodeType === 'METHOD'">
        <RenderTemplate :param-id="paramId" :i="i" :path="path" :arr-item-index="index1" :index="index" :tree-data="treeData" :node="item" @rightTemplate="rightTemplate" @methodParamIconClick="methodParamIconClick" />
      </template>
    </span>
    <div
      v-if="isContextMenuVisible"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      class="menuBox"
      @mouseleave="hideContextMenu"
    >
      <div v-show="structure === 1" class="context-menu">
        <div class="funBtn" @click="clickOperation">插入bom字段或者方法</div>
        <!-- <div class="funBtn" @click="customInsertNodeFn(1)">插入字段或方法</div> -->
      </div>
      <!-- <div v-show="structure === 2">
            <el-cascader-panel
              ref="cascaderPanel"
              v-model="changeField"
              :options="treeData"
              :props="{value:'field',checkStrictly: true}"
              @change="addParamsFn"
            />
          </div> -->
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="max-content"
    >
      <el-cascader-panel
        ref="cascaderPanel"
        v-model="changeField"
        :options="treeData"
        :props="{value:'field',checkStrictly: true}"
        @change="addParamsFn"
      />
    </el-dialog>
    <!-- 渲染方法中参数的间隔 -->
    <span v-if="paramId === start && paramId !== null&& keys.length>1"> ， </span>
    <span v-if="paramId !== start && paramId !== end && paramId !== null && keys.length>1"> ， </span>
    <span v-if="paramId === end && paramId !== null">
      <span style="font-weight: 700;">)</span>
    </span>
  </div>
</template>

<script>
// import RenderTemplate from './RuleEditorRender.vue'
import store from '@/store'
import { RETURN_TYPE } from '@/utils/poc'
import bus from '@/utils/bus'
// import bus from '@/packages/PageRuleEditor/eventBus'
export default {
  name: 'MethodPocVinput',
  components: {
    RenderTemplate: () => import('./PocRender.vue')
  },
  props: {
    node: {
      type: Object,
      default: null
    },
    format: {
      type: Object,
      default: null
    },
    paramId: {
      type: String,
      default: null
    },
    arrItemIndex: {
      type: Number,
      default: null
    },
    selectListInfo: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    treeData: {
      type: Array,
      default: null
    },
    i: {
      type: Number,
      default: null
    },
    path: {
      type: String,
      default: null
    },
    nodeT: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      start: null,
      end: null,
      selectList: [], // 列表
      vInputValue: [], // 普通控件存值.
      vDateExpressionValue: null,
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null, // 节点值的单位
      isContextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      changeField: '',
      structure: 1,
      // treeData: [],
      options: 0,
      keys: null,
      showText: false,
      dialogVisible: false,
      vInputValueLength: 0,
      startPos: 0, // 获取光标起始位置
      endPos: 0, // 获取光标结束位置
      inputNeedFieldPath: [],
      isValidInput: true,
      booleanOptions: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }],
      showMenu: false,
      changeIndex: null,
      inputIndex: null
    }
  },
  computed: {
    ExpressionDetail() {
      return this.getExpressionDetail(this.operatorCode)
    }
  },
  watch: {
    vInputValue: {
      async handler(newValue) {
        this.node.paramValue[this.paramId][this.inputIndex].paramValue = newValue[this.inputIndex]
        if (typeof newValue[this.inputIndex] === 'object') {
          if (Object.prototype.toString.call(newValue[this.inputIndex]) === '[object Object]') {
            this.node.paramValue[this.paramId][this.inputIndex] = newValue[this.inputIndex]
          }
        }
      },
      deep: true
    },
    // 监听codeService 获取下拉列表数据
    'selectListInfo.codeService': {
      handler(value) {
        if (value) {
          window.console.log(value, 'selectListInfo.codeService')
          getCodeService(this.selectListInfo.codeService.toString()).then(
            () => {
              this.remoteMethod()
            }
          )
        }
      },
      deep: true,
      immediate: true
    },
    treeData(newValue) {
      if (newValue) {
        this.treeData = newValue
      }
    }
  },
  created() {
    // this.init()
    this.RETURN_TYPE = RETURN_TYPE
    this.remoteMethod()
    this.node.paramValue[this.paramId].forEach((item, index) => {
      if (item.paramValue) {
        this.vInputValue[index] = item.paramValue
      }
    })
    this.keys = Object.keys(this.node.paramValue)
    this.start = this.keys[0].toString()
    this.end = this.keys[this.keys.length - 1]
  },
  mounted() {
    bus.$on('methodParamInputIconClick', val => {
      this.methodParamIconClick(val)
    })
  },
  methods: {
    adjustInputWidth() {
      const input = this.$refs.inputRef.$refs.input
      input.style.width = 'auto'
      const textWidth = input.scrollWidth + 5
      input.style.width = textWidth + 'px'
    },
    inputIconClick() {
      bus.$emit('TREEEXplusIconClick', { index: this.index, i: this.i, path: this.path, node: this.node })
    },
    // 方法中参数加号被点击了
    methodParamIconClick(data) {
      const expNode = { 'operator': 'ADD', 'code': 'ADD', 'desc': '加', 'paramType': 'int,integer,double,float', 'element': 'input', 'units': null, 'label': '+', 'returnType': 'double', 'nodeType': 'CALCULATE' }
      const inputNode = { 'type': 'input', 'nodeType': 'CUSTOM', 'returnType': 'string', 'paramValue': '', 'methodParamInput': 'methodParamInput' }
      const newData = [...this.node.paramValue[this.paramId]]
      // const newVinputVlaue = JSON.parse(JSON.stringify(this.vInputValue))
      const newVinputVlaue = [...this.vInputValue]
      newData.splice(data.arrItemIndex + 1, 0, expNode)
      newData.splice(data.arrItemIndex + 2, 0, inputNode)
      newVinputVlaue.splice(data.arrItemIndex + 1, 0, null)
      newVinputVlaue.splice(data.arrItemIndex + 2, 0, null)
      this.node.paramValue[this.paramId] = newData
      this.vInputValue = newVinputVlaue
    },
    clickBtnInsertDataFn(e) {
      e.preventDefault()
      this.showMenu = true
      this.contextMenuX = e.clientX + 5
      this.contextMenuY = e.clientY + 5
    },
    customInsertNodeFn(res) {
      if (res === 1) {
        // 说明点击的是插入字段或方法
        bus.$emit('customInsertNodeFn', { index: this.index, i: this.i, insertFieldOrMethod: 'insertFieldOrMethod', path: this.path, paramId: this.paramId, node: this.node })
        this.showMenu = false
      }
      if (res === 2) {
        bus.$emit('customInsertBracket', { index: this.index, i: this.i, num: 7, path: this.path })
        this.showMenu = false
      }
      if (res === 3) {
        bus.$emit('customInsertBracket', { index: this.index, i: this.i, num: 8, path: this.path })
        this.showMenu = false
      }
    },
    rightTemplate(data) {
      this.needdata = data
      event.preventDefault()
      this.structure = 1
      this.changeField = ' '
      this.rightNodeIndex = data.index
      this.isContextMenuVisible = true
      // this.showMenu = true
      this.contextMenuX = data.event.clientX
      this.contextMenuY = data.event.clientY
      const screenHeight = window.innerHeight
      this.divHeight = screenHeight - this.contextMenuY
      // this.findMatchingItems1(this.rootArray, data)
      if ((data.node.nodeType === 'FIELD' && this.tempNode?.nodeType === 'EXPRESSION') ||
      (data.node.nodeType === 'FIELD' && this.rootArray[this.rightNodeIndex]?.nodeType === 'EXPRESSION')) {
        this.updateDom = 1
        this.domFieldID = data.id
      } else if ((data.node.nodeType === 'FIELD' && this.tempNode?.nodeType === 'EXPRESSION') ||
      (data.node.nodeType === 'FIELD' && this.needNode[this.rightNodeIndex]?.nodeType === 'EXPRESSION')) {
        this.updateDom = 1
        this.domFieldID = data.id
      } else if (data.node.nodeType === 'FIELD' && this.tempNode?.nodeType === 'COMPARISON' ||
      data.node.nodeType === 'FIELD' && this.rootArray[this.rightNodeIndex]?.nodeType === 'COMPARISON') {
        this.updateDom = 2
        this.domFieldID = data.node.fieldId
      } else if (data.node.nodeType === 'FIELD' && this.tempNode?.nodeType === 'COMPARISON' ||
      data.node.nodeType === 'FIELD' && this.needNode[this.rightNodeIndex]?.nodeType === 'COMPARISON') {
        this.updateDom = 2
        this.domFieldID = data.node.fieldId
      } else {
        this.updateDom = 0
      }
    },
    // async clickTemplate(data) {
    //   if (data.node.nodeType === 'FIELD') {
    //     this.$emit('setCurrentKey', data.node)
    //   } else {
    //     this.currentNode = data.node
    //     this.clickTemplateIndex = data.index
    //     // this.findMatchingItems(this.rootArray, data)
    //     // await this.handleField2(this.currentNode.left)
    //     this.showDropdown = !this.showDropdown
    //     this.contextMenuX = data.event.clientX
    //     this.contextMenuY = data.event.clientY
    //     const screenHeight = window.innerHeight
    //     this.divHeight = screenHeight - this.contextMenuY
    //     if (this.showDropdown) {
    //       const list0 = this.CalculateList2.filter(item => !item.disabled)
    //       const list1 = this.CompareList2.filter(item => !item.disabled)
    //       const list2 = this.EXPRESSIONList2.filter(item => !item.disabled)
    //       this.dropdownMenuData = [...list0, ...list1, ...list2]
    //     } else {
    //       this.dropdownMenuData = []
    //     }
    //   }
    // },
    // 键盘删除
    handleKeyDown(event) {
      event.preventDefault()
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.vInputValue = ''
      }
    },
    handleKeyPress(event) {
      event.preventDefault()
    },
    inputBlur(e, index) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
    },
    inputFocus(e, index) {
      this.inputIndex = index
    },
    rightClick(e, index) {
      this.structure = 1
      this.isContextMenuVisible = true
      this.contextMenuX = e.clientX
      this.contextMenuY = e.clientY
      this.changeIndex = index
    },
    clickOperation() {
      this.dialogVisible = true
      this.changeField = null
      // this.structure = 2
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
    hideContextMenu() {
      this.isContextMenuVisible = false
    },
    addParamsFn() {
      // 此处处理输入框插入字段或方法
      // this.vInputValue = ''
      this.showText = true
      this.dialogVisible = false
      this.isContextMenuVisible = false
      const checkNode = this.$refs['cascaderPanel'].getCheckedNodes()[0].data
      // const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
      const treeDataCopy = [...this.treeData]
      const parentLabel = this.findParentLabel(treeDataCopy, checkNode.fieldPath)
      const result = parentLabel.join('的')
      const txt = this.vInputValue
      const newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
      checkNode.text = newValue
      if (checkNode.dataType === 'method') {
        const paramValue = {}
        checkNode.detailsList.forEach((item) => {
          paramValue[item.paramId] = ''
        })

        const field = {
          returnType: checkNode.type,
          nodeType: 'METHOD',
          classPath: checkNode.classPath,
          methodPath: checkNode.fieldPath,
          path: checkNode.path,
          expressionId: checkNode.path,
          methodName: checkNode.label,
          paramValue: paramValue
        }
        this.$set(this.vInputValue, this.inputIndex, field)
      } else {
        this.$set(this.vInputValue, this.inputIndex, checkNode)
      }
    },
    // 下拉列表的数据
    remoteMethod(query) {
      let list = null
      if (this.node.nodeType === 'CUSTOM') {
        // 比较节点的列表
        list = store.state.app.CodeService[this.selectListInfo.codeService]
      } else {
        // 表达式的列表
        if (this.selectListInfo.listSource === 'param-field') {
          list = store.state.app.ListByField[this.selectListInfo.codeService]
        } else if (this.selectListInfo.codeService) {
          list = store.state.app.CodeService[this.selectListInfo.codeService]
        } else {
          list = store.state.app.CodeService[this.node.codeService]
        }
        if (this.selectListInfo.listSourceFilter && list) {
          list = list.filter(item => {
            return item.codeService
          })
        }
      }
      //  搜索过滤
      if (query !== '' && query !== undefined) {
        this.selectList = list.filter(item => {
          return item.label
            .indexOf(query) > -1
        })
      } else {
        this.selectList = list
      }
      // this.selectList = list;
    },
    // 用operatorCode 解析表达式
    getExpressionDetail(operatorCode) {
      let list = []
      if (operatorCode) {
        list = store.state.app.expressionList[operatorCode].expressionArray
      }
      return list
    }

  }
}
</script>

    <style lang="scss" scoped>
    ::v-deep .el-select__tags {
      flex-wrap: unset;
      overflow: auto;
    }
    ::v-deep .el-date-editor.el-input {
      width: 180px !important;

      .el-input__inner {
        width: 180px !important;
        padding-left: 30px;
      }
      .el-input__icon {
        line-height: 35px;
      }
    }
    .menuBox{
      position: fixed;
      background: #fff;
      z-index:99;
    }
    .context-menu{
      // width:400px;
      // height:700px
      border:1px solid #ddd;
      padding:5px 10px;
      font-size: 12px;
      .funBtn{
        cursor: pointer;
        padding:5px;
      }
      .funBtn:hover{
          color:#0079ff
        }
    }
    .context-menu-container{
      border:1px solid #ddd;
      background: #fff;
      position: fixed;
      padding:5px 10px;
      font-size: 12px;
      text-align: left;
      .funBtn{
        cursor: pointer;
        padding:5px;
      }
      .funBtn:hover{
          color:#0079ff
        }
    }
    </style>
