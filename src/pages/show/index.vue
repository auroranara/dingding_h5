<template>
  <div class="content">
    <el-col
      :xs="xs"
      :sm="sm"
      :md="md"
      :lg="lg"
      :xl="xl"
    >
      <div class="item">
        <span class="label">标题</span>
        <span class="value">{{detail.title}}</span>
      </div>
      <div class="item">
        <span class="label">描述</span>
        <span class="value">{{detail.desc1}}</span>
      </div>
    </el-col>
  </div>
</template>
<script>
import { fetchApprovalDetail } from "@/api.js";
export default {
  data() {
    return {
      detail: {
        title: "",
        desc1: ""
      },
      xs: { span: 18, offset: 2 },
      sm: { span: 16, offset: 4 },
      md: { span: 16, offset: 4 },
      lg: { span: 16, offset: 4 },
      xl: { span: 16, offset: 4 }
    };
  },
  created() {
    this.fetchDetail();
  },
  methods: {
    async fetchDetail() {
      const id = this.$route.query.id;
      const res = await fetchApprovalDetail({ id });
      console.log("res", res);
      if (res && res.status === 200) {
        this.detail = res.data;
      }
    }
  }
};
</script>
<style scoped>
.content {
  height: 100vh;
  padding: 40px 20px 20px 20px;
  background: white;
  box-sizing: border-box;
}
.item {
  color: #545454;
}
.label {
  font-size: 14px;
}
.label::after {
  content: "：";
}
.value {
  font-size: 14px;
}
</style>