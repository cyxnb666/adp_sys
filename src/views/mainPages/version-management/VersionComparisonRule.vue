<template>
  <div class="VersionComparisonRule">
    <VersionComparisonPath :version-dimension-value="versionComparisonPath">
      <template #btn>
        <el-button class="btn-border mini" @click="toComponent">{{ $t('ruleDetail.resselectPath') }}</el-button>
      </template>
    </VersionComparisonPath>
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span class="mr-15">{{ $t('versionCompareRule.ruleDetails') }}</span>
        <slot name="btn" />
      </div>
      <div v-if="ruleSetList.length">
        <div v-for="(items,index) in ruleSetList" :key="index" class="border-wrapper">
          <!-- {{ items.title }} -->
          <div :class="'status' + items.ruleStatus" effect="dark" class="comparison-title">{{ items.title }}</div>
          <RuleDetailShow :rule-detail="items.list">
            <template v-slot:default="slotProps">
              <!-- {{ slotProps.item.title }} -->
              <span class="name">{{ $t('versionCompareRule.versions') }}：</span>
              <el-tag effect="dark" class=" rule-item-title">{{ slotProps.item.title }}</el-tag>
            </template>
          </RuleDetailShow>
        </div>
      </div>
      <NoData v-else />
    </el-card>
  </div>

</template>

<script>
import { GetVersionRulDetailComparison } from '@/api/mainPages/version-management'
import { RuleEditor } from '@/utils/RuleEditor'
import Bus from '@/utils/bus'
export default {
  name: 'VersionComparisonRule',
  components: {
    VersionComparisonPath: () => import('./VersionComparisonPath.vue'),
    RuleDetailShow: () => import('@/components/RuleDetailShow/RuleDetailShow.vue')
  },
  props: {
    versionComparisonPath: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleSetList: []
    }
  },
  created() {
    this.ruleEditor = new RuleEditor()
    this.GetVersionRulDetailComparison()
  },
  methods: {
    GetVersionRulDetailComparison() {
      const { oneVersionMgtId, twoVersionMgtId } = this.$route.query
      const data = {
        decisionUrlId: this.versionComparisonPath.decisionUrlId,
        oneVersionMgtId,
        twoVersionMgtId
      }
      GetVersionRulDetailComparison(data).then(res => {
        const { ruleVersions, codeServices } = res
        this.$store.dispatch('app/SET_CODESERVICE', codeServices.toString())
        const list = ruleVersions.map((item, i) => {
          const group = { title: this.$t('versionCompareRule.versions')`${i}`, list: [], dataStatus: item.dataStatus, ruleStatus: item.ruleStatus }
          // flagIsRemoveRuleSetting | 0-修改，1-新增，2-删除
          if (item.ruleStatus === '0') {
            const obj1 = this.handleData(item.oneVersRuleSetting)
            const obj2 = this.handleData(item.twoVersRuleSetting)
            obj2.formModify = {
              time: [item.flagEffectiveDate, item.flagInvalidatedDate],
              ruleForward: item.flagRuleForward,
              ruleResult: item.flagRuleResult,
              ruleTest: item.flagRuleTest
            }

            item.ruleParamList.forEach(element => {
              // path 为null为根节点
              let node = null
              if (element.path) {
                const p = element.path.substr(1)
                node = this._.get(obj2.ruleSettingContent, p)
              } else {
                node = obj2.ruleSettingContent
              }

              if (node) {
                if (element.paramId) {
                  const modifyParamId = node.modifyParamId
                  if (modifyParamId === undefined) {
                    node.modifyParamId = [element.paramId]
                  } else {
                    node.modifyParamId.push(element.paramId)
                  }
                } else {
                  node['modify'] = true
                }
              }
            })

            obj1.ruleArray = this.ruleEditor.convertNodeTreeToArray(this._.cloneDeep(obj1.ruleSettingContent), []) // 把treeNode转换为nodeArray
            obj2.ruleArray = this.ruleEditor.convertNodeTreeToArray(this._.cloneDeep(obj2.ruleSettingContent), []) // 把treeNode转换为nodeArray

            group.list.push({ ...item.after, ...obj1, title: this.$t('versionCompareIndex.version') }, { ...item.after, ...obj2, title: this.$t('versionCompareIndex.version2') })
            group.title = this.$t('versionCompareRule.change')
          } else if (item.ruleStatus === '1') {
            const obj = this.handleData(item.twoVersRuleSetting)
            obj.ruleArray = this.ruleEditor.convertNodeTreeToArray(this._.cloneDeep(obj.ruleSettingContent), []) // 把treeNode转换为nodeArray
            obj.title = this.$t('versionCompareIndex.version2')
            group.list.push({ ...item.twoVersRuleSetting, ...obj })
            group.title = this.$t('pending.add')
          } else if (item.ruleStatus === '2') {
            const obj = this.handleData(item.oneVersRuleSetting)
            obj.ruleArray = this.ruleEditor.convertNodeTreeToArray(this._.cloneDeep(obj.ruleSettingContent), []) // 把treeNode转换为nodeArray
            obj.title = this.$t('versionCompareIndex.version2')
            group.list.push({ ...item.oneVersRuleSetting, ...obj })
            group.title = this.$t('pending.del')
          }

          return group
        })
        this.ruleSetList = list
      })
    },

    handleRuleStatus(status) {
      // 0-修改，1-新增，2-删除
      if (status === '0') {
        return 'warning'
      }
      if (status === '1') {
        return 'success'
      }
      if (status === '2') {
        return 'danger'
      }
    },

    // 转换
    handleData(item) {
      const obj = {}
      obj.form = {
        time: [
          item.effectiveDate || -28800000,
          item.invalidatedDate || 3155731200000
        ],
        ruleForward: item.ruleForward,
        ruleResult: item.ruleResult,
        ruleTest: item.ruleTest
      }
      // eslint-disable-next-line no-eval
      obj.ruleSettingContent = eval('(' + item.ruleSettingContent + ')')
      return obj
    },
    toComponent() {
      Bus.$emit('changeComponentVersion', { toComponent: 'VersionComparisonPath' })
    }
  }
}
</script>

<style lang="scss">
.VersionComparisonRule {
  .border-wrapper {
    border: 1px solid #eee;
    margin-bottom: 15px;
  }
  .comparison-title {
    padding: 15px;
    background: #f9f9f9;
    text-align: center;
    &.status1 {
      color: #67C23A;
    }
    &.status2 {
      color: #F56C6C;
    }
    &.status0 {
      color: #E6A23C;
    }
  }
}
</style>
