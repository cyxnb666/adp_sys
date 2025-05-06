import request from '@/utils/request'

// 创建 业务对象模型
export function createBom(data) {
  return request({
    url: '/bom',
    method: 'post',
    data
  })
}

// /bom/id 查询系统生成id
export function getSystemId() {
  return request({
    url: '/bom/id',
    method: 'get'
  })
}

// /bom/info 获取所有课用的Bom业务对象基本模型
export function getAllBomBaseInfo() {
  return request({
    url: '/bom/info',
    method: 'get'
  })
}

// bom/getBomBaseInfo 通过 Bom对象Id获取 业务对象模型（BOM —— Business Object Model）
export function getBomBaseInfo(data) {
  return request({
    url: '/bom',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/info 通过 Bom对象Id修改 业务对象模型的基本信息
export function updateBomBaseInfo(data) {
  return request({
    url: '/bom/info',
    method: 'put',
    data
  })
}

// /bom/details/info 根据 bomBaseInfoId 获取有效的 bomModel 里的详细情况
export function getTheBomModelDetail(data) {
  return request({
    url: '/bom/details/info',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/details 根据bomBaseInfoId 加载所有类和字段
export function bomClassAndField(data) {
  return request({
    url: '/bom/details',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/getUpateDate 通过BomBaselnfold获取Bom最新更新时间
export function getbomClassAndUpdateTime(data) {
  return request({
    url: '/bom/getUpateDate?bomBaseInfoId=' + data,
    method: 'get'
  })
}

// /bom/details/class 根据类路径 和 bomBaseInfoId加载类的所有字段
export function ClassDetail(data) {
  return request({
    url: '/bom/details/class',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/details/field 修改业务模型对象中字段的中文名字
export function FieldName(data) {
  return request({
    url: '/bom/details/field',
    method: 'put',
    data
  })
}

// 接口：/bom/details/class/fields  参数：classPath get请求
export function getCodeServiceListByclassPath(data) {
  return request({
    url: '/bom/details/class/fields',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /codedatas 根据基础数据方法名查基础数据信息，多个method按方法名为key，结果为value返回
export function getCodeServiceList(data) {
  return request({
    url: '/code/data/List',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/details/dt/field/{bomBaseInfoId} 获取决策表字段树结构
export function getDecisionTableField(data) {
  return request({
    url: '/bom/details/dt/field/' + data,
    method: 'get'
  })
}

// /rule/operators/comparison  查询比较运算符列表
export function getComparisonOperators() {
  return request({
    url: '/rule/operators/comparison',
    method: 'get'
  })
}

// /rule/operators/arithmetic 查询算术运算符列表
export function getOperatorsArithmetic() {
  return request({
    url: '/rule/operators/arithmetic',
    method: 'get'
  })
}

// /bom/method 查询算术运算符列表
export function getMethodList(data) {
  return request({
    url: `/bom/method?bomModelId=${data}`,
    method: 'get'
  })
}

// /bom/details 根据bomBaseInfoId 加载所有类和字段
export function getBomModelId(data) {
  return request({
    url: `/bom/details/id?bomBaseInfoId=${data}`,
    method: 'get'
  })
}

//  /bom/xom/sourcecode/latest/{bomBaseInfo}  获取bom源代码
export function getBomSourceCode(data) {
  return request({
    url: `/bom/xom/sourcecode/latest/` + data,
    method: 'get'
  })
}

// /bom/xom/sourcecode/{bomModelId} 保存bom源代码
export function saveBomSourceCode(id, data) {
  return request({
    url: '/bom/xom/sourcecode/' + id,
    method: 'post',
    data
  })
}

// /bom/getUpateDate 通过BomBaselnfold获取Bom最新更新时间
export function getUpateDate(data) {
  return request({
    url: '/bom/getUpateDate',
    method: 'get',
    params: {
      ...data
    }
  })
}

// bom/xom/addBomField 修改业务模型对象中字段的中文名字
export function addBomField(data) {
  return request({
    url: '/bom/xom/addBomField',
    method: 'put',
    data
  })
}
