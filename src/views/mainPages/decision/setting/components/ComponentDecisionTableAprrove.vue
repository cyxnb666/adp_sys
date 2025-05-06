/* eslint-disable no-dupe-keys */
<template>
  <div class="ruleSetting">
    <slot name="status" />
    <transition name="slide-fade">
      <div v-if="loading" class="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <el-form v-else ref="ruleSectionForm" :model="ruleSetListForm" :inline="true">
        <ValidationObserver ref="obs" tag="form">
          <div
            v-if="ruleSetListForm.ruleSetList.length"
            class="content rule-list"
          >
            <!--  0-待审批，1-审批通过，2-退回修改，3-无需审批,4-审批不通过 -->
            <div
              v-for="(item, index) in ruleSetListForm.ruleSetList"
              :key="index"
              v-loading="showRule"
              :class="[
                'status_' + item.approvalStatus,
                { 'is-border': item.children ? true : false },
              ]"
            >
              <div class="r-body">
                <div class="flex-wrap">
                  <div class="item">
                    <h6>{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}</h6>
                    <el-date-picker
                      v-model="item.time"
                      :disabled="item.ruleSettingContent?false:true"
                      type="datetimerange"
                      :range-separator="$t('dashboard.to')"
                      :start-placeholder="$t('ruleSetting.effTime')"
                      :end-placeholder="$t('ruleSetting.noEffTime')"
                    />
                  </div>
                  <div class="item line" />
                  <div class="item">
                    <h6>{{ $t('ruleSetting.path') }}</h6>
                    <span class="value">/{{ item.path }}</span>
                  </div>

                  <div class="item line" />
                  <div class="item">
                    <h6>{{ $t('decisionTableItem.decisionTableName') }}</h6>
                    <span class="value">{{ item.decisionTableName }}</span>
                  </div>
                </div>

                <!-- 规则展示部分 -->
                <div v-show="item.ruleId">
                  <div class="ruleContent-wrapper">
                    <span style="font-size:16px;font-weight:bold;">如果: </span>
                    <span>
                      <!-- <el-popover popper-class="item" trigger="hover" effect="dark">
                        <div slot="reference" v-html="item.ruleSettingDesc" />
                      </el-popover> -->
                      <!-- <div class="item" v-html="item.ruleSettingDesc" /> -->
                      <div v-html="item.ruleSettingDesc" />
                    </span>

                  </div>

                  <!-- 正反向切换控制显示  start-->
                  <!-- 正向 -->
                  <!-- 那么 -->
                  <!-- <div v-if="item.form.ruleForward != '0'" class="forward_direction">
                    <div class="rule-else ruleContent-wrapper">
                      <span>
                        <span style="font-size: 16px; font-weight: bold;margin-right:10px;">那么</span>
                        <div v-if="item.form.rulePassCode">规则提示{{ item.form.rulePassCode }}
                        </div>
                        <div v-html="item.thenListText" />
                      </span>
                    </div> -->

                    <!-- 否则 -->
                    <!-- <div class="rule-error ruleContent-wrapper" style="margin-top:10px;">
                      <span>
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
                        <div v-html="item.elseListText" />
                        <div>{{ RuleResultsList[item.form.ruleResult] }}</div>
                      </span>
                    </div>

                  </div> -->

                  <!-- 反向 -->
                  <!-- <div v-else class="reverse_direction">
                    <div class="rule-error ruleContent-wrapper">
                      <span>
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">那么</span>
                        <div v-html="item.elseListText" />
                        <div>{{ RuleResultsList[item.form.ruleResult] }}</div>
                      </span>
                    </div>

                    <div class="rule-else ruleContent-wrapper" style="margin-top:10px;">
                      <span>
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
                        <span v-if="item.form.rulePassCode">规则提示{{ item.form.rulePassCode }}</span>
                        <div v-html="item.thenListText" />
                      </span>
                    </div>

                  </div> -->
                  <!-- 正反向切换控制显示  end-->
                </div>

              </div>
              <!-- 产出试运行 -->
              <!-- <div v-if="item.children" style="padding: 20px" class="output-rule">
                <div class="r-head">
                  <div class="left rule-item">
                    <div class="item align-item-center setting_item">
                      <svg-icon icon-class="ruleId" />
                      <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
                      <span class="value">{{ item.children.ruleId }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center setting_item">
                      <svg-icon icon-class="ruleId" />
                      <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
                      <span class="value value_cut">{{ item.children.ruleName }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center setting_item">
                      <svg-icon icon-class="path" />
                      <span class="name">{{ $t('ruleSetting.path') }}：</span>
                      <span class="value value_cut">{{
                        item.children.path ? item.children.path : "/"
                      }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center mr-15 setting_item">
                      <span class="name">{{ $t('userInfo.approvalStatus') }}：</span>
                      <span
                        class="value f14"
                        :class="'approval_status_' + item.children.approvalStatus
                        "
                        :style="{ width: lang === 'zh' ? '70px' : '50px' }"
                      >
                        <el-popover trigger="hover" width="200" :content="handleStatus(item.children.approvalStatus)">
                          <span slot="reference">{{ handleStatus(item.children.approvalStatus) }}</span>
                        </el-popover>
                      </span>
                    </div>

                    <div v-if="item.children.approvalStatus === '2'" class="item align-item-center mr-15">
                      <span class="name">{{ $t('ruleSetting.returnAdvice') }}：</span>
                      <el-popover
                        placement="top-start"
                        :title="$t('ruleSetting.reContent')"
                        width="200"
                        trigger="hover"
                        :content="item.children.returnOpinion"
                      >
                        <span slot="reference" class="value f14">
                          {{ item.children.returnOpinion }}
                        </span>
                      </el-popover>
                    </div>
                  </div>
                </div>
                <div class="r-body">
                  <div class="flex-wrap">
                    <div class="item">
                      <h6 v-if="item.children.parentState === '1'">
                        {{ $t('ruleSetting.changeRule') }}
                      </h6>
                      <h6 v-if="item.children.parentState === '2'">
                        {{ $t('ruleSetting.delRule') }}
                      </h6>
                    </div>
                    <div class="item line" />
                    <div class="item">
                      <h6>{{ $t('ruleSetting.forwardAndRe') }}</h6>
                      <el-form-item
                        :prop="'ruleSetList.' + index + '.form.ruleForward'"
                        :rules="[
                          {
                            required: true,
                            message: $t('ruleSetting.proAndCon'),
                            trigger: 'change',
                          },
                        ]"
                      >
                        <el-radio-group
                          v-model="item.children.form.ruleForward"
                          :disabled="item.ruleSettingContent?false:true"
                        >
                          <template v-if="applicationRuleForward === '0'"> -->
                            <!-- 正向 -->
                            <!-- <el-radio label="1">{{ $t('newapp.forward') }}</el-radio> -->
                            <!-- 反向 -->
                            <!-- <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio> -->
                          <!-- </template>
                          <template v-else-if="applicationRuleForward === '1'">
                            <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                          </template>
                          <template v-else>
                            <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio>
                          </template>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                    <div class="item line" />
                    <div class="item">
                      <h6>{{ $t('ruleSetting.trial') }}</h6>
                      <el-form-item
                        :prop="'ruleSetList.' + index + '.form.ruleTest'"
                        :rules="[
                          {
                            required: true,
                            message: $t('ruleSetting.pTrial'),
                            trigger: 'change',
                          },
                        ]"
                      >
                        <el-radio-group
                          v-model="item.children.form.ruleTest"
                          :disabled="item.ruleSettingContent?false:true"
                        >
                          <el-radio label="1">{{ $t('ruleSetting.trialOperation') }}</el-radio>
                          <el-radio label="0">{{ $t('ruleSetting.startRun') }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>

                  <div v-if="!showRule" class="ruleContent-wrapper tree-wrapper">
                    <span>{{ $t('common.if') }}: </span>
                    <span>
                      <div v-html="item.ruleSettingDesc" />
                    </span> -->
                    <!-- 正向 -->
                    <!-- <div v-if="item.children.form.ruleForward != '0'" class="forward_direction">
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="那么">
                          <span v-if="item.ruleSettingContent">
                            <el-input v-model="item.children.form.rulePassCode" style="width: 182px" size="mini" />
                          </span>
                        </el-form-item>
                        <span>
                          <div v-html="item.thenListText" />
                        </span>
                      </div>
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
                          <span style="padding-right: 20px">否则</span>
                          <el-radio-group v-model="item.children.form.ruleResult">
                            <el-radio
                              v-for="resultItem in RuleResults"
                              :key="resultItem.resultCode"
                              :label="resultItem.resultCode"
                            >{{ resultItem.resultName }}</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <span>
                          <div v-html="item.elseListText" />
                          <div>{{ RuleResultsList[item.form.ruleResult] }}</div>
                        </span>
                      </div>
                    </div> -->

                    <!-- 反向 -->
                    <!-- <div v-else class="reverse_direction">
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
                          <span style="padding-right: 20px">那么</span>
                          <el-radio-group v-model="item.children.form.ruleResult">
                            <el-radio
                              v-for="resultItem in RuleResults"
                              :key="resultItem.resultCode"
                              :label="resultItem.resultCode"
                            >{{ resultItem.resultName }}</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <span>
                          <div v-html="item.elseListText" />
                          <div>{{ RuleResultsList[item.form.ruleResult] }}</div>
                        </span>
                      </div>
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="否则">
                          <el-input v-if="item.ruleSettingContent" v-model="item.children.form.rulePassCode" style="width: 182px" size="mini" />
                        </el-form-item>
                        <span>
                          <div v-html="item.thenListText" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div v-else class="no-data">{{ $t('ruleSetting.noRuleData') }}</div>
        </ValidationObserver>
      </el-form>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon'
// import FieldButton from './fieldButton.vue'
import { RuleEditor } from '@/utils/RuleEditor'
import { getRuleResults } from '@/api/mainPages/decision'

export default {
  components: {
    SvgIcon
  },
  props: {
    decisionUrlId: {
      type: String,
      default: ''
    },
    rule: {
      type: Object,
      default: function() {
        return {
          id: null, // id
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          ruleTips: null, // 规则不通过提示信息
          ruleId: null // 规则id}
        }
      }
    },
    isApprove: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      search: '',
      applicationDecisionTableList: [], // 该应用里所有的决策表
      decisionTableList: [], // 该决策路径下所有的决策表
      drawer: false, // 右侧列表
      dialogFormVisible: false, // 显示编辑弹框
      currentModel: '', // 当前编辑操作的决策表
      time: [-28800000, 3155731200000], // 生效时间-失效时间
      dragging: false,
      // 以上是决策表原始数据
      lang: this.$store.state.settings.lang,
      bomModelId: '',
      showRule: false,
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleSetList: [],
      InceptionRuleSetList: [],
      ruleList: [], // 展示抽屉新增规则列表，
      RuleResults: [], // 执行结果
      currentPageData: [], // 当前页数据
      showPagination: false, // 是否显示分页器
      value: '',
      CopyDialogVisible: false,
      CopyDialogVisible2: false,
      treeData: [],
      field: {},
      params: {},
      node: {},
      fieldId: '',
      keyValue: '',
      listData: null,
      listData2: null,
      searchListData: null,
      searchListData2: null,
      currentIndex: null,
      currentIndex2: null,
      tempNode: null,
      ruleMethodList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      selectList: [], // 列表
      vInputValue: [], // 普通控件存值
      vDateExpressionValue: null,
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null, // 节点值的单位
      isContextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      changeField: '',
      structure: 1,
      options: 0,
      inputIndex: '',
      vInputValueLength: 0,
      startPos: 0, // 获取光标起始位置
      endPos: 0, // 获取光标结束位置
      jvaneedparam: {},
      fieldParsing: [],
      needFieldPath: [],
      errorText: '',
      isValidInput: true,
      allLabels: [],
      directionList: { 0: '反向', 1: '正向' },
      operationList: { 0: '正式运行', 1: '试运行' },
      condition: null,
      pageNum1: 1,
      pageSize1: 20,
      saveRuleList: [],
      handleScrollFlag: true,
      queryflag: false,
      searchValue: '',
      thenList: [],
      elseList: [],
      RuleResultsList: [],
      checkedNodes: [{}],
      // 树
      treeDataArry: [],
      chooseRuleDialog: false,
      tableEditIndex: 0,
      approveChecked: []
    }
  },
  computed: {
    // ruleDesc() {
    //   let str = ''
    //   if (this.ruleSetListForm.ruleSetList.ruleSettingDesc) {
    //     str = this.ruleSetListForm.ruleSetList.ruleSettingDesc.replaceAll('并且', '<br><span class="symbol">并且</span>').replaceAll('或者', '<br/><span class="symbol">或者</span>')
    //   }
    //   return str
    // },
    applicationRuleForward() {
      return this.$store.state.app.applicationRuleForward
    },
    baseURL() {
      return this.$store.state.settings.adp_config.baseURL
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    dataItem(val) {
      this.buildData(val)
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  async created() {
    // 以上是决策表原始数据
    await this.getRuleResults()
    this.ruleEditor = new RuleEditor()
    this.buildData(this.dataItem)
  },
  methods: {
    // 获取规则执行不通过结果定义列表
    async getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      await getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
        this.RuleResults.forEach((item, index) => {
          this.RuleResultsList[item.resultCode] = (item.resultName)
        })
      })
    },
    // 获取数据列表信息
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
    // 处理单条规则数据
    addToSetList(nativeItem, isAdd) {
      const addItem = this._.cloneDeep(nativeItem)
      if (!nativeItem.form) {
        addItem.approvalStatus = '0'
        addItem.form = {
          ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
          ruleResult: '2',
          ruleTest: '1',
          rulePassCode: ''
        }
      }
      addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
        this._.cloneDeep(nativeItem.ruleSettingContent),
        []
      )
      if (isAdd) {
        this.saveRuleList.push(addItem)
      }
      this.ruleSetListForm.ruleSetList.push(addItem)
    },
    listTree(list) {
      list.forEach((element, index) => {
        if (element.parentId) {
          list.forEach((item) => {
            if (item.id === element.parentId) {
              item.children = element
              list.splice(index, 1)
            }
          })
        }
      })
      return list
    },
    buildData(item) {
      if (!item) return
      const index = 0
      let obj = {
        // 决策表数据
        time: [
          item.effectiveDate || -28800000,
          item.invalidatedDate || 3155731200000
        ],
        decisionTableId: item.decisionTableId,
        decisionTableSettingId: item.decisionTableSettingId,
        decisionTableTest: item.decisionTableTest,
        decisionUrlId: item.decisionUrlId,
        decisionTableName: item.decisionTableName,
        approvalStatus: item.approvalStatus,
        path: item.path,
        showPreviewExcel: false,
        url: `${this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API}/export/decisionTable/${item.decisionTableId}`
      }
      let obj2 = {}
      if (item.ruleSetting) {
        obj2 = { form: {
          ruleForward: item.ruleSetting.ruleForward,
          ruleResult: item.ruleSetting.ruleResult || '2',
          ruleTest: item.ruleSetting.ruleTest || '2',
          rulePassCode: item.ruleSetting.rulePassCode || '2'
        },
        ruleSettingDesc: item.ruleSetting.ruleSettingDesc,
        ruleSettingContent: JSON.parse(item.ruleSetting.ruleSettingContent),
        ruleId: item.ruleSetting.ruleId,
        ruleName: item.ruleSetting.ruleName,
        fieldParsing: item.ruleSetting.fieldParsing,
        // id: item.ruleSetting.id,
        // path: item.ruleSetting.path,
        returnOpinion: item.ruleSetting.returnOpinion,
        parentState: item.ruleSetting.parentState,
        parentId: item.ruleSetting.parentId,
        approvalStatus: item.ruleSetting.approvalStatus //   0-待审批，1-审批通过，2-退回修改，3-无需审批,4-审批不通过}
        }
        this.fieldParsing[index] = item.ruleSetting.fieldParsing
      }
      obj = { ...obj, ...obj2 }
      obj['elseListText'] = this.getText(item.elseList || [])
      obj['thenListText'] = this.getText(item.thenList || [])
      this.addToSetList(obj)
      const res = {
        elseList: item.elseList || [],
        thenList: item.thenList || []
      }
      this.$set(this.ruleMethodList, index, res)
      const transformedData = this.ruleMethodList.map(item1 => {
        const newItem = {
          bomModelId: this.bomModelId,
          decisionUrlId: item.decisionUrlId,
          decisionTableId: item.decisionTableId,
          ruleId: item.ruleSetting ? item.ruleSetting.ruleId : null,
          elseList: item1.elseList ? item1.elseList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            codeService: elseItem.codeService,
            expressionId: elseItem.expressionId,
            returnType: elseItem.returnType,
            paramValue: elseItem.paramValue,
            fieldParsings: elseItem.fieldParsings
          })) : [],
          thenList: item1.thenList ? item1.thenList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            codeService: elseItem.codeService,
            fieldParsings: elseItem.fieldParsings,
            expressionId: elseItem.expressionId,
            returnType: elseItem.returnType,
            paramValue: elseItem.paramValue
          })) : []
        }
        return newItem
      })
      this.ruleMethodList = transformedData
      this.ruleSetListForm.ruleSetList = this.listTree(
        this.ruleSetListForm.ruleSetList
      )
      this.loading = false
      this.queryflag = false
    }
  }
}
</script>
<style lang="scss">
.ruleSetting {

  .rule-else,
  .rule-error {
    padding-top: 10px;

    .rule-else-item {
      .el-form-item__label {
        padding-right: 20px;
      }

      .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .is-border {
    border: 2px solid #1785ff;
  }

  .no-data {
    text-align: center;
    padding: 20px;
  }

  .pagination {
    margin-left: 22px;
  }

  .name {
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;
    /* 强制不换行 */
  }

  .hidden {
    width: 40px;
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;
    /* 强制不换行 */
    display: inline-block;

    &:hover {
      overflow: hidden !important;
    }
  }

  .value {
    text-overflow: ellipsis;
    /* 溢出显示省略号 */
    overflow: hidden;
    /* 溢出隐藏 */
    white-space: nowrap;

    /* 强制不换行 */
    &:hover {
      overflow: visible;
    }
    font-size: 14px;
  }
  .value_cut {

  }

  .el-cascader {
    width: 160px;
    height: 30px !important;
  }

  .el-input--medium .el-input__inner {
    height: 34px !important;
  }

  .menuBox {
    position: fixed;
    background: #fff;
    z-index: 99;
  }

  .context-menu {
    // width:400px;
    // height:700px
    border: 1px solid #ddd;
    padding: 5px 10px;
    font-size: 12px;

    .funBtn {
      cursor: pointer;
      padding: 5px;
    }

    .funBtn:hover {
      color: #0079ff
    }
  }
}
.col-right{
  float: right;
}
.checkBox{
  display: inline-block;
  margin:5px 0 0 20px;
}
</style>
