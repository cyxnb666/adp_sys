import _ from 'lodash'
import store from '@/store'
const NODE_TYPE = {
  LOGICAL: 'LOGICAL',
  COMPARISON: 'COMPARISON',
  EXPRESSION: 'EXPRESSION',
  FIELD: 'FIELD',
  CUSTOM: 'CUSTOM', // 用户输入节点
  NESTING: 'NESTING', // 嵌套节点
  BRACKETS: 'BRACKETS', // 括号
  CALCULATE: 'CALCULATE' // 算术
}
// const RETURN_TYPE = {
//   NONE: 'none',
//   BOOLEAN: 'boolean',
//   STRING: 'string',
//   INT: 'int',
//   DOUBLE: 'double',
//   DATE: 'date',
//   LIST: 'list'
// }

// 节点
//     this.left = leftNode // 左节点
//     this.right = rightNode // 右节点
//     this.subTree = otherBNode.subTree || null // 是否有括号
//     this.path = otherBNode.path || null // 路径
//     this.nodeType = otherBNode.nodeType || null // 节点的类型 ： LOGICAL，EXPRESSION，COMPARISON，FIELD
//     this.code = otherBNode.code || null // 比较节点的编码
//     this.expressionId = otherBNode.expressionId || null // 表达式节点的id
//     this.label = otherBNode.label || '' // 节点的描述（值）
//     this.returnType = otherBNode.returnType || null // 节点的值类型 ：int,Integer,double,Double,float,Float,String，date
//     this.type = otherBNode.type || null // 控件的类型 : input、date、selector、selector-multiple
//     this.paramValue = otherBNode.paramValue || null // 节点值（下拉列表取这个值：key,value）
//     this.codeService = otherBNode.codeService || null // 下拉列表的查询key
//     this.classPath = otherBNode.classPath || null // 字段的path
//     this.field = otherBNode.field || null // 字段的code
//     this.arr = otherBNode.arr || null // 嵌套
//     this.paramValueUnit = otherBNode.paramValueUnits || null // 节点值的单位
//     this.unitsList = otherBNode.unitsList || null // 节点值的单位列表
const RETURN_TYPE_DESC_EN = {
  int: 'integer parameter',
  integer: 'integer parameter',
  double: 'decimal parameter',
  float: 'decimal parameter',
  string: 'string parameter',
  date: 'date parameter',
  long: 'Long integer parameter'
}
const RETURN_TYPE_DESC_ZH = {
  int: '整数参数',
  integer: '整数参数',
  double: '小数参数',
  float: '小数参数',
  string: '字符串参数',
  date: '日期参数',
  long: '长整型参数'
}
const locale = localStorage.getItem('locale')
const RETURN_TYPE_DESC = locale === 'en' ? RETURN_TYPE_DESC_EN : RETURN_TYPE_DESC_ZH || RETURN_TYPE_DESC_ZH
// const RETURN_TYPE_DESC = {
//   int: '整数参数',
//   integer: '整数参数',
//   double: '小数参数',
//   float: '小数参数',
//   string: '字符串参数',
//   date: '日期参数'
// }

/**
 *
 * @constructor
 */
