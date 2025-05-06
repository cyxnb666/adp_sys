<template>
  <div class="app-container language-manage">
    <el-card>
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('bomManage.selectModel') }}</span>
      </div>
      <div>
        <span class="label">{{ $t('bomManage.selectModel') }}</span>
        <el-select v-model="currentBomID" @change="changeBom">
          <el-option
            v-for="item in BomList"
            :key="item.bomBaseInfoId"
            :value="item.bomBaseInfoId"
            :label="item.bomName"
          >{{ item.bomName }}
          </el-option>
        </el-select>
      </div>
    </el-card>
    <div class="flex-wrap mt-15">
      <el-card class="w400 mr-15">
        <div class="content bom-tree">
          <el-scrollbar class="filter-tree" view-style="height:100%;">
            <Tree id="2" :tree-data="treeData" @selectField="handleNodeClick">
              <!-- 树结构的自定义标题插槽 -->
              <template #customNode="{node}">
                <div v-if="node.file">
                  <i class="el-icon-tickets"/>
                  {{ node.label }}
                </div>
                <div v-else>
                  <i class="el-icon-folder-opened"/>
                  {{ node.label }}
                </div>
              </template>
            </Tree>
          </el-scrollbar>
        </div>
      </el-card>
      <div class="relative" style="width:100%">
        <el-card class="flex-1 vh70 language-manage-fields-content">
          <div slot="header" class="card-head-style1 clearfix title">
            <span style="flex:1;">{{ $t('zhManageObj.zhName') }}</span>
            <span class="iconfont" style="flex:0 1 10%;width:200px;" @click="openCodeUpdate"><i class="el-icon-edit"/> 源代码修改</span>
          </div>
          <div class="content">
            <el-table
              ref="multipleTable"
              :empty-text="$t('common.noData')"
              border
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%;height: 70vh;"
              class="scroll"
            >
              <el-table-column prop="field" :label="$t('common.field')"/>
              <el-table-column prop="type" :label="$t('common.type')"/>

              <el-table-column prop="label" :label="$t('zhManageObj.fieldName')" width="320">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.label"
                    :class="scope.row.ismodify ? 'modify' : ''"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div class="mt-15 text-center language-footer-wrap">
          <el-button
            class="btn-background mini"
            @click="dialogVisible = true"
          >添加字段
          </el-button>
          <el-button
            class="btn-border mini"
            @click="resetData"
          >{{ $t('common.reset') }}
          </el-button>
          <el-button
            class="btn-background mini"
            @click="checkModify"
          >{{ $t('button.save') }}
          </el-button>
        </div>
      </div>
      <el-dialog
        title="源代码修改"
        :visible.sync="updateCodeSVisible"
        width="60%"
        style="text-align: left;"
        :before-close="handleClose"
      >
        <div class="mainContent">
          <el-card class="w300 mr-15" style="width:30%">
            <div class="content bom-tree">
              <Tree id="2" ref="tree" :tree-data="treeData" @selectField="handleNodeClick">
                <!-- 树结构的自定义标题插槽 -->
                <template #customNode="{node}">
                  <div v-if="node.file">
                    <i class="el-icon-tickets"/>
                    {{ node.label }}
                  </div>
                  <div v-else>
                    <i class="el-icon-folder-opened"/>
                    {{ node.label }}
                  </div>
                </template>
              </Tree>
            </div>
          </el-card>
          <el-card class="w300" style="width:70%">
            <div class="content ">
              <editor
                ref="editor"
                v-model="codeText"
                theme="chrome"
                :lang="options.lang"
                :options="options"
                width="100%"
                height="560px"
                @init="initEditor"
              />
            </div>
          </el-card>
        </div>
        <span slot="footer" class="dialog-footer center">
          <el-button class="btn-border mini" @click="cancelFn">取 消</el-button>
          <el-button class="btn-background mini" type="primary" @click="allSaveFn">全部保存</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加字段"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <div class="block">
          <span class="demonstration">字段</span>
          <el-input v-model="fieldName" placeholder="请输入字段" style="width: 200px;"/>
        </div>
        <div class="block">
          <span class="demonstration">类型</span>
          <el-select v-model="fieldType" placeholder="请选择类型">
            <el-option
              v-for="item in fieldTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="block">
          <span class="demonstration">字段名称</span>
          <el-input v-model="fieldAttribute" placeholder="请输入字段名称" style="width: 200px;"/>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addField">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getTheBomModelDetail,
  getAllBomBaseInfo,
  FieldName,
  ClassDetail,
  getBomSourceCode,
  saveBomSourceCode,
  getBomModelId,
  addBomField
} from '@/api/systemManage/bom'
import editor from 'vue2-ace-editor'
import ace from 'brace'
import 'brace/theme/chrome'
import 'brace/ext/language_tools'
import 'brace/mode/java'
import 'brace/snippets/java'

