<style>
#face-manage #title .el-button--text {
  font-size: 16px;
}
#face-manage #content {
  margin: 20px;
  background-color: #fff;
  padding: 20px;
}
#face-manage #content #top {
  text-align: left;
  line-height: 0;
  padding: 0 0 20px 0;
}
#face-manage #content #main .el-table th {
  background-color: #f8f9f9;
}
#face-manage #content #main .el-table th,
.el-table tr {
  text-align: left;
}
#face-manage #content #main .el-pagination {
  text-align: right;
  margin-top: 20px;
}
/*dialog style*/
#face-manage .el-dialog {
  border-radius: 5px;
}
#face-manage .el-dialog__title {
  font-size: 16px;
  color: #3c3e4a;
}
#face-manage .el-dialog__header {
  text-align: left;
}
#face-manage .el-dialog__body {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding-right: 65px;
}
#face-manage .el-input-group {
  width: 200px;
  float: right;
}
#face-manage #export-body {
  text-align: left;
}
#face-manage #export-body .title {
  margin-bottom: 15px;
}
#face-manage #export-body .title > span {
  font-size: 16px;
  color: #3c3e4a;
  line-height: 18px;
}
#face-manage .title .el-button {
  float: right;
}
#face-manage #export-body .pic-content:hover {
  border: 1px dashed #409eff;
}
#face-manage #export-body .pic-content {
  border: 1px dashed #e5e5e5;
  border-radius: 5px;
}
#face-manage .pic-content {
  padding-top: 18px;
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  line-height: 5px;
}
#face-manage .pic-content div {
  font-size: 12px;
  color: #2c9cfa;
  height: 17px;
  line-height: 25px;
}
#face-manage .import-dialog .describe {
  font-size: 14px;
  color: #cccccc;
  display: inline-block;
  width: 230px;
  padding-left: 0px;
  vertical-align: top;
}
#face-manage .el-upload--picture-card,
#face-manage .el-upload-list--picture-card .el-upload-list__item {
  width: 70px;
  height: 70px;
  line-height: 5px;
}
#face-manage .el-form-item__content {
  text-align: left;
  line-height: 0;
}
#face-manage .add-face-dialog .describe {
  font-size: 14px;
  color: #cccccc;
  height: 20px;
  line-height: 20px;
}
#face-manage .upload {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  line-height: 0;
}
#face-manage .el-upload-list__item-name {
  white-space: pre-wrap;
}
#face-manage .image-container {
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  display: inline-block;
  width: 70px;
  height: 70px;
  margin-left: 5px;
  margin-right: 5px;
  position: relative;
  cursor: pointer;
}
#face-manage .image-container .image-operate {
  display: none;
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  width: 70px;
  height: 70px;
}
#face-manage .image-container .image-operate .cover {
  color: #fff;
  font-size: 12px;
}
#face-manage .image-container .image-operate .delete {
  color: #2c9cfa;
  font-size: 12px;
}
#face-manage .image-container .cover-image {
  background-color: #5dc560;
  color: #fff;
  font-size: 12px;
  position: absolute;
  width: 70px;
  bottom: -2px;
  text-align: center;
}
#face-manage .image-container:hover .image-operate {
  display: inline-block;
}
</style>
<template>
  <div id="face-manage">
    <div id="title" class="ContentH4">
      <el-button type="text" @click="handleRegister">人脸库注册</el-button>/访问人脸库管理
    </div>
    <div id="content" class="faceRegisterCont Content">
      <div id="top">
        <el-button type="primary" size="small" @click="handleAdd">添加人脸</el-button>
        <el-button type="primary" size="small" plain @click="handleExport">批量导入</el-button>
        <el-button size="small" @click="handleBatchDelete" :disabled="multipleSelection.length==0">批量删除</el-button>
        <el-input placeholder="请输入人脸名称" v-model="keyword" size="small">
          <el-button slot="append" icon="el-icon-search" @click="getFacesList"></el-button>
        </el-input>
      </div>
      <div id="main">
        <el-table stripe :data="faceList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="姓名" prop="name" width="120"></el-table-column>
          <el-table-column prop="department" label="工作单位" width="150"></el-table-column>
          <el-table-column prop="code" label="ID" width="120">
          </el-table-column>
          <el-table-column prop="imageUrls" label="底库照片">
            <template slot-scope="scope">
              <div class="image-container" v-for="i in scope.row.images">
                <img style="width: 70px; height: 70px" :src="i.url" @error="errorImageList(i)">
                <div class="cover-image" v-show="i.isCover">封面照</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="text" size="mini" @click="handleEditInfo(scope.row)">编辑人脸</el-button>
              <el-button type="text" size="mini" @click="handleEditPicture(scope.row)">编辑照片</el-button>
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
    <!--添加/编辑人脸-->
    <el-dialog class="add-face-dialog" :title="dialogTitle" :visible.sync="dialogVisible" width="615px" :before-close="resetFaceForm">
      <div>
        <el-form ref="faceForm" :model="faceForm" label-width="100px" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="faceForm.name" size="small" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="工作单位" prop="department">
            <el-input v-model="faceForm.department" size="small" placeholder="请输入工作单位"></el-input>
          </el-form-item>
          <el-form-item label="ID" prop="code">
            <el-input v-model="faceForm.code" size="small" placeholder="请输入ID号码"></el-input>
          </el-form-item>
          <el-form-item label="自定义信息" prop="extraInfo">
            <el-input v-model="faceForm.extraInfo" size="small" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFaceInfo" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量导入人脸信息-->
    <el-dialog class="import-dialog" title="批量导入人脸信息" :visible.sync="dialogExportVisible" width="500px">
      <div id="export-body">
        <div class="title">
          <span>人脸信息和照片文件</span>
          <el-button size="mini" type="primary" plain title="下载样例" @click="downloadExample">下载样例</el-button>
        </div>
        <el-upload v-if="dialogExportVisible" class="upload" :on-change="handleChange" :action="root+'/api/facestores/uploadBatch'" ref="upload7z" list-type="text" :headers="headers" :on-success="successUploadBatch" :data="imageUploadParams" :before-upload="beforeAvatarUploadBatch" name="zFile" :auto-upload="true">
          <div class="pic-content">
            <img src="../../../assets/imgs/7zip.png" style="height: 27px; width: 27px">
            <div id="excel-file">上传压缩包</div>
          </div>
        </el-upload>
        <span class="describe">
          压缩包中包含，一个文件格式为excel存储人脸信息，和一组的照片文件
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleExportClose" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!--添加/编辑人脸照片-->
    <el-dialog class="add-pic-dialog" :title="dialogPicTitle" :visible.sync="dialogPicVisible" width="615px" :before-close="handlePicClose">
      <div>
        <div class="image-container" v-for="item in imageList">
          <div class="image-operate">
            <div class="cover" @click="setCoverImage(item)">设为封面照</div>
            <div class="delete" @click="deleteImage(item)">删除</div>
          </div>
          <img style="width: 70px; height: 70px" :src="item.url" @error="setImageError(item)">
          <div class="cover-image" v-show="item.isCover">封面照</div>
        </div>
        <el-upload v-show="imageList.length<6" class="upload" :action="root+'/api/faces/imageUpload'" :headers="headers" list-type="picture-card" :before-upload="beforeAvatarUpload" :data="imageUploadParams" :multiple="false" :auto-upload="true" :on-success="onSuccess" :show-file-list="false" name="image">
          <div class="pic-content">
            <img src="../../../assets/imgs/照片上传.svg">
            <div>上传照片</div>
          </div>
        </el-upload>
        <div class="describe">最多可上传6张，只能上传jpg、jpeg，图片大小限制在2M以内</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handlePicClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../../store/api';
