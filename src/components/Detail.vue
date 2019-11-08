<template>
  <div>
    <x-header>报修单详情
      <router-link v-if="readonly" slot="right" :to="{path:'/feedBack',query:{fwdh:this.form.fwdh}}">服务反馈</router-link>
    </x-header>
    <div style="padding:10% 0">
      <group :title="title">
        <x-input required :readonly="readonly" title="报修人员" v-model="form.username" is-type="china-name"></x-input>
        <x-input required :readonly="readonly" title="联系电话" v-model="form.phone" keyboard="number" is-type="china-mobile"></x-input>
        <x-input v-if="form.status" readonly title="故障上报时间" v-model="form.createDate"></x-input>
        <x-input v-if="form.status==='3'" readonly title="维修完成时间" v-model="form.finishDate"></x-input>
        <!-- <x-input required :readonly="readonly" title="报修部门" v-model="form.orgName" :min="2" :max="50"></x-input> -->
        <popup-radio :readonly="readonly" title="报修部门" :options="departments" v-model="form.orgName"></popup-radio>
        <popup-radio :readonly="readonly" title="故障类别" :options="types" v-model="form.type"></popup-radio>
        <popup-radio :readonly="readonly" title="故障分级" :options="levels" v-model="form.level"></popup-radio>
        <x-textarea :readonly="readonly" title="报修内容" :max="200" name="description" v-model="form.content" :rows="10"></x-textarea>
        <x-textarea v-if="readonly" title="维修人员反馈" :max="200" name="description" v-model="form.fk" :rows="10"></x-textarea>
      </group>
      <flexbox style="margin-top:12px">
        <flexbox-item>
          <x-button type="primary" class="btn" @click.native="submit()">确定</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button :disabled="readonly" type="default" class="btn" @click.native="reset()">清除</x-button>
        </flexbox-item>
      </flexbox>
      <div v-transfer-dom>
        <alert v-model="show" title="成功">发送成功</alert>
        <alert v-model="showError" title="失败">请填写全部内容</alert>
      </div>
    </div>
  </div>
</template>


<script>
import {
  XTextarea,
  Group,
  XInput,
  XButton,
  Box,
  GroupTitle,
  Flexbox,
  FlexboxItem,
  Divider,
  AlertModule,
  Alert,
  XHeader,
  PopupRadio,
  Rater,
  TransferDomDirective as TransferDom,
  dateFormat
} from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    AlertModule,
    Alert,
    XTextarea,
    Group,
    XInput,
    XButton,
    Box,
    GroupTitle,
    Flexbox,
    FlexboxItem,
    Divider,
    XHeader,
    PopupRadio,
    Rater
  },
  filters: {
    parseDate(date) {
      return dateFormat(new Date(date), 'YY-MM-DD hh:mm:ss')
    }
  },
  data() {
    return {
      showError: false,
      title: '',
      readonly: false,
      levels: [],
      types: [],
      departments: [],
      show: false,
      temp: {},
      form: {
        username: '',
        phone: '',
        orgName: '',
        content: '',
        level: '',
        fwdh: '',
        type: '',
        fk: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getLevels()
      await this.getTypes()
      await this.getDepartments()
      if (this.$route.query.id) this.getDetail()
      else {
        const data = sessionStorage.getItem('userInfo')
        const userInfo = JSON.parse(data)
        this.form.username = userInfo.userName
        this.form.phone = userInfo.phone
      }
    },
    async getLevels() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/getLevel')
      const list = res.data.data
      if (list && list.length) {
        this.levels = list.map(item => {
          return {
            value: `${item.label}`,
            key: `${item.value}`
          }
        })
      }
    },
    async getTypes() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/getType')
      const list = res.data.data
      if (list && list.length) {
        this.types = list.map(item => {
          return {
            value: `${item.label}`,
            key: `${item.value}`
          }
        })
      }
    },
    async getDepartments() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/getMyDepartment')
      const list = res.data.data
      if (list && list.length) {
        this.departments = list.map(item => {
          return {
            value: `${item.label}`,
            key: `${item.value}`
          }
        })
      }
    },
    reset() {
      this.form = {
        username: '',
        phone: '',
        orgName: '',
        content: '',
        level: '',
        fwdh: '',
        type: '',
        fk: ''
      }
    },
    async getDetail() {
      const res = await this.$http.get(
        `/yunwei/admin/wf/wfBxd/get?id=${this.$route.query.id}`
      )
      const { data } = res.data
      this.form = {
        ...data,
        createDate: data.createDate
          ? dateFormat(new Date(data.createDate), 'YYYY-MM-DD hh:mm:ss')
          : '',
        finishDate: data.finishDate
          ? dateFormat(new Date(data.finishDate), 'YYYY-MM-DD hh:mm:ss')
          : ''
      }
      this.title = res.data.data.fwdh ? `服务单号:${res.data.data.fwdh}` : ''
      if (res.data.data.status === '3') {
        this.readonly = true
      }
    },
    async submit() {
      if (this.$route.query.id) {
        this.temp = {
          id: this.form.id,
          status: this.form.status,
          username: this.form.username,
          phone: this.form.phone,
          orgName: this.form.orgName,
          content: this.form.content,
          level: this.form.level,
          fwdh: this.form.fwdh,
          type: this.form.type,
          fk: this.form.fk
        }
      }
      if (!this.form.content || !this.form.level) {
        this.showError = true
      } else {
        const res = this.$route.query.id
          ? await this.$http.post('/yunwei/admin/wf/wfBxd/edit', this.temp)
          : await this.$http.post('/yunwei/admin/wf/wfBxd/add', this.form)
        if (res.data && res.data.code) {
          // this.show = true
          this.form = {}
          this.temp = {}
          this.$router.push({ path: '/list' })
        }
      }
    }
  }
}
</script>
<style scoped>
.btn {
  width: 80%;
}
</style>

