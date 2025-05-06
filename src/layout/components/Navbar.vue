<template>
  <div class="navbar">

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="logo">
      <router-link to="/">
        <img v-if="logo" alt :src="logo">
        <img v-else alt src="/images/logo.svg">
        <!-- <img alt src="/images/baoxingtianxia.jpg"> -->
      </router-link>
    </div>
    <div class="title">{{ $store.state.permission.terrace === 'system'?$t('navbar.sysColPage'):$t('navbar.consolePage') }}</div>
    <div class="menu">
      <!-- 换肤 -->
      <!-- <div class="right-menu">
        <el-tooltip effect="dark" content="theme" placement="bottom">
          <el-color-picker
            v-model="theme"
            class="theme-picker"
            size="small"
            popper-class="theme-picker-dropdown"
          />
        </el-tooltip>
      </div> -->
      <!-- <div class="right-menu">
        <div class="search-wrapper">
          <div class="search" :class="{'active':showSearch}">
            <input v-model="search" placeholder="请输入关键字查询">
            <span class="icon-search" />
          </div>
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
            @hide="() => showSearch = false"
            @show="() => showSearch = true"
          >
            <div>
              <h4>决策库检索结果</h4>
              <ul>
                <li>非营业且投保人的名字 “不包括” 并且被保险人的名称 “不包括” 并且不包含任一字符，并且行驶证车主的 … </li>
              </ul>
            </div>
            <div slot="reference" class="search" :class="{'active':showSearch}">
              <input v-model="search" placeholder="请输入关键字查询">
              <span class="icon-search" />
            </div>
          </el-popover>

        </div>

      </div> -->
      <div v-if="showApplication" class="right-menu">
        <div class="applicationName">{{ applicationName }}</div>
        <div class="btn-icon" @click="$router.push('/getApplicationList')">
          <img alt src="./images/icon-change.png">
        </div>
        <div class="btn-icon" @click="linkTo('/new-app')">
          <img alt src="./images/icon-create.png">
        </div>
      </div>
      <div class="right-menu">
        <div v-if="showSystemBtn" class="btn" @click="changeRouter">
          <span v-if="$store.state.permission.terrace === 'system'">{{ $t('navbar.console') }}</span>
          <span v-else>{{ $t('navbar.sysCol') }}</span>
        </div>
        <!-- <div class="changeLang">
          <el-select v-model="lang" style="width: 87px;" size="mini" :placeholder="$t('common.pleaseChoose')" @change="toggleLang">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div> -->
        <div class="btn">
          <img alt class="user-avatar" src="./images/avatar.png">
          <span class="name">{{ name }}</span>
        </div>
        <div class="btn" @click="logout">
          <img alt src="./images/logout.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Layout from '@/layout'
