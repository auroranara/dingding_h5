<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #fbf9fe;
}
.weui-label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>
