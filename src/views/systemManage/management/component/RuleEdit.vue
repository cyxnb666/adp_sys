<template>
  <div class="rule-edit">
    <el-form
      ref="form"
      :model="rule"
      inline
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            prop="ruleId"
            :rules="[
          { required: true, message: $t('ruleEdit.enterId'), trigger: 'change' },
          { min: 1, max: 100, message: $t('ruleEdit.one'), trigger: 'blur' }
        ]"
            :label="$t('ruleSetting.ruleNum')"
          >
            <el-input v-model="rule.ruleId"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="ruleName"
            :rules="[
          { required: true, message: $t('ruleEdit.enterName'), trigger: 'change' },
          { min: 1, max: 100, message: $t('ruleEdit.one'), trigger: 'blur' }
        ]"
            :label="$t('ruleSetting.ruleName')"
          >
            <el-input v-model="rule.ruleName"/>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item
            label-width="140px"
            prop="ruleTips"
            :rules="[
          { min: 0, max:50, message: $t('ruleEdit.length'), trigger: 'blur' }
        ]"
            :label="$t('ruleEdit.hintMes')"
          >
            <el-input v-model="rule.ruleTips" type="textarea" style="{'height: 40px'}"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="annotation"
            label="属性标签"
          >
            <el-cascader
              style="width: 100%"
              clearable
              v-model="rule.ruleAttributeTags"
              :options="groupList"
              :props="{ expandTrigger: 'hover',multiple: true,emitPath: false }"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            prop="annotation"
            label="规则说明"
          >
            <el-input v-model="rule.annotation"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 这是公司产品：规则编辑组件 -->
    <page-rule-editor
      ref="poc"
      class="page-rule-editor"
      :base-u-r-l="baseURL"
      :bom-base-info-id="$store.state.bom.bomBaseInfo"
      :token="token"
      :rule-content="rule.ruleContent"
      :code-services="rule.codeServices"
      :rule-id="rule.ruleId"
      :module-value="moduleValue"
      @changeEditPage="changeEditPage"
      @submitRule="submitRule(arguments)"
    />
  </div>
</template>

<script>
import {saveRuleDefinedEdit} from '@/api/mainPages/decision'
import {settingExpressionList} from '@/api/systemManage/rule-manage'
import {getGroupTagList, restore} from "@/views/systemManage/management/api";

export default {
  props: {
    rule: {
      type: Object,
      default: function () {
        return {
          id: null, // id
          ruleContent: null, // 规则详情
          ruleDesc: null, // 规则中文描述
          ruleName: null, // 规则名称
          ruleTips: null, // 规则不通过提示信息
          ruleId: null, // 规则id
          ruleAttributeTags: [], // 属性标签
          ruleAttributeTagName: null, // 属性标签
          annotation: null // 规则注释
        }
      }
    },
    field: {
      type: Object,
      default: null
    },
    currentNodePath: {
      type: String,
      default: null
    },
    decisionRepositoryModelId: {
      type: String,
      default: null
    },
    bomModelId: {
      type: String,
      default: null
    },
    fieldParsings: {
      type: Object,
      default: null
    },
    moduleValue: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      thenList: [],
      elseList: [],
      groupList: [],
      decisionUrlId: '',
      ruleContent: this.rule.ruleContent
    }
  },
  computed: {
    baseURL() {
      return this.$store.state.settings.adp_config.baseURL
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    'rule.ruleId'(newval) {
      this.rule.ruleId = newval
    }
  },
  created() {
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
    // 触发子组件的对应方法
    pocMethods(name) {
      // this.$refs.poc[name]()
    },
    removeAllNode() {
      this.$refs.poc.removeAllNode()
    },
    // 接收规则模板的对象
    submitRule(e) {
      this.thenList = e[2]
      this.elseList = e[3]
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$prompt('请输入提交注释', '提交注释', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
          }).then(({value}) => {
            this.rule.ruleContent = JSON.stringify(e[0])
            this.rule.ruleDesc = e[1]
            this.saveRuleDefinedEdit(e[4], value)
          })
        } else {
          return false
        }
      })
    },
    // 跳转回决策库浏览界面
    changeEditPage(editStatus, changePage) {
      if (editStatus && changePage) {
        this.$emit('PreviewRuleComponents', this.rule)
      } else {
        this.$emit('PreviewRuleComponents', {})
      }
    },
    // 保存规则
    saveRuleDefinedEdit(predefineReqModel, submitAnnotation) {
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
        codeServices: [],
        isDeleted: '0',
        submitAnnotation
      }
      const transformedData = []
      if (this.thenList.length > 1) {
        this.thenList.forEach((res, index) => {
          if (!res.fieldParsings) {
            res.fieldParsings = this.props.fieldParsings || ''
          }
        })
      } else if (this.thenList.length === 1) {
        if (!this.thenList[0].fieldParsings) {
          this.thenList[0].fieldParsings = this.props.fieldParsings || ''
        }
      }
      transformedData.push({
        'bomModelId': this.bomModelId,
        'ruleId': this.rule.ruleId,
        'elseList': this.elseList,
        'thenList': this.thenList
      })
      // 保存规则
      if (this.ruleContent === this.rule.ruleContent) {
        this.$message({
          message: '数据未发生任何变化',
          type: 'warning'
        })
      }
      saveRuleDefinedEdit({
        ruleDefined: data,
        predefineReqModel
      }).then(res => {
        if (res.success) {
          this.$message({
            message: this.$t('common.success'),
            type: 'success'
          })
          this.$emit('PreviewRuleComponents', this.rule) // 切换回预览状态，高亮当前规则
        }
      }).catch((err) => {
        err
      })
      // this.$emit('PreviewRuleComponents', this.rule)
      settingExpressionList(transformedData) // 改规则
    }
  }
}
</script>
<style lang="scss">
.rule-edit {
  .page-RuleEditor .rule-card-wrap {
    height: auto !important;
  }
}

.page-rule-editor {
  margin-top: 10px;
}

.el-form-item, .el-form-item__content {
  width: 100%;
  margin-bottom: 0;
}
</style>
