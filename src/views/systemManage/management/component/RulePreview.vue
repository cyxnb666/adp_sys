<template>
  <div class="rule-preview">
    <div class="rule-wrap">
      <div class="basic-row">
        <div class="flex-wrap">
          <div class="item flex-wrap align-item-center">
            <svg-icon icon-class="ruleId"/>
            <span class="name">{{ $t('ruleSetting.ruleNum') }}：</span>
            <span class="value" :title="rule.ruleId">{{ rule.ruleId }}</span>
          </div>
          <div class="item  flex-wrap align-item-center">
            <svg-icon icon-class="path"/>
            <span class="name">{{ $t('ruleSetting.path') }}：</span>
            <span class="value" :title="currentNode ? currentNode.parentPath : ''">{{
                currentNode ? currentNode.parentPath : ''
              }}</span>
          </div>
        </div>

        <div class="flex-wrap">
          <div class="item flex-wrap align-item-center">
            <svg-icon icon-class="ruleId"/>
            <span class="name">{{ $t('ruleSetting.ruleName') }}：</span>
            <span class="value" :title="rule.ruleName">{{ rule.ruleName }}</span>
          </div>
          <div class="item flex-wrap align-item-center">
            <svg-icon icon-class="ruleId"/>
            <span class="name">规则说明：</span>
            <span class="value" :title="rule.annotation">{{ rule.annotation }}</span>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="item flex-wrap align-item-center">
            <svg-icon icon-class="ruleId"/>
            <span class="name">标签属性：</span>
            <span class="value" :title="rule.ruleAttributeTagName">{{ rule.ruleAttributeTagName }}</span>
          </div>
        </div>
      </div>

      <div class="rule-view">
        <div class="item  flex-wrap align-item-center">
          <svg-icon icon-class="content"/>
          <span>{{ $t('ruleListItem.ruleContent') }}：</span>
        </div>
        <div class="value pre-wrap-text" style="word-break: break-all;">
          <span>预定义</span>
          <br>
          <!-- <span v-for="(section, index) in sections" :key="index">
            <span v-if="index % 2 === 0">{{ section }}</span>
            <span v-else>{{ section }}<br></span>
          </span> -->
          <span>{{ rule.editPredefineText }}</span>
          <div/>
        </div>
        <br>
        <span class="value">如果</span>
        <br>
        <div class="value valueContent" style="word-break: break-all;" v-html="ruleDesc"/>
        <br>
        <span class="value">那么</span>
        <div class="value" v-html="rule.elseListText"/>
        <br>
        <span class="value">否则</span>
        <div class="value" v-html="rule.thenListText"/>
        <!-- <div>{{ RuleResultsList[rule.form.ruleResult] }}</div> -->
        <br>
      </div>
      <div
        v-if="rule.ruleId && !disabled"
        class="flex-wrap align-item-center justify-content-center mt-15 nomb"
      >
        <!-- 规则测试 -->
        <el-button
          v-if="!restore"
          class="mr-15"
          type="primary"
          @click="viewRuleTest"
        >规则测试
        </el-button>

        <!-- 规则还原 -->
        <el-button
          v-if="restore"
          class="mr-15"
          type="primary"
          @click="$emit('handleDeleteRow', rule,'0')"
        >还原
        </el-button>

        <!-- 编辑 -->
        <el-button
          v-if="!restore"
          style="margin-left:0;"
          :disabled="!rule.allowEdit"
          class="mr-15"
          type="primary"
          @click="editFn"
        >{{ $t('button.redact') }}
        </el-button>

        <!-- 删除 -->
        <el-popconfirm
          v-if="!restore"
          :cancel-button-text="$t('common.cancel')"
          :title="$t('rulePreview.deleteRule') "
          :confirm-button-text="$t('common.fine')"
          @onConfirm="$emit('handleDeleteRow', rule,'1')"
        >
          <el-button
            slot="reference"
            :disabled="!rule.allowDelete"
            type="danger"
          >{{ $t('button.delete') }}
          </el-button>
        </el-popconfirm>

        <!-- 查看引用路径 -->
        <el-button
          v-if="rule.existPath && !restore"
          class="btn-background mini ml-15"
          @click="getRulePathFn(rule.ruleId)"
        >{{ $t('rulePreview.seePath') }}
        </el-button>

        <!-- 弹窗显示规则被哪些决策路径引用 -->
        <el-dialog
          :title="$t('rulePreview.pathDetail')"
          :visible.sync="pathDialog"
          width="60%"
        >
          <el-table
            :data="listData"
            style="width: 100%;"
            :empty-text="$t('common.noData')"
            max-height="900"
            border
            :span-method="arraySpanMethod"
            class="mt-20"
            :header-cell-style="{
              background: '#EFF4F8',
              color: '#60769C',
              'font-weight': 'normal'
            }"
            :cell-style="{ color: '#435475' }"
          >
            <el-table-column
              prop="applicationName"
              :label="$t('userInfo.applicationName')"
              width="200"
            />
            <el-table-column
              prop="dim"
              :label="$t('rulePreview.dimMes')"
            />
            <el-table-column
              prop="decisionUrl"
              :label="$t('rulePreview.pathMes')"
            />
          </el-table>
        </el-dialog>

        <!-- 选择模式弹窗 -->
        <el-dialog
          title="请选择编辑模式"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <span>
            <el-button type="primary" plain @click="()=>{moduleValue=1}">向导式编辑</el-button>
            <el-button type="primary" plain @click="()=>{moduleValue=2}">专家级编辑</el-button>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelFn">取 消</el-button>
            <el-button type="primary" @click="okFn">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <RuleTest v-if="ruleTestVisible" :id="rule.ruleId" :dialog-visible.sync="ruleTestVisible" type="rule"
              url="/rule/ruleSingleTest"/>
  </div>
