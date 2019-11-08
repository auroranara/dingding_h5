// import Vue from 'vue'
import axios from 'axios'
console.log(process.env.BASE_API)
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // 请求超时时间
  timeout: 5000,
  transformRequest: [
    function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        let val = data[it]
        if (val && typeof val === 'object') {
          val = JSON.stringify(val)
        }
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(val) + '&'
      }
      return ret
    }
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// // request拦截器
// service.interceptors.request.use(
//   config => {
//     // Do something before request is sent
//     // if (store.getters.token) {
//     //   config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//     // }
//     return config
//   },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )

// // respone拦截器
// service.interceptors.response.use(
//   response => {
//     /**
//      * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
//      * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
//      */
//     const res = response.data
//     return res
//   },

//   error => {
//     console.log('err' + error) // for debug
//     return Promise.reject(error)
//   }
// )

export default service
