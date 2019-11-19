<template>
  <div class="content">
    <msg
      title="操作成功"
      :buttons="buttons"
      :icon="icon"
    ></msg>
    <el-button
      @click="handleGoBack"
      style="width:220px"
      v-if="isPcEnd"
    >返回</el-button>
  </div>
</template>
<script>
import { Msg, XButton } from "vux";
export default {
  components: {
    Msg,
    XButton
  },
  data() {
    return {
      isPcEnd: true,
      icon: "success",
      buttons: []
    };
  },
  created() {
    this.judgeDevice();
  },
  methods: {
    judgeDevice() {
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        this.isPcEnd = false;
        this.buttons = [
          {
            type: "default",
            text: "返回",
            link: "/"
          }
        ];
      }
    },
    handleGoBack() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>
<style scoped>
.content {
  height: 100vh;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
</style>
