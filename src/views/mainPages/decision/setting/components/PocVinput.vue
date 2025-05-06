<template>
  <div class="relative treeInput" :class="{ 'express-node': paramId }">
    <!-- 节点： -->
    <template v-if="format.type === 'input'&&format.desc==='<布尔参数>'">
      <span @contextmenu.prevent="rightClick">
        <el-select v-model="vInputValue" placeholder="请选择">
          <el-option
            v-for="item in booleanOptions"
            :key="item.value"
            ref="addParamsInput"
            :label="item.label"
            :value="item.value"
            class="input"
            @blur="inputBlur"
          />
        </el-select>
      </span></template>
    <template v-if="format.type === 'input'&&format.desc!=='<布尔参数>'">
      <!-- :type="format.returnType === 'string' ? (vInputValueLength>30?'textarea':'text') : 'number'" -->
      <span @contextmenu.prevent="rightClick">
        <el-input
          ref="addParamsInput"
          v-model="vInputValue"
          class="input"
          :type="format.returnType === 'string' ? 'textarea' : 'number'"
          :placeholder="RETURN_TYPE[format.returnType]"
          :rows="1"
          resize="both"
          @blur="inputBlur"
        >
          <el-select v-if="format.unitsList" slot="append" v-model="node.paramValueUnit" value-key="key">
            <el-option v-for="item in format.unitsList" :key="item.key" :value="item" :label="item.label" />
          </el-select>
          <!-- <i slot="suffix" class="el-input__icon el-icon-circle-plus-outline" @click="clickAddIcon(...arguments)" /> -->
        </el-input>
        <span v-if="!isValidInput" style="color: red">文本内容需要用双引号包裹</span>
      </span>
    </template>
    <template v-else-if="format.type === 'date'">
      <!-- <el-input v-model="vInputValue" class="input date" type="datetime" placeholder="日期参数" /> -->
      <el-date-picker
        v-model="vInputValue"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        :placeholder="$t('common.pleaseSelectDateTime')"
      />
    </template>

    <template v-else-if="format.type === 'time'">
      <el-time-picker v-model="vInputValue" value-format="HH:mm:ss" :placeholder="$t('common.pleaseSelectTimePoint')" />
    </template>
    <template
      v-else-if="format.type === 'selector' || format.type === 'selector-multiple'
      "
    >
      <el-select
        v-model="vSelectValue"
        value-key="key"
        remote
        collapse-tags
        :class="format.type === 'selector-multiple' ? 'multiple' : ''"
        filterable
        :multiple="format.type === 'selector-multiple'"
        :remote-method="remoteMethod"
        :placeholder="$t('common.pleaseSelect')"
        @change="onChangeSelect"
      >
        <el-option v-for="item in selectList" :key="item.key" :label="item.label" :value="item">
          <span v-if="selectListInfo.listSource !== 'param-field'">
            {{ item.key }} -
          </span>
          {{ item.label }}
        </el-option>
      </el-select>
      <!-- <el-input v-else v-model="vSelectValue" @input="onChangeSelect" /> -->
    </template>
    <template v-else>{{ node.expression }}</template>

    <div
      v-if="isContextMenuVisible"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      class="menuBox"
      @mouseleave="hideContextMenu"
    >
      <div v-show="structure === 1" class="context-menu">
        <div class="funBtn" @click="clickOperation">插入bom字段</div>
      </div>
      <div v-show="structure === 2">
        <el-cascader-panel
          ref="cascaderPanel"
          v-model="changeField"
          :options="treeData"
          :props="{ value: 'field', checkStrictly: true }"
          @change="addParamsFn(index)"
        />
      </div>
    </div>

  </div>
</template>

