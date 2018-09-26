<style>
#home-top {
  background-color: #fff;
  height: 260px;
  padding: 20px;
}
#home-top #title {
  text-align: left;
  font-size: 16px;
  padding-left: 10px;
  border-left: 3px solid #2c9cfa;
  line-height: 16px;
}
#home-top #title .right {
  float: right;
  font-size: 14px;
  margin: 0;
  padding: 0;
}
#home-top #content {
  text-align: left;
  padding: 20px 20px;
}
#home-top #content #time {
  width: 30%;
  text-align: center;
  display: inline-block;
  padding-top: 50px;
  vertical-align: top;
}
#home-top #content #time > div {
  display: inline-block;
  margin-left: 16px;
}
#home-top #content #time span:first-child {
  font-size: 48px;
  color: #3c3e4a;
}
#home-top #content #time span:last-child {
  font-size: 14px;
  color: #999999;
}

#home-top #content #oneToN,
#home-top #content #oneToOne {
  height: 185px;
  width: 30%;
  display: inline-block;
  border-left: 1px solid #e5e5e5;
  padding-right: 50px;
}
</style>
<template>
  <div id="home-top">
    <div id="title">
      <span class="left">人脸识别服务概览</span>
      <el-button type="text" class="right" @click="goLog()">查看详情</el-button>
    </div>
    <div id="content">
      <div id="time">
        <img src="../../../../assets/imgs/faceRecognition.svg">
        <div>
          <span>{{total}}</span><br>
          <span>总识别调用数（次）</span>
        </div>
      </div>
      <div id="oneToN">
      </div>
      <div id="oneToOne">
      </div>
    </div>
  </div>
</template>
<script>
var echarts = require('echarts');
import { oneToNOption, oneToOneOption } from './barOption';
import api from '../../../../store/api';
export default {
  data() {
    return {
      total: 0,
      oneToNChart: '',
      oneToOneChart: ''
    };
  },
  methods: {
    goLog() {
      this.$router.push('/container/log');
    },
    recognition() {
      api.home.recognition(
        function(data) {
          this.total = data.result.totalCallTimes;
          oneToNOption.title.text = data.result.callTimes1n;
          oneToNOption.series[0].data[0].value = data.result.matchNum;
          oneToNOption.series[0].data[1].value = data.result.unMatchNum;
          this.oneToNChart.setOption(oneToNOption);

          oneToOneOption.title.text = data.result.callTimes11;
          oneToOneOption.series[0].data[0].value = data.result.samePeopleNum;
          oneToOneOption.series[0].data[1].value =
            data.result.differentPeopleNum;
          this.oneToOneChart.setOption(oneToOneOption);
        }.bind(this)
      );
    }
  },
  mounted() {
    this.oneToNChart = echarts.init(document.getElementById('oneToN'));
    this.oneToNChart.setOption(oneToNOption);
    this.oneToOneChart = echarts.init(document.getElementById('oneToOne'));
    this.oneToOneChart.setOption(oneToOneOption);
    this.recognition();
  }
};
</script>
