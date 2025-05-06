import request from '@/utils/request'

// /adp/app/execute 查询决策路径by决策id
export function getRuleExecutionDetails(data) {
  return request({
    url: `/bom/details/getRuleExecutionDetails/${data}`,
    method: 'get'
  })
}

// /adp/app/execute 查询决策路径by决策id
export function ruleSingleTestHistoryExecuteData(data) {
  return request({
    url: `/test/ruleSingleTestHistoryExecuteData`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// /test/ruleSingleTest单条规则测试
export function ruleSingleTest(data) {
  return request({
    url: '/test/ruleSingleTest',
    method: 'post',
    data
  })
}

// /test/ruleSingleTest单条决策表测试
export function TableSingleTest(data) {
  return request({
    url: '/test/tableSingleTest',
    method: 'post',
    data
  })
}

// /test/ruleSingleTest单条决策表测试
export function FlowSingleTest(data) {
  return request({
    url: '/test/flowSingleTest',
    method: 'post',
    data
  })
}

//  查询决策路径by决策id
export function getRuleSingleTestDetailData(data) {
  return request({
    url: `/test/ruleSingleTestDetailData`,
    method: 'get',
    params: {
      ...data
    }
  })
}
