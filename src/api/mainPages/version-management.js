import request from '@/utils/request'

// /version/creation 查询决策路径by决策id
export function PostVersion(data) {
  return request({
    url: '/version/creation',
    method: 'post',
    data
  })
}

// /version/dims 根据维度组合编号和应用编号查询维度信息
export function GetVersionDims(data) {
  return request({
    url: '/version/dims',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/info 根据版本id获取版本信息
export function GetVersionInfo(data) {
  return request({
    url: '/version/info',
    method: 'get',
    params: {
      ...data
    }
  })
}

// List 版本查询
export function GetVersionList(data) {
  return request({
    url: '/version/list',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/dim/comparison 维度管理对比
export function GetVersionDimComparison(data) {
  return request({
    url: '/version/dim/comparison',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/deci/url/comparison 决策路徑对比
export function GetVersionPathComparison(data) {
  return request({
    url: '/version/deci/url/comparison',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/rule/comparison 决策规则对比
export function GetVersionRulDetailComparison(data) {
  return request({
    url: '/version/rule/comparison',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/{applicationId}查询版本
export function GetVersion1List(data) {
  return request({
    url: '/version/' + data.applicationId + '/' + data.versionId,
    method: 'get',
    params: {
      ...data
    }
  })
}

// /version/{applicationId}创建版本
export function CreateVersion(data) {
  return request({
    url: '/version/' + data.applicationId,
    method: 'post',
    data
  })
}
// /version/{applicationId}/{versionId} 删除版本
export function DeleteVersion1List(data) {
  return request({
    url: '/version/' + data.applicationId + '/' + data.versionId,
    method: 'DELETE'
  })
}

//  /version/compare/{applicationId}/{mainVersionId}/{otherVersionId}比较版本
export function CompareVersion(data) {
  return request({
    url: '/version/compare/' + data.applicationId + '/' + data.mainVersionId + '/' + data.otherVersionId,
    method: 'get'
  })
}

// /version/{applicationId}/recover/{versionId}
export function RestoreVersion(data) {
  return request({
    url: '/version/' + data.applicationId + '/recover/' + data.versionId,
    method: 'post',
    data
  })
}

// /version/{applicationId}/present-version 查询当前版本
export function GetPresentVersion(data) {
  return request({
    url: '/version/' + data + '/present-version',
    method: 'get'
  })
}
