function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('') + +new Date()
  return uuid
}

const Comparison = [
  {
    'uuid': uuid(),
    'order': 1,
    'opName': '大于',
    'type': 'number',
    'javaType': 'int',
    'sentence': '{0}-大于-{1}',
    'javaExpression': '{0} > {1}',
    'params': [
      {
        'uuid': uuid(),
        'javaType': 'int',
        'name': '整数参数1',
        'desc': null,
        'properties': {
          'MAX_VALUE': '1000000',
          'MIN_VALUE': '0'
        }
      }
    ]
  },
  {
    'uuid': uuid(),
    'order': 3,
    'opName': '小于等于',
    'type': 'number',
    'javaType': 'int',
    'sentence': '{0}-小于等于-{1}',
    'javaExpression': '{0} <= {1}',
    'params': [
      {
        'uuid': uuid(),
        'javaType': 'int',
        'name': '整数参数1',
        'desc': null,
        'properties': {
          'MAX_VALUE': '1000000',
          'MIN_VALUE': '0'
        }
      }
    ]
  },
  {
    'uuid': uuid(),
    'order': 2,
    'opName': '大于等于',
    'type': 'number',
    'javaType': 'int',
    'sentence': '{0}-大于等于-{1}',
    'javaExpression': '{0} >= {1}',
    'params': [
      {
        'uuid': uuid(),
        'javaType': 'int',
        'name': '整数参数1',
        'desc': null,
        'properties': {
          'MAX_VALUE': '1000000',
          'MIN_VALUE': '0'
        }
      }
    ]
  },
  {
    'uuid': uuid(),
    'order': 4,
    'opName': '小于',
    'type': 'number',
    'javaType': 'int',
    'sentence': '{0}-小于-{1}',
    'javaExpression': '{0} < {1}',
    'params': [
      {
        'uuid': uuid(),
        'javaType': 'int',
        'name': '整数参数1',
        'desc': null,
        'properties': {
          'MAX_VALUE': '1000000',
          'MIN_VALUE': '0'
        }
      }
    ]
  },
  {
    'uuid': uuid(),
    'order': 2,
    'opName': '等于',
    'type': 'string',
    'javaType': 'java.lang.String',
    'sentence': '{0}-不为空',
    'isEmpty': true,
    'javaExpression': '{0} != null && {0}.isEmpty() == false',
    'params': []
  },
  {
    'uuid': uuid(),
    'order': 2,
    'opName': '不等于',
    'type': 'string',
    'javaType': 'java.lang.String',
    'sentence': '{0}-不为空',
    'isEmpty': true,
    'javaExpression': '{0} != null && {0}.isEmpty() == false',
    'params': []
  }
]

const EXPRESSION = [
  {
    type: 'string',
    opName: '<字符串>中包括<字符串参数>',
    returnType: 'boolean'
  },
  {
    type: 'string',
    opName: '<字符串>不以<字符串参数>开始',
    returnType: 'boolean'
  },
  {
    type: 'string',
    opName: '这个<字符串>的长度',
    returnType: 'string'
  }
]

const BOM = [
  { value: '投保单号', name: '投保单号', type: 'string' },
  { value: '日期', name: '日期', type: 'date' },
  { value: '被保人姓名', name: '被保人姓名', type: 'string' },
  { value: '投保人姓名', name: '投保人姓名', type: 'string' },
  { value: '年龄', name: '年龄', type: 'number' },
  { value: '车牌号', name: '车牌号', type: 'string' },
  { value: '车架号', name: '车架号', type: 'string' },
  { value: '发动机号', name: '发动机号', type: 'string' },
  { value: '保费', name: '保费', type: 'number' }
]

const LOGICAL = [
  { name: '并且', type: 'string' },
  { name: '或者', type: 'string' }
]

export {
  Comparison,
  BOM,
  EXPRESSION,
  LOGICAL
}
