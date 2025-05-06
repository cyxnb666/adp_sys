<template>
  <div class="update-pwd app-container bg-color">
    <el-card class="box-card mt-30">
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('updatePwd.updatePwd') }}</span>
      </div>
      <div class="content">
        <el-form ref="form" label-position="left" :hide-required-asterisk="true" :model="form" label-width="135px" class="demo-ruleForm">
          <el-form-item
            :label="$t('updatePwd.oldPwd')"
            prop="pwd"
            :rules="[
              { required: true, message: $t('updatePwd.enterOldPwd'), trigger: 'blur' },
              { message: $t('updatePwd.length'), trigger: 'blur',min:8, max: 16, }
            ]"
          >
            <el-input v-model="form.pwd" :placeholder="$t('updatePwd.enterOldPwd')" show-password />
          </el-form-item>
          <el-form-item
            :label="$t('updatePwd.newPwd')"
            prop="newPwd"
            :rules="[
              { required: true, message: $t('updatePwd.pwdLength'), trigger: 'blur',min:8, max: 16, },
              { pattern: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/, message: $t('updatePwd.pwdNoPass') , trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="form.newPwd" show-password :placeholder="$t('updatePwd.enterNewPwd')" />
          </el-form-item>
          <el-form-item
            :label="$t('updatePwd.confirmPwd')"
            prop="confirmPwd"
            :rules="[
              { validator: validatePass, trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.confirmPwd" show-password :placeholder="$t('updatePwd.enterConfirmPwd')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="UserUpdatePwd('form')">{{ $t('updatePwd.commitOk') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { UserUpdatePwd } from '@/api/systemManage/user-manage'
import i18n from '@/languages/index'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.t('updatePwd.enterAgain')))
      } else if (value !== this.form.newPwd) {
        callback(new Error(i18n.t('updatePwd.inputPwd')))
      } else {
        callback()
      }
    }
    return {
      validatePass,
      form: {
        pwd: '',
        newPwd: '', // 新密码校验不通过，密码长度需8位及以上，且为数字、大小写字母、特殊字符中的至少3种组成
        confirmPwd: ''
      }
    }
  },
  methods: {
    UserUpdatePwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            'newPassword': this.form.newPwd,
            'oldPassword': this.form.pwd,
            'userId': 'string'
          }
          UserUpdatePwd(data).then(res => {
            console.log('UserUpdatePwd', res)
          })
        }
      })
    }
  }

}

</script>
<style lang='scss'>
.update-pwd {
  .content {
      max-width: 1000px;
    }
}
</style>
