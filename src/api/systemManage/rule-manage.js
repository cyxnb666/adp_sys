import request from '@/utils/request'
import http from '@/utils/http'

// /rule/generateRuleSettingId 生成决策规则编号
export function getRuleSettingId() {
  return request({
    url: '/rule/generateRuleSettingId',
    method: 'get'
  })
}

// 查询表达式接口：/rule/expressions/type 参数：bomBaseInfoId、type、actualTypes get请求  根据字段查表达式列表
export function getExpressionsListByActualTypes(data) {
  return request({
    url: '/rule/expressions/type',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /rule/expressions  查询所有表达式列表
export function getRuleExpressionsAll() {
  return request({
    url: '/rule/expressions',
    method: 'get'
  })
}

// /rule/operators/arithmetic 查询算术运算符列表
export function getOperatorsArithmetic() {
  return request({
    url: '/rule/operators/arithmetic',
    method: 'get'
  })
}

// /rule/operators/comparison  查询比较运算符列表
export function getComparisonOperators() {
  return request({
    url: '/rule/operators/comparison',
    method: 'get'
  })
}

// /rule/{decisionUrlId}/settings 根据决策路径id查询规则列表
export function getRuleSetting(data) {
  return request({
    url: `/rule/${data}/settings`,
    method: 'get'
  })
}

// /rule/saveRuleSettings
export function pushRuleSettings(data) {
  return request({
    url: '/rule/saveRuleSettings',
    method: 'post',
    data
  })
}

// /rule/method/setting 规则设置方法
export function pushExpressionList(data) {
  return request({
    url: '/rule/method/setting',
    method: 'post',
    data
  })
}

// /rule/method/setting 规则设置方法
export function settingExpressionList(data) {
  return http({
    url: '/rule/method/define',
    method: 'post',
    data
  })
}

// /rule/method/{decisionUrlId}/{ruleId}/settings 使用决策路径Id和规则Id查询规则设置的执行方法
export function getMethodSetting(data) {
  return request({
    url: `/rule/method/${data.decisionUrlId}/${data.ruleId}/settings`,
    method: 'get'
  })
}

// /rule/method/{bomModelId}/{ruleId}/define 使用规则Id查询规则编辑时设置的执行方法
export function getMethodSettingDefine(data) {
  return request({
    url: `/rule/method/${data.bomModelId}/${data.ruleId}/define`,
    method: 'get'
  })
}
// /rule/getRule/{applicationId} 获取规则列表
export function getRuleList(data) {
  return request({
    url: `/rule/getRule/${data.applicationId}?searchVal=${data.searchVal}`,
    method: 'get'
  })
}
// /rule/export/{applicationId}导出规则
export function exportRule(data) {
  return request({
    url: `/rule/export/${data.applicationId}?ruleIds=${data.ruleIds}`,
    method: 'get'
  })
}
// /rule/import/{applicationId}导入规则
export function importRule(data) {
  return request({
    url: `/rule/import/${data.applicationId}?definedFlag=${data.definedFlag}&&releaseFlag=${data.releaseFlag}`,
    method: 'put',
    data
  })
}
// /rule/getImportResult/{applicationId}获取导入结果
export function getImportResult(data) {
  return request({
    url: `/rule/getImportResult/${data.applicationId}`,
    method: 'get'
  })
}
export function getImportResultDetails(id) {
  return request({
    url: `/rule/getImportResultDetails/${id}`,
    method: 'get'
  })
}

// 根据决策路径id查询规则列表(分页
export function queryRuleSetting(decisionUrlId, data) {
  return request({
    url: `/rule/${decisionUrlId}/queryRuleSetting`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// 根据决策路径id查询规则
export function queryRuleSettingRuleIds(decisionUrlId) {
  return request({
    url: `/rule/${decisionUrlId}/queryRuleSettingRuleIds`,
    method: 'get'
  })
}
// /rule/decisionUrlId1/getRuleSettingDetail 查询决策路径下单人规则设置的详情
export function getRuleSettingDetail(decisionUrlId, id) {
  return request({
    url: `/rule/${decisionUrlId}/getRuleSettingDetail?ruleSettingId=${id}`,
    method: 'get'
  })
}
// /rule/decisionUrlId1/getRuleDefinedDetail 查询规则流规则设置的详情
export function getRuleDefinedDetail(ruleId) {
  return request({
    url: `/decision/getRuleDefinedDetail?ruleId=${ruleId}`,
    method: 'get'
  })
}

// 新增或更新流规则流
export function decisionFlowChartDecisionFlow(data) {
  return request({
    url: '/decisionFlowChart/decisionFlow',
    method: 'post',
    data
  })
}

// 上传决策表
export function uploadDecisionTable(data) {
  return request({
    url: '/import/decisionTable',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}
