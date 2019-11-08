<template>
  <div>
    <x-header>审批报表</x-header>
    <div style="padding:10% 0">

    </div>
  </div>
</template>

<script>
import { XHeader, XInput, XButton } from 'vux'
import * as dd from 'dingtalk-jsapi'

export default {
  components: {
    XHeader,
    XInput,
    XButton
  },
  data() {
    return {
      // 钉钉企业id
      corpId: 'dingb3df049b06530ece35c2f4657eb6378f',
      // 企业自定义控件
      spaceId: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      // 免登
      dd.runtime.permission.requestAuthCode({
        corpId: this.corpId,
        onSuccess: function(result) {
        /*{
            code: 'hYLK98jkf0m' //string authCode
        }*/
        },
        onFail: function(err) {
          console.log('err')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
