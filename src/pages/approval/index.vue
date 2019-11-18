<template>
  <div>
    <MobileEnd v-if="!isPcEnd" />
    <PcEnd v-if="isPcEnd" />
  </div>
</template>

<script>
import * as dd from "dingtalk-jsapi";
import MobileEnd from "./MobileEnd";
import PcEnd from "./PcEnd";
export default {
  components: {
    MobileEnd,
    PcEnd
  },
  data() {
    return {
      isPcEnd: true
    };
  },
  created() {
    this.judgeDevice();
  },
  methods: {
    judgeDevice() {
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        this.isPcEnd = false;
      }
      // dd.ready(() => {
      //   dd.device.base.getPhoneInfo({
      //     onSuccess: data => {
      //       this.isPcEnd = false;
      //       console.log("data", data);
      //     },
      //     onFail: err => {
      //       console.log("data fail: " + JSON.stringify(err));
      //     }
      //   });
      // });
    }
  }
};
</script>
<style scoped>
</style>
