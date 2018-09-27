<template>
  <div>
    <h4 class="ContentH4">地点注册</h4>
    <div class="locationCont Content">
      <el-row>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="ServiceDialogClick"> + 添加地点</el-button>
          <el-button size="small" type="primary" @click="ServicebatchDelete" plain :disabled="disabledBtn">批量删除
          </el-button>
        </el-col>
        <el-col :span="5" :offset="15">
          <el-input size="small" v-model="query" @keyup.enter.native="ServiceSearch(query)" placeholder="请输入内容">
            <el-button size="small" slot="append" icon="el-icon-search" @click="ServiceSearch(query)"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="serviceData" tooltip-effect="dark" style="width: 100%;margin-top: 20px" @selection-change="SelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="serviceCaller" label="服务调用方"></el-table-column>
        <el-table-column prop="serviceID" label="服务ID号"></el-table-column>
        <el-table-column prop="applicationDescription" label="应用描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="ServiceEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="ServiceDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="locationPage mt-20" v-if="serviceData.length > 0">
        <span>每页显示</span>
        <el-pagination @size-change="ServiceSizeChange" @current-change="LocationCurrentChange" :current-page.sync="LocationCurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="sizes, prev, pager, next" :total="totals" background>
        </el-pagination>
      </div>
      <!--添加/编辑 服务弹窗-->
      <el-dialog :title="dialogTitle" :visible.sync="serviceDialog" width="460px" @close="closeDialog('serviceRuleForm')" class="DialogForm">
        <el-form :model="serviceRuleForm" :rules="serviceRules" ref="serviceRuleForm" label-width="105px" size="small">
          <el-form-item label="服务ID号 :" prop="serviceID">
            {{newID}}
          </el-form-item>
          <el-form-item label="服务调用方 :" prop="serviceCaller">
            <el-select filterable v-model="serviceRuleForm.serviceCaller" placeholder="人脸识别一体机">
              <el-option v-for="item in callerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用描述 :" prop="applicationDescription">
            <el-input v-model="deviceRuleForm.applicationDescription" placeholder="请输入应用描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" type="primary" :disabled="addBtn" @click="addServiceForm('serviceRuleForm')">确定</el-button>
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
        this.dialogTitle == '添加服务设备' ||
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
      serviceDialog: false,
      newID: '',
      serviceRuleForm: {
        serviceID: ''
      },
      serviceRules: {
        serviceCaller: [
          { required: true, message: '请输入服务调用方', trigger: 'change' },
          { validator: ValidateLocation, trigger: 'change' }
        ],
        applicationDescription: [
          { required: true, message: '请输入应用描述', trigger: 'change' },
          { validator: ValidateLocation, trigger: 'change' }
        ]
      },
      serviceData: [],
      SelectionData: [],
      query: '',
      LocationCurrentPage: 1,
      dialogTitle: '添加地点',
      totals: 0,
      page: 1,
      rows: 10,
      userData: '',
      callerList: ['人脸识别一体机', '手机应用', '第三方系统', '摄像头应用']
    };
  },
  methods: {
    // 获取地点列表
    getserviceList() {
      let params = {
        name: this.query,
        page: this.page,
        rows: this.rows
      };
      api.service.services(
        params,
        function(data) {
          if (data.status == 'success') {
            this.serviceData = data.result.list;
            this.totals = data.result.total;
          }
        }.bind(this)
      );
    },
    // 点击添加服务
    ServiceDialogClick() {
      this.serviceDialog = true;
      this.addBtn = true;
      this.dialogTitle = '添加服务设备';
      this.serviceRuleForm.name = '';
      // 后台自动生成一个ID号，然后获取
    },
    // 添加/编辑 地点
    addServiceForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '添加服务设备') {
            let params = {
              name: this.serviceRuleForm.name
            };
            api.service.addservices(
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getserviceList();
                  this.serviceDialog = false;
                  this.$message({
                    type: 'success',
                    duration: 1000,
                    message: data.message
                  });
                }
              }.bind(this)
            );
          } else if (this.dialogTitle == '信息编辑') {
            let id = this.serviceRuleForm.id;
            let params = {
              name: this.serviceRuleForm.name
            };
            api.device.editservices(
              id,
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getserviceList();
                  this.serviceDialog = false;
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
      this.serviceRuleForm.name = '';
    },
    // 批量删除
    ServicebatchDelete() {
      this.$alert(
        '此操作将永久删除 <span>' +
          this.SelectionData.length +
          '</span> 个服务设备, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = this.SelectionData;
          api.device.batchdelservices(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.serviceData.length > 1) {
                  this.getserviceList();
                } else {
                  this.getserviceList(1, 10);
                }
                this.serviceDialog = false;
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
    ServiceSearch(query) {
      this.query = query;
      this.getserviceList();
    },
    // 点击编辑地点
    ServiceEdit(index, row) {
      this.serviceDialog = true;
      this.dialogTitle = '信息编辑';
      this.serviceRuleForm.name = row.name;
      this.serviceRuleForm.id = row.id;
      this.oldname = row.name;
    },
    // 删除用户
    ServiceDelete(index, row) {
      this.$alert('确定删除此服务设备？', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          let ids = row.id;
          api.device.batchdelservices(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.serviceData.length > 1) {
                  this.serviceData.splice(index, 1);
                } else {
                  this.getserviceList(1, 10);
                }
                this.serviceDialog = false;
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
    ServiceSizeChange(val) {
      this.rows = val;
      this.getserviceList();
    },
    // 跳转页数
    LocationCurrentChange(val) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.page = val;
      this.getserviceList();
    }
  },
  mounted() {
    this.getserviceList();
    // 判断是否是管理员
    this.userData = api.fetchUserInfo().isAdmin;
  }
};
</script>
<style scoped>
</style>
