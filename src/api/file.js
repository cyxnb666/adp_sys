import request from '@/utils/request'

// /import/decisionTable/{decisionRepositoryId} 导入决策表，并关联决策库
export function postDecisionRepositoryId(data) {
  return request({
    url: '/import/decisionTable/{decisionRepositoryId}',
    method: 'post',
    data
  })
}

// /export/decisionTable/{decisionTableId} 导出决策表
export function getDecisionRepositoryId(data) {
  return request({
    url: '/export/decisionTable/' + data,
    method: 'get'
  })
}

// /downloadAppExecuteResults downloadAppExecuteResults
export function downloadAppExecuteResults() {
  return request({
    url: '/downloadAppExecuteResults',
    method: 'get'
  })
}
