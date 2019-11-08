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
