import request from '@/utils/request'

// /statistic/appExecuteResult 统计应用执行结果信息 饼图
export function appExecuteResult(data) {
  return request({
    url: '/statistic/appExecuteResult',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /statistic/ruleSetting 查询规则设置统计信息
export function appRuleSetting(data) {
  return request({
    url: '/statistic/ruleSetting',
    method: 'get',
    params: {
      ...data
    }
  })
}

// statistic/realTime/curve  实时获取1分钟执行统计数据
export function getStatistRealTime(data) {
  return request({
    url: '/statistic/realTime/curve',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /statistic/curve/{applicationId} 曲线图统计
export function getStatist(data) {
  return request({
    url: '/statistic/curve/' + data,
    method: 'get'
  })
}

// /statistic/app/executeResult 查询应用执行结果清单
export function getAppExecuteResultsList(data) {
  return request({
    url: '/statistic/app/executeResult',
    method: 'post',
    data
  })
}

// /app/executeResult/details/  获取执行清单的详细信息
export function getAppExecuteResultDetail(data) {
  return request({
    url: '/statistic/app/executeResult/details/',
    method: 'post',
    data
  })
}

// /app/executeResult/details/  获取操作历史记录
export function getUserOperations(data) {
  return request({
    url: '/user/getUserOperations',
    method: 'post',
    data
  })
}

