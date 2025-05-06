import request from '@/utils/request'
import http from '@/utils/http'

// /decisionTable/{applicationId} 根据应用编号查询对应决策库内的决策表列行
export function GetDecisionTableList(data) {
  return request({
    url: `/decisionTable/${data.applicationId}?keyword=${data.keyword}`,
    method: 'get',
    data
  })
}

// /decisionTable/setting/{decisionUrlId} 查询决策路径下的决策表列表
export function GetDecisionTable(data) {
  return request({
    url: `/decisionTable/setting/${data.decisionUrlId}?decisionTableName=${data.decisionTableName}`,
    method: 'get',
    data
  })
}

// //  查询决策表
export function FindDecisionTable(data) {
  return request({
    url: `/decisionTable/query?applicationId=${data.applicationId}&decisionTableName=${data.decisionTableName}`,
    method: 'get',
    data
  })
}

// //  获取条件列数据
export function getDecisionTableCondition() {
  return request({
    url: `/decisionTable/getDecisionTableCondition`,
    method: 'get'
  })
}
// //  获取规则数据
export function getRuleDefinedByTableId(data) {
  return request({
    url: `/decision/rule/getRuleDefinedByTableId`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// /decisionTable/setting 保存决策表设置
export function PostDecisionTableList(data) {
  return request({
    url: '/decisionTable/setting',
    method: 'post',
    data
  })
}

// /decisionTable/setting/{decisionTableSettingId} 删除决策表设置
export function DeleteDecisionTable(data) {
  return request({
    url: '/decisionTable/delOrReTable?tableId=' + data.tableId + '&isDeleted=' + data.isDeleted,
    method: 'post',
    data
  })
}

// /decisionTable/setting 更新决策表设置信息
export function PutDecisionTable(data) {
  return request({
    url: '/decisionTable/setting',
    method: 'put',
    data
  })
}

// /decisionTable/forApproval/{decisionUrlId} 根据决策路径id查询待审批的决策表设置信息
export function GetDecisionTableForApproval(data) {
  return request({
    url: '/decisionTable/forApproval/' + data,
    method: 'get'
  })
}

// /decisionTable/approval 审批决策表
export function PostDecisionTableApproval(data) {
  return request({
    url: '/decisionTable/approval',
    method: 'post',
    data
  })
}

// // /decisionTable/info/{decisionTableId} 规则编辑->导入的决策表删除
// export function deleteDecisionTable(data) {
//   return request({
//     url: '/decisionTable/info/' + data,
//     method: 'delete'
//   })
// }

//  /decisionTable/adjustDTOrder  决策表排序上移
export function adjustDTOrder(data) {
  return request({
    url: '/decisionTable/adjustDTOrder',
    method: 'post',
    data
  })
}

// /decision/submitRuleName 修改规则决策名称
export function submitRuleName(id, name) {
  return request({
    url: '/decisionTable/' + id + '?name=' + name,
    method: 'put'
  })
}
// /decisionTable/edit 修改决策表（老）
export function decisionTableEdit(data) {
  return request({
    url: '/decisionTable/edit',
    method: 'put',
    data
  })
}
// /decisionTable/addDecisionTableWithRule 修改决策表（旧10.17）
export function addDecisionTableWithRule(data) {
  return request({
    url: '/decisionTable/addDecisionTableWithRule',
    method: 'post',
    data
  })
}
export function addNewDecisionTableWithRule(data) { // 保存决策表
  return request({
    url: '/decisionTable/saveComplicatedDecisionTable',
    method: 'post',
    data
  })
}
export function viewDecisionTableWithRule(data) { // 决策表列表
  return http({
    url: '/decisionTable/viewDecisionTable',
    method: 'get',
    params: {
      ...data
    }
  })
}

export function getDecisionTableVersion(data) { // 决策表数据类型
  return http({
    url: '/decisionTable/getDecisionTableVersion',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /decisionTable/forApproval/{decisionUrlId} 根据决策路径id查询待审批的决策表设置信息
export function getDecisionTableSetting(decisionUrlId, condition) {
  return request({
    url: '/decisionTable/setting/' + decisionUrlId + '?decisionTableName=' + condition,
    method: 'get'
  })
}

// /decisionTable/settingDetail/{decisionUrlId} 根据ruleID获取决策表规则设置详情
export function getDecisionTableSettingDetail(decisionUrlId, decisionTableId) {
  return request({
    url: `/decisionTable/settingDetail?decisionUrlId=${decisionUrlId}&decisionTableId=${decisionTableId}`,
    method: 'get'
  })
}

// /decisionFlowChart/decisionFlowApprovalInDecUrl 规则审批-决策路径-审核-规则流审批
export function decisionFlowApprovalInDecUrl(data) {
  return request({
    url: `/decisionFlowChart/decisionFlowApprovalInDecUrl`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// /decisionTree/approvalDecisionTreeInDecUrl 规则审批-决策路径-审核-规则树审批
export function approvalDecisionTreeInDecUrl(data) {
  return request({
    url: `/decisionTree/approvalDecisionTreeInDecUrl`,
    method: 'get',
    params: {
      ...data
    }
  })
}

