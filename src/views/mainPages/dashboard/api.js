import http from '@/utils/http'
export function getLineGraph(applicationId) {
  return http({
    url: `/statistic/app/${applicationId}/execute-result/daily/line-graph`,
    method: 'get'
  })
}
export function getReferenceTree(applicationId) {
  return http({
    url: `/statistic/field/getReferenceTree/${applicationId}`,
    method: 'get'
  })
}
export function getLowHitRuleList(applicationId,params) {
  return http({
    url: `/statistic/app/${applicationId}/low-hit-rule/list`,
    method: 'get',
    params
  })
}
export function getLowHitRule(applicationId,limit) {
  return http({
    url: `/statistic/app/${applicationId}/low-hit-rule?limit=${limit}`,
    method: 'get'
  })
}
export function getPieChart(applicationId) {
  return http({
    url: `/statistic/app/${applicationId}/rule-type/pie-chart`,
    method: 'get'
  })
}

export function getReferenceList(data) {
  return http({
    url: `/statistic/field/getReferenceList`,
    method: 'post',
    data
  })
}
