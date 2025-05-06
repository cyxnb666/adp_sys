
import { extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import i18n from '@/languages/index'
// extend扩展，官网有很多封装好的，不过需改成中文提示语句

// 新增一个required校验规则
extend('required', {
  ...required, // 官方自带的校验规则
  message: i18n.t('validate.validate') // 自定义错误消息
})

// 新增一个email校验规则，使用官方默认错误消息
extend('email', email)
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  str = str.trim()
  return !(str.length > 0)
}

export function validateAccount(rule, value, callback) {
  if (value === '') {
    callback(new Error(i18n.t('validate.null')))
  } else {
    // var reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
    var reg = /^[a-zA-Z0-9][a-zA-Z0-9._-]{5,19}$/
    if (!reg.test(value)) {
      // callback(new Error('不符合规范! 长度6-19, 不能数字开头'))
      callback(new Error(i18n.t('validate.length')))
    } else {
      callback()
    }
  }
}

export function emailValue(rule, value, callback) {
  const temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
  // eslint-disable-next-line no-unused-vars
  const tempOne = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
  if (value && (!(temp).test(value))) {
    callback(new Error(i18n.t('validate.email')))
  } else {
    callback()
  }
}
