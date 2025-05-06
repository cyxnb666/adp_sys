import Cookies from 'js-cookie'
import { getCodeServiceListByclassPath } from '@/api/systemManage/bom'
import { getRuleExpressionsAll } from '@/api/systemManage/rule-manage'
import { getCodeServiceList } from '@/api/base'
import { Message } from 'element-ui'
import i18n from '@/languages/index'
import { getApplicationList } from '@/api/mainPages/decision'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  applicationName: Cookies.get('applicationName'),
  applicationId: Cookies.get('applicationId'),
  applicationList: [],
  applicationRuleForward: Cookies.get('applicationRuleForward'),
  remark: Cookies.get('remark'),
  currentVersion: Cookies.get('currentVersion'),
  device: 'desktop',
  CodeService: JSON.parse(localStorage.getItem('CodeService')) || [], // 来自CodeService的列表
  BaseTypeExpressionList: JSON.parse(localStorage.getItem('BaseTypeExpressionList')) || [], // 基础表达式列表
  IdExpressionList: JSON.parse(localStorage.getItem('IdExpressionList')) || [], // ID表达式列表
  ExpressionDetail: JSON.parse(localStorage.getItem('ExpressionDetail')) || [], // 表达式详情
  ListByField: JSON.parse(localStorage.getItem('ListByField')) || {} // 来自字段的列表
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_APPLICATION: (state, application) => {
    if (application.applicationId) {
      state.applicationId = application.applicationId
      state.applicationName = application.applicationName
      state.applicationRuleForward = application.ruleForward
      state.remark = application.remark
      Cookies.set('applicationId', application.applicationId)
      Cookies.set('applicationName', application.applicationName)
      Cookies.set('applicationRuleForward', application.ruleForward)
      Cookies.set('remark', application.remark)
    }
  },
  // EXPRESSIONS表达式列表【按类型|ID分类】
  SET_EXPRESSIONSLIST: (state, obj) => {
    state.BaseTypeExpressionList = obj.typeList
    state.IdExpressionList = obj.IdList
    localStorage.setItem('BaseTypeExpressionList', JSON.stringify(state.BaseTypeExpressionList))
    const data = JSON.parse(localStorage.getItem('IdExpressionList'))
    if (!data) {
      localStorage.setItem('IdExpressionList', JSON.stringify(state.IdExpressionList))
    }
  },

  // CODESERVICE的列表
  SET_CODESERVICE: (state, codeServices) => {
    state.CodeService = { ...state.CodeService, ...codeServices }
    localStorage.setItem('CodeService', JSON.stringify(state.CodeService))
  },
  // 来自字段的列表
  SET_ListByField: (state, obj) => {
    state.ListByField = { ...state.ListByField, ...obj }
    localStorage.setItem('ListByField', JSON.stringify(state.ListByField))
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setApplication({ commit }, application) {
    commit('SET_APPLICATION', application)
  },
  SET_CODESERVICE({ commit }, codeServices) {
    if (!codeServices) {
      return
    }
    const data = {
      codeServices: codeServices.toString()
    }
    return getCodeServiceList(data).then(res => {
      if (JSON.stringify(res) === '{}') {
        // codeServices获取失败
        Message({
          message: i18n.t('store.faile'),
          type: 'error'
        })
        return false
      }
      Object.keys(res).forEach(key => {
        if (res[key].length === 0) {
          // codeServices获取为空
          Message({
            message: i18n.t('store.empty'),
            type: 'error'
          })
          return false
        }
      })
      commit('SET_CODESERVICE', res)
      return Promise.resolve(res)
    })
  },

  SET_LISTBYFIELD({ commit, rootState }, obj) {
    const data = {
      classPath: obj.classPath,
      field: obj.field,
      bomBaseInfoId: rootState.bom.bomBaseInfo
    }
    if (!rootState.app.ListByField[obj.field]) {
      return getCodeServiceListByclassPath(data).then(res => {
        const temp = { [obj.field]: res }
        commit('SET_ListByField', temp)
        return Promise.resolve(temp)
      })
    } else {
      return Promise.resolve(rootState.app.ListByField[obj.field])
    }
  },
  SET_GETRULEEXPRESSIONSALL({ commit }) {
    getRuleExpressionsAll().then(res => {
      const typeList = {} // 按照基本类型分类
      const IdList = {} // 按照id来分
      for (var i = 0; i < res.length; i++) {
        // 表达式分类： 基本类型的集合
        const type = res[i].beforeParamType.toLowerCase()
        if (!typeList[type]) {
          const arr = []
          arr.push(res[i])
          typeList[type] = arr
        } else {
          typeList[type].push(res[i])
        }

        // 表达式分类： id的集合
        const key = res[i].expressionId
        IdList[key] = res[i]
      }
      commit('SET_EXPRESSIONSLIST', { typeList: typeList, IdList: IdList })
    })
  },
  getApplicationList({ state, rootState }) {
    return new Promise((resolve, reject) => {
      getApplicationList().then(res => {

        if (!res.some(v => v.applicationId === state.applicationId)) state.applicationId = ''
        
        rootState.permission.terrace = res.length ? 'main' : 'system'
        state.applicationList = res || []

        resolve(res)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
