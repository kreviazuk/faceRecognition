<style>
#home {
  margin: 20px;
  text-align: left;
}
</style>
<template>
  <div id="home">
    <top></top>
    <left></left>
    <right></right>
  </div>
</template>
<script>
import top from './components/top/top.vue';
import left from './components/left/left.vue';
import right from './components/right/right.vue';
export default {
  components: {
    top,
    left,
    right
  }
};
</script>
