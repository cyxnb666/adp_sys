<template>
  <div class="editor">
    <el-dialog title="测试执行" :visible.sync="dialogVisible" custom-class="rule-test-dialog" width="1300px" append-to-body @closed="$emit('update:dialogVisible', false)">
      <div style="display: flex; width: 100%;">
        <div style="flex: 0 0 900px; border-right: 1px solid #ccc; padding: 10px;">
          <el-form ref="testForm" v-loading="loading" :model="form" label-width="100px">
<!--            <el-form-item label="用例名称：" prop="testName" :rules="{ required: true, message: '请输入', trigger: 'change' }">
              <div style="display: flex;">
                <el-input v-model="form.testName" />
                &lt;!&ndash; <el-button size="small" type="primary" icon="el-icon-folder-opened">保存测试用例</el-button>  style="margin-right: 10px;"
                        <el-button size="small" type="primary" icon="el-icon-document">生成报文</el-button> &ndash;&gt;
              </div>
            </el-form-item>-->
            <el-form-item :label="$t('port.explain')+`：`">
              <div style="display: flex;">
                <el-button-group style="display: flex; width:100%;margin-right: 10px;">
                  <el-button disabled plain>POST</el-button>
                  <el-button disabled plain style="max-width: 700px;
    overflow: hidden;
    display: block;text-align: left;">{{ requestUrl }}</el-button>
                  <el-button type="primary" icon="el-icon-s-promotion" @click="send">发送</el-button>
                </el-button-group>
