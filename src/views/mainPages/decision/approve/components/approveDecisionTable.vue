<template>
  <div class="approveDecisionTable">
    <NoData v-if="list.length === 0" :text="$t('decisionTable.noDecData')" />
    <el-checkbox-group v-else v-model="checkList">
      <div v-for="(item, i) in list" :key="i">
        <el-checkbox class="rule-item-wrapper " :label="item">
          <div v-if="item.before">
            <ApproveDecisionTable
              :is-approve="true"
              :data-item="item.before"
              class="item-wrap"
              @downloadUserTemplate="downloadUserTemplate"
            >
              <template #status>
                <div class="item">
                  <span class="name">{{ $t('common.state') }}：</span>
                  <el-tag
                    :type="handleTableStatus(item.decisionTableStatus)"
                    effect="dark"
                    class=" rule-item-title"
                    size="mini"
                  >
                    {{
                      handleTableStatusText(item.decisionTableStatus, 'before')
                    }}</el-tag>
                </div>
              </template>
            </ApproveDecisionTable>
          </div>
          <div v-if="item.after">
            <ApproveDecisionTable
              :is-approve="true"
              :data-item="item.after"
              :edit="false"
              class="item-wrap"
              @downloadUserTemplate="downloadUserTemplate"
            >
              <template #status>
                <div class="item">
                  <span class="name">{{ $t('common.state') }}：</span>
                  <el-tag
                    :type="handleTableStatus(item.decisionTableStatus)"
                    effect="dark"
                    class=" rule-item-title"
                    size="mini"
                  >
                    {{
                      handleTableStatusText(item.decisionTableStatus, 'after')
                    }}</el-tag>
                </div>
              </template>
            </ApproveDecisionTable>
          </div>
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <div class="footer-btn-wrap">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >{{ $t('common.allSelect') }}</el-checkbox>
      <div>
        <el-button
          class="btn-border medium"
          @click="handleApprove('4')"
        >{{ $t('approvelDetail.returnChange') }}</el-button>
        <el-button
          class="btn-background medium"
          @click="handleApprove('3')"
        >{{ $t('approvelDetail.approvalPass') }}</el-button>
      </div>
      <div />
    </div>
  </div>
</template>

<script>
import {
  GetDecisionTableForApproval,
  PostDecisionTableApproval
} from '@/api/mainPages/decision-table'
import { downloadFile } from '@/utils/utils'
import { handleTableStatus } from '@/views/mainPages/decision/utils'
export default {
  components: {
    DecisionTableItem: () => import('@/components/DecisionTableItem'),
    ApproveDecisionTable: () => import('../../setting/components/ComponentDecisionTableAprrove')
  },
  props: {
    decisionUrlId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      checkList: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  watch: {
    decisionUrlId(val) {
      val && this.GetDecisionTableForApproval()
    }
  },
  created() {
    this.decisionUrlId && this.GetDecisionTableForApproval()
    this.handleTableStatus = handleTableStatus
  },
  methods: {
    GetDecisionTableForApproval() {
      this.list = []
      GetDecisionTableForApproval(this.decisionUrlId).then(res => {
        const list = res.map(item => {
          if (item.before) {
            item.before = {
              ...item.before,
              showPreviewExcel: false,
              url: `${this.$store.state.settings.adp_config.baseURL ||
                process.env.VUE_APP_BASE_API}/export/decisionTable/${
                item.before.decisionTableId
              }`
            }
          }
          if (item.after) {
            item.after = {
              ...item.after,
              showPreviewExcel: false,
              url: `${this.$store.state.settings.adp_config.baseURL ||
                process.env.VUE_APP_BASE_API}/export/decisionTable/${
                item.after.decisionTableId
              }`
            }
          }
          return item
        })
        this.list = list
      })
    },
    // 下载决策表
    downloadUserTemplate(item) {
      downloadFile(
        '/export/decisionTable/' + item.decisionTableId,
        null,
        item.decisionTableName
      )
    },
    handleTableStatusText(status, position) {
      // 0-修改，1-新增，2-删除
      if (status === '0') {
        if (position === 'before') {
          return this.$t('approvelDetail.changeBefore')
        }

        if (position === 'after') {
          return this.$t('approvelDetail.changeAfter')
        }
      }
      if (status === '1') {
        return this.$t('pending.add')
      }
      if (status === '2') {
        return this.$t('pending.del')
      }
    },

    // 全选
    handleCheckAllChange(val) {
      this.checkList = this.list
      this.checkList = val ? this.list : []
      this.isIndeterminate = false
    },

    // 审批
    handleApprove(approvalStatus) {
      const decisionTableSettings = this.checkList.map(item => {
        return {
          ...item,
          before: null,
          after: null
        }
      })
      if (decisionTableSettings.length === 0) {
        this.$message.error(this.$t('decisionTable.selectTable'))
        return
      }
      const data = {
        approvalStatus,
        decisionTableSettings,
        decisionUrlId: this.decisionUrlId
      }
      PostDecisionTableApproval(data).then(res => {
        res
        this.GetDecisionTableForApproval()
        this.checkList = []
      })
    }
  }
}
</script>
<style lang="scss">
.approveDecisionTable {
  @import '@/styles/rule/decisionRule.scss';
  .rule-item-title {
    padding: 0px 10px;
    height: 25px;
    line-height: 25px;
  }
}
</style>
