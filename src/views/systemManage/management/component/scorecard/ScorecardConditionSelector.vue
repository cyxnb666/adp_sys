<template>
  <el-dialog
    title="编辑条件"
    :visible.sync="dialogVisible"
    width="500px"
    append-to-body
    :before-close="handleClose"
    @open="onDialogOpen"
  >
    <div v-if="!attributeType" class="loading-placeholder">请先选择属性</div>
    <el-form v-else ref="conditionForm" :model="localCondition" label-width="80px">
      <el-form-item label="操作符" prop="conditionOperator">
        <el-select v-model="localCondition.conditionOperator" placeholder="请选择操作符" @change="onOperatorChange">
          <el-option
            v-for="op in availableOperators"
            :key="op.value"
            :label="op.label"
            :value="op.value">
          </el-option>
        </el-select>
      </el-form-item>

      <template v-if="showValueInput">
        <!-- 区间输入 -->
        <template v-if="isRangeOperator">
          <el-form-item label="最小值" prop="conditionValue[0]">
            <el-input-number
              v-model="localCondition.conditionValue[0]"
              controls-position="right"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="最大值" prop="conditionValue[1]">
            <el-input-number
              v-model="localCondition.conditionValue[1]"
              controls-position="right"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </template>

        <!-- 单值输入 (非区间) -->
        <el-form-item label="值" prop="conditionValue" v-else>
           <el-input-number
             v-if="isNumericInput"
             v-model="localCondition.conditionValue"
             controls-position="right"
             style="width: 100%;"
           ></el-input-number>
           <el-select
              v-else-if="isBooleanInput"
              v-model="localCondition.conditionValue"
              placeholder="请选择">
               <el-option label="True" :value="true"></el-option>
               <el-option label="False" :value="false"></el-option>
           </el-select>
           <el-input
              v-else-if="isListInput"
              v-model="localCondition.conditionValue"
              type="textarea"
              :rows="3"
              placeholder="请输入多个值，用英文逗号分隔"
           ></el-input>
           <el-input
              v-else
              v-model="localCondition.conditionValue"
              placeholder="请输入值"
           ></el-input>
        </el-form-item>
      </template>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitCondition">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const OPERATORS = {
  COMMON: [
    { label: '等于 (==)', value: '==' },
    { label: '不等于 (!=)', value: '!=' },
    { label: '为空 (IS NULL)', value: 'IS NULL' },
    { label: '不为空 (IS NOT NULL)', value: 'IS NOT NULL' },
    { label: '包含于 (IN)', value: 'IN' },
    { label: '不包含于 (NOT IN)', value: 'NOT IN' }
  ],
  NUMERIC: [
    { label: '等于 (==)', value: '==' },
    { label: '不等于 (!=)', value: '!=' },
    { label: '大于 (>)', value: '>' },
    { label: '小于 (<)', value: '<' },
    { label: '大于等于 (>=)', value: '>=' },
    { label: '小于等于 (<=)', value: '<=' },
    { label: '大于等于 a, 小于等于 b', value: '[]' },
    { label: '大于 a, 小于等于 b', value: '(]' },
    { label: '大于等于 a, 小于 b', value: '[)' },
    { label: '大于 a, 小于 b', value: '()' },
    { label: '为空 (IS NULL)', value: 'IS NULL' },
    { label: '不为空 (IS NOT NULL)', value: 'IS NOT NULL' },
    { label: '包含于 (IN)', value: 'IN' },
    { label: '不包含于 (NOT IN)', value: 'NOT IN' }
  ],
  STRING: [], // 可按需添加 spécifiques à la chaîne comme CONTAINS, STARTSWITH etc.
  BOOLEAN: [] // 布尔只有等于/不等于/为空/不为空，已在 COMMON 中
};

// 简化的类型映射，需要根据BOM实际类型调整
const TYPE_CATEGORY = {
    'Integer': 'numeric',
    'int': 'numeric',
    'Long': 'numeric',
    'long': 'numeric',
    'Double': 'numeric',
    'double': 'numeric',
    'Float': 'numeric',
    'float': 'numeric',
    'BigDecimal': 'numeric',
    'String': 'string',
    'Boolean': 'boolean',
    'boolean': 'boolean'
    // 其他类型默认为 string 或 common
};

