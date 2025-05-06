<template>
  <!-- 这里代码主要用于 节点的类型等于用户输入节点时的元素渲染 -->
  <div
    class="relative treeInput"
    :class="{
      'express-node': paramId,
      modify:
        _.indexOf(node.modifyParamId, format.paramId) !== -1 || node.modify
    }"
  >
    <!-- 节点： -->
    <!-- 如果是input输入框 -->
    <template v-if="format.type === 'input'">
      <!-- ValidationProvider是vee-validate中的表单验证组件   在main.js中进行了全局注册-->
      <!-- <ValidationProvider
        v-if="format.label !== '不成立'"
        v-slot="{ errors }"
        rules="required"
        class="inline-input-validate"
      >
        <el-form-item :error="errors[0]">
          <el-input
            v-if="format.label !== '不成立'"
            v-model="inputDisplayValue"
            class="input"
            :type="format.returnType === 'string' ? 'text' : 'number'"
            :placeholder="RETURN_TYPE[format.returnType]"
            disabled
            step="0.01"
            @input="updateInputValue"
          />
        </el-form-item>
      </ValidationProvider> -->
      <span class="inline-input-validate values" v-if="format.label !== '不成立'">{{ inputDisplayValue }}</span>
      <!-- <ValidationProvider
        v-if="format.unitsList"
        v-slot="{ errors }"
        rules="required"
        class="inline-input-validate"
      >
        <el-form-item v-if="format.unitsList" :error="errors[0]">
          <el-select v-model="node.paramValueUnit" disabled value-key="key">
            <el-option
              v-for="item in format.unitsList"
              :key="item.key"
              :label="item.label"
              :value="item"
            >{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
      </ValidationProvider> -->
      <span class="inline-input-validate values" v-if="format.unitsList">{{ node.paramValueUnit }}</span>
      <span v-if="format.label === '不成立'">不成立</span>
    </template>

    <!-- 如果是日期控件 -->
    <template v-else-if="format.type === 'date'">
      <!-- <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="inline-input-validate"
      >
        <el-form-item :error="errors[0]">
          <el-date-picker
            v-model="vInputValue"
            type="datetime"
            :placeholder="$t('vinput.selectDateTime')"
            disabled
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </ValidationProvider> -->
      <span class="inline-input-validate values">{{ vInputValue }}</span>
    </template>

    <!-- 如果是时间控件 -->
    <template v-else-if="format.type === 'time'">
      <!-- <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="inline-input-validate"
      >
        <el-form-item :error="errors[0]">
          <el-time-picker
            v-model="vInputValue"
            value-format="HH:mm:ss"
            :placeholder="$t('vinput.timePoint')"
            disabled
          />
        </el-form-item>
      </ValidationProvider> -->
      <span class="inline-input-validate values">{{ vInputValue }}</span>
    </template>

    <!-- 如果是选择下拉控件 -->
    <template
      v-else-if="
        format.type === 'selector' || format.type === 'selector-multiple'
      "
    >
      <!-- <ValidationProvider
        v-slot="{ errors }"
        rules="required"
        class="inline-input-validate"
      >
        <el-form-item :error="errors[0]">
          <el-select
            v-if="selectList && selectList.length > 0"
            v-model="vSelectValue"
            value-key="key"
            :class="{ multiple: format.type === 'selector-multiple' }"
            filterable
            :multiple="format.type === 'selector-multiple'"
            :placeholder="$t('common.pleaseChoose')"
            :disabled="disabled"
            @change="onChangeSelect"
          >
            <el-option
              v-for="item in selectList"
              :key="item.key"
              :label="item.label"
              :value="item"
            >
              <span v-if="selectListInfo.listSource !== 'param-field'">
                {{ item.key }} -</span>
              {{ item.label }}
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="vSelectValue.label"
            :disabled="disabled"
            @input="onChangeSelect"
          />
        </el-form-item>
      </ValidationProvider> -->
      <span class="inline-input-validate values">{{ vSelectValue?.label || vSelectValue }}</span>
    </template>

    <template v-else>{{ node.expression }}</template>
  </div>
</template>

<script>
import { getCodeList } from '@/utils/utils'
import { RETURN_TYPE } from '@/utils/poc'
import moment from 'moment'
export default {
  name: 'Vinput',
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
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateTime: null,
      vInputValue: null, // 普通控件存值
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null // 节点值的单位
    }
  },
  computed: {
    formatDateTime() {
      if (this.vInputValue) {
        const moment = require('moment')
        const momentObj = moment.utc(this.vInputValue, 'yyyy-MM-DD HH:mm:ss').utcOffset('+08:00')
        const formattedDateTime = momentObj.format('yyyy-MM-DD HH:mm:ss')
        return formattedDateTime
        // return 'yyyy-MM-dd HH:mm:ss'
      }
      return null
    },
    utcVinputValue: {
      get() {
        const moment = require('moment')
        const momentObj = moment.utc(this.vInputValue, 'yyyy-MM-DD HH:mm:ss').utcOffset('+08:00')
        const formattedDateTime = momentObj.format('yyyy-MM-DD HH:mm:ss')
        return formattedDateTime
      },
      set(value) {
        this.vInputValue = value
      }
    },
    selectList() {
      let list = []
      if (this.node.nodeType === 'CUSTOM') {
        // 比较节点的列表
        list = getCodeList(this.selectListInfo.codeService)
      } else {
        // 表达式的列表
        if (this.selectListInfo.listSource === 'param-field') {
          list = this.$store.state.app.ListByField[
            this.selectListInfo.codeService
          ]
        } else if (this.selectListInfo.codeService) {
          list = getCodeList(this.selectListInfo.codeService)
        }
        if (this.selectListInfo.listSourceFilter && list) {
          list = list.filter(item => {
            return item.codeService
          })
        }
      }
      return list
    },
    ExpressionDetail() {
      return this.getExpressionDetail(this.operatorCode)
    },
    inputDisplayValue() {
      if (Array.isArray(this.vInputValue)) {
        return this.vInputValue.map(item => {
          if (typeof item === 'object' && item !== null) {
            return item.label
          }
          return item
        }).join('')
      } else if (typeof this.vInputValue === 'object' && this.vInputValue !== null) {
        return this.vInputValue.label
      }
      return this.vInputValue
    }
  },
  watch: {
    vInputValue: {
      handler(newValue) {
        if (this.paramId) {
          // 表达式存值
          this.node.paramValue[this.paramId] = newValue
        } else {
          // 普通节点存值
          this.node.paramValue = newValue
        }
        // if (newValue.toString().split('GMT').length) {
        //   const moment = require('moment')
        //   const momentObj = moment.utc(newValue, 'yyyy-MM-DD HH:mm:ss').utcOffset('+08:00')
        //   const formattedDateTime = momentObj.format('yyyy-MM-DD HH:mm:ss')
        //   newValue = formattedDateTime
        // }
      },
      deep: true
    },

    vSelectValue: {
      handler(newValue) {
        if (!newValue) {
          if (this.paramId) {
            // 表达式存值
            this.node.paramValue[this.paramId] = null
          } else {
            // 普通节点存值
            this.node.paramValue = null
          }
        }
      }
    }
  },
  created() {
    this.init()
    this.RETURN_TYPE = RETURN_TYPE
    const moment = require('moment')
    const momentObj = moment.utc(this.vInputValue, 'YYYY-MM-DD HH:mm:ss').local()
    const formattedDateTime = momentObj.format('YYYY-MM-DD HH:mm:ss')
    // const utcDateTime = moment.utc(this.vInputValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    if (this.vInputValue.toString().indexOf('GMT') !== -1) {
      this.vInputValue = formattedDateTime
    }
  },
  methods: {
    updateInputValue(value) {
      if (Array.isArray(this.vInputValue)) {
        var str = ''
        this.vInputValue.forEach(item => {
          if (item !== null && typeof item === 'object') {
            str += item.label
          } else {
            str += item
          }
        })
        if (value.length < str.length) {
          this.vInputValue.pop()
          if (this.vInputValue.length === 0) {
            this.vInputValue = ''
          }
        } else {
          const addNode = value.slice(str.length, value.length)
          if (addNode === ',' || addNode === '，') {
            this.vInputValue.push(addNode)
          }
        }
      } else if (this.vInputValue !== null && typeof this.vInputValue === 'object') {
        if (value.length < this.vInputValue.label.length) {
          this.vInputValue = ''
        } else {
          const addNode = value.slice(this.vInputValue.label.length, value.length)
          if (addNode === ',' || addNode === '，') {
            const newValue = []
            newValue.push(this.vInputValue)
            newValue.push(addNode)
            this.vInputValue = newValue
          }
        }
      } else {
        this.vInputValue = value
      }
    },
    handleDateTimeChange(value) {
      if (value) {
        const moment = require('moment')
        const momentObj = moment.utc(this.vInputValue, 'yyyy-MM-DD HH:mm:ss').utcOffset('+08:00')
        const formattedDateTime = momentObj.format('yyyy-MM-DD HH:mm:ss')
        // this.vInputValue = this.formattedDateTime
        // return formattedDateTime
      }
    },
    // 用operatorCode 解析表达式
    getExpressionDetail(operatorCode) {
      let list = []
      if (operatorCode) {
        list = this.$store.state.app.IdExpressionList[operatorCode]
          .expressionArray
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
      } else if (this.format.type === 'date') {
        this.vInputValue = new Date(value)
      } else {
        this.vInputValue = value
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

::v-deep .el-input {
  color: #333;
  // padding: 5px;
  font-size: 13px;
  height: 30px;
  line-height: 28px;
  .el-input__inner {
    border: 1px solid #eee;
    color: #333;
    padding: 5px;
    font-size: 13px;
    height: 30px;
    margin-left: 5px;
  }
  &.date {
    width: 140px;
    .el-input__inner {
      width: 140px;
    }
  }
}
::v-deep .el-input-group {
  width: 100px;

  .el-input-group--append {
    width: 20px;
  }
  .el-input-group__append {
    margin-top: 0;
  }
}
.modify {
  ::v-deep .el-input__inner {
    border-color: #f56c6c !important;
    color: #f56c6c !important;
  }
}

::v-deep .el-select {
  &.multiple {
    .el-input {
      border: 1px solid #eee;
      color: #333;
      .el-input__inner {
        border: none;
        padding: 0 5px;
        height: 25px !important;
        width: 100%;
      }
    }
  }
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
</style>
