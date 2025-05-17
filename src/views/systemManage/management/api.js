// import http from '@/utils/http'
import http from '@/utils/http'

// /rule/expressions  查询所有表达式列表
export function getRuleExpressionsAll() {
  return http({
    url: '/rule/expressions',
    method: 'get'
  })
}

// /rule/operators/arithmetic 查询算术运算符列表
export function getOperatorsArithmetic() {
  return http({
    url: '/rule/operators/arithmetic',
    method: 'get'
  })
}

// /rule/operators/comparison  查询比较运算符列表
export function getComparisonOperators() {
  return http({
    url: '/rule/operators/comparison',
    method: 'get'
  })
}

// /bom/details 根据bomBaseInfoId 加载所有类和字段
export function bomClassAndField(data) {
  return http({
    url: '/bom/details',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /bom/details/id?bomBaseInfoId=${data} 根据bomBaseInfoId获取bomModelId
export function getBomModelId(data) {
  return http({
    url: `/bom/details/id?bomBaseInfoId=${data}`,
    method: 'get'
  })
}

// /bom/method 查询算术运算符列表
export function getMethodList(data) {
  return http({
    url: `/bom/method?bomModelId=${data}`,
    method: 'get'
  })
}

// 获取分组列表及对应的属性标签(级联)
export function getGroupTagList(data) {
  return http({
    url: `/rule/attribute/getGroupTagList`,
    method: 'get'
  })
}

// 查询决策库信息，包含决策库基本信息、业务模型信息、关联规则信息等
export function fullRepository(applicationId) {
  return http({
    url: `/decision/full-repository/${applicationId}`,
    method: 'get'
  })
}

// 获取决策表
export function getDecisionTableInfo(decisionTableId) {
  return http({
    url: `/decisionTable/getDecisionTableInfo/${decisionTableId}`,
    method: 'get'
  })
}

// 版本对比
export function compareDecisionTable(decisionTableId, mainVersion, secondVersion) {
  return http({
    url: `/decision/table/history/compareDecisionTable/${decisionTableId}/${mainVersion}/${secondVersion}`,
    method: 'get'
  })
}

// /codedatas 根据基础数据方法名查基础数据信息，多个method按方法名为key，结果为value返回
export function getCodeServiceList(data) {
  return http({
    url: '/code/data/List',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /获取规则列表视图所需的BomTree
export function getBomTree(data) {
  return http({
    url: '/decision/repository/rule-list-view/bom-tree',
    method: 'get',
    params: {
      ...data
    }
  })
}

// /懒加载获取规则列表视图所需的BomTree
export function getBomLazyLoadTree(bomBaseInfoId, loadMethod, fieldPath) {
  return http({
    url: `/bom/details/${bomBaseInfoId}/tree?loadMethod=${loadMethod}&fieldPath=${fieldPath}`,
    method: 'get',
  })
}
// /搜索Bom
export function searchBom(bomBaseInfoId, key) {
  return http({
    url: `/bom/details/${bomBaseInfoId}/tree/search?loadMethod=true&key=${key}`,
    method: 'get',
  })
}

// /获取规则列表视图
export function ruleListView(data) {
  return http({
    url: '/decision/repository/rule-list-view',
    method: 'post',
    data
  })
}

// /根据规则编号逻辑删除/还原规则
export function ruleDelOrRe(data) {
  return http({
    url: '/decision/ruleDelOrRe',
    method: 'post',
    params: data
  })
}

// /历史版本还原
export function restore(data) {
  return http({
    url: '/decision/rule/history/restore',
    method: 'post',
    data
  })
}

// /历史版本还原
export function tableRestore(data) {
  return http({
    url: '/decisionTable/table/history/restore',
    method: 'post',
    data
  })
}

// 获取codeService 存state localStorage本地
export function getCodeService(data) {
  if (!data) {
    return []
  }
  return getCodeServiceList({codeServices: data.toString()}).then(res => {
    let expressCollect = JSON.parse(localStorage.getItem('expressCollect')) || {}
    expressCollect = {...expressCollect, ...res}
    localStorage.setItem('expressCollect', JSON.stringify(expressCollect))

    return expressCollect
  })
}
