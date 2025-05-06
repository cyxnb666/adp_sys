import request from '@/utils/request'

// /authority/orgInfoRel 获取机构关系列表树结构
export function AuthorityOrgInfoRel(data) {
  return request({
    url: '/authority/orgInfoRel/',
    method: 'get',
    data
  })
}

// /authority/orgList 获取机构信息列表扁平集合
export function AuthorityOrgList(data) {
  return request({
    url: '/authority/orgInfoRel/',
    method: 'get',
    data
  })
}

// /authority/roles 获取角色列表和相关属性
export function AuthorityRoles(data) {
  return request({
    url: '/authority/roles/',
    method: 'get',
    data
  })
}

// /authority/roleAttr/{roleId} 根据角色编码获取角色属性
export function AuthorityRoleAttr(data) {
  return request({
    url: '/authority/roleAttr/' + data,
    method: 'get'
  })
}

// /authority/apply/attr 申请权限及属性
export function AuthorityApplyAttr(data) {
  return request({
    url: '/authority/apply/attr',
    method: 'post',
    data
  })
}

// /authority/pendingApproval 管理员分页获取待审批的用户权限列表
export function AuthorityPendingApproval(data) {
  return request({
    url: '/authority/pendingApproval',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /authority/self 获取个人权限申请信息
export function AuthoritySelf(data) {
  return request({
    url: '/authority/self',
    method: 'post',
    data
  })
}

// /authority/pendingApproval/{userAuthorityId} 删除待审批的权限申请信息
export function deleteAuthorityPendingApproval(userAuthorityId) {
  return request({
    url: '/authority/pendingApproval/' + userAuthorityId,
    method: 'delete'
  })
}

// /authority/applications 获取应用定义列表
export function getAuthorityApplications() {
  return request({
    url: '/authority/applications',
    method: 'get'
  })
}

// /authority/dims/{applicationId} 根据应用编号查询维度定义信息
export function getAuthorityDims(applicationId) {
  return request({
    url: '/authority/dims/' + applicationId,
    method: 'get'
  })
}

// /authority/codeService 根据codeService查询基础数据列表
export function getAuthorityCodeService(data) {
  return request({
    url: '/authority/codeService',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /authority/detail/{userAuthorityId} 获取用户申请权限详情
export function getAuthorityDetail(userAuthorityId) {
  return request({
    url: '/authority/detail/' + userAuthorityId,
    method: 'get'
  })
}

// /authority/approval 用户权限申请审批
export function postAuthorityApproval(data) {
  return request({
    url: '/authority/approval',
    method: 'post',
    data
  })
}
// /authority/getUserAppAuthorityList 获取应用权限列表
export function getUserAppAuthorityList() {
  return request({
    url: '/authority/getUserAppAuthorityList',
    method: 'get'
  })
}

// /authority/decision-repository/root-catalogue/{bomBaseInfoId}  获取bom关联的决策库根目录信息
export function getRootCatalogue(data) {
  return request({
    url: '/authority/decision-repository/root-catalogue/' + data,
    method: 'get'
  })
}

// /authority/decision-repository/catalogue/{applicationId}/approved 获取已经审批完成的决策库目录数据
export function getApprovedRootCatalogue(data) {
  return request({
    url: `/authority/decision-repository/catalogue/${data}/approved`,
    method: 'get'
  })
}
