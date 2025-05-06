<template>
  <div class="app-container poc-model">
    <div class="title-style1">
      <i class="icon icon-1"/>
      <h6>{{ $t('ruleManage.ruleManage') }}</h6>
    </div>
    <el-row style="position: relative;" type="flex" class="flex-wrap" :gutter="15">
      <div :style="{'height': isOpen ? null : '46px', margin: 0 }" type="flex" class="flex-wrap">
        <!-- 选择BOM模型 -->
        <el-col :span="7">
          <el-card class="head-card mr-15">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('bomManage.selectModel') }}</span>
            </div>
            <div class="content1 form-mini-style">
              <el-select v-model="currentBomId" @change="getDecisionRepositoryDetail">
                <el-option
                  v-for="item in BomList"
                  :key="item.bomBaseInfoId"
                  :value="item.bomBaseInfoId"
                  :label="item.bomName"
                />
              </el-select>
            </div>
          </el-card>
        </el-col>
        <!-- 当前业务对象模型的决策库信息 -->
        <el-col :span="7">
          <el-card class="head-card mr-15">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('ruleManage.decisionInfo') }}</span>
            </div>
            <div v-if="bomBaseInfo" class="content1">
              <el-form ref="form" :model="bomName" :hide-required-asterisk="true">
                <el-form-item
                  prop="bomName"
                  :label="$t('bomCreat.decisionName')"
                  :rules="[
                    {
                      required: true,
                      message: $t('bomCreat.enterDecisionName'),
                      trigger: 'blur'
                    },
                    {
                      pattern: BASE,
                      message: $t('ruleManage.four'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input v-model="bomName.bomName"/>
                </el-form-item>
              </el-form>

              <div class="text-center mt-15">
                <el-button type="primary" @click="updateByFieldName">{{ $t('button.save') }}</el-button>
              </div>
            </div>
            <NoData v-else :text="$t('ruleManage.selectBom')"/>
          </el-card>
        </el-col>
        <!-- 当前业务对象模型（BOM）信息 -->
        <el-col :span="10">
          <el-card class="head-card">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('ruleManage.bomInfo') }}</span>
            </div>
            <div v-if="bomBaseInfo" class="content1">
              <div class="bom-info">
                <div class="item">
                  <span class="name"> {{ $t('bomCreat.modelName') }}：</span>
                  <span class="val"> {{ bomBaseInfo.bomName }}</span>
                </div>
                <div class="item">
                  <span class="name"> {{ $t('bomCreat.bomBaseInfoId') }}：</span>
                  <span class="val"> {{ bomBaseInfo.bomBaseInfoId }}</span>
                </div>
                <div class="item">
                  <span class="name"> {{ $t('bomCreat.bomVersion') }}：</span>
                  <span class="val"> {{ bomBaseInfo.bomVersion }}</span>
                </div>
                <div class="item">
                  <span class="name"> {{ $t('bomCreat.remark') }}：</span>
                  <span class="val"> {{ bomBaseInfo.remark }}</span>
                </div>
              </div>
            </div>
            <NoData v-else :text="$t('ruleManage.selectBom')"/>
          </el-card>
        </el-col>
      </div>
      <el-button
        style="
    font-size: 28px;
    position: absolute;
    left: 50%;
    transform: translateZ(10px);
    bottom: -28px;
    color: #adadad;
    padding: 0;
    "
        type="text"
        :icon="isOpen? 'el-icon-arrow-up':'el-icon-arrow-down'"
        @click="OpenToShow"
      />
    </el-row>
    <div class="flex-wrap mt-30">
      <el-card class="tree-wrap box-card mr-15">
        <el-tabs v-model="activeName">
          <!-- 决策库浏览 -->
          <el-tab-pane :label="$t('ruleManage.decisionLib')" name="first">
            <el-row type="flex" class="flex-wrap" :gutter="15">
              <el-col :span="7" class="content2 bom-tree">
                <div v-if="currentBomId && activeName === 'first'" class="content">
                  <Tree
                    v-if="decisionRepositoryModel"
                    id="1"
                    ref="bomTree"
                    bom-base-info-id=""
                    :tree-data="treeData"
                    :default-expand-all="true"
                    :default-expanded-keys="['70c15a232484482c8222a227af1fcb63']"
                    :default-checked-keys="defaultChecked"
                    :current-node-key="currentNodeKey"
                    node-key="id"
                    auto-expand-parent="true"
                    @selectField="handleNodeClick"
                    @node-contextmenu="rightClick"
                  >
                    <!-- 顶部的按钮插槽 -->
                    <template #pre>