import { mapGetters } from 'vuex';
// import $ from 'jquery';
import { env } from '../../../config/env';
import defaultImg from '../../../assets/imgs/default.svg';
export default {
  data() {
    var checkFaceCode = (rule, value, callback) => {
      let params = {
        code: value,
        faceStoreId: this.faceStoreId
      };
      api.face.checkFaceCode(
        params,
        function(data) {
          if (
            data.result == true &&
            (this.dialogTitle == '添加人脸' ||
              (this.editFaceCode != value && this.dialogTitle == '编辑人脸'))
          ) {
            callback(new Error('人脸ID已存在'));
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
      faceStoreId: '',
      faceList: [],
      keyword: '',
      multipleSelection: [],
      /*page*/
      currentPage: 1,
      pageSize: 10,
      total: 0,
      /*face-dialog*/
      editFaceCode: '',
      dialogTitle: '',
      dialogVisible: false,
      faceForm: {
        name: '',
        code: '',
        department: ''
      },
      /*picture-dialog*/
      dialogPicTitle: '',
      dialogPicVisible: false,
      imageUploadParams: {},
      imageList: [],

      /*import-dialog*/
      dialogExportVisible: false,

      /*添加人脸*/
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 1,
            max: 10,
            message: '用户名长度不超过10个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' }
        ],
        department: [
          { required: true, message: '请输入工作单位', trigger: 'change' },
          {
            min: 1,
            max: 30,
            message: '工作单位长度不超过30个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入ID', trigger: 'change' },
          {
            min: 1,
            max: 50,
            message: 'ID长度不超过50个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' },
          { validator: checkFaceCode, trigger: 'change' }
        ],
        extraInfo: [
          {
            max: 1000,
            message: '自定义信息长度不超过1000个字符',
            trigger: 'change'
          },
          { validator: checkSpace, trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    root: function() {
      return env.root;
    },
    headers: function() {
      return {
        Authorization: 'Bearer ' + this.userInfo.token
      };
    }
  },
  methods: {
    /*获取人脸列表*/
    getFacesList() {
      let params = {
        faceStoreId: this.faceStoreId,
        page: this.currentPage,
        rows: this.pageSize
      };
      this.keyword ? (params.name = this.keyword) : '';
      api.face.getFaceList(
        params,
        function(data) {
          this.faceList = data.result.list;
          this.total = data.result.total;
        }.bind(this)
      );
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getFacesList();
    },
    currentChange() {
      this.getFacesList();
    },
    // 图片上传触发
    handleChange() {},
    /*删除人脸*/
    deleteFaces(deleteIds) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.face.deleteFaces(
            deleteIds,
            function(data) {
              this.getFacesList();
            }.bind(this)
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          });
        });
    },
    handleDelete(row) {
      this.deleteFaces([row.id]);
    },
    handleBatchDelete() {
      this.deleteFaces(this.multipleSelection);
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(
        function(val) {
          this.multipleSelection.push(val.id);
        }.bind(this)
      );
    },
    /*添加人脸弹窗*/
    handleAdd() {
      this.dialogTitle = '添加人脸';
      this.dialogVisible = true;
      this.faceForm = {
        name: '',
        code: '',
        department: ''
      };
    },
    /*编辑人脸弹窗*/
    handleEditInfo(row) {
      this.dialogTitle = '编辑人脸';
      this.dialogVisible = true;
      this.editFaceCode = row.code;
      this.faceForm = { ...row };
    },
    /*确认添加/编辑人脸*/
    submitFaceInfo() {
      this.$refs.faceForm.validate(
        function(valid) {
          if (valid) {
            let params = {
              code: this.faceForm.code,
              department: this.faceForm.department,
              faceStoreId: this.faceStoreId,
              name: this.faceForm.name,
              extraInfo: this.faceForm.extraInfo
            };
            let funName = 'addFaceInfo';
            let txt = '添加';
            if (this.dialogTitle == '编辑人脸') {
              funName = 'editFace';
              params.id = this.faceForm.id;
              txt = '编辑';
            }
            api.face[funName](
              params,
              function(data) {
                this.getFacesList();
                this.dialogVisible = false;
                if (this.dialogTitle == '添加人脸') {
                  this.$confirm('是否继续' + txt + '人脸照片?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                    .then(() => {
                      this.resetFaceForm();
                      this.handleEditPicture(data.result);
                    })
                    .catch(() => {
                      this.resetFaceForm();
                    });
                }
              }.bind(this)
            );
          } else {
            return false;
          }
        }.bind(this)
      );
    },
    resetFaceForm() {
      this.faceForm = {
        name: '',
        code: '',
        department: ''
      };
      this.dialogVisible = false;
      this.$refs.faceForm.resetFields();
    },
    handleExport() {
      this.dialogExportVisible = true;
      this.imageUploadParams = {
        faceStoreId: this.faceStoreId
      };
    },
    handleRegister() {
      this.$router.push({ path: '/container/faceRegister' });
    },
    /********添加图片相关方法*************/
    errorImageList(e) {
      setTimeout(
        function() {
          let index = e.url.split('=')[1];
          if (index == undefined) {
            e.url = e.url + '?timestemp=10';
          } else if (parseInt(index) > 0) {
            e.url = e.url.split('?')[0] + '?timestemp=' + (parseInt(index) - 1);
          } else {
            e.url = defaultImg;
          }
        }.bind(this),
        1000
      );
    },
    setImageError(e) {
      return (e.url = e.url2);
    },
    handlePicClose() {
      this.dialogPicVisible = false;
      this.getFacesList();
    },
    handleEditPicture(row) {
      this.dialogPicTitle = '编辑人脸照片';
      this.dialogPicVisible = true;
      this.imageList = row.images ? [...row.images] : [];
      this.faceForm = { ...row };
      this.imageUploadParams = {
        faceId: row.id,
        faceStoreId: this.faceStoreId
      };
    },
    /*设置封面照*/
    setCoverImage(val) {
      let params = {
        faceId: this.faceForm.id,
        imageId: val.id
      };
      api.face.setCoverPicture(
        params,
        function(data) {
          if (data.code == 200) {
            this.imageList.forEach(
              function(item, index) {
                if (item.id == params.imageId) {
                  this.imageList[index].isCover = true;
                } else {
                  this.imageList[index].isCover = false;
                }
              }.bind(this)
            );
            this.imageList = [...this.imageList];
          }
        }.bind(this)
      );
    },
    /*删除*/
    deleteImage(val) {
      api.face.deleteFacePicture(
        val.id,
        function(data) {
          if (data.code == 200) {
            let array = this.imageList.filter(function(item) {
              return item.id != val.id;
            });
            this.imageList = [...array];
          }
        }.bind(this)
      );
    },
    /*上传成功*/
    onSuccess(response, file, fileList) {
      if (response.code != 200) {
        this.$message.error(response.message);
      } else {
        this.imageList.push({ ...response.result, url2: file.url });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('只能上传jpg、jpeg!');
      }
      if (file.size > 2097152) {
        this.$message.error('图片大小限制在2M以内');
        return false;
      }
      return !!isJPG;
    },

    /************批量导入人脸信息相关方法************************/
    downloadExample() {
      window.location.href = env.root + '/demo.7z';
    },
    beforeAvatarUploadBatch(file) {
      if (!file.name.endsWith('.7z')) {
        this.$message.error('请上传7z文件类型的压缩包');
        return false;
      }
      if (file.size > 1073741824) {
        this.$message.error('文件大小不能超过1G');
        return false;
      }
    },
    // 如果导入的人脸信息已经存在，则显示错误
    successUploadBatch(response, file, fileList) {
      if (response.code != 200) {
        this.$message.error(response.message);
      } else {
        this.$message({
          message: response.message,
          duration: 1000,
          type: 'success'
        });
      }
    },
    handleExportClose() {
      this.dialogExportVisible = false;
      this.getFacesList();
    }
  },
  mounted() {
    this.faceStoreId = this.$route.query.id;
    this.getFacesList();
  }
};
</script>
