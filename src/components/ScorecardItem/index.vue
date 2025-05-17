<template>
  <div class="ComponentScorecardItem">
    <!-- 评分卡设置页面 -->
    <div class="r-head mt-15">
      <!-- 预览评分卡 -->
      <el-button
        class="btn-border medium"
        type="mini"
        @click="previewScorecard"
      >{{ $t('decisionTable.preview') }}</el-button>

      <el-popconfirm
        :confirm-button-text="$t('common.ok')"
        :cancel-button-text="$t('common.cancel')"
        :title="$t('scorecardItem.delContent')"
        @onConfirm="deleteScorecard"
      >
        <!-- 移除该评分卡 -->
        <el-button
          slot="reference"
          class="btn-border medium ml-10"
          type="mini"
          :disabled="!edit"
        >删除</el-button>
      </el-popconfirm>
      <span><slot name="status" /></span>
    </div>

    <!-- 添加 r-body 部分 -->
    <div class="r-body">
      <div class="flex-wrap">
        <div class="item">
          <span class="name">{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}</span>
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            :disabled="isApproved || !edit"
            :range-separator="$t('dashboard.to')"
            :start-placeholder="$t('ruleSetting.effTime')"
            :end-placeholder="$t('ruleSetting.noEffTime')"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDateChange"
          />
        </div>
        <div class="item line" />
        <div class="item">
          <span class="name">{{ $t('ruleSetting.path') }}</span>
          <span class="value">{{ item.scorecardPath || '/' }}</span>
        </div>
        <div class="item line" />
        <div class="item">
          <span class="name">{{ $t('scorecardItem.scorecardName') }}</span>
          <span class="value">{{ item.scorecardName }}</span>
        </div>
      </div>
    </div>

    <div v-if="index!==0" class="item moveUp">
      <!-- 上移 -->
      <el-button
        type="text"
        icon="el-icon-upload2"
        @click="moveUpScorecard"
      >{{ $t('decisionTableItem.moveup') }}</el-button>
    </div>
  </div>
</template>

<script>
import { integer } from 'vee-validate/dist/rules'

export default {
  name: 'ScorecardItem',
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    edit: {
      type: Boolean,
      default: true
    },
    index: {
      type: integer,
      default: 0
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      dateRange: [this.item.effectiveDate, this.item.invalidatedDate]
    }
  },
  computed: {
    // 判断评分卡是否不可编辑
    isApproved() {
      // 审批状态为3表示审批通过，0表示待审批
      return this.item && (this.item.approvalStatus === '3' || this.item.approvalStatus === '0');
    }
  },
  watch: {
    item: {
      handler(newVal) {
        this.dateRange = [newVal.effectiveDate, newVal.invalidatedDate];
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    previewScorecard() {
      // 预览评分卡
      this.$emit('previewScorecard', this.item)
    },
    modifyScorecard() {
      // 修改评分卡设置
      this.$emit('modifyScorecard', this.item, this.index)
    },
    deleteScorecard() {
      // 删除评分卡设置
      this.$emit('deleteScorecard', this.item, this.index)
    },
    moveUpScorecard() {
      // 上移评分卡
      this.$emit('moveUpScorecard', this.index)
    },
    handleDateChange(val) {
      // 处理日期变更
      if (val && val.length === 2) {
        // 将生效时间设置为当天的 00:00:00
        const effectiveDate = this.setTimeToMidnight(val[0])

        // 将失效时间设置为当天的 23:59:59
        const invalidatedDate = this.setTimeToEndOfDay(val[1])

        this.$emit('updateDateRange', {
          index: this.index,
          effectiveDate: effectiveDate.getTime(),
          invalidatedDate: invalidatedDate.getTime()
        })
      }
    },

    // 将时间设置为零点
    setTimeToMidnight(date) {
      const newDate = new Date(date)
      newDate.setHours(0, 0, 0, 0)
      return newDate
    },

    // 将时间设置为一天结束 (23:59:59)
    setTimeToEndOfDay(date) {
      const newDate = new Date(date)
      newDate.setHours(23, 59, 59, 0)
      return newDate
    }
  }
}
</script>

<style lang="scss">
.ComponentScorecardItem {
  position: relative;

  .r-body {
    margin-top: 10px;
    padding: 0 22px;

    .flex-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .item {
      margin-right: 20px;
      display: flex;
      align-items: flex-start;

      &.line {
        width: 1px;
        height: 12px;
        background-color: #DCDFE6;
        margin: 0 10px;
      }

      .name {
        color: #60769C;
        font-size: 12px;
        margin-right: 5px;
        font-family: MicrosoftYaHei;
      }

      .value {
        color: #333;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 150px;
        font-family: DINAlternate-Bold, DINAlternate;
        line-height: 23px;
        word-break: break-all;
      }
    }

    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
      width: 368px;
    }

    .el-date-editor .el-range-input {
      color: #333;
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
    }
  }

  &.rule-border {
    border: 1px solid #c0c4cc;
    border-radius: 5px;
  }

  .r-head {
    justify-content: flex-start !important;
    align-items: center;

    .el-button {
      height: 25px;
      font-size: 12px;
    }
  }

  .flex-wrap {
    position: relative;
  }

  .moveUp {
    position: absolute;
    right: 30px;
    top: 1px;
    height: 30px;
  }
}

.approvalStatusDiv {
  margin-left: 20px;
  font-size: 12px;

  .value {
    color: #0079FF
  }
}
</style>
