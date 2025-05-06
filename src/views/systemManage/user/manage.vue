<template>
  <div class="manage app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>{{ $t('userManage.userManage') }}</h6>
    </div>
    <el-card class="box-card mt-30">
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('userManage.viewUser') }}</span>
      </div>
      <div class="text-left flex-wrap flex-between">
        <div class="flex-1 flex-wrap">
          <el-button class="mr-15" size="mini" type="success" icon="el-icon-plus" @click="showAddUserDialog">{{ $t('userManage.addUser') }}</el-button>
          <el-upload
            ref="upload"
            :show-file-list="false"
            :headers="headers"
            :file-list="fileLists"
            :on-success="handleUploadSuccess"
            :on-change="handleChange"
            :action="baseURL + '/import/userInfo'"
            accept=".xlsx"
            class="mr-15"
          >
            <el-button
              slot="trigger"
              type="primary"
              icon="el-icon-upload2"
            >{{ $t('userManage.importUser') }}</el-button>
          </el-upload>
          <el-button size="mini" type="warning" icon="el-icon-download" @click="downloadUserTemplate">{{ $t('userManage.downloadTemp') }}</el-button>
        </div>
        <div class="manage-search-wrap flex-1">
          <el-input v-model="searchText" clearable :placeholder="$t('userManage.searchName')" @clear="getUserList" @keyup.enter.native="searchEnter()" />
          <el-button type="primary" @click="getUserList">{{ $t('common.search') }}</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width:100%"
          :empty-text="$t('common.noData')"
          height="580"
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
            prop="username"
            :label="$t('userManage.username')"
            width="180"
          />
          <el-table-column
            prop="name"
            :label="$t('userInfo.name')"
            width="180"
          />
          <el-table-column
            prop="email"
            :label="$t('common.email')"
            width="220"
          />
          <el-table-column
            prop="roleIdList"
            :label="$t('userManage.roleIdList')"
            width="270"
          >
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.roleIdList" :key="index + scope.row.userId" :style="{marginRight: '4px', marginBottom: '4px'}">
                {{ mapRule[item] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            class-name="custom-last-td"
            :width="width.width"
          >
            <template slot-scope="scope">
              <!-- 激活 -->
              <el-popconfirm
                v-if="scope.row.userStatus === 'L'"
                :confirm-button-text="$t('common.ok')"
                :cancel-button-text="$t('common.cancel')"
                :title="$t('userManage.actUser')"
                @onConfirm="UserStatus(scope.row.userId,'A')"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="primary"
                >{{ $t('userManage.activate') }}</el-button>
              </el-popconfirm>

              <!-- 锁定 -->
              <el-popconfirm
                v-if="scope.row.userStatus === 'A'"
                :title="$t('userManage.lockUser')"
                :confirm-button-text="$t('common.ok')"
                :cancel-button-text="$t('common.cancel')"
                @onConfirm="UserStatus(scope.row.userId,'L')"
              >
                <el-button
                  slot="reference"
                  size="mini"
                >{{ $t('userManage.lock') }}</el-button>
              </el-popconfirm>

              <!-- 重置密码 -->
              <el-popconfirm
                :confirm-button-text="$t('common.ok')"
                :cancel-button-text="$t('common.cancel')"
                :title="$t('userManage.resetPwd')"
                @onConfirm="handleEdit(scope.$index, scope.row)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="info"
                >{{ $t('userManage.rePwd') }}</el-button>
              </el-popconfirm>

              <!-- 修改权限 -->
              <el-button
                size="mini"
                class="mr-15"
                type="warning"
                @click="editRule(scope.row)"
              >{{ $t('userManage.editRule') }}</el-button>

              <!-- 删除用户 -->
              <el-popconfirm
                :title="$t('userManage.delUser')"
                :confirm-button-text="$t('common.ok')"
                :cancel-button-text="$t('common.cancel')"
                @onConfirm="UserStatus(scope.row.userId,'D')"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                >{{ $t('button.delete') }}</el-button>
              </el-popconfirm>

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

    <!-- 重置后的密码 -->
    <el-dialog
      :title="$t('userManage.pwdResetOk')"
      :visible.sync="centerDialogVisible"
      width="30%"
    >
      <div class="pwd-wrap">{{ showPwd }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">{{ $t('button.OK') }}</el-button>
      </span>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog :title="$t('userManage.addUser')" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="form" :inline="false" label-width="110px">
        <el-form-item
          :label="$t('userInfo.name')"
          prop="name"
          :rules="[
            { required: true, min: 2,
              max: 10, message: $t('userManage.enterName'), trigger: 'blur' },]"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-if="form.password"
          :label="$t('userManage.pwd')"
          prop="password"
        >
          <el-input v-model="form.password" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item
          :label="$t('userManage.username')"
          prop="alias"
          :rules="nameRules"
        >
          <el-input v-model="form.alias" autocomplete="off" @input="form.alias = form.alias.replace(/[\u4E00-\u9FA5]/g,'')" />
        </el-form-item>
        <el-form-item
          :label="$t('userManage.roleCodeList')"
          prop="roleIdList"
          :rules="[
            { required: true, message: $t('userManage.selectRoleCodeList') }]"
        >
          <el-select v-model="form.roleIdList" :placeholder="$t('userManage.roleCodeList')" multiple style="width:100%;">
            <el-option :label="$t('common.ruleSet')" value="ROLE_RULE_SETTER" />
            <el-option :label="$t('common.ruleMana')" value="ROLE_RULE_MANAGER" />
            <el-option :label="$t('common.sysManage')" value="ROLE_SYSTEM_MANAGER" />
            <el-option :label="$t('common.oneAuditor')" value="ROLE_STAIR_AUDITOR" />
            <el-option :label="$t('common.twoAuditor')" value="ROLE_FOXBASE_AUDITOR" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('userManage.orgCode')"
          prop="orgCode"
          :rules="[
            {}]"
        >
          <el-input v-model="form.orgCode" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$t('common.emailAddress')"
          prop="email"
          :rules="[
            { type: 'email',validator: emailValue, trigger: ['blur', 'change'] }]"
        >
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$t('userInfo.IDNumber')"
          prop="identityNo"
          :rules="[
            {}]"
        >
          <el-input v-model="form.identityNo" autocomplete="off" @input="form.identityNo = form.identityNo.replace(/[\u4E00-\u9FA5]/g,'')" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!form.password" @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="addUser('form')">{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>

    <!-- 修改权限 -->
    <el-dialog :title="$t('userManage.editRule')" :visible.sync="showPermissionDialog" width="30%">
      <el-form ref="formModify" :inline="false" label-width="110px" :model="formModify">

        <el-form-item
          :label="$t('userManage.roleCodeList')"
          prop="roleIdList"
          :rules="[
            { required: true, message: $t('userManage.selectRoleCodeList') }]"
        >
          <el-select v-model="formModify.roleIdList" :placeholder="$t('userManage.roleCodeList')" multiple>
            <el-option :label="$t('common.ruleSet')" value="ROLE_RULE_SETTER" />
            <el-option :label="$t('common.ruleMana')" value="ROLE_RULE_MANAGER" />
            <el-option :label="$t('common.sysManage')" value="ROLE_SYSTEM_MANAGER" />
            <el-option :label="$t('common.oneAuditor')" value="ROLE_STAIR_AUDITOR" />
            <el-option :label="$t('common.twoAuditor')" value="ROLE_FOXBASE_AUDITOR" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!form.password" @click="showPermissionDialog = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="changePermission('formModify')">{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, UserResetPwd, addUser, UserStatus, UserUpdateRoles } from '@/api/systemManage/user-manage'
