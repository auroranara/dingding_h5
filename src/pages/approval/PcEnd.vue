<template>
  <div class="content">
    <el-form :model="form" label-width="150px" size="small">
      <el-form-item label="标题">
        <el-input class="wp70" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          class="wp70"
          type="textarea"
          :rows="2"
          v-model="form.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件（PDF）">
        <el-button
          @click="handleClickUpload"
          type="primary"
          :loading="uploading"
          >上传<i class="el-icon-upload el-icon--right"></i
        ></el-button>
        <div v-for="(item, index) in form.fileList">
          <div class="file-item" :key="index">
            <span>{{ item.fileName }}</span>
            <div @click="removeFile(index)" class="del">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
      </el-form-item>
      <input
        ref="uploadInput"
        id="uploadInput"
        type="file"
        accept=".pdf"
        @change="handleUploadChange"
      />
      <el-form-item label="审批人">
        <div style="display:flex">
          <div
            class="approval-item-container"
            v-for="(item, index) in form.users"
            :key="index"
          >
            <div class="approval-item">
              <div @click="removeApproval(index)" class="approval-close">+</div>
              <div>{{ item.name[0] }}</div>
            </div>
            <div class="approval-name">{{ item.name }}</div>
          </div>
          <!-- 选择审批人按钮 -->
          <div class="select-circle" @click="handleSelectApproval">
            <span>+</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          style="width:250px"
          size="big"
          @click="handleSubmit"
          type="primary"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as dd from "dingtalk-jsapi";
import { uploadFile, fetchUserId, fetchJsapiTicket, fetchSign } from "@/api.js";
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
        title: "",
        desc: "",
        // 附件
        fileList: [],
        // 审批人
        users: []
      },
      // 免登返回的code
      code: "",
      accessToken: "",
      // 用于加密的字符串
      nonceStr: "123456",
      userId: "",
      options1: ["需要", "不需要"],
      uploading: false
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
        jsApiList: [
          "runtime.info",
          "biz.util.uploadAttachment",
          "biz.contact.complexPicker"
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
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
        // TODO：判断文件类型是否是pdf
        dd.runtime.permission.requestAuthCode({
          corpId: this.corpId,
          onSuccess: async info => {
            this.uploading = true;
            const authCode = info.code;
            console.log("authCode", authCode);
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("authCode", authCode);
            formData.append("userId", this.userId);
            const res = await uploadFile(formData);
            if (res && res.status === 200) {
              this.uploading = false;
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
              this.form.fileList = [...this.form.fileList, newItem];
            }
          },
          onFail: err => {
            console.log("fail: " + JSON.stringify(err));
          }
        });
      }
    },
    handleClickUpload() {
      if (this.$refs.uploadInput) {
        this.$refs.uploadInput.click();
      } else {
        console.log("不存在的dom节点");
      }
    },
    // 点击选择审批人
    handleSelectApproval() {
      dd.biz.contact.complexPicker({
        title: "审批人", // 标题
        corpId: this.corpId, // 企业id
        multiple: false, // 是否多选
        limitTips: "超出了", //超过限定人数返回提示
        maxUsers: 1000, //最大可选人数
        pickedUsers: this.form.users, // 已选用户
        appId: this.agentId, // 微应用的Id
        responseUserOnly: false, // true返回人员信息 false 返回人员和部门信息
        startWithDepartmentId: 0, // 0 表示从企业最上层开始 -1 表示从自己所在部门开始
        onSuccess: info => {
          // info { departments[],selectedCount{Number},users[{ avatar,emplId,name }] }
          const { departments, selectedCount, users } = info;
          if (+selectedCount > 0) {
            this.form.users = users;
          }
        },
        onFail: err => {
          console.log("select user fail: " + JSON.stringify(err));
        }
      });
    },
    handleSubmit() {
      console.log("submit", this.form);
    },
    removeApproval(index) {
      const list = [...this.form.users];
      list.splice(index, 1);
      this.form.users = list;
    },
    removeFile(index) {
      const list = [...this.form.fileList];
      list.splice(index, 1);
      this.form.fileList = list;
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
  background: white;
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
  width: 70%;
  color: #1186ff;
  margin-top: 8px;
  padding: 0 30px 0 5px;
  font-size: 14px;
  text-overflow: ellipsis;
  position: relative;
}
.file-item:hover {
  /* color: #609fe2; */
  background-color: #e6f7ff;
}
.file-item > span {
  cursor: pointer;
}
.file-item:hover .del {
  visibility: visible;
  cursor: pointer;
}
.file-item .del {
  position: absolute;
  top: 0;
  right: 10px;
  color: #7c7b7b;
  visibility: hidden;
}
.el-form-item__label {
  font-size: 13px;
}
.select-circle {
  box-sizing: content-box;
  width: 31px;
  height: 31px;
  line-height: 31px;
  border: 1px dashed #409eff;
  border-radius: 100%;
  overflow: hidden;
  color: #409eff;
  font-size: 29px;
  font-weight: 300;
  text-align: center;
  cursor: pointer;
  position: relative;
  margin-bottom: 16px;
}
.approval-item-container {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.approval-item-container .approval-item {
  width: 33px;
  height: 33px;
  background: #409eff;
  border-radius: 100%;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.approval-item-container .approval-item .approval-close {
  position: absolute;
  right: 0;
  top: 0;
  color: white;
  cursor: pointer;
  border-radius: 100%;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  transform: rotate(-135deg) translate(-2px, 7px);
  background: #000000d4;
  z-index: 99;
}
.approval-item-container .approval-item div {
  position: absolute;
  color: white;
  font-size: 13px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}
.approval-item-container .approval-name {
  font-size: 12px;
  margin-top: 5px;
  line-height: 11px;
  color: gray;
}
</style>
