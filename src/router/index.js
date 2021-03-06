import Vue from 'vue';
import Router from 'vue-router';
// import Approval from '@/components/Approval'
import Approval from '@/pages/approval/index';
import Result from '@/pages/result/index';
import Show from '@/pages/show/index';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '审批',
      component: Approval
    },
    {
      path: '/result',
      name: '结果',
      component: Result
    },
    {
      path: '/show',
      name: '展示',
      component: Show
    },
  ]
})
