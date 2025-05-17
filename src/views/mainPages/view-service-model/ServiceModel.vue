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
          >{{ item.bomName }}</el-option>
        </el-select>
      </div>
    </el-card>
    <div class="flex-wrap mt-15">
      <el-card class="w400 mr-15 vh70">
        <div class="content bom-tree">
          <Tree id="2" :tree-data="treeData" @selectField="handleNodeClick">
            <!-- 树结构的自定义标题插槽 -->
            <template #customNode="{node}">
              <div v-if="node.file">
                <i class="el-icon-tickets" />
                {{ node.label }}
              </div>
              <div v-else>
                <i class="el-icon-folder-opened" />
                {{ node.label }}
              </div>
            </template>
          </Tree>
        </div>
      </el-card>
      <div class="relative" style="width:100%">
        <el-card class="flex-1 vh70 language-manage-fields-content">
          <div slot="header" class="card-head-style1 clearfix">
            {{ $t('serviceModel.viewField') }}
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
              <el-table-column prop="field" :label="$t('common.field')" />
              <el-table-column prop="type" :label="$t('common.type')" />

              <el-table-column prop="label" :label="$t('zhManageObj.fieldName')" width="320">
                <template slot-scope="scope">
                  <!-- {{ scope.row.label }} -->
                  <el-input v-model="scope.row.label" readonly />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <!-- <div class="mt-15 text-center language-footer-wrap">
          <el-button class="btn-border mini" @click="resetData">撤销全部修改</el-button>
          <el-button class="btn-background mini" @click="checkModify">保存</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTheBomModelDetail,
  getAllBomBaseInfo,
  FieldName,
  ClassDetail
} from '@/api/systemManage/bom'
export default {
  name: 'Translatemanage',

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
      modifiedArray: [] // 存被修改的数组
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
    changeBom() {
      if (!this.currentBomID) {
        return
      }
      const data = {
        bomBaseInfoId: this.currentBomID
      }
      getTheBomModelDetail(data).then(res => {
        this.formatTreeNode([res] || [], {})
        this.treeData = [res]
      })
    },
    formatTreeNode(children, parent) {
      children.map((data) => {

        data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        data.fieldId = data.id || 'root'

        // if (data.dataType === 'method') {
        // } else {
        //   data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        // }

        if (data.children && data.children.length) {
          this.formatTreeNode(data.children || [], data)
        }
      })
    },
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        // this.BomList = res
        this.BomList = res.filter(item => item.bomBaseInfoId === this.$store.state.bom.bomBaseInfo)
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

<style lang="scss" >
.vh70 {
  min-height: 70vh;
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
</style>
