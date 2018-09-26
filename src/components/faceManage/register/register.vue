<style>
#face-register #content {
  margin: 20px;
  background-color: #fff;
  padding: 20px;
}

#face-register #content #top {
  text-align: left;
  line-height: 0;
  padding: 0 0 20px 0;
}

#face-register #content #main .el-table th {
  background-color: #f8f9f9;
}

#face-register #content #main .el-table th,
.el-table tr {
  text-align: left;
}

#face-register #content #main .el-pagination {
  text-align: right;
  margin-top: 20px;
}

/*dialog style*/
#face-register .el-dialog {
  border-radius: 5px;
}

#face-register .el-dialog__title {
  font-size: 16px;
  color: #3c3e4a;
}

#face-register .el-dialog__header {
  text-align: left;
}

#face-register .el-dialog__body {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding-right: 65px;
}

#face-register .el-input-group {
  width: 200px;
  float: right;
}
</style>
<template>
  <div id="face-register">
    <div id="title" class="ContentH4">人脸库注册</div>
    <div id="content" class="faceRegisterCont Content">
      <div id="top">
        <el-button type="primary" size="small" @click="handleAdd">添加人脸库</el-button>
        <el-button size="small" plain @click="handlePatchDelete" :disabled="multipleSelection.length==0">批量删除
        </el-button>
        <el-input placeholder="请输入人脸库名称" v-model="keyword" size="small">
          <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>
        </el-input>
      </div>
      <div id="main">
        <el-table stripe ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="人脸库ID" width="120">
          </el-table-column>
          <el-table-column prop="name" label="人脸库名称" width="120">
          </el-table-column>
          <el-table-column prop="description" label="人脸库描述" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="number" label="人员数量" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-if="userInfo.isAdmin" prop="account" label="创建账号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
              </el-button>
              <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="text" @click="handleManage(scope.$index, scope.row)">管理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="userPage mt-20">
          <span>每页显示</span>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" background>
          </el-pagination>
        </div>
      </div>
    </div>
    <!--添加人脸库-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <el-form :rules="rules" ref="dialogForm" :model="dialogForm" label-width="100px">
          <el-form-item label="人脸库名称" prop="name">
            <el-input v-model="dialogForm.name" size="small" placeholder="长度不大于20个字符"></el-input>
          </el-form-item>
          <el-form-item label="人脸库描述" prop="description">
            <el-input type="textarea" v-model="dialogForm.description" :rows="3" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../../store/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    var checkFaceStoreName = (rule, value, callback) => {
      api.faceStore.checkFaceStoreName(
        { name: value.trim() },
        function(data) {
          if (
            data.result == true &&
            (this.dialogTitle == '添加人脸库' ||
              (this.dialogTitle == '编辑人脸库' &&
                value != this.editFaceStoreName))
          ) {
            callback(new Error('人脸库名称已存在'));
          } else {
            callback();
          }
        }.bind(this)
      );
    };
    var checkSpace = (rule, value, callback) => {
      if (!value || (value && value.trim())) {
        callback();
      } else {
        callback(new Error('不能输入空白字符串'));
      }
    };
    return {
      list: [],
      multipleSelection: [],
      keyword: '',
      /*page*/
      currentPage: 1,
      pageSize: 10,
      total: 0,
      /*dialog*/
      editFaceStoreName: '',
      dialogVisible: false,
      dialogTitle: '',
      dialogForm: {
        name: '',
        resource: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入人脸库名称', trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '人脸库名称不超过20个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' },
          { validator: checkFaceStoreName, trigger: 'change' }
        ],
        description: [
          {
            max: 50,
            message: '人脸库描述长度不超过50个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' }
        ],
        name2: [
          {
            max: 50,
            message: '人脸库描述长度不超过50个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    /*获取人脸库列表*/
    getList() {
      let params = {
        name: this.keyword,
        page: this.currentPage,
        rows: this.pageSize
      };
      api.faceStore.getFaceStores(
        params,
        function(data) {
          this.list = data.result.list;
          this.total = data.result.total;
        }.bind(this)
      );
    },
    /*添加人脸库*/
    handleAdd() {
      this.dialogTitle = '添加人脸库';
      this.dialogVisible = true;
    },
    /*编辑人脸库*/
    handleEdit(index, row) {
      this.dialogTitle = '编辑人脸库';
      this.dialogVisible = true;
      this.editFaceStoreName = row.name;
      this.dialogForm = { ...row };
    },
    /*确认添加/编辑人脸库*/
    submit() {
      this.$refs.dialogForm.validate(
        function(valid) {
          if (valid) {
            let params = {
              description: this.dialogForm.description,
              name: this.dialogForm.name,
              name2: this.dialogForm.name2
            };
            let funName = 'addFaceStore';
            if (this.dialogTitle == '编辑人脸库') {
              funName = 'editFaceStore';
              params.id = this.dialogForm.id;
            }

            api.faceStore[funName](
              params,
              function(data) {
                this.getList();
              }.bind(this)
            );
            this.handleClose();
          } else {
            console.log('error submit!!');
            return false;
          }
        }.bind(this)
      );
    },
    /*删除*/
    deleteFaceStores(ids) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.faceStore.deleteFaceStore(ids, data => {
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          });
        });
    },
    /*批量删除*/
    handlePatchDelete() {
      this.deleteFaceStores(this.multipleSelection);
    },
    /*单项删除*/
    handleDelete(row) {
      this.deleteFaceStores([row.id]);
    },
    /*多选框*/
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(
        function(i) {
          this.multipleSelection.push(i.id);
        }.bind(this)
      );
    },
    handleClose() {
      this.dialogVisible = false;
      this.dialogForm = {
        name: '',
        resource: ''
      };
      this.$refs.dialogForm.resetFields();
    },
    handleManage(index, row) {
      this.$router.push({
        path: '/container/faceManage',
        query: { id: row.id }
      });
    },
    sizeChange(val) {
      (this.pageSize = val), this.getList();
    },
    currentChange() {
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