<!--                      <el-button class="btn-tree" type="text" @click="open">{{-->
<!--                          $t('ruleManage.NewDirectory')-->
<!--                        }}-->
<!--                      </el-button>-->
                      <el-button class="btn-tree" type="text" @click="open">{{ $t('ruleManage.NewDirectory') }}</el-button>
                      <span class="btn-line">|</span>
                    </template>
                    <!-- 树结构的自定义标题插槽 -->
                    <template #customNode="{ node }">
                      <!-- {{ node }} -->
                      <div class="tree-text">
                        <template>
                          <i v-if="node.leaf" class="el-icon-tickets"/>
                          <i v-else class="el-icon-folder-opened"/>
                          {{ node.label }}
                          <!-- <el-dropdown
                            size="small"
                            trigger="click"
                            class="tree-dropdown"
                          >
                            <span class="el-dropdown-link">
                              <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item>删除</el-dropdown-item>
                              <el-dropdown-item>移动</el-dropdown-item>
                              <el-dropdown-item>重命名</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown> -->
                        </template>
                      </div>
                    </template>
                  </Tree>
                  <context-menu
                    class="tree-right-menu"
                    :target="contextMenuTarget"
                    :show="contextMenuVisible"
                    @update:show="(show) => (contextMenuVisible = show)"
                  >
                    <a v-show="isCurrentRename" href="javascript:;" @click="nodeRename">{{ $t('common.rename') }}</a>
                    <a v-show="isCurrentDataDel" href="javascript:;" @click="nodeDelete">{{ $t('button.delete') }}</a>
                    <!-- <a href="javascript:;" @click="nodeMove">移动</a> -->
                    <!-- <a v-show="isCurrentCopy" href="javascript:;" @click="nodeCopy">复制</a> -->
                  </context-menu>
                  <el-dialog
                    :title="$t('common.hint')"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose"
                  >
                    <span>{{ $t('ruleManage.oneInfo') }}</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
                      <el-button type="primary" @click="confirmDialog">{{ $t('button.OK') }}</el-button>
                    </span>
                  </el-dialog>
                </div>
                <NoData v-else :text="$t('ruleManage.selectBom')"/>
              </el-col>
              <el-col :span="17" class="relative rule-card-wrap">
                <div class="flex-wrap">
                  <!-- 新增决策规则 -->
                  <el-button class="btn-border mini" @click="handleAddRule('rule')">
                    {{ $t('ruleManage.newdecRule') }}
                  </el-button>
                  <!-- 新增决策表 -->
                  <el-button class="btn-border mini" @click="handleAddRule('decisionTable')">
                    {{ $t('ruleManage.newdecTable') }}
                  </el-button>
                  <!-- 新增评分卡 -->
                  <el-button class="btn-border mini" @click="handleAddRule('scorecard')">
                    {{ $t('ruleManage.newScorecard') }}
                  </el-button>
                  <!-- 复制当前规则 -->
                  <el-button class="btn-border mini" @click="handleCopyRule">
                    {{ $t('ruleManage.copyRule') }}
                  </el-button>
                  <!-- <el-button
                    class="btn-border mini"
                    @click="
                      () => {
                        $message.error('您无权操作此功能')
                      }
                    "
                  >
                    导出PDF
                  </el-button> -->
                  <!-- 下载决策表模板 -->
                  <el-button class="btn-border mini" @click="handleDownloadDecisionTable">
                    {{ $t('ruleManage.downloadTemp') }}
                  </el-button>
                  <el-button class="btn-border mini" @click="historicalVersionBtn">
                    {{ $t('ruleManage.historicalVersion') }}
                  </el-button>
                  <!-- <el-button class="btn-border mini" @click="addedAScorecard">
                    新增评分卡
                  </el-button> -->
                </div>
                <el-card class="box-card">
                  <div v-if="currentBomId" class="content poc-edit">
                    <!-- 规则预览 -->
                    <RulePreview
                      v-if="showComponent === SHOWCOMPONENT.RULEPREVIEW"
                      :rule="rule"
                      :current-node="currentNode"
                      @handleDeleteRow="handleDeleteRow"
                      @ruleEdit="handleRuleEdit"
                    />
                    <!-- 上传决策表 -->
                    <DecisionTablesUpload
                      v-if="showDecisionTables"
                      :dialog-form-visible.sync="showDecisionTables"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :decision-rep-catalogue-id="currentNode.id"
                      :current-node-path="currentNode.path"
                      :bom-base-data="treeData2"
                      :bom-base-info-id="currentBomId"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                      @editPreviewExcel="editPreviewExcelFun"
                      @addSuccess="addSucess"
                    />
                    <!-- <EditDecisionPreview
                      v-else-if="showComponent === SHOWCOMPONENT.EDITDECISIONPREVIEW"
                      :is-add="true"
                      :bom-base-data="treeData2"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      :edit-preview-excel.sync="editPreviewExcel"
                      @addSuccess="addSucess"
                    /> -->
                    <!-- 下载决策表模板 -->
                    <DecisionTablesDownload
                      v-else-if="showComponent === SHOWCOMPONENT.DECISIONTABLESDOWNLOAD
                      "
                      :bom-base-data="treeData2"
                      :dialog-form-visible.sync="showDecisionTablesDownload"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      :bom-base-info-id="currentBomId"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                    />

                    <!-- 预览决策表 -->
                    <DecisionTablesPreview
                      v-else-if="showComponent === SHOWCOMPONENT.DECISIONPREVIEW
                      "
                      :decision-data="decisionData"
                      :bom-base-data="treeData2"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                      @addSuccess="addSucess"
                      @getRestoreRuleList="getRestoreRuleList"
                    />
                    <HistoricalVersion
                      :rule-id="currentNode.ruleId"
                      :decisionTableId="currentNode.decisionTableId"
                      :dialog-form-visible.sync="showHistoricalVersion"
                      @historicalVersionClose="historicalVersionClose"
                    />
                    <!-- 脚本编辑 -->
                    <ScriptEditing v-if="showComponent === SHOWCOMPONENT.SCRIPTEDITING"/>
                    <!-- 新增评分卡 -->
                    <!-- <AddedAScorecard v-if="showComponent === SHOWCOMPONENT.SCORECARD"/> -->
                    <!-- 评分卡预览 -->
                    <ScorecardPreview
                      v-else-if="showComponent === SHOWCOMPONENT.SCORECARDPREVIEW"
                      :current-node="currentNode"
                      :scorecard-data="scorecardData"
                      @edit="handleEditScorecard"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                      @getRestoreRuleList="getRestoreRuleList"
                    />
                    <!-- 评分卡编辑器已移至弹框实现 -->
                  </div>
                  <!-- 历史版本 $store.state.bom.bomBaseInfo-->
                  <!-- 下载决策表模板 -->
                  <!-- <DecisionTablesDownload
                      v-else-if="
                        showComponent === SHOWCOMPONENT.DECISIONTABLESDOWNLOAD
                      "
                      :bom-base-data="treeData2"
                      :dialog-form-visible.sync="showDecisionTablesDownload"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      :bom-base-info-id="currentBomId"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                    /> -->
                  <NoData v-else :text="$t('ruleManage.selectBom')"/>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 列表视图 -->
          <el-tab-pane label="列表视图" name="third">
            <ListView @ruleEdit="handleRuleEdit" :bom-base-data="treeData2" :current-node-path="currentNode.path"
                      :decision-repository-id="decisionRepositoryModel.id"/>
          </el-tab-pane>
          <!-- 回收站 -->
          <!--          <el-tab-pane label="回收站" name="recycleBin">-->
          <!--            <RecycleBin/>-->
          <!--          </el-tab-pane>-->
          <!-- 业务对象模型 -->
          <el-tab-pane :label="$t('bomManage.objModel')" name="second">
            <div v-if="currentBomId && showComponent === SHOWCOMPONENT.RULEEDIT" class="content"
                 style="background:#eee">
              <!-- 规则编辑 -->
              <RuleEdit
                ref="poc"
                class="form rule-wrap"
                :rule="rule"
                :module-value="moduleValue"
                :field-parsings="fieldParsings"
                :bom-model-id="bomModelId"
                :decision-repository-model-id="decisionRepositoryModel.id"
                :current-node-path="currentNode.path"
                :field="field"
                @PreviewRuleComponents="PreviewRuleComponents"
                @back="
                  showComponent = addType ? SHOWCOMPONENT.RULEPREVIEW : SHOWCOMPONENT.SCRIPTEDITING
                  activeName = 'first'
                "
              />
            </div>
            <NoData v-else :text="$t('ruleManage.selectBom')"/>
          </el-tab-pane>
          <!-- 回收站 -->
          <el-tab-pane label="回收站" name="recycleBin">
            <el-row type="flex" class="flex-wrap" :gutter="15">
              <el-col :span="7" class="content2 bom-tree">
                <div v-if="currentBomId && activeName === 'recycleBin'" class="content">
                  <Tree
                    v-if="decisionRepositoryModel"
                    id="1"
                    :tree-data="RestoreRuleList"
                    bom-base-info-id=""
                    :default-expanded-keys="['70c15a232484482c8222a227af1fcb63']"
                    :default-checked-keys="['70c15a232484482c8222a227af1fcb63']"
                    @selectField="handleNodeClick"
                    @node-contextmenu="rightClick"
                  >
                    <template #pre>
                      <el-button class="btn-tree" type="text" @click="open">{{
                          $t('ruleManage.NewDirectory')
                        }}
                      </el-button>
                      <span class="btn-line">|</span>
                    </template>
                    <template #customNode="{ node }">
                      <div class="tree-text">
                        <template>
                          <i v-if="node.leaf" class="el-icon-tickets"/>
                          <i v-else class="el-icon-folder-opened"/>
                          {{ node.label }}
                        </template>
                      </div>
                    </template>
                  </Tree>
                </div>
                <NoData v-else :text="$t('ruleManage.selectBom')"/>
              </el-col>
              <el-col :span="17" class="relative rule-card-wrap">
                <el-card class="box-card">
                  <div v-if="currentBomId" class="content poc-edit">
                    <RulePreview
                      v-if="showComponent === SHOWCOMPONENT.RULEPREVIEW"
                      :rule="rule"
                      :current-node="currentNode"
                      :current-bom-id="currentBomId"
                      :restore="true"
                      @handleDeleteRow="handleDeleteRow"
                      @ruleEdit="handleRuleEdit"
                    />
                    <DecisionTablesUpload
                      v-if="showDecisionTables"
                      :dialog-form-visible.sync="showDecisionTables"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :decision-rep-catalogue-id="currentNode.id"
                      :current-node-path="currentNode.path"
                      :bom-base-data="treeData2"
                      :bom-base-info-id="currentBomId"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                      @editPreviewExcel="editPreviewExcelFun"
                      @addSuccess="addSucess"
                    />
                    <DecisionTablesDownload
                      v-else-if="showComponent === SHOWCOMPONENT.DECISIONTABLESDOWNLOAD
                      "
                      :bom-base-data="treeData2"
                      :dialog-form-visible.sync="showDecisionTablesDownload"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      :bom-base-info-id="currentBomId"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                    />
                    <DecisionTablesPreview
                      v-else-if="showComponent === SHOWCOMPONENT.DECISIONPREVIEW
                      "
                      :decision-data="decisionData"
                      :bom-base-data="treeData2"
                      :decision-repository-id="decisionRepositoryModel.id"
                      :current-node-path="currentNode.path"
                      :is-reset="true"
                      @getDecisionRepositoryDetail="handleHighlightTree1"
                      @addSuccess="addSucess"
                      @getRestoreRuleList="getRestoreRuleList"
                    />
                    <HistoricalVersion
                      v-else-if="showComponent === SHOWCOMPONENT.HISTORICALVERSION"
                      :rule-id="currentNode.ruleId"
                      :decisionTableId="currentNode.decisionTableId"
                      :dialog-form-visible.sync="showHistoricalVersion"
                    />
                  </div>
                  <NoData v-else :text="$t('ruleManage.selectBom')"/>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 选择模式弹窗 -->
      <el-dialog
        title="请选择编辑模式"
        :visible.sync="dialogMuduleVisible"
        width="30%"
      >
        <span>
          <el-button type="primary" plain @click="()=>{moduleValue=1}">向导式编辑</el-button>
          <el-button type="primary" plain @click="()=>{moduleValue=2}">专家级编辑</el-button>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFn">取 消</el-button>
          <el-button type="primary" @click="okFn">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 复制弹窗---请选择复制到目录下 -->
      <el-dialog
        :title="$t('ruleManage.selectCopyTo')"
        :visible.sync="CopyDialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <!-- <Tree
          v-if="decisionRepositoryModel"
          id="1"
          :highlight="highlightTree1"
          :tree-data="catalogueTreeData"
          @selectField="CatalogueNodeClick"
        >

          <template #customNode="{node}">
            <div class="tree-text">
              <template>
                <i v-if="!node.leaf" class="el-icon-folder-opened" />
                <span v-if="!node.leaf">{{ node.label }}</span>
              </template>
            </div>
          </template>
        </Tree> -->
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item
            :label="$t('ruleManage.destRuleId')"
            prop="destRuleId"
            :rules="{
              required: true, message: $t('ruleManage.noRuleId'), trigger: 'blur'
            }"
          >
            <el-input v-model="ruleForm.destRuleId"/>
          </el-form-item>
          <el-form-item
            :label="$t('ruleManage.destRuleName')"
            prop="destRuleName"
            :rules="{
              required: true, message: $t('ruleManage.noRuleName'), trigger: 'blur'
            }"
          >
            <el-input v-model="ruleForm.destRuleName"/>
          </el-form-item>
          <el-form-item
            :label="$t('ruleManage.destPath')"
            prop="destPath"
            :rules="{
              required: true, message: $t('ruleManage.noRuleTarget'), trigger: 'blur'
            }"
          >
            <el-cascader
              v-model="ruleForm.destPath"
              width="“100%”"
              :options="catalogueTreeData"
              :props="optionProps"
              filterable
              clearable
              :placeholder="$t('ruleManage.copyDirectory')"
            >
              <template slot-scope="{ node, data }">
                <i v-if="!node.leaf" class="el-icon-folder-opened"/>
                <span>{{ data.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelCopy">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="confirmCopy">{{ $t('button.OK') }}</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      title="新增决策规则方式"
      :visible.sync="addTypeDialogVisible"
      width="500px"
      @close="addTypeClose">
      <el-select v-model="addType" placeholder="请选择" style="width: 100%">
        <el-option label="可视化编辑" :value="true"/>
<!--        <el-option label="脚本编辑" :value="false"/>-->
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 评分卡编辑器弹窗 -->
    <ScorecardEditor
      v-if="scorecardEditorVisible"
      :visible.sync="scorecardEditorVisible"
      :is-add="isScorecardAdd"
      :edit-scorecard-id="editScorecardId"
      :current-node="currentNode"
      :decision-repository-id="decisionRepositoryModel.id"
      :bom-base-info-id="currentBomId"
      :bom-base-data="treeData2"
      @addSuccess="handleHighlightTree1"
    />
  </div>
</template>

<script>

// tree detail type
import {getDecisionTableInfo} from "@/views/systemManage/management/api";

const LEAFTYPE = {
  RULE: 'RULE',
  TABLE: 'TABLE',
  SCORECARD: 'SCORECARD' // 新增评分卡类型
}
// show component
const SHOWCOMPONENT = {
  RULEEDIT: 'RULEEDIT', // 规则可视化编辑
  RULEPREVIEW: 'RULEPREVIEW', // 规则预览
  DECISIONTABLES: 'DECISIONTABLES', // 决策表上传
  DECISIONTABLESDOWNLOAD: 'DECISIONTABLESDOWNLOAD', // 下载决策表模板
  EDITDECISIONPREVIEW: 'EDITDECISIONPREVIEW', // 在线编辑决策表
  HISTORICALVERSION: 'HISTORICALVERSION', // 历史版本
  DECISIONPREVIEW: 'DECISIONPREVIEW', // 决策表预览
  SCRIPTEDITING: 'SCRIPTEDITING', // 规则脚本编辑
  // SCORECARD: 'SCORECARD' // 新增评分卡
  // SCORECARDEDITOR: 'SCORECARDEDITOR', // 评分卡编辑器（已移除，使用弹框实现）
  SCORECARDPREVIEW: 'SCORECARDPREVIEW' // 评分卡预览
}
import {component as VueContextMenu} from '@xunlei/vue-context-menu'
import {BASE} from '@/utils/regular'
import {downloadFile} from '@/utils/utils'
import {RuleEditor} from '@/utils/RuleEditor'
import {
  getAllBomBaseInfo,
  bomClassAndField,
  getbomClassAndUpdateTime
} from '@/api/systemManage/bom'
import {getRuleSettingId} from '@/api/systemManage/rule-manage'
import {
  getDecisionRepositoryDetail,
  createDecisionCatalogue,
  updateByFieldName,
  getRuleDefinedByRuleId,
  getRuleMethodByRuleId,
  getPredefineByRuleId,
  deleteRuleDefinedEdit,
  updateDecisionCatalogue,
  deleteDecisionCatalogue,
  decisionCopyRule,
  uploadDecisionTableAll,
  restoreRule
} from '@/api/mainPages/decision'
import {getBomModelId} from '@/api/systemManage/bom'
import {getUser} from '@/api/systemManage/user-manage'

export default {
  name: 'PocIndex',
  components: {
    ScriptEditing: () => import('./component/scriptEditing'),
    RecycleBin: () => import('./component/recycleBin'),
    ListView: () => import('./component/listView'),
    RulePreview: () => import('./component/RulePreview.vue'),
    RuleEdit: () => import('./component/RuleEdit.vue'),
    DecisionTablesUpload: () => import('./component/DecisionTablesUpload.vue'),
    DecisionTablesDownload: () => import('./component/DecisionTablesDownload.vue'),
    HistoricalVersion: () => import('./component/HistoricalVersion.vue'),
    DecisionTablesPreview: () => import('./component/DecisionTablesPreview.vue'),
    EditDecisionPreview: () => import('./component/EditDecisionPreview.vue'),
    // AddedAScorecard: () => import('./component/addedAScorecard'),
    ScorecardEditor: () => import('./component/scorecard/ScorecardEditor.vue'),
    ScorecardPreview: () => import('./component/scorecard/ScorecardPreview.vue'),
    'context-menu': VueContextMenu
  },
  data() {
    return {
      defaultChecked: [], // '70c15a232484482c8222a227af1fcb63'
      highlight: '', // '70c15a232484482c8222a227af1fcb63'
      // isDestRuleId: false,
      optionProps: {
        value: 'path',
        label: 'label',
        children: 'children',
        checkStrictly: true
      },
      ruleForm: {
        destRuleId: '',
        destRuleName: '',
        destPath: ''
      }, // 规则复制表单
      catalogueCurrentNode: null, // 选中的目录节点
      catalogueTreeData: null, // 目录树形结构数据
      CopyDialogVisible: false,
      treeCurrentData: null, // 存当前数据
      treeCurrentNode: null, // 存当前节点信息
      contextMenuTarget: null,
      contextMenuVisible: false, // 让菜单显示
      dialogVisible: false,
      addTypeDialogVisible: false,
      addType: null,
      BomList: [],
      bomName: {
        bomName: ''
      }, // 决策库中文名
      currentBomId: this.$store.state.bom.bomBaseInfo,
      currentNode: {
        path: ''
      },
      defaultExpand: [], // 默认展开的目录
      currentNodeKey: '', // 默认选中的节点
      createName: '', // 新建目录的名称
      decisionRepositoryModel: {id: null}, // 决策库信息
      bomBaseInfo: null, // 业务对象模型信息
      activeName: 'first', // 左侧选项卡
      showComponent: '', // 功能区的组件
      SHOWCOMPONENT, // 定义好的组件name
      decisionData: null, // 决策表的数据
      scorecardData: null, // 评分卡的数据
      rule: {
        id: null, // id
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleTips: null, // 规则不通过提示信息
        ruleId: null, // 规则id
        annotation: null, // 规则注释
        ruleAttributeTags: [], // 属性标签
        ruleAttributeTagName: null, // 属性标签
        predefineText: null
      },
      ruleCodeServices: '', // 规则中包含的CodeServices
      treeData: [],
      treeData2: [], // bom树
      highlightTree1: '/', // tree高亮
      field: null, // field 选择的字段
      showDecisionTables: false, // 显示上传决策表弹框
      showDecisionTablesDownload: false, // 显示下载决策表弹框
      showHistoricalVersion: false, // 显示历史版本
      editPreviewExcel: false, // 显示在线编辑
      bomModelId: '',
      ruleEditor: null,
      fieldParsings: {},
      applicationId: this.$store.state.app.applicationId,
      moduleValue: 0,
      dialogMuduleVisible: false,
      isOpen: false,
      RestoreRuleList: null,
      editingScorecardId: null, // 要编辑的评分卡ID
      scorecardEditorVisible: false,
      isScorecardAdd: true,
      editScorecardId: null
    }
  },
  computed: {
    isCurrentCopy() {
      if (this.treeCurrentData) {
        return this.treeCurrentData.leaf
      }
      return false
    },
    isCurrentDataDel() {
      if (this.treeCurrentData) {
        return !this.treeCurrentData.children && !this.treeCurrentData.leaf
      }
      return false
    },
    isCurrentRename() {
      if (this.treeCurrentData) {
        return !this.treeCurrentData.leaf && this.treeCurrentData.id !== null
      }
      return false
    },
    baseURL() {
      return this.$store.state.settings.adp_config.baseURL
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    showDecisionTables(nVal) {
      // !nVal &&
    },
    treeData: {
      handler(newVal, oldVal) {
        this.catalogueTreeData = this.filterTreeArray(newVal)
      },
      deep: true
    },
    currentBomId(val) {
      this.$store.dispatch('bom/SET_bomBaseInfo', val) // 把值存放到store
    }
  },
  async created() {
    this.ruleEditor = new RuleEditor()
    getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
      this.bomModelId = res
    })
    this.getAllBomBaseInfo()
    this.BASE = BASE
    this.applicationId && this.getDecisionRepositoryDetail()
    this.getbomClassAndUpdateTime()
    this.getRestoreRuleList()
  },
  mounted() {
    document.querySelector('.app-wrapper.openSidebar').addEventListener('click', () => {
      this.treeCurrentData = null // 重置隐藏菜单
    })
  },
  methods: {
    async historicalVersionClose(){
      if (this.rule.ruleId) {
        this.getRuleDefinedByRuleId(this.rule)
      }else {
        const res = await getDecisionTableInfo(this.decisionData.decisionTableId)
        this.decisionData.annotation = res.resp.annotation
        this.decisionData.ruleAttributeTagName = res.resp.ruleAttributeTagName
        this.decisionData.ruleAttributeTags = res.resp.ruleAttributeTags
        this.decisionData.ruleAttributeTagName = res.resp.ruleAttributeTagName
      }
    },
    getRestoreRuleList() {
      restoreRule(this.$store.state.app.applicationId).then(res => {
        this.formatTreeNode(res.decisionRepositoryModel.catalogueList || [], {})
        this.RestoreRuleList = res.decisionRepositoryModel.catalogueList
      })
    },
    async addTypeSubmit() {
      if (this.addType) {
        this.rule = {
          id: null,
          ruleTips: null, //
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          annotation: null, // 规则注释
          ruleAttributeTags: [], // 属性标签
          ruleAttributeTagName: null, // 属性标签
          ruleId: null // 规则id
        }
        const resID = await getRuleSettingId()
        this.rule.ruleId = resID
        this.activeName = 'second'
        this.showComponent = SHOWCOMPONENT.RULEEDIT
      } else {
        this.showComponent = SHOWCOMPONENT.SCRIPTEDITING
      }
      this.addTypeDialogVisible = false
    },
    addTypeClose() {
      this.addType = null
    },
    // addedAScorecard() {
    //   this.showComponent = SHOWCOMPONENT.SCORECARD
    // },
    OpenToShow() {
      this.isOpen = !this.isOpen
    },
    cancelFn() {
      this.moduleValue = 0
      this.dialogMuduleVisible = false
    },
    async okFn() {
      if (this.moduleValue === 1 || this.moduleValue === 2) {
        this.rule = {
          id: null,
          ruleTips: null, //
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          annotation: null, // 规则注释
          ruleAttributeTags: [], // 属性标签
          ruleAttributeTagName: null, // 属性标签
          ruleId: null // 规则id
        }
        const resID = await getRuleSettingId()
        this.rule.ruleId = resID
        this.activeName = 'second'
        this.showComponent = SHOWCOMPONENT.RULEEDIT
        this.dialogMuduleVisible = false
      } else {
        this.$message.error('请选择编辑模式')
      }
    },
    async addSucess() {
      await this.getDecisionRepositoryDetail(this.applicationId)
      this.highlightTree1 = this.currentNode.path // 设置展开高亮
    },
    // 新增编辑
    editPreviewExcelFun() {
      this.dialogFormVisible = false
      this.showComponent = SHOWCOMPONENT.EDITDECISIONPREVIEW
      this.editPreviewExcel = true
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
    rightClick(e, data, node) {
      this.treeCurrentData = data // 存当前数据
      this.treeCurrentNode = node // 存当前节点信息
      this.contextMenuVisible = true // 让菜单显示
      const ele = document.querySelector('.tree-right-menu')
      ele.style.position = 'fixed'
      ele.style.top = `${e.clientY}px`
      ele.style.left = `${e.clientX + 10}px`
    },
    nodeRename(ev) {
      ev.stopPropagation()
      // this.contextMenuVisible = false
      this.$prompt(this.$t('ruleManage.enterName'), this.$t('common.hint'), {
        confirmButtonText: this.$t('button.OK'),
        cancelButtonText: this.$t('button.cancel'),
        inputValue: this.treeCurrentData.label,
        inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{3,10}/,
        inputErrorMessage: this.$t('ruleManage.inputErrorMessage')
      })
        .then(({value}) => {
          const data = {
            catalogue: value,
            id: this.treeCurrentData.id

          }
          updateDecisionCatalogue(data).then(res => {
            const parent = this.treeCurrentNode.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(
              (d) => d.id === this.treeCurrentData.id
            )
            this.$set(children[index], 'label', value)
            this.treeCurrentData = null // 重置隐藏菜单
          })

          // 提交方法
        })
        .catch(() => {
        })
    },
    nodeDelete(ev) {
      ev.stopPropagation()
      // this.contextMenuVisible = false
      this.$confirm(this.$t('ruleManage.del'), this.$t('common.hint'), {
        confirmButtonText: this.$t('button.OK'),
        cancelButtonText: this.$t('button.cancel')
      })
        .then((a, b) => {
          // done();
          deleteDecisionCatalogue(this.treeCurrentData.id).then(res => {
            this.$message.success(this.$t('ruleManage.delSuccess'))
            this.getDecisionRepositoryDetail()
            // const parent = this.treeCurrentNode.parent
            // const children = parent.data.children || parent.data
            // const index = children.findIndex((d) => d.id === this.data.id)
            // children.splice(index, 1)
            this.treeCurrentData = null // 重置隐藏菜单
          })
        })
        .catch(() => {
        })
    },
    nodeMove() {
      this.contextMenuVisible = false
    },
    confirmDialog() {
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm(this.$t('ruleManage.close'))
        .then((_) => {
          done()
        })
        .catch((_) => {
        })
    },
    beforeLeave() {
      if (this.showComponent === 'SHOWCOMPONENT.RULEEDIT') {
        return this.$confirm(this.$t('ruleManage.leave'), this.$t('common.hint'), {
          confirmButtonText: this.$t('button.OK'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          throw new Error(this.$t('ruleManage.cancel'))
        })
      }
    },
    CatalogueNodeClick(data) {
      this.catalogueCurrentNode = data
    },
    async handleNodeClick(data) {
      this.currentNode = data
      this.treeCurrentData = null // 重置隐藏菜单

      // 如果是叶子节点
      if (data.leaf) {
        // 预览规则模板
        if (data.leafType === LEAFTYPE.RULE) {
          this.getRuleDefinedByRuleId(data)
          this.showComponent = SHOWCOMPONENT.RULEPREVIEW
        }
        else if (data.leafType === LEAFTYPE.TABLE) {
          const res = await getDecisionTableInfo(data.decisionTableId)
          data.annotation = res.resp.annotation
          data.ruleAttributeTagName = res.resp.ruleAttributeTagName
          data.ruleAttributeTags = res.resp.ruleAttributeTags
          data.ruleAttributeTagName = res.resp.ruleAttributeTagName
          this.decisionData = data
          this.showComponent = SHOWCOMPONENT.DECISIONPREVIEW
        }
        // 预览评分卡
        else if (data.leafType === LEAFTYPE.SCORECARD) {
          import('@/api/mainPages/scorecard').then(async api => {

            try {
              const res = await api.getScorecardDetail(data.scorecardId);

              // 将评分卡详情数据添加到节点数据中
              data.annotation = res.annotation || '';
              data.ruleAttributeTags = res.ruleAttributeTags || [];
              data.ruleAttributeTagName = res.ruleAttributeTagName || '';

              // 确保评分卡数据包含必要的属性
              if (!res.attributeGroups) res.attributeGroups = [];
              if (!res.conditionRows) res.conditionRows = [];
              if (!res.scoreContainerFieldName) res.scoreContainerFieldName = '';
              if (!res.scoreContainerFieldPath) res.scoreContainerFieldPath = '';
              if (!res.scoreContainerFieldType) res.scoreContainerFieldType = '';
              if (!res.rule) res.rule = { ruleId: null, ruleContent: null, ruleDesc: null };

              // 设置当前节点和评分卡数据
              this.currentNode = data;
              this.scorecardData = res;

              // 显示评分卡预览组件
              this.showComponent = SHOWCOMPONENT.SCORECARDPREVIEW;
            } catch (err) {
              console.error('获取评分卡详情失败:', err);
              this.$message.error('获取评分卡详情失败');
            }
          }).catch(err => {
            console.error('加载API失败:', err);
            this.$message.error('加载API失败');
          });
        }
      } else {
        // 非叶子节点，显示默认组件或空白页
        this.showComponent = null; // 清除当前显示的组件
        this.scorecardData = null; // 清除评分卡数据

        this.rule = {
          id: null, // id
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          ruleId: null, // 规则id
          annotation: null, // 规则注释
          ruleAttributeTags: [], // 属性标签
          ruleAttributeTagName: null, // 属性标签
          predefineText: null
        }
      }
    },
    handleRuleEdit(rule, value) {
      this.moduleValue = value
      this.showComponent = SHOWCOMPONENT.RULEEDIT
      this.activeName = 'second'
      this.getRuleDefinedByRuleId(rule)
    },

    // 下载决策表模板
    handleDownloadDecisionTable() {
      this.showDecisionTablesDownload = true
      this.showComponent = SHOWCOMPONENT.DECISIONTABLESDOWNLOAD
    },
    // 历史版本对比
    historicalVersionBtn() {
      console.log('this.currentNode',this.currentNode)
      console.log('this.currentNode.ruleId',this.currentNode.ruleId)
      if(!this.currentNode.ruleId && !this.currentNode.decisionTableId) {
        this.$message({
          type: 'warning',
          message: '请选择规则'
        })
        return false;
      }
      this.showHistoricalVersion = true
      // this.showComponent = SHOWCOMPONENT.HISTORICALVERSION
    },

    // 获取bom列表
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        this.BomList = res.filter(item => item.bomBaseInfoId === this.$store.state.bom.bomBaseInfo)
        // this.BomList = res
      })
    },
    setTreeExpand() {
      let expandKey = {}

      let resetFn = () => {
      }

      const bomTree = this.$refs.bomTree?.$refs.ref

      if (bomTree) {
        expandKey = bomTree.expandedKeySet.get()

        resetFn = () => this.$nextTick(() => {
          const keys = Object.values(expandKey)

          function callback(data) {
            data.map(function (v) {
              keys.includes(v.data.labelPath) ? bomTree.expand(v) : bomTree.collapse(v) // 展开所有节点
              if (v.children && v.children.length) {
                callback(v.children)
              }
            })
          }

          callback(bomTree.tree.treeNodes)
        })
      }
      return resetFn
    },
    // 查询决策库信息，包含决策库基本信息、关联规则信息等
    async getDecisionRepositoryDetail() {
      const setExpand = this.setTreeExpand()
      await getDecisionRepositoryDetail(this.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const {decisionRepositoryModel} = res
          this.decisionRepositoryModel = decisionRepositoryModel
          this.formatTreeNode(decisionRepositoryModel.catalogueList || [], {})
          this.treeData = decisionRepositoryModel.catalogueList
          this.highlight = this.treeData[0]?.id
          this.bomBaseInfo = res.bomBaseInfo
          this.bomName.bomName = res.decisionRepositoryModel.repositoryName
          this.rule = {
            id: null, // id
            ruleTips: null, // 提示
            ruleContent: null, // 规则详情
            ruleDesc: null, // 规则中文描述
            ruleName: null, // 规则名称
            ruleId: null, // 规则id
            annotation: null, // 规则注释
            ruleAttributeTags: [], // 属性标签
            ruleAttributeTagName: null, // 属性标签
            predefineText: null
          }

          setExpand()
        }
      })

      return Promise.resolve()
    },
    // 根据bomBaseInfoId加载所有类和字段
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.currentBomId
      }
      return bomClassAndField(data).then(async res => {
        this.treeData2 = [res]
        const data1 = res
        const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
        await this.$forage.setItem('bomBaseInfoId', data1)
        await this.$forage.setItem('bomBaseInfoId_Time', res1.updatedDate)
      })
    },
    formatTreeNode(children, parent) {
      children.map((data) => {

        data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        data.fieldId = data.labelPath || 'root'
        // if (data.dataType === 'method') {
        // } else {
        //   data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        // }

        if (data.children && data.children.length) {
          this.formatTreeNode(data.children || [], data)
        }
      })

    },
    // 根据时间判断得到的是否是最新的数据
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = await this.$forage.getItem('bomBaseInfoId_Time')
      if (res1 && res1.updatedDate === time) {
        const storedData = await this.$forage.getItem('bomBaseInfoId')
        this.treeData2 = [storedData]
      } else {
        this.bomClassAndField()
      }
    },
    // 查询规则详情
    getRuleDefinedByRuleId(val) {
      getRuleDefinedByRuleId(val.ruleId).then(res => {
        // console.log(res)
        this.rule.allowEdit = res.allowEdit
        this.rule.existPath = res.existPath
        this.rule.allowDelete = res.allowDelete
        this.rule.id = res.id
        this.rule.ruleId = res.ruleId
        this.rule.ruleName = res.ruleName
        this.rule.ruleDesc = res.ruleDesc
        this.rule.ruleTips = res.ruleTips
        this.rule.ruleContent = res.ruleContent
        this.rule.annotation = res.annotation
        this.rule.ruleAttributeTags = res.ruleAttributeTags
        this.rule.ruleAttributeTagName = res.ruleAttributeTagName
        this.rule.codeServices = res.codeServices.toString()
        this.rule.predefineText = res.predefineDTO ? res.predefineDTO.content : ''
      })

      getRuleMethodByRuleId(this.bomModelId, val.ruleId).then(res => {
        // console.log(res, 'res')
        this.fieldParsings = res.thenList.fieldParsings
        this.$set(this.rule, 'elseListText', this.getText(res.thenList))
        this.$set(this.rule, 'thenListText', this.getText(res.elseList))
      })
      getPredefineByRuleId(val.ruleId).then(res => {
        if (res) {
          this.$set(this.rule, 'editPredefineText', res.content)
        } else {
          this.$set(this.rule, 'editPredefineText', '')
        }
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
    // 提交新的目录
    createDecisionCatalogue(name, path) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        catalogue: name,
        decisionRepositoryId: this.decisionRepositoryModel.id,
        parentPath: path
      }
      createDecisionCatalogue(data).then(async () => {
        await this.getDecisionRepositoryDetail(this.applicationId)
        let id = null
        if (path === '/') {
          id = path + name
        } else {
          path + '/' + name
        }
        this.highlightTree1 = id // 设置展开高亮
      })
    },
    // 打开新建目录弹框
    open() {
      if (!this.currentNode) {
        return this.$message.error(this.$t('ruleManage.left'))
      }
      if (this.currentNode.leaf) {
        return this.$message.error(this.$t('ruleManage.left'))
      }
      this.$prompt(this.$t('ruleManage.enterMuLuName'), this.$t('common.hint'), {
        confirmButtonText: this.$t('button.OK'),
        cancelButtonText: this.$t('button.cancel'),
        inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/,
        inputErrorMessage: this.$t('ruleManage.three')
      })
        .then(({value}) => {
          this.createDecisionCatalogue(value, this.currentNode.path)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('ruleManage.cancelEnter')
          })
        })
    },
    // 修改中文名字
    updateByFieldName() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            id: this.decisionRepositoryModel.id,
            repositoryName: this.bomName.bomName
          }
          updateByFieldName(data).then(res => {
            this.getDecisionRepositoryDetail()
          })
        }
      })
    },
    // 复制规则
    async handleCopyRule() {
      if (this.currentNode && this.currentNode.path && this.currentNode.leaf) {
        const newRuleId = await getRuleSettingId()
        if (newRuleId) {
          // this.isDestRuleId = true
          this.ruleForm.destRuleId = newRuleId
        }
        this.ruleForm.destRuleName = this.currentNode.ruleName + '-copy'
        this.CopyDialogVisible = true
      } else {
        this.$message.error(this.$t('ruleManage.leftRule'))
      }
    },
    cancelCopy() {
      this.$refs.ruleForm.resetFields()
      this.CopyDialogVisible = false
    },
    confirmCopy() {
      // if (!this.catalogueCurrentNode) return this.$message.error('请选择目录')
      // const newId = await getRuleSettingId()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const length = this.ruleForm.destPath.length
          const data = {
            // destPath: this.catalogueCurrentNode.path.slice(1),
            destPath: this.ruleForm.destPath[length - 1].slice(1),
            destRuleName: this.ruleForm.destRuleName,
            srcRuleId: this.currentNode.ruleId,
            destRuleId: this.ruleForm.destRuleId,
            destRuleTips: '---',
            decisionRepositoryId: this.decisionRepositoryModel.id
          }
          decisionCopyRule(data).then(res => {
            this.getDecisionRepositoryDetail()
            this.$refs.ruleForm.resetFields()
            this.CopyDialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 处理评分卡编辑
    handleEditScorecard(node) {
      console.log('编辑评分卡:', node);
      console.log('评分卡ID:', node.id, '评分卡scorecardId:', node.scorecardId);

      // 使用scorecardId而不id，因为scorecardId是评分卡的真实ID
      const scorecardId = node.scorecardId || node.id;
      console.log('最终使用的评分卡ID:', scorecardId);

      // 设置当前节点和评分卡ID
      this.currentNode = node;
      this.editScorecardId = scorecardId;
      this.isScorecardAdd = false;

      // 打开评分卡编辑器
      this.scorecardEditorVisible = true;
    },



    // 新增规则目标、决策表或评分卡
    async handleAddRule(state) {
      console.log(state)

      if (this.currentNode && this.currentNode.path && !this.currentNode.leaf) {
        if (state === 'decisionTable') {
          this.showDecisionTables = true
          this.showComponent = SHOWCOMPONENT.DECISIONTABLES
        } else if (state === 'rule') {
          this.addTypeDialogVisible = true
        } else if (state === 'scorecard') {
          // 简化评分卡新增逻辑
          this.editScorecardId = null // 清空编辑ID，表示新增
          this.isScorecardAdd = true // 设置为新增模式
          this.scorecardEditorVisible = true // 显示评分卡编辑器弹窗
        }
      } else {
        this.$message.error(this.$t('ruleManage.newAdd'))
      }
    },
    // 保存规则之后切换组件，查询数据，在tree中高亮当前规则
    async PreviewRuleComponents(rule) {
      await this.getDecisionRepositoryDetail() // 状态切换到决策库浏览
      this.rule = rule
      const id = this.currentNode.path + '/' + rule.ruleName + '.rule'
      const data = {
        ...rule,
        label: rule.ruleId
      }
      this.highlightTree1 = id // 设置高亮
      this.getRuleDefinedByRuleId(data) // 查询规则详情

      this.activeName = 'first'
      this.showComponent = SHOWCOMPONENT.RULEPREVIEW
    },

    // 展开决策库高亮行
    handleHighlightTree1(name) {
      const setExpand = this.setTreeExpand()
      this.getDecisionRepositoryDetail().then(() => {
        this.highlightTree1 = name // 设置高亮
        this.showComponent = null
        setExpand()
      })
    },

    // 处理评分卡编辑事件 (从预览组件触发)
    editScorecard(nodeData) { // 从 Preview 接收节点数据
        console.log('Editing scorecard, node data:', nodeData);
        const idToEdit = nodeData.scorecardId || nodeData.id;
        if (!idToEdit) {
            this.$message.error('无法获取要编辑的评分卡ID');
            return;
        }
        this.editScorecardId = idToEdit; // 设置编辑ID
        this.isScorecardAdd = false; // 设置为编辑模式
        this.scorecardEditorVisible = true; // 显示评分卡编辑器弹窗
    },

    // 辅助方法：根据路径查找树节点 (简单实现)
    findNodeByPath(tree, path) {
        if (!tree || !path) return null;
        for (const node of tree) {
            // 假设节点的唯一标识符是 path 或者 id
            // 注意：这里的匹配逻辑可能需要根据实际 data.path 或 data.id 的格式调整
            const nodeIdentifier = node.path; // 或者 node.id ?
            if (nodeIdentifier === path) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = this.findNodeByPath(node.children, path);
                if (found) return found;
            }
        }
        return null;
    },

    // 处理编辑器关闭事件
    handleEditorClose() {
        this.showComponent = ''; // 清空 showComponent 以隐藏编辑器
        this.editingScorecardId = null; // 清空编辑ID
        // 可以考虑是否需要重新选中之前的节点或刷新树
    },

    // 删除规则
    async handleDeleteRow(rule, param) {
      const data = {
        ruleId: rule.ruleId,
        isDeleted: param
      }
      await deleteRuleDefinedEdit(data)
      await this.getDecisionRepositoryDetail()
      await this.getRestoreRuleList()
      this.highlightTree1 = this.currentNode.parentPath
    },

    // 下载
    downloadUserTemplate() {
      downloadFile(
        '/download/decisionTable/template/' + this.currentBomId,
        null,
        this.$t('ruleManage.decTemp')
      )
    },

    submitRule(rule, text) {
      console.log(rule, text)
    }
  }
}
</script>

