<template>
  <div>
    <div class="app-container poc-model">
      <div class="title-style1">
        <i class="icon icon-1" />
        <h6>规则导入导出</h6> <br>
      </div>
      <div class="container1">
        <div class="main">
          <span class="title">规则导出</span>
          <div class="prompt">
            提示：请在系统空闲时段导出，系统支持导出规则用于备份或在其他环境导入使用，支持选择全量规则或指定规则导出。
          </div>
          <div class="search">
            <input
              v-model="inputValue"
              type="text"
              style="width: 400px;margin-right: 20px;height: 40px;outline: 0;"
              placeholder="请输入规则名称或编号查询"
            >
            <el-button type="primary" style="height: 40px;" @click="find">查询</el-button>
            <el-button type="primary" style="height: 40px;" @click="reset">重置</el-button>
          </div>

          <template>
            <el-table
              ref="multipleTable"
              :data="tableData"
              border
              height="300"
              tooltip-effect="dark"
              style="max-width: 95%;margin-left: 30px;"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
              />
              <el-table-column
                prop="ruleId"
                label="规则编号"
                show-overflow-tooltip
              />

              <el-table-column
                prop="ruleName"
                label="规则名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="path"
                label="决策库路径"
                show-overflow-tooltip
              />
              <el-table-column
                label="分类"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ ruleTypeList[scope.row.ruleType] }}</template>
              </el-table-column>
              >
              <el-table-column
                prop="createBy"
                label="创建者"
                show-overflow-tooltip
              />
              <el-table-column
                prop="updateBy"
                label="更改者"
                show-overflow-tooltip
              />
              <el-table-column
                prop="updateTime"
                label="更改时间"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ updata(scope.row.updateTime) }}</template>
              </el-table-column>>
              <el-table-column
                prop="address"
                label="当前运行状态"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{ statusList[scope.row.currentStatus] }}</template>
              </el-table-column>
              >
            </el-table>
          </template>
          <div style="margin-top: 20px" class="button">
            <el-radio v-model="exportType" label="0">导出规则数据</el-radio>
            <el-radio v-model="exportType" label="1">导出规则HTML</el-radio>
            <el-button type="primary" :loading="exportLoading" @click="startExport">导出</el-button>
          </div>
        </div>
        <div class="main">
          <div class="title">
            <span>规则导入</span>
            <el-button
              type="primary"
              style="float: right;margin-right: 30px;"
              @click="historyImport"
            >历史导入
            </el-button>
          </div>
          <div class="prompt">
            提示：请在系统空闲时段导入，导入的规则依赖BOM业务模型必须与当前决策应用BOM业务模型保持一致。可选择“仅导入规则定义”将规则导入决策库而不进行决策路径规则设置，之后需要自行前往
            规则设置，如未勾选，系统则默认导入决策库规则定义及决策路径设置并按导出时运行状态进行设置。
          </div>
          <div class="uploading">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              :action="action"
              multiple
              :file-list="form.fileList"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-exceed="handleExceed"
              accept=".zip"
              :data="otherData"
              :headers="headers"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">点击此处选择规则文件进行上传</div>
            </el-upload>
            <span>
              <el-radio v-model="radio" label="0" @click.native="handleRadioClick">仅导入规则定义</el-radio>
            </span>
            <span>
              <el-radio v-model="radio" label="1" @click.native="handleRadioClick">发布模式(当前决策应用下所有规则全部失效并以本次导入规则为最新规则)</el-radio>
            </span>
            <div v-if="radio === '1'" style="margin-top: 20px">
              <el-radio v-model="publishFlag" label="0">立即发布</el-radio>
              <el-radio v-model="publishFlag" label="1">定时发布
                <el-date-picker
                  v-if="publishFlag === '1'"
                  v-model="publishTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-radio>
            </div>
            <!-- <el-radio v-model="radio" label="0" @click.native.prevent="handleRadioClick">仅导入规则定义</el-radio>
            <el-radio v-model="radio" label="1" @click.native.prevent="handleRadioClick">发布模式(当前决策应用下所有规则全部失效并以本次导入规则为最新规则)</el-radio> -->
          </div>
          <div style="margin-top: 20px" class="button">
            <el-button type="primary" :plain="true" :loading="importLoading" @click="submitUpload">开始导入</el-button>
          </div>
        </div>
      </div>

    </div>
    <el-dialog
      title="历史导入记录"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        :data="tableData1"
        height="600"
        empty-text="暂无数据"
      >
        <el-table-column
          prop="createdDate"
          label="导入时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ updata(scope.row.createdDate) }}</template>
        </el-table-column>>
        <el-table-column
          prop="ruleCount"
          label="规则数量"
        />
        <el-table-column
          prop="createdBy"
          label="操作人"
        />
        <el-table-column
          prop="executeStatus"
          label="导入状态"
        >
          <template slot-scope="scope">
            <span :class="`import_status_`+scope.row.executeStatus">{{ executeStatusList[scope.row.executeStatus] }}</span>
          </template>
        </el-table-column>
        >
        <el-table-column
          label="异常信息"
          prop="failMessage"
          show-overflow-tooltip
        />
        <el-table-column
          label="详情"
        >
          <template slot-scope="scope">
            <span class="txt-btn" @click="importDetails(scope.row.dumpId)">
              详情明细
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导入明细"
      :visible.sync="detailDialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-table
        :data="details"
        height="500"
        empty-text="暂无数据"
      >
        <el-table-column
          prop="ruleId"
          label="规则ID"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ruleName"
          label="规则名称"
        />
        <el-table-column
          prop="resultStatus"
          label="导入状态"
        >
          <template slot-scope="scope">
            <span :class="`import_status_`+ scope.row.resultStatus">{{ executeStatusList[scope.row.resultStatus] }}</span>
          </template>
        </el-table-column>
        >
        <el-table-column
          prop="failMessage"
          label="异常信息"
          show-overflow-tooltip
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { postDownloadFile } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getRuleList, getImportResult, getImportResultDetails } from '@/api/systemManage/rule-manage'

