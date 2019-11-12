import fetch from '@/request'
export function login(data) {
  return fetch({
    url: '/yunwei/admin/login',
    method: 'post',
    data
  })
}
export function fetchFeedBack(query) {
  const data = { fwdh: query }
  return fetch({
    url: '/yunwei/admin/wf/wfSatisfaction/get',
    method: 'get',
    params: data
  })
}
export function saveFeedBack(data) {
  return fetch({
    url: '/yunwei/admin/wf/wfSatisfaction/add',
    method: 'post',
    params: data
  })
}
export function fetchAccessToken(params) {
  return fetch({
    url: 'http://114.55.242.193:18080/api/dd/getAccessToken',
    method: 'get',
    params
  })
}

// export function fetchJsapiTicket(params) {
//   return fetch({
//     url: '',
//     method: 'get',
//     params,
//   })
// }
