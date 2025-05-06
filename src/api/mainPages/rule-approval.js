import request from '@/utils/request'

// /rule/approval/tabular 决策规则管理--待审核列表
export function GetRuleApprovalList(data) {
  return request({
    url: '/rule/approval/tabular',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /rule/approval/{decisionUrlId} 根据决策路径查询待审核的规则列表
export function GetRuleApprovalTabular(data) {
  return request({
    url: '/rule/approval/' + data,
    method: 'get'
  })
}

// PUT /rule/approval 决策规则批量审核
export function PutRuleApproval(data) {
  return request({
    url: '/rule/approval',
    method: 'put',
    data
  })
}

// /rule/approval/return 决策规则批量退回修改
export function PutRuleApprovalReturn(data) {
  return request({
    url: '/rule/approval/reject',
    method: 'put',
    data
  })
}

// /decisionFlowChart/approvalTabular 规则流管理--待审核列表
export function getDecisionFlowList(data) {
  return request({
    url: '/decisionFlowChart/approvalTabular',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /decisionFlowChart/approval 规则流管理-- 审核规则
export function decisionFlowChartApproval(data) {
  return request({
    url: '/decisionFlowChart/approval',
    method: 'get',
    params: {
      ...data
    }
  })
}
