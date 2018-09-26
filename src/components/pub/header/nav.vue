<style>
.el-header {
  padding: 0;
}
.el-menu.el-menu--popup.el-menu--popup-bottom-start {
  max-width: 150px;
}
.el-menu--popup-bottom-start {
  margin-top: 0;
}
</style>
<template>
  <el-menu mode="horizontal" :default-active="activeIndex" background-color="#283142" text-color="#fff" :unique-opened=true :router=true active-text-color="#2C9CFA">
    <el-menu-item index="/container/home">
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="/container/foo">
      <template slot="title">
        <span>人脸库管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/container/faceRegister">人脸库注册</el-menu-item>
        <el-menu-item index="/container/faceProcess">注册进度查询</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/container/serviceManage">
      <span slot="title">服务管理</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <span>设备管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/container/deviceRegister">设备注册</el-menu-item>
        <el-menu-item index="/container/locationRegister">地点注册</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/container/log">
      <span slot="title">日志管理</span>
    </el-menu-item>
    <el-menu-item index="/container/user" v-if="userData">
      <span slot="title">用户管理</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
import api from '../../../store/api';
export default {
  data() {
    return {
      activeIndex: '/container/home',
      userData: ''
    };
  },
  watch: {
    $route: function(val) {
      this.activeIndex = this.$route.path;
    }
  },
  mounted() {
    this.activeIndex = this.$route.path;
    // 判断是否是管理员
    this.userData = api.fetchUserInfo().isAdmin;
  }
};
</script>