export default {
  name: 'Translatemanage',
  components: {
    editor
  },
  data() {
    return {
      BomList: [],
      currentBomID: this.$store.state.bom.bomBaseInfo,
      treeData: [],
      tableData: [],
      currentNode: {
        fields: [] // fields 原始数据
      }, // 当前选择的文件
      modifiedIndex: [], // 存被修的index
      modifiedArray: [], // 存被修改的数组
      updateCodeSVisible: false, // 源代码修改弹窗显示隐藏
      codeText: '',
      className: '',
      bomModelId: '',
      oneKey: '',
      dialogVisible: false,
      fieldTypeOptions: [
        {value: 'String', label: '文字(String)'},
        {value: 'Double', label: '双精度小数(Double),无默认值'},
        {value: 'double', label: '双精度小数(double),默认值0'},
        {value: 'Date', label: '日期(Date)'},
        {value: 'Boolean', label: '判断是否(Boolean),无默认值'},
        {value: 'boolean', label: '判断是否(boolean),默认值false'},
        {value: 'Integer', label: '整数(Integer),无默认值'},
        {value: 'int', label: '整数(int),默认值0'},
        {value: 'java.math.BigDecimal', label: '任意精度数字(BigDecimal)'}
      ],
      packageName: '',
      addClassName: '',
      fieldName: '',
      fieldType: '',
      fieldAttribute: ''
    }
  },
  computed: {
    options() {
      return {
        lang: 'java', // 语言
        // enableBasicAutocompletion: true, // 启动代码补全功能
        enableSnippets: true, // 启动代码段
        showPrintMargin: false // 显示打印边距
        // fontSize: this.config.fontSize, // 字体大小
        // enableLiveAutocompletion: true // 启用实时自动完成
        // readOnly: this.readOnly// 只读
      }
    }
  },
  watch: {
    'currentNode.fields': {
      handler(newName, oldName) {
        const temp = JSON.stringify(newName)
        this.tableData = JSON.parse(temp)
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    }
  },
  created() {
    this.getAllBomBaseInfo()
    this.changeBom()
  },
  methods: {
    // 添加字段
    addField() {
      const arr = this.className.split('.')
      let str = ''
      arr.forEach((item, index) => {
        if (index !== arr.length - 1) {
          str += item + '.'
        }
      })
      str = str.slice(0, -1)
      const data = {
        bomModelId: this.bomModelId,
        fieldAttribute: this.fieldAttribute,
        fieldType: this.fieldType,
        fieldName: this.fieldName,
        className: this.addClassName,
        packageName: str
      }
      addBomField(data).then(res => {
        this.dialogVisible = false
        const param = {
          bomBaseInfoId: this.currentBomID,
          filePath: this.className
        }
        ClassDetail(param).then(res => {
          this.tableData = res
        })
        this.fieldAttribute = ''
        this.fieldName = ''
        this.fieldType = ''
      })
    },
    // 打开源代码修改弹窗
    async openCodeUpdate() {
      this.updateCodeSVisible = true
      const id = this.currentBomID
      await getBomSourceCode(id).then(res => {
        this.oneKey = Object.keys(res)[0]
        localStorage.setItem('sourceCode', JSON.stringify(res))
      })
      const current = this.findObjectByPath(this.treeData[0], this.oneKey)
      this.$nextTick(() => {
        this.$refs.tree.setAllExpand(true)
        this.$refs.tree.highlight(this.oneKey)
      })
      this.handleNodeClick(current)
    },
    findObjectByPath(obj, path) {
      if (obj.filePath && obj.filePath.endsWith(path)) {
        return obj
      }
      if (obj.children) {
        for (const child of obj.children) {
          const result = this.findObjectByPath(child, path)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    cancelFn() {
      this.updateCodeSVisible = false
      this.codeText = ''
      localStorage.removeItem('sourceCode')
    },
    handleClose() {
      this.updateCodeSVisible = false
      this.codeText = ''
      localStorage.removeItem('sourceCode')
    },
    // 全部保存
    allSaveFn() {
      const map = JSON.parse(localStorage.getItem('sourceCode'))
      saveBomSourceCode(this.bomModelId, map).then(res => {
        this.updateCodeSVisible = false
        this.codeText = ''
        localStorage.removeItem('sourceCode')
      })
    },
    initEditor(editor) {
      // 自定义标签
      const that = this
      const completer = {
        getCompletions: function (editors, session, pos, prefix, callback) {
          that.setCompleteData(editors, session, pos, prefix, callback)
        }
      }
      const lnTools = ace.acequire('ace/ext/language_tools')
      lnTools.addCompleter(completer)
      // 监听值的变化
      editor.getSession().on('change', () => {
        this.$emit('change', editor.getValue())
        const objCode = JSON.parse(localStorage.getItem('sourceCode'))
        for (const key in objCode) {
          if (key === this.className) {
            objCode[key] = this.codeText
            localStorage.setItem('sourceCode', JSON.stringify(objCode))
          }
        }
      })
    },
    getValue() {
      return this.$refs.editor.editor.getValue()
    },
    setValue(value) {
      this.$refs.editor.editor.session.setValue(value)
    },
    changeBom() {
      if (!this.currentBomID) {
        return
      }
      const data = {
        bomBaseInfoId: this.currentBomID
      }
      getBomModelId(this.currentBomID).then(res => {
        this.bomModelId = res
      })
      getTheBomModelDetail(data).then(res => {
        this.formatTreeNode([res] || [], {})
        this.treeData = [res]
      })
    },
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        this.BomList = res
      })
    },
    formatTreeNode(children, parent) {
      children.map((data) => {

        data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        data.fieldId = data.labelPath || 'root'

        // if (data.dataType === 'method') {
        // } else {
        //   data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        // }

        if (data.children && data.children.length) {
          this.formatTreeNode(data.children || [], data)
        }
      })

    },
    shrinkTreeNode(temp) {
      // 改变一个全局变量
      this.treeStatus = temp
      // 改变每个节点的状态
      this.changeTreeNodeStatus(this.$refs.tree.store.root)
    },
    // 改变节点的状态
    changeTreeNodeStatus(node) {
      node.expanded = this.treeStatus
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.treeStatus
        // 看看他孩子的长度，有的话就调用自己往下找
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i])
        }
      }
    },
    handleNodeClick(current) {
      this.className = current.filePath
      this.addClassName = current.path
      const objCode = JSON.parse(localStorage.getItem('sourceCode'))
      for (const key in objCode) {
        if (key === this.className) {
          this.codeText = objCode[key]
        }
      }
      if (current.file) {
        const data = {
          bomBaseInfoId: this.currentBomID,
          filePath: current.filePath
        }
        ClassDetail(data).then(res => {
          const value = {
            ...current,
            fields: res
          }
          // console.log(value)
          this.currentNode = value
        })
      } else {
        current.fields = []
        this.currentNode = current
      }
    },
    // 保存修改
    saveFieldName() {
      const data = this.modifiedArray.map(item => {
        return {
          ...item,
          fieldName: item.label,
          fieldType: item.type,
          bomBaseInfoId: this.currentBomID,
          fieldPath: this.currentNode.filePath,
          fieldClass: this.currentNode.label
        }
      })
      if (data.length === 0) {
        return this.$message.error(this.$t('bomCreat.selectField'))
      }
      FieldName(data).then(res => {
        this.currentNode.fields = this.tableData
      })
    },
    checkModify() {
      const modifiedArray = []
      const modifyArray = []
      this.tableData.forEach((item, index) => {
        if (item.label !== this.currentNode.fields[index].label) {
          this.tableData[index].ismodify = true
          modifiedArray.push(index)
          modifyArray.push(item)
        }
      })
      this.modifiedArray = modifyArray
      this.modifiedIndex = modifiedArray
      this.saveFieldName()
    },

    // 撤销全部修改
    resetData() {
      const temp = JSON.stringify(this.currentNode.fields)
      this.tableData = JSON.parse(temp)
    }
  }
}
</script>

