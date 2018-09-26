/**
 * Created by dhj on 2018/5/3.
 */
const state = {
  loginNoOperateTime: 0,
  userInfo: ''
};
const getters = {
  loginNoOperateTime: state => state.loginNoOperateTime,
  userInfo: state => state.userInfo
};
/* const action = {

}; */
const mutations = {
  setLoginNoOperateTime (state, val) {
    state.setLoginNoOperateTime = val;
  },
  setUserInfo (state, val) {
    state.userInfo = val;
  }
};

export default {
  state,
  getters,
  // actions,
  mutations
}
