<style>
  #home-left{
    /*display: inline-block;*/
    /*height: 930px;*/
    /*width: 282px;*/
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    line-height: 16px;
  }
  #home-left #title{
    text-align: left;
    font-size: 16px;
    padding-left: 10px;
    border-left: 3px solid #2C9CFA;
  }
  #home-left #title .right{
    float: right;
    font-size: 14px;
    margin: 0;
    padding: 0;
  }
  #home-left #content .item{
    display: inline-block;
    margin: 20px 0;
    height: 116px;
    padding: 8px 5%;
    box-sizing: border-box;
    width: 32%;
  }
  #home-left #content .item .item-container{
    width: 300px;
    display: inline-block;
    padding: 0 20px;
  }
  #home-left #content .item .item-title{
    font-size: 14px;
    text-align: center;
  }
  #home-left #content .item .item-title>span{
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 117px;
    overflow: hidden;
  }
  #home-left #content .item .item-num{
    font-size: 48px;
    text-align: center;
    height: 70px;
    line-height: 80px;
  }
  #home-left #content .item:nth-child(1){
    color: rgba(37,218,199,1);
    background-color: rgb(233,252,250);
  }
  #home-left #content .item:nth-child(1) .item-container{
    background-image: url(../../../../assets/imgs/人脸库icon1.svg);
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-origin: content-box;
  }
  #home-left #content .item:nth-child(2){
    color: rgba(30,175,238,1);
    background-color: rgb(232,247,253);
    margin: 0 20px;
  }
  #home-left #content .item:nth-child(2) .item-container{
    background-image: url(../../../../assets/imgs/人脸库icon2.svg);
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-origin: content-box;
  }
  #home-left #content .item:nth-child(3){
    color: rgba(53,97,225,1);
    background-color: rgb(234,239,252);
  }
  #home-left #content .item:nth-child(3) .item-container{
    background-image: url(../../../../assets/imgs/人脸库icon3.svg);
    background-repeat: no-repeat;
    background-position-y: bottom;
    background-origin: content-box;
  }
  #home-left #reminder{
    height: 186px;
    background: #F5F5F6;
    font-size: 14px;
    color: #3C3E4A;
    text-align: center;
    margin-top: 12px;
    vertical-align: bottom;
    padding-top: 20px;
    box-sizing: border-box;
  }
</style>
<template>
  <div id="home-left">
    <div id="title">
      <span class="left">人脸库概览</span>
      <el-button type="text" class="right" @click="goFace()">查看详情</el-button>
    </div>
    <div id="content">
      <div class="item" v-for="(i, index) in info" v-if="index<3">
        <div class="item-container">
          <div class="item-num">{{i.num}}</div>
          <div class="item-title" :title="i.name+'（人）'"><span>{{i.name}}（人）</span></div>
        </div>
      </div>
    </div>
    <div id="reminder" v-if="info.length ==0">
      <img src="../../../../assets/imgs/home-default.svg">
      <div>暂无人脸库，请先创建</div>
    </div>
  </div>
</template>
<script>
  import api from '../../../../store/api'
  export default{
    data(){
      return{
        info: []
      }
    },
    methods:{
      goFace(){
        this.$router.push('/container/faceRegister')
      },
      faceStoreOverview(){
        api.home.faceStore(function (data) {
          this.info = data.result.list;
        }.bind(this))
      }
    },
    mounted(){
      this.faceStoreOverview()
    }
  }
</script>
