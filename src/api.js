import fetch from '@/request';
const HOST = 'http://114.55.242.193:18080'
// export function login(data) {
//   return fetch({
//     url: '/yunwei/admin/login',
//     method: 'post',
//     data
//   })
// }
// export function fetchFeedBack(query) {
//   const data = { fwdh: query }
//   return fetch({
//     url: '/yunwei/admin/wf/wfSatisfaction/get',
//     method: 'get',
//     params: data
//   })
// }
// export function saveFeedBack(data) {
//   return fetch({
//     url: '/yunwei/admin/wf/wfSatisfaction/add',
//     method: 'post',
//     params: data
//   })
// }
export function fetchAccessToken (params) {
  return fetch({
    url: `${HOST}/api/dd/getAccessToken`,
    method: 'get',
    params
  })
}

// 获取计算好的ticket
export function fetchJsapiTicket (params) {
  return fetch({
    url: `${HOST}/api/dd/getJsApiTicket`,
    method: 'get',
    params,
  })
}

// 获取签名参数
export function fetchSign (data) {
  return fetch({
    url: `${HOST}/api/dd/getSign`,
    method: 'post',
    data
  })
}

// 获取userId 参数authCode
export function fetchUserId (params) {
  return fetch({
    url: `${HOST}/api/dd/getuserinfobyauthcode`,
    method: 'get',
    params,
  })
}

// 上传附件 参数fileauthCode userId
export function uploadFile (data) {
  return fetch({
    url: `${HOST}/api/processinstance/upload`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 20000
  })
}
