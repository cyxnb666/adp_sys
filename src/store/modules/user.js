import {generateKey, login, logout} from '@/api/login'
import { getUser } from '@/api/systemManage/user-manage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password , sign } = userInfo
    return new Promise((resolve, reject) => {
      login({ userId: username.trim(), password: password , sign : sign }).then(response => {
        if (response['adp-token']) {
          commit('SET_TOKEN', response['adp-token'])
          setToken(response['adp-token'])
        }
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  generateKey() {
    return new Promise((resolve, reject) => {
      generateKey().then(response => {
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUser(state.token).then(response => {
        const { roleList, name } = response
        const roles = roleList.map(element => {
          return element.roleId
        })
        if (!roles) {
          reject('Verification failed, please Login again.')
        }

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: role must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        resolve({ response, roles })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        // console.log(state.permission)
        // resetRouter(state.permission.routes)
        // commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

