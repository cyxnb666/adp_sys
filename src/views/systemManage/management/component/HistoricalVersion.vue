<template>
  <el-dialog
    :title="$t('ruleManage.historicalVersion')"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    class="decisionTablesDownloadWrapper"
    :close-on-click-modal="false"
    append-to-body
  >
    <div style="margin-bottom:10px">
      <el-button
        type="primary"
        size="mini"
        @click="comparisonF"
      >{{ $t('router.Comparison') }}
      </el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      height="250"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{
        background: '#EFF4F8',
        color: '#60769C',
        'font-weight': 'normal'
      }"
      :cell-style="{ color: '#435475' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="versionNo" :label="$t('bomCreat.bomVersion')">
        <!-- <template slot-scope="scope">
          {{ scope.$index }}
        </template> -->
      </el-table-column>
      <el-table-column prop="originalCreatedBy" :label="$t('listReport.updatedBy1')"/>
      <el-table-column :label="$t('listReport.tag')" width="250">
        <template slot-scope="scope">
          <input v-show="iseditor[scope.$index]" v-model="scope.row.tag" style="width:150px" type="text">
          <i v-show="iseditor[scope.$index]" class="el-icon-check tableBtn" @click="saveTag(scope.row)"/>
          <span v-show="!iseditor[scope.$index]">{{ scope.row.tag }}</span>
          <i v-show="!iseditor[scope.$index]" class="el-icon-edit tableBtn" @click="clickEdit(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column prop="annotation" label="注释"/>
      <!-- <el-table-column prop="updatedDate" :label="$t('dashboard.updateTime')"/> -->
      <el-table-column :label="$t('dashboard.updateTime')" prop="createdDate"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="restores(scope.row)" :loading="scope.row.loading">还原
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="multipleSelection.length===2 && showRecords"
      style="margin:10px 0;color:#0079ff"
    >
      版本差异
    </div>
    <el-table
      v-if="multipleSelection.length===2 && showRecords"
      :data="difTable"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{
        background: '#EFF4F8',
        color: '#60769C',
        'font-weight': 'normal'
      }"
      class="difTable"
      :cell-style="{ color: '#435475' }"
    >
      <el-table-column :label="multipleSelection[0].versionNo+'版本'">
        <template slot-scope="scope">
          <div v-html="scope.row.item1Desc"/>
        </template>
      </el-table-column>
      <el-table-column :label="multipleSelection[1].versionNo+'版本'">
        <template slot-scope="scope">
          <div v-html="scope.row.item2Desc"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="tableDifference" v-if="processedData && processedData.length">
      <el-table
        :data="processedData"
        border
        style="width: 100%"
        v-loading="tableLoading"
        :row-class-name="rowClassName">
        <!-- 左侧版本 -->
        <el-table-column
          :label="leftVersionNo"
          align="center"
          header-align="center">
          <el-table-column
            v-for="col in columns"
            :key="'left-'+col"
            :label="col"
            :prop="'left.'+col"
            width="180"
            align="center">
            <template #default="{ row }">
              <div :class="['cell-content', { 'diff-cell': row.left[col]?.diff }]">
                {{ row.left[col]?.value || '-' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 右侧版本 -->
        <el-table-column
          :label="rightVersionNo"
          align="center"
          header-align="center">
          <el-table-column
            v-for="col in columns"
            :key="'right-'+col"
            :label="col"
            :prop="'right.'+col"
            width="180"
            align="center">
            <template #default="{ row }">
              <div :class="['cell-content', { 'diff-cell': row.right[col]?.diff }]">
                {{ row.right[col]?.value || '-' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import {getRuleHistory, updateHistoryTag} from '@/api/mainPages/decision'
import {compareDecisionTable, restore, tableRestore} from "@/views/systemManage/management/api";

export default {
  components: {},
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    ruleId: {
      type: String,
      default: ''
    },
    decisionTableId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      difTable: [],
      iseditor: [],
      tableLeft: [],
      tableRight: [],
      showRecords: false,
      tableLoading: false,
      leftData: {},
      leftVersionNo: '',
      rightVersionNo: '',
      rightData: {}
    }
  },
  computed: {
    // 获取所有列名（合并左右版本）
    columns() {
      const leftCols = Object.keys(this.leftData?.value || {});
      const rightCols = Object.keys(this.rightData?.value || {});
      return [...new Set([...leftCols, ...rightCols])].sort();
    },

    // 处理后的表格数据
    processedData() {
      const rowMap = new Map();

      // 处理数据源
      const processSource = (source, type) => {
        Object.entries(source?.value || {}).forEach(([col, cells]) => {
          Object.values(cells).forEach(cell => {
            const rowNum = cell.rowNum;
            if (!rowMap.has(rowNum)) {
              rowMap.set(rowNum, {
                rowNum,
                left: {},
                right: {}
              });
            }
            const row = rowMap.get(rowNum);
            row[type][col] = {
              value: cell.value,
              diff: cell.diff
            };
          });
        });
      };

      processSource(this.leftData, 'left');
      processSource(this.rightData, 'right');

      // 补全缺失列并排序
      return Array.from(rowMap.values())
        .sort((a, b) => a.rowNum - b.rowNum)
        .map(row => ({
          ...row,
          rowNum: `行 ${row.rowNum}`,
          left: this.fillMissingColumns(row.left, 'left'),
          right: this.fillMissingColumns(row.right, 'right')
        }));
    }
  },
  watch: {
    dialogFormVisible: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.getHistoryTableData()
        }
      },
      deep: true
    }
  },
  created() {
    this.getHistoryTableData()
  },
  methods: {
    restores(row) {
      this.$prompt('请输入还原原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          console.log(value)
          return !!value
        },
        inputErrorMessage: '请输入还原原因'
      }).then(({value}) => {
        row.loading = true
        const URL = this.ruleId ? restore : tableRestore
        URL({
          ruleId: this.ruleId,
          decisionTableId: this.decisionTableId,
          versionNo: row.versionNo,
          annotation: value,
        }).then(() => {
          this.$message.success('还原规则成功')
          this.getHistoryTableData()
        }).finally(() => {
          row.loading = false
        })
      }).catch(() => {
      });
    },
    // 保存tag
    saveTag(row) {
      const type = this.ruleId ? 0 : 1
      updateHistoryTag(row.id, row.tag,type).then(res => {
        this.getHistoryTableData()
      })
    },
    clickEdit(index) {
      this.$set(this.iseditor, index, true)
    },
    beforeClose() {
      this.$emit('update:dialogFormVisible', false)
      this.$emit('historicalVersionClose')
      this.leftData = {}
      this.rightData = {}
      this.leftVersionNo = ''
      this.rightVersionNo = ''
    },
    // 获取版本数据
    getHistoryTableData() {
      this.iseditor = []
      getRuleHistory(this.ruleId || this.decisionTableId, this.ruleId ? '0' : '1').then(res => {
        res.forEach((item, index) => {
          // res[index].VersionNo = index
          item.loading = false
        })
        this.tableData = res
        res.forEach(() => {
          this.iseditor.push(false)
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.difTable = []
      this.showRecords = false
    },
    getChange(a, b) {
      let changeIndexs = []
      let arr = []
      if (b.length > a.length) {
        const temp = a
        a = b
        b = temp
      }
      arr = _.difference(a, b)
      arr.forEach(item => {
        changeIndexs.push(_.findIndex(a, o => o === item))
      })
      for (let i = 0; i < a.length - b.length; i += 1) {
        changeIndexs.push(a.length - i - 1)
      }
      changeIndexs = _.uniq(changeIndexs)
      const aList = Object.keys(a).map(key => {
        return {[key]: a[key]}
      })
      const bList = Object.keys(b).map(key => {
        return {[key]: b[key]}
      })

      changeIndexs.forEach(index => {
        aList[index] = {[index]: a[index] ? a[index] : '', isChange: true}
        bList[index] = {[index]: b[index] ? b[index] : '', isChange: true}
      })
      return [aList, bList]
    },
    getArrDifference(arr1, arr2) {
      const table = []
      const simIndexList = []
      const simIndexList1 = []
      arr1.forEach((item1, item1Index) => {
        let isdif = true
        let strIndex = -1
        let spliceIndex = -1
        arr2.forEach((item2, item2Index) => {
          if (simIndexList.indexOf(item2Index) === -1) {
            if (item1 === item2) {
              simIndexList.push(item2Index)
              isdif = false
            }
          }
        })
        if (isdif && simIndexList1.indexOf(item1Index) === -1) {
          Array.from(item1).forEach((charItem1, charindex1) => {
            for (var i = 0; i < arr2.length; i++) {
              if (simIndexList.indexOf(i) === -1) {
                if (Array.from(arr2[i])[charindex1] === charItem1 &&
                  Array.from(arr2[i])[0] === Array.from(item1)[0] &&
                  Array.from(arr2[i])[charindex1 - 1] === Array.from(item1)[charindex1 - 1]) {
                  if (spliceIndex === -1) {
                    strIndex = i
                    spliceIndex = charindex1 + 1
                  } else if (spliceIndex === charindex1) {
                    strIndex = i
                    spliceIndex = charindex1 + 1
                  }
                  return
                }
              }
            }
          })
          if (spliceIndex !== -1) {
            table.push({
              item1Desc: item1.slice(0, spliceIndex) + "<span class='red'>" + item1.slice(spliceIndex) + '</span>',
              item2Desc: arr2[strIndex].slice(0, spliceIndex) + "<span class='red'>" + arr2[strIndex].slice(spliceIndex) + '</span>'
            })
            simIndexList.push(strIndex)
            spliceIndex = -1
          } else {
            table.push({
              item1Desc: "<span class='red'>" + item1 + '</span>',
              item2Desc: ''
            })
            spliceIndex = -1
          }
        } else {
          table.push({
            item1Desc: item1,
            item2Desc: item1
          })
        }
      })
      if (simIndexList.length < arr2.length) {
        arr2.forEach((item2, index) => {
          if (simIndexList.indexOf(index) === -1) {
            table.push({
              item1Desc: '',
              item2Desc: "<span class='red'>" + item2 + '</span>'
            })
          }
        })
      }
      this.difTable = table
      this.showRecords = true
    },
    comparisonF() {
      if (this.multipleSelection.length !== 2) {
        this.$message({
          type: 'info',
          message: '请选择两个版本进行对比'
        })
        return
      }
      if (this.ruleId) {
        const arr = []
        // let aa = [{desc:'<span class=\"fields\">规则中间值的军队/武警牌照</span>为<span class=\"values\"></span><span class=\"values\">是</span> 并且 <span class=\"fields\">规则中间值的车损险类组合</span>为<span class=\"values\"></span><span class=\"values\">是</span>'},{
        //   desc:'<span class=\"fields\">规则中间值的军队/武警牌照</span>为<span class=\"values\"></span><span class=\"values\">是</span> 并且 <span class=\"fields\">规则中间值的是否新车</span>为<span class=\"values\"></span><span class=\"values\">否</span>'
        // }]
        this.multipleSelection.forEach((item, index) => {
          const text = item.ruleDesc.replaceAll('<span class=\"fields\">', '').replaceAll('<span class=\"values\">', '').replaceAll('</span>', '').replaceAll(' ', '')
          arr[index] = text.split(/并且|或者/)
        })
        this.getArrDifference(arr[0], arr[1])
      }
      if (this.decisionTableId) {
        const mainVersion = this.multipleSelection[0].versionNo
        const secondVersion = this.multipleSelection[1].versionNo
        this.tableLoading = true
        compareDecisionTable(this.decisionTableId, mainVersion, secondVersion).then(res => {
          this.leftVersionNo = '版本号' + res.resp.leftVersionNo
          this.rightVersionNo = '版本号' + res.resp.rightVersionNo
          const compareResult = res.resp.compareResultList && res.resp.compareResultList.length ? res.resp.compareResultList[0] : null
          if (compareResult) {
            const tableCompareResults = compareResult.tableCompareResults && compareResult.tableCompareResults.length ? compareResult.tableCompareResults[0] : null
            if (tableCompareResults) {
              this.leftData = tableCompareResults.left
              this.rightData = tableCompareResults.right
              console.log(this.tableLeft,this.tableRight)
            }
          }
        }).finally(() => {
          this.tableLoading = false
        })
      }

    },
    // 补全缺失列
    fillMissingColumns(data, type) {
      return this.columns.reduce((acc, col) => {
        if (!data[col]) {
          acc[col] = {
            value: '-',
            diff: true // 标记为差异项
          };
        } else {
          acc[col] = data[col];
        }
        return acc;
      }, {});
    },

    // 行样式（可选）
    rowClassName({ row }) {
      return Object.values(row.left).some(c => c.diff) ||
      Object.values(row.right).some(c => c.diff)
        ? 'diff-row' : '';
    }
  }
}
</script>
<style lang="scss">
.difTable .red {
  color: red;
}

.tableBtn {
  color: #0079ff;
  margin-left: 5px
}
.diff-cell {
  background-color: #ffd9df;
  padding: 4px;
  border-radius: 4px;
  font-weight: 500;
}

.cell-content {
  padding: 4px 8px;
}

.diff-row {
  background-color: #f8f8f8;
}

.el-table__header th {
  background-color: #f5f7fa;
}
</style>
