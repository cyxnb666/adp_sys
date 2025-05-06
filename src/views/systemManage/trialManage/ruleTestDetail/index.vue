<template>
  <div class="app-container rule-wrap">
    <div class="title-style1">
      <i class="icon icon-1" /><h6>测试详情</h6>
    </div>
    <el-table
      :data="ruleDetail"
      style="margin-bottom: 20px;width: 100%;"
      border
      :header-cell-style="{
        background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
      }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- <div class="value valueContent" style="word-break: break-all;" v-html="ruleDesc" /> -->
          <!-- <ValidationObserver ref="obs" tag="form"></ValidationObserver> -->
          <!-- <span v-html="rule.ruleDesc"></span> -->
          <el-form ref="ruleSectionForm" :inline="true">
            <IfRuleRender class="value" :rule-test-list="ruleTestList" :rule-array="ruleArray" :children="{}" :tree-data="treeData" />
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="rulesingleTestId" label="规则测试ID">
        <template slot-scope="{ row }">
          <span>{{ row.rulesingleTestId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleId" label="规则ID" />
      <el-table-column prop="pass" label="是否通过">
        <template slot-scope="{ row }">
          <span v-if="row.pass !== null" :class="['tc-red', 'tc-green'][row.pass || 0]">{{ row.pass === '1' ? '通过' : '不通过' }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="executeDate" label="执行时间" />
    </el-table>
  </div>
</template>

<script>

import IfRuleRender from './RuleRender.vue'
// import IfRuleRender from '@/views/mainPages/decision/setting/components/IfRuleRender.vue'
import { getRuleSingleTestDetailData } from '@/api/mainPages/port'
import { bomClassAndField, getbomClassAndUpdateTime } from '@/api/systemManage/bom'
import { getRuleExpressionsAll } from '@/api/systemManage/rule-manage'
import { RuleEditor } from '@/utils/RuleEditor'

export default {
  components: { IfRuleRender },
  data() {
    return {
      ruleTestList: [],
      rule: {
        ruleDesc: '',
        ruleContent: '',
        codeServices: '',
        rulesingleTestId: this.$route.query.ruleSingleTestId,
        executeDate: '',
        ruleId: '',
        pass: ''
      },
      ruleDetail: [
        {
          rulesingleTestId: this.$route.query.ruleSingleTestId,
          executeDate: '',
          ruleId: '',
          pass: ''
        }
      ],
      ruleArray: []
    }
  },
  computed: {
    ruleDesc() {
      let str = ''
      if (this.rule.ruleDesc) {
        str = this.rule.ruleDesc.replaceAll('并且', '<br><span class="symbol">并且</span>').replaceAll('或者', '<br/><span class="symbol">或者</span>')
      }
      return str
    }
  },
  async beforeMount() {
    this.$store.dispatch('app/SET_GETRULEEXPRESSIONSALL')

    this.ruleEditor = new RuleEditor()

    await this.getbomClassAndUpdateTime()

    // this.getRuleExpressionsAll().then(res => {

    //     // this.formatTree()
    // })
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const data = {
        ruleSingleTestId: this.$route.query.ruleSingleTestId
      }
      getRuleSingleTestDetailData(data).then(res => {
        this.ruleDetail[0].executeDate = res.executeDate
        this.ruleDetail[0].ruleId = res.ruleId
        this.ruleDetail[0].pass = res.pass
        this.rule.ruleDesc = res.ruleDesc
        this.rule.ruleContent = res.ruleContent
        this.rule.codeServices = res.codeServices
        this.ruleTestList = res.singleRuleTestParamDTOS
        this.ruleArray = this.ruleEditor.convertNodeTreeToArray1(
          this._.cloneDeep(JSON.parse(this.rule.ruleContent)), []
        )
      })
    },
    flatTree(data) {
      let nodes = []; let left = null; let right = null; const middle = null

      if (data.nodeType === 'EXPRESSION') {
        const paramVaule = data.paramValue

        nodes.push(paramVaule.param1)
        delete paramVaule.param1
        const express = this.idList[data.expressionId]
        if (express) {
          express.expressionArray.map(v => {
            if (data.paramValue[v.paramId]) {
              v.value = data.paramValue[v.paramId]
            }
          })
          nodes.push(express)
        }
      } else {
        nodes.push(data)
      }
      if (data.right) {
        right = this.flatTree(data.right)
        delete data.right
        nodes = nodes.concat(right)
      }

      if (data.left) {
        left = this.flatTree(data.left)
        delete data.left
        nodes = left.concat(nodes)
      }
      return nodes
    },
    formatTree() {
      const data = JSON.parse(this.rule.ruleContent); const left = null; const right = null; const binaryTree = []

      console.log(data)

      console.log(this.flatTree(data))
    },
    async getRuleExpressionsAll() {
      await getRuleExpressionsAll().then(res => {
        const typeList = {} // 按照基本类型分类
        const IdList = {} // 按照id来分
        for (var i = 0; i < res.length; i++) {
          // 表达式分类： 基本类型的集合
          const type = res[i].beforeParamType.toLowerCase()
          if (!typeList[type]) {
            const arr = []
            arr.push(res[i])
            typeList[type] = arr
          } else {
            typeList[type].push(res[i])
          }

          // 表达式分类： id的集合
          const key = res[i].expressionId
          IdList[key] = res[i]
        }
        // commit('SET_EXPRESSIONSLIST', { typeList: typeList, IdList: IdList })
        this.idList = IdList
      })
    },
    GetIdExpressionId(data) {
      if (data.dataType === 'method') {
        const obj = {
          beforeParamType: data.type,
          codeService: data.codeService,
          expressionArray: data.detailsList,
          expressionDesc: data.label,
          expressionId: data.path,
          returnType: data.returnType,
          dataType: data.dataType
        }
        const existingData = JSON.parse(localStorage.getItem('IdExpressionList')) || {}
        existingData[(obj.expressionId).toUpperCase()] = obj
        localStorage.setItem('IdExpressionList', JSON.stringify(existingData))
      }
      if (data.children) {
        for (const child of data.children) {
          this.GetIdExpressionId(child)
        }
      }
    },
    // 根据bomBaseInfoId加载所有类和字段
    async bomClassAndField() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo,
        loadChildren: true
      }
      await bomClassAndField(data).then(async res => {
        this.treeData = [res]
        await this.GetIdExpressionId(this.treeData[0])

        const data1 = res
        await this.$forage.setItem('bomBaseInfoId', data1)
      })
    },
    // 根据时间判断得到的是否是最新的数据
    async getbomClassAndUpdateTime() {
      const res1 = await getbomClassAndUpdateTime(this.$store.state.bom.bomBaseInfo)
      const time = this.$forage.getItem('bomBaseInfoId_Time')
      if (res1.updatedDate === time) {
        const storedData = this.$forage.getItem('bomBaseInfoId')
        this.treeData = [storedData]
        this.GetIdExpressionId(this.treeData[0])
        this.treeData1 = [storedData]
      } else {
        this.$forage.setItem('bomBaseInfoId_Time', res1.updatedDate)
        await this.bomClassAndField()
      }
    },
    onCreated() {
    },
    changeEditPage() {

    }
  }
}
</script>

<style lang="scss" >
.tc-red {
    color: red;
}
.tc-green {
    color: green;
}
.red-line {
    text-decoration: underline;
    text-decoration-color: red;

    // text-decoration: underline line-through;

    // &:after {
    //     content: '';
    //     display: block;
    //     border: 1px solid red;
    // }
}
.value {
    font-weight: 700;
    color: #273756;
    line-height: 23px;
}
.node-tag {
    .field {
        color: #767602!important;
    }
}
</style>
