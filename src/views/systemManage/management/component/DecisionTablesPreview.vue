<template>
  <div v-if="decisionData" class="DecisionTablesPreview rule-wrap">
    <div class=" flex-wrap ">
      <div class="item flex-wrap align-item-center">
        <svg-icon icon-class="ruleId" />
        <span class="name">{{ $t('decisionTable.decisionTableName') }}：</span>
        <span v-if="!updateInput" class="value" :title="decisionData.label">{{ decisionData.label }}</span>
        <el-input
          v-if="updateInput"
          v-model="inputValue"
          :class="['ruleNameInput', { 'is-invalid': isInputInvalid }]"
          :placeholder="$t('ruleManage.enterName')"
          @blur="validateRuleName"
          @keyup.enter.native="submitRuleName"
        />
        <span v-if="updateInput" class="errorMessage">{{ inputErrorMessage }}</span>
        <i v-if="!updateInput" style="color:#0079ff" class="iconEdit el-icon-edit" @click="updateRuleName" />
        <i v-if="updateInput" style="color:#0079ff" class="iconEdit el-icon-check" @click="submitRuleName" />
        <i v-if="updateInput" style="color:#a6a9ad" class="iconEdit el-icon-close" @click="closeInput" />
      </div>
      <div class="item  flex-wrap align-item-center">
        <svg-icon icon-class="path" />
        <span class="name">{{ $t('ruleSetting.path') }}：</span>
        <span class="value" :title="decisionData.parentPath">{{ decisionData.parentPath }}</span>
      </div>
    </div>
    <div class=" flex-wrap ">
      <div class="item  flex-wrap align-item-center">
        <svg-icon icon-class="ruleId" />
        <span class="name">规则说明：</span>
        <span class="value" :title="decisionData.annotation">{{ decisionData.annotation }}</span>
      </div>
      <div class="item  flex-wrap align-item-center">
        <svg-icon icon-class="ruleId" />
        <span class="name">属性分组：</span>
        <span class="value" :title="decisionData.ruleAttributeTagName">{{ decisionData.ruleAttributeTagName }}</span>
      </div>
    </div>
    <div class="text-center mt-30">
      <el-button v-if="!isReset" type="primary" :loading="downloading" :title="decisionData.label" :decision-table-id="decisionData.decisionTableId" @click="testDecisionTables">测试决策表</el-button>
      <el-button v-if="!isReset" type="primary" :loading="downloading" @click="downloadUserTemplate">{{
        $t('decisionTableItem.downloadDec') }}</el-button>
      <el-button v-if="!isReset" type="primary" @click="editPreviewExcel = true">修改决策表</el-button>
      <el-button v-if="!isReset" type="primary" @click="() => showPreviewExcel = true">{{ $t('decisionTableItem.preDec') }}</el-button>
      <el-button v-if="!isReset" :disabled="disabled" type="primary" @click="handleDeleteDecisionTable('1')">{{
        $t('decisionTableItem.del') }}</el-button>
      <el-button v-if="isReset" :disabled="disabled" class="btn-background mini" type="primary" @click="handleDeleteDecisionTable('0')">还原</el-button>
      <!-- <el-button size="small" type="primary" @click="editPreviewExcel = true">修改决策表</el-button>
      <el-button size="small" type="primary" @click="() => showPreviewExcel = true">{{ $t('decisionTableItem.preDec') }}</el-button> -->
      <!-- <el-popconfirm
        class="ml-10"
        :cancel-button-text="$t('common.cancel')"
        title="确定删除规则表?"
        :confirm-button-text="$t('common.fine')"
        :disabled="disabled"
        @onConfirm="handleDeleteDecisionTable"
      >
        <el-button slot="reference" size="small" type="danger" :disabled="disabled">{{ $t('decisionTableItem.del') }}</el-button>
      </el-popconfirm> -->
    </div>
    <PreviewExcel v-if="showPreviewExcel" :bom-base-info-id="$store.state.bom.bomBaseInfo" type="view" :url="url" :show-preview-excel.sync="showPreviewExcel" :title="decisionData.label" :decision-table-id="decisionData.decisionTableId" />
    <template v-if="editPreviewExcel">
