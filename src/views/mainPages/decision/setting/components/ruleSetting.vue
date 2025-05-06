/* eslint-disable no-dupe-keys */
<template>
  <div class="ruleSetting">
    <div class="mt-15 padding-15 flex-wrap justify-content-between">
      <div class="card-head-style1 clearfix">
        <span>{{ $t('ruleSetting.ruleSetting') }}</span>
      </div>
      <div>
        <el-button
          class="btn-border"
          @click="openRuleList"
        >{{ $t('ruleSetting.openRuleList') }}</el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="loading" class="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <el-form
        v-else
        ref="ruleSectionForm"
        :model="ruleSetListForm"
        :inline="true"
      >
        <ValidationObserver ref="obs" tag="form">
          <div
            v-if="ruleSetListForm.ruleSetList.length"
            class="content rule-list"
          >
            <!--  0-待审批，1-审批通过，2-退回修改，3-无需审批,4-审批不通过 -->
            <div
              v-for="(item, index) in ruleSetListForm.ruleSetList"
              :key="item.ruleId"
              v-loading="showRule"
              class="item-wrap"
              :class="[
                'status_' + item.approvalStatus,
                { 'is-border': item.children ? true : false },
              ]"
            >
              <!-- 编号 路径 状态 -->
              <div class="r-head">
                <div class="left rule-item">
                  <div class="item align-item-center">
                    <svg-icon icon-class="ruleId" />
                    <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
                    <span class="value">{{ item.ruleId }}</span>
                  </div>
                  <span class="item"> | </span>
                  <div class="item align-item-center">
                    <svg-icon icon-class="ruleId" />
                    <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
                    <span class="value">{{ item.ruleName }}</span>
                  </div>
                  <span class="item"> | </span>
                  <div class="item align-item-center">
                    <svg-icon icon-class="path" />
                    <span class="name">{{ $t('ruleSetting.path') }}：</span>
                    <span class="value">{{ item.path ? item.path : "/" }}</span>
                  </div>
                  <span class="item"> | </span>
                  <div class="item align-item-center mr-15">
                    <span class="name">{{ $t('userInfo.approvalStatus') }}：</span>
                    <span
                      class="value hidden f14"
                      :class="'approval_status_' + item.approvalStatus"
                      :style="{width:lang==='zh'?'70px':'50px'}"
                    >
                      <el-popover trigger="hover" width="200" :content="handleStatus(item.approvalStatus)">
                        <span slot="reference">{{ handleStatus(item.approvalStatus) }}</span>
                      </el-popover>
                      <!-- {{ handleStatus(item.approvalStatus) }} -->
                    </span>
                  </div>

                  <div
                    v-if="item.approvalStatus === '4'"
                    class="item align-item-center mr-15"
                  >
                    <span class="name">{{ $t('ruleSetting.returnAdvice') }}：</span>
                    <el-popover
                      placement="top-start"
                      :title="$t('ruleSetting.reContent')"
                      width="200"
                      trigger="hover"
                      :content="item.returnOpinion"
                    >
                      <span slot="reference" class="value hidden f14" style="line-height: 9px;">
                        {{ item.returnOpinion }}
                      </span>
                    </el-popover>
                  </div>
                </div>

                <div v-if="item.approvalStatus !== ('1' || '2')" class="right">
                  <div class="item align-item-center">
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      :disabled="
                        item.approvalStatus === '1' ||
                          item.approvalStatus === '2' ||
                          (item.children ? true : false)
                      "
                      @click="deleteRule(item)"
                    >{{ $t('ruleSetting.removeRule') }}</el-button>
                  </div>
                </div>
              </div>
              <div class="r-body">
                <div class="flex-wrap">
                  <div class="item">
                    <h6>{{ $t('ruleSetting.effTime') }}-{{ $t('ruleSetting.noEffTime') }}</h6>
                    <el-date-picker
                      v-model="item.form.time"
                      :disabled="
                        item.approvalStatus === '1' ||
                          item.approvalStatus === '2' ||
                          (item.children ? true : false)
                      "
                      type="datetimerange"
                      :range-separator="$t('dashboard.to')"
                      :start-placeholder="$t('ruleSetting.effTime')"
                      :end-placeholder="$t('ruleSetting.noEffTime')"
                    />
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
                        v-model="item.form.ruleForward"
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                      >
                        <template v-if="applicationRuleForward === '0'">
                          <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                          <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio>
                        </template>
                        <template v-else-if="applicationRuleForward === '1'">
                          <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                        </template>
                        <template v-else>
                          <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio>
                        </template>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <!-- <div v-if="false" class="isruleShow">
                    <div class="item line" />
                    <div class="item">
                      <h6>规则不通过结果</h6>
                      <el-form-item
                        :prop="'ruleSetList.' + index + '.form.ruleResult'"
                        :rules="[
                          {
                            required: true,
                            message: '请选择规则结果',
                            trigger: 'change',
                          },
                        ]"
                      >
                        <el-radio-group v-model="item.form.ruleResult">
                          <el-radio
                            v-for="resultItem in RuleResults"
                            :key="resultItem.resultCode"
                            :label="resultItem.resultCode"
                          >{{ resultItem.resultName }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                    <div class="item line" />
                    <div class="item">
                      <h6>规则通过</h6>
                      <el-form-item
                        :prop="'ruleSetList.' + index + '.form.ruleResult'"
                        :rules="[
                          {
                            required: true,
                            message: '请选择规则结果',
                            trigger: 'change',
                          },
                        ]"
                      >
                        <el-input
                          v-model="item.form.rulePassCode"
                          size="mini"
                        />
                      </el-form-item>
                    </div>
                  </div> -->

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
                        v-model="item.form.ruleTest"
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                      >
                        <el-radio label="1">{{ $t('ruleSetting.trialOperation') }}</el-radio>
                        <el-radio label="0">{{ $t('ruleSetting.startRun') }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </div>

                <!-- 规则展示部分 -->
                <div class="ruleContent-wrapper tree-wrapper">
                  <span>{{ $t('common.if') }}: </span>
                  <span v-for="(items, i) in item.ruleArray" :key="i">
                    <span
                      v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                      class="node-tag"
                    >
                      <RuleRender
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                        :node="items.left"
                      />
                      <RuleRender
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                        :node="items"
                      />
                      <RuleRender
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                        :node="items.right"
                      />
                    </span>
                    <span
                      v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL"
                      class="node-tag"
                    >
                      <RuleRender
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                        :node="items"
                      />
                    </span>
                    <span v-else class="node-tag">
                      <RuleRender
                        :disabled="
                          item.approvalStatus === '1' ||
                            item.approvalStatus === '2' ||
                            (item.children ? true : false)
                        "
                        :node="items"
                      />
                    </span>
                  </span>

                  <!-- 正反向切换控制显示  start-->
                  <div
                    v-if="item.form.ruleForward != '0'"
                    class="forward_direction"
                  >
                    <div class="rule-else">
                      <el-form-item class="rule-else-item" :label="$t('common.then')">
                        <el-input
                          v-model="item.form.rulePassCode"
                          :disabled="
                            item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                          "
                          style="width: 182px"
                          size="mini"
                        />
                      </el-form-item>
                    </div>
                    <div class="rule-error">
                      <el-form-item
                        :prop="'ruleSetList.' + index + '.form.ruleResult'"
                        :rules="[
                          {
                            required: true,
                            message: $t('ruleSetting.ruleRes') ,
                            trigger: 'change',
                          },
                        ]"
                      >
                        <span style="padding-right: 20px">{{ $t('common.else') }}</span>
                        <el-radio-group
                          v-model="item.form.ruleResult"
                          :disabled="
                            item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                          "
                        >
                          <el-radio
                            v-for="resultItem in RuleResults"
                            :key="resultItem.resultCode"
                            :label="resultItem.resultCode"
                          >{{ resultItem.resultName }}</el-radio>
                        </el-radio-group>
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
                            message: $t('ruleSetting.ruleRes') ,
                            trigger: 'change',
                          },
                        ]"
                      >
                        <span style="padding-right: 20px">{{ $t('common.then') }}</span>
                        <el-radio-group
                          v-model="item.form.ruleResult"
                          :disabled="
                            item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                          "
                        >
                          <el-radio
                            v-for="resultItem in RuleResults"
                            :key="resultItem.resultCode"
                            :label="resultItem.resultCode"
                          >{{ resultItem.resultName }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                    <div class="rule-else">
                      <el-form-item class="rule-else-item" :label="$t('common.else')">
                        <el-input
                          v-model="item.form.rulePassCode"
                          :disabled="
                            item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                          "
                          style="width: 182px"
                          size="mini"
                        />
                      </el-form-item>
                    </div>
                  </div>
                  <!-- 正反向切换控制显示  end-->
                </div>
              </div>
              <!-- 产出试运行 -->
              <div
                v-if="item.children"
                style="padding: 20px"
                class="output-rule"
              >
                <div class="r-head">
                  <div class="left rule-item">
                    <div class="item align-item-center">
                      <svg-icon icon-class="ruleId" />
                      <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
                      <span class="value">{{ item.children.ruleId }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center">
                      <svg-icon icon-class="ruleId" />
                      <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
                      <span class="value">{{ item.children.ruleName }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center">
                      <svg-icon icon-class="path" />
                      <span class="name">{{ $t('ruleSetting.path') }}：</span>
                      <span class="value">{{
                        item.children.path ? item.children.path : "/"
                      }}</span>
                    </div>
                    <span class="item"> | </span>
                    <div class="item align-item-center mr-15">
                      <span class="name">{{ $t('userInfo.approvalStatus') }}：</span>
                      <span
                        class="value f14"
                        :class="
                          'approval_status_' + item.children.approvalStatus
                        "
                        :style="{width:lang==='zh'?'70px':'50px'}"
                      >
                        <!-- {{ handleStatus(item.children.approvalStatus) }} -->
                        <el-popover trigger="hover" width="200" :content="handleStatus(item.children.approvalStatus)">
                          <span slot="reference">{{ handleStatus(item.children.approvalStatus) }}</span>
                        </el-popover>
                      </span>
                    </div>

                    <div
                      v-if="item.children.approvalStatus === '2'"
                      class="item align-item-center mr-15"
                    >
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

                  <div class="right">
                    <div class="item align-item-center">
                      <el-button
                        type="text"
                        icon="el-icon-help"
                        @click="deleteTestRule(item.id)"
                      >{{ $t('ruleSetting.recoveryRule') }}</el-button>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteRule(item)"
                      >{{ $t('ruleSetting.removeRule') }}</el-button>
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
                        >
                          <template v-if="applicationRuleForward === '0'">
                            <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                            <el-radio label="0">{{ $t('newapp.reverseDirection') }}</el-radio>
                          </template>
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
                        <el-radio-group v-model="item.children.form.ruleTest">
                          <el-radio label="1">{{ $t('ruleSetting.trialOperation') }}</el-radio>
                          <el-radio label="0">{{ $t('ruleSetting.startRun') }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>

                  <div
                    v-if="!showRule"
                    class="ruleContent-wrapper tree-wrapper"
                  >
                    <span>{{ $t('common.if') }}: </span>
                    <span
                      v-for="(items, i) in item.children.ruleArray"
                      :key="i"
                    >
                      <span
                        v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                        class="node-tag"
                      >
                        <RuleRender :node="items.left" />
                        <RuleRender :node="items" />
                        <RuleRender :node="items.right" />
                      </span>
                      <span
                        v-else-if="
                          items && items.nodeType === NODE_TYPE.LOGICAL
                        "
                        class="node-tag"
                      >
                        <RuleRender :node="items" />
                      </span>
                      <span v-else class="node-tag">
                        <RuleRender :node="items" />
                      </span>
                    </span>

                    <div
                      v-if="item.children.form.ruleForward != '0'"
                      class="forward_direction"
                    >
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="那么">
                          <el-input
                            v-model="item.children.form.rulePassCode"
                            style="width: 182px"
                            size="mini"
                          />
                        </el-form-item>
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
                          <span style="padding-right: 20px">{{ $t('common.else') }}</span>
                          <el-radio-group
                            v-model="item.children.form.ruleResult"
                          >
                            <el-radio
                              v-for="resultItem in RuleResults"
                              :key="resultItem.resultCode"
                              :label="resultItem.resultCode"
                            >{{ resultItem.resultName }}</el-radio>
                          </el-radio-group>
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
                        />
                      </div>
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" :label="$t('common.then')">
                          <el-input
                            v-model="item.children.form.rulePassCode"
                            style="width: 182px"
                            size="mini"
                          />
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">{{ $t('ruleSetting.noRuleData') }}</div>
        </ValidationObserver>
      </el-form>
    </transition>

    <div class="footer-btn-wrap app-container">
      <div />
      <div class="text-center">
        <el-button
          class="btn-border medium"
          @click="resetRule"
        >{{ $t('common.reset') }}</el-button>
        <el-button
          class="btn-background medium"
          @click="postRule"
        >{{ $t('common.saveChange') }}</el-button>
      </div>
      <div />
    </div>

    <!-- 右侧的规则模板列表 -->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      size="520px"
      direction="rtl"
      custom-class="custom-class-drawer"
    >
      <div class="drawer-wrapper">
        <div class="head">{{ $t('ruleSetting.ruleManaList') }}</div>
        <div class="mt-15 mb-15">
          <el-alert
            :closable="false"
            :title="$t('ruleSetting.newSearch')"
            show-icon
          />
        </div>
        <div class="flex-wrap justify-content-between mt-15 mb-15">
          <div class="flex-wrap">
            <el-button
              class="btn-border mini"
              @click="openNewPage('/rule/management')"
            >{{ $t('ruleManage.newdecRule') }}</el-button>
            <el-button
              class="btn-border mini"
              @click="selectAll"
            >{{ $t('common.allSelect') }}</el-button>
          </div>
          <div>
            <el-input
              v-model="search"
              :placeholder="$t('ruleSetting.querySearch')"
              clearable
              suffix-icon="el-input__icon el-icon-search"
              @keyup.enter.native="querySearch"
              @clear="getRuleList"
            />
          </div>
        </div>
        <div v-loading="drawerLoading" class="content scroll">
          <NoData v-if="ruleList.length === 0" :text="$t('ruleSetting.noRuleData')" />
          <div
            v-for="item in currentPageData"
            v-else
            :key="item.ruleId"
          >
            <RuleListItem :item="item" :rule-set-list-form="ruleSetListForm" @addToSetList="addToSetList" />
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="showPagination==true" class="pagination">
        <Pagination :data="ruleList" @onTableChange="onTableChange" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import RuleRender from '@/components/PocRender/PocRender'
import Pagination from '../../components/Pagination'
import RuleListItem from './RuleListItem.vue'
import { handleStatus } from '@/views/mainPages/decision/utils'
import { getRuleList, getRuleResults } from '@/api/mainPages/decision'
import {
  getRuleSetting,
  pushRuleSettings
} from '@/api/systemManage/rule-manage'
import { RuleEditor } from '@/utils/RuleEditor'
import Bus from '@/utils/bus'
import { NODE_TYPE } from '@/utils/poc'
const flatten = function(list) {
  const resArr = []
  list.forEach((item) => {
    resArr.push(item)
    if (item.children) {
      resArr.push(item.children)
    }
  })
  return resArr
}
export default {
  components: {
    RuleRender,
    SvgIcon,
    Pagination,
    RuleListItem
  },
  props: {
    decisionUrlId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      showRule: false,
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleList: [], // 展示抽屉新增规则列表，
      drawer: false,
      RuleResults: [], // 执行结果
      search: '', // 搜索关键字
      currentPageData: [], // 当前页数据
      showPagination: false // 是否显示分页器
    }
  },
  computed: {
    applicationRuleForward() {
      return this.$store.state.app.applicationRuleForward
    }
  },
  created() {
    this.ruleEditor = new RuleEditor()
    this.NODE_TYPE = NODE_TYPE
    this.handleStatus = handleStatus
    // this.getRuleSetting()
    this.getRuleList()
    this.getRuleResults()
  },
  methods: {
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
    // 查询该路径下的规则列表
    getRuleSetting() {
      this.loading = true
      getRuleSetting(this.decisionUrlId).then(async(res) => {
        const { codeServices, ruleSettings } = res
        codeServices &&
          (await this.$store.dispatch(
            'app/SET_CODESERVICE',
            codeServices.toString()
          ))
        ruleSettings &&
          ruleSettings.forEach((item) => {
            const obj = {
              ruleSettingContent: JSON.parse(item.ruleSettingContent),
              form: {
                time: [
                  item.effectiveDate || -28800000,
                  item.invalidatedDate || 3155731200000
                ],
                ruleForward: item.ruleForward,
                ruleResult: item.ruleResult,
                ruleTest: item.ruleTest,
                rulePassCode: item.rulePassCode
              },
              ruleSettingDesc: item.ruleSettingDesc,
              ruleId: item.ruleId,
              ruleName: item.ruleName,
              id: item.id,
              path: item.path,
              returnOpinion: item.returnOpinion,
              parentState: item.parentState,
              parentId: item.parentId,
              approvalStatus: item.approvalStatus //   0-待审批，1-审批通过，2-退回修改，3-无需审批,4-审批不通过
            }
            this.addToSetList(obj)
          })
        this.ruleSetListForm.ruleSetList = this.listTree(
          this.ruleSetListForm.ruleSetList
        )
        this.loading = false
      })
    },

    // 处理单条规则数据
    addToSetList(nativeItem) {
      const addItem = this._.cloneDeep(nativeItem)
      if (!nativeItem.ruleSettingContent) return
      if (!nativeItem.form) {
        addItem.approvalStatus = '0'
        addItem.form = {
          time: [-28800000, 3155731200000],
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
      ) // 把treeNode转换为nodeArray
      this.ruleSetListForm.ruleSetList.push(addItem)
      // Bus.$emit('ruleSettingIndex', this.ruleSetListForm.ruleSetList.length - 1) // 传给子组件的index
    },

    // 查询规则列表
    getRuleList() {
      this.drawerLoading = true
      getRuleList(this.$store.state.app.applicationId, { queryKey: this.search }).then((res) => {
        this.ruleList = res.map((item) => {
          return {
            ...item,
            ruleSettingContent: JSON.parse(item.ruleContent)
          }
        })
        this.currentPageData = this.ruleList.slice(0, 10)
        this.drawerLoading = false
      })
    },

    // 搜索规则
    querySearch: _.throttle(function() {
      if (this.search === '') {
        this.getRuleList()
        this.showPagination = false
      } else {
        getRuleList(this.$store.state.app.applicationId, { queryKey: this.search }).then((res) => {
          this.ruleList = res.map((item) => {
            return {
              ...item,
              ruleSettingContent: JSON.parse(item.ruleContent)
            }
          })
          this.showPagination = true
        })
      }
    }, 1000),

    // 分页功能
    onTableChange(pageData) {
      this.currentPageData = pageData
    },
    // 恢复规则
    deleteTestRule(id) {
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.id === id
      })
      // this.ruleSetListForm.ruleSetList[index].ruleChildren = ''
      this.$nextTick(() => {
        const newRule = this._.cloneDeep(
          this.ruleSetListForm.ruleSetList[index].ruleArray
        )
        this.ruleSetListForm.ruleSetList[index].children.ruleArray = newRule
      })
      this.showRule = true
      setTimeout(() => {
        this.showRule = false
      }, 1000)

      this.$forceUpdate()
    },
    // 移除该规则
    deleteRule(obj) {
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      if (obj.children && obj.children.parentState === '1') {
        this.ruleSetListForm.ruleSetList[index].children = null
      } else {
        this.ruleSetListForm.ruleSetList.splice(index, 1)
      }
      this.showRule = true
      setTimeout(() => {
        this.showRule = false
      }, 1000)
    },

    // 新增决策规则
    async openNewPage(url) {
      this.drawer = false
      const routeData = this.$router.resolve({
        // 这里打开新页面有路由切换、权限切换
        path: url,
        query: { terrace: 'system' }
      })
      window.open(routeData.href, '_blank')
    },
    // 获取规则执行不通过结果定义列表
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
      })
    },

    // 保存规则
    async postRule() {
      console.log('保存规则')
      const isValid = await this.$refs.obs.validate()
      // const errors = Object.values(this.$refs.obs.errors) // 未通过校验项
      if (!isValid) {
        return false
      }

      this.$refs.ruleSectionForm.validate((valid) => {
        if (valid) {
          const newRuleList = flatten(this.ruleSetListForm.ruleSetList)
          const ruleSettings = newRuleList.map((item) => {
            const rootTreeNode = this.ruleEditor.parseRuleNode(
              null,
              this._.cloneDeep(item.ruleArray)
            ) // 把nodeArray 组成treeNode
            const text = this.ruleEditor.getText(
              this._.cloneDeep(rootTreeNode),
              ''
            ) // 获取文字描述
            return {
              effectiveDate: item.form.time[0], // 生效时间
              invalidatedDate: item.form.time[1], // 失效时间
              ruleForward: item.form.ruleForward, // 规则正反向，1-正向，0-反向
              ruleResult: item.form.ruleResult, // 规则不通过选项
              ruleTest: item.form.ruleTest, // 试运行
              ruleId: item.ruleId,
              ruleName: item.ruleName,
              id: item.id,
              parentId: item.parentId,
              ruleSettingContent: JSON.stringify(rootTreeNode), // 数结构 node
              ruleSettingDesc: text, // 规则描述
              rulePassCode: item.form.rulePassCode,
              approvalStatus: item.approvalStatus // 状态
            }
          })
          const data = {
            decisionUrlId: this.decisionUrlId, // 决策路径id
            ruleSettings
          }
          pushRuleSettings(data)
            .then((res) => {
              this.$emit('toggleComponent', 'DecisionBase', 2)
              Bus.$emit('searchPath') // 调用搜索
            })
            .catch((err) => {
              err
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 打开添加规则list抽屉
    openRuleList() {
      this.getRuleList()

      this.drawer = true
    },

    // 撤销全部修改
    resetRule() {
      this.ruleSetListForm.ruleSetList = []
      // this.getRuleSetting()
    },

    // 右侧的规则全选
    selectAll() {
      this.ruleList.forEach((item, i) => {
        if (!this.hasRuleId(item.ruleId)) {
          this.addToSetList(item)
        }
      })
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
  .name{
    text-overflow: ellipsis; /* 溢出显示省略号 */
    overflow: hidden; /* 溢出隐藏 */
    white-space: nowrap;  /* 强制不换行 */
  }
  .hidden{
    width:40px;
    text-overflow: ellipsis; /* 溢出显示省略号 */
    overflow: hidden; /* 溢出隐藏 */
    white-space: nowrap;  /* 强制不换行 */
    display: inline-block;
    &:hover {
      overflow: hidden!important;
    }
  }
  .value{
    text-overflow: ellipsis; /* 溢出显示省略号 */
    overflow: hidden; /* 溢出隐藏 */
    white-space: nowrap;  /* 强制不换行 */
    &:hover {
      overflow: visible;
    }
  }
}
</style>
