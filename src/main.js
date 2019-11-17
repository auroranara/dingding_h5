// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import { AjaxPlugin, AlertPlugin } from 'vux'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(AjaxPlugin)
Vue.use(VueRouter)
Vue.use(AlertPlugin)
Vue.use(ElementUI)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app-box')
