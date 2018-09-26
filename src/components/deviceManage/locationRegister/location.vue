<template>
  <div>
    <h4 class="ContentH4">地点注册</h4>
    <div class="locationCont Content">
      <el-row>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="LocationdialogClick"> + 添加地点</el-button>
          <el-button size="small" type="primary" @click="LocationbatchDelete" plain :disabled="disabledBtn">批量删除
          </el-button>
        </el-col>
        <el-col :span="5" :offset="15">
          <el-input size="small" v-model="query" @keyup.enter.native="LocationSearch(query)" placeholder="请输入内容">
            <el-button size="small" slot="append" icon="el-icon-search" @click="LocationSearch(query)"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="locationData" tooltip-effect="dark" style="width: 100%;margin-top: 20px" @selection-change="SelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="部署地点"></el-table-column>
        <el-table-column prop="account" label="创建账号" v-if="userData"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="LocationEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="LocationDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="locationPage mt-20" v-if="locationData.length > 0">
        <span>每页显示</span>
        <el-pagination @size-change="LocationSizeChange" @current-change="LocationCurrentChange" :current-page.sync="LocationCurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="sizes, prev, pager, next" :total="totals" background>
        </el-pagination>
      </div>
      <!--添加/编辑 地点弹窗-->
      <el-dialog :title="dialogTitle" :visible.sync="locationDialog" width="460px" @close="closeDialog('locationRuleForm')" class="DialogForm">
        <el-form :model="locationRuleForm" :rules="locationRules" ref="locationRuleForm" label-width="105px" size="small">
          <el-form-item label="地点名称 :" prop="name">
            <el-input v-model="locationRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" type="primary" :disabled="addBtn" @click="addLocationForm('locationRuleForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '../../../store/api';

export default {
  data() {
    const ValidateLocation = (rule, value, callback) => {
      // 地点名称重复检测
      if (!/^[\u4E00-\u9FA5A-Za-z0-9_]{1,30}$/.test(value)) {
        this.addBtn = true;
        callback(new Error('仅支持中文、英文、数字及下划线，1~30位'));
      } else if (
        this.dialogTitle == '添加地点' ||
        this.dialogTitle == '编辑地点'
      ) {
        if (this.oldname !== value) {
          let params = {
            name: value
          };
          api.device.positionExist(
            params,
            function(data) {
              if (data.status == 'success') {
                if (data.result) {
                  this.addBtn = true;
                  callback(new Error('地址名称重复'));
                } else {
                  this.addBtn = false;
                }
                callback();
              }
            }.bind(this)
          );
        } else {
          this.addBtn = false;
        }
      } else {
        callback();
      }
    };
    return {
      disabledBtn: true,
      addBtn: true,
      locationDialog: false,
      locationRuleForm: {
        name: ''
      },
      locationRules: {
        name: [
          { required: true, message: '请输入地点名称', trigger: 'change' },
          { validator: ValidateLocation, trigger: 'change' }
        ]
      },
      locationData: [],
      SelectionData: [],
      query: '',
      LocationCurrentPage: 1,
      dialogTitle: '添加地点',
      totals: 0,
      page: 1,
      rows: 10,
      userData: ''
    };
  },
  methods: {
    // 获取地点列表
    getlocationList() {
      let params = {
        name: this.query,
        page: this.page,
        rows: this.rows
      };
      api.device.positions(
        params,
        function(data) {
          if (data.status == 'success') {
            this.locationData = data.result.list;
            this.totals = data.result.total;
          }
        }.bind(this)
      );
    },
    // 点击添加地点
    LocationdialogClick() {
      this.locationDialog = true;
      this.addBtn = true;
      this.dialogTitle = '添加地点';
      this.locationRuleForm.name = '';
    },
    // 添加/编辑 地点
    addLocationForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '添加地点') {
            let params = {
              name: this.locationRuleForm.name
            };
            api.device.addpositions(
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getlocationList();
                  this.locationDialog = false;
                  this.$message({
                    type: 'success',
                    duration: 1000,
                    message: data.message
                  });
                }
              }.bind(this)
            );
          } else if (this.dialogTitle == '编辑地点') {
            let id = this.locationRuleForm.id;
            let params = {
              name: this.locationRuleForm.name
            };
            api.device.editpositions(
              id,
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getlocationList();
                  this.locationDialog = false;
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
      this.locationRuleForm.name = '';
    },
    // 批量删除
    LocationbatchDelete() {
      this.$alert(
        '此操作将永久删除 <span>' +
          this.SelectionData.length +
          '</span> 个部署地点, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = this.SelectionData;
          api.device.batchdelpositions(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.locationData.length > 1) {
                  this.getlocationList();
                } else {
                  this.getlocationList(1, 10);
                }
                this.locationDialog = false;
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
    // 搜索地点
    LocationSearch(query) {
      this.query = query;
      this.getlocationList();
    },
    // 点击编辑地点
    LocationEdit(index, row) {
      this.locationDialog = true;
      this.dialogTitle = '编辑地点';
      this.locationRuleForm.name = row.name;
      this.locationRuleForm.id = row.id;
      this.oldname = row.name;
    },
    // 删除用户
    LocationDelete(index, row) {
      this.$alert(
        '此操作将永久删除 <span>' + row.name + '</span> 该部署地点, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = row.id;
          api.device.batchdelpositions(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.locationData.length > 1) {
                  this.locationData.splice(index, 1);
                } else {
                  this.getlocationList(1, 10);
                }
                this.locationDialog = false;
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
    LocationSizeChange(val) {
      this.rows = val;
      this.getlocationList();
    },
    // 跳转页数
    LocationCurrentChange(val) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.page = val;
      this.getlocationList();
    }
  },
  mounted() {
    this.getlocationList();
    // 判断是否是管理员
    this.userData = api.fetchUserInfo().isAdmin;
  }
};
</script>
<style scoped>
</style>
