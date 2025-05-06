<template>
  <div>
    <el-row type="flex" class="align-item-center justify-content-center">
      <el-col :span="11">
        <el-table
          ref="multipleSourceTable"
          height="350"
          :data="sourceCL"
          tooltip-effect="dark"
          style="width: 100%"
          type="selection"
          :empty-text="$t('common.noData')"
          @selection-change="handleSourceSelectionChange"
          @row-click="clickSourceRow"
        >
          <!-- 使用Element表格的单选多选功能 -->
          <el-table-column
            type="selection"
            width="30"
          />
          <el-table-column :label="$t('newapp.dimName')">
            <template slot-scope="scope">{{ scope.row.dimName }}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="2">
        <div class="text-center">
          <el-button size="mini" icon="el-icon-arrow-right" type="primary" :disabled="multipleSourceSelection.length == 0" @click="addToTarget" />
        </div>
        <div class="text-center mt-15">
          <el-button size="mini" icon="el-icon-arrow-left" type="primary" :disabled="multipleTargetSelection.length == 0" @click="addToSource" />
        </div>
      </el-col>
      <el-col :span="11" class="relative">
        <el-table
          ref="multipleTargetTable"
          height="350"
          :data="targetCL"
          tooltip-effect="dark"
          style="width: 100%"
          type="selection"
          :empty-text="$t('common.noData')"
          @selection-change="handleTargetSelectionChange"
          @row-click="clickTargetRow"
        >
          <el-table-column
            type="selection"
            width="30"
          />
          <el-table-column :label="$t('newapp.destinationList')">
            <template slot-scope="scope">{{ scope.row.dimName }}</template>
          </el-table-column>
        </el-table>
        <div class="btn-wrap">
          <el-button size="mini" class="color-primary f18" icon="el-icon-caret-top" @click="move('top')" /> <br>
          <el-button size="mini" class="color-primary f18 mt-15" icon="el-icon-caret-bottom" @click="move('bottom')" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'targetList',
    event: 'change'
  },
  props: {
    source: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      sourceCL: [],
      targetCL: [],
      multipleSourceSelection: [],
      multipleTargetSelection: []
    }
  },
  watch: {
    source(newValue, oldValue) {
      this.sourceCL = newValue
    },
    targetCL(newValue) {
      this.$emit('change', newValue)
    }
  },
  created() {
    this.sourceCL = this.source
  },
  methods: {
    addToTarget() {
      this.sourceCL = this.deleteSelected(this.sourceCL, this.multipleSourceSelection)
      this.targetCL = this.targetCL.concat(this.multipleSourceSelection)
    },
    addToSource() {
      this.targetCL = this.deleteSelected(this.targetCL, this.multipleTargetSelection)
      this.sourceCL = this.sourceCL.concat(this.multipleTargetSelection)
    },
    // 删除已选
    deleteSelected(curList, multipleSelection) {
      const resultList = []
      curList.forEach(function(itemC, indexC) {
        const resultFlag = multipleSelection.every(function(itemM, indexM) {
          return itemM.id !== itemC.id
        })
        if (resultFlag) resultList.push(itemC)
      })
      return resultList
    },
    handleSourceSelectionChange(val) {
      this.multipleSourceSelection = val
    },
    handleTargetSelectionChange(val) {
      this.multipleTargetSelection = val
    },
    move(direct) {
      // 先拿到需要移动的多行数据
      // 删除多行数据
      // 找到需要插入的下标 新增多行数据

      const multipleTargetSelection = this.multipleTargetSelection
      if (direct === 'top') {
        let indexof = this.targetCL.findIndex(item => item.id === this.multipleTargetSelection[0].id)
        if (indexof-- > 0) {
          this.targetCL = this.deleteSelected(this.targetCL, this.multipleTargetSelection)
          this.targetCL.splice(indexof, 0, ...multipleTargetSelection)
        } else {
          this.$message(this.$t('newapp.top'))
        }
      } else {
        let indexof = this.targetCL.findIndex(item => item.id === this.multipleTargetSelection[this.multipleTargetSelection.length - 1 ].id)
        if (indexof++ < this.targetCL.length - 1) {
          this.targetCL = this.deleteSelected(this.targetCL, this.multipleTargetSelection)
          this.targetCL.splice(indexof, 0, ...multipleTargetSelection)
        } else {
          this.$message(this.$t('newapp.bottom'))
        }
      }
    },
    clickSourceRow(row) {
      this.$refs.multipleSourceTable.toggleRowSelection(row)
    },
    clickTargetRow(row) {
      this.$refs.multipleTargetTable.toggleRowSelection(row)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  text-align: center;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  th {
  text-align: center;
  font-weight: normal;
  }
  .el-table-column--selection .cell {
    padding-right: 5px;
    padding-left: 5px;
  }
  td {
    font-weight: normal;
    cursor: pointer;
    text-align: left;
    color: #435475;
    padding: 5px;
    border: 0;
    .cell {
      padding-left: 0;
    }
  }
  tr.el-table__row--striped td {
    background-color: #F9FDFF;
  }
}
.btn-wrap {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translate(50%,-50%);

}
</style>
