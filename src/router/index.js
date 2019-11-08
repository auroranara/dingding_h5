import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Detail from '@/components/Detail'
// import List from '@/components/List'
// import FeedBack from '@/components/FeedBack'
import Approval from '@/components/Approval'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/detail',
    //   name: '详情页',
    //   component: Detail
    // },
    // {
    //   path: '/',
    //   name: '登陆',
    //   component: Login
    // },
    // {
    //   path: '/list',
    //   component: List
    // },
    // {
    //   path: '/feedBack',
    //   component: FeedBack
    // }
    {
      path: '/',
      component: Approval
    }
  ]
})
