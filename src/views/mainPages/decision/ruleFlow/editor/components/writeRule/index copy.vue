<template>
  <!-- 规则展示部分 -->
  <el-form ref="ruleSectionForm" :model="ruleSetListForm" :inline="true" class="item-wrap">
    <div class="r-body">
      <div
        v-for="(item, index) in ruleSetListForm.ruleSetList"
        :key="index"
        class="item-wrap"
        :class="[
          'status_' + item.approvalStatus,
          { 'is-border': item.children ? true : false },
        ]"
      >
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
            <el-dialog title="回写设置" :visible.sync="CopyDialogVisible" width="60%" style="text-align: left;">
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
                  {{ item.form.ruleResult }}
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
                  33333
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
            <el-dialog title="回写设置" :visible.sync="CopyDialogVisible2" width="60%" style="text-align: left;">
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
            <el-dialog title="回写设置" :visible.sync="CopyDialogVisible" width="60%" style="text-align: left;">
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
            <el-dialog title="回写设置" :visible.sync="CopyDialogVisible2" width="60%" style="text-align: left;">
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
    </div>
  </el-form>
</template>

<script>
import {
  getMethodSetting,
  getRuleSettingDetail
} from '@/api/systemManage/rule-manage'
import { bomClassAndField, getbomClassAndUpdateTime, getRuleResults, getMethodList } from '@/api/systemManage/bom'
import RuleRender from '@/components/PocRender/PocRender'
import { RuleEditor } from '@/utils/RuleEditor'
import { NODE_TYPE } from '@/utils/poc'
export default {
  name: 'WriteRule',
  components: {
    RuleRender
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ruleSetListForm: { ruleSetList: [] }, // 展示设置规则列表，
      editRuleContent: {},
      ruleMethodList: [
        {
          'bomModelId': null,
          'decisionUrlId': '4120ead7f4ec4040abb536bdace403e1',
          'ruleId': 'PICC_003045',
          'thenList': [],
          'elseList': []
        }
      ],
      inputIndex: null,
      structure: null,
      isContextMenuVisible: null,
      contextMenuX: null,
      contextMenuY: null,
      needFieldPath: [],
      vInputValue: [],
      fieldParsing: [],
      vInputValue1: [],
      listData: [],
      searchListData: [],
      searchListData2: [],
      CopyDialogVisible: null,
      currentIndex: null,
      searchValue: '',
      decisionUrlId: '4120ead7f4ec4040abb536bdace403e1',
      uid: '1cf6c6eef3884a30b02aa8b9b704c29d',
      treeData: [],
      CopyDialogVisible2: false,
      RuleResults: [],
      isValidInput: '',
      errorText: '',
      startPos: '',
      endPos: '',
      currentIndex2: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.domTree.filter(val)
    },
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
            // if (this.needFieldPath.length === 0) return
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
    }
  },
  async created() {
    this.ruleEditor = new RuleEditor()
    this.NODE_TYPE = NODE_TYPE
    this.getRuleSettingDetail(0)
    this.getbomClassAndUpdateTime()
  },
  methods: {
    inputBlur(e) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
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
    // 获取规则执行不通过结果定义列表
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
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
        this.bomClassAndField()
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
    async getRuleSettingDetail(index) {
      await getRuleSettingDetail(this.decisionUrlId, this.uid).then(async(res1) => {
        const { codeServices, ruleSetting } = res1
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
          ruleResult: ruleSetting.ruleResult,
          ruleTest: ruleSetting.ruleTest,
          rulePassCode: ruleSetting.rulePassCode
        }
        this.fieldParsing[index] = ruleSetting.fieldParsing
        await this.editToSetList(ruleSetting, index)
      })
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
    clickOperation() {
      this.structure = 2
    },
    async editToSetList(nativeItem, index) {
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
          ruleResult: '2',
          ruleTest: '1',
          rulePassCode: ''
        }
      }
      addItem.ruleArray = this.ruleEditor.convertNodeTreeToArray(
        this._.cloneDeep(nativeItem.ruleSettingContent),
        []
      )
      this.$set(this.ruleSetListForm.ruleSetList, index, addItem)
      const res = await getMethodSetting({
        decisionUrlId: this.decisionUrlId,
        ruleId: this.ruleSetListForm.ruleSetList[index].ruleId
      })
      this.ruleMethodList[index] = res
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
            paramValue: elseItem.paramValue,
            fieldParsings: elseItem.fieldParsings
          })) : [],
          thenList: item.thenList ? item.thenList.map(elseItem => ({
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
    },
    addParamsFn(changeField, index) {
      this.isContextMenuVisible = false
      this.$nextTick(() => {
      })
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
        } else {
          var newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
        }
        this.vInputValue[this.inputIndex] = newValue// 更新输入框的值
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
      } else {
        this.ruleSetListForm.ruleSetList[this.inputIndex].form.rulePassCode = newValue
        this.vInputValue[this.inputIndex] = result
      }
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
    thenSearch() {
      this.searchListData = this.listData.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
    },
    elseSearch() {
      this.searchListData2 = this.listData2.filter(data => data.methodName.toLowerCase().includes(this.searchValue.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/rule/decisionRule.scss';
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
  height: calc(100% - 42px);
}
.el-card__body{
  padding:0!important;
}
#mountNode{
  width: 100%;
  height: 100%;
}
</style>
