<template>
  <el-dialog
    :title="$t('decisionTable.uploadTable')"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
  >
    <el-form :model="form">
      <el-form-item :label="$t('decisionTable.decisionTable')">
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
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    currentNodePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: { 'adp-token': getToken() },
      form: {
        fileList: []
      }
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
        decisionRepositoryId: this.decisionRepositoryId,
        path: this.currentNodePath
      }
    }
  },
  methods: {
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error(this.$t('decisionTable.img'))
      }
      return isLt10M
    },
    beforeClose() {
      this.$emit('update:dialogFormVisible', false)
    },

    submitUpload() {
      if (!this.currentNodePath) {
        this.$message.error(this.$t('decisionTable.selectMulu'))
        return
      }
      this.$refs.upload.submit()
    },
    uploadSuccess(res, file) {
      if (res.success) {
        this.$message.success(this.$t('decisionTable.upload'))
        this.$emit(
          'getDecisionRepositoryDetail',
          this.currentNodePath + '/' + file.name
        )
        this.$emit('update:dialogFormVisible', false)
      } else {
        this.$message.error(res.errMsg)
        this.form.fileList = []
      }
    },
    uploadError(res) {
      this.$message.error(res.errMsg)
    },
    handleExceed() {
      this.$message.warning('每次只允许上传一个文件')
    }
  }
}
</script>
<style lang="scss"></style>
