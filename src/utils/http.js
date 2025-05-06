import axios from 'axios'
import store from '@/store'
import { Message, Loading } from 'element-ui'
import i18n from '@/languages/index'
import { getToken } from '@/utils/auth'

const loadingCtx = {
    instance: null,
    options: {
        background: 'rgba(0, 0, 0, 0.5)',
        text: i18n.t('request.request')
    },
    destroy() {
        if (this.instance) {
            this.instance.close()
            this.instance = null
        }
    }
}

const http = axios.create({
    timeout: 60000,
    headers: {
        common: {
            // 'adp-token': getToken(),
            lang: localStorage.getItem('lang'),
        }
    }
})

http.interceptors.request.use(config => {

    // if (store.getters.token) {
    //     config.headers['lang'] = localStorage.getItem('lang')
    // }

    config.headers['adp-token'] = getToken()

    const baseURL = store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API // 使用配置文件的baseURL
    config.url = baseURL + config.url

    return config
    
}, e => Promise.reject(e))

http.interceptors.response.use(response => {

    const res = response.data

    if (res.errCode === '1000') { // token过期，调用一次后端接口同时清除登录信息
        store.dispatch('user/logout')
        return location.reload()
    }

    return res

}, err => {

    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误';
                break;

            case 401:
                err.message = '未授权，请登录';
                break;

            case 403:
                err.message = '拒绝访问';
                break;

            case 404:
                err.message = `请求地址出错: ${err.response.config.url}`;
                break;

            case 408:
                err.message = '请求超时';
                break;

            case 500:
                err.message = '服务器内部错误';
                break;

            case 501:
                err.message = '服务未实现';
                break;

            case 502:
                err.message = '网关错误';
                break;

            case 503:
                err.message = '服务不可用';
                break;

            case 504:
                err.message = '网关超时';
                break;

            case 505:
                err.message = 'HTTP版本不受支持';
                break;

            default:
        }
    }

    return Promise.reject(err)
})


export default function(params, hasLoading, errCode) {

    if (hasLoading) loadingCtx.instance = Loading.service(loadingCtx.options)
    
    return new Promise((resolve, reject) => {

        http(params).then(res => {

            loadingCtx.destroy()

            if (!res.success && !errCode) {
                Message({
                    message: res.errMsg || 'Error',
                    type: 'error',
                    duration: 3000
                })
            } else {
                resolve(res)
            }
        }, err => {
            loadingCtx.destroy()

            reject(err)
        })
    })
}