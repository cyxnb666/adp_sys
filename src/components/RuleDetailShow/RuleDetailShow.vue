<template>
  <div class="RuleDetailShow">
    <el-form v-if="ruleDetail" disabled :inline="true">
      <div
        v-for="(item, index) in ruleDetail"
        :key="item.id + index"
        class="rule-border item-wrap"
      >
        <div class="r-head">
          <div class="left rule-item">
            <div class="item align-item-center">
              <slot :item="item">
                <span class="name">{{ $t('common.state') }}：</span>
                <el-tag
                  :type="handelRuleStatus(item.ruleStatus)"
                  effect="dark"
                  class="rule-item-title"
                >{{ item.title }}</el-tag>
              </slot>
            </div>
            <span class="item"> | </span>
            <div class="item align-item-center">
              <img
                class="icon icon-rule-mini"
                src="./images/icon-tag.png"
                alt=""
              >
              <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
              <span class="value">{{ item.ruleId }}</span>
            </div>
            <span class="item"> | </span>
            <div class="item align-item-center">
              <img
                class="icon icon-rule-mini"
                src="./images/icon-tag.png"
                alt=""
              >
              <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
              <span class="value">{{ item.ruleName }}</span>
            </div>
            <span class="item"> | </span>
            <div class="item align-item-center">
              <img
                class="icon icon-rule-mini"
                src="./images/icon-share.png"
                alt=""
              >
              <span class="name">{{ $t('ruleSetting.path') }}：</span>
              <span class="value">{{ item.path ? item.path : "/" }}</span>
            </div>
            <span class="item"> | </span>
            <div class="item align-item-center mr-15">
              <span class="name">{{ $t('userInfo.approvalStatus') }}：</span>
              <span
                class="value f14"
                :class="'approval_status_' + item.approvalStatus"
                :style="{width:lang==='zh'?'70px':'50px'}"
              >
                <el-popover trigger="hover" width="200" :content="handleStatus(item.approvalStatus)">
                  <span slot="reference">{{ handleStatus(item.approvalStatus) }}</span>
                </el-popover>
                <!-- {{ handleStatus(item.approvalStatus) }} -->
              </span>
            </div>
          </div>
        </div>
        <div class="r-body">
          <div class="flex-wrap">
            <div v-if="item" class="item">
              <h6>{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}</h6>
              <el-date-picker
                v-model="item.form.time"
                type="datetimerange"
                :range-separator="$t('dashboard.to')"
                :start-placeholder="$t('ruleSetting.effTime')"
                :end-placeholder="$t('ruleSetting.noEffTime')"
                disabled
              />
            </div>
            <div class="item line" />
            <div class="item">
              <h6>{{ $t('ruleSetting.forwardAndRe') }}</h6>
              <el-radio-group
                v-model="item.form.ruleForward"
                :class="{
                  modify: _.get(item, 'formModify.ruleForward'),
                }"
                disabled
              >
                <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio>
              </el-radio-group>
            </div>
            <div class="item line" />
            <div class="item">
              <h6>{{ $t('ruleDetailShow.ruleNoPass') }}</h6>
              <el-radio-group
                v-model="item.form.ruleResult"
                :class="{
                  modify: _.get(item, 'formModify.ruleResult'),
                }"
                disabled
              >
                <el-radio
                  v-for="resultItem in ruleResults"
                  :key="resultItem.resultCode"
                  :label="resultItem.resultCode"
                >{{ resultItem.resultName }}</el-radio>
              </el-radio-group>
            </div>
            <div class="item line" />
            <div class="item">
              <h6>{{ $t('ruleSetting.trial') }}</h6>
              <el-radio-group
                v-model="item.form.ruleTest"
                :class="{ modify: _.get(item, 'formModify.ruleTest') }"
                disabled
              >
                <el-radio label="1">{{ $t('common.yes') }}</el-radio>
                <el-radio label="0">{{ $t('common.no') }}</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="ruleContent-wrapper tree-wrapper">
            <span>{{ $t('common.if') }}: </span>
            <span v-for="(node, nodeIndex) in item.ruleArray" :key="nodeIndex">
              <span
                v-if="node && node.nodeType === NODE_TYPE.COMPARISON"
                class="node-tag"
                type="success"
              >
                <RuleRender :node="node.left" />
                <RuleRender :node="node" />
                <RuleRender :node="node.right" />
              </span>
              <span
                v-else-if="node && node.nodeType === NODE_TYPE.LOGICAL"
                class="node-tag"
              >
                <RuleRender :node="node" />
              </span>
              <span v-else class="node-tag" type="success">
                <RuleRender :node="node" />
              </span>
            </span>
            <div v-if="item.form.ruleForward != '0'" class="forward_direction">
              <div class="rule-else">
                <el-form-item class="rule-else-item" :label="$t('common.then')">
                  <el-input
                    v-model="item.form.rulePassCode"
                    style="width: 182px"
                    size="mini"
                  />
                  <div v-html="item.thenList" />
                </el-form-item>
              </div>
              <div class="rule-error">
                <span style="padding-right: 20px">{{ $t('common.else') }}</span>
                <el-form-item
                  :prop="'ruleSetList.' + index + '.form.ruleResult'"
                  :rules="[
                    {
                      required: true,
                      message: $t('ruleSetting.ruleRes'),
                      trigger: 'change',
                    },
                  ]"
                >
                  <el-radio-group v-model="item.form.ruleResult">
                    <el-radio
                      v-for="resultItem in ruleResults"
                      :key="resultItem.resultCode"
                      :label="resultItem.resultCode"
                    >{{ resultItem.resultName }}</el-radio>
                  </el-radio-group>
                  <div v-html="item.elseList" />
                </el-form-item>
              </div>
            </div>

            <div v-else class="reverse_direction">
              <div class="rule-error">
                <el-form-item
                  :prop="'ruleSetList.' + index + '.form.ruleResult'"
                  :rules="[
                    {
                      required: true,
                      message: $t('ruleSetting.ruleRes'),
                      trigger: 'change',
                    },
                  ]"
                >
                  <span style="padding-right: 20px">{{ $t('common.then') }}</span>
                  <el-radio-group v-model="item.form.ruleResult">
                    <el-radio
                      v-for="resultItem in ruleResults"
                      :key="resultItem.resultCode"
                      :label="resultItem.resultCode"
                    >{{ resultItem.resultName }}</el-radio>
                  </el-radio-group>
                  <div v-html="item.elseList" />
                </el-form-item>
              </div>

              <div class="rule-else">
                <el-form-item class="rule-else-item" :label="$t('common.else')">
                  <el-input
                    v-model="item.form.rulePassCode"
                    style="width: 182px"
                    size="mini"
                  />
                  <div v-html="item.thenList" />
                </el-form-item>
              </div>
            </div>
          </div>
          <slot name="rule-footer" :item="item" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getRuleResults } from '@/api/mainPages/decision'
