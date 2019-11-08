<template>
  <div>
    <x-header>服务反馈</x-header>
    <group>
      <cell title="响应速度">
        <rater v-model="form.xysd"></rater>
      </cell>
      <cell title="完成效率">
        <rater v-model="form.wcxl"></rater>
      </cell>
      <cell title="完成质量">
        <rater v-model="form.wczl"></rater>
      </cell>
      <cell title="技术水平">
        <rater v-model="form.jssp"></rater>
      </cell>
      <cell title="服务态度">
        <rater v-model="form.fwtd"></rater>
      </cell>
      <cell title="总体评价">
        <rater v-model="form.ztpj"></rater>
      </cell>
    </group>
    <group title="意见和建议">
      <x-textarea :max="200" name="description" v-model="form.remarks" :rows="4"></x-textarea>
    </group>
    <flexbox style="margin-top:18px">
      <x-button type="primary" class="btn" @click.native="submit()">提交</x-button>
    </flexbox>
    <div v-transfer-dom>
      <alert v-model="show" title="成功">发送成功</alert>
    </div>
  </div>
</template>
<script>
import { fetchFeedBack, saveFeedBack } from '@/api.js'
import {
  Group,
  Cell,
  Rater,
  XHeader,
  Flexbox,
  FlexboxItem,
  XButton,
  XTextarea,
  Alert,
  TransferDomDirective as TransferDom
} from 'vux'
export default {
  name: 'FeedBack',
  components: {
    Group,
    Cell,
    Rater,
    XHeader,
    Flexbox,
    FlexboxItem,
    XButton,
    XTextarea,
    Alert
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      show: false,
      form: {
        fwdh: '',
        xysd: 5,
        wcxl: 5,
        wczl: 5,
        jssp: 5,
        fwtd: 5,
        ztpj: 5,
        remarks: ''
      }
    }
  },
  created() {
    if (this.$route.query.fwdh) {
      this.getFeedBack()
    }
  },
  methods: {
    async getFeedBack() {
      const res = await fetchFeedBack(this.$route.query.fwdh)
      const data = res.data.data
      if (data && data.length) {
        this.form = {
          fwdh: parseInt(data[0].fwdh),
          xysd: parseInt(data[0].xysd),
          wcxl: parseInt(data[0].wcxl),
          wczl: parseInt(data[0].wczl),
          jssp: parseInt(data[0].jssp),
          fwtd: parseInt(data[0].fwtd),
          ztpj: parseInt(data[0].ztpj),
          remarks: data[0].remarks,
          id: data[0].id
        }
      }

      this.form.fwdh = this.$route.query.fwdh
    },
    async submit() {
      const res = await saveFeedBack(this.form)
      if (res.data.code && res.data.code === 200) {
        this.show = true
        this.$router.push({ path: '/list' })
      }
    }
  }
}
</script>
<style scoped>
.btn {
  width: 90%;
}
</style>
