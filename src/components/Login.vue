<template>
  <div class="login-container" :style="backgroundDiv">
    <div style="width:80%;margin:0 auto;height:270px"></div>
    <div style="color:#fad0d0">
      <x-input name="username" v-model="form.username" placeholder="请输入账号" required type="text" :max="20">
        <img slot="label" style="padding-right:10px;display:block;" src="/yunwei/static/account.png" width="20" height="20">
      </x-input>
      <x-input name="password" v-model="form.password" placeholder="请输入密码" required type="password" :max="20">
        <img slot="label" style="padding-right:10px;display:block;" src="/yunwei/static/password.png" width="20" height="20">
      </x-input>
    </div>
    <div style="padding:15px;margin-top:15px;">
      <x-button class="custom-btn-blue" @click.native="submit()">登陆</x-button>
      <!-- <x-button class="custom-btn-forget" mini plain>忘记密码</x-button>
      <x-button class="custom-btn-register" mini plain>立即注册</x-button> -->
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import { XButton, Group, XInput, Icon, Divider } from 'vux'
import { login } from '@/api.js'
export default {
  components: {
    Group,
    XInput,
    XButton,
    Icon,
    Divider
  },
  computed: {
    backgroundDiv() {
      return { backgroundImage: 'url(' + require('@/assets/banner.png') + ')' }
    }
  },
  data() {
    return {
      screenHeight: '',
      form: {
        username: '',
        password: '',
        mobileLogin: true
      }
    }
  },
  created() {
    const account = localStorage.getItem('zkxr-yw-account')
    if (account) {
      this.form = JSON.parse(account)
    }
  },
  methods: {
    async submit() {
      const res = await login(this.form)
      if (res.data && res.data.code === 200) {
        // this.$store.commit('setUserInfo', res.data)
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        localStorage.setItem('zkxr-yw-account', JSON.stringify(this.form))
        this.$router.push({ path: 'list' })
      } else alert('账号或密码不正确!')
    },
    reset() {
      this.form = {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="less">
.login-container {
  // background: url('/static/banner.png');
  background-size: 100%;
  width: 100vw;
  height: 100vh;
  display: absolute;
  overflow: hidden;
}
.footer {
  display: block;
  height: 100%;
}
.custom-btn-blue {
  border-radius: 99px !important;
  background-color: #21b2df !important;
  color: white !important;
  &:active {
    background-color: rgb(128, 199, 240) !important;
  }
}
.custom-btn-forget {
  border-radius: 99px !important;
  border-color: #21b2df !important;
  color: white !important;
  &:active {
    background-color: rgb(128, 199, 240) !important;
  }
}
.custom-btn-register {
  float: right;
  border-radius: 99px !important;
  border-color: #21b2df !important;
  color: white !important;
  &:active {
    background-color: rgb(128, 199, 240) !important;
  }
}
</style>
<style>
.weui-cell:before {
  right: 15px !important;
}
.weui-icon-warn {
  color: #f8f8f8 !important;
}
</style>
