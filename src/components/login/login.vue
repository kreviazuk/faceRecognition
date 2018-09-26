<style>
  #login{
    background-image: url(../../assets/imgs/loginBackground.svg);
    background-color: #113B84;
    background-repeat: repeat;
    background-size: 100%;
    height: auto;
    min-height: 100%;
    padding: 30px;
    box-sizing: border-box;
    position: relative;
  }
  #login input:-webkit-autofill,
  #login textarea:-webkit-autofill,
  #login select:-webkit-autofill {
    background-color: transparent!important;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }

  #login #title{
    background-image: url(../../assets/imgs/logo.svg);
    background-repeat: no-repeat;
    color: #fff;
    padding-left: 25px;
    font-size: 18px;
  }
  #login #wrap{
    margin: 6% auto 0 auto;
    width: 750px;
    height: 500px;
    background-image: url(../../assets/imgs/loginPic.svg);
    background-repeat: no-repeat;
    background-color: #fff;
    background-position-x: -1px;
    position: relative;
  }

  #login #wrap .el-input__inner{
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #dcdfe6;
    color: #3C3E4A;
    padding: 0;
  }
  #login #wrap #login-title{
    border-left: 5px solid #1F7AEE ;
    padding-left: 8px;
    color: #1F7AEE;
    font-size: 18px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  #login #wrap .el-row{
    margin: 20px;
    color: #ccc;
  }
  #login #wrap .el-checkbox{
    color: #999;
  }
  #login #wrap #login-btn{
    position: absolute;
    right: 50px;
    bottom: 100px;
  }
  #login .el-form-item.is-required .el-form-item__label:before{
    content: '';
  }
</style>
<template>
  <div id="login">
    <div id="title">人脸识别管理平台</div>
    <div id="wrap">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="9" :offset="12" id="login-title">登录
        </el-col>
      </el-row>
      <el-form ref="loginForm" :model="loginForm" label-width="45px" :rules="rules">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="9" :offset="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="loginForm.account" autocomplete="new-password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="9" :offset="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password" autocomplete="new-password" @keyup.enter="login"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="9" :offset="12">
          <el-checkbox v-model="isRemember">保持登录状态</el-checkbox>
        </el-col>
      </el-row>
      <el-button type="primary" @click="login" id="login-btn" round>登录</el-button>
    </div>
  </div>
</template>
<script>
  import api from '../../store/api'
  import { mapMutations } from 'vuex'
  import md5 from 'blueimp-md5'
  export default{
    data(){
      return{
        loginForm: {
          account: '',
          password: '',
        },
        rememberPassword: '',
        isRemember: false,
        rules: {
          account: [
            {required: true, message:'请输入账号', trigger: 'blur'},
          ],
          password: [
            {required: true, message:'请输入密码', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      ...mapMutations([
        'setUserInfo'
      ]),
      /*
      * 登录
      * */
      login(){
        this.$refs.loginForm.validate(function(valid){
            if (valid){
              let params = {
                account: this.loginForm.account,
                password:this.rememberPassword== this.loginForm.password ?
                  this.loginForm.password : md5(this.loginForm.password)
              };
              api.saveUserInfo({});
              this.setUserInfo('');
              api.user.login(params, function (data) {
                if(data.status == 'success'){
                  this.rememberLoginInfo(params, data.result);
                  this.setUserInfo(data.result);
                  this.$router.replace({path : '/container/home'});
                }else{
                  this.loginForm = {
                    account: '',
                    password: '',
                  }
                  this.isRemember = false;
                }
              }.bind(this));
            }else{
              return false;
            }
        }.bind(this));
      },
      /*
      * @loginInfo: {}登录信息：用户名和密码
      * @userInfo: {}登录成功返回的信息：token及其他
      * 存储登录信息及登录成功返回的信息
      * */
      rememberLoginInfo(loginInfo, userInfo){
        api.saveUserInfo(userInfo)
        if(this.isRemember == 1){
          api.saveLoginInfo(loginInfo);
        }else{
          api.saveLoginInfo({});
        }
      },
      /*
      * 初始化用户名和密码
      * 加载登录页面时调用
      * */
      initLoginInfo(){
        let loginInfo = api.fetchLoginInfo();
        if(loginInfo && JSON.stringify(loginInfo) != '{}'){
          this.loginForm.account = loginInfo.account;
          this.loginForm.password = loginInfo.password;
          this.rememberPassword = loginInfo.password;
          this.isRemember = true;
        }else{
          this.loginForm.account = '';
          this.loginForm.password = '';
          this.isRemember = false;
        }
      }
    },
    mounted(){
      this.initLoginInfo();
    }
  }
</script>
