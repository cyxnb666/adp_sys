<template>
  <div class="application app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <!-- 决策应用管理 -->
      <h6>{{ $t('application.application') }}</h6>
    </div>
    <el-card class="box-card mt-30">
      <div slot="header" class="card-head-style1 clearfix">
        <!-- 应用列表 -->
        <span>{{ $t('application.appList') }}</span>
      </div>
      <div class="content">
        <el-table
          :data="appListData"
          style="width:100%"
          :height="580"
          class="mt-20"
          stripe
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
        >
          <!-- 决策应用名称 -->
          <el-table-column
            prop="applicationName"
            :label="$t('application.applicationName')"
            width="180"
          />
          <!-- 决策应用编号 -->
          <el-table-column
            prop="applicationId"
            :label="$t('application.applicationId')"
            width="180"
          />
          <!-- 关联BOM业务对象模型 -->
          <el-table-column
            prop="bomName"
            :label="$t('application.bomName')"
          />
          <!-- 关联BOM编号 -->
          <el-table-column
            prop="bomBaseInfoId"
            :label="$t('application.bomBaseInfoId')"
          />
          <!-- 管理维度 -->
          <el-table-column
            prop="dimDetails"
            :label="$t('application.dimDetails')"
          >
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.dimDetails" :key="index + scope.row.applicationId" :style="{marginRight: '4px', marginBottom: '4px'}">
                {{ item.dimName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" width="180" class-name="custom-last-td">
            <template slot-scope="scope">
              <el-button
                size="mini"
                class="mr-15"
                type="warning"
                @click="editRule(scope.row)"
              >{{ $t('versionCompareRule.change') }}</el-button>

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
    <!-- 修改决策应用管理维度弹窗 -->
    <el-dialog :title="$t('versionCompareRule.change')" :visible.sync="showPermissionDialog" width="40%">
      <el-form ref="form" :inline="false" :label-width="labelWidth.labelWidth" :model="form">
        <el-form-item
          :label="$t('application.applicationName')"
          prop="applicationName"
          disabled
          :rules="[
            { required: false, min: 2,
              max: 10, message: $t('application.enterName'), trigger: 'blur' },]"
        >
          <el-input v-model="form.applicationName" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$t('application.applicationId')"
          prop="applicationId"
          disabled
        >
          <el-input v-model="form.applicationId" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$t('application.bom')"
          prop="bomName"
        >
          <el-input v-model="form.bomName" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$t('application.bomBaseInfoId')"
          prop="bomBaseInfoId"
        >
          <el-input v-model="form.bomBaseInfoId" disabled autocomplete="off" @input="form.alias = form.alias.replace(/[\u4E00-\u9FA5]/g,'')" />
        </el-form-item>
        <el-form-item
          :label="$t('application.dimDetails')"
          prop="roleIdList"
          :rules="[
            { required: true, message: $t('application.selectDim') }]"
        >
          <el-select
            v-model="form.dimDetails"
            v-default-select="[dimDetailsChecked]"
            value-key="dimName"
            multiple
            @change="handleChange"
          >
            <el-option
              v-for="item in currentBomInfo.dimDetails"
              :key="item.dimName"
              :label="item.dimName "
              :value="item"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!form.password" @click="showPermissionDialog = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm()">{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAppDecisionDetails, getBomDimById, createDecisionAppDim } from '@/api/mainPages/decision'
import { twoArrRepeat } from '@/utils/utils'
import { validateAccount, emailValue } from '@/utils/validate'
export default {
  data() {
    const baseURL = this.$store.state.settings.adp_config.baseURL || process.env.VUE_APP_BASE_API
    return {
      lang: this.$store.state.settings.lang,
      validateAccount,
      emailValue,
      loading: false,
      baseURL,
      pageNum: 1,
      pageSize: 5,
      total: 0,
      appListData: [],
      showPermissionDialog: false,
      form: {
        applicationName: '',
        applicationId: '',
        bomName: '',
        bomBaseInfoId: '',
        dimDetails: []
      },
      // 所有列表的值
      currentBomInfo: [],
      // 后台已选中的维度
      dimDetailsChecked: []
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? '191px' : '110px'
      }
    }
  },
  created() {
    this.getAppDecisionDetails()
  },
  methods: {
    handleChange(selected) {
      // 判断用户是取消还是选中
      console.log(this.dimDetailsChecked)
      const diff = selected.filter(
        (v) => !this.dimDetailsChecked.some((option) => option.dimName === v.dimName)
      )
      if (diff.length > 0) {
      } else {
        console.log(
          '取消选中的值：',
          this.dimDetailsChecked.filter(
            (option) => !selected.some((v) => v.dimName === option.dimName)
          )
        )
      }
      this.prevSelectedOptions = selected
    },
    // 修改权限
    editRule(row) {
      const copyRow = this._.cloneDeep(row)
      const id = copyRow.bomBaseInfoId
      // 获取维度所有列表
      getBomDimById(id).then(res => {
        this.currentBomInfo = res[0]
        this.form.applicationName = copyRow.applicationName
        this.form.applicationId = copyRow.applicationId
        this.form.bomName = copyRow.bomName
        this.form.bomBaseInfoId = copyRow.bomBaseInfoId
        // debugger
        this.form.dimDetails = copyRow.dimDetails
        this.dimDetailsChecked = copyRow.dimDetails
        setTimeout(() => {
          this.showPermissionDialog = true
        }, 100)
      })
    },
    // 获取所有应用列表
    getAppDecisionDetails() {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      // 查询应用配置的维度表
      getAppDecisionDetails(data).then(res => {
        this.appListData = res.list
        this.total = res.total
      })
    },
    // 分页
    currentChange(num) {
      this.pageNum = num
      this.getAppDecisionDetails()
    },
    confirm() {
      if (this.form.dimDetails.length === 1) {
        if (this.dimDetailsChecked[0].dimName === this.form.dimDetails[0].dimName) return this.$message.info('数据无更改')
      }
      const newDimDetails = twoArrRepeat(this.dimDetailsChecked, this.form.dimDetails, 'dimName')
      const data = this.form.dimDetails.map(item => {
        return {
          applicationId: this.form.applicationId,
          dimClassPath: item.dimClassPath,
          dimAttr: item.dimAttr,
          dimName: item.dimName,
          codeService: item.codeService,
          dimFieldPath: item.dimFieldPath
        }
      })

      createDecisionAppDim(data).then(res => {
        this.form = this.$options.data.call(this).form
        this.showPermissionDialog = false
        this.getAppDecisionDetails()
      })
    },
    changePermission(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('success')
        }
      })
    }
  }

}

</script>
<style lang='scss'>

</style>
