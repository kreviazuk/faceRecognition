<template>
  <div>
    <h4 class="ContentH4">设备注册</h4>
    <div class="deviceCont Content">
      <el-row>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="DevicedialogClick"> + 添加设备</el-button>
          <el-button size="small" type="primary" @click="DevicebatchDelete" plain :disabled="disabledBtn">批量删除
          </el-button>
        </el-col>
        <el-col :span="2" :offset="13" id="currentTotalDevice">
          <span>当前设备数量：{{this.totals}}</span>
        </el-col>
        <el-col :span="5">
          <el-input size="small" v-model="query" @keyup.enter.native="DeviceSearch(query)" placeholder="请输入内容">
            <el-button size="small" slot="append" icon="el-icon-search" @click="DeviceSearch(query)"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="deviceData" tooltip-effect="dark" style="width: 100%;margin-top: 20px" @selection-change="SelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="type" label="设备类型">
          <template slot-scope="scope">
            {{scope.row.type == 1 ? '摄像头' : scope.row.type == 2 ? '门禁' : '其他类型'}}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="设备编码"></el-table-column>
        <el-table-column prop="position" label="设备地点"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <i :class="scope.row.status == 1 ? 'success-status' : 'error-status'"></i>{{scope.row.status == 1 ? '在线' : '不在线'}}
          </template>
        </el-table-column>
        <el-table-column prop="faceMatchThreshold" label="比对阈值"></el-table-column>
        <el-table-column prop="faceStoreDOList" label="比对人脸库" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="item in scope.row.faceStoreDOList">
              {{item.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="account" label="创建账号" v-if="userData"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="DeviceEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="DeviceDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="devicePage mt-20" v-if="deviceData.length > 0">
        <span>每页显示</span>
        <el-pagination @size-change="DeviceSizeChange" @current-change="DeviceCurrentChange" :current-page.sync="DeviceCurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="sizes, prev, pager, next" :total="totals" background>
        </el-pagination>
      </div>
      <!--添加/编辑 设备弹窗-->
      <el-dialog :title="dialogTitle" :visible.sync="deviceDialog" width="460px" @close="closeDialog('deviceRuleForm')" v-if="deviceDialog" class="DialogForm">
        <el-form :model="deviceRuleForm" :rules="deviceRules" ref="deviceRuleForm" label-width="105px" size="small">
          <el-form-item label="设备名称 :" prop="name">
            <el-input v-model="deviceRuleForm.name" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备编码 :" prop="code">
            <el-input v-model="deviceRuleForm.code" placeholder="请输入设备编码"></el-input>
          </el-form-item>
          <el-form-item label="设备地点 :" prop="positionId">
            <el-select filterable v-model="deviceRuleForm.positionId" placeholder="请选择设备地点">
              <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型 :" prop="type">
            <el-select v-model="deviceRuleForm.type" placeholder="请选择设备类型">
              <el-option label="摄像头" value="1"></el-option>
              <el-option label="门禁" value="2"></el-option>
              <el-option label="其它类型" value="10"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比对人脸库 :" prop="faceStoreList">
            <el-select multiple filterable v-model="deviceRuleForm.faceStoreList" placeholder="请选择比对人脸库">
              <el-option v-for="item in faceStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比对阈值 :" prop="faceMatchThreshold">
            <el-input v-model="deviceRuleForm.faceMatchThreshold" placeholder="请输入比对阈值"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" type="primary" @click="addDeviceForm('deviceRuleForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '../../../store/api';

export default {
  data() {
    const ValidateName = (rule, value, callback) => {
      // 设备名称重复检测
      if (!/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value)) {
        callback(new Error('仅支持中文、英文、数字及下划线，1~20位'));
      } else if (
        this.dialogTitle == '添加设备' ||
        this.dialogTitle == '编辑设备'
      ) {
        if (this.oldname !== value) {
          let params = {
            name: value
          };
          api.device.deviceExist(
            params,
            function(data) {
              if (data.status == 'success') {
                if (data.result) {
                  callback(new Error('设备名称重复'));
                }
                callback();
              }
            }.bind(this)
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const ValidateCode = (rule, value, callback) => {
      // 设备编码重复检测
      if (!/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value)) {
        callback(new Error('仅支持中文、英文、数字及下划线，1~20位'));
      } else if (
        this.dialogTitle == '添加设备' ||
        this.dialogTitle == '编辑设备'
      ) {
        if (this.oldcode !== value) {
          let params = {
            code: value
          };
          api.device.deviceExist(
            params,
            function(data) {
              if (data.status == 'success') {
                if (data.result) {
                  callback(new Error('设备编码重复'));
                }
                callback();
              }
            }.bind(this)
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const ValidateThreshold = (rule, value, callback) => {
      if (/^[01](\.\d{0,2})?$/.test(value) || value == 2) {
        callback();
      } else {
        callback(new Error('阈值位0-2之间的小数（不超过两位小数）'));
      }
    };
    return {
      disabledBtn: true,
      deviceDialog: false,
      deviceRuleForm: {
        name: '',
        code: '',
        positionId: '',
        type: '',
        faceStoreList: [],
        faceMatchThreshold: ''
      },
      deviceRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { validator: ValidateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入设备编码', trigger: 'blur' },
          { validator: ValidateCode, trigger: 'blur' }
        ],
        positionId: [
          { required: true, message: '请选择设备地点', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        faceStoreList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个人脸库',
            trigger: 'change'
          }
        ],
        faceMatchThreshold: [
          { required: true, message: '请输入比对阈值', trigger: 'blur' },
          { validator: ValidateThreshold, trigger: 'blur' }
        ]
      },
      deviceData: [],
      SelectionData: [],
      query: '',
      DeviceCurrentPage: 1,
      dialogTitle: '添加设备',
      totals: 0,
      page: 1,
      rows: 10,
      positionList: [],
      faceStoreList: [],
      userData: ''
    };
  },
  methods: {
    // 获取设备列表
    getdeviceList() {
      let params = {
        name: this.query,
        page: this.page,
        rows: this.rows
      };
      api.device.devices(
        params,
        function(data) {
          if (data.status == 'success') {
            this.deviceData = data.result.list;
            this.totals = data.result.total;
            console.log(this.totals);
          }
        }.bind(this)
      );
    },
    // 点击添加设备
    DevicedialogClick() {
      this.deviceDialog = true;
      this.dialogTitle = '添加设备';
      this.deviceRuleForm.name = '';
      this.deviceRuleForm.code = '';
      this.deviceRuleForm.positionId = '';
      this.deviceRuleForm.type = '';
      this.deviceRuleForm.faceStoreList = [];
      this.deviceRuleForm.faceMatchThreshold = '0.92';
    },
    // 添加/编辑 设备
    addDeviceForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '添加设备') {
            let params = {
              name: this.deviceRuleForm.name,
              code: this.deviceRuleForm.code,
              positionId: this.deviceRuleForm.positionId,
              type: this.deviceRuleForm.type,
              faceStoreList: this.deviceRuleForm.faceStoreList,
              faceMatchThreshold: this.deviceRuleForm.faceMatchThreshold
            };
            api.device.adddevices(
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getdeviceList();
                  this.deviceDialog = false;
                  this.$message({
                    type: 'success',
                    duration: 1000,
                    message: data.message
                  });
                }
              }.bind(this)
            );
          } else if (this.dialogTitle == '编辑设备') {
            let id = this.deviceRuleForm.id;
            let params = {
              name: this.deviceRuleForm.name,
              code: this.deviceRuleForm.code,
              positionId: this.deviceRuleForm.positionId,
              type: this.deviceRuleForm.type,
              faceStoreList: this.deviceRuleForm.faceStoreList,
              faceMatchThreshold: this.deviceRuleForm.faceMatchThreshold
            };
            api.device.editdevices(
              id,
              params,
              function(data) {
                if (data.status == 'success') {
                  this.getdeviceList();
                  this.deviceDialog = false;
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
      this.deviceDialog = false;
      this.deviceRuleForm.name = '';
      this.deviceRuleForm.code = '';
      this.deviceRuleForm.positionId = '';
      this.deviceRuleForm.type = '';
      this.deviceRuleForm.faceStoreList = [];
      this.deviceRuleForm.faceMatchThreshold = '';
      this.$refs[formName].resetFields();
    },
    // 批量删除
    DevicebatchDelete() {
      this.$alert(
        '此操作将永久删除 <span>' +
          this.SelectionData.length +
          '</span> 个设备名称, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = this.SelectionData;
          api.device.batchdeldevices(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.deviceData.length > 1) {
                  this.getdeviceList();
                } else {
                  this.getdeviceList(1, 10);
                }
                this.deviceDialog = false;
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
    // 搜索设备
    DeviceSearch(query) {
      this.query = query;
      this.getdeviceList();
    },
    // 编辑设备
    DeviceEdit(index, row) {
      this.deviceDialog = true;
      this.dialogTitle = '编辑设备';
      this.deviceRuleForm.id = row.id;
      this.deviceRuleForm.name = row.name;
      this.deviceRuleForm.code = row.code;
      this.deviceRuleForm.positionId = row.positionId;
      this.deviceRuleForm.type = row.type;
      this.deviceRuleForm.faceMatchThreshold = row.faceMatchThreshold;
      let checkedIds = [];
      row.faceStoreDOList.forEach(function(key, item) {
        return (checkedIds[item] = key.id);
      });
      this.deviceRuleForm.faceStoreList = checkedIds;
      this.oldname = row.name;
      this.oldcode = row.code;
    },
    // 删除设备
    DeviceDelete(index, row) {
      this.$alert(
        '此操作将永久删除 <span>' + row.name + '</span> 该设备名称, 是否继续?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let ids = row.id;
          api.device.batchdeldevices(
            ids,
            function(data) {
              if (data.status == 'success') {
                if (this.deviceData.length > 1) {
                  this.deviceData.splice(index, 1);
                } else {
                  this.getdeviceList(1, 10);
                }
                this.deviceDialog = false;
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
    DeviceSizeChange(val) {
      this.rows = val;
      this.getdeviceList();
    },
    // 跳转页数
    DeviceCurrentChange(val) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.page = val;
      this.getdeviceList();
    },
    // 添加设备获取地点接口
    getPositionForDevice() {
      api.device.getPositionForDevice(
        function(data) {
          if (data.status == 'success') {
            this.positionList = data.result.list;
            if (data.result.list.length == 0) {
              this.$message({
                type: 'error',
                duration: 1000,
                message: '请先添加设备地点后再操作!'
              });
            }
          }
        }.bind(this)
      );
    },
    // 添加设备获取人脸库接口
    getFaceStoreForDevice() {
      api.device.getFaceStoreForDevice(
        function(data) {
          if (data.status == 'success') {
            this.faceStoreList = data.result.list;
            if (data.result.list.length == 0) {
              this.$message({
                type: 'error',
                duration: 1000,
                message: '请先添加人脸库后再操作!'
              });
            }
          }
        }.bind(this)
      );
    }
  },
  mounted() {
    this.getdeviceList();
    // 判断是否是管理员
    this.userData = api.fetchUserInfo().isAdmin;
    this.getPositionForDevice();
    this.getFaceStoreForDevice();
  }
};
</script>
<style scoped>
#currentTotalDevice {
  margin-top: 6px;
}
</style>
