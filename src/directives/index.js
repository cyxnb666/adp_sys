
import Vue from 'vue'

import './popper.js'

import ContextMenu from './ContextMenu.js'

Vue.directive('defaultSelect', {
  inserted(el, bindings) {
    defaultSelect(el, bindings)
  },
  componentUpdated(el, bindings, oldVnode) {
    defaultSelect(el, bindings)
  }
})

const defaultSelect = function(el, bindings) {
  const [defaultValues] = bindings.value
  const dealStyle = function(tags) {
    // 因为不可删除原有值，所以原有值的index是不会变的，也就是将前n个tag的close隐藏掉即可。n即已有值的长度defaultValues.length
    tags.forEach((el, index) => {
      if (
        index <= defaultValues.length - 1 &&
          ![...el.classList].includes('select-tag-close-none')
      ) {
        el.style.display = 'none' // close 图标隐藏掉
      }
    })
  }
  // 设置样式隐藏close icon
  const tags = el.querySelectorAll('.el-tag__close')
  dealStyle(tags)
  if (tags.length === 0) {
    // 初始化tags为空处理
    setTimeout(() => {
      const tagTemp = el.querySelectorAll('.el-tag__close')
      dealStyle(tagTemp)
    })
  } else {
    dealStyle(tags)
  }
}

Vue.directive(ContextMenu.name, ContextMenu)