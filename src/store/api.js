import Vue from 'vue'
import {
  env
} from '../config/env';
import store from '../store/index'

export const key = 'face-recognition';
const header = {
  'Authorization': 'Bearer'
};
let Base64 = require('js-base64').Base64;

const root = env.root + '/api';

export default {
  user: {
    login: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/login',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    logout: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/logout',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 用户列表
    users: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 添加用户
    addusers: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 编辑用户
    editusers: function (id, params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/' + id,
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 批量删除用户
    batchdelusers: function (ids, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/batch/' + ids,
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 管理员重置用户密码
    adminResetPassword: function (userId, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/adminResetPassword/' + userId,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 用户名称重复检测
    userExist: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/userExist',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 修改密码
    changepassword: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/password',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  service: {
    // 服务列表
    devices: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/services',
        params: params,
        method: 'GET'
      })
    }
  },
  device: {
    // 设备列表
    devices: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 添加设备
    adddevices: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 编辑设备
    editdevices: function (id, params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/' + id,
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 批量删除设备
    batchdeldevices: function (ids, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/batch/' + ids,
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 添加设备获取地点接口
    getPositionForDevice: function (c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/getPositionForDevice',
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 添加设备获取人脸库接口
    getFaceStoreForDevice: function (c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/getFaceStoreForDevice',
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 设备名称重复检测
    deviceExist: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/deviceExist',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 地点列表
    positions: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/position',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 添加地点
    addpositions: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/position',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 编辑地点
    editpositions: function (id, params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/position/' + id,
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 批量删除地点
    batchdelpositions: function (ids, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/position/batch/' + ids,
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 地点名称重复检测
    positionExist: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/positionExist',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  service: {
    // 服务列表
    services: function (params, c) {
      return Vue.http({
        headers: header,
        url: 'http://localhost:3000/course',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  log: {
    // 日志查询获取地点列表
    logpositionList: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/log/positionList',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 日志查询获取设备列表
    logdeviceList: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/devices/log/deviceList',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 日志查询获取用户列表
    loguserList: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/users/log',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 日志列表
    logs: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/log/log',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 纳入底库
    appendToFace: function (id, c) {
      return Vue.http({
        headers: header,
        url: root + '/log/image/appendToFace/' + id,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    // 检测日志列表是否更新
    checkUpdate: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/log/checkUpdate',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  face: {
    checkFaceCode: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/faceCode',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    getFaceList: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/list',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    deleteFaces: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/info/' + params.join(','),
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    editFace: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/info/' + params.id,
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    addFaceInfo: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/info',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    deleteFacePicture: function (id, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/image/' + id,
        method: 'delete'
      }).then(function (response) {
        c(response.data);
      })
    },
    setCoverPicture: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/faces/imageCover',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  faceStore: {
    getFaceStores: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    addFaceStore: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores',
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    deleteFaceStore: function (ids, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/batch/' + ids.join(','),
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    editFaceStore: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/' + params.id,
        body: params,
        method: 'POST'
      }).then(function (response) {
        c(response.data);
      })
    },
    checkFaceStoreName: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/faceStoreExist',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    getRegisterProcess: function (params, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/Register',
        params: params,
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    deleteRegisterProcess: function (ids, c) {
      return Vue.http({
        headers: header,
        url: root + '/facestores/register/batch/' + ids.join(','),
        method: 'DELETE'
      }).then(function (response) {
        c(response.data);
      })
    },
    exportErrorRegisterProcess: function (id, c) {
      window.location.href = root + '/facestores/register/error/' + id + '?token=' + store.state.user.userInfo.token;
    }
  },
  home: {
    faceStore: function (c) {
      return Vue.http({
        headers: header,
        url: root + '/overview/facestore',
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    recognition: function (c) {
      return Vue.http({
        headers: header,
        url: root + '/overview/recognition',
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    },
    device: function (c) {
      return Vue.http({
        headers: header,
        url: root + '/overview/device',
        method: 'GET'
      }).then(function (response) {
        c(response.data);
      })
    }
  },
  saveLoginInfo (info) {
    localStorage.setItem('cmss-face-recognition-login-info', Base64.encode(JSON.stringify(info)));
  },
  fetchLoginInfo () {
    if (localStorage.getItem('cmss-face-recognition-login-info')) {
      return JSON.parse(Base64.decode(localStorage.getItem('cmss-face-recognition-login-info')));
    } else {
      return ''
    }
  },
  saveUserInfo (info) {
    localStorage.setItem('cmss-face-recognition-user-info', Base64.encode(JSON.stringify(info)));
  },
  fetchUserInfo () {
    if (localStorage.getItem('cmss-face-recognition-user-info')) {
      return JSON.parse(Base64.decode(localStorage.getItem('cmss-face-recognition-user-info')));
    } else {
      return ''
    }
  }
}
