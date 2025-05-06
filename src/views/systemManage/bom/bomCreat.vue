<template>
  <div class="app-container bg-color bomCreate">
    <div class="title-style1">
      <i class="icon icon-1"/>
      <h6>{{ $t('bomCreat.createObj') }}(BOM-Business Object Model)</h6>
    </div>
    <el-form
      ref="ruleForm"
      label-position="left"
      :hide-required-asterisk="true"
      :model="form"
      :rules="rules"
      label-width="135px"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('bomCreat.basic_info') }}</span>
        </div>
        <div class="content">
          <el-form-item :label="$t('bomCreat.modelName')" prop="bomName">
            <el-input v-model="form.bomName" :placeholder="$t('bomCreat.enterModelName')"/>
          </el-form-item>
          <el-form-item :label="$t('bomCreat.bomBaseInfoId')">
            <el-input v-model="form.bomBaseInfoId" disabled/>
          </el-form-item>
          <el-form-item :label="$t('bomCreat.bomVersion')">
            <el-input v-model="form.bomVersion" disabled/>
          </el-form-item>
          <el-form-item :label="$t('bomCreat.remark')">
            <el-input v-model="form.remark" :placeholder="$t('bomCreat.enterRemark')"/>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('bomCreat.javaObj') }}</span>
        </div>
        <div class="content">
          <div class="input-wrap">
            <div class="label">{{ $t('bomCreat.jarFiles') }}</div>
            <div class="flex-wrap">
              <!-- <el-input v-model="uploadName" disabled /> -->
              <el-upload
                ref="upload"
                class="upload-demo"
                :headers="headers"
                :action="action"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :file-list="fileList"
                :before-upload="beforeUpload"
                :show-file-list="false"
                name="uploadFile"
                accept=".jar"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  class="btn-border mini"
                  icon="el-icon-plus"
                  :disabled="checked"
                >上传JAVA文件
                </el-button>
              </el-upload>
              <el-checkbox style="margin: 0 20px" v-model="checked" @change="handleCheckedChange">上传BOM源代码</el-checkbox>
              <el-upload
                v-if="checked"
                ref="bomUpload"
                class="upload-demo"
                :headers="headers"
                :action="actionBOM"
                :data="bomData"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :file-list="bomFileList"
                :before-upload="beforeBOMUpload"
                :show-file-list="false"
                name="file"
                accept=".zip"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  class="btn-border mini"
                  icon="el-icon-plus"
                >上传BOM源代码
                </el-button>
              </el-upload>
              <div style="margin-left: 20px">仅支持zip格式,将BOM源代码src目录下文件压缩上传</div>
            </div>
          </div>

          <div class="input-wrap">
            <div class="label">{{ $t('bomCreat.bomBaseInfoId') }}</div>
            <el-input v-model="form.bomModeId" disabled/>
          </div>

          <div class="input-wrap">
            <div class="label">{{ $t('bomCreat.mainBomClass') }}</div>
            <el-input v-model="form.mainBomClass" disabled/>
          </div>

          <div class="input-wrap">
            <div class="label">{{ $t('bomCreat.hashValue') }}</div>
            <el-input v-model="form.hashValue" disabled/>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('bomCreat.decisionInfo') }}</span>
        </div>
        <div class="content">
          <el-form-item :label-width="labelWidth.labelWidth" :label="$t('bomCreat.decisionName')" prop="repositoryName">
            <el-input
              v-model="form.repositoryName"
              :placeholder="$t('bomCreat.enterDecisionName')"
            />
          </el-form-item>
        </div>
      </el-card>
      <div class="text-center">
        <el-button
          class="btn-background medium"
          @click="validateForm"
        >{{ $t('bomCreat.create') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getToken} from '@/utils/auth'
import {getSystemId, createBom} from '@/api/systemManage/bom'
import i18n from '@/languages/index'

export default {
  name: 'BomCreat',
  data() {
    return {
      lang: this.$store.state.settings.lang,
      uploadName: '',
      headers: {'adp-token': getToken()},
      fileList: [],
      bomFileList: [],
      checked: false,
      form: {
        bomName: '', // 基本信息--中文名称
        bomBaseInfoId: '', // 基本信息-- 系统生成的编号
        bomVersion: '', // 基本信息-- 版本号
        remark: '', // 基本信息--备注信息
        bomModeId: '', // java对象-- 系统生成的编号
        mainBomClass: '', // java对象-- 主BOM类
        hashValue: '', // java对象-- MD5校验值
        repositoryName: '' // 决策库信息-- 中文名称
      },
      bomData: {
        bomBaseInfoId: ''
      },
      rules: {
        bomName: [
          {required: true, message: i18n.t('bomCreat.enterModelName'), trigger: 'blur'},
          {min: 3, max: 50, message: i18n.t('bomCreat.length'), trigger: 'blur'}
        ],
        repositoryName: [
          {required: true, message: i18n.t('bomCreat.enterDecisionName'), trigger: 'blur'},
          {min: 3, max: 50, message: i18n.t('bomCreat.length'), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    action() {
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/bom/xom/jar'
      )
    },
    actionBOM() {
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/bom/xom/addJavaSourceFile'
      )
    },
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? '155px' : '135px'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleCheckedChange(){
      this.$refs.bomUpload.clearFiles()
      this.$refs.bomUpload.uploadFiles = []
    },
    // 进入页面需要获取系统编号与版本号
    init() {
      getSystemId().then(res => {
        const {bomBaseInfoId, bomVersion} = res
        this.form.bomBaseInfoId = bomBaseInfoId
        // this.bomData.bomBaseInfoId = bomBaseInfoId
        this.form.bomVersion = bomVersion
      })
    },
    // 上传jar文件
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 本地获取file
    handleChange(file) {
      this.uploadName = file.name
    },
    // 拿到服务器返回的数据
    handleUploadSuccess(response) {
      this.$loading().close()
      if (!response.success) {
        this.uploadName = ''
        this.$message({
          showClose: true,
          message: response.errMsg,
          type: 'error',
          offset: 100
        })
      } else {
        this.$message.success(this.$t('bomCreat.uploadSuccess'))
        const {mainBomClass, bomModelId, hashValue} = response.resp
        this.form.mainBomClass = mainBomClass
        this.form.bomModeId = bomModelId
        this.form.hashValue = hashValue
        this.uploadName = ''
      }
    },
    // 校验需提交的数据
    validateForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.form.bomModeId) {
            return this.$message.error(this.$t('bomCreat.uploadFile'))
          } else {
            this.submitForm()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 提交数据
    submitForm() {
      const data = {
        bomName: this.form.bomName,
        bomBaseInfoId: this.form.bomBaseInfoId,
        bomVersion: this.form.bomVersion,
        remark: this.form.remark,
        bomModelId: this.form.bomModeId,
        mainBomClass: this.form.mainBomClass,
        hashValue: this.form.hashValue,
        repositoryName: this.form.repositoryName
      }
      createBom(data).then(res => {
        setTimeout(() => {
          this.$router.push('/bom/manage?currentBomId=' + res.bomBaseInfoId)
        }, 1000)
      })
    },
    beforeUpload(file) {
      if (!file.name.endsWith('.jar')) {
        this.$message.error(this.$t('bomCreat.onlyUploadJar'))
        return false;
      }
      this.$loading({
        text: this.$t('bomCreat.fileIng')
      })
    },
    beforeBOMUpload(file) {
      if (!file.name.endsWith('.zip')) {
        this.$message.error('仅支持ZIP格式文件,请重新上传')
        return false;
      }
      this.$loading({
        text: this.$t('bomCreat.fileIng')
      })
    }
  }
}
</script>

<style lang="scss">
.bg-color {
  background: #e8eff7;
}

.upload-demo {
  min-width: 100px;
}

.flex-wrap {
  align-items: center;
}

.el-form-item {
  width: 100%;
}

.bomCreate {
  .box-card {
    .content {
      width: 70%;
      // min-height: 400px;
    }
  }
}
</style>
