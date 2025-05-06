<template>
  <div v-loading="initLoading" class="excel-container">
    <!-- <el-dialog :title="title" :visible.sync="editPreviewExcel" custom-class="excel-container" width="90%" append-to-body @close="$emit('update:editPreviewExcel', false)"> -->
    <!-- <div ref="preview" class="excel-container" /> -->
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
    >
      <!-- <el-dialog
          width="30%"
          title="请输入内容"
          :visible.sync="logicalOperFlag"
          append-to-body
        >
          <el-input v-model="logicalOperMain" autocomplete="off" @blur="changeLogicalOperMain()" />
        </el-dialog> -->
      <div class="formItemDiv">
        <el-form-item
          :label="$t('decisionTable.decisionTableName')"
          prop="label"
        >
          <el-input v-model="ruleForm.label" autocomplete="off"/>
        </el-form-item>
      </div>
      <div class="formItemDiv">
        <el-form-item
          :label="$t('ruleSetting.path')"
          disabled
        >
          <el-input v-model="currentNodePath" disabled autocomplete="off"/>
        </el-form-item>
      </div>
      <div style="display: flex">

        <el-form-item
          prop="annotation"
          :rules="[
          { min: 0, max:50, message: '请选择属性标签' }
        ]"
          label="属性标签"
        >
          <el-cascader
            style="width: 300px;margin-right: 20px"
            v-model="ruleForm.ruleAttributeTags"
            :options="groupList"
            :props="{ expandTrigger: 'hover',multiple: true,emitPath: false }"></el-cascader>
        </el-form-item>
        <el-form-item
          prop="annotation"
          :rules="{ min: 0, max:50, message: '请输入备注' }"
          label="备注"
        >
          <el-input v-model="ruleForm.annotation" type="text" style="width: 400px;"/>
        </el-form-item>
      </div>
      <el-form-item class="add-decision-table-item">
        <div class="title">
          <span>前置规则</span>
          <el-tooltip class="item" effect="dark"
                      content="增加前置规则情况下，决策表在执行前置规则通过后再执行，如前置规则执行未通过则不再执行该决策表"
                      placement="top">
            <!-- <i class="el-icon-info" style="margin-left: 6px;color: #0079FF;"></i> -->
          </el-tooltip>
        </div>
        <div>
          <div class="rule-preview">
            <div class="rule-wrap">
              <div class="rule-view">
                <span class="value">如果：</span>
                <span class="value valueContent" style="word-break: break-all;" v-html="rule.ruleDesc || '-'"/>
              </div>
              <el-button v-if="type === 'add'" type="text" size="small" @click="addDecisionRule">新增规则</el-button>
              <el-button v-else type="text" size="small" @click="addDecisionRule">编辑规则</el-button>
              <el-button type="text" size="small" @click="delDecisionRule">删除规则</el-button>
            </div>
          </div>
          <el-input v-model="ruleForm.rule" type="hidden" style="display: none;"/>
        </div>
      </el-form-item>
      <!-- <div class="add-decision-table-item mb-30">
          <div class="title mt-10 mb-15">
            <span>前置规则</span>
            <el-tooltip class="item" effect="dark" content="增加前置规则情况下，决策表在执行前置规则通过后再执行，如前置规则执行未通过则不再执行该决策表" placement="top">
              <i class="el-icon-info" style="margin-left: 6px;color: #0079FF;"></i>
            </el-tooltip>
          </div>
          <el-form-item prop="rule">
            <div v-if="isAdd && !ruleForm.rule">
              <el-button @click="addDecisionRule" style="width: 20%;min-width: 150px;">新增决策规则</el-button>
            </div>
            <div v-else class="rule-preview">
              <el-button @click="addDecisionRule" type="text">新增决策规则</el-button>
              <div class="rule-wrap">
                <div class="rule-view">
                  <span class="value">如果：</span>
                  <br>
                  <div class="value valueContent" style="word-break: break-all;" v-html="rule.ruleDesc" />
                </div>
              </div>
            </div>
            <el-input v-model="ruleForm.rule" type="hidden" style="display: none;"></el-input>
          </el-form-item>
        </div> -->
    </el-form>
    <div class="add-decision-table-item">
      <div class="title mt-10 mb-15 required">决策表内容</div>
      <GuidRuleTableEditor v-if="tableType === 'new'" ref="ruleTableEditor" v-model="initLoading"
                           v-bind="{ status: type, bomBaseInfoId, tableData, predefineTreeData,row }"/>
      <template v-if="tableType === 'old'">
        <el-table
          :data="tableData"
          :show-header="true"
          :cell-class-name="tableRowClassName"
          :border="true"
          style="width: 100%"
        >
          <el-table-column type="index" width="60" label="index" align="center">
            <template scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <template
            v-for="(item,index) in tableData[0]"
          >
            <el-table-column
              :key="index"
              :prop="index"
              min-width="150"
              :label="index"
            >
              <template slot="header" slot-scope="scope">
                {{ getColumnIndex(scope.column.index) }}
              </template>
              <template slot-scope="scope">
                <div
                  @contextmenu="(data) => { rightTemplate( data,scope) }"
                >
                  <div
                    v-if="scope.$index === 0"
                  >
                    <el-cascader
                      :ref="'cascader'+index"
                      v-model="scope.row[index][0]"
                      popper-class="add-descision-table-path-cascader"
                      :show-all-levels="false"
                      clearable
                      filterable
                      :placeholder="scope.row[index][0]"
                      :options="bomBaseData[0].children"
                      :props="{value:'fieldPath',label:'label',emitPath:true,checkStrictly: true}"
                      :rules="[
                        { required: true, message: '请选择字段', trigger: 'blur' },]"
                      @change="(data) => $nextTick(() => handleChange(index, data))"
                    />
                  </div>
                  <el-select
                    v-else-if="scope.$index === 1"
                    v-model="scope.row[index]"
                    clearable
                    filterable
                    :rules="[
                      { required: true, message: '请选择表达式', trigger: 'blur' },]"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                  <el-input v-else v-model="scope.row[index]"/>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div style="margin-bottom: 6px;">
          <el-button type="text" size="small" @click="addColumn">添加列</el-button>
          <el-button type="text" size="small" @click="addLine">添加行</el-button>
        </div>
      </template>
    </div>
    <!-- <div class="btnDiv">
        <el-button
          class="btn-background mini"
          type="primary"
          @click="saveTable"
        >保存</el-button>
      </div> -->
    <!-- 下拉菜单 点击运算符或表达式修改原有的 -->
    <div
      v-if="isContextMenuVisible"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      class="menuBox"
    >
      <div class="context-menu">
        <div class="funBtn" @click="delData(0)">删除列</div>
        <div class="funBtn" @click="addData(-1)">向左插入列</div>
        <div class="funBtn" @click="addData(0)">向右插入列</div>
        <!-- <div class="funBtn" @click="logicalOper()">逻辑运算</div> -->
        <div v-if="clickScope.$index > 1" class="funBtn" @click="delData(1)">删除行</div>
        <div v-if="clickScope.$index > 1" class="funBtn" @click="addRowData(0)">向上插入行</div>
        <div v-if="clickScope.$index > 0" class="funBtn" @click="addRowData(1)">向下插入行</div>
      </div>
    </div>
    <!-- </el-dialog> -->
    <RuleEditorDialog v-if="ruleEditorDialogVisible" v-model="ruleEditorDialogVisible"
                      v-bind="{ rule, add: type === 'add' }" @submitRule="addPreRule" @changeEditPage="changeEditPage"/>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import axios from 'axios'
