import request from '@/utils/request'

// /decisionTree/saveOrUpdate 保存
export function decisionTreeSaveOrUpdate(data) {
  return request({
    url: '/decisionTree/saveOrUpdate',
    method: 'post',
    data
  })
}
// /decisionTree/saveOrUpdateTreeInDecUrl 规则设置决策路径决策树新增/保存
export function saveOrUpdateTreeInDecUrl(data) {
  return request({
    url: '/decisionTree/saveOrUpdateTreeInDecUrl',
    method: 'post',
    data
  })
}

// /decisionTree/saveOrUpdate 详情
export function decisionTreeGetDecisionTree(data) {
  return request({
    url: '/decisionTree/getDecisionTreeDetails',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /decisionTree/approvalDecisionTree 审批
export function decisionTreeApprovalDecisionTree(data) {
  return request({
    url: '/decisionTree/approvalDecisionTree',
    method: 'get',
    params: {
      ...data
    }
  })
}

//  列表
export function getDecisionTreeList(data) {
  return request({
    url: '/decisionTree/getDecisionTreeList',
    method: 'get',
    params: {
      ...data
    }
  })
}
//  规则设置决策路径下决策树列表
export function getDecisionTreeListInDecisionUrl(data) {
  return request({
    url: '/decisionTree/getDecisionTreeListInDecisionUrl',
    method: 'get',
    params: {
      ...data
    }
  })
}

//  待审批列表
export function getWaitApprovalDecisionTreeList(data) {
  return request({
    url: '/decisionTree/getWaitApprovalDecisionTreeList',
    method: 'get',
    params: {
      ...data
    }
  }) 
}

//  规则审批决策路径下决策树列表
export function getWaitApprovalDecisionTreeListInDecUrl(data) {
  return request({
    url: '/decisionTree/getWaitApprovalDecisionTreeListInDecUrl',
    method: 'get',
    params: {
      ...data
    }
  })
}

//  删除
export function deleteDecisionTree(data) {
  return request({
    url: '/decisionTree/deleteDecisionTree',
    method: 'get',
    params: {
      ...data
    }
  })
}
