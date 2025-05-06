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
                        <el-radio label="1">试运行</el-radio>
                        <el-radio label="0">正式运行</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </div>

                <!-- 规则展示部分 -->
                <div class="tree-wrapper">
                  <div class="ruleContent-wrapper">
                    <span style="font-size:16px;font-weight:bold;">如果: </span>
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
                  </div>

                  <!-- 正反向切换控制显示  start-->
                  <!-- 正向 -->
                  <div
                    v-if="item.form.ruleForward != '0'"
                    class="forward_direction"
                  >
                    <div class="rule-else ruleContent-wrapper">
                      <el-form-item
                        prop="destPath"
                      >
                        <span style="font-size: 16px; font-weight: bold;margin-right:10px;">那么</span>
                        {{ $t('ruleSetting.rulePrompt') }}
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

                      <div class="thenList" style="margin-left:40px;">
                        <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                          <i
                            v-if="
                              !(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                            "
                            class="el-icon-remove-outline"
                            style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                            @click="delThenListFn(index,i)"
                          />
                          <span
                            v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                            class="node-tag"
                          >
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items.left"
                            />
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                            <ExpressionPocRender
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
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                          <span v-else class="node-tag">
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="plus">
                        <i
                          v-if="
                            !(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                          "
                          class="el-icon-circle-plus-outline"
                          style="font-size: 25px;margin-top:5px;color:#606266;"
                          @click="addExpressionFn(index)"
                        />
                      </div>

                    </div>

                    <!-- 那么thenList弹窗 -->
                    <el-dialog
                      title="回写设置"
                      :visible.sync="CopyDialogVisible"
                      width="60%"
                      style="text-align: left;"
                    >
                      <el-row>
                        <el-col class="col-right">
                          <el-input v-model="searchValue" placeholder="请输入关键字搜索" @input="thenSearch">
                            <el-button slot="append" icon="el-icon-search" @click="thenSearch" />
                          </el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <el-table
                            :data="searchListData"
                            style="width: 100%;height:400px;"
                            max-height="400"
                            border
                            class="mt-20"
                            :empty-text="$t('common.noData')"
                            :header-cell-style="{
                              background: '#EFF4F8',
                              color: '#60769C',
                              'font-weight': 'normal'
                            }"
                            :cell-style="{ color: '#435475' }"
                          >
                            <el-table-column
                              prop="methodName"
                              label="表达式"
                              height="50"
                            />
                            <el-table-column
                              label="操作"
                              width="90%"
                            >
                              <template slot-scope="scope">
                                <el-button
                                  class="btn-border mini"
                                  @click="copyExpressionToThenlist(scope.row)"
                                >确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-dialog>

                    <div class="rule-error ruleContent-wrapper" style="margin-top:10px;">
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
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
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

                      <div class="elseList" style="margin-left:45px;">
                        <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                          <i
                            v-if="
                              !(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                            "
                            class="el-icon-remove-outline"
                            style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                            @click="delElseListFn(index,key)"
                          />
                          <span
                            v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                            class="node-tag"
                          >
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items.left"
                            />
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                            <ExpressionPocRender
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
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                          <span v-else class="node-tag">
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="plus">
                        <i
                          v-if="
                            !(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                          "
                          class="el-icon-circle-plus-outline"
                          style="font-size: 25px;margin-top:5px;color:#606266;"
                          @click="addExpressionFn2(index)"
                        />
                      </div>
                    </div>

                    <!-- 否则elseList弹窗 -->
                    <el-dialog
                      title="回写设置"
                      :visible.sync="CopyDialogVisible2"
                      width="60%"
                      style="text-align: left;"
                    >
                      <el-row>
                        <el-col class="col-right">
                          <el-input v-model="searchValue" placeholder="请输入关键字搜索" @input="elseSearch">
                            <el-button slot="append" icon="el-icon-search" @click="elseSearch" />
                          </el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <el-table
                            :data="searchListData2"
                            style="width: 100%;height:400px;"
                            max-height="400"
                            border
                            class="mt-20"
                            :empty-text="$t('common.noData')"
                            :header-cell-style="{
                              background: '#EFF4F8',
                              color: '#60769C',
                              'font-weight': 'normal'
                            }"
                            :cell-style="{ color: '#435475' }"
                          >
                            <el-table-column
                              prop="methodName"
                              label="表达式"
                              height="50"
                            />
                            <el-table-column
                              label="操作"
                              width="90%"
                            >
                              <template slot-scope="scope">
                                <el-button
                                  class="btn-border mini"
                                  @click="copyExpressionToElselist(scope.row)"
                                >确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-dialog>

                  </div>

                  <!-- 反向 -->
                  <div v-else class="reverse_direction">
                    <div class="rule-error ruleContent-wrapper">
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
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">那么</span>
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

                      <div class="elseList" style="margin-left:45px;">
                        <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                          <i
                            v-if="
                              !(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                            "
                            class="el-icon-remove-outline"
                            style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                            @click="delElseListFn2(index,key)"
                          />
                          <span
                            v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                            class="node-tag"
                          >
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items.left"
                            />
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                            <ExpressionPocRender
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
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                          <span v-else class="node-tag">
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="plus">
                        <i
                          v-if="
                            !(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                          "
                          class="el-icon-circle-plus-outline"
                          style="font-size: 25px;margin-top:5px;color:#606266;"
                          @click="addExpressionFn2(index)"
                        />
                      </div>
                    </div>

                    <!-- 那么elseList弹窗 -->
                    <el-dialog
                      title="回写设置"
                      :visible.sync="CopyDialogVisible"
                      width="60%"
                      style="text-align: left;"
                    >
                      <el-row>
                        <el-col class="col-right">
                          <el-input v-model="searchValue" placeholder="请输入关键字搜索" @input="thenSearch">
                            <el-button slot="append" icon="el-icon-search" @click="thenSearch" />
                          </el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <el-table
                            :data="listData"
                            style="width: 100%;height:400px;"
                            max-height="400"
                            border
                            class="mt-20"
                            :empty-text="$t('common.noData')"
                            :header-cell-style="{
                              background: '#EFF4F8',
                              color: '#60769C',
                              'font-weight': 'normal'
                            }"
                            :cell-style="{ color: '#435475' }"
                          >
                            <el-table-column
                              prop="methodName"
                              label="表达式"
                              height="50"
                            />
                            <el-table-column
                              label="操作"
                              width="90%"
                            >
                              <template slot-scope="scope">
                                <el-button
                                  class="btn-border mini"
                                  @click="copyExpressionToThenlist(scope.row)"
                                >确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-dialog>

                    <div class="rule-else ruleContent-wrapper" style="margin-top:10px;">
                      <el-form-item class="rule-else-item">
                        <span style="font-size: 16px; font-weight: bold;margin-right:10px;">否则</span>
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

                      <div class="thenList" style="margin-left:40px;">
                        <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                          <i
                            v-if="
                              !(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                            "
                            class="el-icon-remove-outline"
                            style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                            @click="delThenListFn2(index,i)"
                          />
                          <span
                            v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                            class="node-tag"
                          >
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items.left"
                            />
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                            <ExpressionPocRender
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
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                          <span v-else class="node-tag">
                            <ExpressionPocRender
                              :disabled="
                                item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                              "
                              :node="items"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="plus">
                        <i
                          v-if="
                            !(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                          "
                          class="el-icon-circle-plus-outline"
                          style="font-size: 25px;margin-top:5px;color:#606266;"
                          @click="addExpressionFn(index)"
                        />
                      </div>
                    </div>

                    <!-- 否则thenList弹窗 -->
                    <el-dialog
                      title="回写设置"
                      :visible.sync="CopyDialogVisible2"
                      width="60%"
                      style="text-align: left;"
                    >
                      <el-row>
                        <el-col class="col-right">
                          <el-input v-model="searchValue" placeholder="请输入关键字搜索" @input="elseSearch">
                            <el-button slot="append" icon="el-icon-search" @click="elseSearch" />
                          </el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <el-table
                            :data="listData2"
                            style="width: 100%;height:400px;"
                            max-height="400"
                            border
                            class="mt-20"
                            :empty-text="$t('common.noData')"
                            :header-cell-style="{
                              background: '#EFF4F8',
                              color: '#60769C',
                              'font-weight': 'normal'
                            }"
                            :cell-style="{ color: '#435475' }"
                          >
                            <el-table-column
                              prop="methodName"
                              label="表达式"
                              height="50"
                            />
                            <el-table-column
                              label="操作"
                              width="90%"
                            >
                              <template slot-scope="scope">
                                <el-button
                                  class="btn-border mini"
                                  @click="copyExpressionToElselist(scope.row)"
                                >确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-dialog>

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
                            <!-- 正向 -->
                            <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                            <!-- 反向 -->
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

                    <!-- 正向 -->
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

                        <div class="elseList" style="margin-left:45px;">
                          <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                            <span
                              v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :node="items"
                              />
                              <ExpressionPocRender
                                :node="items.right"
                              />
                            </span>
                            <span
                              v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                          </div>
                        </div>
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

                        <div class="thenList" style="margin-left:40px;">
                          <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                            <span
                              v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :node="items"
                              />
                              <ExpressionPocRender
                                :node="items.right"
                              />
                            </span>
                            <span
                              v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 反向 -->
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
                          <span style="padding-right: 20px">那么</span>
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

                        <div class="thenList" style="margin-left:40px;">
                          <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                            <span
                              v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :node="items"
                              />
                              <ExpressionPocRender
                                :node="items.right"
                              />
                            </span>
                            <span
                              v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="否则">
                          <el-input
                            v-model="item.children.form.rulePassCode"
                            style="width: 182px"
                            size="mini"
                          />
                        </el-form-item>

                        <div class="elseList" style="margin-left:45px;">
                          <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                            <span
                              v-if="items && items.nodeType === NODE_TYPE.COMPARISON"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :node="items"
                              />
                              <ExpressionPocRender
                                :node="items.right"
                              />
                            </span>
                            <span
                              v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL"
                              class="node-tag"
                            >
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :node="items"
                              />
                            </span>
                          </div>
                        </div>
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
        <!-- <div class="mt-15 mb-15">
          <el-alert
            :closable="false"
            :title="$t('ruleSetting.newSearch')"
            show-icon
          />
        </div> -->
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
        <!-- <div v-loading="drawerLoading" class="content scroll"> -->
        <div ref="scrollContainer" class="content scroll">
          <NoData v-if="ruleList.length === 0" :text="$t('ruleSetting.noRuleData')" />
          <div
            v-for="item in ruleList"
            v-else
            :key="item.ruleId"
          >
            <RuleListItem :item="item" :rule-set-list-form="ruleSetListForm" @addToSetList="addToSetListFn(arguments)" />
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="text-left" style="margin-top: 45px">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="PageCurrentChange"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import RuleRender from '@/components/PocRender/PocRender'
import ExpressionPocRender from './ExpressionPocRender.vue'
// import FieldButton from './fieldButton.vue'
import RuleListItem from './RuleListItem.vue'
import { handleStatus } from '@/views/mainPages/decision/utils'
import { getRuleList, getRuleResults, saveRuleDefinedEdit } from '@/api/mainPages/decision'
import {
  getRuleSetting,
  pushRuleSettings,
  getMethodSetting,
  pushExpressionList
} from '@/api/systemManage/rule-manage'
import { bomClassAndField, getbomClassAndUpdateTime, getMethodList, getBomModelId } from '@/api/systemManage/bom'
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
    RuleListItem,
    ExpressionPocRender
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
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      bomModelId: '',
      showRule: false,
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleList: [], // 展示抽屉新增规则列表，
      drawer: false,
      RuleResults: [], // 执行结果
      search: '', // 搜索关键字
      currentPageData: [], // 当前页数据
      showPagination: false, // 是否显示分页器
      value: '',
      CopyDialogVisible: false,
      CopyDialogVisible2: false,
      treeData: [],
      field: {},
      params: {},
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
      searchValue: ''
    }
  },
  computed: {
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
    params(newValue) {
      this.field = newValue
    },
    fieldId(newValue) {
      this.keyValue++
    }
  },
  async created() {
    this.ruleEditor = new RuleEditor()
    this.NODE_TYPE = NODE_TYPE
    this.handleStatus = handleStatus
    this.getRuleList()
    // this.getRuleSetting()
    this.getRuleResults()
    this.getbomClassAndUpdateTime()
    getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
      this.bomModelId = res
    })
  },
  methods: {
    // 滚动加载~
    handleScroll() {
      // debugger
      const container = this.$refs.scrollContainer
      const scrollHeight = container.scrollHeight
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight

      // 判断是否滚动到底部，这里可以根据需要调整阈值
      if (scrollHeight - scrollTop <= clientHeight + 200) {
      // 触发加载下一页的操作，您可以在这里调用加载下一页数据的函数
        this.PageCurrentChange()
      }
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
    // 删除表达式
    delElseListFn(index, i) {
      this.ruleMethodList[index].elseList.splice(i, 1)
    },
    delThenListFn(index, i) {
      this.ruleMethodList[index].thenList.splice(i, 1)
    },
    delElseListFn2(index, i) {
      this.ruleMethodList[index].elseList.splice(i, 1)
    },
    delThenListFn2(index, i) {
      this.ruleMethodList[index].thenList.splice(i, 1)
    },
    // 点击加号出现弹窗
    addExpressionFn(index) {
      getMethodList(this.bomModelId).then(res => {
        this.listData = res
      })
      this.CopyDialogVisible = true
      this.currentIndex = index
    },
    addExpressionFn2(index) {
      getMethodList(this.bomModelId).then(res => {
        this.listData2 = res
      })
      this.CopyDialogVisible2 = true
      this.currentIndex2 = index
    },
    // 将表达式结构的数据转换成可渲染到页面的数据格式
    expressionTransferFn(items) {
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
      expressionNode.paramValue = paramValue

      return expressionNode
    },
    filterTreeArray(tree) {
      return tree.filter(item => {
        return item.leaf === false
      }).map(item => {
        item = Object.assign({}, item)
        if (item.children) {
          item.children = this.filterTreeArray(item.children)
        }
        return item
      })
    },
    // 点击弹窗中的确定按钮，将该条表达式添加到规则中
    copyExpressionToThenlist(item) {
      const expressionNode = this.expressionTransferFn(item)
      // debugger
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex].ruleId === item.ruleId) {
          this.ruleMethodList[this.currentIndex].thenList.push(expressionNode)
        }
      })
      this.CopyDialogVisible = false
    },
    copyExpressionToElselist(item) {
      const expressionNode = this.expressionTransferFn(item)
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex2].ruleId === item.ruleId) {
          this.ruleMethodList[this.currentIndex2].elseList.push(expressionNode)
        }
      })
      this.CopyDialogVisible2 = false
    },
    // 根据级联选择器的id获取对应的对象
    handleChange(selectedValues) {
      selectedValues.map((value, index) => {
      // 根据选中的值在数据源中查找相应的节点信息
        if (index === selectedValues.length - 1) {
          const id = value
          this.treeData.forEach(item => {
            item.children.forEach(item2 => {
              item2.children.forEach(item3 => {
                if (item3.fieldId === id) {
                  this.params = { ...item3, returnType: item3.type }
                }
              })
            })
          })
        }
      })
    },
    // 接收规则模板的对象
    submitRule(root, toRuleText) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.rule.ruleContent = JSON.stringify(root)
          this.rule.ruleDesc = toRuleText
          this.saveRuleDefinedEdit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存规则
    saveRuleDefinedEdit() {
      if (!this.currentNodePath) {
        console.error('currentNodePath')
        return
      }
      if (!this.decisionRepositoryModelId) {
        console.error('decisionRepositoryModelId')
        return
      }
      const data = {
        path: this.currentNodePath,
        decisionRepositoryId: this.decisionRepositoryModelId,
        decisionRepCatalogueId: this.rule.id,
        ...this.rule,
        codeServices: []
      }
      saveRuleDefinedEdit(data).then(async() => {
        this.$emit('PreviewRuleComponents', this.rule) // 切换回预览状态，高亮当前规则
      })
    },
    // 根据bomBaseInfoId加载所有类和字段
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(async res => {
        // const val = [res]
        // this.treeData = this.filterTreeArray(val)
        this.treeData = [res]
        const data1 = res
        const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
        await this.$forage.setItem('bomBaseInfoId', data1)
        await this.$forage.setItem('bomBaseInfoId_Time', res1.updatedDate)
      })
    },
    // 根据时间判断得到的是否是最新的数据
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = await this.$forage.getItem('bomBaseInfoId_Time')
      if (res1.updatedDate === time) {
        const storedData = await this.$forage.getItem('bomBaseInfoId')
        this.treeData = [storedData]
      } else {
        console.log(123)
        this.bomClassAndField()
      }
    },
    // 查询该路径下的规则列表
    async getRuleSetting() {
      this.loading = true
      await getRuleSetting(this.decisionUrlId).then(async(res) => {
        const { codeServices, ruleSettings } = res
        codeServices &&
          (await this.$store.dispatch(
            'app/SET_CODESERVICE',
            codeServices.toString()
          ))
        ruleSettings &&
          ruleSettings.filter(item => item.ruleType === '1').forEach(async(item, index) => {
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
            const res = await getMethodSetting({
              decisionUrlId: this.decisionUrlId,
              ruleId: this.ruleSetListForm.ruleSetList[index].ruleId
            })
            // 处理每个 ID 的响应结果
            this.$set(this.ruleMethodList, index, res)
            const transformedData = this.ruleMethodList.map(item => {
              const newItem = {
                bomModelId: this.bomModelId,
                decisionUrlId: item.decisionUrlId,
                ruleId: item.ruleId,
                elseList: item.elseList ? item.elseList.map(elseItem => ({
                  nodeType: 'EXPRESSION',
                  codeService: elseItem.codeService,
                  expressionId: elseItem.expressionId,
                  returnType: elseItem.returnType,
                  paramValue: elseItem.paramValue
                })) : [],
                thenList: item.thenList ? item.thenList.map(elseItem => ({
                  nodeType: 'EXPRESSION',
                  codeService: elseItem.codeService,
                  expressionId: elseItem.expressionId,
                  returnType: elseItem.returnType,
                  paramValue: elseItem.paramValue
                })) : []
              }
              return newItem
            })
            this.ruleMethodList = transformedData
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
    // 新增规则回调
    addToSetListFn(e) {
      const addItem = this._.cloneDeep(e[0])
      if (!e[0].ruleSettingContent) return
      if (!e[0].form) {
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
        this._.cloneDeep(e[0].ruleSettingContent),
        []
      ) // 把treeNode转换为nodeArray
      this.ruleSetListForm.ruleSetList.push(addItem)
      const method = {
        bomModelId: this.bomModelId,
        decisionUrlId: this.decisionUrlId,
        ruleId: addItem.ruleId,
        thenList: e[1] || [],
        elseList: e[2] || []
      }
      this.ruleMethodList.push(method)
    },
    // 查询规则列表
    async getRuleList() {
      this.drawerLoading = true
      await getRuleList(this.$store.state.app.applicationId, { pageNum: this.pageNum, pageSize: this.pageSize, queryKey: this.search }).then((res) => {
        this.ruleList = res.list
        this.total = res.total
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
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getRuleList()
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
      // this.ruleSetListForm.ruleSetList.splice(i, 1)
      // this.ruleMethodList.splice(i, 1)
      // return
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      // console.log(obj.parentState, index, 'obj.parentState')
      if (obj.children && obj.children.parentState === '1') {
        this.ruleSetListForm.ruleSetList[index].children = null
      } else {
        this.ruleSetListForm.ruleSetList.splice(index, 1)
      }

      this.showRule = true
      setTimeout(() => {
        this.showRule = false
      }, 1000)

      const index2 = this.ruleMethodList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      this.ruleMethodList.splice(index2, 1)
      // console.log(this.ruleSetListForm.ruleSetList[index], 'this.ruleSetListForm.ruleSetList[index]')
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
      // debugger
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
            // console.log(rootTreeNode, 'rootTreeNode')
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
          // console.log(ruleSettings, 'ruleSettings')

          const transformedData = []
          for (const item of this.ruleMethodList) {
            transformedData.push({
              'bomModelId': this.bomModelId,
              'decisionUrlId': this.decisionUrlId,
              'ruleId': item.ruleId,
              'elseList': item.elseList,
              'thenList': item.thenList
            })
          }
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
          pushExpressionList(transformedData).then(res => {
            this.$emit('toggleComponent', 'DecisionBase', 2)
            Bus.$emit('searchPath') // 调用搜索
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
    },
    thenSearch() {
      this.searchListData = this.listData.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
    },
    elseSearch() {
      this.searchListData2 = this.listData2.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
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
  .el-cascader{
    width: 160px;
    height: 30px!important;
  }
  .el-input--medium .el-input__inner {
    height: 30px!important;
  }
}
</style>