import RuleRender from '@/components/PocRender/PocRender'
import { NODE_TYPE } from '@/utils/poc'
import { handleStatus } from '@/views/mainPages/decision/utils'
export default {
  components: {
    RuleRender
  },
  props: {
    ruleDetail: {
      type: Array,
      default: null
    },
    ruleMothodList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      ruleResults: [], // 执行结果
      handleStatus
    }
  },
  created() {
    this.getRuleResults()
    this.NODE_TYPE = NODE_TYPE
  },
  mounted() {
    this.getRuleResults()
  },
  methods: {
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.$nextTick(() => {
          this.ruleResults = res
        })
      })
    },
    handelRuleStatus(status) {
      // 0-修改，1-新增，2-删除
      if (status === '0') {
        return 'warning'
      }
      if (status === '1') {
        return 'success'
      }
      if (status === '2') {
        return 'danger'
      }
    }
  }
}
</script>
<style lang="scss">
.RuleDetailShow {
  @import "./style.scss";
  @import "@/styles/rule/decisionRule.scss";
  margin-top: 15px;
  background-color: #fff;
  .rule-item-title {
    height: 25px;
    line-height: 25px;
  }
  .rule-else,
  .rule-error {
    padding-top: 10px;
    .rule-else-item {
      .el-form-item__label {
        padding-right: 20px;
      }

    }
  }
  .modifyInput {
    // background: red;
    border: 1px solid #f56c6c !important;
    border-radius: 3px;
    ::v-deep input .el-input__inner {
      color: #f56c6c !important;
    }
  }
}
</style>
