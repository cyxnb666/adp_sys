<template>
  <el-dialog custom-class="preview-decision-table-dialog" :title="title" :visible.sync="dialogTableVisible" width="90%" append-to-body @close="$emit('update:showPreviewExcel', false)" @open="openDialog">
    <div v-loading="initLoading" class="excel-container-edit">
      <div class="add-descision-table-item mb-30" prop="rule">
        <div class="title mb-15">
          <span>前置规则</span>
        </div>
        <div>
          <div class="rule-preview">
            <div class="rule-wrap">
              <div class="rule-view">
                <span class="value">如果：</span>
                <span class="value valueContent" style="word-break: break-all;" v-html="rule || '-'" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div ref="preview" class="excel-container" /> -->
      <div class="title mb-15">
        <span>决策表内容</span>
      </div>
      <GuidRuleTableEditor v-if="tableType === 'new'" v-model="initLoading" v-bind="{ tableData, bomBaseInfoId, disabled: type === 'view' }" />
      <el-table
        v-if="tableType === 'old'"
        v-loading="initLoading"
        :data="tableData"
        :show-header="false"
        :border="true"
        :span-method="spanMethod"
        :style="{width:'100%'}"
        :cell-style="changeColor"
        :before-close="handleCloseDialog"
      >
        <template
          v-for="(item,index) in tableData[0]"
        >
          <el-table-column
            :key="index"
            :prop="index"
            :label="index"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" :disabled="scope.$index===0 || scope.$index===1">
                <div style="font-weight:600;" v-html="popoverContent(scope.$index)" />
                <div slot="reference" type="text">{{ scope.row[index] }}</div>
              </el-popover>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import XLSX from 'xlsx'
