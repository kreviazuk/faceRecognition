<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  computed: {
    ...mapGetters(['loginNoOperateTime'])
  },
  watch: {
    loginNoOperateTime: function(val) {
      if (val > 30 * 60) {
        this.$router.push({ path: '/login' });
        this.$message({
          message: '登录后长时间无操作，请重新登录!',
          duration: 1000,
          type: 'warning'
        });
      }
    }
  }
};
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-size: 14px;
}
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  width: auto;
}
</style>
