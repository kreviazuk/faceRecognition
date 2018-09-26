<style>
  #process #content{
    margin:20px;
    background-color: #fff;
    padding: 20px;
  }
  #process #content #top{
    text-align: left;
    line-height: 0;
    padding: 0 0 20px 0;
  }
  #process #content #main .el-table th{
    background-color: #f8f9f9;
  }
  #process #content #main .el-table th, .el-table tr {
    text-align: left;
  }
  #process #content #main .el-pagination{
    text-align: right;
    margin-top: 20px;
  }
  #process>#content>#top .el-date-editor--daterange.el-input,
  #process>#content>#top .el-date-editor--daterange.el-input__inner{
    width: 250px;
    float: right;
  }
  #process #content #main .status:before{
    display: inline-block;
    content: ' ';
    width: 8px;
    height: 8px;
    border-radius: 5px;
    margin-right: 5px;
  }
  #process #content #main .status.success:before{
    background-color: #5DC560;;
  }
  #process #content #main .status.error:before{
    background-color: #F04134;
  }
  #process #content #main .status.process:before{
    background-color: #FFBB03;
  }
</style>
<template>
  <div id="process">
    <div id="title" class="ContentH4">注册进度查询</div>
    <div id="content" class="faceRegisterCont Content">
      <div id="top">
        <el-button type="primary" size="small" @click="handleBatchDelete" :disabled="multipleSelection.length==0">批量删除</el-button>
        <el-date-picker
          v-model="dataRange"
          type="daterange"
          size="small"
          @change="changeDatePicker"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div id="main">
        <el-table
          stripe
          ref="multipleTable"
          :data="list"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="操作时间"
            prop="createTime"
            width="180">
          </el-table-column>
          <el-table-column
            prop="faceStoreName"
            label="导入的人脸库"
            width="120">
          </el-table-column>
          <el-table-column
            prop="excelFilename"
            label="excel文件名"
            width="120">
          </el-table-column>
          <el-table-column
            label="处理进度"
            width="200">
            <template slot-scope="scope">
              <el-progress :percentage="parseInt(scope.row.progress)" color="#5DC560"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            label="处理结果">
            <template slot-scope="scope">
              <span class="status"
                    :class="{'success': scope.row.status==2,
              'error': scope.row.status==3,
              'process': scope.row.status==1}">{{mapStatus[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="account"
            label="创建账号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-show="scope.row.status==3"
                size="mini"
                type="text"
                @click="handleExportError(scope.row)">导出错误部分</el-button>
              <el-button
                type="text"
                size="mini"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="userPage mt-20">
          <span>每页显示</span>
          <el-pagination @size-change="sizeChange"
                         :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                         layout="sizes, prev, pager, next" :total="total" background>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../../store/api'
  export default{
    data() {
      return {
        dataRange: '',
        list: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize: 10,
        total: 10,
        mapStatus: {
          1: '处理中',
          2: '注册成功',
          3: '注册失败',
          0: '删除',
        },
        interval: ''
      }
    },
    methods: {
      /*获取列表*/
      getList(){
        let params = {
          startDate: this.dataRange[0],
          endDate: this.dataRange[1],
          page: this.currentPage,
          rows: this.pageSize
        };
        api.faceStore.getRegisterProcess(params, function (data) {
          this.list = data.result.list;
        }.bind(this))
      },

      /*删除*/
      handleBatchDelete(){
        this.deleteRegisterProcess(this.multipleSelection)
      },
      handleDelete(row){
        this.deleteRegisterProcess([row.id])
      },
      handleSelectionChange(val) {
        this.multipleSelection = [];
        val.forEach(function (val) {
          this.multipleSelection.push(val.id);
        }.bind(this));
      },
      deleteRegisterProcess(ids){
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.faceStore.deleteRegisterProcess(ids, function (data) {
            this.getList();
          }.bind(this));
        }).catch(() => {
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          });
        });
      },
      handleExportError(row){
        api.faceStore.exportErrorRegisterProcess(row.id, function (data) {

        })
      },
      changeDatePicker(val){
        this.dataRange = val;
        this.getList()
      },
      sizeChange(val){
        this.pageSize =val;
        this.getList()
      }
    },
    mounted(){
      this.getList();
      this.interval = setInterval(() => {
        this.getList()
      }, 30000)
    },
    beforeDestroy(){
      window.clearInterval(this.interval)
    }
  }
</script>
