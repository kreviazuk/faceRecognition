<template>
  <div class="logCont Content">
    <el-form :model="logRuleForm" ref="logRuleForm" size="small" label-width="80px">
      <el-row>
        <el-col :span="22" class="logSelect">
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备地点 :">
                <el-select v-model="logRuleForm.positionId" filterable placeholder="请选择设备地点">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备名称 :">
                <el-select v-model="logRuleForm.deviceId" filterable placeholder="请选择设备名称">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="比对类型 :">
                <el-select v-model="logRuleForm.matchType" filterable placeholder="请选择比对类型">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="1 : 1" value="1"></el-option>
                  <el-option label="1 : N" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="比对结果 :">
                <el-select v-model="logRuleForm.matchResult" filterable placeholder="请选择比对结果">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="匹配成功" value="1" v-if="logRuleForm.matchType != 1"></el-option>
                  <el-option label="未匹配到" value="2" v-if="logRuleForm.matchType != 1"></el-option>
                  <el-option label="为同一个人" value="3" v-if="logRuleForm.matchType != 2"></el-option>
                  <el-option label="非同一个人" value="4" v-if="logRuleForm.matchType != 2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="pt-20" v-if="userData">
              <el-form-item label="用户账号 :">
                <el-select v-model="logRuleForm.account" filterable placeholder="请选择用户账号">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in userList" :key="item.id" :label="item.account" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="pt-20">
              <el-form-item label="姓名 :">
                <el-input v-model="logRuleForm.faceName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="pt-20">
              <el-form-item label="时间范围 :">
                <el-date-picker v-model="logRuleForm.dateTime" type="daterange" align="center" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2" class="mt-20">
          <el-form-item>
            <el-button type="primary" @click="getlogSearch('logRuleForm')">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="logData" tooltip-effect="dark" style="width: 100%;margin-top: 20px">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="fiName" label="姓名"></el-table-column>
      <el-table-column prop="department" label="工作单位"></el-table-column>
      <el-table-column prop="code" label="ID"></el-table-column>
      <el-table-column prop="dname" label="设备名称"></el-table-column>
      <el-table-column prop="account" label="创建账号" v-if="userData"></el-table-column>
      <el-table-column prop="pname" label="设备地点"></el-table-column>
      <el-table-column prop="matchType" label="比对类型">
        <template slot-scope="scope">
          {{scope.row.matchType == 1 ? '1 : 1' : '1 : N'}}
        </template>
      </el-table-column>
      <el-table-column prop="matchResult" label="比对结果">
        <template slot-scope="scope">
          {{scope.row.matchResult == 1 ? '匹配成功' : scope.row.matchResult == 2 ? '未匹配到' : scope.row.matchResult == 3 ? '为同一个人' : '非同一个人'}}
        </template>
      </el-table-column>
      <el-table-column prop="matchScore" label="比对分值"></el-table-column>
      <el-table-column prop="sceneImageUrl" label="现场照片">
        <template slot-scope="scope">
          <img :src="scope.row.sceneImageUrl" preview="0" v-if="scope.row.sceneImageUrl !== null" width="65px" height="70px" class="localePhoto">
          <!--<img class="defaultpng" v-if="scope.row.sceneImageUrl == null">-->
          <p v-if="scope.row.sceneImageUrl == null">暂无图片</p>
        </template>
      </el-table-column>
      <el-table-column prop="faceImageUrl" label="底库照片">
        <template slot-scope="scope">
          <img :src="scope.row.faceImageUrl" preview="0" v-if="scope.row.faceImageUrl !== null" width="65px" height="70px" class="pedestalPhoto">
          <!--<img class="defaultpng" v-if="scope.row.faceImageUrl == null">-->
          <p v-if="scope.row.faceImageUrl == null">暂无图片</p>
        </template>
      </el-table-column>
      <el-table-column prop="fsName" label="底库名称"></el-table-column>
      <el-table-column prop="createTime" label="比对时间"></el-table-column>
      <el-table-column prop="matchCostTime" label="比对耗时(秒)"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.matchResult == 2 || scope.row.matchResult == 4 || scope.row.isAddStore" @click="logIntake(scope.$index, scope.row)">纳入底库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="logPage mt-20" v-if="logData.length > 0">
      <span>每页显示</span>
      <el-pagination @size-change="LogSizeChange" @current-change="LogCurrentChange" :current-page.sync="LogCurrentPage" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="sizes, prev, pager, next" :total="totals" background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import api from '../../store/api';

