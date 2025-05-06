<template>
  <div class="rule-table">
    <table class="el-table el-table--fit el-table--border editable-table el-table__header" border="0" cellspacing="0" cellpadding="0">
      <!-- 编号列 -->
      <div class="table-index">
        <thead>
          <tr><th :style="{ height: 23 * maxHeight + 'px'}" /></tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in (tableData[0]?.columns || [])"
            :key="index"
            v-contextmenu="{ options: tableRowMenu, callback: menu => editRow(index, menu) }"
            :class="{ active: rowIndex === index}"
            @click="activeRow(-1, index, null)"
          >
            <td>{{ index + 1 }}</td>
          </tr>
        </tbody>
      </div>
      <!-- 数据列 -->
      <div v-for="(item, colIdx) in tableData" :key="item.key" :class="{ active: colIndex === colIdx && rowIndex < 0 }">
        <thead
          v-if="item.headers"
          v-contextmenu="{ options: tableColumnMenu, callback: menu => editColumn(colIdx, menu) }"
          class="is-group"
          :class="{ 'theme-dark': colIndex === colIdx }"
          @click="activeColumn(colIdx, item.rule, item.headers)"
        >
          <tr v-for="row, rowIdx in item.headers" :key="rowIdx">
            <th
              v-for="cell in row"
              :key="cell.key"
              :colspan="cell.colspan"
              :rowspan="cell.rowspan"
              class="cell"
              :style="{ height: `${23 * cell.rowspan}px`, lineHeight: `${23 * cell.rowspan}px` }"
            >
              <input v-if="colIndex === colIdx && rowIndex < 0 && !disabled" v-model="cell.value" :placeholder="getCharCode(cell.placeholder, colIdx)" size="12">
              <span v-else>{{ getCharCode(cell.value || cell.placeholder, colIdx) }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="item.columns" :class="{ decisionColumn: item.columnType === 'decision' }">
          <tr
            v-for="(row, rowIdx) in item.columns"
            :key="rowIdx"
            :class="{ active: (colIndex === colIdx || colIndex < 0) && rowIndex === rowIdx }"
            @click.capture="activeRow(colIdx, rowIdx, item.rule, row)"
          >
            <!-- <td v-for="cell in row" :key="cell.key">
                            <div v-if="row.edit" class="cell">
                                <GuidEditorSelect v-model="cell.value" v-if="cell.type === 'selector-multiple' || cell.type === 'selector'" :node="cell" :options="cell.options || []" placeholder="<选择一个字符>"></GuidEditorSelect>

                                <input v-if="cell.returnType === 'string' || !cell.returnType" v-model="cell.value" type="text"/>
                                <input v-if="['int' ,'integer', 'double', 'float', 'long'].includes(cell.returnType) || cell.returnType === 'number'" v-model="cell.value" type="number"/>
                                <GuidEditorDate v-model="cell.value" v-if="cell.returnType === 'date' || cell.returnType === 'time'" :node="cell" hide></GuidEditorDate>
                            </div>
                            <div v-else class="cell">
                                <template v-if="cell.type === 'selector-multiple'">
                                    <template v-for="item in (cell.value || [])">{{ item.label }}</template>
                                </template>
                                <template v-else-if="cell.type === 'selector'">{{ cell.value?.label }}</template>
                                <template v-else>{{ cell.value }}</template>
                            </div>
                        </td> -->
            <DecisionTableRow v-bind="{
              row,
              head: item.headers.length ? item.headers[item.headers.length - 1] : [],
              editable: (item.rule && colIndex === colIdx && rowIndex === rowIdx && !disabled),
              rowIndex: rowIdx,
              colIndex: colIdx,
              columnType: item.columnType
            }" @click.native.capture="e => disabled && e.stopPropagation()" />
          </tr>
        </tbody>
      </div>
    </table>
  </div>
  <!-- <el-table :data="tableData.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
        <el-table-column label="Date" prop="date"></el-table-column>
        <el-table-column label="Name" prop="value"></el-table-column>
        <el-table-column align="right">
            <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
    </el-table> -->
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
export default {
  mixins: [Emitter],
  props: {
    rowIndex: Number,
    colIndex: Number,
    disabled: Boolean,
    tableData: {
      type: Array,
      default: () => []
    },
    validRuleTable: Function
  },
  data() {
    return {
      // rowIndex: 0,
      // colIndex: 0,
      tableColumnMenu: [{
        label: '左侧添加列',
        value: 'addLeftColumn'
      }, {
        label: '右侧添加列',
        value: 'addRightColumn'
      }, {
        label: '删除列',
        value: 'deleteColumn'
      }],
      tableRowMenu: [{
        label: '上面添加行',
        value: 'addUpRow'
      }, {
        label: '下面添加行',
        value: 'addDownRow'
      }, {
        label: '删除行',
        value: 'deleteRow'
      }],
      charCode: ''
    }
  },
  computed: {
    maxHeight() {
      const max = this.tableData.reduce((acc, val) => {
        if (val.headers.length > acc) acc = val.headers.length
        return acc
      }, 1)
      return max
    }
  },
  methods: {
    // formatTableHead(data) {
    //     const list = []
    //     let maxRowspan = 0
    //     const convertToRows = (arr, colIndex, rowIndex) => {

    //         const children = list[rowIndex]

    //         children ? list.splice(rowIndex, 1, children.concat(arr)) : list.push(arr)

    //         if (rowIndex > maxRowspan) maxRowspan = rowIndex + 1

    //         arr.map((item, index) => {
    //             item.colIndex = colIndex !== undefined ? colIndex : index
    //             if (item.children && item.children.length) {
    //                 // 行合并
    //                 item.colspan = item.children.length
    //                 convertToRows(item.children, item.colIndex, rowIndex + 1)
    //             }
    //         })
    //     }
    //     convertToRows(data, undefined, 0)

    //     // 列合并
    //     for (let item of data) {
    //         if (!item.children || !item.children.length) {
    //             item.rowspan = maxRowspan
    //         }
    //     }
    //     return list
    // },
    getCharCode(char, index) {
      if (index) {
        if (String.fromCharCode(65 + (index % 25)).charCodeAt() === 65) {
          this.charCode += String.fromCharCode(65 + (index % 25))
        }
      } else {
        this.charCode = ''
      }

      if (char) return char

      return this.charCode + String.fromCharCode(65 + (index % 25))
    },
    activeColumn(index, rule, col) {
      // 重置编辑状态
      // this.resetEditor()
      // 设置编辑状态
      // this.$set(col, 'edit', true)

      this.$emit('selectTableColumn', index, rule)
    },
    /**
         *
         * @param colIndex 选择的列
         * @param rowIndex 选择的行
         * @param rule 当前列的规则
         * @param row 当前列的行
         */
    activeRow(colIndex, rowIndex, rule, row) {
      // const callback = (bool) => {
      //   if (this.validRuleTable) {
      //     this.validRuleTable(bool) // 自定义验证
      //   } else {
      //     console.error('error')
      //   }
      //   return callback
      // }
      // this.broadcast('RuleTableRow', 'validateRowValue', [callback, colIndex, rowIndex])
      // 重置编辑状态
      // this.resetEditor()
      // 设置列编辑状态
      // rule && this.$set(row, 'edit', true)

      this.$emit('selectTableRow', colIndex, rowIndex, rule)
    },
    resetEditor() {
      this.tableData.map(val => {
        val.headers.edit = false
        val.columns.map(v => v.edit = false)
      })
    },
    editColumn(index, menu) {
      this.$emit('editColumn', index, menu.value)
    },
    editRow(index, menu) {
      this.$emit('editRow', index, menu.value)
    },
    validate(callback) {
      this.broadcast('RuleTableRow', 'validateAllRowValue', [callback, this.colIndex, this.rowIndex])
    }
  }
}

