import request from '@/utils/request'

// /deci/url/node/field  获取当前维度组合下可以成为决策路径的属性
export function deciurlField(data) {
  return request({
    url: '/deci/url/node/field',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /deci/url/tabular  根据当前组合维度获取该维度下的决策路径用表格展示
export function deciurlTabular(data) {
  return request({
    url: '/deci/url/tabular',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /deci/url 保存决策路径
export function PostDeciurl(data) {
  return request({
    url: '/deci/url',
    method: 'post',
    data
  })
}

// /deci/url 删除空的决策路径(老)
export function delDeciurl(id) {
  return request({
    url: `/deci/url/tabular/${id}`,
    method: 'delete'
  })
}
// /deci/url 删除空的决策路径(新)
export function deleteDecisionTreeInDecURL(data) {
  return request({
    url: `/decisionTree/deleteDecisionTreeInDecURL`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// /deci/url/node/list 查询决策路径by决策id
export function GetCurrentDecisionPath(data) {
  return request({
    url: '/deci/url/node/list',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /deci/url/findDecisionUrlIdIdByDim/{decisionUrlId}  根据决策路径ID查询所在维度信息
export function GetFindDecisionUrlIdIdByDim(data) {
  return request({
    url: `/deci/url/findDecisionUrlIdIdByDim/${data}`,
    method: 'get'
  })
}