</template>

<script>
import {getRowspanMethod} from '@/utils/table'
import {getRulePathList, ruleSingleTest, restoreRule} from '@/api/mainPages/decision'
import {getRuleResults} from '@/api/mainPages/decision'
// import { getRuleExecutionDetails } from '@/api/mainPages/port'

import RuleTest from '@/views/systemManage/trialManage/testManage/RuleTest'

export default {
  components: {
    RuleTest
  },
  props: {
    rule: {
      type: Object,
      default: function () {
        return {}
      }
    },
    currentNode: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // currentBomId: {
    //   type: String,
    //   required: true
    // },
    disabled: {
      type: Boolean,
      default: false
    },
    restore: {
      type: Boolean,
      default: false
    }
    // predefineText: {
    //   type: String,
    //   default: null
    // }
  },
  data() {
    return {
      arraySpanMethod: () => {
      },
      pathDialog: false,
      listData: [],
      isInputInvalid: false,
      inputErrorMessage: '',
      updateInput: false,
      inputValue: '',
      RuleResults: [],
      RuleResultsList: [],
      moduleValue: 0,
      dialogVisible: false,
      ruleTestVisible: false
      // request: {}
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
  created() {
    this.getRuleResults()
  },
  methods: {
    toRestoreRule() {
      restoreRule(this.$store.state.app.applicationId).then(res => {
        console.log(res)
      })
    },
    // 点击编辑的时候，选择编辑模式
    editFn() {
      // this.dialogVisible = true
      this.$emit('ruleEdit', this.rule, this.moduleValue)
    },
    cancelFn() {
      this.moduleValue = 0
      this.dialogVisible = false
    },
    okFn() {
      this.dialogVisible = false
      this.$emit('ruleEdit', this.rule, this.moduleValue)
    },
    getRuleResults() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return false
      getRuleResults(applicationId).then((res) => {
        this.RuleResults = res
        this.RuleResults.forEach((item, index) => {
          this.RuleResultsList[item.resultCode] = (item.resultName)
        })
      })
    },
    // 获取被引用路径的数据
    getRulePathFn(id) {
      this.pathDialog = true
      getRulePathList(id).then(res => {
        const arr = this.treeRender(res)
        // 合并行
        this.arraySpanMethod = getRowspanMethod(arr, ['applicationName', 'dim', 'decisionUrl'])
        this.listData = arr
      })
    },
    // filterRequestParam(requestParam) {
    // 找到当前规则fieldPath
    // const code = []
    // const rules = JSON.parse(this.rule.ruleContent) || {}
    // const callback = (rule) => {

    //   if (rule.nodeType === 'FIELD' || rule.nodeType === 'METHOD') code.push(rule.fieldPath || rule.path)
    //   // if (rule.nodeType === 'FIELD') code.push(rule.fieldPath)

    //   if (rule.left) {
    //     callback(rule.left)
    //   }
    //   if (rule.arr) {
    //     rule.arr.map(v => callback(v))
    //   }

    //   if (rule.right) callback(rule.right)
    //   if (rule.nestingTree) callback(rule.nestingTree)
    //   if (rule.paramValue && rule.paramValue.param1) callback(rule.paramValue.param1)
    // }
    // callback(rules)

    // 标记当前数据路径
    // const callback = function(obj, nodeType) {
    //     if (nodeType === obj.fieldPath || nodeType === obj.path) {
    //       return obj.flag = true
    //     }
    //     if (obj.children && obj.children.length) {
    //         const arr = obj.children.filter(v => callback(v, nodeType))
    //         if (arr.length) {
    //           return obj.flag = true
    //         }
    //     }
    // }
    // code.filter(v => callback(requestParam, v))

    // 过滤出当前规则数据
    // const replace = (obj) => {

    //     if (obj.children && obj.children.length) {
    //       obj.children = obj.children.filter(v => {
    //         if (v.children) replace(v)
    //         return v.flag
    //       })
    //     }
    // }
    // replace(requestParam)
    // },
    viewRuleTest() {
      this.ruleTestVisible = true
      // const applicationId = this.$store.state.app.applicationId
      // getRuleExecutionDetails(this.$store.state.app.applicationId).then(res => {

      // this.filterRequestParam(res.requestParam)
      // this.request = {
      //   requestUrl: this.$store.state.settings.adp_config.baseURL + res.requestUrl,
      //   requestParam: res.requestParam.children
      // }
      // res.returnExample.map(item => {
      //   if (item.success === true) {
      //     this.returnExampleSuccess = item
      //   } else {
      //     this.returnExampleFail = item
      //   }
      // })
      // })
    },
    // sendTest(fn) {
    //   const callback = (arr) => {
    //     return arr.reduce((acc, val) => {
    //       if (val.children) {
    //         acc[val.field] = callback(val.children)
    //       } else {
    //         acc[val.field] = val.value
    //       }
    //       return acc
    //     }, {})
    //   }

    //   const params = {
    //       applicationId: this.$store.state.app.applicationId,
    //       ruleId: this.rule.ruleId,
    //       bomId: this.currentBomId,
    //       input: callback(this.request.requestParam) || {}
    //   }
    //   ruleSingleTest(params).then(res => {
    //       fn && fn()
    //       delete res.resp?.resHashMap
    //       this.request.result = {
    //         "success": true,
    //         "errCode": "",
    //         "resp": {
    //             resultCode: res.pass ? 200 : 400,
    //             // ruleId:"SINOSIG 000500",
    //             resultInfo: res.pass ? '成功' : '拒绝'
    //         }
    //       }
    //   }).catch(() => {
    //     fn && fn()
    //   })
    // },
    // 将数据转成扁平化
    treeRender(arr) {
      if (!arr.length) return []
      const newArr = []
      arr.forEach((item) => {
        for (var i = 0; i < item.dimUrlDTOList.length; i++) {
          for (
            var k = 0;
            k < item.dimUrlDTOList[i].decisionUrlDTOList.length;
            k++
          ) {
            newArr.push({
              applicationName: item.applicationName, // 应用的名字
              dim: item.dimUrlDTOList[i].dimDetails
                .map((i) => i.dimName + '：' + i.dimValue + '-' + i.dimValueName).join('；'), // 维度组合
              decisionUrl: item.dimUrlDTOList[i].decisionUrlDTOList[k].nodeFieldDetails
                .map((d) => d.nodeFieldName + '：' + d.nodeFieldBusinessCode + '-' + d.nodeFieldValue).join('；')
            })
          }
        }
      })
      return newArr
    }
  }
}
</script>
<style lang="scss">
.valueContent {
  .fields {
    color: #767602 !important;
  }

  .values {
    color: #028229 !important;
  }
}

.symbol {
  color: blue;
}

.pre-wrap-text {
  white-space: pre-wrap;
}

.align-item-center {
  width: 100%;

  .value {
    width: calc(100% - 130px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}

.flex-wrap {
  margin-bottom: 6px;
}
.basic-row{
  border-bottom: solid 1px #e2e7ed;
  margin-bottom: 15px;
}
</style>
