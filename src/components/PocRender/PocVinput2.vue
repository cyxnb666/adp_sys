<template>
  <div class="relative treeInput" :class="{ 'express-node': paramId }">
    <!-- 节点： -->
    <span v-if="paramId === start && paramId !== null" class="mr-5" style="font-weight: 700;"> ( </span>
    <template v-if="vInputValue.dataType === 'method' || vInputValue.nodeType === 'METHOD'">
      <RenderTemplate :tree-data="treeData" :i="i" :path="path" :index="index" :node="vInputValue" @clickTemplate="clickTemplate" @rightTemplate="rightTemplate" />
    </template>
    <template v-else-if="vInputValue.dataType === 'field' || vInputValue.nodeType === 'FIELD'">
      <RenderTemplate :param-id="paramId" :i="i" :path="path" :index="index" :tree-data="treeData" :node="vInputValue" @clickTemplate="clickTemplate" @rightTemplate="rightTemplate" @methodParamIconClick="methodParamIconClick" />
    </template>
    <template v-else-if="format.type === 'input'&&format.desc==='<布尔参数>'">
      <span style="width: 90%;" @contextmenu.prevent="rightClick">
        <el-select v-model="vInputValue.paramValue" placeholder="请选择">
          <el-option
            v-for="item in booleanOptions"
            :key="item.value"
            ref="addParamsInput"
            :label="item.label"
            :value="item.value"
            class="input"
            @blur="inputBlur"
          />
        </el-select>
      </span>
    </template>
    <template v-else-if="format.type === 'input'&&format.desc!=='<布尔参数>'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span style="width: 90%;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :type="format.returnType === 'string' ? 'textarea' : 'number'"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
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
    </template>
    <template v-else-if="format.type === 'string'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span style="display:flex;display: inline-flex;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
        <i v-if="nodeT!=='EXPRESSION'" slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="inputIconClick(format)" />
      </span>
    </template>
    <template v-else-if="format.type === 'int'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span style="display:flex;display: inline-flex;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
        <i v-if="nodeT!=='EXPRESSION'" slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="inputIconClick(format)" />
      </span>
    </template>
    <template v-else-if="format.type === 'integer'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span style="display:flex;display: inline-flex;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
        <i v-if="nodeT!=='EXPRESSION'" slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="inputIconClick(format)" />
      </span>
    </template>
    <template v-else-if="format.type === 'double'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span style="display:flex;display: inline-flex;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :type="format.returnType === 'string' ? 'textarea' : 'number'"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
        <i v-if="nodeT!=='EXPRESSION'" slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="inputIconClick(format)" />
      </span>
    </template>
    <template v-else-if="format.type === 'date'">
      <!-- <el-input v-model="vInputValue" class="input date" type="datetime" placeholder="日期参数" /> -->
      <span style="width: 80%;display:flex;display: inline-flex;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
      </span>
    </template>

    <template v-else-if="format.type === 'time'">
      <span style="width: 90%;" @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue.paramValue"
          class="input"
          :placeholder="format.desc"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        />
      </span>
    </template>
    <template
      v-else-if="
        format.type === 'selector' || format.type === 'selector-multiple'
      "
    >
      <el-select
        v-model="vSelectValue"
        value-key="key"
        remote
        collapse-tags
        :class="format.type === 'selector-multiple' ? 'multiple' : ''"
        filterable
        :multiple="format.type === 'selector-multiple'"
        :remote-method="remoteMethod"
        :placeholder="$t('common.pleaseSelect')"
        @change="onChangeSelect"
      >
        <el-option
          v-for="item in selectList"
          :key="item.key"
          :label="item.label"
          :value="item"
        >
          <span v-if="selectListInfo.listSource !== 'param-field'">
            {{ item.key }} -
          </span>
          {{ item.label }}
        </el-option>
      </el-select>
      <!-- <el-input v-else v-model="vSelectValue" @input="onChangeSelect" /> -->
    </template>
    <template v-else>{{ node.expression }}</template>

    <!-- 渲染方法中参数的间隔 -->
    <span v-if="paramId === start && paramId !== null && keys.length>1"> ， </span>
    <span v-if="paramId !== start && paramId !== end && paramId !== null && keys.length>1"> ， </span>
    <span v-if="paramId === end && paramId !== null">
      <span style="font-weight: 700;">)</span>
      <i v-if="nodeT!=='EXPRESSION'&&hideIcon!=='hideIcon'&&node.returnType!=='boolean'" slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="(e)=>{bracketAfterInputIconClick(e)}" />
    </span>
    <div
      v-if="isContextMenuVisible"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      class="menuBox"
      @mouseleave="hideContextMenu"
    >
      <div v-show="structure === 1" class="context-menu">
        <div class="funBtn" @click="clickOperation">插入bom字段</div>
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
      <el-input
        v-model="filterText"
        :placeholder="'输入关键字查询'"
        @input="filterData"
      >
        <i slot="suffix" class="icon-search" />
      </el-input>
      <el-cascader-panel
        ref="cascaderPanel"
        v-model="changeField"
        :options="getFilteredTreeData"
        :props="{value:'field',checkStrictly: true}"
        @change="addParamsFn"
      />
    </el-dialog>
  </div>
