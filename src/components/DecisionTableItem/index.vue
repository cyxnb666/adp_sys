<template>
  <div class="ComponentDecisionTableItem">
    <!-- 决策表设置页面 -->
    <div class="r-head mt-15">
      <!-- 增加前置规则 -->
      <!-- <el-button
        slot="reference"
        class="btn-border medium ml-10"
        type="mini"
        :disabled="!edit"
        @click="$emit('addPrefixRule', item, index)"
      > 选择前置规则 </el-button> -->
      <!-- 预览决策表 -->
      <el-button
        class="btn-border medium"
        type="mini"
        @click="item.showPreviewExcel = true"
      >{{ $t('decisionTableItem.preDec') }}</el-button>
      <!-- 修改决策表 -->
      <!-- <el-button
        class="btn-border medium"
        type="mini"
        :disabled="!edit"
        @click="$emit('modifyDecisionTable', item)"
      >{{ $t('decisionTableItem.modifieDec') }}</el-button> -->
      <!-- 下载决策表 -->
      <el-button
        class="btn-border medium"
        type="mini"
        @click="$emit('downloadUserTemplate', item)"
      >{{ $t('decisionTableItem.downloadDec') }}</el-button>
      <el-popconfirm
        :confirm-button-text="$t('common.ok')"
        :cancel-button-text="$t('common.cancel')"
        title="请确认是否删除该决策表数据？"
        @onConfirm="$emit('DeleteDecisionTable', item)"
      >
        <!-- 移除该决策表 -->
        <el-button
          slot="reference"
          class="btn-border medium ml-10"
          type="mini"
          :disabled="!edit"
        >{{ $t('decisionTableItem.delDec') }}</el-button>
      </el-popconfirm>
      <span><slot name="status" /></span>
    </div>
    <!-- <div class="r-body">
      <div class="flex-wrap left">
        <div class="item">
          <span class="name">{{ $t('ruleSetting.path') }}：</span>
          <span class="value">/{{ item.path }}</span>
        </div>
        <span class="item"> | </span>
        <div class="item">
          <span class="name">{{ $t('decisionTableItem.decisionTableName') }}：</span>
          <span class="value">{{ item.decisionTableName }}</span>
        </div>
        <span class="item"> | </span>
        <slot name="status" />
        <div class="item">
          <span>{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}：</span>
          <el-date-picker
            :value="[item.effectiveDate, item.invalidatedDate]"
            type="datetimerange"
            :range-separator="$t('dashboard.to')"
            :start-placeholder="$t('ruleSetting.effTime')"
            :end-placeholder="$t('ruleSetting.noEffTime')"
          />
        </div>
      </div>
    </div> -->
    <div v-if="index!==0" class="item moveUp">
      <!-- 上移 -->
      <el-button
        type="text"
        icon="el-icon-upload2"
        @click="moveUpDecisionTable(item)"
      >{{ $t('decisionTableItem.moveup') }}</el-button>
      <!-- <el-button
        class="btn-border medium moveUp"
        type="mini"
        @click="moveUpDecisionTable(item)"
      >{{ $t('decisionTableItem.moveup') }}</el-button> -->
    </div>
    <PreviewExcel
      :url="item.url"
      v-if="item.showPreviewExcel"
      :bom-base-info-id="$store.state.bom.bomBaseInfo" type="view"
      :show-preview-excel.sync="item.showPreviewExcel"
       :decision-table-id="item.decisionTableId"
      :title="item.decisionTableName"
    />
  </div>
</template>

<script>
import { adjustDTOrder } from '@/api/mainPages/decision-table'
import { integer } from 'vee-validate/dist/rules'
export default {
  components: {
    PreviewExcel: () => import('@/components/PreviewExcel/index1')
  },
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
      dialogTableVisible: false
    }
  },
  mounted() {
  },
  methods: {
    async moveUpDecisionTable(item) {
      const data = {
        decisionUrlId: item.decisionUrlId,
        decisionTableSettingId: item.decisionTableSettingId,
        decisionTableId: item.decisionTableId
      }
      await adjustDTOrder(data)
      this.$emit('retrieveData', this.index)
    }
  }
}
</script>
<style lang="scss">
.ComponentDecisionTableItem {
  position: relative;
  .r-body {
    .item {
      flex-direction: row !important;
      align-items: center;
      span {
        font-size: 11px;
      }
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
  .flex-wrap{
    position: relative;
  }
  .moveUp{
    position: absolute;
    right: 30px;
    top: 1px;
    height: 30px;
  }
}
.approvalStatusDiv{
  margin-left: 20px;
  font-size: 12px;
  .value{
    color: #0079FF
  }
}
</style>
