
export const allTypes = [
  'string', 'boolean', 'time', 'date', 'number', 'int', 'integer', 'double', 'float', 'long',
  'int,integer,double,float,long',
  'int,integer,double,double,float,long'
  // 'selector', 'selector-multiple'
]

export const numberTypes = ['number', 'int', 'integer', 'double', 'float', 'long', 'int,integer,double,float,long', 'int,integer,double,double,float,long']

export const placeholderMaps = {
  string: '一个字符串',
  int: '一个数字',
  number: '一个数字',
  long: '一个数字',
  integer: '一个数字',
  double: '一个数字',
  'int,integer,double,float,long': '一个数字',
  'int,integer,double,double,float,long': '一个数字',
  boolean: '一个布尔类型',
  date: '一个日期',
  custom: '一个条件'
}

export const arithmeticMaps = {
  ADD: '+', // 加
  SUB: '-', // 减
  MULTIPLY: '*', // 乘
  DIVIDE: '/', // 除
  APPEND: '+', // 拼接
  DATE_ADD: '+', // 加(日期)
  DATE_SUB: '-', // 减(日期)
  STR_EQ: '==', // 是
  STR_NE: '!=', // 不是
  EQ: '==', // 等于
  NE: '!=', // 不等于
  GT: '>', // 大
  GE: '>=', // 大于等于
  LT: '<', // 小于
  LE: '<=', // 小于等于
  DATE_EQ: '==', // 等于(日期)
  DATE_NE: '!=', // 不等于(日期)
  DATE_GT: '>', // 大于(日期)
  DATE_GE: '>=', // 大于等于(日期)
  DATE_LT: '<', // 小于(日期)
  DATE_LE: '<=', // 小于等于(日期)
  TIME_EQ: '==', // 等于(时间)
  TIME_NE: '!=', // 不等于(时间)
  TIME_GT: '>', // 大于(时间)
  TIME_GE: '>=', // 大于等于(时间)
  TIME_LT: '<', // 小于(时间)
  TIME_LE: '<=', // 小于等于(时间)
  OBJECT_EQ: '==', // 等于(对象)
  // STR_BELONG_TO_MUL: '<=', // 属于（多选）
  // STR_BELONG_TO: '<=', // 属于（单选）
  // STR_NOT_BELONG_TO: '<=', // 不属于（单选）
  // STR_NOT_BELONG_TO_MUL: '<=', // 不属于（多选）
  BOOLEAN_EQUAL_TO: '==' // 等于(下拉列表)
}

