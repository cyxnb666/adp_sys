import request from '@/utils/request'

// /dim/code/data 获取维度的基础数据，根据用户权限设置过滤维度值
export function getDimCodeData(params) {
  return request({
    url: '/dim/code/data',
    method: 'get',
    params
  })
}
// /code/data/List 根据基础数据方法名查基础数据信息，多个method按方法名为key，结果为value返回
export function getCodeServiceList(data) {
  return request({
    url: '/code/data/List',
    method: 'get',
    params: {
      ...data
    }
  })
}
