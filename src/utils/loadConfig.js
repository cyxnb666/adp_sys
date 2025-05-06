
import store from '@/store'

// import { config } from '@public/config/config'
// eslint-disable-next-line no-undef
let conf = window.config || config
conf.baseURL = conf.baseUrlEnv[process.env.VUE_APP_ENV]
if (!conf) {
  setTimeout(() => {
    // eslint-disable-next-line no-undef
    conf = window.config || config
    loadconfig()
  }, 1000)
} else {
  loadconfig()
}
function loadconfig() {
  store.commit('settings/SET_ADP_CONFIG', conf)
  if (conf && conf.css && conf.css.length > 0) {
    conf.css.forEach(element => {
      loadCss(element)
    })
  }

  return conf
}

function loadCss(url) {
  const css = document.createElement('link')
  css.href = url
  css.rel = 'stylesheet'
  css.type = 'text/css'
  document.head.appendChild(css)
}

export default function getConfig() {
  return conf
}
