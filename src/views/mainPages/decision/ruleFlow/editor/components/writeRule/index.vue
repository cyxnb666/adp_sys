/* eslint-disable no-dupe-keys */
<template>
  <div class="writeRule">
    <transition name="slide-fade">
      <el-form ref="ruleSectionForm" :model="ruleSetListForm" :inline="true">
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
              class="item-wrap"
              :class="[
                'status_' + item.approvalStatus,
                { 'is-border': item.children ? true : false },
              ]"
            >
              <div class="r-body">
                <!-- 规则展示部分 -->
                <div class="tree-wrapper">
                  <div class="ruleContent-wrapper">
                    <span style="font-size:16px;font-weight:bold;">如果: </span>
                    <span v-if="!item.ruleSettingContent">
                      <!-- <el-popover popper-class="item" trigger="hover" effect="dark">
                        <div slot="reference" v-html="item.ruleSettingDesc" />
                      </el-popover> -->
                      <!-- <div class="item" v-html="item.ruleSettingDesc" /> -->
                      <div v-html="item.ruleSettingDesc" />
                    </span>
                    <span v-else>
                      <span v-for="(items, i) in item.ruleArray" :key="i">
                        <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                          <RuleRender
                            :disabled="item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                            "
                            :node="items.left"
                          />
                          <RuleRender
                            :disabled="item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                            "
                            :node="items"
                          />
                          <RuleRender
                            :disabled="item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                            "
                            :node="items.right"
                          />
                        </span>
                        <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                          <RuleRender
                            :disabled="item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                            "
                            :node="items"
                          />
                        </span>
                        <span v-else class="node-tag">
                          <RuleRender
                            :disabled="item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false)
                            "
                            :node="items"
                          />
                        </span>
                      </span>
                    </span>

                  </div>

                  <!-- 正反向切换控制显示  start-->
                  <!-- 正向 -->
                  <!-- 那么 -->
                  <div v-if="item.form.ruleForward != '0'" class="forward_direction">
                    <div class="rule-else ruleContent-wrapper">
                      <span v-if="!item.ruleSettingContent">
                        <span style="font-size: 16px; font-weight: bold;margin-right:10px;">那么</span>
                        <div v-if="item.form.rulePassCode">规则提示{{ item.form.rulePassCode }}
                        </div>
                        <div v-html="item.thenListText" />
                      </span>
                      <span v-else>
                        <el-form-item prop="destPath">
                          <span style="font-size: 16px; font-weight: bold;margin-right:10px;">那么</span>
                          {{ $t('ruleSetting.rulePrompt') }}
                          <span @contextmenu.prevent="rightClick(index,$event)">
                            <textarea
                              v-model="vInputValue[index]"
                              :disabled="item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false)
                              "
                              style="width: 182px"
                              size="mini"
                              type="text"
                              @blur="inputBlur"
                              @input="validateInput"
                            />
                            <span v-if="!isValidInput" style="color: red">文本内容需要用双引号包裹</span>
                            <div
                              v-if="isContextMenuVisible"
                              :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
                              class="menuBox"
                              @mouseleave="hideContextMenu"
                            >

                              <div v-if="structure === 1" class="context-menu">
                                <div class="funBtn" @click="clickOperation">插入bom字段</div>
                              </div>

                              <div v-if="structure === 2">
                                <el-cascader-panel
                                  ref="cascaderPanel"
                                  v-model="changeField"
                                  :options="treeData"
                                  :props="{ value: 'field', checkStrictly: true }"
                                  @change="addParamsFn(changeField,index)"
                                />
                              </div>
                            </div>
                          </span>
                        </el-form-item>

                        <div class="thenList" style="margin-left:40px;">
                          <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                            <i
                              v-if="!(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                              "
                              class="el-icon-remove-outline"
                              style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                              @click="delThenListFn(index, i)"
                            />
                            <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.left"
                                :index="index"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                                :index="index"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.right"
                                :index="index"
                              />
                            </span>
                            <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
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
                            v-if="!(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                            "
                            class="el-icon-circle-plus-outline"
                            style="font-size: 25px;margin-top:5px;color:#606266;"
                            @click="addExpressionFn(index)"
                          />
                        </div>
                      </span></div>

                    <!-- 那么thenList弹窗 -->
                    <el-dialog title="回写设置" :modal="false" :visible.sync="CopyDialogVisible" width="60%" style="text-align: left;">
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
                            <el-table-column prop="methodName" label="表达式" height="50" />
                            <el-table-column label="操作" width="90%">
                              <template slot-scope="scope">
                                <el-button class="btn-border mini" @click="copyExpressionToThenlist(scope.row)">确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>

                    </el-dialog>
                    <!-- 否则 -->
                    <div class="rule-error ruleContent-wrapper" style="margin-top:10px;">
                      <span v-if="!item.ruleSettingContent">
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
                        <div v-html="item.elseListText" />
                      </span>
                      <span v-else>
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
                          <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
                          <el-radio-group
                            v-model="item.form.ruleResult"
                            :disabled="item.approvalStatus === '1' ||
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
                              v-if="!(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                              "
                              class="el-icon-remove-outline"
                              style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                              @click="delElseListFn(index, key)"
                            />
                            <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.right"
                              />
                            </span>
                            <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
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
                            v-if="!(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                            "
                            class="el-icon-circle-plus-outline"
                            style="font-size: 25px;margin-top:5px;color:#606266;"
                            @click="addExpressionFn2(index)"
                          />
                        </div>
                      </span>
                    </div>

                    <!-- 否则elseList弹窗 -->
                    <el-dialog title="回写设置" :modal="false" :visible.sync="CopyDialogVisible2" width="60%" style="text-align: left;">
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
                            <el-table-column prop="methodName" label="表达式" height="50" />
                            <el-table-column label="操作" width="90%">
                              <template slot-scope="scope">
                                <el-button class="btn-border mini" @click="copyExpressionToElselist(scope.row)">确定</el-button>
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
                      <span v-if="!item.ruleSettingContent">
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">那么</span>
                        <div v-html="item.elseListText" />
                      </span>
                      <span v-else>
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
                          <span style="padding-right: 20px;font-size:16px;font-weight:bold;">那么</span>
                          <el-radio-group
                            v-model="item.form.ruleResult"
                            :disabled="item.approvalStatus === '1' ||
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
                              v-if="!(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                              "
                              class="el-icon-remove-outline"
                              style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                              @click="delElseListFn2(index, key)"
                            />
                            <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.right"
                              />
                            </span>
                            <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
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
                            v-if="!(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                            "
                            class="el-icon-circle-plus-outline"
                            style="font-size: 25px;margin-top:5px;color:#606266;"
                            @click="addExpressionFn2(index)"
                          />
                        </div>
                      </span>
                    </div>

                    <!-- 那么elseList弹窗 -->
                    <el-dialog title="回写设置" :modal="false" :visible.sync="CopyDialogVisible" width="60%" style="text-align: left;">
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
                            <el-table-column prop="methodName" label="表达式" height="50" />
                            <el-table-column label="操作" width="90%">
                              <template slot-scope="scope">
                                <el-button class="btn-border mini" @click="copyExpressionToThenlist(scope.row)">确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </el-dialog>

                    <div class="rule-else ruleContent-wrapper" style="margin-top:10px;">
                      <span v-if="!item.ruleSettingContent">
                        <span style="padding-right: 20px;font-size:16px;font-weight:bold;">否则</span>
                        <span v-if="item.form.rulePassCode">规则提示{{ item.form.rulePassCode }}</span>
                        <div v-html="item.thenListText" />
                      </span>
                      <span v-else>
                        <el-form-item class="rule-else-item">
                          <span style="font-size: 16px; font-weight: bold;margin-right:10px;">否则</span>
                          <span @contextmenu.prevent="rightClick(index,$event)">
                            <textarea
                              v-model="vInputValue[index]"
                              :disabled="item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false)
                              "
                              style="width: 182px"
                              size="mini"
                              @blur="inputBlur"
                            />
                            <div
                              v-if="isContextMenuVisible"
                              :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
                              class="menuBox"
                              @mouseleave="hideContextMenu"
                            >

                              <div v-show="structure === 1" class="context-menu">
                                <div class="funBtn" @click="clickOperation">插入bom字段</div>
                              </div>

                              <div v-if="structure === 2">
                                <el-cascader-panel
                                  ref="cascaderPanel"
                                  v-model="changeField"
                                  :options="treeData"
                                  :props="{ value: 'field', checkStrictly: true }"
                                  @change="addParamsFn(changeField,index)"
                                />
                              </div>
                            </div>
                          </span>

                        </el-form-item>

                        <div class="thenList" style="margin-left:40px;">
                          <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                            <i
                              v-if="!(item.approvalStatus === '1' ||
                                item.approvalStatus === '2' ||
                                (item.children ? true : false))
                              "
                              class="el-icon-remove-outline"
                              style="font-size: 18px;margin-right:5px;padding-top:5px;color:#606266;"
                              @click="delThenListFn2(index, i)"
                            />
                            <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.left"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items.right"
                              />
                            </span>
                            <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
                                  item.approvalStatus === '2' ||
                                  (item.children ? true : false)
                                "
                                :node="items"
                              />
                            </span>
                            <span v-else class="node-tag">
                              <ExpressionPocRender
                                :disabled="item.approvalStatus === '1' ||
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
                            v-if="!(item.approvalStatus === '1' ||
                              item.approvalStatus === '2' ||
                              (item.children ? true : false))
                            "
                            class="el-icon-circle-plus-outline"
                            style="font-size: 25px;margin-top:5px;color:#606266;"
                            @click="addExpressionFn(index)"
                          />
                        </div>
                      </span>

                    </div>

                    <!-- 否则thenList弹窗 -->
                    <el-dialog title="回写设置" :modal="false" :visible.sync="CopyDialogVisible2" width="60%" style="text-align: left;">
                      <el-row>
                        <el-col class="col-right">
                          <el-input v-model="searchValue" placeholder="请输入关键字搜索" @input="elseSearch">
                            <el-button slot="append" icon="el-icon-search" @click="elseSearch" />
                          </el-input>
                        </el-col>
                      </el-row>
                      <el-row>
                        <cl-col>
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
                            <el-table-column prop="methodName" label="表达式" height="50" />
                            <el-table-column label="操作" width="90%">
                              <template slot-scope="scope">
                                <el-button class="btn-border mini" @click="copyExpressionToElselist(scope.row)">确定</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </cl-col>
                      </el-row>
                    </el-dialog>

                  </div>
                  <!-- 正反向切换控制显示  end-->
                </div>

              </div>
              <!-- 产出试运行 -->
              <div v-if="item.children" style="padding: 20px" class="output-rule">
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
                        <!-- {{ handleStatus(item.children.approvalStatus) }} -->
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

                  <div class="right">
                    <div class="item align-item-center">
                      <el-button type="text" icon="el-icon-help" @click="deleteTestRule(item.id)">{{
                        $t('ruleSetting.recoveryRule') }}</el-button>
                      <el-button type="text" icon="el-icon-delete" @click="deleteRule(item,index)">{{
                        $t('ruleSetting.removeRule') }}</el-button>
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
                    <span v-if="!item.ruleSettingContent">
                      <div v-html="item.ruleSettingDesc" />
                    </span>
                    <span v-else>
                      <span v-for="(items, i) in item.children.ruleArray" :key="i">
                        <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                          <RuleRender :node="items.left" />
                          <RuleRender :node="items" />
                          <RuleRender :node="items.right" />
                        </span>
                        <span
                          v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL
                          "
                          class="node-tag"
                        >
                          <RuleRender :node="items" />
                        </span>
                        <span v-else class="node-tag">
                          <RuleRender :node="items" />
                        </span>
                      </span>
                    </span>
                    <!-- 正向 -->
                    <div v-if="item.children.form.ruleForward != '0'" class="forward_direction">
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="那么">
                          <span v-if="item.ruleSettingContent">
                            <el-input v-model="item.children.form.rulePassCode" style="width: 182px" size="mini" />
                          </span>
                        </el-form-item>
                        <span v-if="!item.ruleSettingContent">
                          <div v-html="item.thenListText" />
                        </span>
                        <span v-else>
                          <div class="elseList" style="margin-left:45px;">
                            <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                              <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                                <ExpressionPocRender :node="items.left" />
                                <ExpressionPocRender :node="items" />
                                <ExpressionPocRender :node="items.right" />
                              </span>
                              <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                              <span v-else class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                            </div>
                          </div>
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
                        <span v-if="!item.ruleSettingContent">
                          <div v-html="item.elseListText" />
                        </span>
                        <span v-else>
                          <div class="thenList" style="margin-left:40px;">
                            <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                              <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                                <ExpressionPocRender :node="items.left" />
                                <ExpressionPocRender :node="items" />
                                <ExpressionPocRender :node="items.right" />
                              </span>
                              <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                              <span v-else class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                            </div>
                          </div>
                        </span>
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
                          <el-radio-group v-model="item.children.form.ruleResult">
                            <el-radio
                              v-for="resultItem in RuleResults"
                              :key="resultItem.resultCode"
                              :label="resultItem.resultCode"
                            >{{ resultItem.resultName }}</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <span v-if="!item.ruleSettingContent">
                          <div v-html="item.elseListText" />
                        </span>
                        <span v-else>
                          <div class="thenList" style="margin-left:40px;">
                            <div v-for="(items, i) in ruleMethodList[index]?.thenList" :key="i">
                              <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                                <ExpressionPocRender :node="items.left" />
                                <ExpressionPocRender :node="items" />
                                <ExpressionPocRender :node="items.right" />
                              </span>
                              <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                              <span v-else class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                            </div>
                          </div>
                        </span>
                      </div>
                      <div class="rule-else">
                        <el-form-item class="rule-else-item" label="否则">
                          <el-input v-if="item.ruleSettingContent" v-model="item.children.form.rulePassCode" style="width: 182px" size="mini" />
                        </el-form-item>
                        <span v-if="!item.ruleSettingContent">
                          <div v-html="item.thenListText" />
                        </span>
                        <span v-else>
                          <div class="elseList" style="margin-left:45px;">
                            <div v-for="(items, key) in ruleMethodList[index]?.elseList" :key="key">
                              <span v-if="items && items.nodeType === NODE_TYPE.COMPARISON" class="node-tag">
                                <ExpressionPocRender :node="items.left" />
                                <ExpressionPocRender :node="items" />
                                <ExpressionPocRender :node="items.right" />
                              </span>
                              <span v-else-if="items && items.nodeType === NODE_TYPE.LOGICAL" class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                              <span v-else class="node-tag">
                                <ExpressionPocRender :node="items" />
                              </span>
                            </div>
                          </div>
                        </span>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="postRule">确 定</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import RuleRender from '@/components/PocRender/PocRender'
