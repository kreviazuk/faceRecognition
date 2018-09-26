<style>
#home-right {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;
  -webkit-box-sizing: border-box;
  line-height: 16px;
  vertical-align: top;
}
#home-right #title {
  text-align: left;
  font-size: 16px;
  padding-left: 10px;
  border-left: 3px solid #2c9cfa;
}
#home-right #title .right {
  float: right;
  font-size: 14px;
  margin: 0;
  padding: 0;
}
#home-right #content {
  position: relative;
  margin-top: 20px;
}
#home-right #content .block {
  border: 1px solid #e5e5e5;
  display: inline-block;
  width: 32%;
  height: 188px;
  text-align: center;
  line-height: 188px;
}
#home-right #content .block:nth-child(2) {
  margin-left: 15px;
  margin-right: 15px;
}
#home-right #content .item {
  text-align: center;
  display: inline-block;
  margin-top: 7px;
  padding-right: 10px;
  padding-left: 10px;
  width: 40%;
}
#home-right #content .item .title {
  font-size: 14px;
  color: #3c3e4a;
  line-height: 55px;
  text-align: left;
}
#home-right #content .block .title:before {
  content: ' ';
  display: inline-block;
  height: 12px;
  width: 12px;
  border-radius: 12px;
  margin-right: 5px;
}
#home-right #content .block:nth-child(1) .item:nth-child(1) .title:before {
  background-color: rgba(109, 223, 225, 1);
}
#home-right #content .block:nth-child(1) .item:nth-child(2) .title:before {
  background-color: rgba(86, 196, 234, 1);
}
#home-right #content .block:nth-child(2) .item:nth-child(1) .title:before {
  background-color: rgba(64, 127, 232, 1);
}
#home-right #content .block:nth-child(2) .item:nth-child(2) .title:before {
  background-color: rgba(138, 86, 244, 1);
}
#home-right #content .block:nth-child(3) .item:nth-child(1) .title:before {
  background-color: rgba(64, 60, 234, 1);
}
#home-right #content .block:nth-child(3) .item:nth-child(2) .title:before {
  background-color: rgba(99, 30, 195, 1);
}
#home-right #content .item .num {
  font-family: LetsgoDigital-Regular;
  color: #48a9ef;
  font-size: 35px;
  height: 50px;
  line-height: 50px;
}
#home-right #content .block:nth-child(1) .item:nth-child(1) .num {
  color: rgba(109, 223, 225, 1);
  border-right: 1px solid #e5e5e5;
}
#home-right #content .block:nth-child(1) .item:nth-child(2) .num {
  color: rgba(86, 196, 234, 1);
}
#home-right #content .block:nth-child(2) .item:nth-child(1) .num {
  color: rgba(64, 127, 232, 1);
  border-right: 1px solid #e5e5e5;
}
#home-right #content .block:nth-child(2) .item:nth-child(2) .num {
  color: rgba(138, 86, 244, 1);
}
#home-right #content .block:nth-child(3) .item:nth-child(1) .num {
  color: rgba(64, 60, 234, 1);
  border-right: 1px solid #e5e5e5;
}
#home-right #content .block:nth-child(3) .item:nth-child(2) .num {
  color: rgba(99, 30, 195, 1);
}
#home-right #content .item .describe {
  font-size: 14px;
  color: #999999;
  line-height: 14px;
}
#home-right #content .item:nth-child(1) .describe {
  border-right: 1px solid #e5e5e5;
}
#home-right #content .position {
  display: inline-block;
  background-image: url(../../../../assets/imgs/position.svg);
  background-repeat: no-repeat;
  font-size: 16px;
  color: #3c3e4a;
  padding-left: 20px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  top: 25px;
  right: 0;
}
#home-right #content #map {
  height: 781px;
  width: 100%;
}
#home-right #reminder {
  height: 186px;
  background: #f5f5f6;
  font-size: 14px;
  color: #3c3e4a;
  text-align: center;
  margin-top: 12px;
  vertical-align: bottom;
  padding-top: 20px;
  box-sizing: border-box;
}
</style>
<template>
  <div id="home-right">
    <div id="title">
      <span class="left">设备信息概览</span>
      <el-button type="text" class="right" @click="goDevice()">查看详情</el-button>
    </div>
    <div id="content">
      <div>
        <div class="block" v-for="(i, index) in info" v-if="index<3">
          <div class="item">
            <div class="title">{{mapType[i.deviceType]}}设备</div>
            <div class="num">{{i.total}}</div>
            <div class="describe">数量（个）</div>
          </div>
          <div class="item">
            <div class="title">{{mapType[i.deviceType]}}分布地点</div>
            <div class="num">{{i.positionNum}}</div>
            <div class="describe">数量（个）</div>
          </div>
        </div>
      </div>
    </div>
    <div id="reminder" v-if="info.length ==0">
      <img src="../../../../assets/imgs/home-default.svg">
      <div>暂无设备信息，请先创建</div>
    </div>
  </div>
</template>
<script>
import { option } from './mapOption';
//import pinyin from 'pinyin/bundle';
import cityMap from '../../../../assets/js/china-main-city-map';
import api from '../../../../store/api';
export default {
  data() {
    return {
      info: [],
      mapType: {
        10: '其它',
        1: '摄像头',
        2: '门禁'
      }
    };
  },
  methods: {
    goDevice() {
      this.$router.push('/container/deviceRegister');
    },
    getDevice() {
      api.home.device(
        function(data) {
          this.info = data.result.list;
        }.bind(this)
      );
    }
  },
  mounted() {
    this.getDevice();
  }
};
</script>
