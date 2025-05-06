
import store from '../store'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
import i18n from '../languages/index'
import { common } from './routeConfig'
import { createRouter } from './index'
import { filterAsyncRoutes } from '../store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

export const takeFirstRoute = (arr = []) => {
  let path = ''
  if (arr.length === 0) return path

  for (let item of arr) {
    if (item.hidden && item.path !== '/dashboard') continue
    path += (item.path + '/' + takeFirstRoute(item.children))
    return path
  }
}

export default (router) => {
  router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()
    // set page title
    // document.title = getPageTitle(to.meta.title)
  
    // determine whether the user has logged in
    // const hasToken = getToken()
    console.log(store)
    
    if (store.state.user.token) { // 已登录或者登录信息未过期

      if (store.state.user.roles.length) { // 已获取用户信息
        if (to.path === '/login') {
          // if is logged in, redirect to the home page
          next({ path: '/' })
          NProgress.done()
        } else {
          // determine whether the user has obtained his permission roles through getInfo
          const hasRoles = store.getters.roles && store.getters.roles.length > 0
          if (hasRoles) {
            // if (!to.meta.enable) {
            //   NProgress.done()
            //   Message.error(i18n.t('permission.permission'))
            //   next('/')
            // } else {
            // }
            next()
          } else {
            try {
              // 默认main 控制台；如果地址栏有角色则给角色更新
              // const terrace = store.state.permission.terrace || 'main'
              // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
    
              // const callback = (obj) => {
              //   if (!obj) return ''
    
              //   return obj.path + (obj.children ? callback(obj.children[0]) : '')
              // }
              // console.log(store)
              // const curRouterPath = callback(store.getters.permission_routes[0])
    
              // if (to.path !== curRouterPath) {
              //   to = Object.assign({}, to, { path: curRouterPath })
              // }
    
              // hack method to ensure that addRoutes is complete
              // set the replace: true, so the navigation will not leave a history record
              next({ ...to, replace: true })
            } catch (error) {
              // remove token and go to login page to re-login
              await store.dispatch('user/resetToken')
              Message.error(error || 'Has Error')
              next(`/login?redirect=${to.path}`)
              NProgress.done()
            }
          }
        }
      } else {
        const { roles, response } = await store.dispatch('user/getInfo') // 获取用户信息

        if (response.tips) { // 提示还要*天更新密码
          MessageBox.alert(response.tips, i18n.t('common.hint'), {
            confirmButtonText: i18n.t('button.OK')
          })
        }

        await store.dispatch('app/getApplicationList') // 获取应用列表
        
        // // 根据角色生成可访问路由图
        // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // // 动态添加可访问路由
        // router.addRoutes(accessRoutes)

        const terrace = to.query.terrace || store.state.permission.terrace || 'main'
        store.dispatch('permission/changeRoutes', terrace)

        const currentRoutes = filterAsyncRoutes(common, roles)
        router.matcher = createRouter(currentRoutes).matcher

        store.commit('SET_ADDROUTER', currentRoutes)

        console.log(store.state)

        // 已选择决策应用
        if (store.state.app.applicationId || terrace === 'system') {
          next({ path: takeFirstRoute(store.state.permission.sidebar).slice(0, -1) })
        } else {
          next('/getApplicationList')
        }
      }
      
    } else {
      /* has no token*/
  
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })
  
  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })

}