import store from '@/store'
import axios from 'axios'
import _ from 'lodash'
import { getCodeServiceListByclassPath, getCodeServiceList } from '@/api/systemManage/bom'

/**
 * 不知道是否存在codeService 传入一个code 返回一个list
 * @param {*} code
 */
export function getCodeList(code) {
  if (!code) {
    return []
  }
  if (store.state.app.CodeService[code]) {
    return store.state.app.CodeService[code]
  } else {
    store.dispatch('app/SET_CODESERVICE', [code].toString())
    return store.state.app.CodeService[code]
  }
}

/**
 * 去重
 * Set数据结构，它类似于数组，其成员的值都是唯一的
 */
export function unique(arr) {
  return Array.from(new Set(arr)) // 利用Array.from将Set结构转换成数组
}

export async function downloadFile(url, data, name) {
  const baseURL = store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API
  await axios.get(`${baseURL}${url}`, {
    timeout: 1000 * 60 * 10,
    headers: { 'adp-token': store.state.user.token },
    params: {
      ...data
    },
    responseType: 'blob' // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'，默认是'json'
  })
    .then(res => {
      if (!res) return
      let Type = ''
      if (name.substring(name.lastIndexOf('.') + 1) === 'slsx') {
        Type = 'application/vnd.ms-excel'
      }
      if (name.substring(name.lastIndexOf('.') + 1) === 'jar') {
        Type = 'application/java-archive'
      }
      if (name.substring(name.lastIndexOf('.') + 1) === 'zip') {
        Type = 'application/x-zip-compressed'
      }
      const blob = new Blob([res.data], { type: Type }) // 构造一个blob对象来处理数据，并设置文件类型

      if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
        navigator.msSaveBlob(blob, name)
      } else {
        const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
        const a = document.createElement('a') // 创建a标签
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = name // 指定下载文件名
        a.click() // 触发下载
        URL.revokeObjectURL(a.href) // 释放URL对象
      }

      // 这里也可以不创建a链接，直接window.open(href)也能下载
    })
    .catch(err => {
      console.log(err)
    })
  // downloadUserTemplate().then(res => {
  //   res
  // })
  // window.open(`${this.baseURL}/downloadUserTemplate`)
}
export function postDownloadFile(url, data, name) {
  const baseURL = store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API
  return axios.post(`${baseURL}${url}`,
    { ...data },
    {
      headers: { 'adp-token': store.state.user.token },
      responseType: 'blob' // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'，默认是'json'
    }
  )
    .then(res => {
      if (!res) return
      let Type = ''
      if (name.substring(name.lastIndexOf('.') + 1) === 'slsx') {
        Type = 'application/vnd.ms-excel'
      }
      if (name.substring(name.lastIndexOf('.') + 1) === 'jar') {
        Type = 'application/java-archive'
      }
      if (name.substring(name.lastIndexOf('.') + 1) === 'zip') {
        Type = 'application/x-zip-compressed'
      }
      if (name.substring(name.lastIndexOf('.') + 1) === 'html') {
        Type = 'application/html'
      }
      const blob = new Blob([res.data], { type: Type }) // 构造一个blob对象来处理数据，并设置文件类型
      if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
        navigator.msSaveBlob(blob, name)
      } else {
        const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
        const a = document.createElement('a') // 创建a标签
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = name // 指定下载文件名
        a.click() // 触发下载
        URL.revokeObjectURL(a.href) // 释放URL对象
      }

      return Promise.resolve(res)
      // 这里也可以不创建a链接，直接window.open(href)也能下载
    })
    .catch(err => {
      return Promise.reject(err)
    })
  // downloadUserTemplate().then(res => {
  //   res
  // })
  // window.open(`${this.baseURL}/downloadUserTemplate`)
}

/**
 * 对象数据对比
 * @param { Object } x
 * @param { Object } y
 * @return { Boolean }
 */
export function deepCompare(x, y) {
  var i, l, leftChain, rightChain

  function compare2Objects(x, y) {
    var p

    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true
    }

    if (x === y) {
      return true
    }

    if ((typeof x === 'function' && typeof y === 'function') ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString()
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false
    }

    // eslint-disable-next-line no-prototype-builtins
    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false
    }

    if (x.constructor !== y.constructor) {
      return false
    }

    if (x.prototype !== y.prototype) {
      return false
    }

    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false
    }
    for (p in y) {
      // eslint-disable-next-line no-prototype-builtins
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }
    }

    for (p in x) {
      // eslint-disable-next-line no-prototype-builtins
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false
      } else if (typeof y[p] !== typeof x[p]) {
        return false
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x)
          rightChain.push(y)

          if (!compare2Objects(x[p], y[p])) {
            return false
          }

          leftChain.pop()
          rightChain.pop()
          break

        default:
          if (x[p] !== y[p]) {
            return false
          }
          break
      }
    }

    return true
  }

  if (arguments.length < 1) {
    return true
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []
    rightChain = []

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false
    }
  }

  return true
}

/**
 * 两个数组对象通过某一字段比较返回数组1中符合条件的
 * @param arr1 数组1
 * @param arr2 数组2
 * @param field 字段
 * @returns {*}
 */
export function twoArrRepeat(arr, existArr, field) {
  // debugger
  if (existArr.length === arr.length) {
    return []
  }
  const checked = arr.map((item) => item[field])
  const result = existArr.filter((item) => !checked.includes(item[field]))
  return result
}

export function SET_LISTBYFIELD(obj) {
  const data = {
    classPath: obj.classPath,
    field: obj.field,
    bomBaseInfoId: store.state.bomBaseInfoId
  }
  const field = _.get(store.state, `app.ListByField[${obj.field}]`)
  if (!field) {
    return getCodeServiceListByclassPath(data).then(res => {
      const temp = { [obj.field]: res }
      store.state.app.ListByField = { ...store.state.app.ListByField, ...temp }
      localStorage.setItem('ListByField', JSON.stringify(store.state.app.ListByField))
      return Promise.resolve(temp)
    })
  } else {
    return Promise.resolve(field)
  }
}

export function getCodeService(data) {
  if (!data) {
    return []
  }
  return getCodeServiceList({ codeServices: data.toString() }).then(res => {
    store.state.app.CodeService = { ...store.state.app.CodeService, ...res }
    localStorage.setItem('CodeService', JSON.stringify(store.state.app.CodeService))
    return res
  })
}