</template>

<script>
// import RenderTemplate from './RuleEditorRender.vue'
import store from '@/store'
import { RETURN_TYPE } from '@/utils/poc'
import { getCodeService } from '@/utils/utils'
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
    },
    arrItemIndex: {
      type: Number,
      default: null
    },
    hideIcon: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      start: null,
      end: null,
      selectList: [], // 列表
      vInputValue: {
        paramValue: '',
        returnType: this.format.type,
        type: 'input',
        nodeType: 'CUSTOM'
      }, // 普通控件存值.
      vDateExpressionValue: null,
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null, // 节点值的单位
      isContextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      changeField: '',
      structure: 1,
      keys: null,
      // treeData: [],
      options: 0,
      showText: false,
      dialogVisible: false,
      vInputValueLength: 0,
      startPos: 0, // 获取光标起始位置
      endPos: 0, // 获取光标结束位置
      inputNeedFieldPath: [],
      filterText: '',
      filteredData: [],
      isValidInput: true,
      booleanOptions: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }],
      showMenu: false
    }
  },
  computed: {
    getFilteredTreeData() {
      if (this.filterText) {
        return this.filterTreeData(this.treeData, this.filterText)
      } else {
        return this.treeData
      }
    },
    ExpressionDetail() {
      return this.getExpressionDetail(this.operatorCode)
    }
  },
  watch: {
    node: {
      handler(newValue, oldValue) {
        if (this.format.type === 'input') {
          this.vInputValue = newValue.paramValue[this.format.paramId]
        }
      }
    },
    vInputValue: {
      async handler(newValue) {
        if (this.paramId) {
          // 表达式存值
          if (this.node.left && this.node.left.exprNode) {
            this.node.left.exprNode.paramValue[this.paramId] = newValue
          } else {
            this.node.paramValue[this.paramId] = newValue
          }
        } else {
          // 普通节点存值
          this.node.paramValue = newValue
        }
      },
      deep: true
    },
    // selectList: {
    //   handler(val) {
    //     if (val && val.length === 0) {
    //       this.vSelectValue = null;
    //     }
    //   }
    // },
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
    // vSelectValue: {
    //   handler(newValue) {
    //     if (!newValue) {
    //       if (this.paramId) {
    //         // 表达式存值
    //         this.node.paramValue[this.paramId] = null;
    //       } else {
    //         // 普通节点存值
    //         this.node.paramValue = null;
    //       }
    //     }
    //   }
    // }
  },
  created() {
    this.init()
    this.RETURN_TYPE = RETURN_TYPE
    this.remoteMethod()
    this.keys = Object.keys(this.node.paramValue)
    this.start = this.keys[0].toString()
    this.end = this.keys[this.keys.length - 1]
    // this.bomClassAndField()
  },
  mounted() {
    bus.$on('methodParamInputIconClick', val => {
      this.methodParamIconClick(val)
    })
  },
  methods: {
    filterData() {
      this.filteredTreeData = this.getFilteredTreeData
    },
    filterTreeData(nodes, searchText) {
      const filteredNodes = []
      nodes.forEach(node => {
        if (node.label.toLowerCase().includes(searchText.toLowerCase())) {
          filteredNodes.push(node)
        }
        if (node.children) {
          const filteredChildren = this.filterTreeData(node.children, searchText)
          if (filteredChildren.length > 0) {
            filteredNodes.push({
              ...node,
              children: filteredChildren
            })
          }
        }
      })
      return filteredNodes
    },
    adjustInputWidth() {
      const input = this.$refs.inputRef.$refs.input
      input.style.width = 'auto'
      const textWidth = input.scrollWidth + 5
      input.style.width = textWidth + 'px'
    },
    // 方法参数里的输入框后的加号被点击了
    inputIconClick(format) {
      const expNode = { 'operator': 'ADD', 'code': 'ADD', 'desc': '加', 'paramType': 'int,integer,double,float', 'element': 'input', 'units': null, 'label': '+', 'returnType': 'double', 'nodeType': 'CALCULATE' }
      const inputNode = { 'type': 'input', 'nodeType': 'CUSTOM', 'returnType': format.type, 'paramValue': '', 'methodParamInput': 'methodParamInput' }
      const oldValue = this.vInputValue.paramValue
      if ((this.vInputValue.paramValue === '' || this.vInputValue.paramValue !== '') && !Array.isArray(this.vInputValue)) {
        const oldInput = { 'type': 'input', 'nodeType': 'CUSTOM', 'returnType': format.type, 'paramValue': oldValue, 'methodParamInput': 'methodParamInput' }
        const newData = []
        newData.push(oldInput)
        newData.push(expNode)
        newData.push(inputNode)
        this.vInputValue = newData
      } else if (Array.isArray(this.vInputValue)) {
        const newData = [...this.vInputValue.paramValue]
        newData.splice(this.arrItemIndex + 1, 0, expNode)
        newData.splice(this.arrItemIndex + 2, 0, inputNode)
        this.vInputValue = newData
      }
    },
    // 括号后的加号被点击了
    bracketAfterInputIconClick(e) {
      bus.$emit('bracketAfterInputIconClick', { index: this.index, i: this.i, path: this.path, node: this.node, event: e })
    },
    // 方法中参数加号被点击了
    methodParamIconClick(data) {
      const expNode = { 'operator': 'ADD', 'code': 'ADD', 'desc': '加', 'paramType': 'int,integer,double,float', 'element': 'input', 'units': null, 'label': '+', 'returnType': 'double', 'nodeType': 'CALCULATE' }
      const inputNode = { 'type': 'input', 'returnType': this.format.type, 'nodeType': 'CUSTOM', 'paramValue': null, 'methodParamInput': 'methodParamInput' }
      if (!Array.isArray(this.vInputValue) && this.vInputValue.dataType === 'field') {
        const newData = []
        newData.push(this.vInputValue)
        newData.push(expNode)
        newData.push(inputNode)
        this.vInputValue = newData
      } else if (Array.isArray(this.vInputValue)) {
        const newData = [...this.vInputValue]
        newData.splice(data.arrItemIndex + 1, 0, expNode)
        newData.splice(data.arrItemIndex + 2, 0, inputNode)
        this.vInputValue = newData
      }
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
    async clickTemplate(data) {
      // this.$emit('clickTemplate', data)
      // if (data.node.nodeType === 'FIELD') {
      //   this.$emit('setCurrentKey', data.node)
      // } else {
      //   this.currentNode = data.node
      //   this.clickTemplateIndex = data.index
      //   // this.findMatchingItems(this.rootArray, data)
      //   // await this.handleField2(this.currentNode.left)
      //   this.showDropdown = !this.showDropdown
      //   this.contextMenuX = data.event.clientX
      //   this.contextMenuY = data.event.clientY
      //   const screenHeight = window.innerHeight
      //   this.divHeight = screenHeight - this.contextMenuY
      //   // if (this.showDropdown) {
      //   //   const list0 = this.CalculateList2.filter(item => !item.disabled)
      //   //   const list1 = this.CompareList2.filter(item => !item.disabled)
      //   //   const list2 = this.EXPRESSIONList2.filter(item => !item.disabled)
      //   //   this.dropdownMenuData = [...list0, ...list1, ...list2]
      //   // } else {
      //   //   this.dropdownMenuData = []
      //   // }
      // }
    },
    // 键盘删除
    handleKeyDown(event) {
      event.preventDefault()
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.vInputValue.paramValue = ''
      }
    },
    handleKeyPress(event) {
      event.preventDefault()
    },
    bomClassAndField() {
      const data = {
        bomBaseInfoId: store.state.bomBaseInfoId
      }
      bomClassAndField(data).then(res => {
        this.treeData = [res]
        // this.treeData[0].children.forEach((item, index) => {
        //   if (item.children) {
        //     item.children.forEach((item1, index1) => {
        //       if (item1.dataType === 'EXPRESSION') {
        //         const obj = {
        //           beforeParamType: item1.type,
        //           codeService: item1.codeService,
        //           expressionArray: item1.detailsList,
        //           expressionDesc: item1.label,
        //           expressionId: item1.path,
        //           returnType: item1.returnType,
        //           dataType: item1.dataType
        //         }
        //         // 从本地存储中获取原有数据
        //         const existingData = JSON.parse(localStorage.getItem('IdExpressionList'))
        //         // 修改原有数据或添加新数据
        //         existingData[(obj.expressionId).toUpperCase()] = (obj)
        //         // 更新本地存储中的数据
        //         localStorage.setItem('IdExpressionList', JSON.stringify(existingData))
        //       }
        //     })
        //   }
        // })
      })
    },
    inputBlur(e) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
    },
    rightClick(e) {
      if (!this.treeData) {
        this.bomClassAndField()
      }
      this.structure = 1
      this.isContextMenuVisible = true
      this.contextMenuX = e.clientX
      this.contextMenuY = e.clientY
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
    findObjectByPath(data, path) {
      for (const obj of data) {
        if (obj.path === path) {
          return obj
        }
        if (obj.children) {
          const result = this.findObjectByPath(obj.children, path)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    addParamsFn() {
      // 此处处理输入框插入字段或方法
      this.vInputValue = ''
      this.showText = true
      this.dialogVisible = false
      this.isContextMenuVisible = false
      const checkNode = this.$refs['cascaderPanel'].getCheckedNodes()[0].data
      const _ = require('lodash')
      const treeDataCopy = _.cloneDeep(this.treeData)
      const parentLabel = this.findParentLabel(treeDataCopy, checkNode.fieldPath)
      const result = parentLabel.join('的')
      const txt = this.vInputValue
      const newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
      checkNode.text = result
      const treeDataCopy1 = _.cloneDeep(this.treeData)
      const pathSegments = checkNode.path.split('.') // 将path按"."分割成数组
      pathSegments.pop()
      const path = pathSegments.join('.')
      const parentData = this.findObjectByPath(treeDataCopy1, path)
      const newFieldPath = checkNode.fieldPath.split('.')
      let newFieldPath2
      if (parentData.fieldPath) {
        newFieldPath2 = parentData.fieldPath.split('.')
      }
      checkNode.nodeType = checkNode.dataType.toUpperCase()
      if (checkNode.dataType === 'method') {
        const paramValue = {}
        if (checkNode.detailsList) {
          checkNode.detailsList.forEach((item) => {
            paramValue[item.paramId] = ''
          })
        }
        const result1 = checkNode.fieldPath.replace(/\(|\)/g, '')
        const field = {
          ...checkNode,
          returnType: checkNode.type,
          nodeType: 'METHOD',
          classPath: checkNode.classPath,
          methodPath: result1,
          path: checkNode.path,
          expressionId: checkNode.path,
          methodName: checkNode.label,
          paramValue: paramValue,
          expressionArray: checkNode.detailsList
        }
        this.vInputValue = field
      } else if (parentData.dataType === 'method') {
        newFieldPath.splice(0, newFieldPath2.length)
        let needFieldPath
        if (newFieldPath.length === 1) {
          needFieldPath = newFieldPath[0]
        } else if (newFieldPath.length > 1) {
          newFieldPath.forEach((item, index) => {
            if (index === newFieldPath.length - 1) {
              needFieldPath += item
            } else {
              needFieldPath += item + '.'
            }
          })
        }
        const _ = require('lodash')
        const treeDataCopy = _.cloneDeep(this.treeData)
        const pathSegments = checkNode.path.split('.') // 将path按"."分割成数组
        // 删除数组的最后一个元素
        pathSegments.pop()
        // 将剩下的元素按顺序用"."拼接起来
        const path = pathSegments.join('.')
        const parentData = this.findObjectByPath(treeDataCopy, path)
        if (parentData.dataType === 'method') {
          checkNode.fieldPath = pathSegments[pathSegments.length - 1]
          const paramValue = {}
          parentData.detailsList.forEach((item) => {
            paramValue[item.paramId] = ''
          })
          parentData.fieldPath = parentData.fieldPath.slice(0, -2)
          const parentLabel = this.findParentLabel(treeDataCopy, parentData.fieldPath)
          const result = parentLabel.join('的')
          const insertMethod = {
            ...checkNode,
            fieldPath: needFieldPath,
            nodeType: checkNode.dataType.toUpperCase(),
            returnType: checkNode.type,
            methodParamField: 'methodparamField',
            exprNode: {
              nodeType: 'METHOD',
              classPath: parentData.classPath,
              expressionId: parentData.path,
              methodPath: parentData.fieldPath,
              path: parentData.path,
              methodName: result,
              returnType: parentData.type,
              paramValue: paramValue,
              expressionArray: parentData.detailsList
            }
          }
          this.vInputValue = insertMethod
        }
      } else {
        checkNode.methodField = 'METHOD_FIELD'
        this.vInputValue = checkNode
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
    },
    onChangeSelect(value) {
      let arr = []
      if (
        this.format.type === 'selector-multiple' ||
            this.format.type === 'selector'
      ) {
        // 多选
        arr = value
      }

      if (this.paramId) {
        // 表达式存值
        this.node.paramValue[this.paramId] = arr
      } else {
        // 普通节点存值
        this.node.paramValue = arr
      }
      this.$emit('changeSelect', arr)
    },
    init() {
      let value = null
      if (this.paramId) {
        // 表达式存值
        if (this.node.left && this.node.left.exprNode) {
          value = this.node.left.exprNode.paramValue[this.paramId]
        } else {
          value = this.node.paramValue[this.paramId]
        }
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
        if (typeof value === 'string') {
          this.vInputValue = {
            paramValue: value,
            returnType: this.format.type,
            type: 'input',
            nodeType: 'CUSTOM'

          }
        }
        if (this.format.type === 'date') {
          this.vInputValue = new Date(value)
        }
        if (value.type === 'input') {
          this.vInputValue = value
        }
        if (value.nodeType === 'FIELD' || value.nodeType === 'METHOD') {
          this.vInputValue = value
        }
      }
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
