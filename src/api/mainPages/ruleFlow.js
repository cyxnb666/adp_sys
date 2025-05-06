import request from '@/utils/request'

// /pocBusinessProcess/checkFlowChart/{applicationId} 查询流程图信息

export function getRuleFlow(id) {
  return request({
    url: `/decisionFlowChart/checkFlowChart/${id}`,
    method: 'get'
  })
}

// 查询规则流列表
export function decisionFlowChartTabular(data) {
  return request({
    url: `/decisionFlowChart/tabular`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// 查询规则流详情
export function decisionFlowChartDetail(uid) {
  return request({
    url: `/decisionFlowChart/detail?flowSettingId=${uid}`,
    method: 'get'
  })
}

// 选择规则流列表
export function getChildFlowList(data) {
  return request({
    url: '/decisionFlowChart/getChildFlowList',
    method: 'get',
    params: {
      ...data
    }
  })
}
// 删除
export function delDecisionFlow(flowSettingId) {
  return request({
    url: `/decisionFlowChart/decisionFlow/${flowSettingId}`,
    method: 'DELETE'
  })
}

// 获取管理维度
export function findDimCombine(dimCombineId) {
  return request({
    url: `/decisionFlowChart/findDimCombine/${dimCombineId}`,
    method: 'get'
  })
}

export function decisionFlowChartDecisionFlow(data) {
  return request({
    url: `/decisionFlowChart/decisionFlowInDecUrl`,
    method: 'post',
    data
  })
}

export function decisionFlowSet(data) {
  return request({
    url: `/decisionFlowChart/tabular`,
    method: 'get',
    params: {
      ...data
    }
  })
}