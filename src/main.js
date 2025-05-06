import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css'
import Adp from 'airongkeji-rule-editor'
import 'airongkeji-rule-editor/lib/airongkeji-rule-editor.css'
import directives from '@/utils/directives.js'
import nodata from '@/components/NoData'
import '@/utils/timingCache' // 大于一天则清除缓存
import '@/utils/loadConfig' // 加载外部配置
import axios from 'axios'
import JsonViewer from 'vue-json-viewer'
import './assets/iconfont/iconfont.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '@/styles/animate.scss'
import '@/icons' // icon
import _ from 'lodash'
import './directives/index'
import localForage from 'localforage'
import components from '@/views/systemManage/management/component/GuidRuleTableEditor/index.js'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import App from './App'
import router from './router'
import store from './store'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// i18n的引入
import i18n from './languages'

// import '@utils/validate'
// 注册全局组件（也可以哪个vue文件使用，在哪注册即可）
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

Vue.use(components)

Vue.prototype._ = _
Vue.prototype.$axios = axios
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size设置元素默认大小
  i18n: (key, value) => i18n.t(key, value) // 在注册Element时设置i18n的处理方法
})
Vue.use(Adp)
Vue.use(directives)
Vue.use(VXETable)
Vue.component('NoData', nodata)
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)

Vue.config.productionTip = false

Vue.prototype.$forage = localForage
// 时间戳转换日期
Vue.directive('fittertime', function(el, timestamp) {
  const time = new Date(timestamp.value)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  el.innerHTML = `${year}-${month}-${date} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