import store from '@/store'
import {checkPredefine} from '@/api/mainPages/decision'
import {bomClassAndField} from '@/api/systemManage/bom'
import {saveRuleDefinedEdit, saveOrUpdatePredefine, getPredefineByRuleId} from '@/api/mainPages/decision'
import {
  decisionTableEdit,
  addDecisionTableWithRule,
  addNewDecisionTableWithRule,
  getDecisionTableCondition,
  getRuleDefinedByTableId,
  viewDecisionTableWithRule,
  getDecisionTableVersion
} from '@/api/mainPages/decision-table'
import RuleEditorDialog from './RuleEditorDialog.vue'

import {getRuleSettingId} from '@/api/systemManage/rule-manage'
import {getGroupTagList} from "@/views/systemManage/management/api";

export default {
  // eslint-disable-next-line vue/require-prop-types
  components: {
    RuleEditorDialog
  },
  props: {
    type: String,
    // editPreviewExcel: {
    //   type: Boolean,
    //   default: false
    // },
    decisionData: {
      type: Object,
      default: {}
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    decisionTableId: {
      type: String,
      default: ''
    },
    currentNodePath: {
      type: String,
      default: ''
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    decisionRepCatalogueId: {
      type: String,
      default: ''
    },
    decisionDataLabel: {
      type: String,
      default: ''
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    },
    bomBaseData: {
      type: Array,
      default: null
    },
    ruleId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: [],
      jsonData: [],
      indexArray: [],
      fields: [],
      treeData: [],
      predefineTreeData: [],
      options: [],
      groupList: [],
      addLabel: 0,
      titleData: {},
      title: '新增决策表',
      fieldIndex: [],
      isContextMenuVisible: false,
      clickScope: {},
      contextMenuX: null,
      contextMenuY: null,
      ruleForm: {label: '', path: '', rule: '', annotation: '', ruleAttributeTags: []},
      rules: {
        label: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '请输入路径', trigger: 'blur'}
        ],
        rule: {required: true, message: '请添加前置规则', trigger: 'blur'}
      },
      fromCharCodeArr: [],
      initLoading: true,
      logicalOperFlag: false,
      logicalOperMain: '',
      ruleEditorDialogVisible: false,
      rule: {
        id: null, // id
        ruleTips: null, // 提示
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleId: this.ruleId, // 规则id
        predefineText: null,
        editPredefineText: null,
        predefine: null
      },
      tableType: 'new',
      row: null,
      predefine: {}
      // tableHeadData: [],
    }
  },
  computed: {},
  watch: {
    // bomBaseData: {
    //   handler(nVal) {
    //     if (nVal && nVal.length) {
    //       this.tableHeadData.push(nVal[0])
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {

    if (this.type !== 'add') {
      // this.getData()
      this.getDecisionTableVersion()
      // this.getNewTableData()
      // this.getRuleData()
      this.ruleForm.label = this.decisionDataLabel
      this.ruleForm.ruleAttributeTags = this.decisionData.ruleAttributeTags
      this.ruleForm.annotation = this.decisionData.annotation
      this.title = '修改决策表'
    }
    this.getGroupTagListFn()
  },
  mounted() {
    window.addEventListener('click', this.otherClose)
    this.columnIndex()
  },
  beforeDestroy() {
    /* 组件销毁的时候要移除侦听器 */
    window.removeEventListener('click', this.otherClose)
  },
  methods: {
    getGroupTagListFn() {
      getGroupTagList().then((res) => {
        this.groupList = res.resp.map(group => ({
          label: group.tagGroupName,       // 一级选项的 label
          value: group.tagGroupId,         // 一级选项的 value
          children: group.ruleAttributeTagInfos.map(tag => ({
            label: tag.attributeName,      // 二级选项的 label
            value: tag.tagId               // 二级选项的 value
          }))
        }))
      })
    },
    addDecisionRule() {
      this.ruleEditorDialogVisible = true
    },
    delDecisionRule() {
      this.ruleForm.rule = ''
      this.rule = {
        id: null, // id
        ruleTips: null, // 提示
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleId: null, // 规则id
        predefineText: null
      }
    },
    changeEditPage() {
      this.ruleEditorDialogVisible = false
    },
    async addPreRule(ruleContent, ruleDesc, thenList, elseList, predefine) {
      this.ruleForm.rule = ruleDesc
      this.rule.ruleContent = JSON.stringify(ruleContent)
      this.predefine = predefine
      this.rule.ruleDesc = ruleDesc
      this.rule.predefineText = predefine.content
      this.rule.editPredefineText = predefine.content
      this.ruleEditorDialogVisible = false
      if (predefine.content) {
        const data1 = {
          bomBaseInfoId: predefine.bomBaseInfoId,
          content: predefine.content
        }
        try {
          await checkPredefine(data1).then(res => {
            this.predefineTreeData = res
          })
        } catch (error) {
          this.$message.error(error)
        }
      }
      console.log(this.rule)
      if (!this.rule.ruleId) {
        this.rule.ruleId = await getRuleSettingId()
      }
      const predefineQuery = {
        ruleId: this.rule.ruleId,
        content: this.predefine.content,
        predefineId: this.predefine.predefineId,
        bomBaseInfoId: this.bomBaseInfoId
      }
      saveOrUpdatePredefine(predefineQuery)
    },
    addColumn() {
      const currentColumns = Object.keys(this.tableData[0])
      const lastColumn = currentColumns[currentColumns.length - 1]
      const letters = lastColumn.match(/[a-z]/i)[0]
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.$set(item, currentColumns.length + letters, [])
        } else {
          this.$set(item, currentColumns.length + letters, '')
        }
      })
      this.$forceUpdate()
    },
    addLine() {
      const newObj = {}
      for (const key in this.tableData[0]) {
        newObj[key] = ''
      }
      this.tableData.push(newObj)
      // this.$set(this.tableData, newObj, '')
      // const currentColumns = Object.keys(this.tableData[0])
      // const lastColumn = currentColumns[currentColumns.length - 1]
      // const letters = lastColumn.match(/[a-z]/i)[0]
      // this.tableData.forEach((item, index) => {
      //   if (index === 0) {
      //     this.$set(item, currentColumns.length + letters, [])
      //   } else {
      //     this.$set(item, currentColumns.length + letters, '')
      //   }
      // })
      // this.$forceUpdate()
    },
    getColumnIndex(index) {
      let num = ''
      if (index > 26) {
        num += this.fromCharCodeArr[parseInt((index - 1) / 26) - 1] + '' + this.fromCharCodeArr[index - 27]
      } else {
        num += this.fromCharCodeArr[index - 1]
      }
      return num
    },
    columnIndex() {
      this.fromCharCodeArr = []
      Array(26).fill('').map((item, index) => {
        this.fromCharCodeArr.push(String.fromCharCode(index + 65))
      })
    },
    // 自定义行号
    indexMethod(index) {
      const thisIndex = index + 1
      return thisIndex
    },
    // 关闭弹窗
    otherClose(event) {
      const tp = document.querySelector('.menuBox')
      if (tp) {
        if (!tp.contains(event.target)) {
          this.isContextMenuVisible = false
        }
      }
    },
    // 右键点击
    rightTemplate(data, scope) {
      event.preventDefault()
      this.isContextMenuVisible = true
      this.contextMenuX = data.clientX
      this.contextMenuY = data.clientY
      this.clickScope = scope
    },
    getList() {
      getDecisionTableCondition().then(res => {
        res.forEach((item, index) => {
          const obj = {'label': item}
          this.options.push(obj)
        })
        // this.options = res
      })
    },
    getRuleData() {
      const params = {
        tableId: this.decisionTableId
      }
      getRuleDefinedByTableId(params).then(res => {
        if (!res) return
        res.codeServices = (res.codeServices || '').toString()
        this.ruleForm.rule = res.ruleDesc
        this.rule = res
        console.log(this.predefine)
        console.log(res)
        if (res.predefineDTO) {
          this.predefine.predefineId = res.predefineDTO.predefineId
          this.predefine.content = res.predefineDTO.content
          this.rule.editPredefineText = res.predefineDTO.content
        }
        console.log(this.predefine)
        getPredefineByRuleId(this.rule.ruleId).then(res => {
          this.rule.editPredefineText = res.content
          this.predefine.content = res.content
          this.predefine.predefineId = res.predefineId
        })
      })
    },
    //   保存
    saveTable() {
      if (this.tableType === 'old') {
        let isEdit = true
        this.tableData.forEach((item, index) => {
          Object.values(item).forEach(objV => {
            if (index === 0 && objV.length === 0) {
              isEdit = false
            }
            if (index === 1 && !objV) {
              isEdit = false
            }
          })
        })
        if (!isEdit) {
          alert('选择字段和表达式!')
          return
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.saveDecisionTable()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        Promise.all([
          this.$refs.ruleForm.validate(),
          // this.$refs.ruleTableEditor.validate()
        ]).then(res => {
          this.addNewDecisionTableWithRule()
        }).catch(err => {
          console.log('error submit!!')
        })
      }
    },
    async saveDecisionTable() {
      let ruleId = null
      if (this.rule.ruleId) {
        ruleId = this.rule.ruleId
      } else {
        ruleId = await getRuleSettingId()
      }
      const paramsTable1 = this._.cloneDeep(this.tableData)
      const paramsTable = []
      paramsTable1.forEach((item, index) => {
        const list = []
        Object.keys(item).forEach(key => {
          let obj
          const value = item[key]
          if (Array.isArray(value)) {
            const arrObj = this.titleData[key]
            obj = {
              cellValue: this.getTitleName(value),
              cellType: arrObj && arrObj.length > 0 && arrObj[arrObj.length - 1].fieldType,
              fieldPath: arrObj && arrObj.length > 0 && arrObj[arrObj.length - 1].fieldPath,
              fieldMapping: this.titleData[key]
            }
          } else {
            obj = {'cellValue': value, 'fieldPath': '', 'cellType': ''}
          }
          list.push(obj)
        })
        paramsTable.push(list)
      })
      if (this.rule.predefineDTO) {
        this.rule.predefineDTO.bomBaseInfoId = this.bomBaseInfoId
      }
      const data = {
        decisionTableEditDTO: {
          cells: paramsTable,
          decisionRepCatalogueId: this.decisionRepositoryId,
          path: this.currentNodePath,
          decisionTableId: this.isAdd ? '' : this.decisionTableId,
          decisionTableName: this.ruleForm.label,
          annotation: this.ruleForm.annotation,
          ruleAttributeTags: this.ruleForm.ruleAttributeTags,
          operate: this.isAdd ? '1' : '2'
        },
        ruleDefinedEdit: {
          decisionRepCatalogueId: this.decisionRepCatalogueId,
          decisionRepositoryId: this.decisionRepositoryId,
          path: this.currentNodePath,
          decisionTableId: this.isAdd ? '' : this.decisionTableId,
          ...this.rule,
          codeServices: this.rule.codeServices ? [this.rule.codeServices] : [],
          ruleId
        },
        decisionRepositoryId: this.decisionRepositoryId
      }

      // decisionTableEdit(data).then(res => {
      //   this.$emit('update:editPreviewExcel', false)
      //   this.$emit('addSucess')
      // }).catch(err => {})
      addDecisionTableWithRule(data).then(res => {
        this.$emit('update:editPreviewExcel', false)
        this.$emit('addSuccess')
      }).catch(err => {
      })
    },
    async addNewDecisionTableWithRule() {
      var ruleId = null
      console.log(this.rule)
      if (this.rule.ruleId) {
        ruleId = this.rule.ruleId
      } else {
        ruleId = await getRuleSettingId()
      }

      const {dtDetailList, fieldPathMappings} = this.$refs.ruleTableEditor.saveTableData()

      const data = {
        bomBaseInfoId: this.bomBaseInfoId,
        decisionRepCatalogueId: this.decisionRepCatalogueId || this.copyDecisionRepCatalogueId,
        decisionRepositoryId: this.decisionRepositoryId,
        decisionTableId: this.type === 'view' ? '' : this.decisionTableId,
        decisionTableName: this.ruleForm.label,
        annotation: this.ruleForm.annotation,
        ruleAttributeTags: this.ruleForm.ruleAttributeTags,
        path: this.currentNodePath,
        dtDetailList,
        fieldPathMappings,
        ruleDefinedEdit: {
          decisionRepCatalogueId: this.decisionRepCatalogueId || this.copyDecisionRepCatalogueId,
          decisionRepositoryId: this.decisionRepositoryId,
          path: this.currentNodePath,
          decisionTableId: this.type === 'view' ? '' : this.decisionTableId,
          ...this.rule,
          codeServices: this.rule.codeServices ? [this.rule.codeServices] : [],
          ruleId
        }
      }
      console.log(dtDetailList)
      console.log(this.predefine)
      // const predefineQuery = {
      //   ruleId: ruleId,
      //   content: this.predefine.content,
      //   predefineId: this.predefine.predefineId,
      //   bomBaseInfoId: this.bomBaseInfoId
      // }
      // saveOrUpdatePredefine(predefineQuery).then(res => {

      // })
      addNewDecisionTableWithRule(data).then(res => {
        // saveOrUpdatePredefine(this.predefine)
        this.$emit('update:editPreviewExcel', false)
        this.$emit('addSuccess')
      }).catch(err => {
      })
    },
    getTitleName(item) {
      let text = ''
      item.forEach((iitem, iindex) => {
        iitem ? text += iitem : ''
        if (iindex !== item.length - 1) {
          text += '_'
        }
      })
      return text
    },
    //   删除列
    delData(num) {
      if (num === 0) {
        const table = this._.cloneDeep(this.tableData)
        table.forEach((item, index) => {
          const fItem = {...item}
          Object.keys(item).forEach((key, keyI) => {
            if (String(key) === this.clickScope.column.label) {
              delete fItem[key]
            }
          })
          table[index] = fItem
          this.tableData = [...table]
          this.isContextMenuVisible = false
        })
      } else {
        this.tableData.splice(this.clickScope.$index, 1)
      }
    },
    // 添加列数据
    addData(num) {
      this.addLabel += 1
      this.tableData.forEach((item, index) => {
        this.$set(this.tableData, index, this.spliceItem(item, (Number(this.clickScope.column.index) + num), index))
      })
      this.isContextMenuVisible = false
    },
    // 逻辑运算
    logicalOper() {
      this.logicalOperFlag = true
    },
    // 逻辑运算赋值
    changeLogicalOperMain() {
      // if (this.tableData[0]['key']) {
      //   this.$set(this.tableData[0]['key'], 0, this.logicalOperMain)
      // } else if (this.tableData[0][this.clickScope.column.index - 1 + 'b']) {
      //   this.$set(this.tableData[0][this.clickScope.column.index - 1 + 'b'], 0, this.logicalOperMain)
      // }
      // this.logicalOperMain = ''
      this.tableData[0].forEach((item) => {
        console.log(item)
      })
    },
    // 添加行
    addRowData(num) {
      const obj = {}
      Object.keys(this.tableData[0]).forEach(item => {
        obj[item] = ''
      })
      this.tableData.splice(this.clickScope.$index + num, 0, obj)
    },
    spliceItem(item, index, tableIndex) {
      const key = this.addLabel + 'a'
      const obj = {}
      if (tableIndex === 0) {
        obj[key] = []
      } else {
        obj[key] = ''
      }
      const arr = []
      for (const i in item) {
        const o = {}
        o[i] = item[i] // 即添加了key值也赋了value值 o[i] 相当于o.name 此时i为变量
        arr.push(o)
      }
      arr.splice(index, 0, obj)
      const result = {}
      arr.forEach((item1) => {
        result[Object.keys(item1)[0]] = Object.values(item1)[0]
      })
      return result
    },
    tableRowClassName({row, column, rowIndex, columnIndex}) {
      // 把每一行的索引放进row,和index
      column.index = columnIndex
    },
    //   表头
    handleChange(index) {
      const text = 'cascader' + index
      const data = this.$refs[text][0] && this.$refs[text][0].getCheckedNodes()[0]
      this.titleData[index] = []
      if (data) {
        if (data.parent) {
          this.titleData[index] = this.getParent(data.parent)
        }
        this.titleData[index].push({
          fieldPath: data.data.path,
          fieldType: data.data.type,
          fieldName: data.data.label
        })
      } else {
        this.titleData[index] = [{
          fieldPath: '',
          fieldType: '',
          fieldName: ''
        }]
      }
    },
    getParent(parentData) {
      const arr = []
      arr.unshift({
        fieldPath: parentData.data.fieldPath,
        fieldName: parentData.data.label,
        fieldType: parentData.data.type
      })
      if (parentData.parent) {
        const arr2 = this.getParent(parentData.parent)
        arr.unshift(...arr2)
      }
      return arr
    },
    defaultData() {
      const key = this.addLabel + 'a'
      this.tableData.push({key: []}, {key: ''}, {key: ''})
      this.addLabel += 1
    },
    getData() {
      this.tableData = []
      this.titleData = {}
      if (this.isAdd) {
        this.defaultData()
        return
      }
      this.initLoading = true
      let binary = ''
      axios.get(this.url + '?type=edit', {
        headers: {'adp-token': this.$store.state.user.token},
        responseType: 'arraybuffer' // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'，默认是'json'
      })
        .then(res => {
          this.loading = false
          var bytes = new Uint8Array(res.data)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var wb = XLSX.read(binary, {type: 'binary'})
          var wsname = wb.SheetNames[0]
          var ws = wb.Sheets[wsname]
          this.jsonData = XLSX.utils.sheet_to_json(ws)
          const obj = {}
          //   this.tableData = [...this.jsonData]
          Object.keys(this.jsonData[0]).forEach((key, index) => {
            let text1 = ''
            if (key.substr(key.length - 2, 1) === '_') {
              text1 = key.substring(0, key.length - 2)
            } else {
              text1 = key
            }
            obj[index + 'b'] = text1.split('_')
            this.fieldIndex.push(index + 'b')
          })
          this.tableData.push(obj)
          this.jsonData.forEach((item, index) => {
            const obj2 = {}
            Object.values(item).forEach((value, index1) => {
              obj2[index1 + 'b'] = value
            })
            delete obj2['index']
            this.tableData.push(obj2)
          })
          console.log(this.tableData)

          this.$nextTick(() => {
            this.fieldIndex.forEach(item => {
              this.handleChange(item)
            })
          })
          //   var HTML = XLSX.utils.sheet_to_html(ws)
          //   if (this.$refs.preview) {
          //     this.$refs.preview.innerHTML = HTML
          //   }
          console.log(1)
          this.initLoading = false
        }).catch((e) => {
        console.log(2)
        this.initLoading = false
      })
    },
    getDecisionTableVersion() {
      const params = {
        decisionTableId: this.decisionTableId
      }
      getDecisionTableVersion(params).then(res => {
        if (res.resp === '1') {
          this.tableType = 'new'
          this.getNewTableData()
        } else {
          this.tableType = 'old'
          this.getList()
          this.getData()
          this.getRuleData()
        }
      })
    },
    getNewTableData() {
      const params = {
        decisionTableId: this.decisionTableId
      }
      viewDecisionTableWithRule(params).then(res => {
        if (res.success) {
          res = res.resp
          if (res) {
            // console.log(res)
            // console.log(res.decisionTableComplexHeaderContentDTOList[0].columns[res.decisionTableComplexHeaderContentDTOList[0].columns.length - 1][0].rowNum)
            // this.row = res.decisionTableComplexHeaderContentDTOList[0].columns[res.decisionTableComplexHeaderContentDTOList[0].columns.length - 1][0].rowNum - 2

            this.copyDecisionRepCatalogueId = res.decisionRepCatalogueId || ''
            this.tableData = res.decisionTableComplexHeaderContentDTOList

            if (res.ruleDefinedEdit) {
              res.ruleDefinedEdit.codeServices = (res.ruleDefinedEdit.codeServices || '').toString()
              this.ruleForm.rule = res.ruleDefinedEdit.ruleDesc || ''
              this.rule = res.ruleDefinedEdit || ''

              this.predefine.predefineId = res.ruleDefinedEdit.predefineDTO.predefineId
              this.predefine.content = res.ruleDefinedEdit.predefineDTO.rulePreDefineDesc
              getPredefineByRuleId(res.ruleDefinedEdit.ruleId).then(res => {
                this.rule.editPredefineText = res.content
                this.initLoading = false
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.excel-container {
  width: 100%;
  // .add-decision-table-item {
  //   .title {
  //     line-height: 20px;
  //     &::before {
  //       content: '';
  //       display: inline-block;
  //       background: #0079FF;
  //       width: 3px;
  //       height: 16px;
  //       margin-bottom: -3px;
  //       margin-right: 8px;
  //     }
  //   }
  // }
  table {
    table-layout: fixed !important;
    width: 100% !important;
    border-collapse: collapse;
    border: none;
    font-size: 0.23rem;
  }

  tr:first-child {
    td {
      font-weight: bold;
      color: #333;
      background: #f5f7fa;
      padding: 8px 5px;
    }
  }

  td, th {

  }
}
</style>
<style lang='scss' scoped>
.excel-container table {
  border-collapse: collapse;
}

.excel-container td, th {
  border: solid #ddd 1px;
  padding: 5px;
  white-space: nowrap; /* 自适应宽度*/
  word-break: keep-all; /* 避免长单词截断，保持全部 */
  white-space: pre-line;
  word-break: break-all !important;
  word-wrap: break-word !important;
  text-align: center;
  display: table-cell;
  vertical-align: middle !important;
  white-space: normal !important;
  height: auto;
  vertical-align: text-top;
  color: #666;
}

.symbolTitle {
  color: blue;
  font-weight: 700;
}

.symbol {
  color: blue;
}

.menuBox {
  position: fixed;
  background: #fafdff;
}

.context-menu {
  // width:400px;
  // height:700px
  border: 1px solid #0079FF;
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

.btnDiv {
  margin-top: 15px;
  text-align: center;
}

.formItemDiv {
  width: 49.5%;
  display: inline-block;

  &:first-child {
    margin-right: 1%
  }
}
</style>

<style lang="scss">
.add-descision-table-path-cascader {
  .el-cascader-menu__list {
    max-width: 350px;
  }
}
</style>