import { downloadFile } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { validateAccount, emailValue } from '@/utils/validate'
import i18n from '@/languages/index'
const mapRule = {
  'ROLE_RULE_SETTER': i18n.t('common.ruleSet'),
  'ROLE_RULE_MANAGER': i18n.t('common.ruleMana'),
  'ROLE_SYSTEM_MANAGER': i18n.t('common.sysManage'),
  'ROLE_STAIR_AUDITOR': i18n.t('common.oneAuditor'),
  'ROLE_FOXBASE_AUDITOR': i18n.t('common.twoAuditor')
}
export default {
  data() {
    const baseURL = this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API
    return {
      mapRule,
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
        name: '',
        alias: '',
        orgCode: '',
        email: '',
        identityNo: '',
        roleIdList: []
      },
      formModify: { roleIdList: [], userId: null },
      nameRules: [
        { required: true, validator: validateAccount, trigger: 'blur' }],
      fileLists: [],
      lang: this.$store.state.settings.lang
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
    this.getUserList()
  },
  methods: {
    // 修改权限
    editRule(row) {
      this.showPermissionDialog = true
      this.formModify.roleIdList = row.roleIdList
      this.formModify.userId = row.userId
    },
    // 重置密码
    handleEdit(index, row) {
      UserResetPwd(row.userId).then(res => {
        this.centerDialogVisible = true
        this.showPwd = res
      })
    },
    searchEnter() {
      this.getUserList()
    },
    // 获取用户列表
    getUserList(status) {
      let pageNum = this.pageNum
      // 删除
      if (status === 0) {
        pageNum = this.tableData.length === 1 && pageNum > 1 ? pageNum - 1 : pageNum
        this.pageNum = pageNum
      }
      const data = {
        name: this.searchText,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getUserList(data).then(res => {
        this.tableData = res.list
        this.total = res.total
        this.pageNum = res.pageNum
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
    // 新增用户
    addUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.loading = true
          addUser(this.form).then(res => {
            this.form = res
            this.getUserList()
            this.loading = false
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // showAddUserDialog 打开新增用户则清空弹框表单
    showAddUserDialog() {
      this.dialogFormVisible = true
      this.form = {
        name: '',
        alias: '',
        orgCode: '',
        email: '',
        identityNo: '',
        roleIdList: []
      }
    },
    // 分页
    currentChange(num) {
      this.pageNum = num
      this.getUserList()
    },
    // 下载
    downloadUserTemplate() {
      downloadFile('/downloadUserTemplate', null, this.$t('userManage.xlsx'))
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

</style>
