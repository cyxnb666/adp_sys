<template>
  <div class="detailpannel">
    <div>
      <div v-if="status=='node-selected'" id="node_detailpannel" class="pannel">
        <div class="pannel-title">规则节点配置</div>
        <div v-show="node.flowNodeType !== 'START_NODE' && node.flowNodeType !== 'END_NODE'" class="block-container">
          <el-row :gutter="10">
            <el-col :span="8">节点名称</el-col>
            <el-col :span="16">
              <el-input v-model="node.label" @change="handleChangeName" />
            </el-col>
          </el-row>
        </div>
        <div v-show="node.flowNodeType === 'CHILD_FLOW_NODE'">
          <el-table
            :data="childFlowtableData"
            style="width: 100%"
            max-height="650"
          >
            <el-table-column width="55" label="选择">
              <template slot-scope="scope">
                <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
                <el-radio
                  v-model="templateSelection"
                  class="radio"
                  :label="scope.row.flowSettingId"
                  @input="handleSelectionChange(scope.row)"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="flowName"
              label="规则流名称"
            />
            <el-table-column align="center" width="70" label="查看">
              <template slot-scope="scope">
                <span class="detailBtn" @click="queryDetail(scope.row)">详情</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="status==='canvas-selected'" id="canvas_detailpannel" class="pannel">
        <div class="pannel-title">规则流设置</div>
        <div class="block-container">
          <!-- <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox> -->
          <el-row :gutter="10">
            <el-col :span="8">流程名称</el-col>
            <el-col :span="16">
              <el-input v-model="form.flowName" @change="handleChangeName" />
            </el-col>
            <el-col :span="8">流程类型</el-col>
            <el-col :span="16">
              <el-radio v-model="form.flowType" label="1">主流程</el-radio>
              <el-radio v-model="form.flowType" label="0">子流程</el-radio>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="status==='line-selected'" id="line_detailpannel" class="pannel">
        <div v-show="source.flowNodeType === 'JUDGMENT_NODE'" class="pannel-title">条件配置</div>
        <div v-show="source.flowNodeType === 'JUDGMENT_NODE'" class="block-container">
          <el-row :gutter="10">
            <el-col :span="8">节点名称</el-col>
            <el-col :span="16">
              <el-input v-model="node.label" @change="handleChangeName" />
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="status !=='canvas-selected' && node.flowNodeType !== 'CHILD_FLOW_NODE'">
        <div v-show="(status==='node-selected' && (node.flowNodeType !== 'START_NODE' && node.flowNodeType !== 'END_NODE') && node.flowNodeType !== 'JUDGMENT_NODE') || (status==='line-selected' && source.flowNodeType === 'JUDGMENT_NODE')">
          <div class="ruleChoose">
            规则选择
            <el-button type="primary" size="mini" @click="chooseRule">选择规则</el-button>
          </div>
          <div>
            <el-table
              :data="node.checkNodes"
              border
              style="width: 100%"
              max-height="625"
            >
              <el-table-column
                prop="date"
                label="已选规则"
              >
                <template slot-scope="scope">
                  {{ scope.row.path + scope.row.ruleName }}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleClick(scope.row, scope.$index)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-show="node.type !== 'edge'"
              :data="node.checkedTables"
              border
              style="width: 100%"
              max-height="625"
            >
              <el-table-column
                prop="date"
                label="已选决策表"
              >
                <template slot-scope="scope">
                  {{ scope.row.path + scope.row.decisionTableName || '名字' }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                fixed="right"
                label="操作"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleClick(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import eventBus from '../../utils/eventBus'
import {
  getDecisionRepositoryDetail
} from '@/api/mainPages/decision'
import { getChildFlowList } from '@/api/mainPages/ruleFlow'

const { Grid } = G6

/* TODO: 为节点添加属性，属性内容由详细设计和接口中确定
*/
export default {
  props: {
    type: String,
    decisionUrlId: String,
    resForm: {
      type: Object,
      default: null
    },
    isApprovel: {
      type: Boolean,
      default: false
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    flowSettingObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      status: 'canvas-selected',
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {
        checkNodes: [{}],
        checkedTables: [{}]
      },
      form: {
        flowName: '',
        flowSettingId: '',
        flowType: '1'
      },
      grid: null,
      typeOptions: [
        { label: '', value: '' }
      ],
      dimSettingsVal: null,
      childFlowtableData: [],
      dimViewModel: {},
      templateSelection: null
    }
  },
  watch: {
    resForm(val) {
      this.form = this.resForm
    },
    dimSettings(val) {
      this.dimSettingsVal = val
    }
  },
  created() {
    if (this.resForm) this.form = this.resForm
    this.bindEvent()
    this.dimSettingsVal = this.dimSettings
    const temp = []
    this.dimSettingsVal.forEach(item => {
      temp[item.dimId] = item.dimValue
    })
    this.dimViewModel = {
      flag: this.dimSettingsVal.flag,
      applicationId: this.$store.state.app.applicationId,
      ...temp
    }
    this.search()
  },
  methods: {
    // 查看规则流详情
    queryDetail(row) {
      this.$emit('queryDetail', row)
    },
    // 查找列表
    search() {
      if (!this.flowSettingObj) {
        let params = this.dimViewModel
        if (this.type) {
        params = {
            ...this.dimViewModel,
            decisionUrlId: this.decisionUrlId
          }
        }
        getChildFlowList(params).then(res => {
          this.childFlowtableData = res
        })
      } else {
        const params = {
          applicationId: this.$store.state.app.applicationId,
          dimSetComId: this.flowSettingObj.dimView.dimSetComId,
          flowSettingId: this.flowSettingObj.flowSettingId,
          decisionUrlId: this.decisionUrlId
        }
        getChildFlowList(params).then(res => {
          this.childFlowtableData = res
        })
      }
    },
    handleSelectionChange(row) {
      this.templateSelection = row.flowSettingId
      this.node.childFlowDefId = row.flowSettingId
    },
    // 编辑规则保存
    saveNodeRule(data) {
      this.node.checkNodes.forEach((res, index) => {
        data.forEach((dataRes) => {
          if (res.ruleId === dataRes.ruleId) {
            this.node.checkNodes[index] = { ...dataRes }
          }
        })
      })
    },
    chooseRule() {
      this.$emit('chooseRule', this.node)
    },
    // 选中dom节点保存
    saveChooseRule(data, table) {
      this.$set(this.node, 'checkNodes', data)
      this.$set(this.node, 'checkedTables', table)
    },
    writeRule() {
      this.$emit('writeRule')
    },
    // 点击已选规则编辑
    handleClick(row, index) {
      this.$emit('editRule', this.node.checkNodes[index], this.node)
    },
    // 查询决策库信息，包含决策库基本信息、关联规则信息等
    async getDecisionRepositoryDetail() {
      await getDecisionRepositoryDetail(this.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeData = decisionRepositoryModel.catalogueList
          // this.bomBaseInfo = res.bomBaseInfo
          // this.bomName.bomName = res.decisionRepositoryModel.repositoryName
        }
      })

      return Promise.resolve()
    },
    // 节点点击事件
    bindEvent() {
      const self = this
      eventBus.$on('afterAddPage', page => {
        self.page = page
        self.graph = self.page.graph
        eventBus.$on('nodeselectchange', item => {
          if (item.select === true && item.target.getType() === 'node') {
            self.status = 'node-selected'
            self.item = item.target
            self.node = item.target.getModel()
            self.templateSelection = self.node.childFlowDefId || ''
            self.node.checkRules = self.getChooseNodeS(self.node)
            // if (self.name !== '开始节点' && self.name !== '结束节点') {
            //   self.$nextTick(() => {
            //     self.$refs.domTree.setCheckedKeys(self.node.checkedKeys || [])
            //   })
            // }
          } else if (item.select === true && item.target.getType() === 'edge') {
            self.source = item.target.getSource().getModel()
            self.status = 'line-selected'
            self.item = item.target
            self.node = item.target.getModel()
            self.node.checkRules = self.getChooseNodeS(self.node)
            // if (self.source.name === '分支节点') {
            //   self.$nextTick(() => {
            //     self.$refs.domTree.setCheckedKeys(self.node.checkedKeys || [])
            //   })
            // }
          } else {
            self.status = 'canvas-selected'
            self.item = null
            self.node = null
          }
          // if (self.node && self.node.checkedKeys) {
          //   self.$refs.tree.setCheckedKeys(self.node.checkedKeys)
          // }
        })
      })
    },
    getChooseNodeS(node) {
      const ids = []
      if (node.checkedTables) {
        node.checkedTables.forEach(res => {
          ids.push(res.decisionTableId)
        })
      }
      if (node.checkNodes) {
        node.checkNodes.forEach(res => {
          ids.push(res.ruleId)
        })
      }
      return ids
    },
    handleChangeName(e) {
      const model = {
        label: e
      }

      this.graph.update(this.item, model)
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid()
        this.graph.addPlugin(this.grid)
      } else {
        this.graph.removePlugin(this.grid)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 300px;
  border-left: 1px solid #e6e9ed;
}
.detailpannel .block-container {
  padding: 16px 8px;
}
.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
.treeRow{
  width:280px;
  overflow: scroll;
}
.tree-btn-wrap {
  display: flex;
  height: 32px;
  background: #f7fcff;
  border: 1px solid #e5ecf8;
  align-items: center;
  justify-content: space-around;
  .el-button {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    padding: 0 10px;
    margin: 0;
  }
  .btn-line {
    color: #e5ecf8;
  }
}
.scroll{
  overflow: auto;
}
/* 树形结构节点添加连线 */
.tree-container {
  height: 584px;
    background: #fff;
  ::v-deep .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  ::v-deep > .el-tree > .el-tree-node {
    position: relative;
    padding-left: 0;
    background: #fff;
  }
  ::v-deep .el-tree-node__children {
    padding-left: 16px;
  }

  ::v-deep .el-tree-node :last-child:before {
    height: 38px;
  }

  ::v-deep .el-tree > .el-tree-node:before {
    border-left: none;
    background: none;
  }

  ::v-deep .el-tree > .el-tree-node:after {
    border-top: none;
  }

  ::v-deep .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  ::v-deep .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  ::v-deep .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  ::v-deep .el-tree-node__content {
    font-size: 14px;
    color: #29344f;
  }
  ::v-deep .el-tree-node:before {
    background-image: linear-gradient(
      to bottom,
      #ccc 0%,
      #ccc 50%,
      transparent 50%
    );
    background-size: 2px 5px;
    background-repeat: repeat-y;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  ::v-deep .el-tree-node:after {
    background-image: linear-gradient(
      to right,
      #ccc 0%,
      #ccc 50%,
      transparent 50%
    );
    background-size: 4px 1px;
    background-repeat: repeat-x;
    height: 1px;
    top: 12px;
    width: 24px;
  }
  ::v-deep .el-tree > .el-tree-node:after {
    background: none;
  }
  .tree-text,
  .el-tree-node__content {
    color: #29344f;
  }
  ::v-deep .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: scroll;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 14px;
  }
  .detailButton{
    margin-left: 30px;
    display: none;
  }

  .custom-tree-node:hover .detailButton {
    display: inline-block;
  }

  .addNodeStyle{
    color: #15315f;
    font-weight: 600;
  }
}
.ruleChoose{
  text-align: left;margin-bottom: 10px;padding-left: 8px;
  .el-button:nth-child(1){
    margin-left: 38px;
  }
}
.detailBtn{
  color:blue;
  cursor: pointer;
}
</style>