export default {
  data() {
    return {
      headers: { 'adp-token': getToken() },
      form: {
        fileList: []
      },
      multipleSelection: [],
      tableData: [],
      statusList: { 0: '未发布', 2: '试运行', 1: '正式运行' },
      ruleTypeList: { 0: '规则', 1: '决策表' },
      file: null,
      inputValue: '',
      dialogVisible: false,
      tableData1: [],
      details: [],
      executeStatusList: { 0: '未执行', 1: '成功', 2: '失败', 3: '导入中' },
      detailDialogVisible: false,
      exportLoading: false,
      importLoading: false,
      radio: null,
      param1: null,
      param2: null,
      errorFlag: false,
      exportType: '0',
      lastRadio: 1,
      publishFlag: null,
      publishTime: null,
    }
  },
  computed: {
    action() {
      var data =
        {
          applicationId: this.$store.state.app.applicationId
        }
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + `/rule/import/${data.applicationId}`
      )
    },
    otherData() {
      if (this.radio === null) {
        return {
          definedFlag: 0,
          releaseFlag: 0
        }
      } else {
        const result = {
          definedFlag: this.radio === '0' ? 1 : 0,
          releaseFlag: this.radio === '0' ? 0 : 1
        };

        if (this.radio !== '0') {
          result.publishFlag = this.publishFlag;
          if (this.publishFlag !== '0') {
            result.publishTime = this.publishTime;
          }
        }
        return result;
      }
    }
  },
  // watch: {
  //   radio: {
  //     handler(value) {
  //       console.log(value)
  //     }
  //   }
  // },
  created() {
    this.getNeedRuleList()
  },
  methods: {
    // 再次点击取消选中
    handleRadioClick(value) {
      if (this.lastRadio === this.radio) {
        this.radio = null
      }
      this.lastRadio = this.radio
    },
    // 时间格式
    updata(val) {
      const originalTime = val
      const dateTime = new Date(originalTime)
      const year = dateTime.getFullYear()
      const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
      const day = ('0' + dateTime.getDate()).slice(-2)
      const hour = ('0' + dateTime.getHours()).slice(-2)
      const minute = ('0' + dateTime.getMinutes()).slice(-2)
      const second = ('0' + dateTime.getSeconds()).slice(-2)
      const formattedTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return formattedTime
    },
    // 弹框
    handleClose(done) {
      done()
    },
    // 查看历史导入结果
    async historyImport() {
      this.dialogVisible = true
      const data = {
        applicationId: this.$store.state.app.applicationId
      }
      if (!data) return
      await getImportResult(data).then(res => {
        this.tableData1 = res
        console.log(this.tableData1)
      })
    },
    // 获取列表
    async getNeedRuleList() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        searchVal: this.inputValue
      }
      if (!data) return
      await getRuleList(data).then(res => {
        this.tableData = res
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查询
    async find() {
      console.log(this.inputValue)
      const data = {
        applicationId: this.$store.state.app.applicationId,
        searchVal: this.inputValue
      }
      if (!data) return
      await getRuleList(data).then(res => {
        this.tableData = res
      })
    },
    // 重置
    reset() {
      this.inputValue = ''
      this.getNeedRuleList()
    },
    // 导出
    startExport() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择需要导出的规则数据')
        return false
      }
      this.exportLoading = true
      const ruleIds = []

      this.multipleSelection.forEach((item, index) => {
        ruleIds.push(item.ruleId)
      })
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}.${month}.${day}`
      const ruleNames = formattedDate + (this.exportType === '1' ? '.html' : '.zip')
      postDownloadFile(
        `/rule/export/${this.$store.state.app.applicationId}`,
        { ruleIds: ruleIds, exportHtml: this.exportType },
        ruleNames
      ).then(() => {
        this.exportLoading = false
      })
    },
    // 导入
    beforeUpload(file) {
      console.log(file.type)
      const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed'
      if (!isZip) {
        this.$message.error(this.$t('decisionTable.onlyUploadZip'))
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error(this.$t('decisionTable.img'))
      } else {
        this.importLoading = true
      }
      return isLt10M
    },
    async uploadSuccess(res, file) {
      if (res.success) {
        this.$message.success(this.$t('importRule.uploadSuccess'))
      } else {
        this.$message.error(res.errMsg)
        this.form.fileList = []
      }
      this.importLoading = false
    },
    uploadError(res) {
      this.importLoading = false
      this.$message.error(res.errMsg)
    },
    handleExceed() {
      this.$message.warning('每次只允许上传一个文件')
    },
    submitUpload() {
      // if (this.radio === null) {
      //   return this.$message.warning('导入失败，请选择导入条件')
      // }
      if (this.radio === '1' && this.publishFlag === '1' && !this.publishTime) {
        this.$message.warning('请选择发布时间')
        return
      }
      this.$refs.upload.submit()
    },
    importDetails(dumpId) {
      getImportResultDetails(dumpId).then(res => {
        this.details = res
        this.detailDialogVisible = true
      })
    },

    sub(val) {
      if (val) {
        return val.substring(0, 100)
      }
      return ''
    }
  }
}
</script>
<style scoped>
.app-container poc-model {
  height: 100%;
}

.container1 {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  border-radius: 6px;
}

.main {
  /*background-color: rgb(242, 248, 249);*/
  margin: 20px;
  overflow: visible;
  border-radius: 6px;
  border: solid 1px #e6e6e6;
  box-shadow: 0px 6px 12px 6px rgb(4 50 130 / 4%);
}

.title {
  display: block;
  font-size: 18px;
  padding-top: 30px;
  margin-left: 30px;
  color: #60769c;
}

.prompt {
  background-color: #eef1f4;
  padding: 20px 20px;
  border-radius: 6px;
  margin: 20px 30px 10px;
}

.search {
  float: right;
  margin-right: 30px;
  margin-bottom: 20px;
}

.button {
  text-align: center;
  display: block;
  margin: 0, auto;
  padding-bottom: 30px;
}

.uploading {
  text-align: center;
  margin: 0 auto;
  width: 100%;
}

.txt-btn {
  color: #0079FF;
  cursor: pointer;
}
.import_status_1{
  color: #55a532;
}
.import_status_2{
  color: #d41e1e;
}
.import_status_3{
  color: #3394ff;
}
</style>
