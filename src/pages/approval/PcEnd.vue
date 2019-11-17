<template>
  <div class="content">
    <el-form
      :model="form"
      label-width="150px"
      size="small"
    >
      <el-form-item label="接收单位">
        <el-input
          class="wp70"
          v-model="form.receiveUnit"
        ></el-input>
      </el-form-item>
      <el-form-item label="文件标题">
        <el-input
          class="wp70"
          v-model="form.title"
        ></el-input>
      </el-form-item>
      <el-form-item label="文号">
        <el-input
          class="wp70"
          v-model="form.num"
        ></el-input>
      </el-form-item>
      <el-form-item label="发文单位">
        <el-input
          class="wp70"
          v-model="form.sendUnit"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否需要反馈">
        <el-radio-group v-model="form.needFeedback">
          <el-radio label="需要"></el-radio>
          <el-radio label="不需要"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="附件（PDF）">
        <el-button
          @click="handleClickUpload"
          type="primary"
        >上传<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
      <input
        ref="upload"
        type="file"
        accept=".pdf"
        @change="handleUploadChange"
      />
      <div v-for="item in fileList">
        <div class="file-item">{{item.fileName}}</div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
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
                fileType
              } = JSON.parse(res.data.dentry);
              const newItem = {
                spaceId,
                fileId,
                fileName,
                fileSize,
                fileType
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
    handleClickUpload() {
      this.$refs.upload.click();
    }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.content {
  height: 100vh;
  padding: 20px;
}
.wp70 {
  width: 70%;
}
.file-select {
  color: #0569e1;
  cursor: pointer;
}
input[type="file"] {
  display: none;
}
.file-item {
  color: #0569e1;
  margin-top: 8px;
  padding-right: 20px;
  font-size: 14px;
  cursor: pointer;
  text-overflow: ellipsis;
}
.el-form-item__label {
  font-size: 13px;
}
</style>