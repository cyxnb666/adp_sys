<template>
  <div class="approveShowDetail">
    <!-- 当前的决策路径 -->
    <ComponentCurrentDecisionPath :decision-url-id="decisionUrlId">
      <el-button class="btn-background" @click="handleBackPre">
        {{ $t('ruleDetail.resselectPath') }}
      </el-button>
    </ComponentCurrentDecisionPath>

    <el-tabs v-model="tabValue" type="border-card" class="mt-30">
      <el-tab-pane name="decisionRule" :label="$t('approvelDetail.approvelDetail')">
        <div class="content rule-list">
          <NoData v-if="ruleSetList.length === 0" :text="$t('approvelDetail.noApprovel')" />
          <el-checkbox-group
            v-else
            v-model="checkList"
            @change="handleCheckedCitiesChange"
          >
            <div v-for="items in ruleSetList" :key="items.decisionUrlId">
              <el-checkbox class="rule-item-wrapper" :label="_.last(items)">
                <RuleDetailShow :rule-detail="items" :rule-method-list="ruleMethodList">
                  <template #rule-footer="{ item }">
                    <el-form class="rule-form">
                      <el-form-item>
                        <div class="rule-footer">
                          <el-button
                            class="btn-border"
                            size="mini"
                            :disabled="false"
                            @click="handleRuleItemBack(item)"
                          >
                            {{ $t('approvelDetail.returnChange') }}
                          </el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </template>
                </RuleDetailShow>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="footer-btn-wrap">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >{{ $t('common.allSelect') }}</el-checkbox>
          <div>
            <el-button
              class="btn-border medium"
              @click="handleBack(true)"
            >{{ $t('approvelDetail.returnChange') }}</el-button>
            <el-button
              class="btn-background medium"
              @click="handleApprove"
            >{{ $t('approvelDetail.approvalPass') }}</el-button>
          </div>
          <div />
        </div>
      </el-tab-pane>
      <el-tab-pane name="decisionTable">
        <span slot="label"><i class="el-icon-date" /> {{ $t('approvelDetail.approvelTable') }}</span>
        <ApproveDecisionTable v-if="openPage" ref="decisionTable" :decision-url-id="decisionUrlId" />
      </el-tab-pane>
      <el-tab-pane name="scorecard">
        <!-- 评分卡审批 -->
        <span slot="label"><i class="el-icon-s-data" /> {{ $t('scorecardApproval.scorecardApproval') }}</span>
        <ScorecardApproval
          v-if="tabValue === 'scorecard'"
          :decision-url-id="decisionUrlId"
        />
      </el-tab-pane>
      <el-tab-pane name="ruleFlow">
        <!-- 规则流审批 -->
        <span slot="label"><i class="el-icon-date" /> {{ $t('approvelDetail.approvelRuleflow') }}</span>
        <ApproveRuleflowList
          v-if="tabValue === 'ruleFlow'"
          v-bind="{ decisionUrlId, flowSettingObj, ruleData }"
          :dim-settings.sync="dimSettings"
        />
      </el-tab-pane>

      <el-tab-pane name="decisionTree">
        <!-- 决策树审批 -->
        <span slot="label"><i class="el-icon-date" /> {{ $t('approvelDetail.approvelTree') }}</span>
        <ApproveRuleTreeList
          v-if="tabValue === 'decisionTree'"
          style="margin-top:20px;"
          v-bind="{ decisionAddComponentList, decisionUrlId, ruleData }"
          :dim-settings.sync="dimSettings"
          @refresh="search"
          @toggleComponent="(item) => $emit('toggleComponent', item)"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="$t('approvelDetail.returnChangeAdvice')"
      width="40%"
      :visible.sync="dialogBackVisible"
    >
      <el-form :model="backForm">
        <el-form-item :label="$t('approvelDetail.adviceContent')+':'">
          <el-input
            v-model="backForm.returnOpinion"
            type="textarea"
            :rows="2"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBackVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleBack(false)">{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetRuleApprovalTabular,
  PutRuleApproval,
  PutRuleApprovalReturn
} from '@/api/mainPages/rule-approval'
import { getRuleResults } from '@/api/mainPages/decision'
import { RuleEditor } from '@/utils/RuleEditor'
import ComponentCurrentDecisionPath from '../../components/ComponentCurrentDecisionPath'
import Bus from '@/utils/bus'
import { NODE_TYPE } from '@/utils/poc'
import { getBomModelId } from '@/api/systemManage/bom'
import { getMethodSettingDefine } from '@/api/systemManage/rule-manage'
import ApproveRuleTreeList from './ApproveRuleTreeList.vue'
import ApproveRuleflowList from './ApproveRuleflowList'
export default {
  name: 'ApproveDetail',
  components: {
    ApproveRuleflowList,
    ApproveRuleTreeList,
    ComponentCurrentDecisionPath,
    RuleDetailShow: () =>
      import('@/components/RuleDetailShow/RuleDetailShow.vue'),
    ApproveDecisionTable: () => import('./approveDecisionTable'),
    ScorecardApproval: () => import('@/views/systemManage/management/component/scorecard/ScorecardApproval')
  },
  props: {
    ruleData: {
      type: Object,
      default: null
    },
    decisionUrlId: {
      type: String,
      default: null
    },
    currentRule: {
      type: Array,
      default: function() {
        return []
      }
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    flowSettingObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tabValue: 'decisionRule',
      isIndeterminate: false,
      checkAll: false,
      showAllRule: false,
      ruleSetList: [],
      checkList: [],
      bomModelId: null,
      ruleMethodList: [],
      thenList: null,
      elseList: null,
      ruleResults: [], // 执行结果
      dialogBackVisible: false, // 退回弹出框
      backForm: {
        returnOpinion: ''
      },
      openPage: false
    }
  },

  created() {
    this.ruleEditor = new RuleEditor()
    this.getRuleResults()
    this.decisionUrlId && this.GetRuleApprovalTabular(this.decisionUrlId)
    this.NODE_TYPE = NODE_TYPE
    this.getBomModelId()
  },
  methods: {
    getBomModelId() {
      getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
        this.bomModelId = res
      })
    },
    // 单个规则退回
    handleRuleItemBack(item) {
      this.checkList = []
      this.checkList.push(item)
      this.handleBack(true)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.ruleSetList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.ruleSetList.length
    },
    GetRuleApprovalTabular(data) {
      if (!data) {
        return
      }
      this.openPage = true
      GetRuleApprovalTabular(data).then(async(res) => {
        const { ruleApprovals, codeServices } = res
        codeServices &&
          this.$store.dispatch('app/SET_CODESERVICE', codeServices.toString())
        const list = ruleApprovals.map((item) => {
          const arr = []
          // flagIsRemoveRuleSetting | 0-修改，1-新增，2-删除
          if (item.ruleStatus === '0') {
            const obj1 = this.handleData(item.before)
            const obj2 = this.handleData(item.after)
            obj1.title = this.$t('approvelDetail.changeBefore')
            obj2.title = this.$t('approvelDetail.changeAfter')

            obj2.formModify = {
              time: [item.flagEffectiveDate, item.flagInvalidatedDate],
              ruleForward: item.flagRuleForward,
              ruleResult: item.flagRuleResult,
              ruleTest: item.flagRuleTest,
              rulePassCode: item.flagRulePassCode
            }

            item.ruleParamList.forEach((element) => {
              // path 为null为根节点
              let node = null
              if (element.path) {
                const p = element.path.substr(1)
                node = this._.get(obj2.ruleSettingContent, p)
              } else {
                node = obj2.ruleSettingContent
              }

              // node 引用对象obj2.ruleSettingContent
              if (node) {
                if (element.paramId) {
                  const modifyParamId = node.modifyParamId
                  if (modifyParamId === undefined) {
                    node.modifyParamId = [element.paramId]
                  } else {
                    node.modifyParamId.push(element.paramId)
                  }
                } else {
                  node['modify'] = true
                }
              }
            })

            obj1.ruleArray = this.ruleEditor.convertNodeTreeToArray(
              this._.cloneDeep(obj1.ruleSettingContent),
              []
            ) // 把treeNode转换为nodeArray
            obj2.ruleArray = this.ruleEditor.convertNodeTreeToArray(
              this._.cloneDeep(obj2.ruleSettingContent),
              []
            ) // 把treeNode转换为nodeArray
            arr.push({ ...item.after, ...obj1 }, { ...item.after, ...obj2 })
          } else if (item.ruleStatus === '1') {
            const obj = this.handleData(item.after)
            obj.ruleArray = this.ruleEditor.convertNodeTreeToArray(
              this._.cloneDeep(obj.ruleSettingContent),
              []
            ) // 把treeNode转换为nodeArray
            obj.title = this.$t('pending.add')
            arr.push({ ...item.after, ...obj })
          } else if (item.ruleStatus === '2') {
            const obj = this.handleData(item.before)
            obj.ruleArray = this.ruleEditor.convertNodeTreeToArray(
              this._.cloneDeep(obj.ruleSettingContent),
              []
            ) // 把treeNode转换为nodeArray
            obj.title = this.$t('pending.del')
            arr.push({ ...item.before, ...obj })
          }

          return arr
        })
        this.ruleSetList = list
        this.ruleSetList.forEach(async(item, index) => {
          if (item.length === 1) {
            const data = {
              bomModelId: this.bomModelId,
              ruleId: item[0].ruleId
            }
            await getMethodSettingDefine(data).then(res => {
              if (res.thenList.length !== 0) {
                item[0].thenList = this.getText(res.thenList)
              } else {
                item[0].thenList = ''
              }
              if (res.elseList.length !== 0) {
                item[0].elseList = this.getText(res.elseList)
              } else {
                item[0].elseList = ''
              }
            })
          } else if (item.length > 1) {
            item.forEach(async(items, index) => {
              const data = {
                bomModelId: this.bomModelId,
                ruleId: items.ruleId
              }
              await getMethodSettingDefine(data).then(res => {
                if (res.thenList.length !== 0) {
                  items.thenList = this.getText(res.thenList)
                } else {
                  items.thenList = ''
                }
                if (res.elseList.length !== 0) {
                  items.elseList = this.getText(res.elseList)
                } else {
                  items.elseList = ''
                }
              })
            })
          }
        })
      })
    },
    getText(treeNode) {
      let html = ''
      treeNode.forEach((item, index) => {
        if (index !== 0) {
          html += '<br>'
        }
        html += (index + 1) + '. '
        html += '<span class="fields">' + item.expressionArray[0].desc + '</span>'
        Object.values(item.paramValue).forEach(valueItem => {
          html += ' <span class="values">' + valueItem + '</span>;'
        })
      })
      return html
    },
    expressionTransferFn1(items) {
      const paramValue = {}

      items.expressionArray.forEach((item) => {
        if (item.type === 'input') {
          paramValue[item.paramId] = ''
        }
      })

      const expressionNode = {}
      // expressionNode.label = expressDesc
      expressionNode.nodeType = NODE_TYPE.EXPRESSION // 节点类型
      expressionNode.codeService = items.codeService
      expressionNode.expressionId = items.expressionId
      expressionNode.returnType = items.returnType
      expressionNode.paramValue = items.paramValue

      return expressionNode
    },
    // 转换
    handleData(item) {
      const obj = {}
      obj.form = {
        time: [
          item.effectiveDate || -28800000,
          item.invalidatedDate || 3155731200000
        ],
        ruleForward: item.ruleForward,
        ruleResult: item.ruleResult,
        ruleTest: item.ruleTest,
        rulePassCode: item.rulePassCode
      }
      // eslint-disable-next-line no-eval
      obj.ruleSettingContent = eval('(' + item.ruleSettingContent + ')')
      return obj
    },

    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.ruleResults = res
      })
    },
    // 审核通过
    handleApprove() {
      const data = this.checkList.map((item) => {
        return {
          id: item.id,
          ruleId: item.ruleId,
          ruleStatus: item.ruleStatus,
          decisionUrlId: this.decisionUrlId
        }
      })
      if (data.length < 1) {
        return this.$message.error(this.$t('approvelDetail.selectRule'))
      }
      PutRuleApproval(data).then((res) => {
        this.$message.success(res)
        this.checkList = []
        this.checkAll = false
        this.GetRuleApprovalTabular(this.decisionUrlId) // 查询数据
        Bus.$emit('searchPath') // 调用兄弟组件的查询接口
        this.$emit('toggleComponent', 'RuleList') // 调用父组件切换显示
        // this.$route.push('/decision/approve')
      })
    },

    // 审核驳回
    handleBack(val) {
      const data = this.checkList.map((item) => {
        return {
          id: item.id,
          ruleId: item.ruleId,
          ruleStatus: item.ruleStatus,
          decisionUrlId: this.decisionUrlId,
          returnOpinion: this.backForm.returnOpinion
        }
      })
      if (data.length < 1) {
        return this.$message.error(this.$t('approvelDetail.selectRule'))
      }
      if (val) {
        // eslint-disable-next-line no-return-assign
        return (this.dialogBackVisible = true)
      }
      PutRuleApprovalReturn(data).then((res) => {
        this.$message.success(res)
        this.checkList = []
        this.GetRuleApprovalTabular(this.decisionUrlId) // 查询数据
        this.backForm.returnOpinion = ''
        this.dialogBackVisible = false
      })
    },

    // 返回重新选择决策路径
    handleBackPre() {
      Bus.$emit('searchPath') // 调用兄弟组件的查询接口
      this.$emit('toggleComponent', 'RuleList') // 调用父组件切换显示
    },

    // 全选
    handleCheckAllChange(val) {
      const arr = []
      this.ruleSetList.forEach((items) => {
        arr.push(this._.last(items))
      })
      this.checkList = val ? arr : []
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang="scss">
.approveShowDetail {
  @import "../../style.scss";
  //  transform:translate(0,0);
  margin-bottom: 50px;
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
    .rule-footer {
      display: flex;
      justify-content: flex-end;
      padding: 6px 0;
    }
  }
  .el-checkbox {
    .rule-noData {
      min-height: 50px;
    }
  }
  .rule-form {
    .el-form-item, .el-form-item__content {
      width: 100%;
    }
  }
}
</style>
