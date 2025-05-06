/**
 * 评分卡数据结构定义
 *
 * 本文件定义了评分卡模块使用的数据结构，确保与后端API一致
 */

/**
 * 评分卡数据结构
 * @typedef {Object} ScorecardDTO
 * @property {string|null} scorecardInfoId - 评分卡ID
 * @property {string} scorecardName - 评分卡名称
 * @property {string} scorecardPath - 评分卡路径
 * @property {string|null} decisionRepositoryId - 决策库ID
 * @property {string|null} decisionRepCatalogueId - 决策库目录ID
 * @property {string|null} ruleId - 规则ID
 * @property {AppRuleDTO|null} preconditionRule - 前置规则对象
 * @property {string} scoreContainerFieldPath - 评分容器字段路径
 * @property {string} scoreContainerFieldName - 评分容器字段名称
 * @property {string} scoreContainerFieldType - 评分容器字段类型
 * @property {number|null} totalScore - 总分
 * @property {Array<ScorecardAttributeGroupDTO>} attributeGroups - 属性组列表
 * @property {Array<ConditionRow>} [conditionRows] - 条件行列表（前端临时使用）
 */

/**
 * 属性组数据结构
 * @typedef {Object} ScorecardAttributeGroupDTO
 * @property {string} scorecardAttributeGroupId - 属性组ID
 * @property {string|null} scorecardInfoId - 评分卡ID
 * @property {string} groupName - 属性组名称
 * @property {number} groupOrder - 属性组顺序
 * @property {Array<ScorecardAttributeDTO>} attributes - 属性列表
 */

/**
 * 属性数据结构
 * @typedef {Object} ScorecardAttributeDTO
 * @property {string} scorecardAttributeId - 属性ID
 * @property {string} scorecardAttributeGroupId - 属性组ID
 * @property {number} attributeOrder - 属性顺序
 * @property {string} attributeName - 属性名称
 * @property {string} attributeFieldPath - 属性字段路径
 * @property {string} attributeFieldName - 属性字段名称
 * @property {string} attributeFieldType - 属性字段类型
 * @property {Array<ScorecardConditionDTO>} conditions - 条件列表
 */

/**
 * 条件数据结构
 * @typedef {Object} ScorecardConditionDTO
 * @property {string} scorecardConditionId - 条件ID
 * @property {string} scorecardAttributeId - 属性ID
 * @property {number} conditionOrder - 条件顺序
 * @property {string} conditionOperator - 条件操作符
 * @property {string} conditionValue - 条件值
 * @property {string} conditionExpression - 条件表达式
 * @property {string} conditionDescription - 条件描述
 * @property {number} weight - 权重
 * @property {number} scoreValue - 分值
 */

/**
 * 前置规则数据结构
 * @typedef {Object} AppRuleDTO
 * @property {string|null} ruleId - 规则ID
 * @property {string|null} ruleName - 规则名称
 * @property {string|null} ruleSettingDesc - 规则设置描述
 * @property {Object|null} ruleContent - 规则内容
 */

/**
 * 条件行数据结构（前端临时使用）
 * @typedef {Object} ConditionRow
 * @property {string} rowId - 行ID
 * @property {Array<RowCondition>} conditions - 条件列表
 * @property {number} weight - 权重
 * @property {number} scoreValue - 分值
 */

/**
 * 行条件数据结构（前端临时使用）
 * @typedef {Object} RowCondition
 * @property {string} scorecardAttributeGroupId - 属性组ID
 * @property {string} scorecardAttributeId - 属性ID
 * @property {string} scorecardConditionId - 条件ID
 * @property {string} conditionOperator - 条件操作符
 * @property {string} conditionValue - 条件值
 * @property {string} conditionDescription - 条件描述
 * @property {number} conditionOrder - 条件顺序
 */

// 导出类型定义，虽然在JS中没有实际效果，但可以作为文档
export const types = {
  ScorecardDTO: {},
  ScorecardAttributeGroupDTO: {},
  ScorecardAttributeDTO: {},
  ScorecardConditionDTO: {},
  AppRuleDTO: {},
  ConditionRow: {},
  RowCondition: {}
};

/**
 * 验证评分卡数据结构是否符合预期
 * @param {ScorecardDTO} data - 评分卡数据
 * @returns {boolean} 是否有效
 */
export function validateScorecardData(data) {
  if (!data) return false;

  // 基本字段验证
  if (typeof data.scorecardName !== 'string') return false;
  if (typeof data.scorecardPath !== 'string') return false;

  // 属性组验证
  if (!Array.isArray(data.attributeGroups)) return false;

  return true;
}

/**
 * 验证评分卡属性组数据结构是否符合预期
 * @param {ScorecardAttributeGroupDTO} group - 属性组数据
 * @returns {boolean} 是否有效
 */
export function validateAttributeGroup(group) {
  if (!group) return false;

  // 基本字段验证
  if (typeof group.groupName !== 'string') return false;
  if (typeof group.groupOrder !== 'number') return false;

  // 属性验证
  if (!Array.isArray(group.attributes)) return false;

  return true;
}

/**
 * 验证评分卡属性数据结构是否符合预期
 * @param {ScorecardAttributeDTO} attribute - 属性数据
 * @returns {boolean} 是否有效
 */
export function validateAttribute(attribute) {
  if (!attribute) return false;

  // 基本字段验证
  if (typeof attribute.attributeName !== 'string') return false;
  if (typeof attribute.attributeOrder !== 'number') return false;
  if (typeof attribute.attributeFieldPath !== 'string') return false;
  if (typeof attribute.attributeFieldName !== 'string') return false;

  // 条件验证
  if (!Array.isArray(attribute.conditions)) return false;

  return true;
}

/**
 * 验证评分卡条件数据结构是否符合预期
 * @param {ScorecardConditionDTO} condition - 条件数据
 * @returns {boolean} 是否有效
 */
export function validateCondition(condition) {
  if (!condition) return false;

  // 基本字段验证
  if (typeof condition.conditionOrder !== 'number') return false;
  if (typeof condition.conditionOperator !== 'string') return false;
  if (condition.conditionValue === undefined) return false;
  if (typeof condition.conditionExpression !== 'string') return false;
  if (typeof condition.conditionDescription !== 'string') return false;
  if (typeof condition.weight !== 'number') return false;
  if (typeof condition.scoreValue !== 'number') return false;

  return true;
}