<!--                <el-button type="primary" icon="el-icon-folder-opened" @click="saveTest">保存测试用例</el-button>-->
<!--                <el-button type="primary" icon="el-icon-document" @click="testHistory">测试记录</el-button>-->
              </div>
            </el-form-item>
            <el-form-item :label="$t('port.params')+`：`">
              <!-- <div class="mb-15">
                        <el-input placeholder="请输入字段名搜索" suffix-icon="el-icon-search" v-model="searchKeyword"></el-input>
                    </div> -->
              <!-- <div v-for="(item,index) in requestParams" :key="index"> -->
              <!-- <el-form ref="testRuleForm" :model="{}">

                            <el-table :data="searchKeyword ? filterParams(_.cloneDeep(requestParams), searchKeyword) : requestParams"
                                row-key="fieldId" size="small" border default-expand-all max-height="300"
                                :header-cell-style="{ background: '#EFF4F8', color: '#60769C', fontWeight: 'normal' }"
                                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                                <el-table-column prop="label" :label="$t('port.fName')" show-overflow-tooltip min-width="160" width="260">
                                    <template slot="header" slot-scope="{ row }">
                                        <span>{{  $t('port.fName') }}</span>
                                        <el-input v-model="searchKeyword" class="ml-15" size="mini" placeholder="输入关键字搜索" style="width: 68%;"/>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="field" :label="$t('port.field')" show-overflow-tooltip width="200"/>
                                <el-table-column prop="type" :label="$t('port.type')" show-overflow-tooltip width="120">
                                    <template slot-scope="{ row }">
                                        <span v-if="row.dataType === 'field'">{{ row.type }}</span>
                                        <span v-else>{{ row.dataType }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('port.fieldValue')" width="260">
                                    <template slot-scope="{ row }">
                                        <el-form-item v-if="row.dataType === 'field'" :prop="`request`" :rules="{ required: true, type: row.dataType, message: '请输入', trigger: 'change', validator: (rule, v, callback) => validator(rule, row.value, callback) }">
                                            <div v-if="row.dataType === 'field'" class="el-input el-input--small">
                                                <input v-model="row.value" type="text" autocomplete="off" class="el-input__inner">
                                            </div>
                                            <span v-else>-</span>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form> -->
              <!-- </div> -->
              <vxe-grid ref="gridRef" v-bind="gridOptions" style="height: 300px;max-width: 868px;">
                <template #labelDefault>
                  <!-- <vxe-input v-model="headerSex"></vxe-input> -->
                  <span>{{ $t('port.fName') }}</span>
                  <el-input v-model="searchKeyword" class="ml-15" size="mini" placeholder="输入关键字搜索" style="width: 68%;" @input="handleSearch" />
                </template>
                <template #valueDefault="{ row }">
                  <div v-if="row.dataType === 'field'" class="el-input el-input--small">
                    <input v-model="row.value" type="text" autocomplete="off" class="el-input__inner">
                  </div>
                  <span v-else>-</span>
                </template>
              </vxe-grid>
              <el-input
                v-model="paramValue"
                type="textarea"
                size="mini"
                placeholder="输入参数"
                style="width: 100%;margin-left: 0;margin-top: 20px;"
              />
            </el-form-item>
            <el-form-item label="响应结果：">
              <!-- 返回示例 -->

              <json-viewer v-if="type !== 'flow'" :value="requestResult" :expand-depth="5" :closed="true" copyable boxed sort />
              <!-- <span class="appParams">{{ $t('port.fail') }}：</span>
                    <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort /> -->
              <page v-if="type === 'flow'" ref="flowPage" :data="data" />
              <Flow />
              <!-- <G6Editor
            ref="G6Editor"
            mode="edit"
            :dim-settings.sync="dimSettings"
            v-bind="{ flowSettingObj, isApprovel, resForm, type, decisionUrlId }"
            v-on="{ savaRule: (data, cb) => $emit('savaRule', data, cb), toggleComponentRuleFlow }"
          /> -->
            </el-form-item>
          </el-form>
        </div>
        <div v-if="type === 'rule'" style="flex: 0 0 350px; padding: 10px;">
          <div class="value pre-wrap-text" style="word-break: break-all;">
            <span>预定义：</span>
            <br>
            <span>{{ rule.editPredefineText }}</span>
            <div />
          </div>
          <br>
          <span class="value">如果：</span>
          <br>
          <div class="value valueContent" style="word-break: break-all;" v-html="ruleDesc" />
          <br>
<!--          <span class="value">那么：</span>
          <div class="value" v-html="rule.elseListText" />
          <br>
          <span class="value">否则：</span>
          <div class="value" v-html="rule.thenListText" />
          <br>-->
        </div>
        <div v-else-if="type === 'table'" style="flex: 0 0 350px; padding: 10px;">
          <el-button type="primary" @click="showPreviewExcel = true">查看决策表</el-button>
          <PreviewExcel v-if="showPreviewExcel" :bom-base-info-id="$store.state.bom.bomBaseInfo" type="view" :url="url" :show-preview-excel.sync="showPreviewExcel" :title="title" :decision-table-id="id" />
        </div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
      <el-dialog v-if="visibleTestLog" :visible.sync="visibleTestLog" width="1000px" append-to-body title="测试记录">
        <ruleTestLog :rule-id="id" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>

import { getRuleExecutionDetails, ruleSingleTest, TableSingleTest, FlowSingleTest } from '@/api/mainPages/port'
// import { ruleSingleTest } from '@/api/mainPages/decision'
import Page from '@/views/mainPages/decision/ruleFlow/editor/components/Page'
import Flow from '@/views/mainPages/decision/ruleFlow//editor/components/Flow'
import start from '@/views/mainPages/decision/ruleFlow/editor/assets/icons/start.png'
import finish from '@/views/mainPages/decision/ruleFlow/editor/assets/icons/finish.png'
import sublevel from '@/views/mainPages/decision/ruleFlow/editor/assets/icons/sublevel.png'
import branch from '@/views/mainPages/decision/ruleFlow/editor/assets/icons/branch.png'
import rule from '@/views/mainPages/decision/ruleFlow/editor/assets/icons/rule.png'
import { decisionFlowChartDetail } from '@/api/mainPages/ruleFlow'
import RuleTestLog from '../ruleTestLog'
import Editor from '@/views/mainPages/decision/ruleFlow/editor/components/Base/Editor'
import Command from '@/views/mainPages/decision/ruleFlow/editor/command'
import { handleStatus } from '@/views/mainPages/decision/utils'
import { getRuleMethodByRuleId, getPredefineByRuleId, getRuleDefinedByRuleId } from '@/api/mainPages/decision'
import { getBomModelId } from '@/api/systemManage/bom'

const gridOptions = {
  border: true,
  loading: false,
  stripe: true,
  showOverflow: true,
  keepSource: true,
  height: '100%',
  columnConfig: {
    // drag: true,
    resizable: true
  },
  // resizableConfig: {
  //     isDblclickAutoWidth: true
  // },
  // rowConfig: {
  //     isHover: true,
  //     // drag: true
  // },
  treeConfig: {
    transform: true,
    rowField: 'path',
    expandAll: true,
    parentField: 'parentId'
    // childrenField: 'children',
  },
  scrollY: {
    gt: 0,
    mode: 'wheel',
    enabled: true
  },
  // tooltipConfig: {
  //     showAll: true,
  // },
  columns: [
    // { field: 'checkbox', type: 'checkbox', fixed: 'left', width: 70 },
    { field: 'label', title: '字段名', slots: { header: 'labelDefault' }, minWidth: 150, treeNode: true },
    { field: 'field', title: '字段' },
    { field: 'type', title: '类型', width: 120 },
    { field: 'value', title: '值', slots: { default: 'valueDefault' }, width: 160 }
  ],
  data: []
}
export default {
  name: 'Page111',
  components: { RuleTestLog, Page, Flow,
    PreviewExcel: () => import('@/components/PreviewExcel/index1.vue')
  },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'rule'
    },
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    decisionTableId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      gridOptions,
      form: {
        testName: ''
      },
      // visible: this.dialogVisible,
      returnExampleSuccess: null,
      loading: false,
      // returnExampleSuccess: {
      //     "applicationId": null,
      //     "businessKey": null,
      //     "resultCode": null,
      //     "resultName": null,
      //     "failMessageList": null,
      //     "executePathCount": 0,
      //     "executeRuleCount": 0,
      //     "filterPathCount": 0,
      //     "executeRuleSet": null,
      //     "success": true,
      //     "errMessage": null,
      //     "decisionTableResult": null,
      //     "executeRules": null,
      //     "output": null,
      //     "appExecuteResultDims": null,
      //     "executeDecisionTables": null,
      //     "executeTimes": null,
      //     "bomModelId": null
      // },
      returnExampleFail: {},

      searchKeyword: '',
      requestUrl: '',
      requestParams: [],
      requestResult: {},

      visibleTestLog: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      data: null,
      editor: { },
      command: null,
      newData: null,
      paramValue: null,
      rule: {
        editPredefineText: '',
        ruleDesc: '',
        elseListText: '',
        thenListText: ''
      },
      bomModelId: '',
      showPreviewExcel: false
    }
  },
  computed: {
    // url() {
    //   // return `${this.$store.state.settings.adp_config.baseURL ||
    //   //   process.env.VUE_APP_BASE_API}/decision/rule/getRuleDefinedByTableId`
    //   return `${this.$store.state.settings.adp_config.baseURL ||
    //     process.env.VUE_APP_BASE_API}/export/decisionTable/${this.id}`
    // }
    ruleDesc() {
      let str = ''
      if (this.rule.ruleDesc) {
        str = this.rule.ruleDesc.replaceAll('并且', '<br><span class="symbol">并且</span>').replaceAll('或者', '<br/><span class="symbol">或者</span>')
      }
      return str
    }
  },
  beforeMount() {
    this.editor = new Editor()
    this.command = new Command(this.editor)
  },
  async mounted() {
    this.getRuleExecutionDetails()
    console.log(this.id)
    console.log(this.type)
    console.log(this.title)
    console.log(this.decisionTableId)
    console.log(this.$store.state.bom.bomBaseInfo)
    console.log(this.url)

    if (this.type === 'rule') {
      this.requestUrl = this.$store.state.settings.adp_config.baseURL + '/test/ruleSingleTest'
    } else if (this.type === 'table') {
      this.requestUrl = this.$store.state.settings.adp_config.baseURL + '/test/tableSingleTest'
    } else {
      this.requestUrl = this.$store.state.settings.adp_config.baseURL + '/test/flowSingleTest'
    }
    if (this.type === 'rule') {
      await getRuleDefinedByRuleId(this.id).then(res => {
        this.rule.ruleDesc = res.ruleDesc
      })
      await getPredefineByRuleId(this.id).then(res => {
        this.rule.editPredefineText = res.content
      })
      await getBomModelId(this.$store.state.bom.bomBaseInfo).then(res => {
        this.bomModelId = res
      })
      await getRuleMethodByRuleId(this.bomModelId, this.id).then(res => {
        this.rule.elseListText = this.getText(res.elseList)
        this.rule.thenListText = this.getText(res.thenList)
      })
    }
  },
  methods: {
    filterParams(requestParams, keyword) {
      return requestParams.filter(v => {
        if (v.children) {
          const children = this.filterParams(v.children, keyword)
          if (children.length) {
            v.children = children
            return true
          }
        }
        return v.label.toLowerCase().includes(keyword.toLowerCase())
      })
    },
    // findValue(data) {
    //   data.forEach(item => {
    //     if (item.children && item.children.length > 0) {
    //       this.findValue(item.children)
    //     } else {
    //       if (item.value) {
    //         this.resetValue(this.treeData, item)
    //       }
    //     }
    //   })
    // },
    // resetValue(data, copy) {
    //   data.forEach(item => {
    //     if (item.children && item.children.length > 0) {
    //       this.resetValue(item.children, copy)
    //     } else {
    //       if (item.fieldPath === copy.fieldPath) {
    //         item = copy
    //       }
    //     }
    //   })
    // },
    getText(treeNode) {
      let html = ''
      treeNode.forEach((item, index) => {
        if (index !== 0) {
          html += '<br>'
        }
        html += (index + 1) + '. '
        html += '<span class="fields">' + item.expressionArray[0].desc + '</span>'
        Object.values(item.paramValue).forEach(valueItem => {
          html += ' <span class="values">' + valueItem + '</span>;'
        })
      })
      return html
    },
    handleSearch() {
      const filterVal = String(this.searchKeyword).trim().toLowerCase()
      const getFilteredTreeData = (nodes) => {
        return nodes.reduce((acc, node) => {
          if (node.label) {
            const isParentMatch = node.label.toLowerCase().includes(filterVal)
            const filteredChildren = node.children ? getFilteredTreeData(node.children) : []
            if (isParentMatch || filteredChildren && filteredChildren.length > 0) {
              node.children = filteredChildren
              acc.push(node)
            }
          }
          return acc
        }, [])
      }
      // this.findValue(this.gridOptions.data)
      if (filterVal) {
        this.gridOptions.data = this.treeData
        this.$nextTick(() => {
          this.gridOptions.data = getFilteredTreeData(this.treeData)
        })
      } else {
        this.gridOptions.data = this.treeData
      }
      // this.gridOptions.data = [...this.treeData]
      this.$nextTick(() => {
        const $grid = this.$refs.gridRef
        if ($grid) {
          $grid.setAllTreeExpand(true)
        }
      })
    },
    findParentLabel(treeData, fieldPath) {
      // 将 fieldPath 拆分为字段名数组
      const pathElements = fieldPath.split('.')
      // 初始化一个变量来存储父级节点的 label
      const parentLabel = []

      // 递归函数，用于在树结构中查找匹配的字段名
      function findLabelRecursively(node, index) {
        if (index >= pathElements.length) {
          return // 已经遍历完所有路径元素
        }
        let fieldName = pathElements[index]
        if (fieldName.includes('()')) {
          fieldName = fieldName.slice(0, -2)
        }
        let found = false // 用于标记是否找到匹配的字段

        for (const item of node) {
          if (item.field === fieldName) {
            parentLabel.push(item.label)
            found = true
            if (item.children) {
              findLabelRecursively(item.children, index + 1) // 递归查找下一个路径元素
            }
            break // 找到匹配的字段后，不再继续搜索当前层级的其他节点
          }
        }

        if (!found) {
          // 如果当前层级没有找到匹配的字段，继续查找下一个节点
          for (const item of node) {
            if (item.children) {
              findLabelRecursively(item.children, index)
            }
          }
        }
      }

      // 从根节点开始查找
      findLabelRecursively(treeData, 0)

      // 返回父级节点的 label
      return parentLabel
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
    filterData(data) {
      return data
        .filter(node => {
          if (node.children && node.children.length > 0) {
            node.children = this.filterData(node.children)
            return true
          }

          return (node.type !== 'void')
        })
        .map(node => {
          const { ...rest } = node
          return rest
        })
    },
    getRuleExecutionDetails() {
      // this.loading = true

      getRuleExecutionDetails(this.$store.state.app.applicationId).then(res => {
        // this.filterRequestParam(res.requestParam)
        const data = []
        const fn = (arr, parentId) => {
          return arr.map((v) => {
            data.push({
              parentId,
              label: v.label,
              field: v.field,
              type: v.type,
              dataType: v.dataType,
              path: v.path,
              value: null,
              fieldPath: v.fieldPath
            })
            if (v.children) {
              fn(v.children, v.path)
            }

            // return {
            //     parentId,
            //     label: v.label,
            //     field: v.field,
            //     type: v.type,
            //     dataType: v.dataType,
            //     fieldPath: v.fieldPath,
            //     children: v.children ? fn(v.children, v.path) : [],
            //     // id: `${id}${index}`
            // }
          })
        }
        // fn(res.requestParam.children)

        // this.requestParams.data = Object.freeze(fn(res.requestParam.children, 1000))
        // this.treeData = this.gridOptions.data = Object.freeze(data) || []
        fn(this.filterData(res.requestParam.children) || [])
        this.treeData = this.gridOptions.data = Object.freeze(data)
        this.$nextTick(() => {
          const $grid = this.$refs.gridRef
          if ($grid) {
            $grid.setAllTreeExpand(true)
          }
        })
        // this.loading = false
      })
    },
    validator(rule, value, callback) {
      if (value) {
        callback()
      } else {
        callback(rule.message)
      }
    },
    async sendTest() {
      // const callback = (arr) => {
      //   return arr.reduce((acc, val) => {
      //     if (val.children.length > 0) {
      //       acc[val.field] = callback(val.children)
      //     } else {
      //       if (val.value) {
      //         acc[val.field] = val.value
      //       }
      //     }
      //     return acc
      //   }, {})
      // }
      const inputList = []

      const callback = (arr) => {
        return arr.forEach((item) => {
          if (item.children && item.children.length > 0) {
            callback(item.children)
          } else {
            if (item.value) {
              inputList.push(item)
            }
          }
        })
      }
      callback(this.treeData)

      const inputList1 = [...new Set(inputList)]
      var input = {}
      inputList1.forEach((item, index) => {
        const keys = item.fieldPath.split('.')
        let copyResult = input
        keys.reduce((a, key, index) => {
          if (index === keys.length - 1) {
            copyResult[key] = item.value
            return
          }
          if (copyResult[key]) {
            copyResult = copyResult[key]
          } else {
            copyResult = copyResult[key] = {}
          }

          return copyResult[key]
        }, '')
      })
      if (this.paramValue) {
        input = JSON.parse(this.paramValue)
      }
      if (this.type === 'rule') {
        const params = {
          applicationId: this.$store.state.app.applicationId,
          ruleId: this.id,
          // bomId: this.$store.state.bom.bomBaseInfo,
          input
        }
        ruleSingleTest(params).then(res => {
          this.requestResult = res
          this.loading = false
        }).catch((e) => {
          this.requestResult = '失败'
          this.loading = false
        })
      } else if (this.type === 'table') {
        const params = {
          applicationId: this.$store.state.app.applicationId,
          tableId: this.id,
          input
        }
        TableSingleTest(params).then(res => {
          // this.requestResult = res
          let strArr = []
          res.tableHitRows && res.tableHitRows.length > 0 ? strArr = [...new Set(res.tableHitRows)] : ''
          let str = '命中第'
          strArr.forEach((item, index) => {
            str += index === res.tableHitRows.length - 1 ? item : item + '、'
          })
          str = str + '行'
          this.requestResult = res.pass === '1' ? '通过，' + str : '不通过'
          this.loading = false
        }).catch((e) => {
          this.requestResult = '失败'
          this.loading = false
        })
      } else {
        const params = {
          applicationId: this.$store.state.app.applicationId,
          flowId: this.id,
          input
        }
        await FlowSingleTest(params).then(res => {
          // this.requestResult = res
          this.data = res
          this.loading = false
        }).catch((e) => {
          this.requestResult = '失败'
          this.loading = false
        })
        await decisionFlowChartDetail(this.id).then(res => {
          const newData = {
            nodes: this.getNode(res.nodes),
            edges: this.getCondition(res.conditions)
          }
          this.newData = newData
          this.newData.edges = newData.edges.map(item => {
            if (this.data.conditions.includes(item.id)) {
              item.style = {
                lineWidth: 2,
                stroke: 'green'
              }
            }
            return item
          })
          this.newData.nodes = newData.nodes.map(item => {
            this.data.nodes.forEach(item1 => {
              if (item.id === item1.nodeId) {
                item.style = {
                  lineWidth: 2,
                  stroke: 'green'
                }
              }
            })
            return item
          })
          this.$refs.flowPage.readAllData(this.newData)
        })
      }
    },
    async send() {
      this.loading = true
      // this.$refs.testRuleForm.validate(valid => {
      //     if (valid) {
      //     }
      // })
      // this.findValue(this.gridOptions.data)
      this.sendTest()
    },
    getNode(data) {
      const arr = data.map(res => {
        return {
          childFlowDefId: res.childFlowDefId || '', // 子流节点所设置的规则流IS
          label: res.flowNodeName,
          id: res.flowNodeId,
          flowNodeType: res.flowNodeType,
          image: res.flowNodeType === 'START_NODE' ? start : res.flowNodeType === 'END_NODE'
            ? finish : res.flowNodeType === 'CHILD_FLOW_NODE' ? sublevel : res.flowNodeType === 'JUDGMENT_NODE' ? branch
              : res.flowNodeType === 'PACKET_NODE' ? rule : '',
          isDoingEnd: true,
          type: 'node',
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          offsetX: res.offsetX,
          offsetY: res.offsetY,
          x: res.x,
          y: res.y,
          color: '#1890ff',
          shape: res.flowNodeType === 'JUDGMENT_NODE' ? 'customPolygon' : 'customNode',
          checkNodes: res.ruleSetting || [],
          checkedTables: res.decisionTables || []
        }
      })
      return arr
    },
    getCondition(data) {
      const arr = data.map(res => {
        return {
          sourceId: res.preFlowNodeId,
          targetId: res.nextFlowNodeId,
          source: res.preFlowNodeId,
          target: res.nextFlowNodeId,
          label: res.conditionName,
          shape: 'customEdge',
          type: 'edge',
          id: res.flowConditionId,
          checkNodes: res.ruleSetting || [],
          checkedTables: res.decisionTables || []
        }
      })
      return arr
    },
    saveTest() {
      this.$refs.testForm.validate(valid => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.$message.success('保存测试用例成功')
          }, 700)
        }
      })
    },
    testHistory() {
      this.visibleTestLog = true
      // this.$router.push({
      //     path: '/trial/ruleTestLog',
      //     query: {
      //         ruleId: this.ruleId
      //     }
      //     // path: '/systemManage/trialManage/ruleTestLog/index'
      // })
    }
  }
}
</script>

<style lang="scss">
.rule-test-dialog {
    .el-dialog__body {
      .el-row{
          // max-height: 500px;
          overflow-y: auto;
      }
    }

}
</style>
