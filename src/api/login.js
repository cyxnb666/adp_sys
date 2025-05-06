import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function generateKey() {
  return request({
    url: '/login/generateKey',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
