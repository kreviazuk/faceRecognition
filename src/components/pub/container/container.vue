<style>
  .el-container.is-vertical{
    height: 100%;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    padding: 0;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
<template>
    <el-container>
      <el-header>
        <top></top>
      </el-header>
      <el-main>
        <right></right>
      </el-main>
    </el-container>
</template>
<script>
  import top from '../header/header.vue'
  import right from '../main/main.vue'
  export default{
    components: {
      right,
      top
    }
  }
</script>
