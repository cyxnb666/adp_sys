const NODE_TYPE = {
  LOGICAL: 'LOGICAL', // 且或节点
  COMPARISON: 'COMPARISON', // 比较节点
  EXPRESSION: 'EXPRESSION', // 表达式节点
  FIELD: 'FIELD', // 字段节点
  CUSTOM: 'CUSTOM', // 用户输入节点（控件）
  NESTING: 'NESTING', // 嵌套节点
  BRACKETS: 'BRACKETS', // 括号
  CALCULATE: 'CALCULATE' // 算术（加减乘除、拼接）
}
// 控件类型
const NativeInput = [
  { label: '字符串参数', type: 'input', returnType: 'string' },
  { label: '长整型参数', type: 'input', returnType: 'long' },
  { label: '小数参数1', type: 'input', returnType: 'double' },
  { label: '小数参数2', type: 'input', returnType: 'float' },
  { label: '整形参数', type: 'input', returnType: 'integer' },
  { label: '整型参数', type: 'input', returnType: 'int' },
  { label: '日期参数', type: 'date', returnType: 'date' },
  { label: '时间参数', type: 'time', returnType: 'time' },
  { label: '布尔参数', type: 'selector', returnType: 'boolean' },
  { label: '多选参数', type: 'selector-multiple', returnType: 'string' },
  { label: '单选参数', type: 'selector', returnType: 'string' }
]

//
const RETURN_TYPE = {
  int: '整数参数',
  double: '小数参数',
  float: '小数参数',
  string: '字符串参数',
  integer: '整数参数',
  long: '长整型参数'
}
export {
  NODE_TYPE, NativeInput, RETURN_TYPE
}