export const maps = {
  ADD: '+', // 加
  SUB: '-', // 减
  MULTIPLY: '*', // 乘
  DIVIDE: '/', // 除
  APPEND: '+', // 拼接
  DATE_ADD: '+', // 加(日期)
  DATE_SUB: '-', // 减(日期)
  STR_EQ: '==', // 是
  STR_NE: '!=', // 不是
  EQ: '==', // 等于
  NE: '!=', // 不等于
  GT: '>', // 大
  GE: '>=', // 大于等于
  LT: '<', // 小于
  LE: '<=', // 小于等于
  DATE_EQ: '==', // 等于(日期)
  DATE_NE: '!=', // 不等于(日期)
  DATE_GT: '>', // 大于(日期)
  DATE_GE: '>=', // 大于等于(日期)
  DATE_LT: '<', // 小于(日期)
  DATE_LE: '<=', // 小于等于(日期)
  TIME_EQ: '==', // 等于(时间)
  TIME_NE: '!=', // 不等于(时间)
  TIME_GT: '>', // 大于(时间)
  TIME_GE: '>=', // 大于等于(时间)
  TIME_LT: '<', // 小于(时间)
  TIME_LE: '<=', // 小于等于(时间)
  OBJECT_EQ: '==', // 等于(对象)
  // STR_BELONG_TO_MUL: '<=', // 属于（多选）
  // STR_BELONG_TO: '<=', // 属于（单选）
  // STR_NOT_BELONG_TO: '<=', // 不属于（单选）
  // STR_NOT_BELONG_TO_MUL: '<=', // 不属于（多选）
  BOOLEAN_EQUAL_TO: '==', // 等于(下拉列表)
  BOOLEAN_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).booleanBelongTo', // 是
  STR_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).booleanBelongTo', // 属于（单选）
  STR_BELONG_TO_MUL: 'T(com.airong.adp.core.util.RuleUtil).booleanBelongTo', // 属于（多选）
  COLLECTION_ALL_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).collectionAllBelongTo',
  COLLECTION_ALL_CONTAINS: 'T(com.airong.adp.core.util.RuleUtil).collectionAllContains',
  COLLECTION_ANY_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).collectionAnyBelongTo',
  COLLECTION_ANY_CONTAINS: 'T(com.airong.adp.core.util.RuleUtil).collectionAnyContains',
  COLLECTION_ANY_STR: 'T(com.airong.adp.core.util.RuleUtil).collectionAnyContains',
  COLLECTION_ANY_STRING: 'T(com.airong.adp.core.util.RuleUtil).collectionAnyContains',
  COLLECTION_IS_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).collectionNotEmpty',
  COLLECTION_NOT_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).collectionIsEmpty',
  COLLECTION_NOT_IN_CONTAINS: 'T(com.airong.adp.core.util.RuleUtil).collectionNotInContains',
  COLLECTION_NOT_IN_STR: 'T(com.airong.adp.core.util.RuleUtil).collectionNotInContains',
  COLL_OBJECT_INCLUDE_ALL: 'T(com.airong.adp.core.util.RuleUtil).listAllContain',
  COLL_OBJECT_NOT_INCLUDE: 'T(com.airong.adp.core.util.RuleUtil).notListAllContaint',
  DATE_BETWEEN: 'T(com.airong.adp.core.util.RuleUtil).dateBetween',
  DATE_IS_NOT_NULL: 'T(com.airong.adp.core.util.RuleUtil).dateIsNotNull',
  DATE_IS_NULL: 'T(com.airong.adp.core.util.RuleUtil).dateIsNull',
  FIELD_PATH_CONTAIN_COLLECTION_OF_FIELD_CONTAIN_VALUE: 'T(com.airong.adp.core.util.RuleUtil).fieldPathContainCollectionOfFieldContainValue',
  FIELD_PATH_CONTAIN_COLLECTION_OF_FIELD_NOT_CONTAIN_VALUE: 'T(com.airong.adp.core.util.RuleUtil).fieldPathContainCollectionOfFieldNotContainValue',
  FILTER_COLL_OBJECT_FROM_LIST_IS_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).filterObjectFromList',
  FILTER_OBJECT_FROM_LIST_IS_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).filterObjectFromList',
  FILTER_OBJECT_FROM_LIST_IS_NOT_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).filterObjectFromList',
  NUM_BETWEEN: 'T(com.airong.adp.core.util.RuleUtil).numBetween',
  OBJECT_CENTRE_FIELD_DOUBLE: 'T(com.airong.adp.core.util.RuleUtil).objectCentreFieldDouble',
  OBJECT_CENTRE_FIELD_STRING: 'T(com.airong.adp.core.util.RuleUtil).objectCentreFieldString',
  OBJECT_FIELD_INCLUDE_FIELD: 'T(com.airong.adp.core.util.RuleUtil).objectFieldIncludeField',
  OBJECT_IS_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).objectIsEmpty',
  OBJ_FIELD_COLL_INCLUDE: 'T(com.airong.adp.core.util.RuleUtil).objectFieldCollInclude',
  SIZE_OF_LIST: 'T(com.airong.adp.core.util.RuleUtil).sizeOfList',
  STR_BEGIN_WITH_NUM: 'T(com.airong.adp.core.util.RuleUtil).strBeginWithNum',
  STR_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).strBelongTo', // 属于xx中的一个
  STR_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).strEmpty',
  STR_END_WITH: 'T(com.airong.adp.core.util.RuleUtil).strEndWith',
  STR_END_WITH_NUM: 'T(com.airong.adp.core.util.RuleUtil).strEndWithNum',
  STR_INCLUDE: 'T(com.airong.adp.core.util.RuleUtil).strInclude',
  STR_INCLUDE_FIELD: 'T(com.airong.adp.core.util.RuleUtil).strInclude',
  STR_LENGTH: 'T(com.airong.adp.core.util.RuleUtil).strLength',
  STR_NOT_BELONG_TO: 'T(com.airong.adp.core.util.RuleUtil).strNotBelongTo', // 不属于xx中的一个，不属于（单选）
  STR_NOT_BELONG_TO_MUL: 'T(com.airong.adp.core.util.RuleUtil).strNotBelongTo', // 不属于（多选）
  STR_NOT_EMPTY: 'T(com.airong.adp.core.util.RuleUtil).strNotEmpty',
  STR_NOT_END_WITH: 'T(com.airong.adp.core.util.RuleUtil).strNotEndWith',
  STR_NOT_INCLUDE: 'T(com.airong.adp.core.util.RuleUtil).strNotInclude',
  STR_NOT_INCLUDE_FIELD: 'T(com.airong.adp.core.util.RuleUtil).strNotInclude',
  STR_NOT_START_WITH: 'T(com.airong.adp.core.util.RuleUtil).strNotStartWith',
  STR_START_WITH: 'T(com.airong.adp.core.util.RuleUtil).strStartWith',
  STR_STR_WITH_NUM: 'T(com.airong.adp.core.util.RuleUtil).substr', // 截取第<数值参数>位至第<数值参数>位
  TIME_BETWEEN: 'T(com.airong.adp.core.util.RuleUtil).timeBetween', // 在 <时间参数> 和 <时间参数> 之间
  DATE_EQ: 'T(com.airong.adp.core.util.RuleUtil).executeDateEq',
  DATE_NE: 'T(com.airong.adp.core.util.RuleUtil).executeDateNe',
  DATE_GT: 'T(com.airong.adp.core.util.RuleUtil).executeDateGt',
  DATE_GE: 'T(com.airong.adp.core.util.RuleUtil).executeDateGe',
  DATE_LT: 'T(com.airong.adp.core.util.RuleUtil).executeDateLt',
  DATE_LE: 'T(com.airong.adp.core.util.RuleUtil).executeDateLe'
}

