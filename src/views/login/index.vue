<template>
  <div class="login-container">
    <div class="login-left">
      <img :src="dark_logo ? dark_logo : '/images/dark_logo.png'" alt class="logo">
      <!-- <img :src="'/images/bxtx_logo_fff.png'" alt class="logo"> -->
    </div>
    <div class="login-right">
      <div />
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        auto-complete="on"
        class="login-form"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t('login.login') }}</h3>
        </div>

        <h5 class="form-label">{{ $t('login.username') }}</h5>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            auto-complete="on"
            name="username"
            :placeholder="$t('login.enterNum')"
            tabindex="1"
            type="text"
          />
        </el-form-item>

        <h5 class="form-label">{{ $t('userManage.pwd') }}</h5>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            name="password"
            auto-complete="on"
            :placeholder="$t('login.enterPwd')"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          class="btn-login"
          style="width:100%;margin-bottom:30px;"
          type="primary"
          @click.native.prevent="handleLogin"
        >{{ $t('login.login') }}</el-button>
      </el-form>
      <div class="footer-wrapper">
        <h6>{{ companyCopyright }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import i18n from '@/languages/index'
import JsEncrypt from 'jsencrypt'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (validUsername(value)) {
        callback(new Error(i18n.t('login.enterNum')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(i18n.t('login.overSix')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        sign: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    dark_logo() {
      return this._.get(this.$store.state.settings, 'adp_config.dark_logo')
    },
    companyCopyright() {
      return this._.get(this.$store.state.settings, 'adp_config.copyright')
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/generateKey').then(data => {
            this.loginForm.sign = data.key
            this.loginForm.password = this.passwordEncryption(this.loginForm.password, data.publicKey)
            this.$store.dispatch('user/login', this.loginForm).then(async() => {
              this.$store.dispatch('app/SET_GETRULEEXPRESSIONSALL')
              if (!this.$store.state.app.applicationId) {
                this.$router.push('/getApplicationList')
              } else {
                this.$router.push({ path: this.redirect || '/' })
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    passwordEncryption(password, publicKey) {
      // 后台给的公钥
      const encryptor = new JsEncrypt() // 新建JSEncrypt对象
      encryptor.setPublicKey(publicKey) // 设置公钥
      const passwordEncryp = encryptor.encrypt(password) // 对密码进行加密
      return passwordEncryp
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$dark_gray: #29344f;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $dark_gray;
      height: 47px;
      caret-color: $dark_gray;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #ced5db;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #29344f;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  .login-left {
    flex: 1;
    background: url(./images/bg-left.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .logo {
      margin-top: 36px;
      margin-left: 43px;
      width: 284px;
    }
  }
  .login-right {
    flex: 2;
    background: url(./images/bg-right.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
  }

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 0 36px;
    margin: 0 auto;
    overflow: hidden;
    .btn-login {
      background: linear-gradient(90deg, #3377ff 0%, #3377ff 100%);
      border-radius: 2px;
    }
    .form-label {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #60769c;
      line-height: 21px;
      margin-bottom: 8px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $dark_gray;
      margin: 0px auto 40px auto;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .footer-wrapper {
    h6 {
      height: 21px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #60769c;
      line-height: 21px;
      margin-top: auto;
      font-weight: normal;
    }
  }
}
</style>