export default {
  name: 'ScorecardConditionSelector',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    conditionData: {
      type: Object,
      default: () => ({ conditionOperator: null, conditionValue: null, conditionDescription: '' })
    },
    attributeType: {
      type: String,
      default: '' // e.g., 'Integer', 'String', 'Boolean'
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      localCondition: {
        conditionOperator: null,
        conditionValue: null,
        conditionDescription: ''
      }
    };
  },
  computed: {
    attributeCategory() {
      // 根据属性类型确定操作符类别
      return TYPE_CATEGORY[this.attributeType] || 'string';
    },
    availableOperators() {
      let ops = [];
      if (this.attributeCategory === 'numeric') {
           ops = [...OPERATORS.NUMERIC];
      } else if (this.attributeCategory === 'string') {
           ops = [...OPERATORS.COMMON, ...OPERATORS.STRING];
      } else if (this.attributeCategory === 'boolean') {
           // 布尔类型只需要 COMMON 中的部分
           ops = OPERATORS.COMMON.filter(op => ['==', '!=', 'IS NULL', 'IS NOT NULL'].includes(op.value));
      } else {
          // 其他未知类型，默认给 COMMON
           ops = [...OPERATORS.COMMON];
      }
      return ops;
    },
    showValueInput() {
        const show = this.localCondition.conditionOperator && this.localCondition.conditionOperator !== 'IS NULL' && this.localCondition.conditionOperator !== 'IS NOT NULL';
        return show;
    },
    isRangeOperator() {
        return ['[]', '(]', '[)', '()'].includes(this.localCondition.conditionOperator);
    },
    isNumericInput() {
        return this.attributeCategory === 'numeric' &&
               !['IN', 'NOT IN', 'IS NULL', 'IS NOT NULL', '[]', '(]', '[)', '()'].includes(this.localCondition.conditionOperator);
    },
    isBooleanInput() {
        return this.attributeCategory === 'boolean' && this.showValueInput;
    },
    isListInput() {
         return this.showValueInput && ['IN', 'NOT IN'].includes(this.localCondition.conditionOperator);
    },
    isTextInput() {
         return this.showValueInput && !this.isNumericInput && !this.isBooleanInput && !this.isListInput && !this.isRangeOperator;
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    conditionData: {
        handler(newData) {
            const initialData = newData || { conditionOperator: null, conditionValue: null, conditionDescription: '' };
            // 如果是区间操作符，确保 conditionValue 是数组
            if (['[]', '(]', '[)', '()'].includes(initialData.conditionOperator)) {
                 if (!Array.isArray(initialData.conditionValue) || initialData.conditionValue.length !== 2) {
                     // 如果初始值不是合法的区间数组，则重置
                     initialData.conditionValue = [null, null];
                 }
            } else if (initialData.conditionValue === null || initialData.conditionValue === undefined) {
                initialData.conditionValue = '';
            }
            this.localCondition = JSON.parse(JSON.stringify(initialData));
        },
        immediate: true
    }
  },
  methods: {
    onDialogOpen() {
      // 对话框打开时的初始化逻辑
      this.$nextTick(() => {
        if (this.$refs.conditionForm) {
          this.$refs.conditionForm.clearValidate();
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    onOperatorChange() {
      // 当操作符变化时，重置条件值
      if (this.isRangeOperator) {
        // 如果是区间操作符，设置为数组
        this.localCondition.conditionValue = [null, null];
      } else if (['IS NULL', 'IS NOT NULL'].includes(this.localCondition.conditionOperator)) {
        // 如果是 IS NULL 或 IS NOT NULL，不需要值
        this.localCondition.conditionValue = null;
      } else if (['IN', 'NOT IN'].includes(this.localCondition.conditionOperator)) {
        // 如果是 IN 或 NOT IN，设置为空字符串
        this.localCondition.conditionValue = '';
      } else {
        // 其他情况，根据类型设置默认值
        if (this.attributeCategory === 'numeric') {
          this.localCondition.conditionValue = null;
        } else if (this.attributeCategory === 'boolean') {
          this.localCondition.conditionValue = null;
        } else {
          this.localCondition.conditionValue = '';
        }
      }

      // 更新条件描述
      this.updateConditionDescription();
    },
    updateConditionDescription() {
      // 根据操作符和值生成条件描述
      let description = '';
      const operator = this.localCondition.conditionOperator;
      const value = this.localCondition.conditionValue;

      if (!operator) {
        description = '点击编辑条件';
      } else if (['IS NULL', 'IS NOT NULL'].includes(operator)) {
        description = operator === 'IS NULL' ? '为空' : '不为空';
      } else if (this.isRangeOperator && Array.isArray(value)) {
        const [min, max] = value;
        const minStr = min !== null && min !== undefined ? min : '';
        const maxStr = max !== null && max !== undefined ? max : '';

        if (operator === '[]') {
          description = `大于等于 ${minStr}, 小于等于 ${maxStr}`;
        } else if (operator === '(]') {
          description = `大于 ${minStr}, 小于等于 ${maxStr}`;
        } else if (operator === '[)') {
          description = `大于等于 ${minStr}, 小于 ${maxStr}`;
        } else if (operator === '()') {
          description = `大于 ${minStr}, 小于 ${maxStr}`;
        }
      } else if (['IN', 'NOT IN'].includes(operator)) {
        description = `${operator === 'IN' ? '包含于' : '不包含于'} [${value}]`;
      } else {
        // 其他操作符
        const operatorLabel = OPERATORS.NUMERIC.find(op => op.value === operator)?.label || operator;
        description = `${operatorLabel.split(' ')[0]} ${value}`;
      }

      this.localCondition.conditionDescription = description;
    },
    submitCondition() {
      // 验证表单
      if (this.showValueInput) {
        if (this.isRangeOperator) {
          // 验证区间值
          const [min, max] = this.localCondition.conditionValue;
          if (min === null || min === undefined || max === null || max === undefined) {
            this.$message.warning('请输入完整的区间值');
            return;
          }
        } else if (this.localCondition.conditionValue === null || this.localCondition.conditionValue === undefined || this.localCondition.conditionValue === '') {
          // 验证非区间值
          this.$message.warning('请输入条件值');
          return;
        }
      }

      // 更新条件描述
      this.updateConditionDescription();

      // 提交条件
      this.$emit('submit', { ...this.localCondition });
      this.handleClose();
    }
  }
};
</script>

<style scoped>
.loading-placeholder {
  text-align: center;
  padding: 20px;
  color: #909399;
}

/*
// 禁用状态样式
.el-input.is-disabled .el-input__inner {
     background-color: #F5F7FA;
     border-color: #E4E7ED;
     color: #CFD3DC;
}
 .el-select .el-input__inner {
      color: #CFD3DC;
 }
}
*/
</style>
