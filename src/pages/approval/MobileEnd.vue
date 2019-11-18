<template>
  <div>
    <!-- 表单内容 -->
    <div class="content">
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
        <popup-radio
          title="是否需要反馈"
          :options="options1"
          v-model="form.needFeedback"
        ></popup-radio>
        <datetime title="发布日期" v-model="form.date"></datetime>
        <input
          class="upload"
          ref="uploadInput"
          id="uploadInput"
          type="file"
          accept=".pdf"
          @change="handleUploadChange"
        />
      </group>
      <div class="file">
        附件
        <label class="file-upload" for="uploadInput">
          +
        </label>
        <div v-for="item in fileList">
          <div class="file-item">{{ item.fileName }}</div>
        </div>
      </div>
    </div>
    <!-- 底部提交 -->
    <div class="bottom">
      <x-button @click.native="handleSubmit" class="btn" type="primary"
        >提交</x-button
      >
    </div>
  </div>
</template>

<script>
import {
  XInput,
  XButton,
  Group,
  Datetime,
  PopupRadio,
  Flexbox,
  FlexboxItem
} from "vux";
import * as dd from "dingtalk-jsapi";
import { uploadFile, fetchUserId, fetchJsapiTicket, fetchSign } from "@/api.js";

export default {
  components: {
    XInput,
    XButton,
    Group,
    Datetime,
    PopupRadio,
    Flexbox,
    FlexboxItem
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
        needFeedback: "",
        date: ""
      },
      // 免登返回的code
      code: "",
      accessToken: "",
      // 用于加密的字符串
      nonceStr: "123456",
      userId: "",
      // 附件
      fileList: [],
      options1: ["需要", "不需要"]
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
        // 获取authCode 注意： authCode只能使用一次
        dd.runtime.permission.requestAuthCode({
          corpId: this.corpId,
          onSuccess: async info => {
            const authCode = info.code;
            const res = await fetchUserId({ authCode });
            if (res && res.status === 200) {
              const userId = res.data.data;
              dd.userid = userId;
              this.userId = userId;
              console.log("userId", userId);
            }
          },
          onFail: err => {
            console.log("fail: " + JSON.stringify(err));
          }
        });
      });
    },
    // 点击上传附件
    async handleUploadChange(e) {
      const files = e.target.files;

      if (files && files.length) {
        dd.runtime.permission.requestAuthCode({
          corpId: this.corpId,
          onSuccess: async info => {
            const authCode = info.code;
            console.log("authCode", authCode);
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("authCode", authCode);
            formData.append("userId", this.userId);
            const res = await uploadFile(formData);
            if (res && res.status === 200) {
              const {
                spaceId,
                fileId,
                fileName,
                fileSize,
                fileType,
                id,
                size,
                name,
                type
              } = JSON.parse(res.data.dentry);
              const newItem = {
                spaceId,
                fileId: fileId || id,
                fileName: fileName || name,
                fileSize: fileSize || size,
                fileType: fileType || type
              };
              console.log("newItem", newItem);
              this.fileList = [...this.fileList, newItem];
            }
          },
          onFail: err => {
            console.log("fail: " + JSON.stringify(err));
          }
        });
      }
    },
    handleSubmit() {}
  }
};
</script>

<style scoped>
.content {
  padding-bottom: 92px;
  box-sizing: border-box;
}
.bottom {
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 10px 20px 10px;
  background: #fff;
}
.btn {
  background: #0569e1;
  border-radius: 10px;
}
.upload {
  display: none;
}
.file {
  background: #fff;
  padding: 10px 15px;
  margin-top: 1.17em;
  font-size: 17px;
  overflow: hidden;
}
.file-upload {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ededed;
  margin-top: 10px;
  color: #a09e9e;
  font-size: 30px;
  font-weight: 300;
  cursor: pointer;
}
.file-upload > div {
  transform: scale(1.3);
}
.file-item {
  color: #0569e1;
  margin-top: 8px;
  padding-right: 20px;
  font-size: 14px;
  cursor: pointer;
  text-overflow: ellipsis;
}
</style>
