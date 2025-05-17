/* eslint-disable no-dupe-keys */
<template>
  <div class="ruleSetting">
    <div class="r-head">
      <slot name="status" />
    </div>
    <div class="r-body">
      <div class="flex-wrap">
        <div class="item">
          <h6>{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}</h6>
          <el-date-picker
            :value="[dataItem.effectiveDate, dataItem.invalidatedDate]"
            disabled
            type="datetimerange"
            :range-separator="$t('dashboard.to')"
            :start-placeholder="$t('ruleSetting.effTime')"
            :end-placeholder="$t('ruleSetting.noEffTime')"
          />
        </div>
        <div class="item line" />
        <div class="item">
          <h6>{{ $t('ruleSetting.path') }}</h6>
          <span class="value">{{ dataItem.path || '/' }}</span>
        </div>

        <div class="item line" />
        <div class="item">
          <h6>{{ $t('scorecardItem.scorecardName') }}</h6>
          <span class="value">{{ dataItem.scorecardName }}</span>
        </div>
      </div>
    </div>

    <div v-if="dataItem.returnOpinion" class="return-opinion">
      <div class="return-title">{{ $t('scorecardApproval.returnChangeAdvice') }}：</div>
      <div class="return-content">{{ dataItem.returnOpinion }}</div>
    </div>

    <!-- 预览评分卡对话框 -->
    <el-dialog
      :title="$t('scorecardItem.preScorecard')"
      :visible.sync="previewVisible"
      width="90%"
      :before-close="handleClosePreview"
    >
      <ScorecardPreview
        v-if="previewVisible"
        :scorecard-info-id="previewScorecardId"
      />
    </el-dialog>
  </div>
</template>

<script>
import ScorecardPreview from './ScorecardPreview'

export default {
  name: 'ScorecardApproveItem',
  components: {
    ScorecardPreview
  },
  props: {
    isApprove: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: () => ({})
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      previewVisible: false,
      previewScorecardId: null
    }
  },
  methods: {
    // 预览评分卡
    previewScorecard() {
      this.$emit('previewScorecard', this.dataItem)
    },

    // 关闭预览对话框
    handleClosePreview() {
      this.previewVisible = false
      this.previewScorecardId = null
    }
  }
}
</script>

<style lang="scss">
.ruleSetting {
  .is-border {
    border: 2px solid #1785ff;
  }

  .no-data {
    text-align: center;
    padding: 20px;
  }

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .value {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      overflow: visible;
    }
    font-size: 14px;
  }

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
      flex-direction: column;
      align-items: flex-start;

      &.line {
        width: 1px;
        height: 30px;
        background-color: #DCDFE6;
        margin: 0 10px;
      }

      h6 {
        color: #60769C;
        font-size: 12px;
        margin: 0 0 5px 0;
        font-weight: normal;
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

  .return-opinion {
    margin-top: 10px;
    padding: 10px;
    background-color: #f0f9eb;
    border-radius: 4px;
    margin-left: 22px;
    margin-right: 22px;

    .return-title {
      font-weight: bold;
      margin-bottom: 5px;
      color: #67c23a;
    }

    .return-content {
      color: #606266;
      line-height: 1.5;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #0079ff;
    margin: 0 5px;
    animation: loading 1.5s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }

    &:nth-child(4) {
      animation-delay: 0.6s;
    }

    &:nth-child(5) {
      animation-delay: 0.8s;
    }
  }

  @keyframes loading {
    0%, 100% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
