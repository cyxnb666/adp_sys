
// import { mainRoutes, systemRoutes } from '@public/js/router'
// import Layout from '@/layout'
import Cookies from 'js-cookie'

import { common, main, system } from '../../router/routeConfig'

// eslint-disable-next-line no-undef
const mainRoutes = main || main
// eslint-disable-next-line no-undef
const systemRoutes = system || system

// 转义加载外部router
function transfer(RomeRouter) {
  if (!RomeRouter) {
    return
  }
  const currentRouter = RomeRouter
  for (let index = 0; index < currentRouter.length; index++) {
    const element = currentRouter[index]
    transfer(element)
  }

  if (RomeRouter.component === 'Layout') {
    currentRouter.component = Layout
  } else {
    let subView = RomeRouter.component
    subView = subView ? subView.replace(/^\/*/g, '') : ''
    subView ? currentRouter.component = resolve => require([`@/views/${subView}`], resolve) : ''
  }
  if (RomeRouter.children) {
    for (let index = 0; index < RomeRouter.children.length; index++) {
      const element = RomeRouter.children[index]
      transfer(element)
    }
  }
  return currentRouter
}

// transfer(mainRoutes)
// transfer(systemRoutes)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 权限列表
  sidebar: [], // 左侧菜单列表
  terrace: Cookies.get('terrace') // 系统角色
}

const mutations = {
  SET_ADDROUTER: (state, routes) => {
    const hasCustom = state.routes.find(element => {
      return element.path === '/custom'
    })
    if (!hasCustom) {
      state.routes.push(routes)
    }
  },
  SET_ROUTES: (state, routes) => {
    const arr = [...new Set(common)]
    state.routes = arr
  },
  SET_TERRACE: (state, info) => {
    state.terrace = info.terrace
    if (state.terrace === 'system') {
      // 系统菜单
      const FitlerRouter = filterAsyncRoutes(systemRoutes, info.roles)
      state.sidebar = FitlerRouter
    } else if (state.terrace === 'main') {
      const FitlerRouter = filterAsyncRoutes(mainRoutes, info.roles)
      state.sidebar = FitlerRouter
      // 控制台菜单
    }
    Cookies.set('terrace', info.terrace)
  },
  SET_CUSTOMLINK: (state, customRouter) => {
    const hasCustom = state.sidebar.find(element => {
      return element.path === '/custom'
    })
    if (!hasCustom) {
      state.sidebar.push(customRouter)
    }
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const router = mainRoutes.concat(systemRoutes)
      const accessedRoutes = filterAsyncRoutes(router, roles)
      const arr = [...new Set(accessedRoutes)]
      commit('SET_ROUTES', arr)
      resolve(arr)
    })
  },
  changeRoutes({ commit, rootState }, terrace) {
    const roles = rootState.user.roles
    if (terrace) {
      commit('SET_TERRACE', { terrace, roles })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
