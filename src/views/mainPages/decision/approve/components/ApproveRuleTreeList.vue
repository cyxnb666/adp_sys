<template>
 <div class="decisionBase">
     <ApproveDecisionTreeList
       v-if="showComponent === 'decisionTreeList'"
       type='descisionTree'
       ref="decisionTreeList"
       :decisionUrlId="decisionUrlId"
       :rule-data.sync="ruleData"
       @toggleComponent="toRuleFlowApprove"
     />
     <decisionTree
       v-if="showComponent === 'decisionTreeDetail'"
       ref="decisionTree"
       :is-approvel="true"
       type="descisionTree"
       :table-data-list="tableData"
       :tree-setting-id="treeSettingId"
       :decisionUrlId="decisionUrlId"
       :flow-setting-obj="flowSettingObj"
       :dim-settings.sync="form"
       @toggleComponent="toRuleFlowApprove"
     />
  </div>
</template>

<script>
import { PostDeciurl, delDeciurl } from '@/api/mainPages/deci'
import { deleteDecisionTree, decisionTreeGetDecisionTree } from '@/api/mainPages/decisionTree.js'
import decisionTree from '../../ruleFlow/decisionTree.vue'
import ApproveDecisionTreeList from './ApproveDecisionTreeList'
import Bus from '@/utils/bus'
export default {
  name: 'RuleList',
  props: {
    ruleData: {
      type: Object,
      default: null
    },
    addDecisionSelectList: {
      // 新决策路径的select列表
      type: Object,
      default: function() {
        return {}
      }
    },
    decisionAddComponentList: {
      // 查询新增决策路径的select值列表
      type: Object,
      default: function() {
        return {}
      }
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    nodeId: {
      type: String,
      default: null
    },
    decisionUrlId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showComponent: 'decisionTreeList',
    }
  },
  components: {
    decisionTree,
    ApproveDecisionTreeList
  },
  mounted() {
    
  },
  methods: {
    async toRuleFlowApprove(name, row) {
      this.showComponent = name
      if (name === 'ruleSetDetail' || name === 'decisionTreeDetail') {
        this.flowSettingObj = row
        // if (row.dimView) {
        //   const res = await findDimCombine(row.dimView.dimSetComId)
        //   const newDimList = res.map(item => {
        //     return {
        //       dimId: item.dimId,
        //       dimValue: item.dimValue,
        //       // label: item.dimValue,
        //       key: item.dimValue
        //     }
        //   })
        //   this.$refs.ComponentDimension.setFormData(newDimList)
        // }
        if (name === 'decisionTreeDetail') {
          await decisionTreeGetDecisionTree({ treeSettingId: row.treeSettingId }).then(res => {
            this.$refs.decisionTree.loadTreeData(res)
          })
        }
      } else if (name === 'decisionTreeList') {
        this.$refs.descisionTree.ruleTableData()
      }
    },
    getApprovalstatus(val) {
      let label = ''
      switch (val) {
	        case '0':
	        case '1':
	        case '2':
	            label = '待审批'
	            break
	        case '3':
	            label = '审批通过'
	            break
	        case '4':
	            label = '退回修改'
	            break
	        case '5':
	            label = '无需审批'
	            break
	        case '6':
	            label = '审批不通过'
          break
        default:
	            label = ''
          break
      }
      return label
    },
    // 删除按钮
    delBtnFn(row) {
      this.dialogDelVisible = true
      this.flowSettingId = row.flowSettingId
    },
    // 删除
    async delPathFn(row) {
      await deleteDecisionTree({ treeSettingId: row.treeSettingId }).then(res => {
        this.dialogDelVisible = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('refresh')
      })
    },
    searchEnter() {
      console.log(this.search)
    },
    initForm() {
      const arr = this.addDecisionSelectList.map(item => {
        return {
          option: { key: 'ALL', label: this.$t('common.all') },
          nodeField: item.decisionNodeField,
          nodeFieldPath: item.decisionNodeFieldPath
        }
      })
      this.addForm = arr
    },

    toggleExpand(row) {
      const $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    // PostDeciurl 新增决策路径
    PostDeciurl() {
      let dimSettings = []
      if (this.changeDimSettings.length) { dimSettings = this.changeDimSettings } else { dimSettings = this.dimSettings }
      const decisionNodeList = []
      this.addForm.forEach(item => {
        if (item.option) {
          const obj = {
            ...item,
            nodeFieldBusinessCode: item.option.key,
            nodeFieldValue: item.option.label
          }
          decisionNodeList.push(obj)
        }
      })
      const data = {
        dimViewModel: {
          applicationId: this.$store.state.app.applicationId,
          processNodeId: this.nodeId,
          dimSettings
        },
        decisionUrl: {
          decisionNodeList
        }
      }
      this.dialogFormVisible = false
      PostDeciurl(data).then(res => {
        Bus.$emit('searchPath') // 调用搜索
      })
    },
    // 新增规则流
    openDialog() {
      this.$emit('toggleComponent', 'decisionTreeDetail', 'add')
    },
    // 去规则设置组件
    toSetting(item) {
      this.$emit('toggleComponent', 'decisionTreeDetail', 'edit', item)
    }
  }
}
</script>

<style lang="scss">
.decisionBase {
  .el-table th.gutter:last-of-type {
    display: table-cell!important;
  }
  .el-table__expand-icon {
    opacity: 0;
  }
  .table-expand-wrapper {
    background: #e6f2ff;
    margin: 0 -5px;
    padding: 15px;
    color: #82848a;
    font-size: 12px;
  }
}
.table-btn-wrap {
  padding: 10px 0;
}
.btn-set {
  span {
    display: flex;
    align-items: center;
  }
  .set {
    width: 17px;
    height: 17px;
    margin-right: 3px;
  }
}
.form-label-noPadding label {
  padding: 0;
}
</style>
