import request from '@/utils/request'

import http from '@/utils/http'

// /decision/application 创建决策应用
export function createDecisionApplication(data) {
  return request({
    url: '/decision/application',
    method: 'post',
    data
  })
}

// /decision/application/exist 根据应用id查询决策应用信息
export function getDecisionApplication(data) {
  return request({
    url: '/decision/application/' + data,
    method: 'get'
  })
}

// /decision/bom 根据bomBaseInfoId获取生效bomModel包含注解的字段列表 新建决策应用查询维度列表
export function getBomModelDimList(data) {
  return request({
    url: '/decision/bom/' + data,
    method: 'get'
  })
}

// /decision/repository 查询决策库信息，包含决策库基本信息、业务模型信息、关联规则信息等
export function getDecisionRepositoryDetail(data) {
  return request({
    url: '/decision/repository?applicationId=' + data + '&isDeleted=0',
    method: 'get'
  })
}

// /decision/repository 查询决策库信息，包含决策库基本信息、业务模型信息、关联规则信息等
export function restoreRule(data) {
  return request({
    url: '/decision/repository?applicationId=' + data + '&isDeleted=1',
    method: 'get'
  })
}

// /decision/catalogue 创建决策目录
export function createDecisionCatalogue(data) {
  return request({
    url: '/decision/catalogue',
    method: 'post',
    data
  })
}

// /decision/repository 更新决策库名称信息
export function updateByFieldName(data) {
  return request({
    url: '/decision/repository',
    method: 'put',
    data
  })
}

// /decision/rule 保存规则编辑
export function saveRuleDefinedEdit(data) {
  return http({
    url: '/decision/rule',
    method: 'post',
    data
  }, true)
}

// /decision/rule 删除一条规则
export function deleteRuleDefinedEdit(data) {
  return request({
    url: `/decision/ruleDelOrRe?ruleId=${data.ruleId}&isDeleted=${data.isDeleted}`,
    method: 'post',
    data
  })
}

// /decision/rule 根据规则编号查询规则定义信息
export function getRuleDefinedByRuleId(data) {
  return request({
    url: '/decision/rule/' + data,
    method: 'get'
  })
}

// /decision/rule 根据规则编号查询规则定义信息
export function getRuleMethodByRuleId(bomModelId, ruleId) {
  return request({
    url: `/rule/method/${bomModelId}/${ruleId}/define`,
    method: 'get'
  })
}

// /predefine/rule 查询预定义信息
export function getPredefineByRuleId(ruleId) {
  return request({
    url: '/predefine/rule?ruleId=' + ruleId,
    method: 'get'
  })
}

// /predefine/check 校验人工输入的预定义信息是否准确
export function checkPredefine(data) {
  return request({
    url: '/predefine/check',
    method: 'post',
    data
  })
}

// /decision/rules/{applicationId}根据应用id查询对应决策库内的规则列表

export function getRuleList(id, params) {
  return request({
    url: `/decision/rules/${id}`,
    method: 'get',
    params
  })
}

// /decision/rule/details/{ruleId}根据规则编号查询路径维度详细信息

export function getRulePathList(id) {
  return request({
    url: `/decision/rule/details/${id}`,
    method: 'get'
  })
}

// /decision/appResults/{applicationId}根据应用id查询规则不通过结果定义列表

export function getRuleResults(data) {
  return request({
    url: '/decision/appResults/' + data,
    method: 'get'
  })
}

// /decision/application/list 查询决策应用列表
export function getApplicationList() {
  return request({
    url: '/decision/application/list',
    method: 'get'
  })
}

// /decision/dim 根据决策应用id查出当前决策应用下的维度
export function decisionDim(data) {
  return request({
    url: '/decision/dim/' + data,
    method: 'get'
  })
}

// /decision/copy/rule 复制规则
export function decisionCopyRule(data) {
  return request({
    url: '/decision/copy/rule',
    method: 'post',
    data
  })
}

// /decision/updateDecisionCatalogue 修改目录
export function updateDecisionCatalogue(data) {
  return request({
    url: '/decision/updateDecisionCatalogue',
    method: 'post',
    data
  })
}

// /decision/deleteDecisionCatalogue/{id}	删除决策目录名称
export function deleteDecisionCatalogue(id) {
  return request({
    url: '/decision/deleteDecisionCatalogue/' + id,
    method: 'get'
  })
}

// /decision/appDecisionDetails	查询所有的决策应用
export function getAppDecisionDetails(data) {
  return request({
    url: '/decision/getAllAppDecisionDetails',
    method: 'post',
    data
  })
}

// /decision/getBomDimById/{bomBaseInfoId} 通过id 查询所有的维度
export function getBomDimById(id) {
  return request({
    url: '/decision/getBomDimById/' + id,
    method: 'get'
  })
}

// /decision/createDecisionAppDim 添加维度

export function createDecisionAppDim(data) {
  return request({
    url: '/decision/createDecisionAppDim',
    method: 'post',
    data
  })
}

// 历史版本数据
export function getRuleHistory(ruleId, type) {
  return request({
    url: `/decision/rule/history/${ruleId}/${type}`,
    method: 'get'
  })
}

// 修改历史版本标签
export function updateHistoryTag(ruleDefinedHistoryId, data,type) {
  return request({
    url: `/decision/rule/history/${ruleDefinedHistoryId}/${type}?tag=${data}`,
    method: 'put'
  })
}

// /predefine 保存、更新预定义信息
export function saveOrUpdatePredefine(data) {
  return http({
    url: '/predefine',
    method: 'put',
    data
  })
}

// /decision/rule 保存决策表设置
export function saveDecisionTableSetting(data) {
  return request({
    url: '/decisionTable/setting',
    method: 'post',
    data
  })
}

// 根据查指定bom模型和决策库
export function getBomdecisionLib(id) {
  return request({
    url: '/authority/getDecisionRepIdNameAndBomIdNameInUserAuthority?bomBaseInfoId=' + id,
    method: 'get'
  })
}

// 规则执行比较API
export function ruleExecuteCompare(data) {
  return request({
    url: '/rule-execute-compare/compare',
    method: 'post',
    data
  })
}

// 获取规则执行比较的仓库信息
export function getCompareRepository(applicationId) {
  return request({
    url: `/rule-execute-compare/repository/${applicationId}`,
    method: 'get'
  })
}
