<template>
  <div class="rule-table-row">
    <td v-for="cell, index in row" :key="cell.key" class="cell" :class="{ error: showError && !cell.value || (showError && Array.isArray(cell.value) && !cell.value.length) }">
      <GuidEditorSelect
        v-if="['selector-multiple', 'selector'].includes(cell.type)"
        ref="select"
        v-model="cell.value"
        :prev-node="head[index]?.valueType || {}"
        :node="cell"
        disabled
        :placeholder="{ boolean: '<选择一个布尔值>' }[cell.returnType] || '<选择一个字符串>'"
      />
      <GuidEditorDate v-else-if="['date', 'time'].includes(cell.returnType)" v-model="cell.value" :node="cell" disabled placeholder="<输入一个日期>" />
      <template v-else-if="editable">
        <input v-if="numberTypes.includes(cell.returnType)" v-model="cell.value" placeholder="<输入一个数字>" type="number">
        <!-- columnType = 'decision' 决策列的默认值 -->
        <input v-else-if="cell.returnType === 'string' || columnType === 'decision'" v-model="cell.value" placeholder="<输入一个字符串>" type="text">
      </template>
      <!-- :class="item.columnType === 'decision' && 'gray'" -->
      <template v-else>{{ cell.value }}</template>
    </td>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import { numberTypes } from '../dataset.js'

export default {
  mixins: [Emitter],
  componentName: 'RuleTableRow',
  props: {
    row: {
      type: Array,
      default: () => []
    },
    head: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean
    },
    colIndex: {
      type: Number,
      required: true
    },
    rowIndex: {
      type: Number,
      required: true
    },
    columnType: {
      type: String,
      required: ''
    }
  },
  data() {
    return {
      numberTypes: Object.freeze(numberTypes),
      showError: false
    }
  },
  watch: {
    editable(nVal) {
      this.$nextTick(() => {
        if (this.$refs.select) {
          this.$refs.select.map(v => v.editor = nVal)
        }
      })
    }
  },
  created() {
    console.log(this.row)
    this.$on('validateRowValue', this.validateRowValue)
    this.$on('validateAllRowValue', this.validateAllRowValue)
  },
  methods: {
    callback(v) {
      if (v.type === 'selector-multiple') return v.value && v.value.length
      return v.value
    },
    validateRowValue(callback, colIndex, rowIndex) {
      this.showError = false // 重置

      if (this.colIndex === colIndex && this.rowIndex === rowIndex) {
        if (this.row.length > 1) {
          if (this.row.every(this.callback) || this.row.every(v => !this.callback(v))) { // 全部填充数据或者全部没有数据
            callback && callback(true)
          } else if (this.row.some(this.callback)) { // 部分填充数据
            callback && callback(false)
            this.showError = true
          }
        }
      }
    },
    validateAllRowValue(callback) {
      this.showError = false // 重置
      if (this.row.length > 1) {
        if (this.row.some(this.callback) && !this.row.every(this.callback)) { // 部分填充数据
          callback && callback(false)
          this.showError = true
        }
      } else {
        callback && callback(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.rule-table-row {
    display: flex;
    width:100%;
    .cell {
        text-wrap: nowrap;
        min-width: 120px;
        display: inline-block;
        height: 26px;
        line-height: 26px;
        // width: 50%;
        padding: 0;
        flex: 1;
        text-align: center;
        >span {
            display: block;
        }
        ::v-deep .values {
            display: block;
            color: #757575 !important;
            font-size: 13px;
            height: 25px;
        }
        ::v-deep .el-input input {
            width: 100%!important;
        }
        ::v-deep .el-select {
            width: 100%;
        }
    }
    .error {
        border: 1px solid red;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }
}
</style>