<script>
import store from '@/store'
import { RETURN_TYPE } from '@/utils/poc'
import { getCodeService } from '@/utils/utils'
import { bomClassAndField } from '@/api/systemManage/bom'
// import bus from '@/packages/PageRuleEditor/eventBus'
export default {
  name: 'Vinput',
  props: {
    node: {
      type: Object,
      default: null
    },
    format: {
      type: Object,
      default: null
    },
    paramId: {
      type: String,
      default: null
    },
    selectListInfo: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    treeData: {
      type: Array,
      default: Array
    }
  },
  data() {
    return {
      selectList: [], // 列表
      vInputValue: null, // 普通控件存值
      vDateExpressionValue: null,
      vSelectValue: null, // 下拉框控件存值
      paramValueUnit: null, // 节点值的单位
      isContextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      changeField: '',
      structure: 1,
      options: 0,
      vInputValueLength: 0,
      jvaneedparam: '',
      startPos: 0, // 获取光标起始位置
      endPos: 0, // 获取光标结束位置
      inputNeedFieldPath: [],
      isValidInput: true,
      booleanOptions: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }]
    }
  },
  computed: {
    ExpressionDetail() {
      return this.getExpressionDetail(this.operatorCode)
    }
  },
  watch: {
    node: {
      handler(newValue, oldValue) {
        if (this.format.type === 'input') {
          this.vInputValue = newValue.paramValue[this.format.paramId]
        }
      }
    },
    vInputValue: {
      async handler(newValue) {
        if (this.paramId) {
          // 表达式存值
          this.node.paramValue[this.paramId] = newValue
        } else {
          // 普通节点存值
          this.node.paramValue = newValue
        }
        if (newValue !== true && newValue !== false) {
          if (!this.treeData) {
            await this.bomClassAndField()
          }
          if (this.node.fieldParsings) {
            const regex1 = /\${(.*?)}/g
            const matches1 = [...this.node.fieldParsings[this.paramId].matchAll(regex1)]
            const foundStrings = matches1.map(match => match[1])
            if (this.inputNeedFieldPath) {
              this.inputNeedFieldPath = [...this.inputNeedFieldPath, ...foundStrings]
            } else {
              this.inputNeedFieldPath = []
              this.inputNeedFieldPath = [...this.inputNeedFieldPath, ...foundStrings]
            }
          }
          if (!this.node.fieldParsings) {
            this.node.fieldParsings = {}
          }
          if (this.inputNeedFieldPath.length !== 0) {
            for (let i = 0; i < this.inputNeedFieldPath.length; i++) {
              const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
              const parentLabel = this.findParentLabel(treeDataCopy, this.inputNeedFieldPath[i])
              const result = parentLabel.join('的')
              if (newValue.includes(result)) {
                newValue = newValue.replace(result, '${' + this.inputNeedFieldPath[i] + '}')
              }
              this.node.fieldParsings[this.paramId] = newValue
            }
          } else {
            this.node.fieldParsings[this.paramId] = newValue
            // this.node .fieldParsings[this.paramId] = ''
          }
          const regex = /[^+\-*/]+/g
          const checkout = this.node.fieldParsings[this.paramId].match(regex)
          if (checkout) {
            checkout.forEach((item1, index1) => {
              if (!(item1.startsWith('\${') && item1.endsWith('\}'))) {
                const isNumber = /^\d+$/.test(item1)
                if (!isNumber) {
                  if (!(item1.startsWith('"') && item1.endsWith('"'))) {
                    this.isValidInput = false
                  } else {
                    this.isValidInput = true
                  }
                } else {
                  item1 = parseInt(item1)
                }
              }
            })
          }
        }
      },
      deep: true
    },
    // selectList: {
    //   handler(val) {
    //     if (val && val.length === 0) {
    //       this.vSelectValue = null;
    //     }
    //   }
    // },
    // 监听codeService 获取下拉列表数据
    'selectListInfo.codeService': {
      handler(value) {
        if (value) {
          window.console.log(value, 'selectListInfo.codeService')
          getCodeService(this.selectListInfo.codeService.toString()).then(
            () => {
              this.remoteMethod()
            }
          )
        }
      },
      deep: true,
      immediate: true
    }
    // vSelectValue: {
    //   handler(newValue) {
    //     if (!newValue) {
    //       if (this.paramId) {
    //         // 表达式存值
    //         this.node.paramValue[this.paramId] = null;
    //       } else {
    //         // 普通节点存值
    //         this.node.paramValue = null;
    //       }
    //     }
    //   }
    // }
  },
  async created() {
    this.init()
    this.RETURN_TYPE = RETURN_TYPE
    this.remoteMethod()
    // const storedData = await this.$forage.getItem('bomBaseInfoId')
    // this.treeData = [storedData]
    // this.bomClassAndField()
    // this.bomBaseInfoId()
  },
  methods: {
    // 错误提示
    validateInput() {
      // 在此处编写验证逻辑
      // 如果输入内容不符合标准，将 this.isValidInput 设置为 false
      this.isValidInput = true // 默认为 true
      // 示例验证逻辑：输入内容必须为纯数字
      if (this.errorText !== '') {
        this.isValidInput = false
      }
    },
    bomBaseInfoId() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(res => {
        this.treeData = [res]
      })
    },
    bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      return bomClassAndField(data).then(res => {
        this.treeData = [res]
      })
    },
    inputBlur(e) {
      this.startPos = e.srcElement.selectionStart
      this.endPos = e.srcElement.selectionEnd
    },
    rightClick(e) {
      this.structure = 1
      this.isContextMenuVisible = true
      this.contextMenuX = e.clientX
      this.contextMenuY = e.clientY
    },
    clickOperation() {
      this.structure = 2
    },
    findParentLabel(treeData, fieldPath) {
      // 将 fieldPath 拆分为字段名数组
      const pathElements = fieldPath.split('.')
      // 初始化一个变量来存储父级节点的 label
      const parentLabel = []

      // 递归函数，用于在树结构中查找匹配的字段名
      function findLabelRecursively(node, index) {
        if (index >= pathElements.length) {
          return // 已经遍历完所有路径元素
        }
        const fieldName = pathElements[index]

        let found = false // 用于标记是否找到匹配的字段

        for (const item of node) {
          if (item.field === fieldName) {
            parentLabel.push(item.label)
            found = true
            if (item.children) {
              findLabelRecursively(item.children, index + 1) // 递归查找下一个路径元素
            }
            break // 找到匹配的字段后，不再继续搜索当前层级的其他节点
          }
        }

        if (!found) {
          // 如果当前层级没有找到匹配的字段，继续查找下一个节点
          for (const item of node) {
            if (item.children) {
              findLabelRecursively(item.children, index)
            }
          }
        }
      }

      // 从根节点开始查找
      findLabelRecursively(treeData, 0)

      // 返回父级节点的 label
      return parentLabel
    },
    // 根据bomBaseInfoId加载所有类和字段

    hideContextMenu() {
      this.isContextMenuVisible = false
    },
    addParamsFn(e, index) {
      this.isContextMenuVisible = false
      const checkNode = this.$refs['cascaderPanel'].getCheckedNodes()[0].data
      this.inputNeedFieldPath.push(checkNode.fieldPath)
      const treeDataCopy = JSON.parse(JSON.stringify(this.treeData))
      const parentLabel = this.findParentLabel(treeDataCopy, checkNode.fieldPath)
      const result = parentLabel.join('的')
      // checkNode.label = result
      // bus.$emit('addThenListParams', { index: this.index, paramId: this.paramId, result: result })
      // var txt = this.vInputValue === 'undefined' ? '' : this.vInputValue
      var txt = this.vInputValue
      // var txt = this.$refs['addParamsInput'].$el.value
      var newValue = txt.slice(0, this.startPos) + result + txt.slice(this.endPos)
      // this.jvaneedparam = `"${txt.slice(0, this.startPos)}'${checkNode.fieldPath}'${txt.slice(this.endPos)}"`
      this.$set(this, 'vInputValue', newValue) // 更新输入框的值
      // this.$nextTick(() => {
      //   const pos = this.startPos + checkNode.label.length
      //   this.$refs.addParamsInput.$el.setSelectionRange(pos, pos)
      // })
    },
    // 下拉列表的数据
    remoteMethod(query) {
      let list = null
      if (this.node.nodeType === 'CUSTOM') {
        // 比较节点的列表
        list = store.state.app.CodeService[this.selectListInfo.codeService]
      } else {
        // 表达式的列表
        if (this.selectListInfo.listSource === 'param-field') {
          list = store.state.app.ListByField[this.selectListInfo.codeService]
        } else if (this.selectListInfo.codeService) {
          list = store.state.app.CodeService[this.selectListInfo.codeService]
        } else {
          list = store.state.app.CodeService[this.node.codeService]
        }
        if (this.selectListInfo.listSourceFilter && list) {
          list = list.filter(item => {
            return item.codeService
          })
        }
      }
      //  搜索过滤
      if (query !== '' && query !== undefined) {
        this.selectList = list.filter(item => {
          return item.label
            .indexOf(query) > -1
        })
      } else {
        this.selectList = list
      }
      // this.selectList = list;
    },
    // 用operatorCode 解析表达式
    getExpressionDetail(operatorCode) {
      let list = []
      if (operatorCode) {
        list = store.state.app.expressionList[operatorCode].expressionArray
      }
      return list
    },
    onChangeSelect(value) {
      let arr = []
      if (
        this.format.type === 'selector-multiple' ||
        this.format.type === 'selector'
      ) {
        // 多选
        arr = value
      }

      if (this.paramId) {
        // 表达式存值
        this.node.paramValue[this.paramId] = arr
      } else {
        // 普通节点存值
        this.node.paramValue = arr
      }
      this.$emit('changeSelect', arr)
    },
    init() {
      let value = null
      if (this.paramId) {
        // 表达式存值
        value = this.node.paramValue[this.paramId]
      } else {
        // 普通节点存值
        value = this.node.paramValue
      }
      if (
        this.format.type === 'selector' ||
        this.format.type === 'selector-multiple'
      ) {
        this.vSelectValue = value
      } else {
        if (this.format.type === 'date') {
          this.vInputValue = new Date(value)
        }
        this.vInputValue = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
}

::v-deep .el-date-editor.el-input {
  width: 180px !important;

  .el-input__inner {
    width: 180px !important;
    padding-left: 30px;
  }

  .el-input__icon {
    line-height: 35px;
  }
}

.menuBox {
  position: fixed;
  background: #fff;
  z-index: 99;
}

.context-menu {
  // width:400px;
  // height:700px
  border: 1px solid #ddd;
  padding: 5px 10px;
  font-size: 12px;

  .funBtn {
    cursor: pointer;
    padding: 5px;
  }

  .funBtn:hover {
    color: #0079ff
  }
}

.context-menu-container {
  border: 1px solid #ddd;
  background: #fff;
  position: fixed;
  padding: 5px 10px;
  font-size: 12px;
  text-align: left;

  .funBtn {
    cursor: pointer;
    padding: 5px;
  }

  .funBtn:hover {
    color: #0079ff
  }
}
</style>

