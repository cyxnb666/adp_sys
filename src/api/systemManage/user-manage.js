import request from '@/utils/request'

import http from '@/utils/http'

// /user 获取用户信息
export function getUser(data) {
  return request({
    url: '/user',
    method: 'get'
  })
}

// /user/update/pwd 修改用户密码
export function UserUpdatePwd(data) {
  return request({
    url: '/user/update/pwd',
    method: 'post',
    data
  })
}

// /user/list 分页查询用户列表，用户编号、姓名可模糊查询
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /user/{userId} 根据用户编号获取用户信息详情
export function getUserDetail(data) {
  return request({
    url: '/user/' + data,
    method: 'get'
  })
}

// /user/reset/password/{userId} 重置用户密码，并返回新密码
export function UserResetPwd(data) {
  return request({
    url: '/user/reset/password/' + data,
    method: 'post'
  })
}

// /user 创建用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// /user/status/{userId}/{userStatus} 修改用户状态
export function UserStatus(data) {
  return request({
    url: '/user/status/' + data.userId + '/' + data.userStatus,
    method: 'put'
  })
}

// /user/updateRoles 修改用户角色编码列表
export function UserUpdateRoles(data) {
  return request({
    url: '/user/updateRoles/',
    method: 'put',
    data
  })
}

// /ar/batchResult/page
export function getBatchResult(data) {
  return http({
    url: '/ar/batchResult/page',
    method: 'post',
    data
  })
}

// /ar/batchResult/page
export function getBatchResultSync(data) {
  return request({
    url: '/ar/batchResult/sync',
    method: 'post',
    data
  })
}

// /ar/batchRun
export function arBatchRun(data) {
  return request({
    url: '/ar/batchRun',
    method: 'post',
    data
  })
}

// /ar/batchResult/export
export function arBatchResultExport(data) {
  return request({
    url: '/ar/batchResult/export',
    method: 'post',
    data
  })
}

// /user/list 分页查询用户列表，用户编号、姓名可模糊查询
export function getSchedule(data) {
  return request({
    url: '/ar/batchResult/schedule?applicationId=' + data,
    method: 'get'
  })
}

// /user/list 查询二级机构三级渠道
export function getCodeValue(data) {
  return request({
    url: '/ar/batchResult/getCodeValue',
    method: 'get'
  })
}
