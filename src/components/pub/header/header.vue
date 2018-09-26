<style>
#header {
  background: #283142;
  text-align: left;
  max-height: 60px;
}
#header #logo {
  vertical-align: top;
  display: inline-block;
  width: 15%;
  color: #ffffff;
  background-image: url(../../../assets/imgs/logo.svg);
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: 10px;
  padding-left: 40px;
}
#header #username {
  text-align: right;
  width: 18%;
  vertical-align: top;
  display: inline-block;
  color: #ffffff;
}
#header #nav {
  width: 60%;
  display: inline-block;
}
ul li div:hover,
#header #nav ul li span:hover {
  color: #2c9cfa !important;
}

/*dialog style*/
#header .el-dialog {
  border-radius: 5px;
}
#header .el-dialog__title {
  font-size: 16px;
  color: #3c3e4a;
}
#header .el-dialog__header {
  text-align: left;
  padding: 0 0 0 20px;
}
#header .el-dialog__body {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding-right: 65px;
}
#header .el-dialog__footer {
  padding: 0 20px;
}
</style>
<template>
  <div id="header">
    <div id="logo">人脸识别管理平台</div>
    <div id="nav">
      <navigation></navigation>
    </div>
    <div id="username">
      <el-menu mode="horizontal" background-color="#283142" text-color="#fff" active-text-color="#fff">
        <el-submenu index="1" class="username-list">
          <template slot="title">{{userInfo.name}}</template>
          <el-menu-item index="1-1" @click="dialogVisible = true">修改密码</el-menu-item>
          <el-menu-item index="1-2" @click="logout">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <el-form :rules='rules' ref="dialogForm" :model="dialogForm" label-width="80px">
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="dialogForm.newPassword" size="small"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="dialogForm.confirmPassword" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import navigation from './nav.vue';
import api from '../../../store/api';
import { mapMutations, mapGetters } from 'vuex';
import md5 from 'blueimp-md5';
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\~\`\@\#\$\%\^\&\*\-\_\=\+\|\?\/\(\)\<\>\[\]\{\}\,\.\;\'\!\&quot\\]).{8,12}$/.test(
          value
        )
      ) {
        callback(new Error('密码必须为数字、字母大小写、特殊符合的8-12位组合'));
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.dialogForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogForm: {
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '请输入密码' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    logout() {
      let params = {
        account: this.userInfo.name
      };
      api.user.logout(
        params,
        function(data) {
          if (data.status == 'success') {
            api.saveUserInfo({});
            this.setUserInfo('');
            this.$router.push({ path: 'login' });
          }
        }.bind(this)
      );
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.dialogForm.resetFields();
    },
    submit() {
      this.$refs.dialogForm.validate(
        function(valid) {
          if (valid) {
            let params = {
              password: md5(this.dialogForm.newPassword)
            };
            api.user.changepassword(
              params,
              function(data) {
                if (data.code == 200) {
                }
              }.bind(this)
            );
            this.handleClose();
          } else {
            return false;
          }
        }.bind(this)
      );
    }
  },
  components: {
    navigation
  }
};
</script>
