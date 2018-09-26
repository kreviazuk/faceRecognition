/**
 * Created by dhj on 2018/5/3.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    user
  }
})
