<template>
  <div class="VersionComparisonIndex well" style="background-color: white;">
    <div class="app-container">
      <h2>版本差异</h2>
      <div v-if="card===1" style="height: 100%;">
        <div slot="header" class="card-head-style1 clearfix">
          <span>管理维度</span>
        </div>
        <div class="managementDimension">
          <div>
            <span v-for="(item,index) in decisionDimList" :key="index">
              <span>{{ item.dimName }}</span>
              <el-select
                v-model="form[index]"
                value-key="key"
                filterable
                :placeholder="$t('common.pleaseChoose')"
                @change="changeSelect(item, index)"
              >
                <el-option
                  :label="$t('common.all')"
                  :value="{ key: 'ALL', value: $t('common.all') }"
                />
                <el-option
                  v-for="items in decisionDimComponentList[
                    item.codeService
                  ]"
                  :key="items.key"
                  :label="items.key + items.label"
                  :value="items"
                />
              </el-select>
            </span>
          </div>
          <span>默认路径</span>
          <el-select
            v-model="thirdSelectValue"
            placeholder="请选择"
            @change="getVersionList"
          >
            <el-option
              v-for="item in thirdSelectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div style="height: 100%;margin-top: 50px;">
          <div class="header">
            <span class="leftHeader">v1</span>
            <span class="rightHeader">v2</span>
          </div>
          <div v-for="(item,index) in tableData1" :key="index" class="differenceList">
            <span class="ruleLeft">
              {{ item.left? item.left.id : ' ' }} {{ item.left? item.left.name : ' ' }}
            </span>
            <span v-if="item.type=='2'" class="ruleRight" @click="ViewDetails(item.right.id || item.right.name,item.type)">
              {{ item.right? item.right.id:' ' }} {{ item.right? item.right.name : ' ' }}
            </span>
            <span v-if="item.type==='1'" class="ruleRight" @click="ViewDetails(item.right.id || item.right.name,item.type)">
              {{ item.right? item.right.id:' ' }} {{ item.right? item.right.name : ' ' }}
            </span>
            <span v-if="item.type==='3'" class="ruleRight" style="text-decoration: line-through;color: gray;">
              {{ item.left? item.left.id:' ' }} {{ item.left? item.left.name : ' ' }}
            </span>
            <span
              class="centerText"
              :style="{ backgroundColor: item.type === '1' ? 'rgba(236, 150, 56, 1)' : (item.type === '2' ? 'rgba(89, 129, 86, 1)' : (item.type === '3' ? 'rgba(196, 201, 211, 1)' : '')) }"
              style="color: white;padding: 8px;border-radius: 20%;"
            >{{ conterTxt[item.type] }}</span>
          </div>
          <!-- <div v-if="!tableData1">
            暂无数据
          </div> -->
        </div>
      </div>
      <div v-if="card===2" style="height: 100%;">
        <div>
          <el-button
            type="primary"
            style="margin-bottom: 20px;margin-top: 20px;"
            @click="ReturnList"
          >返回列表</el-button>
        </div>
        <div style="height: 100%;">
          <div class="header">
            <span class="columnName">机构</span>
            <span class="leftHeader">v1</span>
            <span class="rightHeader">v2</span>
          </div>
          <div class="ruleMain">
            <div class="introduce">
              <span class="centerText">预定义</span>
              <span class="ruleLeft">&nbsp;</span>
              <span class="ruleRight">&nbsp;</span>
            </div>
            <div class="introduceContent">
              <span v-if="ruleMain.left&&ruleMain.left.predefine" class="ruleLeft" v-html="ruleMain.left.predefine" />
              <span v-else class="ruleLeft">&nbsp;</span>
              <span v-if="ruleMain.right&&ruleMain.right.predefine" class="ruleRight" v-html="ruleMain.right.predefine" />
              <span v-else class="ruleRight">&nbsp;</span>
            </div>
            <div class="introduce">
              <span class="centerText">规  则</span>
              <span class="ruleLeft">&nbsp;</span>
              <span class="ruleRight">&nbsp;</span>
            </div>
            <div class="introduceContent">
              <span v-if="ruleMain.left&&ruleMain.left.content" class="ruleLeft" v-html="ruleMain.left.content" />
              <span v-else class="ruleLeft">&nbsp;</span>
              <span v-if="ruleMain.right&&ruleMain.right.content" class="ruleRight" v-html="ruleMain.right.content" />
              <span v-else class="ruleRight">&nbsp;</span>
            </div>
            <div class="introduce">
              <span class="centerText">那  么</span>
              <span class="ruleLeft">&nbsp;</span>
              <span class="ruleRight">&nbsp;</span>
            </div>
            <div v-for="(item,index) in thenListNum" :key="index" class="introduceContent">
              <span v-if="thenListText.left&&thenListText.left[index]" class="ruleLeft" v-html="thenListText.left[index]" />
              <span v-else class="ruleLeft"> &nbsp;</span>
              <span v-if="thenListText.right&&thenListText.right[index]" class="ruleRight" v-html="thenListText.right[index]" />
              <span v-else class="ruleRight"> &nbsp;</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="card===3" style="height: 100%;">
        <div style="height: 100%;">
          <div class="headerText" style="margin-top: 50px;background-color:rgb(239, 244, 248 );height: 50px;line-height: 50px;padding-left: 20px;">
            如下仅对变化数据所在列进行对比展示，完整数据请前往决策表在线预览或下载后查看
          </div>
          <div>
            <el-button
              type="primary"
              style="margin-top: 20px;"
              @click="ReturnList"
            >返回列表</el-button>
          </div>
          <div class="header" style="margin-top: 20px;">
            <span class="leftHeader">v1
            </span>
            <span class="rightHeader">v2
            </span>
          </div>
          <div class="tableMain">
            <span class="tableLeft">
              <el-table
                :data="tableLeftList"
                :show-header="false"
                :border="true"
                :style="{width:'100%'}"
              >
                <template
                  v-for="(item,index) in tableLeftList[0]"
                >
                  <el-table-column
                    :key="index"
                    :prop="index"
                    :label="index"
                    style="min-height:40px;min-width:150px"
                  >
                    <template slot-scope="scope">
                      <div slot="reference" style="min-height:40px;min-width:150px" type="text" v-html="scope.row[index]" />
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </span>
            <span class="tableRight">
              <el-table
                :data="tableRightList"
                :show-header="false"
                :border="true"
                :style="{width:'100%'}"
              >
                <template
                  v-for="(item,index) in tableRightList[0]"
                >
                  <el-table-column
                    :key="index"
                    :prop="index"
                    :label="index"
                    style="min-height:40px;min-width:150px"
                  >
                    <template slot-scope="scope">
                      <div slot="reference" style="min-height:40px;min-width:150px" type="text" v-html="scope.row[index]" />
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CompareVersion } from '@/api/mainPages/version-management'
import { getDimCodeData } from '@/api/base'
import { deciurlTabular, deciurlField } from '@/api/mainPages/deci'
import { getRuleSetting } from '@/api/systemManage/rule-manage'
import { GetDecisionTable } from '@/api/mainPages/decision-table'
export default {
  name: 'VersionCompare',
  components: {

  },
  data() {
    return {
      tableData1: [],
      card: 1,
      mainVersionId: null,
      otherVersionId: null,
      firstCodeService: null,
      secondCodeService: null,
      firstSelectList: [],
      secondSelectList: [],
      firstSelectValue: 'ALL',
      secondSelectValue: 'ALL',
      firstSelectName: null,
      secondSelectName: null,
      firstSelectDimid: null,
      secondSelectDimid: null,
      thirdSelectValue: null,
      thirdSelectList: [],
      conterTxt: { 0: '', 1: '修改', 2: '新增', 3: '删除' },
      ruleMainList: [],
      ruleMain: null,
      thenListText: null,
      tableList: [],
      tableMainList: [],
      tableMain: null,
      tableLeftList: [],
      tableRightList: [],
      initialData: [],
      decisionDimList: [],
      decisionDimComponentList: {},
      form: []
    }
  },
  created() {
    const { mainVersionId, otherVersionId } = this.$route.query
    this.mainVersionId = mainVersionId
    this.otherVersionId = otherVersionId
    this.getCompareVersion()
    this.getDeciurlField()
  },
  methods: {
    // 返回列表 1
    ReturnList() {
      this.card = 1
    },
    // 获取数据 1
    async getCompareVersion() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        mainVersionId: this.mainVersionId,
        otherVersionId: this.otherVersionId
      }
      await CompareVersion(data).then(async res => {
        // const codeServices = res[0].dims[0].dimAttr + 'Service' , res[0].dims[1].dimAttr + 'Service'
        this.initialData = res
        // this.firstSelectName = res[0].dims[0].dimName
        // this.secondSelectName = res[0].dims[1].dimName
        // this.firstSelectDimid = res[0].dims[0].dimId
        // this.secondSelectDimid = res[0].dims[1].dimId
        // this.firstCodeService = res[0].dims[0].dimAttr + 'Service'
        // this.secondCodeService = res[0].dims[1].dimAttr + 'Service'
        this.thirdSelectValue = res[0].nodes[0].decisionUrlId
        this.decisionDimList = res[0].dims
        this.form = this.decisionDimList.map((item) => {
          return {
            dimId: item.dimId,
            dimValue: 'ALL',
            key: 'ALL',
            value: this.$t('common.all')
          }
        })
        const codeService = this.decisionDimList.map((item) => {
          return item.codeService
        })
        this.getDimCodeData(codeService.toString())
        // this.firstSelectValue = this.firstSelectList.find(item => {
        //   return item.key === res[0].dims[0].dimValue
        // })
        // this.secondSelectValue = this.secondSelectList.find(item => {
        //   return item.key === res[0].dims[1].dimValue
        // })
        // res[0].ruleCompareResults.forEach((item, index) => {
        //   this.tableData1.push(item)
        // })
        res.forEach((item, index) => {
          const allValuesAreAll = item.dims.every(item1 => item1.dimValue === 'ALL')
          if (allValuesAreAll) {
            this.tableData1 = res[index].ruleCompareResults
            res[index].tableCompareResults.forEach((item, index) => {
              this.tableData1.push(item)
            })
            this.ruleMainList = res[index].ruleCompareResults
            this.tableMainList = res[index].tableCompareResults
          }
        })
        // await this.getDefaultPath()
        await this.search()
        // this.tableList = res[0].tableCompareResults
        this.tableList = []
        // 决策表表格比较不同的地方

        // 跳转到卡片3时需要获取的路径的决策表
      })
    },
    // 获取对应纬度值 1
    async getDimCodeData(codeServices) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        codeServices: codeServices
      }
      getDimCodeData(data).then((res) => {
        this.decisionDimComponentList = res
      })
    },
    // 获取默认路径
    async getDefaultPath() {
      if (!this.firstSelectValue || !this.secondSelectValue) {
        return
      }
      const data = {
        applicationId: this.$store.state.app.applicationId,
        flag: 1,
        [this.firstSelectDimid]: this.firstSelectValue.key,
        [this.secondSelectDimid]: this.secondSelectValue.key
      }
      await deciurlTabular(data).then(res => {
        // this.tableData1 = res
        this.thirdSelectList = []
        res.forEach((item, index) => {
          const obj = {
            label: item.defaultPath,
            value: item.DECISION_URL_ID
          }
          this.thirdSelectList.push(obj)
        })
      })
    },
    // 获取可以成为决策路径的属性
    async getDeciurlField() {
      const data = {
        applicationId: this.$store.state.app.applicationId
      }
      await deciurlField(data).then(res => {
        console.log(res)
      })
    },
    // 获取那么文本
    getText(arr, treeNode) {
      let html = ''
      treeNode.forEach((item, index) => {
        html = ''
        html += JSON.parse(item.details)[0].desc
        Object.values(item.param).forEach(valueItem => {
          html += valueItem.value
        })
        arr[index] = html
      })
      return arr
    },
    // 切换card 1
    ViewDetails(id, type) {
      if (id) {
        this.ruleMain = this.ruleMainList.find((item, index) => {
          if (item.right) {
            return item.right.id === id
          }
        })
        if (this.ruleMain) {
          this.card = 2
          if (type === '1') {
            this.thenListNum = this.ruleMain.left.methods.length > this.ruleMain.right.methods.length ? this.ruleMain.left.methods.length : this.ruleMain.right.methods.length
            this.thenListText = {
              left: [],
              right: []
            }
            this.getText(this.thenListText.left, this.ruleMain.left.methods)
            this.getText(this.thenListText.right, this.ruleMain.right.methods)
            // 查找规则中不同的部分
            const regex = /(<[^>]+>|[^<]+)/g
            if (this.ruleMain.left.content && this.ruleMain.left.content.match(regex)) {
              const matches = this.ruleMain.left.content.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.left.content = filteredMatches.join('') || this.ruleMain.left.content
            }
            if (this.ruleMain.right.content && this.ruleMain.right.content.match(regex) && !this.ruleMain.right.content.includes('red')) {
              const matches = this.ruleMain.right.content.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.right.content = filteredMatches.join('') || this.ruleMain.right.content
            }
            if (this.ruleMain.right.predefine && this.ruleMain.right.predefine.match(regex) && !this.ruleMain.right.predefine.includes('red')) {
              const matches = this.ruleMain.right.predefine.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.right.predefine = filteredMatches.join('') || this.ruleMain.right.predefine
            }
            if (this.ruleMain.left.predefine && this.ruleMain.left.predefine.match(regex)) {
              const matches = this.ruleMain.left.predefine.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.left.predefine = filteredMatches.join('') || this.ruleMain.left.predefine
            }
            // this.ruleMain.left.content = this.ruleMain.left.content.replace(/<[^>]+>/g, '').trim()
            // this.ruleMain.right.content = this.ruleMain.right.content.replace(/<[^>]+>/g, '').trim()
            // this.ruleMain.left.predefine = this.ruleMain.left.predefine.replace(/<[^>]+>/g, '').trim()
            // this.ruleMain.right.predefine = this.ruleMain.right.predefine.replace(/<[^>]+>/g, '').trim()
            // 查找规则中不同的部分
            if (this.ruleMain.right.content && !this.ruleMain.right.content.includes('red')) {
              this.ruleMain.right.content = this.highlightDifferentPart(this.ruleMain.left.content, this.ruleMain.right.content)
            }
            // 查找预定义中不同的部分
            if (this.ruleMain.right.predefine && !this.ruleMain.right.predefine.includes('red')) {
              this.ruleMain.right.predefine = this.highlightDifferentPart(this.ruleMain.left.predefine, this.ruleMain.right.predefine)
            }
            // 查找回写方法中不同的部分
            for (let i = 0; i < this.thenListNum; i++) {
              if (this.thenListText.right[i] && !this.thenListText.right[i].includes('red')) {
                this.thenListText.right[i] = this.highlightDifferentPart(this.thenListText.left[i], this.thenListText.right[i])
              }
            }
          } else {
            this.thenListNum = this.ruleMain.right.methods.length
            this.thenListText = {
              left: [],
              right: []
            }
            this.getText(this.thenListText.right, this.ruleMain.right.methods)
            // 查找规则中不同的部分
            const regex = /(<[^>]+>|[^<]+)/g
            if (this.ruleMain.right.content && this.ruleMain.right.content.match(regex) && !this.ruleMain.right.content.includes('red')) {
              const matches = this.ruleMain.right.content.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.right.content = filteredMatches.join('') || this.ruleMain.right.content
            }
            if (this.ruleMain.right.predefine && this.ruleMain.right.predefine.match(regex) && !this.ruleMain.right.predefine.includes('red')) {
              const matches = this.ruleMain.right.predefine.match(regex)
              const filteredMatches = matches.filter(match => !match.startsWith('<'))
              this.ruleMain.right.predefine = filteredMatches.join('') || this.ruleMain.right.predefine
            }
            // if (this.ruleMain.right.content && !this.ruleMain.right.content.includes('red')) {
            //   this.ruleMain.right.content = "<span style='color: red'>" + (this.ruleMain.right.content || '') + '</span>'
            // }
            // if (this.ruleMain.right.predefine && !this.ruleMain.right.predefine.includes('red')) {
            //   this.ruleMain.right.predefine = "<span style='color: red'>" + (this.ruleMain.right.predefine || '') + '</span>'
            // }
            // for (let i = 0; i < this.thenListNum; i++) {
            //   if (this.thenListText.right[i] && !this.thenListText.right[i].includes('red')) {
            //     this.thenListText.right[i] = "<span style='color: red'>" + (this.thenListText.right[i] || '') + '</span>'
            //   }
            // }
          }
        }
        this.tableMain = this.tableMainList.find((item, index) => {
          if (item.right) {
            return item.right.name === id
          }
        })
        if (this.tableMain) {
          this.card = 3
          if (type === '1') {
            for (const key in this.tableMain.left.value) {
              for (const key1 in this.tableMain.left.value[key]) {
                if (this.tableMain.left.value[key][key1] && this.tableMain.right.value[key][key1] && this.tableMain.left.value[key][key1].value !== this.tableMain.right.value[key][key1].value) {
                  this.tableMain.right.value[key][key1].value = "<span style='color: red'>" + this.tableMain.right.value[key][key1].value + '</span>'
                  const obj = {
                    left: [],
                    right: []
                  }
                  for (const key2 in this.tableMain.left.value[key]) {
                    obj.left[this.tableMain.left.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.left.value[key][key2].address,
                      content: this.tableMain.left.value[key][key2].value
                    }
                  }
                  for (const key2 in this.tableMain.right.value[key]) {
                    obj.right[this.tableMain.right.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.right.value[key][key2].address,
                      content: this.tableMain.right.value[key][key2].value
                    }
                  }
                  if (this.tableList.length === 0) {
                    this.tableList.push(obj)
                  } else {
                    const arr1 = Object.keys(this.tableMain.left.value[key])
                    arr1.sort((a, b) => {
                      const numA = Number(a.slice(1))
                      const numB = Number(b.slice(1))
                      if (numA < numB) {
                        return -1
                      } else if (numA > numB) {
                        return 1
                      } else {
                        return 0
                      }
                    })
                    if (arr1[0] === this.tableList[this.tableList.length - 1].left[0].index) {
                      this.tableList.pop()
                      this.tableList.push(obj)
                    } else {
                      this.tableList.push(obj)
                    }
                  }
                  this.tableLeftList = Array.from({ length: this.tableList.length }, () => [])
                  this.tableRightList = Array.from({ length: this.tableList.length }, () => [])
                  this.tableList.forEach((item, index) => {
                    item.left.forEach((item1, index1) => {
                      if (!this.tableLeftList[index1]) {
                        this.tableLeftList[index1] = []
                      }
                      this.tableLeftList[index1][index] = item1.content
                    })
                    item.right.forEach((item1, index1) => {
                      if (!this.tableRightList[index1]) {
                        this.tableRightList[index1] = []
                      }
                      this.tableRightList[index1][index] = item1.content
                    })
                  })
                }
                if (this.tableMain.left.value[key][key1] && !this.tableMain.right.value[key][key1]) {
                  const obj = {
                    left: [],
                    right: []
                  }
                  for (const key2 in this.tableMain.left.value[key]) {
                    obj.left[this.tableMain.left.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.left.value[key][key2].address,
                      content: this.tableMain.left.value[key][key2].value
                    }
                  }
                  for (const key2 in this.tableMain.left.value[key]) {
                    obj.right[this.tableMain.left.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.left.value[key][key2].address,
                      content: ' '
                    }
                  }

                  if (this.tableList.length === 0) {
                    this.tableList.push(obj)
                  } else {
                    const arr1 = Object.keys(this.tableMain.left.value[key])
                    arr1.sort((a, b) => {
                      const numA = Number(a.slice(1))
                      const numB = Number(b.slice(1))
                      if (numA < numB) {
                        return -1
                      } else if (numA > numB) {
                        return 1
                      } else {
                        return 0
                      }
                    })
                    if (arr1[0] === this.tableList[this.tableList.length - 1].left[0].index) {
                      this.tableList.pop()
                      this.tableList.push(obj)
                    } else {
                      this.tableList.push(obj)
                    }
                    this.tableLeftList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableRightList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableList.forEach((item, index) => {
                      item.left.forEach((item1, index1) => {
                        if (!this.tableLeftList[index1]) {
                          this.tableLeftList[index1] = []
                        }
                        if (!this.tableRightList[index1]) {
                          this.tableRightList[index1] = []
                        }
                        this.tableLeftList[index1][index] = item1.content
                        this.tableRightList[index1][index] = ' '
                      })
                    })
                  }
                }
                if (!this.tableMain.left.value[key][key1] && this.tableMain.right.value[key][key1]) {
                  this.tableMain.right.value[key][key1].value = "<span style='color: red'>" + this.tableMain.right.value[key][key1].value + '</span>'
                  const obj = {
                    left: [],
                    right: []
                  }
                  for (const key2 in this.tableMain.right.value[key]) {
                    obj.right[this.tableMain.right.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.right.value[key][key2].address,
                      content: this.tableMain.right.value[key][key2].value
                    }
                  }
                  for (const key2 in this.tableMain.right.value[key]) {
                    obj.left[this.tableMain.right.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.right.value[key][key2].address,
                      content: ' '
                    }
                  }

                  if (this.tableList.length === 0) {
                    this.tableList.push(obj)
                  } else {
                    const arr1 = Object.keys(this.tableMain.right.value[key])
                    arr1.sort((a, b) => {
                      const numA = Number(a.slice(1))
                      const numB = Number(b.slice(1))
                      if (numA < numB) {
                        return -1
                      } else if (numA > numB) {
                        return 1
                      } else {
                        return 0
                      }
                    })
                    if (arr1[0] === this.tableList[this.tableList.length - 1].right[0].index) {
                      this.tableList.pop()
                      this.tableList.push(obj)
                    } else {
                      this.tableList.push(obj)
                    }
                    this.tableLeftList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableRightList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableList.forEach((item, index) => {
                      item.right.forEach((item1, index1) => {
                        if (!this.tableLeftList[index1]) {
                          this.tableLeftList[index1] = []
                        }
                        if (!this.tableRightList[index1]) {
                          this.tableRightList[index1] = []
                        }
                        this.tableRightList[index1][index] = item1.content
                        this.tableLeftList[index1][index] = ' '
                      })
                    })
                  }
                }
              }
            }
          } else {
            for (const key in this.tableMain.right.value) {
              for (const key1 in this.tableMain.right.value[key]) {
                if (!this.tableMain.left && this.tableMain.right.value[key][key1]) {
                  // this.tableMain.right.value[key][key1].value = "<span style='color: red'>" + this.tableMain.right.value[key][key1].value + '</span>'
                  const obj = {
                    left: [],
                    right: []
                  }
                  for (const key2 in this.tableMain.right.value[key]) {
                    obj.right[this.tableMain.right.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.right.value[key][key2].address,
                      content: this.tableMain.right.value[key][key2].value
                    }
                  }
                  for (const key2 in this.tableMain.right.value[key]) {
                    obj.left[this.tableMain.right.value[key][key2].rowNum - 1] = {
                      index: this.tableMain.right.value[key][key2].address,
                      content: ' '
                    }
                  }

                  if (this.tableList.length === 0) {
                    this.tableList.push(obj)
                  } else {
                    const arr1 = Object.keys(this.tableMain.right.value[key])
                    arr1.sort((a, b) => {
                      const numA = Number(a.slice(1))
                      const numB = Number(b.slice(1))
                      if (numA < numB) {
                        return -1
                      } else if (numA > numB) {
                        return 1
                      } else {
                        return 0
                      }
                    })
                    if (arr1[0] === this.tableList[this.tableList.length - 1].right[0].index) {
                      this.tableList.pop()
                      this.tableList.push(obj)
                    } else {
                      this.tableList.push(obj)
                    }
                    this.tableLeftList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableRightList = Array.from({ length: this.tableList.length }, () => [])
                    this.tableList.forEach((item, index) => {
                      item.right.forEach((item1, index1) => {
                        if (!this.tableLeftList[index1]) {
                          this.tableLeftList[index1] = []
                        }
                        if (!this.tableRightList[index1]) {
                          this.tableRightList[index1] = []
                        }
                        this.tableRightList[index1][index] = item1.content
                        this.tableLeftList[index1][index] = ' '
                      })
                    })
                  }
                }
              }
            }
          }
        }
      }
    },
    // 查找数据中不同的部分 1
    highlightDifferentPart(str1, str2) {
      let result = ''
      const maxLength = Math.max(str1 ? str1.length : 0, str2 ? str2.length : 0)
      if (str1 && str2) {
        for (let i = 0; i < maxLength; i++) {
          if (str1[i] === str2[i]) {
            result += str2[i]
          } else {
            result += "<span style='color: red'>" + (str2[i] || '') + '</span>'
          }
        }
      } else if (str1 && !str2) {
        // result = "<span style='color: red'>" + str1 + '</span>'
        result = ' '
      } else if (!str1 && !str2) {
        // result = "<span style='color: red'>" + str1 + '</span>'
        result = ' '
      } else {
        result = "<span style='color: red'>" + str2 + '</span>'
      }
      return result
    },
    async getVersionList() {
      await getRuleSetting(this.thirdSelectValue).then(async res => {
        this.initialData.forEach((item, index) => {
          if (item.dims[0].dimValue === this.firstSelectValue.key && item.dims[1].dimValue === this.secondSelectValue.key) {
            this.tableData1 = this.initialData[index].ruleCompareResults
            this.ruleMainList = this.initialData[index].ruleCompareResults
          }
        })
        if (!res.ruleSettings) {
          this.tableData1 = []
          return
        }
        this.tableData1 = this.tableData1.filter((item) => {
          return res.ruleSettings.map((items) => {
            if (item.right) {
              return items.ruleId === item.right.id ? items : undefined
            } else if (item.left) {
              return items.ruleId === item.left.id ? items : undefined
            }
          })
        })
      })
      const data = {
        decisionUrlId: this.thirdSelectValue,
        decisionTableName: ''
      }
      await GetDecisionTable(data).then(async res1 => {
        this.initialData.forEach((item, index) => {
          if (item.dims[0].dimValue === this.firstSelectValue.key && item.dims[1].dimValue === this.secondSelectValue.key) {
            this.initialData[index].tableCompareResults.forEach((item, index) => {
              res1.forEach((item1, index1) => {
                if (item.right && item.right.name === item1.decisionTableName) {
                  if (!this.tableData1.includes(item)) {
                    this.tableData1.push(item)
                  }
                } else if (item.left && item.left.name === item1.decisionTableName) {
                  if (!this.tableData1.includes(item)) {
                    this.tableData1.push(item)
                  }
                }
              })
            })
            this.tableMainList = this.initialData[index].tableCompareResults
          }
        })
      })
    },
    // 改变管理维度的值
    async changeSelect(item, index) {
      const temp = []
      this.decisionDimList.forEach((item1, index1) => {
        temp[item1.dimId] = this.form[index].key
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        flag: 1
      }
      const resData = {
        flag: data.flag,
        applicationId: data.applicationId,
        ...temp
      }
      await deciurlTabular(resData).then(res => {
        this.thirdSelectList = []
        res.forEach((item, index) => {
          const obj = {
            label: item.defaultPath,
            value: item.DECISION_URL_ID
          }
          this.thirdSelectList.push(obj)
        })
      })
    },
    // 查找决策路径 1
    async search() {
      const dimSettings = this.form.map((item) => {
        return {
          dimId: item.dimId,
          dimValue: item.key
        }
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        dimSettings,
        flag: 1
      }
      const temp = []
      data.dimSettings.forEach(item => {
        temp[item.dimId] = item.dimValue
      })
      const resData = {
        flag: data.flag,
        applicationId: data.applicationId,
        ...temp
      }
      await deciurlTabular(resData).then(res => {
        this.thirdSelectList = []
        res.forEach((item, index) => {
          const obj = {
            label: item.defaultPath,
            value: item.DECISION_URL_ID
          }
          this.thirdSelectList.push(obj)
        })
      })
    }
  }
}

