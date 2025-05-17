import request from '@/utils/request'

// 保存评分卡（支持新增和更新）
export function saveScorecard(data) {
  return request({
    url: '/scorecard/save',
    method: 'post',
    data
  })
}

// 获取评分卡详情
export function getScorecardDetail(scorecardId) {
  return request({
    url: `/scorecard/detail/${scorecardId}`,
    method: 'get'
  })
}

// 删除评分卡
export function deleteScorecard(scorecardId) {
  return request({
    url: `/scorecard/delete/${scorecardId}`,
    method: 'delete'
  })
}

// 还原评分卡
export function restoreScorecard(scorecardId) {
  return request({
    url: `/scorecard/restore/${scorecardId}`,
    method: 'post'
  })
}

// 根据决策库ID获取评分卡列表
export function getScorecardsByRepository(decisionRepositoryId, keyword) {
  return request({
    url: `/scorecard/${decisionRepositoryId}`,
    method: 'get',
    params: { keyword }
  })
}

// 根据决策库目录ID获取评分卡列表
export function getScorecardsByCatalogue(decisionRepCatalogueId) {
  return request({
    url: `/scorecard/catalogue/${decisionRepCatalogueId}`,
    method: 'get'
  })
}

// 根据名称查询评分卡
export function getScorecardByName(data) {
  return request({
    url: `/scorecard/query?decisionRepCatalogueId=${data.decisionRepCatalogueId}&scorecardName=${data.scorecardName}`,
    method: 'get'
  })
}

// 执行评分卡
export function executeScorecard(data) {
  return request({
    url: '/scorecard/execute',
    method: 'post',
    data
  })
}

// 查询决策路径下的评分卡设置列表
export function getScorecardSettings(decisionUrlId, scorecardName) {
  return request({
    url: `/scorecard/setting/${decisionUrlId}`,
    method: 'get',
    params: { scorecardName }
  })
}

// 保存评分卡设置
export function postScorecardSetting(data) {
  return request({
    url: '/scorecard/setting',
    method: 'post',
    data
  })
}

// 更新评分卡设置信息
export function putScorecardSetting(data) {
  return request({
    url: '/scorecard/setting',
    method: 'put',
    data
  })
}

// 删除评分卡设置
export function deleteScorecardSetting(data) {
  return request({
    url: '/scorecard/setting',
    method: 'delete',
    data
  })
}

// 查询待审批的评分卡设置
export function getScorecardForApproval(decisionUrlId) {
  return request({
    url: `/scorecard/forApproval/${decisionUrlId}`,
    method: 'get'
  })
}

// 审批评分卡
export function postScorecardApproval(data) {
  return request({
    url: '/scorecard/approval',
    method: 'post',
    data
  })
}
