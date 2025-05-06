import http from '@/utils/http'
export function getExpressionList(params) {
  return http({
    url: `/rule/expression/list`,
    method: 'get',
    params
  })
}

export function addExpression(data) {
  return http({
    url: `/rule/expression`,
    method: 'post',
    data
  })
}
export function editExpression(data,expressionId) {
  return http({
    url: `/rule/expression/${expressionId}`,
    method: 'put',
    data
  })
}

export function delExpression(expressionId) {
  return http({
    url: `/rule/expression/${expressionId}`,
    method: 'delete',
  })
}
export function publishExpression(expressionId) {
  return http({
    url: `/rule/expression/${expressionId}/publish`,
    method: 'put',
  })
}