function RuleEditor() {
  /**
   * 一个树的上下文
   * @type {*[]}
   */
  this.rootContext = []

  this.root = null // treeRoot

  /**
   * 添加path
   */
  this.setPath = function() {
    // 检查是否存在根节点this.root，如果根节点不存在，直接返回false表示无法设置路径信息
    if (!this.root) {
      return false
    } else {
      // 如果根节点存在，那么将根节点的路径、父节点路径和位置信息都设置为空字符串''，表示它是树的根节点，没有父节点，并且位置是空的
      this.root.path = ''
      this.root.parentPath = ''
      this.root.position = ''
    }
    // 该函数用于递归地遍历树中的每个节点，设置它们的路径信息
    const traverseTree = function(thisNode) {
      // const parent = thisNode.path
      // 检查传入的节点thisNode是否存在，如果不存在，直接返回，不进行任何处理
      if (!thisNode) {
        return
      }
      // 如果节点thisNode存在左子节点thisNode.left，则设置左子节点的路径信息：左子节点的路径是当前节点路径加上.left，父节点路径为当前节点路径，位置为left
      if (thisNode.left) {
        thisNode.left.path = thisNode.path + '.left'
        thisNode.left.parentPath = thisNode.path
        thisNode.left.position = 'left'
        // 然后，对左子节点递归调用traverseTree函数，继续设置它的子节点的路径信息
        traverseTree(thisNode.left)
      }
      // 如果节点thisNode存在右子节点thisNode.right，则设置右子节点的路径信息：右子节点的路径是当前节点路径加上.right，父节点路径为当前节点路径，位置为right
      if (thisNode.right) {
        thisNode.right.path = thisNode.path + '.right'
        thisNode.right.parentPath = thisNode.path
        thisNode.right.position = 'right'
        // 对右子节点递归调用traverseTree函数，继续设置它的子节点的路径信息
        traverseTree(thisNode.right)
      }
      return
    }
    traverseTree(this.root)
  }

  /**
   * 检查是否是一个完整的二叉树.
   * @returns {*|boolean}
   */
  this.validate = function() {
    // 检查是否存在根节点 this.rootNode，如果不存在则返回 false，表示表达式树为空，无法进行验证
    if (!this.rootNode) {
      return false
    }
    const that = this
    // 定义 travelTreeChecker 函数用于递归遍历表达式树节点，并进行验证。该函数的参数 thisNode 表示当前节点，pass 表示当前是否通过验证
    const travelTreeChecker = function(thisNode, pass) {
      if (!thisNode.path && thisNode.returnType !== 'boolean') {
        return false
      }
      if (thisNode.isLeaf) {
        // 在遍历过程中，对于叶子节点（没有左右子节点的节点），进行特定的验证。如果是类型为 NODE_TYPE.EXPRESSION 的叶子节点，并且返回类型不为 'boolean'，则查找父节点
        if (thisNode.nodeType === NODE_TYPE.EXPRESSION && thisNode.returnType !== 'boolean') {
          const parantNode = that.getParentNode(thisNode.path, thisNode.parentPath)
          // 如果父节点类型为 NODE_TYPE.COMPARISON，则说明表达式是有效的，返回 true，否则返回 false
          if (parantNode && parantNode.nodeType === NODE_TYPE.COMPARISON) {
            return true
          }
          return false
        }
        return true
      }
      // 对于非叶子节点，即具有左右子节点的节点，递归调用 travelTreeChecker 函数进行子节点的验证，并将 pass 与子节点验证结果相与，确保所有子节点都通过验证后，当前节点才能通过验证
      if (!thisNode.left || !thisNode.right) {
        return false
      }
      pass = pass && travelTreeChecker(thisNode.left, pass)
      pass = pass && travelTreeChecker(thisNode.right, pass)
      return pass
    }
    return travelTreeChecker(this.rootNode, true)
  }

  // 检查嵌套节点
  // eslint-disable-next-line no-unused-vars
  this.validateNesting = function(node, pass) {
    // 检查传入的节点 node 的类型是否为 NODE_TYPE.CALCULATE，即是否为计算节点。如果不是，直接返回 true，因为只有计算节点才需要进行验证
    if (node.nodeType === NODE_TYPE.CALCULATE) {
      // 计算节点，首先递归地调用 validateNesting 函数分别验证左子节点 node.left 和右子节点 node.right 的有效性，并将当前 pass 值与左右子节点的验证结果相与，确保左右子节点都通过了嵌套节点的验证
      pass = this.validateNesting(node.left, pass)
      // 返回左右子节点返回类型是否一致的布尔值结果。如果左右子节点的返回类型相同，返回 true，表示嵌套节点验证通过，否则返回 false，表示嵌套节点验证失败
      pass = this.validateNesting(node.right, pass)
      if (node.left.returnType === 'long' && node.right.returnType === 'double') {
        return true
      }
      if (node.left.returnType === 'double' && node.right.returnType === 'long') {
        return true
      }
      return node.left.returnType === node.right.returnType
    }
    return true
  }

  /**
   * 遍历一次,返回打散的nodeArray,为了提取文本信息
   * @returns {null|[]}
   */
  this.inOrderTravel = function(tree) {
    // 检查传入的树 tree 是否为空，如果为空，则直接返回空数组
    if (!tree) {
      return null
    }
    const stack = []

    // 定义辅助函数 v(thisNode)，用于判断当前节点 thisNode 是否有效。
    function v(thisNode) {
      if (!thisNode) {
        return false
      }
      if (thisNode.nodeType === NODE_TYPE.EXPRESSION) {
        // 如果节点类型为 NODE_TYPE.EXPRESSION，则判断 expressionId 是否为 null，如果为 null 则表示无效
        return thisNode.expressionId !== null
      } else if (thisNode.nodeType === NODE_TYPE.COMPARISON) {
        // 如果节点类型为 NODE_TYPE.COMPARISON，则判断 left、code 和 right 是否存在，如果任何一个不存在则表示无效；
        return thisNode.left && thisNode.code && thisNode.right
      }
      // 其他类型的节点均视为有效
      return true
    }

    // 定义递归函数 f(thisNode)，用于进行中序遍历。首先，如果节点存在 subTree 属性，表示当前节点为嵌套节点，将左括号 '(' 加入到 stack 中
    function f(thisNode) {
      if (thisNode.subTree) {
        stack.push('(')
      }
      // 判断左子节点 thisNode.left 是否有效，如果有效，递归调用 f(thisNode.left)
      if (v(thisNode.left)) {
        f(thisNode.left)
      }
      // 判断当前节点 thisNode 是否有效，通过调用辅助函数 v(thisNode) 进行判断。如果有效，将当前节点加入到 stack 中
      if (v(thisNode)) {
        stack.push(thisNode)
      } else {
        // 当前节点无效，则说明树的结构不完整，直接返回 stack
        return stack
      }
      // 判断右子节点 thisNode.right 是否有效，如果有效，递归调用 f(thisNode.right)
      if (v(thisNode.right)) {
        f(thisNode.right)
      }
      // 如果节点存在 subTree 属性，表示当前节点为嵌套节点，将右括号 ')' 加入到 stack 中
      if (thisNode.subTree) {
        stack.push(')')
      }
    }
    // 返回 stack 数组，其中包含了按中序遍历顺序排列的树节点和括号
    f(tree)
    return stack
  }

  /**
   * 遍历一次,完全打散的node,嵌套节点层级提升
   * @returns {null|[]}
   */
  this.inOrderTravelCurry = function(stack) {
    // 创建一个空数组 arr，用于存储中序遍历后的节点
    const arr = []
    // 遍历节点数组 stack 中的每个元素 element
    stack.forEach(element => {
      // 类型为 NODE_TYPE.NESTING 的节点，将其内部的节点数组 element.arr 加入到 arr 中。这样可以展开嵌套节点，将嵌套节点中的所有子节点插入到遍历结果中
      if (element.nodeType === NODE_TYPE.NESTING) { arr.push(...element.arr) } else if (element.nodeType === NODE_TYPE.COMPARISON) {
        // 类型为 NODE_TYPE.COMPARISON 的节点，需要进一步处理其左右子节点。
        if (element.left && element.left.nodeType === NODE_TYPE.NESTING) {
          // 如果左子节点是嵌套节点，则将其内部的节点数组复制一份并加入到 arr 中，然后将左子节点置空。接着将当前节点本身添加到 arr 中
          const tempArr = _.cloneDeep(element.left.arr)
          arr.push(tempArr)
        } else {
          arr.push(element.left)
        }
        element.left = null
        arr.push(element)
        // 如果右子节点也是嵌套节点，则将其内部的节点数组复制一份并加入到 arr 中，然后将右子节点置空
        if (element.right && element.right.nodeType === NODE_TYPE.NESTING) {
          const tempArr = _.cloneDeep(element.right.arr)
          arr.push(tempArr)
        } else {
          arr.push(element.right)
        }
        element.right = null
      } else {
        // 其他类型的节点，直接将节点添加到 arr 中
        arr.push(element)
      }
    })

    // 通过 _.flattenDeep 函数将 arr 扁平化，即将多层嵌套的数组结构转换为一维数组，并返回扁平化后的结果
    return _.flattenDeep(arr)
  }

  // 把array 转为treeNode 数组转换成BTree
  this.parseRuleNode = function(root, NodeArray) {
    const linkedList = []
    const ArithmeticOperatorEnum = {
      ADD: 'ADD',
      SUB: 'SUB',
      MULTIPLY: 'MULTIPLY',
      DIVIDE: 'DIVIDE',
      APPEND: 'APPEND',
      DATE_ADD: 'DATE_ADD',
      DATE_SUB: 'DATE_SUB'
    }
    // 循坏数组结构
    console.log(111, NodeArray)
    for (const ruleNode of NodeArray) {
      // 如果当前节点是左括号'('，将其加入链表数组并继续循环
      if (ruleNode.label === '(') {
        linkedList.push(ruleNode)
        continue
      }
      console.log(222, NodeArray)

      // 判断当前item节点是否等于表达式类型
      if (ruleNode.nodeType === NODE_TYPE.COMPARISON) {
        // 判断当前item的左节点 === 嵌套节点类型
        // 如果当前节点的左子节点是嵌套类型的节点，递归调用`parseRuleNode`函数，构建嵌套节点的树，并将其赋值给左子节点的`nestingTree`属性
        // if (ruleNode.label === '不成立') {
        //   linkedList.push(ruleNode)
        // }
        if (Array.isArray(ruleNode.left) && ruleNode.left.length > 0) {
          const nestingNode = this.parseRuleNode(null, ruleNode.left)
          ruleNode.left = nestingNode
        } else if (Array.isArray(ruleNode.right) && ruleNode.right.length > 0) {
          const nestingNode = this.parseRuleNode(null, ruleNode.right)
          ruleNode.right = nestingNode
        } else if ((ruleNode.left && ruleNode.left.nodeType === NODE_TYPE.NESTING) && (ruleNode.right && ruleNode.right.nodeType !== NODE_TYPE.NESTING)) {
          // 如果左节点是嵌套节点, 递归调用本身，把嵌套节点的Arr数组传进去
          const nestingNode = this.parseRuleNode(null, ruleNode.left.arr)
          ruleNode.left.nestingTree = nestingNode
          ruleNode.left.arr = null
        } else if ((ruleNode.right && ruleNode.right.nodeType === NODE_TYPE.NESTING) && (ruleNode.left && ruleNode.left.nodeType !== NODE_TYPE.NESTING)) {
        // 判断当前item的右节点 === 嵌套节点类型
          const nestingNode = this.parseRuleNode(null, ruleNode.right.arr)
          ruleNode.right.nestingTree = nestingNode
          ruleNode.right.arr = null
          console.log(333, ruleNode)
        } else if ((ruleNode.left && ruleNode.left.nodeType === NODE_TYPE.NESTING) && (ruleNode.right && ruleNode.right.nodeType === NODE_TYPE.NESTING)) {
          // 左右节点都是嵌套节点
          const nestingNode = this.parseRuleNode(null, ruleNode.left.arr)
          ruleNode.left.nestingTree = nestingNode
          ruleNode.left.arr = null
          const nestingNode1 = this.parseRuleNode(null, ruleNode.right.arr)
          ruleNode.right.nestingTree = nestingNode1
          ruleNode.right.arr = null
        } else if (ruleNode.left && ruleNode.left.nodeType === 'TREE_EX') {
          // 如果左节点是TREE_EX节点, 不对该节点进行处理，原样返回给后端
          const nestingNode = ruleNode.left.arr
          // ruleNode.left.nestingTree = nestingNode
          ruleNode.left.arr = nestingNode
        } else if (ruleNode.right && ruleNode.right.nodeType === 'TREE_EX') {
        // 如果右节点是TREE_EX节点, 不对该节点进行处理，原样返回给后端
          const nestingNode = ruleNode.right.arr
          // ruleNode.right.nestingTree = nestingNode
          ruleNode.right.arr = nestingNode
        }
      }

      // 判断当前item的节点类型=== 嵌套节点类型
      // 判断当前节点是否为嵌套类型的节点
      if (ruleNode.nodeType === NODE_TYPE.NESTING) {
        const nestingNode = this.parseRuleNode(null, ruleNode.arr)
        ruleNode.nestingTree = nestingNode
        ruleNode.arr = null
      }

      // 如果链表数组中有节点
      if (linkedList.length > 0) {
        // 如果当前节点不是右括号')'，将其加入链表数组并继续循环
        if (ruleNode.label !== ')') {
          linkedList.push(ruleNode)
          continue
        }
        // 如果当前节点是右括号')'，从链表数组中取出节点，构建成临时树`tempTree`
        const tempTree = convertRightBracket(linkedList)
        // 如果链表数组仍然有节点，说明括号内还有其他节点，将`tempTree`加入链表数组，并继续循环
        if (linkedList.length > 0) { // 括号内节点构建成tree放入栈中
          linkedList.push(tempTree)
          continue
        }

        // 如果链表数组已经没有其他节点，说明括号内的节点已经构建成树，将`tempTree`和根节点`root`合并构建成新的根节点，并继续循环
        root = convertRoot(root, tempTree)
        continue
      }

      // 如果链表数组中没有节点，说明当前节点是第一个节点，将其作为根节点`root`构建成树
      root = convertRoot(root, ruleNode) // 构建成tree

      // 循环结束
    }
    // 循环结束，返回构建好的树的根节点
    return root

    // 定义一个辅助函数`convertRightBracket`，用于处理右括号')'，构建临时树
    function convertRightBracket(linkedList) {
      const tempNodes = [] // 存临时节点
      let tempRootNode = null
      let isLeftBracket = null
      // 从链表数组中取出节点，直到遇到左括号'('，将取出的节点存入临时数组`tempNodes`
      do {
        const node = linkedList.pop()
        tempNodes.push(node)
        isLeftBracket = node.nodeType === NODE_TYPE.BRACKETS && node.label === '('
      } while (!isLeftBracket)

      // 从临时数组`tempNodes`中构建临时树`tempRootNode`
      for (let i = tempNodes.length - 1; i >= 0; --i) {
        const temp = tempNodes[i]
        if (temp.nodeType === NODE_TYPE.BRACKETS) {
          continue
        }
        tempRootNode = convertRoot(tempRootNode, temp)
      }
      // 将临时树标记为子树，以便在后续处理中识别
      tempRootNode.subTree = true
      return tempRootNode
    }

    // 定义一个辅助函数`convertRoot`，用于将新的节点`node`与根节点`root`合并构建成新的根节点
    function convertRoot(root, node) {
      // if (node.label === '不成立') {
      //   root.isFalse = true
      //   return root
      // }
      if (root == null) {
        return node
      }
      if (root.nodeType === NODE_TYPE.LOGICAL) {
        if (node.nodeType === NODE_TYPE.LOGICAL) {
          // root优先级不低于node，把root挂在node左节点
          if (compareLogicalNodeSort(root, node) >= 0) {
            node.left = root
            return node
          }
          // 挂在root的右节点
          pickupRightNode(root, node)
          return root
        }

        // 将`node`挂在`root`的右节点
        pickupRightNode(root, node)
        return root
      }
      // 算术运算
      if (root.nodeType === NODE_TYPE.CALCULATE) {
        if (node.nodeType === NODE_TYPE.CALCULATE) {
          if (compareCalculateNodeSort(root, node) >= 0) {
            node.left = root
            return node
          }
        }
        if (node.nodeType !== NODE_TYPE.EXPRESSION || node.subTree) {
          pickupRightNode(root, node)
          return root
        }
        if (node.nodeType === NODE_TYPE.EXPRESSION) {
          pickupRightNode(root, node)
          return root
        }
      }
      node.left = root
      return node
    }

    /**
     * 比较节点1和节点2的逻辑优先级
     * 括号 > 且 > 或
     * -1 node1 < node2
     * 0 node1 = node2
     * 1 node1 > node2
     */
    function compareLogicalNodeSort(node1, node2) {
      if (node1.nodeType !== NODE_TYPE.LOGICAL || node2.nodeType !== NODE_TYPE.LOGICAL) {
        console.error('不是逻辑节点')
      }
      if (node1.subTree === true && node2.subTree === true) {
        return 0
      }
      if (node1.subTree != null && node1.subTree === true) {
        return 1
      }
      if (node2.subTree != null && node2.subTree === true) {
        return -1
      }
      if (node1.label === node2.label) {
        return 0
      }
      if (node1.label === '并且') {
        return 1
      }
      return -1
    }

    function compareCalculateNodeSort(node1, node2) {
      // 函数会检查node1和node2是否都标记为子树（subTree为true）。如果两个节点都是子树，则它们的优先级相同，返回值为0
      if (node1.subTree && node2.subTree) {
        return 0
      }

      // 函数会检查node1和node2是否分别为子树。如果node1是子树而node2不是，说明node1的优先级更高，返回值为1。
      if (node1.subTree) {
        return 1
      }
      // 相反，如果node2是子树而node1不是，说明node2的优先级更高，返回值为-1
      if (node2.subTree) {
        return -1
      }

      // 函数检查节点的运算符类型code。如果node1和node2中的任何一个是乘法或除法运算符（MULTIPLY或DIVIDE），则它们的优先级相同，返回值为0
      if ((ArithmeticOperatorEnum.MULTIPLY === node1.code || ArithmeticOperatorEnum.DIVIDE === node1.code) ||
          ArithmeticOperatorEnum.MULTIPLY === node2.code || ArithmeticOperatorEnum.DIVIDE === node2.code) {
        return 0
      }

      // node1是乘法或除法运算符而node2不是，说明node1的优先级更高，返回值为1。
      if (ArithmeticOperatorEnum.MULTIPLY === node1.code || ArithmeticOperatorEnum.DIVIDE === node1.code) {
        return 1
      }
      // 相反，如果node2是乘法或除法运算符而node1不是，说明node2的优先级更高，返回值为-1
      if (ArithmeticOperatorEnum.MULTIPLY === node2.code || ArithmeticOperatorEnum.DIVIDE === node2.code) {
        return -1
      }

      // 以上条件都不满足，说明node1和node2的运算符类型都不是乘法或除法，且它们的优先级相同，返回值为0
      return 0
    }

    function pickupRightNode(srcNode, node) {
      const rightNode = srcNode.right
      if (srcNode.right == null) {
        srcNode.right = node
        return
      }
      if (rightNode.nodeType === NODE_TYPE.LOGICAL) {
        pickupRightNode(srcNode.right, node)
        return
      }

      node.left = rightNode
      srcNode.right = node
    }
  }

  // 把trreNode结构转为array
  this.parseRuleArray = function(tree) {
    const root = tree || this.root // 取传入的trre ，未传则取实例的值
    if (root === null) {
      return null
    }
    const stack = []

    function handleItem(node) {
      // 检查 node 是否为非空。如果节点为空，函数返回 null，表示没有要处理的有效节点
      if (!node) {
        return null
      }
      // 节点不为空，通过使用展开语法（{ ...node }），创建一个新对象 obj。这样会创建 node 对象的浅拷贝，保留其所有属性
      const obj = { ...node }
      // 函数检查 node 的 nodeType 属性。如果 nodeType 为 NODE_TYPE.LOGICAL，表示该节点是一个逻辑运算符（并且 或者）。在这种情况下，函数将新对象 obj 的 left 和 right 属性设置为 null
      if (node.nodeType === NODE_TYPE.LOGICAL) {
        obj.left = null
        obj.right = null
      }

      return obj
    }

    function f(thisNode) {
      // 如果当前节点有子树标记subTree为true，表示当前节点是一个子树的根节点，需要在数组中添加左括号节点{ nodeType: NODE_TYPE.BRACKETS, label: '(' }，以表示子树的开始
      if (thisNode.subTree) {
        const obj = {
          nodeType: NODE_TYPE.BRACKETS,
          label: '('
        }
        stack.push(obj)
      }

      // 递归处理当前节点的左子节点
      if (thisNode.left) {
        f(thisNode.left)
      }

      // 当前节点是逻辑节点或比较节点，将处理后的当前节点添加到数组中，调用handleItem函数创建一个新的节点对象，并将其加入stack数组
      if (thisNode.nodeType === NODE_TYPE.LOGICAL || thisNode.nodeType === NODE_TYPE.COMPARISON) {
        const item = handleItem(thisNode)
        stack.push(item)
      } else if (thisNode.nodeType === NODE_TYPE.EXPRESSION || thisNode.nodeType === NODE_TYPE.NESTING) {
      // 当前节点是表达式节点或嵌套节点，直接将当前节点加入stack数组
        stack.push(thisNode)
      }

      // 递归处理当前节点的右子节点
      if (thisNode.right) {
        f(thisNode.right)
      }

      // 如果当前节点有子树标记subTree为true，表示当前节点是一个子树的根节点，需要在数组中添加右括号节点{ nodeType: NODE_TYPE.BRACKETS, label: ')' }，以表示子树的结束
      if (thisNode.subTree) {
        const obj = {
          nodeType: NODE_TYPE.BRACKETS,
          label: ')'
        }
        stack.push(obj)
      }
      // if (thisNode.isFalse) {
      //   const obj = {
      //     label: '不成立',
      //     nodeType: NODE_TYPE.COMPARISON,
      //     returnType: 'boolean'
      //   }
      //   stack.push(obj)
      // }
    }
    f(root)
    this.rootArray = stack
    return stack
  }

  // setPath
  this.setPath = function(node, path) {
    node.path = path
    if (node.left) {
      this.setPath(node.left, path + '.left')
    }
    if (node.nestingTree) {
      this.setPath(node.nestingTree, path + '.nestingTree')
    }
    if (node.right) {
      this.setPath(node.right, path + '.right')
    }
  }

  /**
     * 把树结构转换成数组
     * @param treeNode
     * @return
     */
  // treeNode表示树的根节点，nodeList表示存储节点数组的容器
  this.convertNodeTreeToArray = function(treeNode, nodeList) {
    if (!treeNode) {
      return nodeList
    }
    const nodeType = treeNode.nodeType
    const issubTree = treeNode.subTree
    if (issubTree) {
      const bracketNode = {
        label: '(',
        nodeType: NODE_TYPE.BRACKETS
      }
      treeNode.subTree = null
      nodeList.push(bracketNode)
    }
    if (nodeType === NODE_TYPE.COMPARISON) {
      if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray(treeNode.left.nestingTree, arr)
        treeNode.left.arr = arr
        treeNode.left.nestingTree = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.COMPARISON) {
        this.convertNodeTreeToArray(treeNode.left, nodeList)
        treeNode.left = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.LOGICAL) {
        this.convertNodeTreeToArray(treeNode.left, nodeList)
        treeNode.left = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.EXPRESSION) {
        this.convertNodeTreeToArray(treeNode.left, nodeList)
        treeNode.left = null
      }
      if (treeNode.right && treeNode.right.nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray(treeNode.right.nestingTree, arr)
        treeNode.right.arr = arr
        treeNode.right.nestingTree = null
      }
      nodeList.push(treeNode)
      if (treeNode.right && treeNode.right.nodeType === NODE_TYPE.COMPARISON) {
        this.convertNodeTreeToArray(treeNode.right, nodeList)
        treeNode.right = null
      }
    } else {
      if (treeNode.left) {
        this.convertNodeTreeToArray(treeNode.left, nodeList)
        treeNode.left = null
      }
      if (nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray(treeNode.nestingTree, arr)
        treeNode.arr = arr
        treeNode.nestingTree = null
      }
      nodeList.push(treeNode)
      if (treeNode.right) {
        this.convertNodeTreeToArray(treeNode.right, nodeList)
        treeNode.right = null
      }
    }
    if (issubTree) {
      const bracketNode = {
        label: ')',
        nodeType: NODE_TYPE.BRACKETS
      }
      treeNode.subTree = null
      nodeList.push(bracketNode)
    }
    const filteredArray = nodeList.filter(item => item !== null && item !== undefined)
    return filteredArray
  }
  this.convertNodeTreeToArray1 = function(treeNode, nodeList) {
    if (!treeNode) {
      return nodeList
    }
    const nodeType = treeNode.nodeType
    const issubTree = treeNode.subTree
    if (issubTree) {
      const bracketNode = {
        label: '(',
        nodeType: NODE_TYPE.BRACKETS
      }
      treeNode.subTree = null
      nodeList.push(bracketNode)
    }
    if (nodeType === NODE_TYPE.COMPARISON) {
      if (treeNode.right && treeNode.right.label === '不成立' && treeNode.left) {
        const arr = []
        this.convertNodeTreeToArray1(treeNode.left, arr)
        treeNode.left = arr
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray1(treeNode.left.nestingTree, arr)
        treeNode.left.arr = arr
        treeNode.left.nestingTree = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.COMPARISON) {
        this.convertNodeTreeToArray1(treeNode.left, nodeList)
        treeNode.left = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.LOGICAL) {
        this.convertNodeTreeToArray1(treeNode.left, nodeList)
        treeNode.left = null
      } else if (treeNode.left && treeNode.left.nodeType === NODE_TYPE.EXPRESSION) {
        this.convertNodeTreeToArray1(treeNode.left, nodeList)
        treeNode.left = null
      }
      if (treeNode.right && treeNode.right.nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray1(treeNode.right.nestingTree, arr)
        treeNode.right.arr = arr
        treeNode.right.nestingTree = null
      }
      nodeList.push(treeNode)
      if (treeNode.right && treeNode.right.nodeType === NODE_TYPE.COMPARISON) {
        this.convertNodeTreeToArray1(treeNode.right, nodeList)
        treeNode.right = null
      }
    } else {
      if (treeNode.left) {
        this.convertNodeTreeToArray1(treeNode.left, nodeList)
        treeNode.left = null
      }
      if (nodeType === NODE_TYPE.NESTING) {
        const arr = []
        this.convertNodeTreeToArray1(treeNode.nestingTree, arr)
        treeNode.arr = arr
        treeNode.nestingTree = null
      }
      nodeList.push(treeNode)
      if (treeNode.right) {
        this.convertNodeTreeToArray1(treeNode.right, nodeList)
        treeNode.right = null
      }
    }
    if (issubTree) {
      const bracketNode = {
        label: ')',
        nodeType: NODE_TYPE.BRACKETS
      }
      treeNode.subTree = null
      nodeList.push(bracketNode)
    }
    const filteredArray = nodeList.filter(item => item !== null && item !== undefined)
    return filteredArray
  }
  // 在array提取文本信息
  this.getText = function(treeNode, ruleText) {
    // 调用 this.convertNodeTreeToArray1(treeNode, []) 将表达式树节点转换为数组表示，并存储在变量 arr 中
    const arr = this.convertNodeTreeToArray1(treeNode, [])
    // debugger
    // 使用 this.inOrderTravelCurry(arr) 函数对数组进行中序遍历，返回一个扁平化的节点列表 flatten
    let flatten = this.inOrderTravelCurry(arr)
    // 扁平化的节点列表 flatten 为空，则返回空字符串，表示规则文本为空
    if (flatten.length === 0) {
      return ''
    }
    flatten = flatten.filter(item => item !== null && item !== undefined)
    // 遍历 flatten 中的每个节点，并根据节点的 nodeType 属性来构建规则文本
    flatten.forEach(item => {
      // 类型为 NODE_TYPE.EXPRESSION 的节点，表示它是一个表达式节点，需要根据其参数列表构建文本。根据参数列表中每个元素的类型来逐步添加对应的文本内容
      if (item.nodeType === NODE_TYPE.EXPRESSION) {
        let list = [] // 表达式的参数列表
        if (item.expressionId) { list = _.get(store.state.app.IdExpressionList, `[${item.expressionId}].expressionArray`) }
        list && list.forEach(element => {
          if (element.type === 'field') {
            if (item.paramValue[element.paramId] && item.paramValue[element.paramId].nodeType && item.paramValue[element.paramId].nodeType === 'METHOD') {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else if (item.paramValue[element.paramId] && item.paramValue[element.paramId].exprNode) {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else if (item.paramValue[element.paramId] && item.paramValue[element.paramId].nodeType === 'TREE_EX') {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else {
              ruleText = ruleText.concat('<span class="fields">')
              ruleText = ruleText.concat(_.get(item, `paramValue.${element.paramId}.label`) || '')
              ruleText = ruleText.concat('</span>')
            }
          } else if (element.type === 'text') {
            ruleText = ruleText.concat(element.desc)
          } else if (element.type === 'input') {
            ruleText = ruleText.concat('<span class="values">')
            if (Array.isArray(item.paramValue[element.paramId])) {
              item.paramValue[element.paramId].forEach(item1 => {
                if (typeof item1 === 'object') {
                  ruleText = ruleText.concat(item1.label || element.desc)
                } else {
                  ruleText = ruleText.concat(item1 || element.desc)
                }
              })
            } else if (typeof item.paramValue[element.paramId] === 'object') {
              ruleText = ruleText.concat(item.paramValue[element.paramId].label || element.desc)
            } else {
              ruleText = ruleText.concat(item.paramValue[element.paramId] || element.desc)
            }
            ruleText = ruleText.concat('</span>')
          } else if (element.type === 'selector' || element.type === 'selector-multiple') {
            ruleText = ruleText.concat('<span class="values">')
            const valList = item.paramValue[element.paramId]
            ruleText = ruleText.concat('</span>')
            if (!valList) {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat('<' + RETURN_TYPE_DESC[element.returnType] + '>')
              ruleText = ruleText.concat('</span>')
            } else if (valList && valList.constructor === Array) {
              const olist = valList.map(o => o.label)
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat('[' + olist + ']')
              ruleText = ruleText.concat('</span>')
            } else {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(_.get(valList, 'label') || valList || '<' + RETURN_TYPE_DESC[element.returnType.toLowerCase()] + '>')
              ruleText = ruleText.concat('</span>')
            }
          } else if (element.type === 'actualTypeNames') { // 默认取第一个参数的字段信息
            ruleText = ruleText.concat(_.get(item, 'paramValue.param1.actualTypeNames'))
          } else if (element.type === 'date' || element.type === 'time') {
            ruleText = ruleText.concat(_.get(item, `paramValue.${element.paramId}`) || '')
          }
        })
      } else if (item.nodeType === 'METHOD') {
        let list = [] // 表达式的参数列表
        const IdExpressionList1 = JSON.parse(localStorage.getItem('IdExpressionList'))
        if (item.expressionId) { list = IdExpressionList1[item.expressionId.toUpperCase()] } else if (item.path) { list = IdExpressionList1[item.path.toUpperCase()] }
        ruleText = ruleText.concat('<span class="fields">')
        ruleText = ruleText.concat(item.methodName)
        ruleText = ruleText.concat('</span>')
        ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
        ruleText = ruleText.concat('（')
        ruleText = ruleText.concat('</span>')
        if (list && list.expressionArray) {
          list && list.expressionArray.forEach((element, index) => {
            if (Array.isArray(item.paramValue[element.paramId])) {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else if (item.paramValue[element.paramId].nodeType === 'NESTING') {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId].arr, ''))
            } else if (item.paramValue[element.paramId].nodeType === 'METHOD') {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else if (item.paramValue[element.paramId].exprNode) {
              ruleText = ruleText.concat(this.getText(item.paramValue[element.paramId], ''))
            } else if (element.type === 'field') {
              ruleText = ruleText.concat('<span class="fields">')
              ruleText = ruleText.concat(_.get(item, `paramValue.${element.paramId}.label`) || '')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'object') {
              ruleText = ruleText.concat('<span class="fields">')
              ruleText = ruleText.concat(_.get(item, `paramValue.${element.paramId}.label`) || '')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'text') {
              ruleText = ruleText.concat(element.desc)
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'input') {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(item.paramValue[element.paramId].paramValue || element.desc)
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'selector' || element.type === 'selector-multiple') {
              ruleText = ruleText.concat('<span class="values">')
              const valList = item.paramValue[element.paramId].paramValue
              ruleText = ruleText.concat('</span>')
              if (!valList) {
                ruleText = ruleText.concat('<span class="values">')
                ruleText = ruleText.concat('<' + RETURN_TYPE_DESC[element.returnType] + '>')
                ruleText = ruleText.concat('</span>')
              } else if (valList && valList.constructor === Array) {
                const olist = valList.map(o => o.label)
                ruleText = ruleText.concat('<span class="values">')
                ruleText = ruleText.concat('[' + olist + ']')
                ruleText = ruleText.concat('</span>')
              } else {
                ruleText = ruleText.concat('<span class="values">')
                ruleText = ruleText.concat(_.get(valList, 'label') || valList || '<' + RETURN_TYPE_DESC[element.returnType.toLowerCase()] + '>')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'actualTypeNames') { // 默认取第一个参数的字段信息
              ruleText = ruleText.concat(_.get(item, 'paramValue.param1.actualTypeNames'))
            } else if (element.type === 'date' || element.type === 'time') {
              if (typeof item.paramValue[element.paramId] === 'object') {
                ruleText = ruleText.concat('<span class="values">')
                ruleText = ruleText.concat(item.paramValue[element.paramId].label)
                ruleText = ruleText.concat('</span>')
              } else {
                ruleText = ruleText.concat(_.get(item, `paramValue.${element.paramId}.paramValue`) || '')
              }
            } else if (element.type === 'string') {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(item.paramValue[element.paramId].label || item.paramValue[element.paramId].paramValue || '<' + RETURN_TYPE_DESC[element.type] + '>')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'int') {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(item.paramValue[element.paramId].label || item.paramValue[element.paramId].paramValue || '<' + RETURN_TYPE_DESC[element.type] + '>')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'integer') {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(item.paramValue[element.paramId].label || item.paramValue[element.paramId].paramValue || '<' + RETURN_TYPE_DESC[element.type] + '>')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            } else if (element.type === 'double') {
              ruleText = ruleText.concat('<span class="values">')
              ruleText = ruleText.concat(item.paramValue[element.paramId].label || item.paramValue[element.paramId].paramValue || '<' + RETURN_TYPE_DESC[element.type] + '>')
              ruleText = ruleText.concat('</span>')
              if (Object.keys(item.paramValue).length - 1 !== index) {
                ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
                ruleText = ruleText.concat('，')
                ruleText = ruleText.concat('</span>')
              }
            }
          })
        }
        ruleText = ruleText.concat('<span class="mr-5" style="font-weight: 700;">')
        ruleText = ruleText.concat('）')
        ruleText = ruleText.concat('</span>')
      } else if ([NODE_TYPE.CALCULATE, NODE_TYPE.BRACKETS].includes(item.nodeType)) {
        // 类型为 NODE_TYPE.CALCULATE、NODE_TYPE.FIELD 和 NODE_TYPE.BRACKETS 的节点，直接将它们的 label 属性（运算符、字段或括号）添加到规则文本中
        ruleText = ruleText.concat('<span>')
        ruleText = ruleText.concat(' ' + item.label + ' ')
        ruleText = ruleText.concat('</span>')
      } else if ([NODE_TYPE.FIELD].includes(item.nodeType)) {
        if (item.exprNode) {
          ruleText = ruleText.concat(this.getText(item.exprNode, ''))
          ruleText = ruleText.concat('<span class="fields">')
          ruleText = ruleText.concat('的' + item.label + ' ')
          ruleText = ruleText.concat('</span>')
        } else if (item.text) {
          ruleText = ruleText.concat('<span class="fields">')
          ruleText = ruleText.concat(' ' + item.text + ' ')
          ruleText = ruleText.concat('</span>')
        } else {
          ruleText = ruleText.concat('<span class="fields">')
          ruleText = ruleText.concat(' ' + item.label + ' ')
          ruleText = ruleText.concat('</span>')
        }
        // 类型为 NODE_TYPE.CALCULATE、NODE_TYPE.FIELD 和 NODE_TYPE.BRACKETS 的节点，直接将它们的 label 属性（运算符、字段或括号）添加到规则文本中
      } else if (item.nodeType === NODE_TYPE.CUSTOM) {
        // 类型为 NODE_TYPE.CUSTOM 的节点，根据其参数值 paramValue 来构建文本。如果参数值是数组类型，则将数组中每个元素的标签拼接成文本；否则，如果有 paramValue 则使用该标签，否则使用该节点的 returnType 属性来拼接默认文本
        if (_.isArray(item.paramValue)) {
          const olist = item.paramValue.map(o => o.label)
          ruleText = ruleText.concat('[' + olist + ']')
        } else if (item.label === '不成立') {
          ruleText = ruleText.concat('<span class="values">')
          ruleText = ruleText.concat(_.get(item, 'label') || _.get(item, 'label') || '<' + RETURN_TYPE_DESC[item.returnType.toLowerCase()] + '>')
          ruleText = ruleText.concat('</span>')
        } else {
          ruleText = ruleText.concat('<span class="values">')
          ruleText = ruleText.concat(_.get(item, 'paramValue.label') || _.get(item, 'paramValue') || '<' + RETURN_TYPE_DESC[item.returnType.toLowerCase()] + '>')
          ruleText = ruleText.concat('</span>')
        }
        if (item.paramValueUnit) {
          ruleText = ruleText.concat(item.paramValueUnit.label)
        }
      } else if ([NODE_TYPE.LOGICAL, NODE_TYPE.COMPARISON].includes(item.nodeType)) {
        // 类型为 NODE_TYPE.LOGICAL 和 NODE_TYPE.COMPARISON 的节点，直接将它们的 label 属性（逻辑运算符或比较运算符）添加到规则文本中。如果该属性为空，则添加 " -- "。
        ruleText = ruleText.concat(' ' + item.label + ' ' || ' -- ')
      } else if (item.nodeType === NODE_TYPE.NESTING) {
        // 类型为 NODE_TYPE.LOGICAL 和 NODE_TYPE.COMPARISON 的节点，直接将它们的 label 属性（逻辑运算符或比较运算符）添加到规则文本中。如果该属性为空，则添加 " -- "。
        ruleText = ruleText.concat(this.getText(item.arr, ''))
      } else if (item.nodeType === 'TREE_EX') {
        ruleText = ruleText.concat(this.getText(item.arr, ''))
      } else if (item.dataType === 'field') {
        ruleText = ruleText.concat('<span class="values">')
        ruleText = ruleText.concat(item.label)
        ruleText = ruleText.concat('</span>')
      } else {
        ruleText = ruleText.concat('<span class="values">')
        ruleText = ruleText.concat(item)
        ruleText = ruleText.concat('</span>')
      }
    })
    return ruleText
  }
  // 提取codeServeic,expressId
  this.getAttrInfo = function() {
    const ServiceKey = []
    const ExpressionKey = []
    const arr = this.inOrderTravelCurry()

    arr && arr.forEach(item => {
      if (item.codeService) {
        if (!ServiceKey.some((val) => val === item.codeService)) {
          ServiceKey.push(item.codeService)
        }
      }
      if (item.expressionId) {
        if (!ExpressionKey.some((val) => val === item.expressionId)) {
          ExpressionKey.push(item.expressionId)
        }
      }
    })
    return {
      ServiceKey, ExpressionKey
    }
  }
}

export {
  RuleEditor
}