export const comparison = {
  '==': {
    'operator': 'EQ',
    'fieldId': 'EQ',
    'expressionArray': [{
      'type': 'text',
      'desc': '等于'
    }, {
      'id': 'EQ',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '=': {
    'operator': 'EQ',
    'fieldId': 'EQ',
    'expressionArray': [{
      'type': 'text',
      'desc': '等于'
    }, {
      'id': 'EQ',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '!=': {
    'operator': 'NE',
    'fieldId': 'NE',
    'expressionArray': [{
      'type': 'text',
      'desc': '不等于'
    }, {
      'id': 'NE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '不等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '>': {
    'operator': 'GT',
    'fieldId': 'GT',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于'
    }, {
      'id': 'GT',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '大于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '>=': {
    'operator': 'GE',
    'fieldId': 'GE',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于等于'
    }, {
      'id': 'GE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '大于等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '<': {
    'operator': 'LT',
    'fieldId': 'LT',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于'
    }, {
      'id': 'LT',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '小于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '<=': {
    'operator': 'LE',
    'fieldId': 'LE',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于等于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long'
    }],
    'label': '小于等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  '【条件列】等于(日期)': {
    'operator': 'EQ',
    'fieldId': 'DATE_EQ',
    'expressionArray': [{
      'type': 'text',
      'desc': '等于'
    }, {
      'id': 'DATE_EQ',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '等于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  '【条件列】大于等于(日期)': {
    'operator': 'GE',
    'fieldId': 'DATE_GE',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于等于'
    }, {
      'id': 'DATE_GE',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '大于等于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  '【条件列】大于(日期)': {
    'operator': 'GT',
    'fieldId': 'DATE_GT',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于'
    }, {
      'id': 'DATE_GT',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '大于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  '【条件列】小于等于(日期)': {
    'operator': 'LE',
    'fieldId': 'DATE_LE',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于等于'
    }, {
      'id': 'DATE_LE',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '小于等于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  '【条件列】小于(日期)': {
    'operator': 'LT',
    'fieldId': 'DATE_LT',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于'
    }, {
      'id': 'DATE_LT',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '小于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  '【条件列】不等于(日期)': {
    'operator': 'NE',
    'fieldId': 'DATE_NE',
    'expressionArray': [{
      'type': 'text',
      'desc': '不等于'
    }, {
      'id': 'DATE_NE',
      'type': 'input',
      'returnType': 'date'
    }],
    'label': '不等于',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },

  // '【条件列】(字符串)属于',
  // '【条件列】截取第一位等于',
  '【条件列】 包含 参数集(用逗号分割)': {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '包含'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      }
    ],
    'expressionDesc': '&1 包含 <字符串参数>(多个参数以逗号分割)',
    'expressionId': 'STR_INCLUDE',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】 不包含 参数集(用逗号分割)': {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '不包含'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      }
    ],
    'expressionDesc': '&1 不包含 <字符串参数>(多个参数以逗号分割)',
    'expressionId': 'STR_NOT_INCLUDE',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】 属于 参数集(用逗号分割)': {
    'expressionArray': [
      {
        'id': 'STR_BELONG_TO_1',
        'type': 'text',
        'desc': '属于'
      },
      {
        'id': 'STR_BELONG_TO_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_BELONG_TO_3',
        'type': 'text',
        'desc': '中的一个'
      }
    ],
    'expressionDesc': '&1 属于 <字符串参数>(多个参数以逗号分割) 中的一个',
    'expressionId': 'STR_BELONG_TO',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】 不属于 参数集(用逗号分割)': {
    'expressionArray': [
      {
        'id': 'STR_NOT_BELONG_TO_1',
        'type': 'text',
        'desc': '不属于'
      },
      {
        'id': 'STR_NOT_BELONG_TO_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_NOT_BELONG_TO_3',
        'type': 'text',
        'desc': '中的一个'
      }
    ],
    'expressionDesc': '&1 不属于 <字符串参数>(多个参数以逗号分割) 中的一个',
    'expressionId': 'STR_NOT_BELONG_TO',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】以参数集(多个参数以逗号分隔)开头': {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '以'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_START_WITH_3',
        'type': 'text',
        'desc': '开头'
      }
    ],
    'expressionDesc': '&1 以 <字符串参数> 开头',
    'expressionId': 'STR_START_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】不以参数集(多个参数以逗号分隔)开头': {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '不以'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_START_WITH_3',
        'type': 'text',
        'desc': '开头'
      }
    ],
    'expressionDesc': '&1 不以 <字符串参数> 开头',
    'expressionId': 'STR_NOT_START_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】以参数集(多个参数以逗号分隔)结尾': {
    'expressionArray': [
      {
        'id': 'STR_END_WITH_1',
        'type': 'text',
        'desc': '以'
      },
      {
        'id': 'STR_END_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_END_WITH_3',
        'type': 'text',
        'desc': '结尾'
      }
    ],
    'expressionDesc': '&1 以 <字符串参数> 结尾',
    'expressionId': 'STR_END_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  '【条件列】不以参数集(多个参数以逗号分隔)结尾': {
    'expressionArray': [
      {
        'id': 'STR_END_WITH_1',
        'type': 'text',
        'desc': '不以'
      },
      {
        'id': 'STR_END_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>'
      },
      {
        'id': 'STR_END_WITH_3',
        'type': 'text',
        'desc': '结尾'
      }
    ],
    'label': '不以 <字符串参数> 结尾',
    'fieldId': 'STR_NOT_END_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string',
    'paramType': 'boolean'
  },

  '【条件列】不成立': {
    'label': '不成立',
    'nodeType': 'CUSTOM',
    'returnType': 'boolean',
    'paramValue': 'false',
    'type': 'input'
  },
  '【条件列】不为空': {
    'expressionArray': [{
      'id': 'STR_NOT_EMPTY_1',
      'type': 'text',
      'desc': '不为空'
    }],
    'label': '不为空',
    'fieldId': 'STR_NOT_EMPTY',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string',
    'paramType': 'boolean'
  }
}

export const conditionMenus = [
  {
    'operator': 'EQ',
    'fieldId': 'EQ',
    'expressionArray': [{
      'type': 'text',
      'desc': '等于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】等于='
    }],
    'label': '等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'NE',
    'fieldId': 'NE',
    'expressionArray': [{
      'type': 'text',
      'desc': '不等于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】不等于!='
    }],
    'label': '不等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'GT',
    'fieldId': 'GT',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】大于>'
    }],
    'label': '大于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'GE',
    'fieldId': 'GE',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于等于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】大于等于>='
    }],
    'label': '大于等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'LT',
    'fieldId': 'LT',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】小于<'
    }],
    'label': '小于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'LE',
    'fieldId': 'LE',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于等于'
    }, {
      'id': 'LE',
      'type': 'input',
      'returnType': 'int,integer,double,float,long',
      'cellValue': '【条件列】小于等于<='
    }],
    'label': '小于等于',
    'paramType': 'int,integer,double,float,long',
    'returnType': 'int,integer,double,float,long',
    'codeService': '',
    'beforeParamType': 'int,integer,double,float,long'
  },
  {
    'operator': 'EQ',
    'fieldId': 'DATE_EQ',
    'expressionArray': [{
      'type': 'text',
      'desc': '等于(日期)'
    }, {
      'id': 'DATE_EQ',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】等于(日期)'
    }],
    'label': '等于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  {
    'operator': 'GE',
    'fieldId': 'DATE_GE',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于等于(日期)'
    }, {
      'id': 'DATE_GE',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】大于等于(日期)'
    }],
    'label': '大于等于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  {
    'operator': 'GT',
    'fieldId': 'DATE_GT',
    'expressionArray': [{
      'type': 'text',
      'desc': '大于(日期)'
    }, {
      'id': 'DATE_GT',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】大于(日期)'
    }],
    'label': '大于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  {
    'operator': 'LE',
    'fieldId': 'DATE_LE',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于等于(日期)'
    }, {
      'id': 'DATE_LE',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】小于等于(日期)'
    }],
    'label': '小于等于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  {
    'operator': 'LT',
    'fieldId': 'DATE_LT',
    'expressionArray': [{
      'type': 'text',
      'desc': '小于(日期)'
    }, {
      'id': 'DATE_LT',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】小于(日期)'
    }],
    'label': '小于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  {
    'operator': 'NE',
    'fieldId': 'DATE_NE',
    'expressionArray': [{
      'type': 'text',
      'desc': '不等于(日期)'
    }, {
      'id': 'DATE_NE',
      'type': 'input',
      'returnType': 'date',
      'cellValue': '【条件列】不等于(日期)'
    }],
    'label': '不等于(日期)',
    'paramType': 'date',
    'returnType': 'date',
    'codeService': '',
    'beforeParamType': 'date'
  },
  // {
  //     'operator': 'NE',
  //     'fieldId': 'DATE_NE',
  //     'expressionArray': [{
  //         'type': 'text',
  //         'desc': '【条件列】(字符串)属于'
  //     }, {
  //         'id': 'DATE_NE',
  //         'type': 'input',
  //         'returnType': 'date',
  //          'cellValue': '【条件列】(字符串)属于'
  //     }],
  //     'label': '【条件列】(字符串)属于',
  //     'paramType': 'date',
  //     'returnType': 'date',
  //     'codeService': '',
  //     'beforeParamType': 'date'
  // }
  // {
  //     'operator': 'NE',
  //     'fieldId': 'DATE_NE',
  //     'expressionArray': [{
  //         'type': 'text',
  //         'desc': '【条件列】截取第一位等于'
  //     }, {
  //         'id': 'DATE_NE',
  //         'type': 'input',
  //         'returnType': 'date',
  //          'cellValue': '【条件列】截取第一位等于'
  //     }],
  //     'label': '【条件列】截取第一位等于',
  //     'paramType': 'date',
  //     'returnType': 'date',
  //     'codeService': '',
  //     'beforeParamType': 'date'
  // }
  {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '包含'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】 包含 参数集(用逗号分割)'
      }
    ],
    'label': '包含 参数集(用逗号分割)',
    'expressionId': 'COLLECTION_ANY_STR',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'list'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '不包含'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】 不包含 参数集(用逗号分割)'
      }
    ],
    'label': '不包含 参数集(用逗号分割)',
    'expressionId': 'STR_NOT_INCLUDE',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_BELONG_TO_1',
        'type': 'text',
        'desc': '属于'
      },
      {
        'id': 'STR_BELONG_TO_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】 属于 参数集(用逗号分割)'
      },
      {
        'id': 'STR_BELONG_TO_3',
        'type': 'text',
        'desc': '中的一个'
      }
    ],
    'label': '属于 参数集(用逗号分割)',
    'expressionId': 'STR_BELONG_TO',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_NOT_BELONG_TO_1',
        'type': 'text',
        'desc': '不属于'
      },
      {
        'id': 'STR_NOT_BELONG_TO_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】 不属于 参数集(用逗号分割)'
      }
    ],
    'label': '不属于 参数集(用逗号分割)',
    'expressionId': 'STR_NOT_BELONG_TO',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '以'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】 不属于 参数集(用逗号分割)'
      },
      {
        'id': 'STR_START_WITH_3',
        'type': 'text',
        'desc': '开头'
      }
    ],
    'label': '以 <字符串参数> 开头',
    'expressionId': 'STR_START_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_START_WITH_1',
        'type': 'text',
        'desc': '不以'
      },
      {
        'id': 'STR_START_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】不以参数集(多个参数以逗号分隔)开头'
      },
      {
        'id': 'STR_START_WITH_3',
        'type': 'text',
        'desc': '开头'
      }
    ],
    'label': '不以参数集(多个参数以逗号分隔)开头',
    'expressionId': 'STR_NOT_START_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  },
  {
    'expressionArray': [
      {
        'id': 'STR_END_WITH_1',
        'type': 'text',
        'desc': '以'
      },
      {
        'id': 'STR_END_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】以参数集(多个参数以逗号分隔)结尾'
      },
      {
        'id': 'STR_END_WITH_3',
        'type': 'text',
        'desc': '结尾'
      }
    ],
    'label': '以参数集(多个参数以逗号分隔)结尾',
    'expressionId': 'STR_END_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string'
  }, //     '【条件列】以参数集(多个参数以逗号分隔)开头': ,
  {
    'expressionArray': [
      {
        'id': 'STR_END_WITH_1',
        'type': 'text',
        'desc': '不以'
      },
      {
        'id': 'STR_END_WITH_2',
        'type': 'input',
        'paramId': 'param2',
        'returnType': 'string',
        'desc': '<字符串参数>',
        'cellValue': '【条件列】不以参数集(多个参数以逗号分隔)结尾'
      },
      {
        'id': 'STR_END_WITH_3',
        'type': 'text',
        'desc': '结尾'
      }
    ],
    'label': '不以参数集(多个参数以逗号分隔)结尾',
    'fieldId': 'STR_NOT_END_WITH',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string',
    'paramType': 'boolean'
  },
  {
    'label': '不成立',
    'nodeType': 'CUSTOM',
    'returnType': 'boolean',
    'paramValue': 'false',
    'type': 'input',
    'cellValue': '【条件列】不成立'
  },
  {
    'expressionArray': [{
      'id': 'STR_NOT_EMPTY_1',
      'type': 'text',
      'desc': '不为空',
      'cellValue': '【条件列】不为空'
    }],
    'label': '不为空',
    'fieldId': 'STR_NOT_EMPTY',
    'returnType': 'boolean',
    'codeService': 'trueOrFalseService',
    'beforeParamType': 'string',
    'paramType': 'boolean'
  }
]

