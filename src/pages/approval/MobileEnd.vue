<template>
  <div>
    <!-- 表单内容 -->
    <div class="content">
      <group>
        <x-input
          title="文件标题"
          v-model="form.title"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <x-input
          title="描述"
          v-model="form.desc"
          placeholder="请输入"
          placeholder-align="right"
        ></x-input>
        <input
          class="upload"
          ref="uploadInput"
          id="uploadInput"
          type="file"
          accept=".pdf"
          @change="handleUploadChange"
        />
      </group>
      <!-- 附件 -->
      <div class="file">
        附件
        <label
          class="file-upload"
          for="uploadInput"
        >
          +
        </label>
        <div v-for="item in form.fileList">
          <div class="file-item">{{ item.fileName }}</div>
        </div>
      </div>
      <!-- 审批人 -->
      <div class="approval">
        审批人
        <div style="display:flex;margin-top:10px">
          <div
            class="approval-item-container"
            v-for="(item,index) in form.users"
          >
            <div class="approval-item">
              <div
                @click="removeApproval(index)"
                class="approval-close"
              >+</div>
              <div> {{item.name[0]}}</div>
            </div>
            <div class="approval-name">{{item.name}}</div>
          </div>
          <!-- 选择审批人按钮 -->
          <div
            class="select-circle"
            @click="handleSelectApproval"
          >
            <div>+</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部提交 -->
    <div class="bottom">
      <x-button
        @click.native="handleSubmit"
        class="btn"
        type="primary"
      >提交</x-button>
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
              this.form.fileList = [...this.form.fileList, newItem];
            }
          },
          onFail: err => {
            console.log("fail: " + JSON.stringify(err));
          }
        });
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
    }
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
.select-circle {
  box-sizing: content-box;
  width: 31px;
  height: 31px;
  border: 1px dashed #409eff;
  border-radius: 100%;
  overflow: hidden;
  color: #409eff;
  font-size: 29px;
  font-weight: 300;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.approval {
  background: #fff;
  padding: 10px 15px;
  margin-top: 1.17em;
  font-size: 17px;
  overflow: hidden;
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
