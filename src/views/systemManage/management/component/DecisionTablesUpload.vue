<template>
  <el-dialog
    title="新增决策表"
    width="90%"
    top="10vh"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    custom-class="add-descision-table"
    append-to-body
  >
    <!-- <div class="btnDiv1">
      <el-form :model="form">
        <el-form-item :label="''">
          <el-upload
            ref="upload"
            class="upload-demo"
            name="uploadFile"
            accept=".xlsx"
            :limit="1"
            :headers="headers"
            :action="action"
            :file-list="form.fileList"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-exceed="handleExceed"
            :data="otherData"
          >
            <el-button size="small" type="primary">{{ $t('decisionTable.click') }}</el-button>
            <div slot="tip" class="el-upload__tip">
              {{ $t('decisionTable.over') }}
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="submitUpload">{{ $t('button.OK') }}</el-button>
      </div>
    </div>
    <div class="btnDiv1 btnDiv2">
      <el-button type="primary" @click="onlineEdit">在线编辑</el-button>
    </div> -->
    <el-tabs v-model="editableTabsValue" @tab-click="handleTabsClick">
      <el-tab-pane label="文件上传" name="upload">
        <el-form ref="uploadForm" :model="form">
          <div class="add-descision-table-item mb-30">
            <div class="title" style="line-height: 36px;">
              <span class="required">上传决策表</span>
            </div>
            <div class="">
              <el-form-item :label="''" prop="fileList"
                            :rules="{ required: true, message: '请上传文件', trigger: 'blur' }">
                <!-- :http-request="httpRequest" -->
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  name="uploadFile"
                  action=""
                  accept=".xlsx"
                  :limit="1"
                  :file-list="form.fileList"
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                  :on-success="uploadSuccess"
                  :on-change="uploadChange"
                  :before-remove="beforeRemove"
                  :on-error="uploadError"
                  :on-exceed="handleExceed"
                  :http-request="httpRequest"
                >
                  <el-button size="small" icon="el-icon-plus">{{ $t('decisionTable.click') }}</el-button>
                  <div slot="tip" class="el-upload__tip">
                    {{ $t('decisionTable.over') }}
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          <div style="display: flex">

            <el-form-item
              prop="annotation"
              :rules="[
          { min: 0, max:50, message: '请选择属性标签' }
        ]"
              label="属性标签"
            >
              <el-cascader
                style="width: 300px;margin-right: 20px"
                v-model="form.ruleAttributeTags"
                :options="groupList"
                :props="{ expandTrigger: 'hover',multiple: true,emitPath: false }" ></el-cascader>
            </el-form-item>
            <el-form-item
              prop="annotation"
              :rules="{ min: 0, max:50, message: '请输入备注' }"
              label="备注"
            >
              <el-input v-model="form.annotation" type="text" style="width: 400px;"/>
            </el-form-item>
          </div>

          <div class="add-descision-table-item">
            <div class="title mt-10 mb-15">
              <span>前置规则</span>
              <el-tooltip class="item" effect="dark"
                          content="增加前置规则情况下，决策表在执行前置规则通过后再执行，如前置规则执行未通过则不再执行该决策表"
                          placement="top">
                <i class="el-icon-info" style="margin-left: 6px;color: #0079FF;"/>
              </el-tooltip>
            </div>
            <el-form-item>
              <div class="rule-preview">
                <div class="rule-wrap">
                  <div class="rule-view">
                    <span class="value">如果：</span>
                    <span class="value valueContent" style="word-break: break-all;" v-html="rule.ruleDesc || '-'"/>
                  </div>
                  <el-button type="text" size="small" @click="ruleEditorDialogVisible = true">新增规则</el-button>
                  <el-button type="text" size="small" @click="rule = {}">删除规则</el-button>
                </div>
              </div>
              <!-- <div v-if="!rule.ruleContent">
                <el-button size="small" type="primary" @click="ruleEditorDialogVisible = true">新增决策规则</el-button>
              </div>
              <div v-else class="rule-preview">
                <div class="rule-wrap">
                  <div class="rule-view">
                    <span class="value">如果：</span>
                    <br>
                    <div class="value valueContent" style="word-break: break-all;" v-html="rule.ruleDesc" />
                  </div>
                </div>
              </div> -->
            </el-form-item>
          </div>
        </el-form>
        <RuleEditorDialog v-if="ruleEditorDialogVisible" v-model="ruleEditorDialogVisible" v-bind="{ rule }" add
                          @submitRule="addPreRule"/>
      </el-tab-pane>
      <el-tab-pane label="在线编辑" name="edit">
        <EditDecisionPreview
          v-if="editableTabsValue === 'edit'"
          ref="ruleEdit"
          v-bind="{ruleId, bomBaseData, decisionRepositoryId, currentNodePath, type: 'add', decisionRepCatalogueId, bomBaseInfoId }"
          @addSuccess="addRuleSuccess"
        />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('button.OK') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getToken} from '@/utils/auth'
import EditDecisionPreview from './EditDecisionPreview'
import RuleEditorDialog from './RuleEditorDialog.vue'
import {getRuleSettingId, uploadDecisionTable} from '@/api/systemManage/rule-manage'
import {saveOrUpdatePredefine} from '@/api/mainPages/decision'
import {getGroupTagList} from "@/views/systemManage/management/api";