// export const comparison = {
//     '【条件列】等于=': {
//         "operator": "EQ",
//         'fieldId': 'EQ',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '等于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '等于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】不等于!=': {
//         "operator": "NE",
//         'fieldId': 'NE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '不等于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '不等于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】大于>': {
//         "operator": "GT",
//         'fieldId': 'GT',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '大于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '大于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】大于等于>=': {
//         "operator": "GE",
//         'fieldId': 'GE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '大于等于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '大于等于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】小于<': {
//         "operator": "LT",
//         'fieldId': 'LT',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '小于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '小于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】小于等于<=': {
//         "operator": "LE",
//         'fieldId': 'LE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '小于等于'
//         }, {
//             'id': 'LE',
//             'type': 'input',
//             'returnType': 'int,integer,double,float,long',
//         }],
//         'label': '小于等于',
//         'paramType': 'int,integer,double,float,long',
//         'returnType': 'int,integer,double,float,long',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】等于(日期)': {
//         'operator': 'EQ',
//         'fieldId': 'DATE_EQ',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '等于'
//         }, {
//             'id': 'DATE_EQ',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '等于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】大于等于(日期)': {
//         'operator': 'GE',
//         'fieldId': 'DATE_GE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '大于等于'
//         }, {
//             'id': 'DATE_GE',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '大于等于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】大于(日期)': {
//         'operator': 'GT',
//         'fieldId': 'DATE_GT',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '大于'
//         }, {
//             'id': 'DATE_GT',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '大于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】小于等于(日期)': {
//         'operator': 'LE',
//         'fieldId': 'DATE_LE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '小于等于'
//         }, {
//             'id': 'DATE_LE',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '小于等于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】小于(日期)': {
//         'operator': 'LT',
//         'fieldId': 'DATE_LT',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '小于'
//         }, {
//             'id': 'DATE_LT',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '小于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },
//     '【条件列】不等于(日期)': {
//         'operator': 'NE',
//         'fieldId': 'DATE_NE',
//         'expressionArray': [{
//             'type': 'text',
//             'desc': '不等于'
//         }, {
//             'id': 'DATE_NE',
//             'type': 'input',
//             'returnType': 'date',
//         }],
//         'label': '不等于',
//         'paramType': 'date',
//         'returnType': 'date',
//         'codeService': '',
//         'beforeParamType': 'date'
//     },

