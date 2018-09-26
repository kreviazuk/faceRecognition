<template>
  <div class="userCont Content">
    <el-row>
      <el-col :span="4">
        <el-button size="small" type="primary" @click="UserdialogClick"> + 添加用户</el-button>
        <el-button size="small" type="primary" @click="UserbatchDelete" plain :disabled="disabledBtn">批量删除</el-button>
      </el-col>
      <el-col :span="5" :offset="15">
        <el-input size="small" v-model="query" @keyup.enter.native="UserSearch(query)" placeholder="请输入内容">
          <el-button size="small" slot="append" icon="el-icon-search" @click="UserSearch(query)"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="userData" tooltip-effect="dark" style="width: 100%;margin-top: 20px" @selection-change="SelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="account" label="创建账号"></el-table-column>
      <el-table-column prop="description" label="用户描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="UserEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" @click="UserDelete(scope.$index, scope.row)">删除</el-button>
          <el-button type="text" @click="UserReset(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="userPage mt-20" v-if="userData.length > 0">
      <span>每页显示</span>
      <el-pagination @size-change="UserSizeChange" @current-change="UserCurrentChange" :current-page.sync="UserCurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="sizes, prev, pager, next" :total="totals" background>
      </el-pagination>
    </div>
    <!--添加/编辑 用户弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="userDialog" width="460px" @close="closeDialog('userRuleForm')" class="DialogForm">
      <el-form :model="userRuleForm" :rules="userRules" ref="userRuleForm" label-width="105px" size="small">
        <el-form-item label="用户名称 :" prop="account">
          <el-input v-model="userRuleForm.account" :disabled="disabledEdit"></el-input>
        </el-form-item>
        <el-form-item label="用户描述 :" prop="description">
          <el-input type="textarea" v-model="userRuleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" type="primary" :disabled="addBtn" @click="addUserForm('userRuleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../store/api';

export default {
  data() {
    const ValidateName = (rule, value, callback) => {
      // 用户名称重复检测
      if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(value)) {
        this.addBtn = true;
        callback(new Error('仅支持英文大小写及数字，数字不能为首位，4~20位'));
      } else if (this.dialogTitle == '添加用户') {
        let params = {
          account: value
        };
        api.user.userExist(
          params,
          function(data) {
            if (data.status == 'success') {
              if (data.result) {
                this.addBtn = true;
                callback(new Error('用户名称重复'));
              } else {
                this.addBtn = false;
              }
              callback();
            }
          }.bind(this)
        );
      } else {
        callback();
      }
    };
    return {
      disabledBtn: true,
      addBtn: true,
      userDialog: false,
      disabledEdit: false,
      userRuleForm: {
        account: '',
        description: ''
      },
      userRules: {
        account: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
          { validator: ValidateName, trigger: 'change' }
        ],
        description: [
          { max: 50, message: '用户描述最大不能超过50个字符', trigger: 'blur' }
        ]
      },
      userData: [],
      SelectionData: [],
      query: '',
      UserCurrentPage: 1,
      dialogTitle: '添加用户',
      totals: 0,
      page: 1,
      rows: 10
    };
  },
  methods: {
    // 获取用户列表
    getuserList() {
      let params = {
        account: this.query,
        page: this.page,
        rows: this.rows
      };
      api.user.users(
        params,
        function(data) {
          if (data.status == 'success') {
            this.userData = data.result.list;
            this.totals = data.result.total;
          }
        }.bind(this)
      );
    },
    // 点击添加用户
    UserdialogClick() {
      this.userDialog = true;
      this.addBtn = true;
      this.disabledEdit = false;
      this.dialogTitle = '添加用户';
      this.userRuleForm.account = '';
      this.userRuleForm.description = '';
    },
    // 添加/编辑 用户
    addUserForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '添加用户') {
            let params = {
              account: this.userRuleForm.account,
              description: this.userRuleForm.description
            };
            api.user.addusers(
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getuserList();
                  this.userDialog = false;
                  this.$message({
                    type: 'success',
                    duration: 1000,
                    message: data.message
                  });
                }
              }.bind(this)
            );
          } else if (this.dialogTitle == '编辑用户') {
            let id = this.userRuleForm.id;
            let params = {
              description: this.userRuleForm.description
            };
            api.user.editusers(
              id,
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getuserList();
                  this.userDialog = false;
                  this.$message({
                    type: 'success',
                    duration: 1000,
                    message: data.message
                  });
                }
              }.bind(this)
            );
          }
        } else {
          return false;
        }
      });
    },
    // 关闭 Modal 执行
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.userRuleForm.account = '';
      this.userRuleForm.description = '';
    },
    // 批量删除
    UserbatchDelete() {
      this.$alert(
        '此操作将永久删除 <span>' +
          this.SelectionData.length +
          '</span> 个账号, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let id = this.SelectionData;
          api.user.batchdelusers(
            id,
            function(data) {
              if (data.status == 'success') {
                if (this.userData.length > 1) {
                  this.getuserList();
                } else {
                  this.getuserList(1, 10);
                }
                this.userDialog = false;
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: data.message
                });
              }
            }.bind(this)
          );
        })
        .catch(() => {});
    },
    // 批量选择
    SelectionChange(val) {
      if (val.length !== 0) {
        let selectIds = [];
        val.forEach(function(key, item) {
          return (selectIds[item] = key.id);
        });
        this.SelectionData = selectIds;
        this.disabledBtn = false;
      } else {
        this.disabledBtn = true;
      }
    },
    // 搜索用户
    UserSearch(query) {
      this.query = query;
      this.getuserList();
    },
    // 点击编辑用户
    UserEdit(index, row) {
      this.userDialog = true;
      this.addBtn = false;
      this.disabledEdit = true;
      this.dialogTitle = '编辑用户';
      this.userRuleForm.account = row.account;
      this.userRuleForm.description = row.description;
      this.userRuleForm.id = row.id;
    },
    // 删除用户
    UserDelete(index, row) {
      this.$alert(
        '此操作将永久删除 <span>' + row.account + '</span> 该账号, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = row.id;
          api.user.batchdelusers(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.userData.length > 1) {
                  this.userData.splice(index, 1);
                } else {
                  this.getuserList(1, 10);
                }
                this.userDialog = false;
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: data.message
                });
              }
            }.bind(this)
          );
        })
        .catch(() => {});
    },
    // 重置密码
    UserReset(index, row) {
      this.$alert(
        '此操作将重置账号 <span>' + row.account + '</span> 的密码, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let userId = row.id;
          api.user.adminResetPassword(
            userId,
            function(data) {
              if (data.status == 'success') {
                this.userDialog = false;
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: data.message
                });
              }
            }.bind(this)
          );
        })
        .catch(() => {});
    },
    // 每页显示
    UserSizeChange(val) {
      this.rows = val;
      this.getuserList();
    },
    // 跳转页数
    UserCurrentChange(val) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.page = val;
      this.getuserList();
    }
  },
  mounted() {
    this.getuserList();
  }
};
</script>
<style scoped>
</style>