</script>

<style scoped lang="scss">
.rule-table {
  
}
.editable-table {
  display: flex;
  overflow: auto;
  max-height: 300px;
  &::after {
    right: 100%;
  }
  >div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  tr {
    display: flex;
    th,td {
      width: 100%;
    }
  }
  tbody {
    display: flex;
    flex-direction: column;
  }
  .table-index {
    flex: initial;
    // flex-grow: 0;
    // flex-shrink: initial;
    // flex-basis: 36px;
    td {
      // height: 23px;
      height: 26px;
      line-height: 26px;
      width: 36px;
    }
    tr.active {
      background: #e2e4eb;
    }
    th {
      background: #F5F7FA;
    }
    // tbody {
    //     display: flex;
    //     flex-direction: column;
    // }
  }
  .theme-dark {
    position: relative;
    th {
      background: #e2e4eb;
    }
    &:after {
      content: '';
      display: inline-block;
      border-bottom: 2px solid #028229;
      position: absolute;
      width: 100%;
      bottom: 0;
      z-index: 100;
    }
  }
  .active {
    // background: #efefff;
    th{
      // background: #b6ccf3;
      background: #e2e4eb;
    }
    tbody tr {
      // background: #e2e2f7;
      background: #fafafa;
    }
  }
  .decisionColumn {
    tr {
        background: #defdef;
    }
    .el-table thead.is-group th {
      background: #f3f3f3;
    }
    .el-table--border th {
      border-bottom: 1px solid #d2d2d2;
    }
    .el-table--border th, .el-table--border td {
      border-right: 1px solid #d2d2d2;
    }
    .el-table th.is-leaf, .el-table td {
      border-right: 1px solid #d2d2d2;
    }
  }
  tbody tr.active {
    background: #e2e2f7;
  }
  th,td {
    cursor: pointer;
    text-align: center;
    padding: 0;
  }
  // th,td {
  //     padding: 0;
  // }
  ::v-deep input {
    border-style: none;
    font-size: small;
    text-align: center;
    background-color: transparent;
    color: #000000;
    width: 100%;
    line-height: 23px;
    &:focus-visible {
      outline-color: #8dc3ff;
    }
  }
  .is-group {
    input {
      font-size: 14px;
      // color: #909399;
      color: #5d5d5e;
      font-weight: bold;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      &::placeholder {
        font-size: 14px;
        color: #5d5d5e;
        font-weight: bold;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      }
      &:focus-visible {
        outline-color: transparent;
      }
      height: 100%;
    }
  }
  .cell {
    text-wrap: nowrap;
    min-width: 120px;
    display: inline-block;
    height: 24px;
    line-height: 22px;
    >span {
      display: block;
    }
  }

}
</style>