<style lang="scss">
.vh70 {
  min-height: 70vh;
}
.block {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  .demonstration {
    width: 80px;
    text-align: right;
    padding-right: 5px;
  }
}



::v-deep .el-table {
  th {
    background-color: #eff4f8;
    font-weight: normal;
    text-align: center;
  }

  td {
    &:nth-child(1),
    &:nth-child(2) {
      background-color: #f9fdff;
    }

    &:nth-child(3) {
      .cell {
        padding: 0;

        input {
          &:focus {
            border-color: #0079ff;
          }
        }
      }
    }

    padding: 0;

    .el-input__inner {
      border-color: transparent;
    }
  }
}

.language-footer-wrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.language-manage {
  padding-bottom: 60px;
}

.iconfont {
  color: #3eacef;
  font-size: 14px;
  cursor: pointer;
}

.mainContent {
  display: flex;
  justify-content: space-between;
  background-color: #e5ecf5;
  padding: 10px;
}

.language-manage .bom-tree {
  height: 600px;

  .tree-wrapper {
    height: 100%;

    .tree-container {
      height: 100%;

      .filter-tree {
        height: 100%;
        width: 400px;
      }
    }
  }
}

::v-deep .filter-tree {
  height: calc(100% - 40px);
  width: 100%;

  .el-scrollbar__wrap {
    overflow-x: auto;

    .el-scrollbar__view {
      white-space: nowrap;
      display: inline-block;
      min-width: 100%;
    }
  }
}
</style>