<style lang="scss">
.flex-wrap .bom-tree {
  min-height: 600px;

  .content {
    height: 100%;

    .tree-wrapper {
      height: 100%;

      .tree-container {
        height: 100%;
        overflow: initial;

        .filter-tree {
          height: 100%;
        }
      }
    }
  }
}

.rule-wrap {
  padding: 15px;
  background: #f5f9ff;
  border-radius: 6px;
  border: 2px solid #dbeafe;
  font-size: 14px;

  .item {
    margin-right: 15px;
  }

  .name {
    color: #60769c;
    line-height: 27px;
  }

  .value {
    font-weight: bold;
    color: #273756;
    line-height: 23px;
  }

  ::v-deep &.form {
    .el-form-item__label {
      color: #60769c;
    }
  }
}
</style>
<style lang="scss" scoped>
.rule-wrap {
  padding: 15px;
  background: #f5f9ff;
  border-radius: 6px;
  border: 2px solid #dbeafe;
  font-size: 14px;

  .item {
    margin-right: 15px;
  }

  .name {
    color: #60769c;
    line-height: 27px;
  }

  .value {
    font-weight: bold;
    color: #273756;
    line-height: 23px;
  }

  ::v-deep &.form {
    .el-form-item__label {
      color: #60769c;
    }
  }
}
</style>
<style lang="scss">
// cascader label文字选中
.el-cascader-panel .el-radio {
  // width: 100%;
  // height: 100%;
  z-index: 10;
  position: absolute;
}

