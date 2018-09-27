import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import container from '../components/pub/container/container.vue'
import home from '../components/home/home.vue'
import faceRegister from '../components/faceManage/register/register.vue'
import faceManage from '../components/faceManage/register/faceManage.vue'
import faceProcess from '../components/faceManage/process/process.vue'
import deviceRegister from '../components/deviceManage/deviceRegister/device.vue'
import locationRegister from '../components/deviceManage/locationRegister/location.vue'
import log from '../components/logManage/log.vue'
import user from '../components/userManage/user.vue'
import serviceManage from '../components/serviceManage/serviceRegister/serviceManage.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/container',
    name: 'container',
    component: container,
    children: [{
      path: 'home',
      component: home
    },
    {
      path: 'faceRegister',
      component: faceRegister
    },
    {
      path: 'faceManage',
      component: faceManage
    },
    {
      path: 'faceProcess',
      component: faceProcess
    },
    {
      path: 'deviceRegister',
      component: deviceRegister
    },
    {
      path: 'locationRegister',
      component: locationRegister
    },
    {
      path: 'log',
      component: log
    },
    {
      path: 'user',
      component: user
    },
    {
      path: 'serviceManage',
      component: serviceManage
    }
    ]
  }, {
    path: '*',
    redirect: '/login' // 重定向任意未匹配路径到 /login
  }
  ]
})
