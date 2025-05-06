<template>
  <div class="add-decision-table-item">
    <div class="title">
      <span>评分容器</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form-item prop="scoreContainerFieldName" label="选择存储总分的字段" required>
          <el-input
            ref="containerInput"
            v-model="scorecardData.scoreContainerFieldName"
            readonly
            placeholder="点击选择 BOM 字段"
            style="width: 100%;"
          >
            <el-button slot="append" icon="el-icon-search" @click="openBomSelector">选择</el-button>
          </el-input>
          <el-input v-model="scorecardData.scoreContainerFieldPath" type="hidden" style="display: none;"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="总分">
          <span class="total-score-display">-</span>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 使用新的BOM选择器 -->
    <scorecard-bom-selector
      :visible.sync="bomSelectorVisible"
      :bom-base-info-id="bomBaseInfoId"
      :field-type-filter="numericTypes"
      return-type="simple"
      @field-selected="handleFieldSelected"
    />
  </div>
</template>

<script>
import ScorecardBomSelector from './ScorecardBomSelector.vue'

export default {
  name: 'ScorecardScoreContainer',
  components: {
    ScorecardBomSelector
  },
  props: {
    scorecardData: {
      type: Object,
      required: true
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bomSelectorVisible: false,
      numericTypes: ['Integer', 'Double', 'Float', 'Long', 'BigDecimal', 'int', 'double', 'float', 'long']
    };
  },
  mounted() {
  },
  methods: {
    openBomSelector() {
      // 在打开BOM选择器前聚焦到输入框
      if (this.$refs.containerInput) {
        this.$refs.containerInput.focus();
      }

      // 打开BOM选择器
      this.bomSelectorVisible = true;
    },

    // 处理字段选择
    handleFieldSelected(fieldData) {
      // 更新scorecardData
      this.scorecardData.scoreContainerFieldPath = fieldData.fieldPath;

      // 直接使用fieldName，它已经是完整的中文路径
      this.scorecardData.scoreContainerFieldName = fieldData.fieldName;
      this.scorecardData.scoreContainerFieldType = fieldData.fieldType;

      // 显示成功消息
      this.$message.success('字段选择成功');
    }
  }
}
</script>

<style lang="scss" scoped>
.total-score-display {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  background-color: #f5f7fa;
  color: #606266;
}

.score-note {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  font-style: italic;
}
</style>
