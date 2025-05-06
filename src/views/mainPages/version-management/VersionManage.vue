<template>
  <div class="version-management">
    <div class="app-container">
      <el-row :gutter="15" type="flex">
        <el-col :span="16">
          <!-- 版本管理 -->
          <el-card class="head-card version-card">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('versionList.versionManagement') }}</span>
            </div>
            <div class="content">
              <el-form ref="form" :model="form" :label-width="labelWidth.labelWidth">
                <el-col :span="11">
                  <el-form-item
                    :label="$t('bomCreat.bomVersion')"
                    prop="name"
                    :rules="[
                      {
                        required: true,
                        message: $t('versionList.enterVersion'),
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="form.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="22">
                  <el-form-item
                    :label="$t('versionList.imprint')"
                    prop="desc"
                    :rules="[
                      {
                        required: true,
                        message: $t('versionList.enterImprint'),
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input v-model="form.desc" type="textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="22">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="createVersion"
                    >{{ $t('versionList.newVersion') }}</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- 当前决策应用 -->
          <el-card class="head-card version-card">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('versionList.decisionApp') }}</span>
            </div>
            <div class="content">
              <div class="current-decision-info">
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> {{ $t('bomCreat.appName') }}：</span>
                  <span class="val">
                    {{ applicationName }}</span>
                </div>
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> {{ $t('versionList.applicationId') }}：</span>
                  <span class="val"> {{ applicationId }}</span>
                </div>
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> 当前版本：</span>
                  <span class="val"> {{ presentVersion }}</span>
                </div>
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> {{ $t('newapp.descriptor') }}：</span>
                  <span class="val" style="min-height: 100px">
                    {{ applicationRemake }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col class="mt-15">
          <!-- 版本列表 -->
          <el-card class="head-card version-card">
            <div slot="header" class="card-head-style1 clearfix">
              <span>{{ $t('versionList.versionList') }}</span>
            </div>
            <div class="content">
              <div class="flex-wrap flex-right flex-align-items-center mb-15">
                <el-button
                  class="btn-border mini mr-15"
                  @click="compare"
                >{{ $t('versionList.compare') }}</el-button>
                <el-input
                  v-model="search"
                  clearable
                  class="input-background search"
                  :placeholder="$t('ruleList.searchEnter')"
                  @change="handleSearch"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search search-icon"
                    @click="handleSearch"
                  />
                </el-input>
              </div>
              <el-table
                ref="multipleTable"
                :empty-text="$t('common.noData')"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                  background: '#EFF4F8',
                  color: '#60769C',
                  'font-weight': 'normal'
                }"
                :cell-style="{ color: '#435475' }"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column class="DisableSelection" prop="versionNo" :label="$t('bomCreat.bomVersion')" />
                <el-table-column prop="comment" label="版本说明" />
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <div>
                      {{ statusList[scope.row.status] }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createdBy" label="创建人" />
                <el-table-column prop="createdDate" label="版本时间" />
                <el-table-column style="margin-left: 50px;" label="操作" class="offset-column">
                  <template slot-scope="scope">
                    <el-popconfirm
                      title="确认是否还原"
                      @onConfirm="Restore(scope.row.id)"
                    >
                      <el-button slot="reference" :disabled="scope.row.status === 4" type="text">还原</el-button>
                    </el-popconfirm>
                    <el-popconfirm
                      style="margin-left: 15px;"
                      title="确认是否删除"
                      @onConfirm="deleteVersion(scope.row.id)"
                    >
                      <el-button slot="reference" type="text">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <div class="text-center mt-30">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="pageTotal"
                  :page-size="pageSize"
                  :current-page="pageNum"
                  @current-change="PageCurrentChange"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog
        title="版本差异"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        :before-close="closeFn"
        width="90%"
        style="z-index: 98;"
      >
        <div class="VersionComparisonIndex well" style="background-color: white;">
          <div class="app-container">
            <div v-if="card===1" style="height: 100%;">
              <div slot="header" class="card-head-style1 clearfix">
                <span>管理维度 - 精确匹配</span>
              </div>
              <div class="managementDimension">
                <div style="margin-bottom: 50px;margin-top: 10px;">
                  <span v-for="(item,index) in decisionDimList" :key="index">
                    <span style="margin-right: 10px;">{{ item.dimName }}</span>
                    <el-select
                      v-model="form1[index]"
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
                <div slot="header" class="card-head-style1 clearfix" style="margin-bottom: 10px;">
                  <span>决策路径 - 精确匹配</span>
                </div>
                <span style="margin-right: 10px;margin-top: 10px;">默认路径</span>
                <el-select
                  v-model="thirdSelectValue"
                  placeholder="请选择"
                  @change="getVersionList"
                >
                  <el-option
                    v-if="thirdSelectList.length===0"
                    label="全部"
                    :value="allPaths"
                  />
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
                  <span class="leftHeader">{{ firstVersionName }}</span>
                  <span class="rightHeader">{{ secondVersionName }}</span>
                  <div
                    v-if="thirdSelectValue && tableData1.length === 0"
                    style="width: 100%;
                    text-align: center;
                    border: 1px solid rgb(239, 244, 248);"
                    class="ruleLeft"
                  >
                    版本之间无数据差异
                  </div>
                </div>
                <div v-for="(item,index) in tableData1" :key="index" class="differenceList">
                  <span v-if="item.type==='3'" class="ruleLeft">
                    {{ item.left? item.left.id : ' ' }} {{ item.left? item.left.name : ' ' }}
                  </span>
                  <span v-if="item.type==='1'" class="ruleLeft" style="cursor: pointer;" @click="ViewDetails(item.left.id || item.left.name,item.type)">
                    {{ item.left? item.left.id : ' ' }} {{ item.left? item.left.name : ' ' }}
                  </span>
                  <span v-if="item.type==='2'" class="ruleLeft">
                    {{ item.left? item.left.id : ' ' }} {{ item.left? item.left.name : ' ' }}
                  </span>
                  <span v-if="item.type==='2'" type="text" style="cursor: pointer;" class="ruleRight" @click="ViewDetails(item.right.id || item.right.name,item.type)">
                    {{ item.right? item.right.id:' ' }} {{ item.right? item.right.name : ' ' }}
                  </span>
                  <span v-if="item.type==='1'" type="text" style="cursor: pointer;" class="ruleRight" @click="ViewDetails(item.right.id || item.right.name,item.type)">
                    {{ item.right? item.right.id:' ' }} {{ item.right? item.right.name : ' ' }}
                  </span>
                  <span v-if="item.type==='3'" class="ruleRight" style="text-decoration: line-through;color: gray;">
                    {{ item.left? item.left.id:' ' }} {{ item.left? item.left.name : ' ' }}
                  </span>
                  <span
                    v-if="item.type==='1'||item.type==='2'"
                    class="centerText"
                    :style="{ backgroundColor: item.type === '1' ? 'rgba(236, 150, 56, 1)' : (item.type === '2' ? 'rgba(89, 129, 86, 1)' : (item.type === '3' ? 'rgba(196, 201, 211, 1)' : '')) }"
                    style="color: white;padding: 8px;border-radius: 20%;cursor: pointer;"
                    @click="ViewDetails(item.right.id || item.right.name,item.type)"
                  >{{ conterTxt[item.type] }}</span>
                  <span
                    v-if="item.type==='3'"
                    class="centerText"
                    :style="{ backgroundColor: item.type === '1' ? 'rgba(236, 150, 56, 1)' : (item.type === '2' ? 'rgba(89, 129, 86, 1)' : (item.type === '3' ? 'rgba(196, 201, 211, 1)' : '')) }"
                    style="color: white;padding: 8px;border-radius: 20%;"
                  >{{ conterTxt[item.type] }}</span>
                </div>
                <!-- <div v-if="!tableData">
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
                  <span class="leftHeader">{{ firstVersionName }}</span>
                  <span class="rightHeader">{{ secondVersionName }}</span>
                </div>
                <div class="ruleMain">
                  <div class="introduce">
                    <span class="centerText">预定义</span>
                    <span class="ruleLeft">&nbsp;</span>
                    <span class="ruleRight" style="border: none;">&nbsp;</span>
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
                    <span class="ruleRight" style="border: none;">&nbsp;</span>
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
                    <span class="ruleRight" style="border: none;">&nbsp;</span>
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
                  <span class="leftHeader">{{ firstVersionName }}
                  </span>
                  <span class="rightHeader">{{ secondVersionName }}
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
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { CompareVersion } from '@/api/mainPages/version-management'
import { getDimCodeData } from '@/api/base'
import { deciurlTabular, deciurlField } from '@/api/mainPages/deci'
import { getRuleSetting } from '@/api/systemManage/rule-manage'
import { GetDecisionTable } from '@/api/mainPages/decision-table'
import { decisionDim } from '@/api/mainPages/decision'
import {
  DeleteVersion1List,
  CreateVersion,
  GetVersion1List,
  RestoreVersion,
  GetPresentVersion
} from '@/api/mainPages/version-management'
import { getDecisionApplication } from '@/api/mainPages/decision'
import { downloadFile } from '@/utils/utils'
export default {
  name: 'VersionManagement',
  data() {
    return {
      lang: this.$store.state.settings.lang,
      form: {},
      tableData: [],
      search: '',
      pageNum: 1,
      pageTotal: 10,
      pageSize: 10,
      multipleSelection: [],
      dialogVisible: false,
      statusList: { 0: '初始化', 1: '版本生成中', 2: '正常', 3: '异常', 4: '还原中' },
      tableData1: [],
      card: 1,
      mainVersionId: null,
      otherVersionId: null,
      firstCodeService: null,
      secondCodeService: null,
      firstSelectList: [],
      secondSelectList: [],
      firstSelectValue: null,
      secondSelectValue: null,
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
      form1: [],
      firstVersionName: null,
      secondVersionName: null,
      includeAll: 1,
      searchLoading: null,
      presentVersion: null,
      DisableSelection: true,
      applicationName: null,
      applicationId: null,
      applicationRemake: null,
      allPaths: 'ALL'
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? '144px' : '100px'
      }
    }
  },
  watch: {
    search(newVal) {
      if (!newVal) {
        this.GetVersionList()
      }
    }
  },
  created() {
    this.GetVersionList()
    this.GetPresentVersion()
    this.getDecisionApplication()
    this.GetDecisionDim()
  },
  methods: {
    // 关闭前调用
    closeFn() {
      this.thirdSelectValue = null
      this.form1 = []
      this.dialogVisible = false
    },
    // 查询维度
    GetDecisionDim() {
      decisionDim(this.$store.state.app.applicationId).then(res => {
        this.decisionDimList = res
        // this.form1 = this.decisionDimList.map((item) => {
        //   return {
        //     dimId: item.dimId,
        //     dimValue: 'ALL',
        //     key: 'ALL',
        //     value: this.$t('common.all')
        //   }
        // })
      })
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.GetVersionList()
    },
    // 获取决策应用的信息
    getDecisionApplication() {
      getDecisionApplication(this.$store.state.app.applicationId).then(res => {
        this.applicationId = res.applicationId
        this.applicationName = res.applicationName
        this.applicationRemake = res.remark
      })
    },
    // 获取版本
    GetPresentVersion() {
      GetPresentVersion(this.$store.state.app.applicationId).then(res => {
        if (res && res.versionNo) {
          this.presentVersion = res.versionNo
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 还原
    Restore(id) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        versionId: id
      }
      RestoreVersion(data).then(res => {
        this.$message({
          message: '还原任务创建成功，请通过规则导入->历史导入功能查询',
          type: 'success'
        })
        this.GetPresentVersion()
        this.GetVersionList()
      })
    },
    // 获取数据
    GetVersionList(versionNumber) {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        versionId: this.search,
        applicationId: this.$store.state.app.applicationId
      }

      GetVersion1List(data).then(res => {
        this.pageTotal = res.total
        // const tableData = res.list.map(item => {
        //   return {
        //     name: item.versionNumber,
        //     datetime: item.versionDate,
        //     desc: item.editionStatement,
        //     versionMgtId: item.versionMgtId
        //   }
        // })
        if (!Array.isArray(res.list)) {
          Object.values(res.list)
          this.tableData = []
          this.tableData.push(res.list)
        } else {
          this.tableData = res.list
        }
        this.tableData.forEach((item, index) => {
          const originalTime = item.createdDate
          const date = new Date(originalTime)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          item.createdDate = formattedTime
          const originalTime1 = item.updatedDate
          const date1 = new Date(originalTime1)
          const year1 = date1.getFullYear()
          const month1 = String(date.getMonth() + 1).padStart(2, '0')
          const day1 = String(date.getDate()).padStart(2, '0')
          const hours1 = String(date.getHours()).padStart(2, '0')
          const minutes1 = String(date.getMinutes()).padStart(2, '0')
          const seconds1 = String(date.getSeconds()).padStart(2, '0')
          const formattedTime1 = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}`
          item.updatedDate = formattedTime1
        })
        // Cookies.set('currentVersion', this.tableData[0].versionNo)
        // this.$forceUpdate()
      })
    },
    // 创建版本
    createVersion() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            applicationId: this.$store.state.app.applicationId,
            comment: this.form.desc,
            versionNo: this.form.name
          }
          CreateVersion(data).then((res) => {
            // 新增完成后查询版本
            this.pageNum = 1
            this.GetVersionList()
            this.GetPresentVersion()
          })
        } else {
          return false
        }
      })
    },
    // 删除版本
    deleteVersion(id) {
      const data = {
        versionId: id,
        applicationId: this.$store.state.app.applicationId
      }
      DeleteVersion1List(data).then(res => {
        this.GetVersionList()
        this.GetPresentVersion()
      })
    },
    // 下载版本包
    downloadVersion(id) {
      //   this.exportLoading = true
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}.${month}.${day}`
      const ruleNames = formattedDate + (this.exportType === '1' ? '.html' : '.zip')
      downloadFile(
        `/version/${this.$store.state.app.applicationId}/${id}/pack`,
        // { applicationId: this.$store.state.app.applicationId, versionId: id },
        null,
        ruleNames
      ).then(() => {
        // this.exportLoading = false
      })
    },
    getFormatVersionID() {
      const oDate1 = new Date(this.multipleSelection[0].createdDate)
      const oDate2 = new Date(this.multipleSelection[1].createdDate)
      const obj = {
        mainVersionId: null,
        otherVersionId: null
      }
      if (oDate1.getTime() > oDate2.getTime()) {
        obj.mainVersionId = this.multipleSelection[1].id
        obj.otherVersionId = this.multipleSelection[0].id
      } else {
        obj.mainVersionId = this.multipleSelection[0].id
        obj.otherVersionId = this.multipleSelection[1].id
      }

      return obj
    },
    compare() {
      if (this.multipleSelection.length !== 2) {
        return this.$message.error(this.$t('versionList.versionNum'))
      }
      const { mainVersionId, otherVersionId } = this.getFormatVersionID()

      // this.$router.push({
      //   path: '/version/Compare',
      //   query: {
      //     mainVersionId,
      //     otherVersionId
      //   }
      // })
      // this.dialogVisible = true
      this.card = 1
      this.tableData1 = []
      this.getCompareVersion(mainVersionId, otherVersionId)
    },
    handleSearch() {
      this.GetVersionList()
    },
    // 比较差异时的方法
    // 返回列表 1
    ReturnList() {
      this.card = 1
    },
    // 获取数据 1
    async getCompareVersion(mainVersionId, otherVersionId) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        mainVersionId,
        otherVersionId
      }
      await CompareVersion(data).then(async res => {
        const dimMapKeys = Object.keys(res.dimMap)
        dimMapKeys.forEach((item, index, arr) => {
          arr[index] = item + 'Service'
        })
        this.decisionDimList.forEach(obj => {
          const codeServiceValue = obj.codeService
          if (dimMapKeys.includes(codeServiceValue)) {
            this.dialogVisible = true
          } else {
            this.$message.warning('版本中管理维度下未设置规则，无版本差异。')
            this.dialogVisible = false
          }
        })
        this.initialData = res.compareResultList
        this.firstVersionName = res.leftVersionNo
        this.secondVersionName = res.rightVersionNo

        const codeService = this.decisionDimList.map((item) => {
          return item.codeService
        })
        this.getDimCodeData(codeService.toString())
        res.compareResultList.forEach((item, index) => {
          item.ruleCompareResults.forEach((item1, index1) => {
            this.ruleMainList.push(item1)
          })
          item.tableCompareResults.forEach((item2, index2) => {
            this.tableMainList.push(item2)
          })
        })
        this.tableList = []
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
        flag: this.includeAll,
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
        this.tableData1 = this.initialData.filter((item, index) => {
          return item.dims.every((item1, index1) => {
            return item1.dimValue === this.form1[index1].key
          })
        }).flatMap(item => item.ruleCompareResults)
        this.ruleMainList = [...this.tableData1]
        if (!res.ruleSettings) {
          this.tableData1 = []
          return
        }
        this.tableData1 = this.tableData1.filter((item) => {
          const isMatched = res.ruleSettings.some((items) => {
            if (item.right) {
              return items.ruleId === item.right.id
            } else if (item.left) {
              return items.ruleId === item.left.id
            }
          })
          if (isMatched) {
            return true // 保留满足条件的元素
          }
          return false // 删除不满足条件的元素
        })
      })
      const data = {
        decisionUrlId: this.thirdSelectValue,
        decisionTableName: ''
      }
      await GetDecisionTable(data).then(async res1 => {
        this.initialData.forEach((item, index) => {
          // this.initialData[index].tableCompareResults.forEach((item, index) => {
          //   res1.forEach((item1, index1) => {
          //     if (item.right && item.right.name === item1.decisionTableName) {
          //       if (!this.tableData1.includes(item)) {
          //         this.tableData1.push(item)
          //       }
          //     } else if (item.left && item.left.name === item1.decisionTableName) {
          //       if (!this.tableData1.includes(item)) {
          //         this.tableData1.push(item)
          //       }
          //     }
          //   })
          // })
          // this.tableMainList = this.initialData[index].tableCompareResults
          let flag = false
          item.dims.forEach((item1, index1) => {
            if (item1.dimValue === this.form1[index1].key) {
              flag = true
            } else {
              flag = false
              return
            }
          })
          if (flag) {
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
            // this.tableMainList = this.initialData[index].tableCompareResults
          }
        })
      })
    },
    // 改变管理维度的值
    async changeSelect(item, index) {
      const temp = []
      this.decisionDimList.forEach((item1, index1) => {
        temp[item1.dimId] = this.form1[index1].key
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        flag: this.includeAll
      }
      const resData = {
        flag: data.flag,
        applicationId: data.applicationId,
        ...temp
      }
      this.thirdSelectValue = null
      this.tableData1 = []
      await deciurlTabular(resData).then(async res => {
        this.thirdSelectList = []
        res.forEach((item, index) => {
          const obj = {
            label: item.defaultPath,
            value: item.DECISION_URL_ID
          }
          this.thirdSelectList.push(obj)
        })
        const obj = res.find((item, index) => {
          return item.defaultPath === '全部'
        })
        if (obj) {
          this.allPaths = obj.DECISION_URL_ID
          this.thirdSelectValue = obj.DECISION_URL_ID
        }
        if (this.thirdSelectList.length === 0) {
          this.allPaths = null
          this.thirdSelectValue = null
        }
        await this.getVersionList()
      })
    },
    // 查找决策路径 1
    async search1() {
      const dimSettings = this.form1.map((item) => {
        return {
          dimId: item.dimId,
          dimValue: item.key
        }
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        dimSettings,
        flag: this.includeAll
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
        const obj = res.find((item, index) => {
          return item.defaultPath === '全部'
        })
        if (obj) {
          this.allPaths = obj.DECISION_URL_ID
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .el-table th > .cell:last-child {
    margin-left: 40px;
  }
  .version-management {
    .version-card {
      height: 100%;
    }
    .search-icon {
      cursor: pointer;
    }
    .search {
      width: 200px;
    }
    .current-decision-info {
      .item {
        margin-bottom: 15px;
        display: flex;
        // align-items: center;
        .name {
          width: 100px;
          margin-top: 5px;
        }
        .enWidth{
          width: 153px;
          margin-top: 5px;
        }
        .val {
          display: block;
          flex: 1;
          padding: 5px 12px;
          background: #f5f5f5;
          word-break: break-word;
        }
      }
    }
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
.el-message {
  z-index: 9999;
}
.diff {
    color: red;
  }
  .offset-column {
  padding-left: 50px;
}
  ::v-deep .el-table__header-wrapper .el-checkbox {
  // display: none;//设置不成功，页面卡顿
  visibility: hidden;
}
  </style>
