import request from '@/utils/request'


// 获取所有的baseType
export function getCodeType() {
  return request({
    url: '/code/type',
    method: 'get'
  })
}

// 新增一个base data，其中baseType, baseCode, baseName, baseRemark等字段必须设置
export function updateCodeData (data) {
  return request({
    url: '/code/data/',
    method: 'post',
    data
  })
}

// 根据基础数据baseType获取对应的基础代码数据
export function getCodeData(data) {
  return request({
    url: `/code/data/${data}`,
    method: 'get',
  })
}

// 删除一个base data，使用baseDataId
export function deleteCodeData(baseDataId) {
  return request({
    url: `/code/data/${baseDataId}`,
    method: 'delete'
  })
}