export default {
  data() {
    return {
      logRuleForm: {
        positionId: '',
        deviceId: '',
        matchType: '',
        matchResult: '',
        account: '',
        faceName: '',
        dateTime: []
      },
      logData: [],
      LogCurrentPage: 1,
      totals: 0,
      page: 1,
      rows: 10,
      positionList: [],
      deviceList: [],
      userList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      userData: '',
      interval: '',
      latestId: ''
    };
  },
  methods: {
    // 默认查询一个月内的全部日志
    getMonthlogs() {
      Date.prototype.Format = function(format) {
        var o = {
          'M+': this.getMonth() + 1,
          'd+': this.getDate(),
          'h+': this.getHours(),
          'm+': this.getMinutes(),
          's+': this.getSeconds(),
          'q+': Math.floor((this.getMonth() + 3) / 3),
          S: this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          );
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            );
          }
        }
        return format;
      };
      let begin = new Date();
      let end = new Date();
      new Date(begin.setMonth(new Date().getMonth() - 1));
      this.begintime = begin.Format('yyyy-MM-dd');
      this.endtime = end.Format('yyyy-MM-dd');
      // 默认时间范围
      this.logRuleForm.dateTime = [this.begintime, this.endtime];
      let params = {
        positionId: '',
        deviceId: '',
        matchType: '',
        matchResult: '',
        account: '',
        faceName: '',
        startDate: this.begintime,
        endDate: this.endtime,
        page: this.page,
        rows: this.rows
      };
      api.log.logs(
        params,
        function(data) {
          if (data.status == 'success') {
            this.logData = data.result.list;
            this.totals = data.result.total;
            if (data.result.list.length == 0) {
              return false;
            }
            this.latestId = data.result.list[0].id;
          }
        }.bind(this)
      );
    },
    // 搜索日志
    getlogSearch(formName) {
      let params = {
        positionId: this.logRuleForm.positionId,
        deviceId: this.logRuleForm.deviceId,
        matchType: this.logRuleForm.matchType,
        matchResult: this.logRuleForm.matchResult,
        account: this.logRuleForm.account,
        faceName: this.logRuleForm.faceName,
        startDate: this.logRuleForm.dateTime[0],
        endDate: this.logRuleForm.dateTime[1],
        page: this.page,
        rows: this.rows
      };
      api.log.logs(
        params,
        function(data) {
          if (data.status == 'success') {
            this.logData = data.result.list;
            this.totals = data.result.total;
            if (data.result.list.length == 0) {
              return false;
            }
            this.latestId = data.result.list[0].id;
          }
        }.bind(this)
      );
    },
    // 纳入底库
    logIntake(index, row) {
      this.$alert(
        '是否将现场照片纳入底库 <span>' + row.fsName + '</span> 中?',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          let id = row.id;
          api.log.appendToFace(
            id,
            function(data) {
              if (data.status == 'success') {
                this.getlogSearch();
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
    LogSizeChange(val) {
      this.rows = val;
      this.getlogSearch();
    },
    // 跳转页数
    LogCurrentChange(val) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.page = val;
      this.getlogSearch();
    },
    // 日志查询获取地点列表
    logpositionList() {
      let params = {
        name: ''
      };
      api.log.logpositionList(
        params,
        function(data) {
          if (data.status == 'success') {
            this.positionList = data.result.list;
          }
        }.bind(this)
      );
    },
    // 日志查询获取设备列表
    logdeviceList() {
      let params = {
        name: ''
      };
      api.log.logdeviceList(
        params,
        function(data) {
          if (data.status == 'success') {
            this.deviceList = data.result.list;
          }
        }.bind(this)
      );
    },
    // 日志查询获取用户列表
    loguserList() {
      let params = {
        account: ''
      };
      api.log.loguserList(
        params,
        function(data) {
          if (data.status == 'success') {
            this.userList = data.result.list;
          }
        }.bind(this)
      );
    },
    checkUpdate() {
      let params = {
        positionId: this.logRuleForm.positionId,
        deviceId: this.logRuleForm.deviceId,
        matchType: this.logRuleForm.matchType,
        matchResult: this.logRuleForm.matchResult,
        account: this.logRuleForm.account,
        faceName: this.logRuleForm.faceName,
        startDate: this.logRuleForm.dateTime[0],
        endDate: this.logRuleForm.dateTime[1],
        page: this.page,
        rows: this.rows,
        latestId: this.latestId
      };
      if (!this.latestId) return false;
      api.log.checkUpdate(
        params,
        function(data) {
          if (data.result) {
            this.getlogSearch();
          }
        }.bind(this)
      );
    }
  },
  mounted() {
    this.logpositionList();
    this.logdeviceList();
    this.getMonthlogs();
    // 判断是否是管理员
    this.userData = api.fetchUserInfo().isAdmin;
    if (this.userData) {
      this.loguserList();
    }

    this.interval = window.setInterval(
      function() {
        this.checkUpdate();
      }.bind(this),
      1000
    );
  },
  beforeDestroy() {
    window.clearInterval(this.interval);
  }
};
</script>
<style scoped>
.logSelect {
  text-align: left;
  border-right: 1px solid #e5e5e5;
}
.defaultpng {
  width: 65px;
  height: 70px;
  background: url(../../assets/imgs/default.svg) no-repeat;
}
.localePhoto {
  cursor: pointer;
}
.pedestalPhoto {
  cursor: pointer;
}
</style>