export default {
  components: {
    EditDecisionPreview,
    RuleEditorDialog
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    decisionRepCatalogueId: {
      type: String,
      default: ''
    },
    currentNodePath: {
      type: String,
      default: ''
    },
    bomBaseInfoId: {
      type: String,
      default: ''
    },
    bomBaseData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      headers: {'adp-token': getToken()},
      form: {
        fileList: [],
        ruleAttributeTags: [],
        annotation: '',
        rules: []
      },
      groupList: [],
      editableTabsValue: 'upload',
      ruleEditorDialogVisible: false,
      rule: {
        id: null, // id
        ruleTips: null, // 提示
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleId: null, // 规则id
        predefineText: null
      },
      ruleId: '',
      predefineObj: null
    }
  },
  computed: {
    action() {
      // 导入决策表，并关联决策库
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/import/decisionTable'
      )
    },
    // 上传文件的额外参数
    otherData() {
      return {
        jsonObject: JSON.stringify({
          decisionRepositoryId: this.decisionRepositoryId,
          path: this.currentNodePath,
          annotation: this.form.annotation,
          ruleAttributeTags: this.form.ruleAttributeTags,
          ruleDefinedEdit: {
            decisionRepCatalogueId: this.decisionRepCatalogueId,
            decisionRepositoryId: this.decisionRepositoryId,
            path: this.currentNodePath,
            decisionTableId: '',
            ...this.rule,
            ruleId: this.ruleId
          }
        })
      }
    }
  },
  async mounted() {
    const ruleId = await getRuleSettingId()
    this.ruleId = ruleId
    this.getGroupTagListFn()
  },
  methods: {
    getGroupTagListFn() {
      getGroupTagList().then((res) => {
        this.groupList = res.resp.map(group => ({
          label: group.tagGroupName,       // 一级选项的 label
          value: group.tagGroupId,         // 一级选项的 value
          children: group.ruleAttributeTagInfos.map(tag => ({
            label: tag.attributeName,      // 二级选项的 label
            value: tag.tagId               // 二级选项的 value
          }))
        }))
      })
    },
    beforeUpload(file) {
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXlsx) {
        this.$message.error(this.$t('decisionTable.over'))
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error(this.$t('decisionTable.img'))
      }
      return isLt10M
    },
    beforeClose() {
      this.$emit('update:dialogFormVisible', false)
    },
    httpRequest(req) {
      const formData = new FormData()
      formData.append('jsonObject', this.otherData.jsonObject),
        formData.append('uploadFile', this.form.fileList[0].raw)
      if (JSON.parse(this.otherData.jsonObject).ruleDefinedEdit.ruleId && this.predefineObj) {
        this.predefineObj.ruleId = JSON.parse(this.otherData.jsonObject).ruleDefinedEdit.ruleId
      }
      uploadDecisionTable(formData).then(res => {
        if (res) {
          this.$message.success(this.$t('decisionTable.upload'))
          this.$emit(
            'getDecisionRepositoryDetail',
            this.currentNodePath + '/' + this.form.fileList[0].name
          )
          this.$emit('update:dialogFormVisible', false)
          this.predefineObj && saveOrUpdatePredefine(this.predefineObj)
        } else {
          // this.$message.error(res.errMsg)
          this.form.fileList = []
        }
      }).catch((res) => {
        this.$message.error(res)
      })
    },
    submit() {
      if (this.editableTabsValue === 'upload') {
        this.$refs.uploadForm.validate(valid => {
          if (!valid) return

          if (!this.currentNodePath) {
            this.$message.error(this.$t('decisionTable.selectMulu'))
            return
          }
          // this.$refs.upload.submit()
          this.httpRequest()
        })
      } else if (this.editableTabsValue === 'edit') {
        this.$refs.ruleEdit.saveTable()
      }
    },
    onlineEdit() {
      this.$emit('editPreviewExcel')
    },
    uploadSuccess(res, file) {
      if (res) {
        this.$message.success(this.$t('decisionTable.upload'))
        this.$emit(
          'getDecisionRepositoryDetail',
          this.currentNodePath + '/' + file.name
        )
        this.$emit('update:dialogFormVisible', false)
      } else {
        // this.$message.error(res.errMsg)
        this.form.fileList = []
      }
    },
    beforeRemove(res, file) {
      this.form.fileList = []
    },
    uploadChange(res, file) {
      this.form.fileList = [res]
    },
    uploadError(res) {
      this.$message.error(res.errMsg || '上传失败')
    },
    handleExceed() {
      this.$message.warning('每次只允许上传一个文件')
    },
    handleTabsClick() {
      this.rules = []
      this.rule = {
        id: null, // id
        ruleTips: null, // 提示
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleId: null, // 规则id
        predefineText: null
      }
    },
    addPreRule(...rules) {
      this.rules = rules
      this.rule.ruleContent = JSON.stringify(rules[0])
      this.rule.ruleDesc = rules[1]
      this.predefineObj = rules[4]
      this.rule.predefineText = this.predefineObj.content
      this.rule.editPredefineText = this.predefineObj.content
      this.ruleEditorDialogVisible = false
    },
    addRuleSuccess() {
      this.$emit('addSuccess')
      this.$emit('update:dialogFormVisible', false)
    }
  }
}
</script>
<style lang="scss">
.btnDiv1 {
  width: 70%;
  display: inline-block;
  border-radius: 5px;
  height: 100%;
  vertical-align: top;
  border: 1px solid #b1b1ff;
  text-align: center;
  padding: 20px;
}

.btnDiv2 {
  width: 30%;
  text-align: center;
  border: 0px;
  padding-top: 70px
}

.add-descision-table {
  .el-dialog__body {
    padding: 0 20px;
  }

  // .add-descision-table-item {
  //   .title {
  //     line-height: 20px;
  //     &::before {
  //       content: '';
  //       display: inline-block;
  //       background: #0079FF;
  //       width: 3px;
  //       height: 16px;
  //       margin-bottom: -3px;
  //       margin-right: 8px;
  //     }
  //   }
  // }
}
</style>
