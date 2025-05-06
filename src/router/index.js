import Vue from 'vue'
import Router from 'vue-router'

import { common, main, system } from './routeConfig'

import createRouteCycle from './permission' // permission control

Vue.use(Router)

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: common
})

createRouteCycle(router) // permission control

export const createRouter = function (routes) {
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes,
  })
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(routes) {
  // const newRouter = createRouter()
  router.matcher = createRouter(routes).matcher
}

export default router
