<template>
  <div class="scorecard-approval">
    <NoData v-if="list.length === 0" :text="$t('scorecardApproval.noScorecardApproval')" />
    <el-checkbox-group v-else v-model="checkList">
      <div v-for="(item, i) in list" :key="i">
        <el-checkbox class="rule-item-wrapper" :label="item">
          <div v-if="item.before">
            <ScorecardApproveItem
              :is-approve="true"
              :data-item="item.before"
              class="item-wrap"
              @previewScorecard="previewScorecard"
            >
              <template #status>
                <div class="item">
                  <span class="name">{{ $t('common.state') }}：</span>
                  <el-tag
                    :type="handleStatus(item.scorecardStatus)"
                    effect="dark"
                    class="rule-item-title"
                    size="mini"
                  >
                    {{ handleStatusText(item.scorecardStatus, 'before') }}
                  </el-tag>
                </div>
              </template>
            </ScorecardApproveItem>
          </div>
          <div v-if="item.after">
            <ScorecardApproveItem
              :is-approve="true"
              :data-item="item.after"
              :edit="false"
              class="item-wrap"
              @previewScorecard="previewScorecard"
            >
              <template #status>
                <div class="item">
                  <span class="name">{{ $t('common.state') }}：</span>
                  <el-tag
                    :type="handleStatus(item.scorecardStatus)"
                    effect="dark"
                    class="rule-item-title"
                    size="mini"
                  >
                    {{ handleStatusText(item.scorecardStatus, 'after') }}
                  </el-tag>
                </div>
              </template>
            </ScorecardApproveItem>
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
        >{{ $t('scorecardApproval.returnChange') }}</el-button>
        <el-button
          class="btn-background medium"
          @click="handleApprove('3')"
        >{{ $t('scorecardApproval.approvalPass') }}</el-button>
      </div>
      <div />
    </div>


  </div>
</template>

<script>
import { getScorecardForApproval, postScorecardApproval } from '@/api/mainPages/scorecard'
import { handleStatus } from '@/views/mainPages/decision/utils'
import NoData from '@/components/NoData'

export default {
  components: {
    NoData,
    ScorecardApproveItem: () => import('./ScorecardApproveItem')
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
      val && this.getScorecardForApproval()
    }
  },
  created() {
    this.decisionUrlId && this.getScorecardForApproval()
    this.handleStatus = handleStatus
  },
  methods: {
    getScorecardForApproval() {
      this.list = []
      getScorecardForApproval(this.decisionUrlId).then(res => {
        // 处理数据，添加 before 和 after 字段
        const list = (res || []).map(item => {
          // 根据 scorecardStatus 构造 before 和 after 字段
          if (item.scorecardStatus === '0') {  // 修改
            return {
              ...item,
              before: { ...item }
              // 不设置 after 字段，只显示一条记录，状态为"修改"
            }
          } else if (item.scorecardStatus === '1') {  // 新增
            return {
              ...item,
              after: { ...item }
            }
          } else if (item.scorecardStatus === '2') {  // 删除
            return {
              ...item,
              before: { ...item }
            }
          } else {
            return item
          }
        })
        this.list = list
      })
    },

    // 预览评分卡
    previewScorecard(item) {
      this.$router.push({
        path: '/scorecard/preview',
        query: {
          scorecardInfoId: item.scorecardInfoId
        }
      })
    },
    handleStatusText(status, position) {
      // scorecardStatus字段：0-修改，1-新增，2-删除
      // approvalStatus字段：0-待审批，1-一级审批，2-二级审批，3-审批通过，4-退回修改，5-无需审批，6-审批不通过
      if (status === '0') {
        // 无论 position 参数的值是什么，都返回 "修改"
        return this.$t('pending.modify')
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
      this.checkList = val ? this.list : []
      this.isIndeterminate = false
    },

    // 审批
    handleApprove(approvalStatus) {
      if (this.checkList.length === 0) {
        this.$message.error(this.$t('scorecardApproval.selectScorecard'))
        return
      }

      this.submitApproval(approvalStatus)
    },

    // 提交审批
    submitApproval(approvalStatus) {
      // 只传递必要的字段
      const scorecardSettings = this.checkList.map(item => {
        // 使用原始对象，保留所有字段
        const setting = { ...item }
        // 移除 before 和 after 字段
        if (setting.before) delete setting.before
        if (setting.after) delete setting.after
        // 设置审批状态
        setting.approvalStatus = approvalStatus
        return setting
      })

      const data = {
        approvalStatus,
        scorecardSettings,
        approvalBy: this.$store.state.user.name
      }

      postScorecardApproval(data).then(() => {
        this.getScorecardForApproval()
        this.checkList = []
      })
    }
  }
}
</script>

<style lang="scss">
.scorecard-approval {
  @import '@/styles/rule/decisionRule.scss';

  .rule-item-wrapper {
    margin: 30px 0;
    background: #fff;
    position: relative;
    width: 100%;
    border: 2px solid transparent;

    &::before {
      content: "";
      width: calc(100% + 4px);
      top: -2px;
      left: -2px;
      height: 2px;
      position: absolute;
      background: #0079ff;
    }

    &.is-checked {
      border: 2px solid #0079ff;
    }

    .el-checkbox {
      padding-left: 15px;
    }

    .el-checkbox__label {
      display: inline;
    }

    .el-checkbox.is-checked {
      color: #606273;
      .el-checkbox__input,
      .el-radio {
        border: none;
      }
    }

    .el-checkbox {
      display: flex;
      align-items: center;
    }

    .el-checkbox__label {
      display: block;
      width: 100%;
    }
  }

  .rule-item-title {
    padding: 0px 10px;
    height: 25px;
    line-height: 25px;
  }

  .footer-btn-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }

  .item-wrap {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