import axios from 'axios'
import { isArray } from 'util'
import { getRuleDefinedByTableId, viewDecisionTableWithRule, getDecisionTableVersion } from '@/api/mainPages/decision-table'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['url', 'showPreviewExcel', 'title', 'decisionTableId', 'bomBaseInfoId', 'type'],
  data() {
    return {
      dialogTableVisible: this.showPreviewExcel,
      tableData: [],
      jsonData: [],
      indexArray: [],
      fields: [],
      changeColorIndex: [],
      initLoading: true,
      rule: '',
      tableType: ''
    }
  },
  computed: {

  },
  watch: {
    showPreviewExcel(val) {
      this.dialogTableVisible = val
    }
  },
  created() {
    this.getDecisionTableVersion()
    if (this.decisionTableId) this.getRuleDefinedByTableId()
  },
  methods: {
    // 关闭弹窗
    handleCloseDialog() {
      this.changeColorIndex = []
      this.dialogTableVisible = false
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 当前行的数据
      const cellValue = row[column.property]
      // 判断只合并定义字段的列数据
      if (cellValue && this.fields.includes(column.property)) {
        const prevRow = this.tableData[rowIndex - 1] // 上一行数据
        let nextRow = this.tableData[rowIndex + 1] // 下一行数据
        // 当上一行的数据等于当前行数据时，当前行单元格隐藏
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 反之，则循环判断若下一行数据等于当前行数据，则当前行开始进行合并单元格
          let countRowspan = 1 // 用于合并计数多少单元格
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = this.tableData[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    // 鼠标移入单元格提示
    popoverContent(rowindex) {
      let str = '<span class="symbolTitle">如果</span><br/>'
      let column1 = ''
      let column2 = ''
      let column3 = ''
      let symbol = true
      Object.keys(this.tableData[0]).forEach((key, index) => {
        column1 = `<span class="fields">${this.tableData[0][index].replaceAll('_', '的')}</span>`
        column3 = `<span class="values">${this.tableData[rowindex][index]}</span>`
        if (this.tableData[1][index] && this.tableData[1][index].search('条件列') !== -1) {
          if (index !== 0) {
            str += '<br/><span class="symbol">并且</span>'
          }

          column2 = this.tableData[1][index].replaceAll('【条件列】', ' ').replace(/[=<>]/g, ' ').replaceAll('参数集(用逗号分割)', '')

          if (column2.includes('(多个参数以逗号分隔)')) {
            column2 = column2.replace('(多个参数以逗号分隔)', `(${column3})`)
            str += column1 + '<span class="">' + column2 + '</span>'
          } else {
            str += column1 + '<span class="">' + column2 + '</span>' + column3
          }
          // if (this.tableData[rowindex][index]) {
          // }
        }
        if (this.tableData[1][index] && this.tableData[1][index].search('决策列') !== -1) {
          if (symbol) {
            str += '<br/><span class="symbolTitle">那么</span><br/>'
            symbol = false
          }
          str += column1 + '<span class="">等于</span>' + column3
          str += '<br/>'
        }
      })
      return str
    },
    // 改变背景色和字体颜色
    changeColor({ row, column, cowIndex, columnIndex }) {
      if (this.changeColorIndex.includes(columnIndex)) {
        return 'background:#ebf1fb'
      }
    },
    openDialog() {
      this.getDecisionTableVersion()
      if (this.decisionTableId) this.getRuleDefinedByTableId()
    },
    getRuleDefinedByTableId() {
      getRuleDefinedByTableId({ tableId: this.decisionTableId }).then(res => {
        this.rule = res?.ruleDesc
      })
    },
    getData() {
      this.tableData = []
      let binary = ''
      this.initLoading = true
      axios.get(this.url, {
        headers: { 'adp-token': this.$store.state.user.token },
        responseType: 'arraybuffer' // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'，默认是'json'
      })
        .then(res => {
          this.loading = false
          var bytes = new Uint8Array(res.data)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var wb = XLSX.read(binary, { type: 'binary' })
          var wsname = wb.SheetNames[0]
          var ws = wb.Sheets[wsname]
          this.jsonData = XLSX.utils.sheet_to_json(ws)
          const obj = {}
          Object.keys(this.jsonData[0]).forEach((key, index) => {
            if (key.substr(key.length - 2, 1) === '_') {
              obj[index] = key.substring(0, key.length - 2)
              this.fields.push(index.toString())
            } else {
              obj[index] = key
              this.fields.push(index.toString())
            }
          })
          this.tableData.push(obj)
          this.jsonData.forEach((item, index) => {
            const obj2 = {}
            Object.keys(item).forEach((key, index) => {
              obj2[index] = item[key].toString()
            })
            this.tableData.push(obj2)
          })
          this.tableData = this.tableData.map(obj => {
            const updatedObj = {}
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                updatedObj[key] = obj[key].replace(/_/g, '的') // 使用正则表达式进行全局替换
              }
            }
            return updatedObj
          })
          var HTML = XLSX.utils.sheet_to_html(ws)
          if (this.$refs.preview) {
            this.$refs.preview.innerHTML = HTML
          }
          this.changeColorIndex = []
          Object.values(this.tableData[1]).forEach((item, index) => {
            if (item === '【决策列】') {
              this.changeColorIndex.push(index)
            }
          })
          // this.changeColorIndex = Object.values(this.tableData[1]).indexOf('【决策列】')
          //  var  changeColorIndex=this.tableData[1].findIndex(item=>item=="【决策列】")
          this.initLoading = false
        }).catch((e) => {
          this.initLoading = false
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
            if (res.ruleDefinedEdit) {
              res.ruleDefinedEdit.codeServices = (res.ruleDefinedEdit.codeServices || '').toString()
              // this.ruleForm.rule = res.ruleDefinedEdit ? res.ruleDefinedEdit.ruleDesc : ''
              this.rule = res.ruleDefinedEdit ? res.ruleDefinedEdit.ruleDesc : ''
            }
            this.tableData = res.decisionTableComplexHeaderContentDTOList
          }
        }
      })
    },
    getDecisionTableVersion() {
      const params = {
        decisionTableId: this.decisionTableId
      }
      getDecisionTableVersion(params).then(res => {
        res = res.resp
        if (res === '1') {
          this.tableType = 'new'
          this.getNewTableData()
        } else {
          this.tableType = 'old'
          this.getData()
        }
      })
    }

  }
}
</script>

  <style scoped lang='scss'>
  </style>
  <style lang='scss'>
.preview-decision-table-dialog {
  .el-dialog__body {
    padding-top: 0;
    // padding-bottom: 0;
  }
}
  </style>
