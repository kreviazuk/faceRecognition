// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import api from './store/api'
import './assets/css/app.css'
import {
  Loading,
  Message
} from 'element-ui';
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

var interval;
Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(preview);
Vue.http.interceptors.push(function (request, next) {
  // 请求发送前的处理逻辑

  // 请求接口设置登录操作时长
  store.state.user.loginNoOperateTime = 0;
  if (request.url.indexOf('login') != -1) {
    interval = setInterval(function () {
      store.state.user.loginNoOperateTime++
    }, 1000)
  }
  if (request.url.indexOf('logout') != -1) {
    window.clearInterval(interval);
  }

  // 显示loading
  if (request.url.indexOf('login') < 0 &&
    request.url.indexOf('checkUpdate') < 0 &&
    request.url.indexOf('/faces/faceCode') < 0 &&
    request.url.indexOf('/facestores/faceStoreExist') < 0 &&
    request.url.indexOf('/devices/positionExist') < 0 &&
    request.url.indexOf('/users/userExist') < 0
  ) {
    var loading = Loading.service({
      fullscreen: true,
      text: '处理中...'
    });
  }

  // 判断vuex里的token以及其他状态是否丢失
  if (!store.state.user.userInfo) {
    let userData = api.fetchUserInfo();
    if (JSON.stringify(userData) != '{}') {
      store.state.user.userInfo = userData;
    } else {
      router.push({
        path: 'login'
      })
    }
  }

  // modify request
  let userInfo = store.state.user.userInfo;
  if (userInfo && userInfo.token && request.headers.map.hasOwnProperty('Authorization')) {
    request.headers.map.Authorization[0] = 'Bearer ' + userInfo.token;
  } else {
    router.push({
      path: 'login'
    })
  }

  next(function (response) {
    // 请求发送后的处理逻辑
    loading && loading.close();
    // 没有权限退出登录
    if (response.status != 200 || response.body.code == 401) {
      let message = Message({
        message: '请求失败',
        duration: 1000,
        type: 'error'
      });
      setTimeout(function () {
        message && message.onClose()
      }, 1000)
      store.state.user.userInfo = '';
      api.saveLoginInfo({});
      api.saveUserInfo({});
      router.go({
        path: 'login'
      });
    }
    if (response.body.code != '200') {
      let message = Message({
        message: response.body.message || '请求失败',
        duration: 1000,
        type: 'error'
      });
      setTimeout(function () {
        message && message.onClose()
      }, 1000)
    }
    if (request.url.indexOf('login') == -1 &&
      request.url.indexOf('faces/list') == -1 &&
      request.method != 'GET' && response.body.code == '200') {
      let message = Message({
        message: response.body.message || '操作成功',
        duration: 1000,
        type: 'success'
      });
      setTimeout(function () {
        message && message.onClose()
      }, 1000)
    }
    // 根据请求的状态，response参数会返回给successCallback或errorCallback
    return response
  })
})

router.beforeEach((to, from, next) => {
  // 判断vuex里的token以及其他状态是否丢失
  if (!store.state.user.userInfo && to.name != 'login') {
    let userData = api.fetchUserInfo();
    if (JSON.stringify(userData) != '{}') {
      store.state.user.userInfo = userData;
    } else {
      router.go({
        path: 'login'
      })
    }
  }

  if (!store.state.user.userInfo.isAdmin && to.path == '/container/user') {
    router.replace({
      name: 'login'
    })
  }

  // 路由跳转设置登录操作时长为0
  if (to.path.indexOf('login') != -1) {
    window.clearInterval(interval);
  } else {
    store.state.user.loginNoOperateTime = 0;
  }
  next();
})
router.afterEach((to, from) => {})
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