</script>

  <style lang="scss" scoped  >
  .VersionComparisonIndex {
    height: 100%;
  }
  .app-container {
    height: 100%;
    background-color: white;
  }
.el-table .cell{
    padding-right:0 !important
  }
  .columnName {
    position: absolute;
    line-height: 50px;
    float: left;
    left: 50px;
  }
.leftHeader {
    width: 50%;
    background-color: rgb(239, 244, 248);
    display: inline-block;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-left: 1px solid rgb(239, 244, 248);
    border-top: 1px solid rgb(239, 244, 248);
    border-bottom: 1px solid rgb(239, 244, 248);
}
.rightHeader {
    width: 50%;
    line-height: 50px;
    height: 50px;
    background-color: rgb(239, 244, 248);
    display: inline-block;
    text-align: center;
    border: 1px solid rgb(239, 244, 248);
}
.header {
    position: relative;;
    width: 100%;
    height: 50px;
}
.ruleMain {
    position: relative;;
    width: 100%;
}
.ruleLeft {
    width: 50%;
    display: inline-block;
    text-align: center;
    text-align: left;
    padding: 30px;
}
.ruleRight {
    width: 50%;
    display: inline-block;
    text-align: center;
    text-align: left;
    padding: 30px;
    border-left: 1px solid rgb(239, 244, 248);
}
.centerText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    margin: auto;
}
.differenceList {
    position: relative;
    border-bottom: 1px solid rgb(239, 244, 248);
    border-left: 1px solid rgb(239, 244, 248);
    border-right: 1px solid rgb(239, 244, 248);
}
.introduce {
    position: relative;
    border-bottom: 1px solid rgb(239, 244, 248);
    border-left: 1px solid rgb(239, 244, 248);
    border-right: 1px solid rgb(239, 244, 248);
}
.introduceContent{
    border-bottom: 1px solid rgb(239, 244, 248);
    border-left: 1px solid rgb(239, 244, 248);
    border-right: 1px solid rgb(239, 244, 248);
}
.tableLeft {
  width:50%;
  display: inline-block;
    text-align: center;
}
.tableRight {
  width:50%;
  display: inline-block;
    text-align: center;
}
.tableMain {
  width:100%
}
.diff {
    color: red;
  }
  </style>
