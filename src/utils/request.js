import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import filterApi from '@/utils/filter-api'
import i18n from '@/languages/index'

// create an axios instance store.state.settings.adp_config.baseApi ||
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

const options = {
  background: 'rgba(0,0,0,0)',
  text: i18n.t('request.request')
}
let loadingInstance = null

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadingInstance = Loading.service(options)

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['adp-token'] = getToken()
      config.headers['lang'] = localStorage.getItem('lang')
    }

    const baseURL = store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API // 使用配置文件的baseURL
    config.url = baseURL + config.url
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    loadingInstance.close()
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (!res.success) {
      Message({
        message: res.errMsg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      if (res.errCode === '1000') { // token过期，调用一次后端接口同时清除登录信息
        store.dispatch('user/logout')
        location.reload()
      }
      return Promise.reject(res.errMsg)
    } else {
      const url = response.config.url.replace(response.config.baseURL, '')
      const filterAPI = filterApi.find(value => url === value)
      const methods = ['post', 'delete', 'put']

      if (methods.find(value => response.config.method === value)) {
        if (!filterAPI) {
          Message({
            message: i18n.t('common.success'),
            type: 'success',
            duration: 3 * 1000
          })
        }
      }
      return res.resp
    }
  },
  error => {
    loadingInstance.close()
    return Promise.reject(error)
  }
)

export default service
