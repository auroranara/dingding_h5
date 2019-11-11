<template>
  <div>
    <div style="padding:10% 0">
      <group>
        <x-input
          title="接收单位"
          v-model="form.receiveUnit"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <x-input
          title="文件标题"
          v-model="form.title"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <x-input
          title="文号"
          v-model="form.num"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <x-input
          title="发文单位"
          v-model="form.sneUnit"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <datetime
          title="发布日期"
          v-model="form.date"
        ></datetime>
      </group>
      <group title="选择">
        <x-button
          style="margin-top:12px"
          @click.native="handleUpload()"
        >+</x-button>
      </group>
    </div>
  </div>
</template>

<script>
import { XInput, XButton, Group, Datetime } from "vux";
import * as dd from "dingtalk-jsapi";
import { fetchAccessToken, fetchJsapiTicket } from "@/api.js";

export default {
  components: {
    XInput,
    XButton,
    Group,
    Datetime
  },
  data() {
    return {
      // 钉钉企业id
      corpId: "dingb3df049b06530ece35c2f4657eb6378f",
      // 微应用id
      agentId: "312594367",
      // 企业自定义控件
      spaceId: "",
      // 表单数据
      form: {
        receiveUnit: "",
        sendUnit: "",
        title: "",
        num: "",
        date: ""
      },
      // 免登返回的code
      code: "",
      accessToken: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const res = await fetchAccessToken();
      console.log("accessToken", res.data);
      this.$vux.alert.show({
        title: "accessToken",
        content: res.data
      });
      // 免登
      dd.ready(async () => {
        // dd.config({
        //   agentId: "dingb3df049b06530ece35c2f4657eb6378f", // 必填，微应用ID
        //   corpId: this.corpId, //必填，企业ID
        //   timeStamp: "1573389830703", // 必填，生成签名的时间戳
        //   nonceStr: "123456", // 必填，生成签名的随机串
        //   signature: "bbe3d329a523869341cc6916707dfc41aa5ff0e9", // 必填，签名
        //   type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        //   jsApiList: [
        //     "runtime.info",
        //     "biz.contact.choose",
        //     "device.notification.confirm",
        //     "device.notification.alert",
        //     "device.notification.prompt",
        //     "biz.ding.post",
        //     "biz.util.openLink",
        //     "biz.util.uploadAttachment"
        //   ] // 必填，需要使用的jsapi列表，注意：不要带dd。
        // });
      });
    },
    async handleUpload() {
      console.log("handle upload");

      dd.ready(() => {
        {
          dd.biz.util.uploadAttachment({
            file: { spaceId: "702472833", max: 1 },
            types: ["file"], //PC端支持["photo","file","space"]
            onSuccess: result => {
              console.log("upload", result);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
