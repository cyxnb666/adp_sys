<template>
  <div class="excel-container">
    <el-dialog :title="title" :visible.sync="dialogTableVisible" width="90%" append-to-body @close="$emit('update:showPreviewExcel', false)" @open="getData">
      <!-- <div ref="preview" class="excel-container" /> -->
      <el-table
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
                <div v-html="popoverContent(scope.$index)" />
                <div slot="reference" type="text">{{ scope.row[index] }}</div>
              </el-popover>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import axios from 'axios'
import { isArray } from 'util'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['url', 'showPreviewExcel', 'title'],
  data() {
    return {
      dialogTableVisible: false,
      tableData: [],
      jsonData: [],
      indexArray: [],
      fields: [],
      changeColorIndex: [],
      initLoading: false
    }
  },
  computed: {

  },
  watch: {
    showPreviewExcel(val) {
      this.dialogTableVisible = val
    }
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
      let symbol = true
      Object.keys(this.tableData[0]).forEach((key, index) => {
        if (this.tableData[1][index] && this.tableData[1][index].search('条件列') !== -1) {
          if (this.tableData[rowindex][index]) {
            if (index !== 0) {
              str += '<br/><span class="symbol">并且</span>'
            }
            column1 = this.tableData[0][index].replaceAll('_', '的')
            column2 = this.tableData[1][index].replaceAll('【条件列】', ' ').replace(/[=<>]/g, ' ').replaceAll('参数集(用逗号分割)', '')
            str += column1 + '<span class="symbol">' + column2 + '</span>' + this.tableData[rowindex][index]
          }
        }
        if (this.tableData[1][index] && this.tableData[1][index].search('决策列') !== -1) {
          if (symbol) {
            str += '<br/><span class="symbolTitle">那么</span><br/>'
            symbol = false
          }
          str += this.tableData[0][index].replaceAll('_', '的') + '<span class="symbol">等于</span>' + this.tableData[rowindex][index]
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
    getData() {
      this.tableData = []
      let binary = ''
      this.initLoading = true
      axios.get(this.url, {
        headers: { 'adp-token': this.$store.state.user.token },
        params: {
          setting: '1'
        },
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
    }

  }
}
</script>

<style scoped lang='scss'>
.excel-container {
  width: 100%;
  table {
      table-layout: fixed !important;
      width: 100% !important;
      border-collapse:collapse;
      border:none;
      font-size:0.23rem;
  }
  tr:first-child{
    td {
      font-weight: bold;
      color: #333;
      background: #f5f7fa;
      padding: 8px 5px;
    }
  }
}
</style>
<style lang='scss'>
 .excel-container table{
   border-collapse: collapse;
 }
 .excel-container td,th {
      border: solid #ddd 1px;
      padding: 5px;
      white-space:nowrap; /* 自适应宽度*/
      word-break:keep-all; /* 避免长单词截断，保持全部 */
      white-space:pre-line;
      word-break:break-all !important;
      word-wrap:break-word !important;
      text-align:center;
      display:table-cell;
      vertical-align:middle !important;
      white-space: normal !important;
      height:auto;
      vertical-align:text-top;
      color: #666;
      }
      .symbolTitle{
        color:blue;
        font-weight: 700;
      }
      .symbol{
        color:blue;
      }
</style>
