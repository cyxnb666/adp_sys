<template>
  <div class="container">
    <el-input
      v-model="filterText"
      size="mini"
      placeholder="输入关键字进行过滤"
    />
    <div class="tree-container scroll">
      <el-tree
        ref="domTree"
        class="filter-tree mt-15  tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="checkRulesF"
        :default-checked-keys="checkRulesF"
        :filter-node-method="filterNode"
        @check-change="checkChange"
      >
        <!-- @check="treeNodeCheck" -->
        <!-- 顶部的按钮插槽 -->
        <!-- <template #pre>
            <span class="btn-line">|</span>
          </template> -->
        <!-- 树结构的自定义标题插槽 -->
        <template #default="{ node }">
          <!-- {{ node }} -->
          <div class="tree-text">
            <template>
              <i v-if="node.isLeaf" class="el-icon-tickets" />
              <i v-else class="el-icon-folder-opened" />
              <span :class="{ 'catalogNode': !node.isLeaf }">{{ node.label }}</span>
            </template>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import {
  getRuleDefinedDetail
} from '@/api/systemManage/rule-manage'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    checkedTablesF: {
      type: Array,
      default: null
    },
    checkedNodesF: {
      type: Array,
      default: null
    },
    checkRulesF: {
      type: Array,
      default: () => {
        return []
      }
    },
    ruleResultsF: {
      type: Array,
      default: () => {
        return []
      }
    },
    node: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedNodes: [],
      checkedTables: [],
      RuleResults: [],
    }
  },
  computed: {

  },
  watch: {
    filterText(val) {
      this.$refs.domTree.filter(val)
    },
    checkedTablesF(val) {
      this.checkedTables = val
    },
    checkedNodesF(val) {
      this.checkedNodes = val
    },
    ruleResultsF(val) {
      this.RuleResults = val
    },
    checkRulesF(val) {
      this.$nextTick(() => {
        this.$refs.domTree.setCheckedKeys(val, true)
      })
    }
  },
  mounted() {
    this.RuleResults = this.ruleResultsF || []
    this.checkedTables = [...this.checkedTablesF]
    this.checkedNodes = [...this.checkedNodesF]
    // this.$nextTick(() => {
    //   this.checkTreeNode([...this.checkedTables, ...this.checkedNodes])
    // })
  },
  methods: {
    // 点击dom节点选择规则后保存
    saveChooseRule() {
      this.$emit('saveChooseRule', this.checkedNodes, this.checkedTables)
    },
    checkTreeNode(data) {
      const ids = data.map(res => {
        return res.ruleId || res.decisionTableId
      })
      this.$refs.domTree.setCheckedKeys(ids, true)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 查重规则的详细数据
    async searchNode(data) {
      const result = new Promise((resolve, reject) => {
        getRuleDefinedDetail(data.ruleId).then(async(res1) => {
          resolve(res1)
        })
      })
      return result
    },
    // 选中规则
    async checkChange(data, isCheck) {
      if (data.ruleId) {
        if (this.node.type === 'edge' && isCheck) {
          this.checkedNodes = [data]
          // 如果选择超过一个节点，则只保留最后一个节点
          this.$refs.domTree.setCheckedKeys([data.id])
        } else {
          let isFind = false
          this.checkedNodes.forEach((res, index) => {
            if (res.ruleId === data.id) {
              isFind = true
            }
          })
          if (isCheck) {
            if (!isFind) {
              await this.searchNode(data).then(res => {
                const item = { ...res.ruleSetting,
                  ruleResult: this.RuleResults[0].resultCode,
                  elseList: res.elseList,
                  thenList: res.thenList,
                  ruleId: data.ruleId,
                  id: data.id,
                  path: data.path }
                this.checkedNodes.push(item)
              })
            }
          } else {
            this.checkedNodes.forEach((res, index) => {
              if (res.ruleId === data.id) {
                this.checkedNodes.splice(index, 1)
              }
            })
          }
        }
      } else if (data.decisionTableId) {
        if (this.node.type === 'edge' && isCheck) {
          this.$message({
            type: 'warning',
            message: '仅支持选决策规则'
          })
          if (this.checkedNodes === 2) {
            this.$refs.domTree.setCheckedKeys([this.checkedNodes[0].id])
          } else {
            this.$refs.domTree.setCheckedKeys([])
          }
        }
        if (this.node.type === 'node') {
          if (isCheck) {
            let isFind = false
            this.checkedTables.forEach((res, index) => {
              if (res.decisionTableId === data.id) {
                isFind = true
              }
            })
            if (!isFind) {
              const obj = {
                decisionTableId: data.id,
                id: data.id,
                decisionTableName: data.label,
                path: data.path
              }
              this.checkedTables.push(obj)
            }
          } else {
            this.checkedTables.forEach((res, index) => {
              if (res.decisionTableId === data.id) {
                this.checkedTables.splice(index, 1)
              }
            })
          }
        }
        // this.$emit('getCheckedNodes', this.checkedTables, this.checkedNodes)
      }
    },
  }
}
</script>

<style scoped lang='scss'>
  .container{
    padding-left: 0px!important;
  }
</style>