import ExpressionPocRender from '../../../../setting/components/ExpressionPocRender.vue'
// import FieldButton from './fieldButton.vue'
import { handleStatus } from '@/views/mainPages/decision/utils'
import { getRuleResults, saveRuleDefinedEdit } from '@/api/mainPages/decision'
import { bomClassAndField, getMethodList, getBomModelId } from '@/api/systemManage/bom'
import { RuleEditor } from '@/utils/RuleEditor'
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
    ExpressionPocRender
  },
  props: {
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
    ruleResultsList: {
      type: Array,
      default: null
    },
    treeData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      bomModelId: '',
      showRule: false,
      loading: false,
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      ruleSetList: [],
      InceptionRuleSetList: [],
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
      fieldParsing: [''],
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
      queryflag: false,
      searchValue: '',
      thenList: [],
      elseList: [],
      decisionUrlId: 'eed5ab6c2fe3432fbc5285d71d4a2530',
      ruleSettingId: '7ca262e076064215b0c11a555b561d05',
      ruleId: '',
      fieldParsings: {}
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
    vInputValue: {
      async handler(newValue) {
        if (!this.treeData) {
          await this.bomClassAndField()
        }
        newValue.forEach((item, index) => {
          var regex1 = /\${(.*?)}/g
          var matches1 = [...this.fieldParsing[index].matchAll(regex1)]
          var foundStrings = matches1.map(match => match[1])
          if (this.needFieldPath[index]) {
            this.needFieldPath[index] = [...this.needFieldPath[index], ...foundStrings]
          } else {
            this.needFieldPath[index] = []
            this.needFieldPath[index] = [...this.needFieldPath[index], ...foundStrings]
          }
          if (item) {
            if (!this.needFieldPath[index]) {
              this.needFieldPath[index] = []
            }
            if (this.needFieldPath[index].length !== 0) {
              for (let i = 0; i < this.needFieldPath[index].length; i++) {
                const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
                const parentLabel = this.findParentLabel(treeDataCopy, this.needFieldPath[index][i])
                const result = parentLabel.join('的')
                if (newValue.indexOf(result)) {
                  item = item.replace(result, '${' + this.needFieldPath[index][i] + '}')
                }
                this.fieldParsing[index] = item
              }
            } else {
              this.fieldParsing[index] = item
            }
          }
          this.ruleSetListForm.ruleSetList[index].form.rulePassCode = newValue[index]
        })
        newValue.forEach((item, index) => {
          if (!this.fieldParsing[index]) return
          const regex = /[^+\-*/]+/g
          const checkout = this.fieldParsing[index].match(regex)
          if (checkout) {
            checkout.forEach((item1, index1) => {
              if (!(item1.startsWith('\${') && item1.endsWith('\}'))) {
                const isNumber = /^\d+$/.test(item1)
                if (!isNumber) {
                  if (!(item1.startsWith('"') && item1.endsWith('"'))) {
                    this.isValidInput = false
                  } else {
                    this.isValidInput = true
                  }
                }
              }
            })
          }
        })
      }
    },
    ruleSetListForm: {
      handler(newValue) {
        // console.log(newValue)
      }
    },
    params(newValue) {
      this.field = newValue
    },
    fieldId(newValue) {
      this.keyValue++
    }
  },
  mounted() {
    setTimeout(() => {
      if ((this.ruleSetListForm.ruleSetList).length === 1) {
        this.vInputValue.push((this.ruleSetListForm.ruleSetList)[0].form.rulePassCode || '')
      } else {
        (this.ruleSetListForm.ruleSetList).forEach((item, index) => {
          this.vInputValue.push(item.form.rulePassCode || '')
        })
      }
    }, 1000)
  },
  beforeDestroy() {
  },
  async created() {
    this.ruleEditor = new RuleEditor()
    this.NODE_TYPE = NODE_TYPE
    this.handleStatus = handleStatus
    this.RuleResults = this.ruleResultsList
    // this.bomClassAndField()
    getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
      this.bomModelId = res
    })
    this.loading = true
  },
  methods: {
    // 查询该路径下的规则列表   刚进入给  this.rulemothedlist赋值
    async getRuleDefinedDetail1(node, index) {
      index = 0
      // const index = 0
      this.saveRuleList = []
      this.ruleId = node.ruleId
      let codeServices = {}
      let ruleSetting = {}
      let elseList = {}
      let thenList = {}
      codeServices = node.codeServices || null
      ruleSetting = { ...node }
      elseList = [...node.elseList || []]
      thenList = [...node.thenList || []]
      codeServices &&
        (await this.$store.dispatch(
          'app/SET_CODESERVICE',
          codeServices.toString()
        ))
      ruleSetting.operate = 1
      ruleSetting.ruleSettingContent = JSON.parse(ruleSetting.ruleSettingContent)
      ruleSetting.form = {
        time: [
          ruleSetting.effectiveDate || -28800000,
          ruleSetting.invalidatedDate || 3155731200000
        ],
        ruleForward: ruleSetting.ruleForward,
        ruleResult: ruleSetting.ruleResult || this.RuleResults[0].resultCode,
        ruleTest: ruleSetting.ruleTest,
        rulePassCode: ruleSetting.rulePassCode || ''
      }
      this.fieldParsing[index] = ruleSetting.fieldParsing || ''
      this.editToSetList(ruleSetting, index)
      const res = {
        elseList: elseList,
        thenList: thenList
      }
      // 处理每个 ID 的响应结果
      this.$set(this.ruleMethodList, index, res)
      const transformedData = this.ruleMethodList.map(item => {
        const newItem = {
          bomModelId: this.bomModelId,
          decisionUrlId: this.decisionUrlId,
          ruleId: this.ruleId,
          elseList: item.elseList ? item.elseList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            methodId: elseItem.methodId,
            codeService: elseItem.codeService,
            expressionId: elseItem.expressionId,
            returnType: elseItem.returnType,
            paramValue: elseItem.paramValue,
            fieldParsings: elseItem.fieldParsings
          })) : [],
          thenList: item.thenList ? item.thenList.map(elseItem => ({
            nodeType: 'EXPRESSION',
            methodId: elseItem.methodId,
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
    },
    editToSetList(nativeItem, index) {
      const addItem = this._.cloneDeep(nativeItem)
      // if (!nativeItem.ruleSettingContent) return
      if (!nativeItem.form) {
        addItem.approvalStatus = '0'
        addItem.form = {
          time: [-28800000, 3155731200000],
          ruleForward:
            this.applicationRuleForward === '0' ||
              this.applicationRuleForward === '1'
              ? '1'
              : '0',
          ruleResult: this.RuleResults[0].resultCode,
          ruleTest: '1',
          rulePassCode: ''
        }
      }
      addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
        this._.cloneDeep(nativeItem.ruleSettingContent),
        []
      )
      this.$set(this.ruleSetListForm.ruleSetList, index, addItem)
      this.saveRuleList.push(addItem)
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
    cancelDialog() {
      this.$emit('cancelDiag')
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
    // 错误提示
    validateInput() {
      // 在此处编写验证逻辑
      // 如果输入内容不符合标准，将 this.isValidInput 设置为 false
      this.isValidInput = true // 默认为 true
      // 示例验证逻辑：输入内容必须为纯数字
      if (this.errorText !== '') {
        this.isValidInput = false
      }
    },
    // 鼠标右击事件
    rightClick(index, event) {
      this.inputIndex = index
      this.structure = 1
      this.isContextMenuVisible = true
      this.contextMenuX = event.clientX
      this.contextMenuY = event.clientY
    },
    hideContextMenu() {
      this.isContextMenuVisible = false
    },
    inputBlur(e) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
    },
    clickOperation() {
      this.structure = 2
    },
    findParentLabel(treeData, fieldPath) {
      // 将 fieldPath 拆分为字段名数组
      const pathElements = fieldPath.split('.')
      // 初始化一个变量来存储父级节点的 label
      const parentLabel = []

      // 递归函数，用于在树结构中查找匹配的字段名
      function findLabelRecursively(node, index) {
        if (index >= pathElements.length) {
          return // 已经遍历完所有路径元素
        }
        const fieldName = pathElements[index]

        let found = false // 用于标记是否找到匹配的字段

        for (const item of node) {
          if (item.field === fieldName) {
            parentLabel.push(item.label)
            found = true
            if (item.children) {
              findLabelRecursively(item.children, index + 1) // 递归查找下一个路径元素
            }
            break // 找到匹配的字段后，不再继续搜索当前层级的其他节点
          }
        }

        if (!found) {
          // 如果当前层级没有找到匹配的字段，继续查找下一个节点
          for (const item of node) {
            if (item.children) {
              findLabelRecursively(item.children, index)
            }
          }
        }
      }

      // 从根节点开始查找
      findLabelRecursively(treeData, 0)

      // 返回父级节点的 label
      return parentLabel
    },
    addParamsFn(changeField, index) {
      this.isContextMenuVisible = false
      var vInputValue1 = changeField
      var fieldPath1 = ''
      for (let i = 1; i < vInputValue1.length; i++) {
        fieldPath1 += vInputValue1[i] + '.'
      }
      // this.needFieldPath[this.inputIndex]=new Array
      if (Array.isArray(this.needFieldPath[this.inputIndex])) {
        this.needFieldPath[this.inputIndex].push(fieldPath1.slice(0, fieldPath1.length - 1))
      } else {
        this.needFieldPath[this.inputIndex] = new Array()
        this.needFieldPath[this.inputIndex].push(fieldPath1.slice(0, fieldPath1.length - 1))
      }
      var needFieldPath1 = fieldPath1.slice(0, fieldPath1.length - 1)
      const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
      const parentLabel = this.findParentLabel(treeDataCopy, needFieldPath1)
      const result = parentLabel.join('的')
      var txt = this.vInputValue[this.inputIndex] === 'undefined' ? '' : this.vInputValue
      txt = String(this.vInputValue[this.inputIndex])

      if (txt.slice(0, this.startPos) || txt.slice(this.endPos)) {
        if (txt.slice(this.endPos) === 'undefined') {
          var newValue = txt.slice(0, this.startPos) + result
          // this.fieldParsing[this.inputIndex] ='"'+txt.slice(0, this.startPos)+'"'+"${"+needFieldPath+"}"
          // this.jvaneedparam = `${txt.slice(0, this.startPos)}'${needFieldPath}'`
        } else {
          var newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
          // this.fieldParsing[this.inputIndex] ='"'+txt.slice(0, this.startPos)+'"'+"${"+needFieldPath+"}"+'"'+txt.slice(this.endPos)+'"'
          // this.jvaneedparam = `${txt.slice(0, this.startPos)}'${needFieldPath}'${txt.slice(this.endPos)}`
        }
        this.vInputValue[this.inputIndex] = newValue// 更新输入框的值
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
      } else {
      // this.jvaneedparam = `'${needFieldPath}'`
      // this.fieldParsing[this.inputIndex] = "${"+needFieldPath+"}"
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
        this.vInputValue[this.inputIndex] = result
      }
    },
    init() {
      let value = null
      if (this.paramId) {
        // 表达式存值
        value = this.node.paramValue[this.paramId]
      } else {
        // 普通节点存值
        value = this.node.paramValue
      }
      if (
        this.format.type === 'selector' ||
        this.format.type === 'selector-multiple'
      ) {
        this.vSelectValue = value
      } else {
        if (this.format.type === 'date') {
          this.vInputValue = new Date(value)
        }
        this.vInputValue = value
      }
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
        this.searchListData = res
      })
      this.CopyDialogVisible = true
      this.currentIndex = index
    },
    addExpressionFn2(index) {
      getMethodList(this.bomModelId).then(res => {
        this.listData2 = res
        this.searchListData2 = res
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
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex].ruleId === item.ruleId) {
          this.ruleMethodList[this.currentIndex].thenList.push(expressionNode)
        }
      })
      this.CopyDialogVisible = false
      this.searchValue = ''
    },
    copyExpressionToElselist(item) {
      const expressionNode = this.expressionTransferFn(item)
      this.ruleSetListForm.ruleSetList.forEach(item => {
        if (this.ruleMethodList[this.currentIndex2].ruleId === item.ruleId) {
          this.ruleMethodList[this.currentIndex2].elseList.push(expressionNode)
        }
      })
      this.CopyDialogVisible2 = false
      this.searchValue = ''
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
      return bomClassAndField(data).then(res => {
        // const val = [res]
        // this.treeData = this.filterTreeArray(val)
        this.treeData = [res]
      })
    },
    // 搜索规则
    querySearch: _.throttle(async function() {
      if (this.search === '') {
      } else {
      }
    }, 1000),

    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
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
    deleteRule(obj, i) {
      obj.operate = 2
      // this.ruleSetListForm.ruleSetList.splice(i, 1)
      // this.ruleMethodList.splice(i, 1)
      // return
      // this.vInputValue.splice(index,1)
      this.vInputValue.splice(i, 1)
      const index = this.ruleSetListForm.ruleSetList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      const index3 = this.ruleSetList.findIndex((item) => {
        return item === obj.ruleId
      })
      const index1 = this.saveRuleList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      if (obj.children && obj.children.parentState === '1') {
        this.ruleSetListForm.ruleSetList[index].children = null
      } else {
        this.ruleSetListForm.ruleSetList.splice(index, 1)
        this.ruleSetList.splice(index3, 1)
        if (index1 === -1) {
          this.saveRuleList.push(obj)
        } else {
          this.saveRuleList.splice(index1, 1)
        }
      }

      // this.showRule = true
      // setTimeout(() => {
      //   this.showRule = false
      // }, 1000)

      const index2 = this.ruleMethodList.findIndex((item) => {
        return item.ruleId === obj.ruleId
      })
      this.ruleMethodList.splice(index2, 1)
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
      const isValid = await this.$refs.obs.validate()
      if (!isValid) {
        return false
      }
      // if (this.saveRuleList.length === 0) {
      //   this.$message({
      //     message: '内容暂无修改',
      //     type: 'warning'
      //   })
      //   return false
      // }
      this.$refs.ruleSectionForm.validate((valid) => {
        if (valid) {
          const newRuleList = flatten(this.saveRuleList)
          var ruleSettings = newRuleList.map((item, index) => {
            const rootTreeNode = this.ruleEditor.parseRuleNode(
              null,
              this._.cloneDeep(item.ruleArray)
            ) // 把nodeArray 组成treeNode
            var text = this.ruleEditor.getText(
              this._.cloneDeep(rootTreeNode),
              ''
            )
            let elseList = null
            let thenList = null
            this.ruleMethodList.forEach((item1) => {
              if (item1.ruleId === item.ruleId) {
                if (item1.thenList.length > 1) {
                  item1.thenList.forEach((res, index) => {
                    if (!res.fieldParsings) {
                      res.fieldParsings = this.fieldParsings || {}
                    }
                  })
                } else if (item1.thenList.length === 1) {
                  if (!item1.thenList[0].fieldParsings) {
                    item1.thenList[0].fieldParsings = this.fieldParsings || {}
                  }
                }
                if (item1.elseList.length > 1) {
                  item1.elseList.forEach((res, index) => {
                    if (!res.fieldParsings) {
                      res.fieldParsings = this.fieldParsings || {}
                    }
                  })
                } else if (item1.elseList.length === 1) {
                  if (!item1.elseList[0].fieldParsings) {
                    item1.elseList[0].fieldParsings = this.fieldParsings || {}
                  }
                }
                elseList = item1.elseList
                thenList = item1.thenList
              }
            })
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
              path: item.path,
              // ruleSettingDesc: text,
              rulePassCode: item.form.rulePassCode,
              approvalStatus: item.approvalStatus, // 状态
              fieldParsing: this.fieldParsing[index] || '',
              operate: item.operate,
              elseList: elseList,
              thenList: thenList
            }
          })
          this.$emit('saveNodeRule', ruleSettings)
          this.$emit('cancelDiag')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 打开添加规则list抽屉
    openRuleList() {
      this.drawer = true
    },

    // 撤销全部修改
    resetRule() {
      this.ruleSetListForm.ruleSetList = []
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
@import '@/styles/rule/decisionRule.scss';
.writeRule {

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
.col-right{
  float: right;
}
.item-wrap{
  height:400px;
  overflow-y: scroll;
  padding-top:0;
}
.item-wrap .r-body{
  text-align: left;
}
.el-form-item{
  margin-bottom:0px;
}
}
</style>