<!--      <el-dialog :visible.sync="editPreviewExcel" title="修改决策表" width="80%">-->
<!--        <EditDecisionPreview-->
<!--          ref="ruleEdit"-->
<!--          v-bind="{ url, bomBaseData, decisionRepositoryId, currentNodePath }"-->
<!--          :decision-table-id="decisionData.decisionTableId"-->
<!--          :decision-data-label="decisionData.label"-->
<!--          @addSucess="editPreviewExcel = false,$emit('addSucess')"-->
<!--        />-->
<!--        <div slot="footer">-->
<!--          <el-button @click="editPreviewExcel = false">{{ $t('button.cancel') }}</el-button>-->
<!--          <el-button type="primary" @click="submit">{{ $t('button.OK') }}</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
      <el-dialog :visible.sync="editPreviewExcel" custom-class="edit-decision-table-dialog" title="修改决策表" width="80%">
        <EditDecisionPreview
          ref="ruleEdit"
          v-bind="{ url, bomBaseData, decisionRepositoryId, currentNodePath, type: 'edit' }"
          :decision-table-id="decisionData.decisionTableId"
          :decision-data-label="decisionData.label"
          :decisionData="decisionData"
          :bom-base-info-id="$store.state.bom.bomBaseInfo"
          @addSuccess="editPreviewExcel = false,$emit('addSuccess')"
        />
        <div slot="footer">
          <el-button @click="editPreviewExcel = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ $t('button.OK') }}</el-button>
        </div>
      </el-dialog>
    </template>
    <RuleTest v-if="ruleTestVisible" :id="decisionData.decisionTableId" :dialog-visible.sync="ruleTestVisible" type="table" :url="url" />
  </div>
</template>

<script>
import { downloadFile } from '@/utils/utils'
import { DeleteDecisionTable, submitRuleName } from '@/api/mainPages/decision-table'
import RuleTest from '@/views/systemManage/trialManage/testManage/RuleTest'
import {deleteAttributeTag, invalid} from "@/views/systemManage/rulePropMng/api";
export default {
  components: {
    PreviewExcel: () => import('@/components/PreviewExcel/index1.vue'),
    EditDecisionPreview: () => import('./EditDecisionPreview'),
    RuleTest
  },
  props: {
    decisionData: {
      type: Object,
      default: null
    },
    disabled: {
      // 决策库浏览专用
      type: Boolean,
      default: false
    },
    bomBaseData: {
      type: Array,
      default: null
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    currentNodePath: {
      type: String,
      default: ''
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPreviewExcel: false,
      editPreviewExcel: false,
      isInputInvalid: false,
      inputErrorMessage: '',
      updateInput: false,
      inputValue: '',
      downloading: false,
      ruleTestVisible: false,
      rule: {}
    }
  },
  computed: {
    ruleName() {
      return this.decisionData.label
    },
    url() {
      // return `${this.$store.state.settings.adp_config.baseURL ||
      //   process.env.VUE_APP_BASE_API}/decision/rule/getRuleDefinedByTableId`
      return `${this.$store.state.settings.adp_config.baseURL ||
        process.env.VUE_APP_BASE_API}/export/decisionTable/${this.decisionData.decisionTableId}`
    }
  },
  watch: {
    ruleName() {
      this.updateInput = false
    }
  },
  methods: { // 修改名称验证
    validateRuleName() {
      if (this.inputValue === '') {
        this.isInputInvalid = true
        this.inputErrorMessage = this.$t('ruleManage.noRuleName')
      } else if (this.inputValue.length > 20) {
        this.isInputInvalid = true
        this.inputErrorMessage = this.$t('ruleEdit.one')
      } else {
        this.isInputInvalid = false
        this.inputErrorMessage = ''
      }
    },
    submitRuleName() {
      this.validateRuleName()
      if (!this.isInputInvalid) {
        submitRuleName(this.decisionData.decisionTableId, this.inputValue).then(res => {
          // 刷新树节点和名称
          this.$emit('submitRuleName')
          this.decisionData.label = this.inputValue
        })
      }
    },
    closeInput() {
      this.updateInput = false
      this.isInputInvalid = false
      this.inputErrorMessage = ''
    },
    updateRuleName() {
      this.inputValue = this.decisionData.label
      this.updateInput = true
    },
    handleDeleteDecisionTable(param) {
      this.$confirm('此操作将会变更数据，请确认是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          tableId: this.decisionData.decisionTableId,
          isDeleted: param
        }
        DeleteDecisionTable(data).then(() => {
          this.$emit('getDecisionRepositoryDetail', this.decisionData.parentPath)
          this.$emit('getRestoreRuleList')
        })
      }).catch(() => {

      });

    },

    testDecisionTables() {
      this.ruleTestVisible = true
    },

    // 下载
    downloadUserTemplate() {
      this.downloading = true
      downloadFile(
        '/export/decisionTable/' + this.decisionData.decisionTableId,
        null,
        this.decisionData.label
      ).then(() => {
        this.downloading = false
      }).catch((e) => {
        this.downloading = false
      })
    },
    submit() {
      this.$refs.ruleEdit.saveTable()
    }
  }
}
</script>
<style lang="scss">
.iconEdit {
  margin-left: 10px;
  font-size: 18px;
}

.ruleNameInput {
  width: 200px;
}

.errorMessage {
  color: red;
}
.edit-decision-table-dialog {
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.align-item-center{
  width: 100%;
  .value{
    width: calc(100% - 130px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}
.flex-wrap{
  margin-bottom: 6px;
}
</style>
