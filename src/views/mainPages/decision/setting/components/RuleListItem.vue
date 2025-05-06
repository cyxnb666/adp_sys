<template>
  <div>
    <div class="rule-item">
      <div class="item flex-wrap align-item-center relative">
        <svg-icon icon-class="ruleId" />
        <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
        <span class="value">{{ item.ruleId }}</span>
        <div class="handle-right">
          <el-button
            v-if="ruleSetList.indexOf(item.ruleId) !== -1"
            :disabled="true"
            class="btn-background mini"
          >{{ $t('ruleListItem.join') }}</el-button>
          <el-button
            v-else
            class="btn-border mini"
            @click="addList(item)"
          >{{ $t('ruleListItem.addList') }}</el-button>
        </div>
      </div>
      <div class="item flex-wrap align-item-center">
        <svg-icon icon-class="ruleId" />
        <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
        <span class="value">{{ item.ruleName }}</span>
      </div>
      <div class="item flex-wrap align-item-center">
        <svg-icon icon-class="path" />
        <span class="name">{{ $t('ruleSetting.path') }}：</span>
        <span class="value">/{{ item.path }}</span>
      </div>
      <div class="">
        <div class="item flex-wrap align-item-center">
          <svg-icon icon-class="content" />
          <span class="name">{{ $t('ruleListItem.ruleContent') }}:</span>
        </div>
      </div>
      <el-tooltip class="item" effect="dark" placement="left">
        <div slot="content" class="item" style="max-width:500px;font-size:16px" v-html="item.ruleDesc" />
        <div class="value" style="margin-left: auto" v-html="item.ruleDesc" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { getBomModelId } from '@/api/systemManage/bom'
import { getMethodSettingDefine } from '@/api/systemManage/rule-manage'
import { NODE_TYPE } from '@/utils/poc'
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    ruleSetList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      bomModelId: '',
      thenList: [],
      elseList: []
    }
  },
  async created() {
    this.NODE_TYPE = NODE_TYPE
    await getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
      this.bomModelId = res
    })
  },
  methods: {
    // 将表达式结构的数据转换成可渲染到页面的数据格式
    expressionTransferFn(items) {
      const paramValue = {}

      items.expressionArray.forEach((item) => {
        if (item.type === 'input') {
          paramValue[item.paramId] = items.paramValue[item.paramId]
        }
      })

      const expressionNode = {}
      // expressionNode.label = expressDesc
      expressionNode.nodeType = NODE_TYPE.EXPRESSION // 节点类型
      expressionNode.codeService = items.codeService
      expressionNode.expressionId = items.expressionId
      expressionNode.returnType = items.returnType
      expressionNode.paramValue = paramValue
      expressionNode.fieldParsings = items.fieldParsings
      return expressionNode
    },
    // 调用父组件的addToSetList函数
    async addList(item) {
      item.operate = 0
      const res = await getMethodSettingDefine({
        bomModelId: this.bomModelId,
        ruleId: item.ruleId
      })
      const thenListArr = []
      res.thenList.forEach(item => {
        thenListArr.push(this.expressionTransferFn(item))
      })
      const elseListArr = []
      res.elseList.forEach(item => {
        elseListArr.push(this.expressionTransferFn(item))
      })
      this.thenList = thenListArr
      this.elseList = elseListArr
      this.$emit('addToSetList', item, this.thenList, this.elseList)
    }
  }
}
</script>

<style scoped>
#myDiv {
  background-color: #000;
  width: 200px;
  height: 100px;
}
</style>