.el-cascader-node__label {
  margin-left: 10px;
}

.tree-right-menu {
  font-size: 14px;
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}

.tree-right-menu a {
  width: 150px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
  padding: 2px;
}

.tree-right-menu a:hover {
  background: #bbb;
  color: #fff;
}

.tree-right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

a {
  text-decoration: none;
}

.mt-30 .bom-tree {
  min-height: 600px;

  .content {
    height: 100%;

    .tree-wrapper {
      height: 100%;

      .tree-container {
        height: 100%;

        .filter-tree {
          height: 100%;
          // .vl-scrollbar {
          //   height: 100%;
          //   .virtual-list {
          //     height: 100% !important;
          //   }
          // }
        }
      }
    }
  }
}

.content2 {
  min-height: 800px;
}

// .icon-rule-mini {
//   width: 16px;
//   height: 16px;
//   margin-right: 5px;
// }
.rule-card-wrap {
  display: flex;
  flex-direction: column;

  .el-card {
    margin-bottom: 0;
  }
}

.flex-wrap {
  margin-bottom: 15px;
}

.poc-model {
  .el-card {
    width: 100%;
    height: 100%;
  }

  .tree-btn-wrap {
    display: flex;
    height: 32px;
    background: #f7fcff;
    border: 1px solid #e5ecf8;
    align-items: center;
    justify-content: space-around;

    .el-button {
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      padding: 0 10px;
      margin: 0;
    }

    .btn-line {
      color: #e5ecf8;
    }
  }
}

