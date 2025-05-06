<template>
  <div class="rule well">
    <div class="app-container">
      <el-card class="head-card version-card">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('test.test') }}</span>
        </div>
        <el-form ref="ValidateForm" :model="ruleForm" class="demo-ruleForm">
          <el-row>
            <el-col :span="24">
              <el-form-item
                :label="$t('versionList.applicationId')"
                prop="applicationId"
                :rules="[{ required: true, message: $t('test.empty') }]"
              >
                <el-input v-model="ruleForm.applicationId" />
              </el-form-item>
              <el-form-item
                :label="$t('test.params')"
                prop="input"
                :rules="[{ required: true, message: $t('test.emptyParams') }]"
              >
                <el-input
                  v-model="ruleForm.input"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 12 }"
                />
              </el-form-item>

              <el-form-item class="flex-auto margin-5">
                <el-button
                  type="primary"
                  @click="submitForm('ValidateForm')"
                >{{ $t('button.submit') }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="head-card version-card mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('test.res') }}</span>
        </div>
        <div>
          <el-row>
            <el-col :span="24">
              <!-- <el-input v-model="ruleForm.result" readonly="" type="textarea" :autosize="{ minRows: 12, maxRows: 12}" /> -->
              <json-viewer
                :value="ruleForm.result"
                :expand-depth="5"
                copyable
                boxed
                sort
              />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { PostTestExecute } from '@/api/mainPages/test'
export default {
  data() {
    return {
      ruleForm: {
        applicationId: this.$store.state.app.applicationId,
        input: '',
        result: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      try {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              applicationId: this.ruleForm.applicationId,
              input: JSON.parse(this.ruleForm.input)
            }
            PostTestExecute(data).then((res) => {
            // this.ruleForm.result = JSON.stringify(res)
              this.ruleForm.result = res
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } catch (err) {
        this.$message.error(err)
        console.log(err, 'err')
      }
    }
  }
}
</script>
<style lang="scss"></style>
