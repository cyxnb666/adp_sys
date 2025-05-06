import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en' // 导入element-ui的英文文件
import cnLocale from 'element-ui/lib/locale/lang/zh-CN' // 导入element-ui的中文文件
// 从语言包文件中导入语言包对象
import zh from './zh'
import en from './en'
Vue.use(VueI18n)

const messages = {
  'zh': {
    ...zh, // 将两个对象合并成一个对象
    ...cnLocale
  },
  'en': {
    ...en,
    ...enLocale
  }
}

// const messages = {
//   zh, en
// }

// eslint-disable-next-line no-undef
const conf = window.config || config
// localStorage.setItem('locale', conf.locale)
localStorage.setItem('lang', conf.lang)
localStorage.setItem('locale', conf.locale)
const i18n = new VueI18n({
  messages,
  locale: conf.locale,
  // silentTranslationWarn: true
  fallbackLocale: 'zh',
  numberFormats: { // 设置 数字本地化
    'en': {
      currency: { // 添加 $
        style: 'currency', currency: 'USD'
      }
    },
    'zh': {
      currency: { // 添加 ￥
        style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
      }
    }
  },
  dateTimeFormats: { // 设置 日期时间本地化
    'en': {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    },
    'zh': {
      short: {
        year: 'numeric', month: 'short', day: 'numeric'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    }
  }
})

export default i18n
