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
          v-model="form.sendUnit"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <datetime title="发布日期" v-model="form.date"></datetime>
        <input type="file" accept="" @click="handleUploadChange" />
      </group>
      <group title="选择">
        <x-button style="margin-top:12px" @click.native="handleUpload()"
          >+</x-button
        >
      </group>
    </div>
  </div>
</template>

<script>
import { XInput, XButton, Group, Datetime } from "vux";
import * as dd from "dingtalk-jsapi";
import { uploadFile, fetchUserId, fetchJsapiTicket, fetchSign } from "@/api.js";

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
      accessToken: "",
      nonceStr: "123456",
      userid: "",
      authCode: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const resTicket = await fetchJsapiTicket();
      const ticket = resTicket.data.ticket;
      // 获取签名参数
      const resSign = await fetchSign({
        url: "http://114.55.242.193:18080/",
        nonceStr: this.nonceStr,
        ticket
      });
      const { sign, timeStamp } = resSign.data;

      dd.config({
        agentId: this.agentId, // 必填，微应用ID
        corpId: this.corpId, //必填，企业ID
        timeStamp, // 必填，生成签名的时间戳
        nonceStr: this.nonceStr, // 必填，生成签名的随机串
        signature: sign, // 必填，签名
        type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: ["runtime.info", "biz.util.uploadAttachment"] // 必填，需要使用的jsapi列表，注意：不要带dd。
      });
      dd.userid = 0;
      // 免登
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: this.corpId,
          onSuccess: async info => {
            const authCode = info.code;
            this.authCode = authCode;
            const res = await fetchUserId({ authCode });
            if (res && res.status === 200) {
              const userid = res.data.data;
              dd.userid = userid;
              this.userid = userid;
            }
          },
          onFail: err => {
            console.log("fail: " + JSON.stringify(err));
          }
        });
      });
    },
    // 点击上传文件
    async handleUpload() {
      // dd.biz.util.uploadAttachment({
      //   file: { spaceId: "702472833", max: 1 },
      //   types: ["file"], //PC端支持["photo","file","space"]
      //   onSuccess: result => {
      //     console.log("upload", result);
      //   },
      //   onFail: err => {
      //     console.log("upload fail: " + JSON.stringify(err));
      //   }
      // });
    },
    async handleUploadChange(e) {
      const file = e.target.files[0];
      console.log("file", file);
    }
  }
};
</script>

<style scoped>
</style>
