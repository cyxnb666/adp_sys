<template>
  <div class="app-container decision-base">
    <el-card>
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('bomManage.selectModel') }}</span>
      </div>
      <div>
        <span class="label">{{ $t('bomManage.selectModel') }}</span>
        <el-select v-model="currentBomId" @change="changeBom">
          <el-option
            v-for="item in BomList"
            :key="item.bomBaseInfoId"
            :value="item.bomBaseInfoId"
            :label="item.bomName"
          >{{ item.bomName }}</el-option>
        </el-select>
      </div>
    </el-card>

    <el-row type="flex" class="flex-wrap">
      <el-col :span="7" class="content2">
        <el-card class="mt-15 mr-15">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('ruleManage.decisionLib') }}</span>
          </div>
          <div class="content vh70 " style="margin-top:0px">
            <Tree
              id="1"
              ref="ruleTree"
              :tree-data="treeData"
              node-key="ruleId"
              @selectField="handleNodeClick"
            >
              <!-- 树结构的自定义标题插槽 -->
              <template #customNode="{node}">
                <!-- {{ node }} -->
                <div class="tree-text">
                  <template v-if="node.leaf">
                    <i class="el-icon-tickets" />
                    {{ node.label }}
                  </template>
                  <template v-else>
                    <i class="el-icon-folder-opened" />
                    {{ node.label }}
                  </template>
                </div>
              </template>
            </Tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17" class=" content2">
        <el-card class="mt-15">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ title }}</span>
          </div>
          <div class="vh70 ">
            <!-- 规则预览 -->
            <RulePreview
              v-if="showComponent === SHOWCOMPONENT.RULEPREVIEW"
              :rule="rule"
              :disabled="true"
            />

            <!-- 预览决策表 -->
            <DecisionPreview
              v-else-if="showComponent === SHOWCOMPONENT.DECISIONPREVIEW"
              :decision-data="decisionData"
              :disabled="true"
              @submitRuleName="refreshTree"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllBomBaseInfo } from '@/api/systemManage/bom'
import { getDecisionRepositoryDetail, getRuleDefinedByRuleId } from '@/api/mainPages/decision'
// tree detail type
const LEAFTYPE = {
  RULE: 'RULE',
  TABLE: 'TABLE'
}

// show component
const SHOWCOMPONENT = {
  RULEEDIT: 'RULEEDIT', // 规则编辑
  RULEPREVIEW: 'RULEPREVIEW', // 规则预览
  DECISIONTABLES: 'DECISIONTABLES', // 决策表上传
  DECISIONPREVIEW: 'DECISIONPREVIEW' // 决策表预览
}
export default {
  components: {
    RulePreview: () => import('@/views/systemManage/management/component/RulePreview'),
    DecisionPreview: () =>
      import('@/views/systemManage/management/component/DecisionTablesPreview.vue')
  },
  data() {
    return {
      treeData: [],
      title: '',
      decisionData: null,
      BomList: [],
      rule: {
        id: null, // id
        ruleTips: null, // 提示
        ruleContent: null, // 规则详情
        ruleDesc: null, // 规则中文描述
        ruleName: null, // 规则名称
        ruleId: null // 规则id
      },
      showComponent: '',
      currentBomId: this.$store.state.bom.bomBaseInfo,
      applicationId: this.$store.state.app.applicationId
    }
  },
  created() {
    this.getAllBomBaseInfo()
    this.changeBom()
    this.SHOWCOMPONENT = SHOWCOMPONENT
  },
  methods: {
    // 名称修改后刷新树节点
    refreshTree() {
      getDecisionRepositoryDetail(this.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeData = decisionRepositoryModel.catalogueList
        }
      })
    },
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        this.BomList = res
      })
    },
    changeBom() {
      if (!this.currentBomId) {
        return
      }

      getDecisionRepositoryDetail(this.applicationId).then(res => {
        if (res.decisionRepositoryModel) {
          const { decisionRepositoryModel } = res
          this.treeData = decisionRepositoryModel.catalogueList
        }
      })
      // getTheBomModelDetail(data).then(res => {
      //   this.treeData = [res]
      // })
    },
    handleNodeClick(data) {
      this.currentNode = data
      // console.log(this.$refs.ruleTree)
      if (data.leaf) {
        // 预览规则模板
        if (data.leafType === LEAFTYPE.RULE) {
          this.getRuleDefinedByRuleId(data)
          this.showComponent = SHOWCOMPONENT.RULEPREVIEW
          this.title = this.$t('bomManage.ruleTemp')
        }
        if (data.leafType === LEAFTYPE.TABLE) {
          this.decisionData = data
          this.showComponent = SHOWCOMPONENT.DECISIONPREVIEW
          this.title = this.$t('bomManage.decTable')
        }
      }
    },
    // 查询规则详情
    getRuleDefinedByRuleId(val) {
      getRuleDefinedByRuleId(val.ruleId).then(res => {
        this.rule.allowEdit = res.allowEdit
        this.rule.id = res.id
        this.rule.ruleId = res.ruleId
        this.rule.ruleName = res.ruleName
        this.rule.ruleDesc = res.ruleDesc
        this.rule.ruleTips = res.ruleTips
        this.rule.ruleContent = res.ruleContent
      })
    }
  }
}
</script>
<style lang="scss">
.decision-base {
  .vh70 {
    height: calc(70vh + 72px);
  }
  .icon-rule-mini {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  .rule-wrap {
    padding: 15px;
    background: #f5f9ff;
    border-radius: 6px;
    border: 2px solid #dbeafe;
    font-size: 14px;
    .item {
      margin-right: 15px;
    }
    .name {
      color: #60769c;
      line-height: 27px;
      width:90px;
    }
    .value {
      font-weight: bold;
      color: #273756;
      line-height: 23px;
      white-space: nowrap;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ::v-deep &.form {
      .el-form-item__label {
        color: #60769c;
      }
    }
  }
}
</style>
