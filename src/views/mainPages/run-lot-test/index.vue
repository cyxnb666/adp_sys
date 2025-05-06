<template>
  <div class="manage app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>跑批测试</h6>
    </div>
    <el-card class="box-card mt-30">
      <div slot="header" class="card-head-style1 clearfix">
        <span>跑批测试</span>
      </div>
      <div class="text-left flex-wrap flex-between">
        <div class="flex-1 flex-wrap">
          <!-- <el-date-picker
            v-model="timeValue"
            type="datetime"
            placeholder="选择日期时间"
            @change="getTime"
          /> -->
          <el-button class="mr-15" type="primary" size="mini" @click="dialogVisible = true">同步数据</el-button>
          <el-button class="mr-15" size="mini" type="primary" @click="runDialogVisible = true">开始跑批</el-button>
          <el-button class="mr-15" size="mini" type="primary" @click="findProgress">查看跑批进度</el-button>
          <el-button size="mini" type="warning" icon="el-icon-download" @click="downloadUserTemplate">导出数据</el-button>
          <el-button class="mr-15" size="mini" type="primary" @click="filterDialogVisible = true">筛选</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width:100%"
          :empty-text="$t('common.noData')"
          maxHeight="580"
          class="mt-20"
          stripe
          border
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
        >
          <el-table-column
            prop="batchResultId"
            label="id"
            width="60"
          />
          <el-table-column
            prop="field1"
            label="车架号"
          />
          <el-table-column
            prop="requestInitiatedTime"
            label="报价日期"
          />
          <el-table-column
            prop="field2"
            label="品牌"
          />
          <el-table-column
            prop="field3"
            label="渠道"
          />
          <el-table-column
            prop="field4"
            label="新旧"
          />
          <el-table-column
            prop="field5"
            label="车系"
          />
          <el-table-column
            prop="field6"
            label="地区"
          />
          <el-table-column
            prop="field7"
            label="鼎然分"
          />
          <el-table-column
            prop="field8"
            label="过户车标识"
            width="100"
          />
          <el-table-column
            prop="field9"
            label="车主年龄"
          />
          <el-table-column
            prop="field10"
            label="使用性质"
          />
          <el-table-column
            prop="field11"
            label="车龄"
          />
          <el-table-column
            prop="field12"
            label="NCD"
          />
          <!-- <el-table-column
            prop="originalParam"
            label="核心系统入参"
          >
            <template slot-scope="scope">
              <el-tooltip trigger="hover" placement="top">
                <div slot="content" style="width: 300px;"> {{ scope.row.originalParam }}</div>
                <div class="value" style="margin-left: auto">{{ scope.row.originalParam&& scope.row.originalParam.length>20? scope.row.originalParam.slice(0,20) + '...' : scope.row.originalParam }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="requestParam"
            label="系统入参"
          >
            <template slot-scope="scope">
              <el-tooltip trigger="hover" placement="top">
                <div slot="content" style="width: 300px;"> {{ scope.row.requestParam }}</div>
                <div class="value" style="margin-left: auto">{{ scope.row.requestParam&& scope.row.requestParam.length>20? scope.row.requestParam.slice(0,20) + '...' : scope.row.requestParam }}</div>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="originalResult"
            label="核心系统结果"
            fixed="right"
            width="105"
          />
<!--          <el-table-column-->
<!--            prop="currentResult"-->
<!--            label="艾融系统结果"-->
<!--            fixed="right"-->
<!--            width="105"-->
<!--          />-->
          <el-table-column
            prop="isConsistent"
            label="对比结果"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <span :style="{ color: row.isConsistent === 'Y' ? 'green': 'red' }">
                {{ row.isConsistent === 'Y' ? '一致' : '不一致' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt-20"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="currentChange"
        />
      </div>
    </el-card>
    <el-dialog
      title="选择时间"
      :visible.sync="dialogVisible"
      width="550px"
    >
      <div style="display: flex;">
        <el-select v-model="typeValue" placeholder="请选择" style="width: 150px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="synchronizationTime"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          style="height: initial; line-height: initial;"
          />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="synchronousData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择时间"
      :visible.sync="runDialogVisible"
      width="30%"
    >
      <el-date-picker
        v-model="runTime"
        type="datetimerange"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="runDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="startRunning">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="progressDialogVisible" title="跑批进度" width="30%">
      <div class="progress-container">
        <el-progress :text-inside="true" :percentage="progress" :stroke-width="20" />

        <div class="progress-info">
          <p>已完成: {{ completed }} / 总数: {{ total }}</p>
          <p>未完成: {{ uncompleted }}</p>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="筛选条件"
      :visible.sync="filterDialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="form" label-width="150px" class="demo-ruleForm">
        <el-form-item label="车架号" prop="field1">
          <el-input v-model="form.field1" />
        </el-form-item>
        <el-form-item label="品牌" prop="field2">
          <el-input v-model="form.field2" />
        </el-form-item>
        <el-form-item label="三级渠道" prop="field3">
          <el-select v-model="form.field3" placeholder="请选择">
            <el-option
              v-for="item in chaSubTypeList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="新旧车标识" prop="field4">
          <el-radio v-model="form.field4" label="1">新车</el-radio>
          <el-radio v-model="form.field4" label="0">旧车</el-radio>
        </el-form-item>
        <el-form-item label="车系" prop="field5">
          <el-input v-model="form.field5" />
        </el-form-item>
        <el-form-item label="二级机构（地区）" prop="field6">
          <el-select v-model="form.field6" placeholder="请选择">
            <el-option
              v-for="item in secondarycomList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="鼎然分" prop="field7">
          <el-input v-model="form.field7" />
        </el-form-item>
        <el-form-item label="过户车标识" prop="field8">
          <el-radio v-model="form.field8" label="1">过户</el-radio>
          <el-radio v-model="form.field8" label="0">不过户</el-radio>
        </el-form-item>
        <el-form-item label="车龄" prop="field9">
          <el-input v-model="form.field9" />
        </el-form-item>
        <el-form-item label="报价日期">
          <el-date-picker
            v-model="dataTime"
            style="width: 300px;"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { UserStatus, UserUpdateRoles, getCodeValue, getBatchResult, arBatchRun, getBatchResultSync, getSchedule } from '@/api/systemManage/user-manage'
import { postDownloadFile } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { validateAccount, emailValue } from '@/utils/validate'

export default {
  data() {
    const baseURL = this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API
    const today = new Date().toLocaleDateString().replace(/\//g, '-')
// !S9D/g*$
    return {
      validateAccount,
      emailValue,
      loading: false,
      baseURL,
      headers: { 'adp-token': getToken() },
      pageNum: 1,
      pageSize: 10,
      total: 10,
      tableData: [],
      centerDialogVisible: false,
      dialogFormVisible: false,
      showPermissionDialog: false,
      showPwd: '',
      searchText: '',
      form: {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
        field9: '',
        start: null,
        end: null
      },
      formModify: { roleIdList: [], userId: null },
      nameRules: [
        { required: true, validator: validateAccount, trigger: 'blur' }],
      fileLists: [],
      lang: this.$store.state.settings.lang,
      requestInitiatedTime: null,
      timeValue: null,
      dialogVisible: false,
      synchronizationTime: [today + ' 00:00:00', today + ' 23:59:59'],
      runDialogVisible: false,
      runTime: null,
      options: [{
        value: '1',
        label: '历史数据'
      }, {
        value: '2',
        label: '同步实时数据'
      }],
      typeValue: '1',
      progress: 0,
      completed: 0,
      untotal: 0,
      uncompleted: 0,
      progressDialogVisible: false,
      filterDialogVisible: false,
      dataTime: [],
      secondarycomList: [],
      chaSubTypeList: [],
      progressColor: '#d3d3d3' // 初始颜色为灰色
    }
  },
  computed: {
    width() {
      return {
        width: this.lang === 'en' ? '468' : ''
      }
    }
  },
  created() {
    this.getList()
    this.getCodeValue()
  },
  beforeDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }
  },
  methods: {
    getCodeValue() {
      const data = {
        applicationId: this.$store.state.app.applicationId
      }
      getCodeValue(data).then(res => {
        this.secondarycomList = res.secondaryCom
        this.chaSubTypeList = res.chaSubType
        console.log(this.chaSubTypeList)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          // this.$refs['ruleForm'].resetFields()
          // this.dataTime = []
        })
        .catch(_ => {})
    },
    // 过滤
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.getList()
      })
    },
    // 重置过滤
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataTime = []
    },
    // 查看跑批进度
    findProgress() {
      this.progressDialogVisible = true
      const applicationId = encodeURIComponent(this.$store.state.app.applicationId)
      getSchedule(applicationId).then(res => {
        this.completed = res.completed
        this.total = res.total
        this.uncompleted = this.total - this.completed
        this.progress = Math.round((this.completed / this.total) * 100) || 0
        if (this.progress >= 100) {
          clearInterval(this.progressInterval)
        }
      })
      this.progressInterval = setInterval(() => {
        getSchedule(applicationId).then(res => {
          this.completed = res.completed
          this.total = res.total
          this.uncompleted = this.total - this.completed
          this.progress = Math.round((this.completed / this.total) * 100)

          if (this.progress >= 100) {
            clearInterval(this.progressInterval)
          }
        })
      }, 10000)
    },
    getTime() {
      this.requestInitiatedTime = this.timeValue.getTime()
      this.getList()
    },
    searchEnter() {
      this.getList()
    },
    // 获取用户列表
    getList() {
      this.form.start = this.dataTime[0] || null
      this.form.end = this.dataTime[1] || null
      const form = this.form
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        condition: {
          applicationId: this.$store.state.app.applicationId,
          ...form
        }
      }
      getBatchResult(data, true).then(res => {
        res = res.resp
        if (res) {
          this.tableData = res.list
          this.filterDialogVisible = false
          // const getRandomInteger = (min, max) => {
          //   return ~~(Math.random() * res.pageSize)// 包含min，包含max
          // }

          // this.tableData = res.list.map((v, i) => {
          //   console.log(getRandomInteger(0, 10))
          //   v.compareResult = getRandomInteger(0, 10) === i ? 'N' : 'Y'
          //   return v
          // })
          // console.log(res)
          this.total = res.total
        }
      })
    },
    // 拿到服务器返回的数据
    handleUploadSuccess(response) {
      this.$loading().close()
      if (!response.success) {
        this.uploadName = ''
        this.$message({
          showClose: true,
          message: response.errMsg,
          type: 'error',
          offset: 100
        })
      } else {
        this.$message.success(this.$t('bomCreat.uploadSuccess'))
        this.getUserList()
      }
    },
    // 修改状态：// D-删除、L-锁定、A-激活
    async UserStatus(userId, userStatus) {
      const data = {
        userId,
        userStatus
      }
      await UserStatus(data)
      this.getUserList(0)
    },
    handleChange(file, fileList) {
      if (fileList && fileList.length >= 2) {
        fileList.splice(0, 1)
      }
      this.fileLists = fileList
    },
    uploadExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs['upload'].clearFiles()
      this.$refs['upload'].handleStart(files[0])
    },
    // 同步数据
    synchronousData() {
      const data = {
        start: this.synchronizationTime[0],
        end: this.synchronizationTime[1],
        applicationId: this.$store.state.app.applicationId,
        type: this.typeValue
      }
      getBatchResultSync(data).then(res => {
        // this.tableData = res
        this.dialogVisible = false
        if (res) {
          this.$message({
            message: res,
            type: 'warning'
          })
          // this.getList()
        }
      })
      // const timeoutPromise = new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject(new Error('Timeout'))
      //   }, 1000)
      // })

      // Promise.race([getBatchResultSync(data), timeoutPromise])
      //   .then(res => {
      //     this.tableData = res
      //     this.dialogVisible = false
      //     this.getList()
      //   })
      //   .catch(error => {
      //     if (error.message === 'Timeout') {
      //       this.dialogVisible = false
      //       this.$message({
      //         message: '正在同步数据，请稍等',
      //         type: 'warning'
      //       })
      //     } else {
      //       // console.error('Error:', error)
      //       this.$message({
      //         message: error,
      //         type: 'warning'
      //       })
      //     }
      //   })
    },
    // 开始跑批
    startRunning() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        start: this.runTime ? this.runTime[0] : null,
        end: this.runTime ? this.runTime[1] : null,
        batchVersion: null,
        isConsistent: null,
        isCompare: null
      }
      arBatchRun(data).then(res => {
        this.runDialogVisible = false
        // this.tableData = res
        if (res) {
          this.$message({
            message: res,
            type: 'warning'
          })
          // this.getList()
        }
      })
      // const timeoutPromise = new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject(new Error('Timeout'))
      //   }, 1000)
      // })

      // Promise.race([arBatchRun(data), timeoutPromise])
      //   .then(res => {
      //     this.runDialogVisible = false
      //     // this.tableData = res
      //     this.getList()
      //   })
      //   .catch(error => {
      //     if (error.message === 'Timeout') {
      //       this.runDialogVisible = false
      //       this.$message({
      //         message: '正在跑批，请稍等',
      //         type: 'warning'
      //       })
      //     } else {
      //       this.$message({
      //         message: error,
      //         type: 'warning'
      //       })
      //       // console.error('Error:', error)
      //     }
      //   })
    },
    // showAddUserDialog 打开新增用户则清空弹框表单
    // showAddUserDialog() {
    //   this.dialogFormVisible = true
    //   this.form = {
    //     name: '',
    //     alias: '',
    //     orgCode: '',
    //     email: '',
    //     identityNo: '',
    //     roleIdList: []
    //   }
    // },
    // 分页
    currentChange(num) {
      this.pageNum = num
      this.getList()
    },
    // 下载
    downloadUserTemplate() {
      const data = {
        start: null,
        end: null,
        applicationId: this.$store.state.app.applicationId
      }
      postDownloadFile('/ar/batchResult/export', data, '跑批报表数据.xlsx')
    },
    changePermission(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            roleIdList: this.formModify.roleIdList,
            userId: this.formModify.userId
          }
          UserUpdateRoles(data).then(res => {
            res
            this.getUserList()
            this.showPermissionDialog = false
          })
        }
      })
    }
  }

}

</script>
  <style lang='scss'>
  .manage {
    .pwd-wrap {
      background: #f4f4f5;
      color: #43a0ff;
      padding: 10px 15px;
      border-radius: 5px;
      font-weight: bold;
    }
    .custom-last-td {
      .cell {
        display: flex;
        &>span {
          margin-right: 15px;
        }
      }
    }
    .manage-search-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-input {
        max-width: 200px;
        margin-right: 15px;
      }
    }
  }
  .progress-info {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.progress-info p {
  margin: 5px 0;
}

  </style>