.poc-edit {
  .btn-wrap {
    justify-content: flex-end;
  }
}

.bom-info {
  .item {
    margin-bottom: 14px;
    font-size: 14px;
    display: flex;

    &:last-child {
      margin-bottom: 0;
    }

    .name {
      display: inline-block;
      width: 120px;
      color: #435475;
    }

    .val {
      color: #273756;
      overflow: hidden;
    }
  }
}

.field-wrapper {
  margin: 0;

  // justify-content: space-between;
  .text {
    margin: 0 5px;
  }

  .add {
    .el-button {
      padding: 0;
    }
  }
}

.el-tabs__item.is-active {
  font-weight: bold;
}

::v-deep .el-tabs__active-bar {
  width: 37px !important;
  left: 10px;
  // left: 50% !important;
  // transform: translateX(50%) !important;
}

.head-card {
  // height: 200px;
  width: 100%;

  ::v-deep .el-card__body {
    display: flex;
    align-items: center;
    height: calc(100% - 66px);

    .content {
      width: 100%;
    }
  }
}

.tree-wrap {
  height: 100%;

  ::v-deep .el-card__body {
    height: 100%;

    .el-tabs,
    .el-tabs__content,
    .el-tab-pane {
      box-sizing: border-box;
      height: 100%;
    }
  }

  ::v-deep .el-tabs__header {
    margin: 0;
  }
}

.search-wrap {
  ::v-deep .el-input__inner {
    height: 28px;
    color: #435475;
    line-height: 28px;
    font-size: 13px;
  }

  .el-input input {
    width: 240px;
    height: 28px;
    line-height: 28px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #c2c8cf;
  }

  ::v-deep .el-input__suffix {
    display: flex;
    align-items: center;
  }
}
</style>