//     // '【条件列】(字符串)属于',
//     // '【条件列】截取第一位等于',
//     '【条件列】 包含 参数集(用逗号分割)': {
//         "expressionArray": [
//             {
//                 "id": "STR_START_WITH_1",
//                 "type": "text",
//                 "desc": "包含"
//             },
//             {
//                 "id": "STR_START_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             }
//         ],
//         "expressionDesc": "&1 包含 <字符串参数>(多个参数以逗号分割)",
//         "expressionId": "STR_INCLUDE",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】 不包含 参数集(用逗号分割)': {
//         "expressionArray": [
//             {
//                 "id": "STR_START_WITH_1",
//                 "type": "text",
//                 "desc": "不包含"
//             },
//             {
//                 "id": "STR_START_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             }
//         ],
//         "expressionDesc": "&1 不包含 <字符串参数>(多个参数以逗号分割)",
//         "expressionId": "STR_NOT_INCLUDE",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】 属于 参数集(用逗号分割)': {
//         "expressionArray": [
//             {
//                 "id": "STR_BELONG_TO_1",
//                 "type": "text",
//                 "desc": "属于"
//             },
//             {
//                 "id": "STR_BELONG_TO_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_BELONG_TO_3",
//                 "type": "text",
//                 "desc": "中的一个"
//             }
//         ],
//         "expressionDesc": "&1 属于 <字符串参数>(多个参数以逗号分割) 中的一个",
//         "expressionId": "STR_BELONG_TO",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】 不属于 参数集(用逗号分割)': {
//         "expressionArray": [
//             {
//                 "id": "STR_NOT_BELONG_TO_1",
//                 "type": "text",
//                 "desc": "不属于"
//             },
//             {
//                 "id": "STR_NOT_BELONG_TO_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_NOT_BELONG_TO_3",
//                 "type": "text",
//                 "desc": "中的一个"
//             }
//         ],
//         "expressionDesc": "&1 不属于 <字符串参数>(多个参数以逗号分割) 中的一个",
//         "expressionId": "STR_NOT_BELONG_TO",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】以参数集(多个参数以逗号分隔)开头': {
//         "expressionArray": [
//             {
//                 "id": "STR_START_WITH_1",
//                 "type": "text",
//                 "desc": "以"
//             },
//             {
//                 "id": "STR_START_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_START_WITH_3",
//                 "type": "text",
//                 "desc": "开头"
//             }
//         ],
//         "expressionDesc": "&1 以 <字符串参数> 开头",
//         "expressionId": "STR_START_WITH",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】不以参数集(多个参数以逗号分隔)开头': {
//         "expressionArray": [
//             {
//                 "id": "STR_START_WITH_1",
//                 "type": "text",
//                 "desc": "不以"
//             },
//             {
//                 "id": "STR_START_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_START_WITH_3",
//                 "type": "text",
//                 "desc": "开头"
//             }
//         ],
//         "expressionDesc": "&1 不以 <字符串参数> 开头",
//         "expressionId": "STR_NOT_START_WITH",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】以参数集(多个参数以逗号分隔)结尾': {
//         "expressionArray": [
//             {
//                 "id": "STR_END_WITH_1",
//                 "type": "text",
//                 "desc": "以"
//             },
//             {
//                 "id": "STR_END_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_END_WITH_3",
//                 "type": "text",
//                 "desc": "结尾"
//             }
//         ],
//         "expressionDesc": "&1 以 <字符串参数> 结尾",
//         "expressionId": "STR_END_WITH",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string"
//     },
//     '【条件列】不以参数集(多个参数以逗号分隔)结尾': {
//         "expressionArray": [
//             {
//                 "id": "STR_END_WITH_1",
//                 "type": "text",
//                 "desc": "不以"
//             },
//             {
//                 "id": "STR_END_WITH_2",
//                 "type": "input",
//                 "paramId": "param2",
//                 "returnType": "string",
//                 "desc": "<字符串参数>"
//             },
//             {
//                 "id": "STR_END_WITH_3",
//                 "type": "text",
//                 "desc": "结尾"
//             }
//         ],
//         "label": "不以 <字符串参数> 结尾",
//         "fieldId": "STR_NOT_END_WITH",
//         "returnType": "boolean",
//         "codeService": "trueOrFalseService",
//         "beforeParamType": "string",
//         'paramType': 'boolean',
//     },

//     '【条件列】不成立': {
//         'label': '不成立',
//         'nodeType': 'CUSTOM',
//         'returnType': 'boolean',
//         'paramValue': 'false',
//         'type': 'input'
//     },
//     '【条件列】不为空': {
//         'expressionArray': [{
//             'id': 'STR_NOT_EMPTY_1',
//             'type': 'text',
//             'desc': '不为空'
//         }],
//         'label': '不为空',
//         'fieldId': 'STR_NOT_EMPTY',
//         'returnType': 'boolean',
//         'codeService': 'trueOrFalseService',
//         'beforeParamType': 'string',
//         'paramType': 'boolean',
//     },
// }
