<template>
  <div>
    <!-- <tab>
      <tab-item selected @on-item-click="onItemClick">安装单</tab-item>
      <tab-item @on-item-click="onItemClick">维修单</tab-item>
    </tab> -->
    <!-- <group style="margin-top:32px">
      <datetime v-model="listQuery.start" default-selected-value="2017-06-18" format="YYYY-MM-DD" placeholder="请选择" title="开始时间"></datetime>
      <datetime v-model="listQuery.end" default-selected-value="2017-06-18" format="YYYY-MM-DD" placeholder="请选择" title="结束时间"></datetime>
    </group> -->
    <divider></divider>
    <flexbox>
      <flexbox-item>
        <x-button type="primary" style="width:85%" @click.native="logout">退出</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button style="width:85%" @click.native="handleAdd">添加</x-button>
      </flexbox-item>
    </flexbox>

    <button-tab style="margin-top:32px;padding: 0 8px">
      <button-tab-item selected @on-item-click="reported">已上报</button-tab-item>
      <button-tab-item @on-item-click="unReported">处理中</button-tab-item>
      <button-tab-item @on-item-click="notHandle">已完成</button-tab-item>
    </button-tab>
    <div style="padding:12px 0;min-height:500px;overflow:auto">
      <template>
        <panel :type="type" :list="list" @on-click-item="handleEdit">
        </panel>
      </template>
    </div>
  </div>
</template>
<script>
let levels = []
let departments = []
import {
  Tab,
  TabItem,
  Sticky,
  Divider,
  XButton,
  Swiper,
  SwiperItem,
  Group,
  Datetime,
  ButtonTab,
  ButtonTabItem,
  Card,
  Panel,
  Flexbox,
  FlexboxItem,
  XHeader,
  dateFormat
} from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
    Group,
    Datetime,
    ButtonTab,
    ButtonTabItem,
    Card,
    Panel,
    Flexbox,
    FlexboxItem,
    XHeader
  },
  data() {
    return {
      listQuery: {
        start: '',
        end: ''
      },
      type: '5',
      temp: [],
      list: [],
      histCount: 0,
      todoCount: 0
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getLevels()
      await this.getDepartments()
      await this.getList()
    },
    async getList() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/listMine', {
        params: this.listQuery
      })
      this.temp = []
      if (res.data && res.data.code === 200) {
        const list = res.data.data
        list.forEach(row => {
          const temp = departments.find(item => item.value === row.orgName)
          row.departmentName = temp ? temp.label : ''
        })
        this.temp = list
        this.reported()
      }
    },
    async getLevels() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/getLevel')
      levels = res.data.data
    },
    async getDepartments() {
      const res = await this.$http.get('/yunwei/admin/wf/wfBxd/getMyDepartment')
      departments = res.data.data
    },
    onItemClick(index) {
      console.log('on item click:', index)
    },
    handleEdit(item) {
      console.log(item)
    },
    handleAdd() {
      this.$router.push({
        path: '/detail'
      })
    },
    levelFilter(value) {
      const result = levels.find(item => item.value === value)
      return result ? result.label : ''
    },
    processData(arr) {
      this.resetlist()
      if (arr && arr.length) {
        arr.forEach(result => {
          const levelContent = this.levelFilter(result.level)
          const item = {}
          item.title = `${result.content}`
          item.desc = `报修部门: ${result.departmentName} </br>`
          item.desc += `故障分级: ${levelContent} </br>`
          item.src = `/yunwei/static/status${result.status}.png`

          let date = ''
          switch (result.status) {
            case '1':
              date = `故障上报: ${
                result.createDate
                  ? dateFormat(new Date(result.createDate), 'YY-MM-DD hh:mm:ss')
                  : ''
              } </br>`
              break
            case '2':
              date = `维保接单: ${
                result.receiveDate
                  ? dateFormat(
                      new Date(result.receiveDate),
                      'YY-MM-DD hh:mm:ss'
                    )
                  : ''
              } </br>`
              break
            case '3':
              date = `维修完成: ${
                result.finishDate
                  ? dateFormat(new Date(result.finishDate), 'YY-MM-DD hh:mm:ss')
                  : ''
              } </br>`
              break
            default:
          }
          item.meta = {
            source: `${result.username}`,
            date: `${result.phone}`,
            other: date
          }
          item.url = `/detail?id=${result.id}`
          this.list.push(item)
        })
      }
    },
    logout() {
      this.$http.get('/yunwei/admin/logout')
      this.$router.push({ path: '/' })
      sessionStorage.removeItem('userInfo')
    },
    reported() {
      this.resetlist()
      let arr = []
      if (this.temp && this.temp.length) {
        arr = this.temp.filter(temp => temp.status === '1')
      }
      this.processData(arr)
    },
    unReported() {
      this.resetlist()
      let arr = []
      if (this.temp && this.temp.length) {
        arr = this.temp.filter(temp => temp.status === '2')
      }
      this.processData(arr)
    },
    notHandle() {
      this.resetlist()
      let arr = []
      if (this.temp && this.temp.length) {
        arr = this.temp.filter(temp => temp.status === '3')
      }
      this.processData(arr)
    },
    resetlist() {
      this.list = []
    }
  }
}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';
.box {
  padding: 15px;
}
.active-6-1 {
  color: rgb(252, 55, 140) !important;
  border-color: rgb(252, 55, 140) !important;
}
.active-6-2 {
  color: #04be02 !important;
  border-color: #04be02 !important;
}
.active-6-3 {
  color: rgb(55, 174, 252) !important;
  border-color: rgb(55, 174, 252) !important;
}
.tab-swiper {
  background-color: #fff;
  height: 100px;
}
</style>
