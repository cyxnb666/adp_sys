
import Cookies from 'js-cookie'
import { getMethodList, getBomModelId } from '@/api/systemManage/bom'

const state = {
  fieldArray: null,
  bomBaseInfo: Cookies.get('bomBaseInfo'),
  expressionList: JSON.parse(localStorage.getItem('expressionList')) || []// poc表达式列表
}

const mutations = {
  SET_fieldArray: (state, fieldArray) => {
    state.fieldArray = [...fieldArray]
  },
  SET_bomBaseInfo: (state, bomBaseInfo) => {
    state.bomBaseInfo = bomBaseInfo
    Cookies.set('bomBaseInfo', bomBaseInfo)
  },
  // EXPRESSIONS表达式列表【按类型|ID分类】
  SET_POCEXPRESSIONSLIST: (state, obj) => {
    state.expressionList = obj
    localStorage.setItem('expressionList', JSON.stringify(obj))
  }
}

const actions = {
  SET_fieldArray({ commit }, fieldArray) {
    commit('SET_fieldArray', fieldArray)
  },
  SET_bomBaseInfo({ commit }, bomBaseInfo) {
    commit('SET_bomBaseInfo', bomBaseInfo)
  },
  SET_GETPOCEXPRESSIONSALL({ commit, state }) {
    getBomModelId(state.bomBaseInfo).then(res => {
      getMethodList(res).then(res => {
        const object = res.reduce((result, item) => {
          result[item.expressionId] = item
          return result
        }, {})
        commit('SET_POCEXPRESSIONSLIST', object)
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