// import router from '@/router'
// import store from "@/store";
export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  data() {
    return {
      search: '',
      showSearch: false,
      chalk: '', // content of theme-chalk css
      theme: '', // 主题色
      langValue: false
      // lang: 'zh',
      // options: [
      //   {
      //     value: 'zh',
      //     label: '中文'
      //   },
      //   {
      //     value: 'en',
      //     label: 'English'
      //   }]
    }
  },
  computed: {
    logo() {
      return this.$store.state.settings.adp_config.logo;
    },
    applicationName() {
      return this.$store.state.app.applicationName
    },
    showSystemBtn() {
      return this.$store.state.app.applicationList.length
    },
    showApplication() {
      if (this.$store.state.permission.terrace === 'system') {
        return false
      } else {
        return true
      }
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  watch: {
    theme(val, oldVal) {
      if (typeof val !== 'string') return
      const color_sideBar = this._.get(this.$store.state.settings, 'adp_config.color_sideBar')
      document.getElementsByTagName('body')[0].style.setProperty('--color-primary', val)
      document.getElementsByTagName('body')[0].style.setProperty('--color-sideBar', color_sideBar)
      setInterval(_ => {
        this.opacity >= 1 && (this.opacity = 0)
        this.opacity += 0.2
      })
      const customPages = this._.get(this.$store.state.settings, 'adp_config.customPages')
      this.addCustomLink(customPages)
    }
  },
  created() {
    this.theme = this._.get(this.$store.state.settings, 'adp_config.color_primary')
  },
  mounted() {
    // 用户每次刷新页面都判断 是否缓存过 语言，缓存过的话 选择其中显示的应该是缓存的语言
    // this.lang = localStorage.getItem('locale') ? this.lang = localStorage.getItem('locale') : this.lang = 'zh'
  },
  methods: {
    // 中英文切换
    // toggleLang(lang) {
    //   if (lang === 'zh') {
    //     localStorage.setItem('locale', 'zh')
    //     this.$i18n.locale = localStorage.getItem('locale')
    //     const country = 'CN'
    //     const param = lang + '_' + country
    //     localStorage.setItem('lang', param)
    //   } else if (lang === 'en') {
    //     localStorage.setItem('locale', 'en')
    //     this.$i18n.locale = localStorage.getItem('locale')
    //     const country = 'US'
    //     const param = lang + '_' + country
    //     localStorage.setItem('lang', param)
    //   }
    //   location.reload()
    // },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
        if (keys) {
          for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()// 清除当前域名下的,例如：m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()// 清除当前域名下的，例如 .m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString()// 清除一级域名下的或指定的，例如 .kevis.com
          }
        }
        window.location.reload()
      }
      clearCookie()
    },
    async changeRouter() {
      if (this.$store.state.permission.terrace === 'main') {
        this.$store.dispatch('permission/changeRoutes', 'system')
        this.$store.commit('permission/SET_CUSTOMLINK', this.customPages)
        this.$router.push('/system-dashboard')
      } else {
        if (this.$store.state.app.applicationId) {
          this.$store.dispatch('permission/changeRoutes', 'main')
          this.$store.commit('permission/SET_CUSTOMLINK', this.customPages)
          this.$router.push('/')
        } else {
          this.$router.push('/getApplicationList')

          // this.$message.error('请先创建应用')
        }
      }
    },
    linkTo(url) {
      this.$store.dispatch('permission/changeRoutes', 'system')
      this.$router.push(url)
    },

    // 添加自定义外链
    addCustomLink(customPages) {
      const children = []
      customPages.forEach(element => {
        const obj = {
          path: element.path,
          component: () => import('@/views/Custom/custom'),
          meta: { ...element, enable: true, icon: 'link' }
        }
        children.push(obj)
      })
      const link = {
        path: '/custom',
        component: Layout,
        meta: {
          // icon: 'icon-nav7',
          // enable: true,
          // title: this.$t('navbar.customPage')
        },
        children
      }
      this.customPages = link
      const accessRoutes = this.$store.state.permission.routes
      this.$store.commit('permission/SET_ADDROUTER', link)
      this.$root.$router.addRoutes(accessRoutes)
      // router.addRoutes(accessRoutes)
      this.$store.commit('permission/SET_CUSTOMLINK', this.customPages)
    }
  }
}
</script>

<style lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  .logo {
    display: flex;
    align-items: center;
    img {
      height: 30px;
    }
  }
  img {
    height: 20px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    // float: left;
    cursor: pointer;
    transition: 'background' 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 750px;
  }
  .title{
    position: absolute;
    left: 50%;
    top: 30%;
    color: #60769c;
    font-size: 15px;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    margin-left: 24px;
    .search {
      display: flex;
      align-items: center;
      padding:0 5px;
      background: #e7eef4;
      border-radius: 4px;
      width: 200px;
      &.active {
        width: 400px;
        input {
          width: 100%;
        }
      }
      input {
        height: 24px;
        border: 0;
        font-size: 14px;
        color: #435475;
        background: #e7eef4;
        border-radius: 4px;
        line-height: 24px;
        outline: none;
        font-family: MicrosoftYaHei;
      }
      .icon-search {
        line-height: 24px;
      }
    }
    .btn-icon {
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: rgba(51, 119, 255, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(51, 119, 255, 0.3);
      line-height: 24px;
      text-align: center;
      margin-left: 12px;
    }
    .applicationName {
      color: #435475;
      font-size: 14px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      height: 24px;
      line-height: 24px;
      padding: 0px 8px;
      width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &:not(:last-child) {
      padding-right: 24px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        height: 20px;
        width: 1px;
        border-right: 1px solid #eee;
      }
    }
    &:focus {
      outline: none;
    }
    .btn{
      &:first-child{
        margin-left: 0;
      }
      font-size: 14px;
      margin: 0 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #29344f;
      .name {
        margin-left: 5px;
      }
    }
  }
}
</style>
