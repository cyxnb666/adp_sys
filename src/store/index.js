import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import bom from './modules/bom'

Vue.use(Vuex)

const store = new Vuex.Store({
  bomBaseInfoId: 'ae1db37ff7f949d8b20f37f37b8d6cae',
  modules: {
    app,
    permission,
    settings,
    user,
    bom
  },
  getters
})

export default store
