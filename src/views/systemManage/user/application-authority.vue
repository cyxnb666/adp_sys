<template>
  <div class="applicationAuthority app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1"/>
      <h6>{{ $t('authority.authority') }}</h6>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('authority.information') }}</span>
          </div>
          <div class="content">
            <el-form
              ref="ruleForm"
              disabled
              label-position="left"
              :hide-required-asterisk="true"
              :model="userForm"
              label-width="85px"
              class="demo-ruleForm"
            >
              <el-form-item :label="$t('userInfo.name')" prop="bomName">
                <el-input v-model="userForm.name"/>
              </el-form-item>
              <el-form-item :label="$t('userInfo.IDNumber')">
                <el-input v-model="userForm.identityNo"/>
              </el-form-item>
              <el-form-item :label="$t('common.email')">
                <el-input v-model="userForm.email"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card mt-15">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('authority.applyRole') }}</span>
          </div>
          <div class="content">
            <!-- <el-select
              v-model="role"
              value-key="key"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in roles"
                :key="item.key"
                :label="item.label"
                :value="item"
              />
            </el-select> -->
            <el-checkbox-group v-model="role" :min="1">
              <el-checkbox v-for="item in roles" :key="item.key" :label="item.label" :value="item"
                           :checked="item.checked"/>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-card class="box-card mt-15">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('authority.userApplyInfo') }}</span>
          </div>
          <el-button
            class="btn-border mini"
            :disabled="handelAddApp"
            @click="addRow()"
          >{{ $t('authority.addApp') }}
          </el-button>
          <div class="content">
            <el-form
              ref="form"
              label-width="120px"
              :model="dynamicValidateForm"
            >
              <el-table
                v-loading="loading"
                class="decisionTable"
                :data="form.tableData"
                :empty-text="$t('common.noData')"
                style="width: 100%;margin-top:15px"
                stripe
                :header-cell-style="{
                  background: '#EFF4F8',
                  color: '#60769C',
                  'font-weight': 'normal'
                }"
                :cell-style="{ color: '#435475' }"
              >
                <!-- 应用 -->
                <el-table-column prop="role" :label="$t('userInfo.applicationName')" width="130">
                  <template slot-scope="scope">
                    <el-form-item
                      class="noLeftLabel"
                      :prop="'row.' + scope.$index + '.app'"
                      :rules="[
                        {
                          required: true,
                          message: $t('authority.leastOne'),
                          trigger: 'change'
                        }
                      ]"
                    >
                      <el-select
                        v-model="dynamicValidateForm.row[scope.$index].app"
                        value-key="applicationId"
                        :placeholder="$t('common.pleaseChoose')"
                        @change="
                          getAuthorityDims(
                            dynamicValidateForm.row[scope.$index].app
                              .applicationId,
                            scope.$index
                          )
                        "
                      >
                        <el-option
                          v-for="item in appList"
                          :key="item.applicationId"
                          :label="item.applicationName"
                          :value="item"
                          :disabled="item.disabled"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- 维度 -->
                <el-table-column prop="role" :label="$t('userInfo.approvalDate')" width="750">
                  <template slot-scope="scope">
                    <div
                      v-for="(item, index) in scope.row.roles"
                      :key="item.dimId"
                    >
                      <!-- {{ scope.$index + '-----' + index }} -->
                      <!-- {{ dynamicValidateForm.row[scope.$index].dims[index]
                        .attrs }} -->
                      <el-form-item
                        v-if="item.vlist"
                        :label="item.dimName"
                        :prop="
                          'row.' + scope.$index + '.dims.' + index + '.attrs'
                        "
                        :rules="[
                          {
                            required: true,
                            message: $t('authority.leastOne'),
                            trigger: 'change'
                          }
                        ]"
                      >
                        <el-select
                          v-model="
                            dynamicValidateForm.row[scope.$index].dims[index]
                              .attrs
                          "
                          value-key="key"
                          filterable
                          multiple
                          collapse-tags
                          size="medium"
                          :placeholder="$t('common.pleaseChoose')"
                          class="customer-select"
                          @remove-tag="removeTag($event,scope.$index, index)"
                          @change="dimChange($event, dynamicValidateForm.row[scope.$index].dims[index]
                            .attrs, scope.$index, index)"
                        >
                          <el-option
                            :label="$t('common.all')"
                            :value="{ key: 'all', label: $t('common.all') }"
                            @click.native="dimChangeAll($event, scope.$index, index)"
                          />
                          <el-option
                            v-for="(vitem, i) in item.vlist"
                            :key="i"
                            :label="vitem.label"
                            :value="vitem"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </template>
                </el-table-column>
                <!-- 决策库目录 -->
                <el-table-column prop="catalogues" label="决策库目录" width="200">
                  <template slot-scope="scope">
                    <el-form-item
                      class="noLeftLabel"
                      :prop="'row.' + scope.$index + '.catalogues'"
                    >
                      <el-cascader
                        :ref="'row' + scope.$index + 'catalogues'"
                        v-model="dynamicValidateForm.row[scope.$index].catalogues"
                        :options="dynamicValidateForm.row[scope.$index].rootList"
                        :show-all-levels="false"
                        :props="{ expandTrigger: 'hover',value: 'id', multiple: true,checkStrictly:true, emitPath: false }"
                        @visible-change="visibleChange($event, scope.$index)"
                        @change="catalogueChange(dynamicValidateForm.row[scope.$index].catalogues, scope.$index)"></el-cascader>
                      <!--                      <el-select-->
                      <!--                        v-model="dynamicValidateForm.row[scope.$index].catalogues"-->
                      <!--                        multiple-->
                      <!--                        collapse-tags-->
                      <!--                        size="medium"-->
                      <!--                        :placeholder="$t('common.pleaseChoose')"-->
                      <!--                        @change="catalogueChange(dynamicValidateForm.row[scope.$index].catalogues, scope.$index)"-->
                      <!--                      >-->
                      <!--                        <el-option-->
                      <!--                          v-for="(ritem,i) in dynamicValidateForm.row[scope.$index].rootList"-->
                      <!--                          :key="i"-->
                      <!--                          :label="ritem.catalogue"-->
                      <!--                          :value="ritem.id"-->
                      <!--                        />-->
                      <!--                      </el-select>-->
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('common.operation')">
                  <template slot-scope="scope">
                    <!-- <el-button
                      class="btn-border mini"
                      @click="addRow()"
                    >新增</el-button> -->
                    <el-button
                      class="operationBtn btn-border mini"
                      type="text"
                      :loading="isSubmitBtn"
                      @click="del(scope.$index)"
                    >{{ $t('button.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-button
                type="primary"
                class="mt-15"
                :disabled="isSubmitBtn"
                @click="submit"
              >{{ $t('button.submit') }}
              </el-button>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  AuthorityRoles,
  AuthorityApplyAttr,
  getAuthorityApplications,
  getAuthorityDims,
  getAuthorityCodeService,
  getUserAppAuthorityList,
  getApprovedRootCatalogue
} from '@/api/systemManage/authority'
import {getDimCodeData} from '@/api/base'
import {getUser} from '@/api/systemManage/user-manage'
import {decisionDim} from '@/api/mainPages/decision'
import '../../../utils/str-prototype'
import {fullRepository} from "@/views/systemManage/management/api";

export default {
  beforeRouteEnter(to, from, next) {
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  data() {
    return {
      userForm: {
        name: '核保人',
        identityNo: '',
        email: ''
      },
      role: [],
      applications: [],
      roles: [], // 角色列表
      roleAttrs: [],
      val: null,
      time: [],
      form: {
        tableData: []
      },
      dynamicValidateForm: {
        row: []
      },
      dynamicValidateFormCopy: null,
      remark: null,
      selectChecked: [],
      AppAuthorityList: null,
      loading: false,
      isSubmitBtn: false,
      rootList: [],
      originTreeList: []
    }
  },
  computed: {
    // disabled
    appList() {
      if (this.applications.length === 0) {
        return []
      }
      const appId = [] // 拿到选中的appid
      this.dynamicValidateForm.row.forEach(element => {
        element.app && appId.push(element.app.applicationId)
      })
      return this.applications.map(element => {
        return {
          ...element,
          disabled: appId.includes(element.applicationId)
        }
      })
    },
    activeUserRules() {
      return this.$store.state.user.roles
    },
    isDeleteRow() {
      return this.dynamicValidateForm.row.length > 1
    },
    handelAddApp() {
      return this.applications.length === this.dynamicValidateForm.row.length
    }
  },
  async mounted() {
    this.isSubmitBtn = true
    await this.getAuthorityApplications()
    await this.getUser()
    await this.$store.dispatch('user/getInfo', {}) // 重新获取下user角色
    await this.authorityRoles()
    this.loading = true
    const res = await getUserAppAuthorityList()
    this.AppAuthorityList = res
    this.AppAuthorityList && this.AppAuthorityList.length
    this.AppAuthorityList.length && this.AppAuthorityList.forEach(async (item, index) => {
      await this.addRow()
      let app = null
      this.applications.forEach(v => {
        if (v.applicationId === item.applicationId) {
          app = v
        }
      })
      this.$nextTick(async () => {
        this.dynamicValidateForm.row[index].app = app
        const arr = await getApprovedRootCatalogue(this.dynamicValidateForm.row[index].app.applicationId)

        // const res = await fullRepository(this.dynamicValidateForm.row[index].app.applicationId)
        // const rootList = res.resp.decisionRepositoryModel.catalogueList || []
        // this.dynamicValidateForm.row[index].rootList = rootList
        this.dynamicValidateForm.row[index].catalogues = arr.map(v => v.decisionRepCatalogueId)
        // arr.reduce((acc, item) => {
        //   if (rootList.some(v => v.id === item.decisionRepCatalogueId)) {
        //     acc.push(item.id)
        //   }
        //   return acc
        // }, [])

      })
      const dimRes = await decisionDim(item.applicationId)
      const codeService = dimRes.map(item => {
        return item.codeService
      })
      // 查询接口维度值列表数据
      await this.getDimCodeData(codeService.toString(), item.applicationId, index)
    })
    this.loading = false
    this.$nextTick(async () => {
      const promises = this.AppAuthorityList.map(async (item, index) => {
        await this.getAuthorityDims(item.applicationId, index)
      })

      await Promise.all(promises)

      await this.$store.dispatch('user/getInfo', {}) // 重新获取用户角色
    })

    // 在所有异步操作完成后延迟执行深拷贝
    setTimeout(() => {
      this.dynamicValidateFormCopy = this._.cloneDeep(this.dynamicValidateForm)
      this.isSubmitBtn = false
    }, 3000) // 在当前事件循环结束后执行
  },
  methods: {
    visibleChange(event,index){
      if(event) {
        const refName = `row${index}catalogues`
        this.handleDisable(index, refName)
      }
    },
    async catalogueChange(data, index) {
      this.dynamicValidateForm.row[index].rootList = _.cloneDeep(this.originTreeList[index])
      const refName = `row${index}catalogues`
      this.handleDisable(index, refName)
      await this.$nextTick()
      this.dynamicValidateForm.row[index].catalogues = this.$refs[refName].getCheckedNodes().map(item => {
        return item.data.id
      })
      this.handleDisable(index, refName)
      this.$forceUpdate()
    },
    async handleDisable(index, refName) {
      await this.$nextTick()
      _.forEach(this.$refs[refName].getCheckedNodes(), (e) => {
        this.disableChildren(e)
      })
    },
    disableChildren(node) {
      if (node.children) {
        _.forEach(node.children, (child) => {
          this.$set(child.data, 'disabled', true)
          this.$set(child, 'checked', false)
          this.disableChildren(child)
        })
      }
    },
    async getUser() {
      await getUser().then(res => {
        this.userForm.name = res.name
        this.userForm.identityNo = res.identityNo
        this.userForm.email = res.email
        // this.roleList = res.roleList
      })
    },
    // 获取角色列表和相关属性
    async authorityRoles() {
      await AuthorityRoles().then(res => {
        this.roles = res
        this.roles = res.map(item => {
          return {
            ...item,
            checked: this.activeUserRules.includes(item.key)
          }
        })
      })
    },
    async getAuthorityApplications() {
      this.applications = await getAuthorityApplications()
    },
    dimChange(e, row, rowIndex, index) {
      let dynamicValidateForm = this.dynamicValidateForm.row[rowIndex].dims[index].attrs
      const dmsVlist = this.form.tableData[rowIndex].roles[index].vlist
      const isAll = e.find(item => item.label === this.$t('common.all'))
      if (!isAll && e.length === dmsVlist.length) {
        dynamicValidateForm.unshift({key: 'all', label: this.$t('common.all')})
      } else if (isAll && (e.length - 1) < dmsVlist.length) {
        dynamicValidateForm = this.dynamicValidateForm.row[rowIndex].dims[index].attrs.filter((item) => {
          return item.label !== this.$t('common.all')
        })
      }
      this.dynamicValidateForm.row[rowIndex].dims[index].attrs = dynamicValidateForm
    },
    dimChangeAll(e, rowIndex, index) {
      let dynamicValidateForm = this.dynamicValidateForm.row[rowIndex].dims[index].attrs
      const dmsVlist = this.form.tableData[rowIndex].roles[index].vlist
      if (dynamicValidateForm.length < dmsVlist.length) {
        dynamicValidateForm = []
        dmsVlist.map((item) => {
          dynamicValidateForm.push(item)
        })
        dynamicValidateForm.unshift({key: 'all', label: this.$t('common.all')})
      } else if (dmsVlist.length === 0) {
        dynamicValidateForm.unshift({key: 'all', label: this.$t('common.all')})
        dynamicValidateForm.splice(0, 1)
      } else {
        dynamicValidateForm = []
      }
      this.dynamicValidateForm.row[rowIndex].dims[index].attrs = dynamicValidateForm
    },
    removeTag(val, rowIndex, index) {
      if (val.label === this.$t('common.all')) {
        this.dynamicValidateForm.row[rowIndex].dims[index].attrs = []
      }
    },
    // 查询getDimCodeData
    async getDimCodeData(codeServices, applicationId, index) {
      const data = {
        applicationId: applicationId,
        codeServices: codeServices
      }
      await getDimCodeData(data).then(res => {
        this.selectChecked[index] = res
      })
    },
    // 根据当前应用获取维度信息
    async getAuthorityDims(applicationId, index) {
      const dimRes = await decisionDim(applicationId)
      const codeService = dimRes.map(item => {
        return item.codeService
      })
      // 查询接口维度值列表数据
      await this.getDimCodeData(codeService.toString(), applicationId, index)
      await getAuthorityDims(applicationId).then(async res => {
        this.form.tableData[index].roles = res
        this.form.tableData[index].codeServices = res.map(item => {
          return item.codeService
        })
        this.dynamicValidateForm.row[index].dims = res
        await this.getAuthorityCodeService(
          this.form.tableData[index].codeServices,
          index,
          res
        )
      })
      let app = null
      this.applications.forEach(v => {
        if (v.applicationId === applicationId) {
          app = v
        }
      })
      this.dynamicValidateForm.row[index].app = app
      // const arr = await getApprovedRootCatalogue(applicationId)
      // this.dynamicValidateForm.row[index].catalogues = arr.map(item => item.decisionRepCatalogueId)
      // this.dynamicValidateForm.row[index].rootList = await getRootCatalogue(this.dynamicValidateForm.row[index].app.bomBaseInfoId) || []
      const res = await fullRepository(applicationId)
      this.originTreeList[index] = _.cloneDeep(res.resp.decisionRepositoryModel.catalogueList) || []
      this.dynamicValidateForm.row[index].rootList = res.resp.decisionRepositoryModel.catalogueList || []
      if (this.dynamicValidateForm.row[index].catalogues.length === 0) {
        this.dynamicValidateForm.row[index].catalogues = [(this.dynamicValidateForm.row[index].rootList[0].id)]
      }
    },
    async getAuthorityCodeService(codeService, index, dims) {
      const data = {
        codeServices: codeService.toString()
      }

      await getAuthorityCodeService(data).then(res => {
        setTimeout(() => {
          const list = this.form.tableData[index].roles.map(
            (element, dimIndex) => {
              // debugger
              const attrsChecked = this.selectChecked[index][element.codeService]
              if (JSON.stringify(attrsChecked) !== undefined && attrsChecked.length === res[element.codeService].length) {
                attrsChecked.unshift({key: 'all', label: this.$t('common.all')})
              }
              this.$set(
                this.dynamicValidateForm.row[index].dims[dimIndex],
                'attrs',
                attrsChecked || []
              )
              return {
                ...element,
                vlist: res[element.codeService]
              }
            }
          )

          this.form.tableData[index].roles = list
        }, 800)
      })
    },
    del(index) {
      this.form.tableData.splice(index, 1)
      this.dynamicValidateForm.row.splice(index, 1)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    addRow() {
      const row = {
        attrList: null,
        role: {},
        roles: [],
        roleAttrs: null
      }
      const formRow = {
        app: null,
        dims: []
      }
      this.form.tableData.push(row)
      this.dynamicValidateForm.row.push(formRow)
      // const isFlag = this.dynamicValidateForm.row.find(item => item.app === null)
      // if (!isFlag) {
      //   this.form.tableData.push(row)
      //   this.dynamicValidateForm.row.push(formRow)
      // } else {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择应用再添加'
      //   })
      // }
    },
    async submit() {
      const appAuthorities = this.dynamicValidateForm.row
      const beforeHashDate = JSON.stringify(this.dynamicValidateFormCopy).hashCode()
      const afterHashDate = JSON.stringify(this.dynamicValidateForm).hashCode()

      const beforeRules = this.roles.filter((i) => i.checked).map((k) => k.label).sort().toString().hashCode()
      const afterRules = this.role.map((i) => i).sort().toString().hashCode()
      // return
      if (beforeHashDate === afterHashDate && beforeRules === afterRules) return this.$message.error(this.$t('authority.changeData'))
      const tempArr = []
      this.role.map(item => {
        this.roles.forEach(i => {
          if (item === i.label) {
            tempArr.push({
              key: i.key,
              label: i.label,
              value: i.value
            })
          }
        })
      })
      const arr = JSON.parse(JSON.stringify(appAuthorities))
      arr.forEach((v,index) => {
        const refName = `row${index}catalogues`
        v.catalogues =   this.$refs[refName].getCheckedNodes().map(item => {
          delete item.data.children
          return item.data
        })
        this.$delete(v, 'rootList')
      })
      const data = {
        remark: this.remark,
        appAuthorities: arr,
        roles: tempArr
      }
      const isFlag = this.dynamicValidateForm.row.find(item => item.app !== null)
      // 判断是否选择应用权限 如果选择需要valid验证
      if (isFlag) {

        this.$refs.form.validate(async (valid) => {
          if (valid) {
            await AuthorityApplyAttr(data).then(res => {
              res
            })
          }
        })
      } else {
        await AuthorityApplyAttr(data).then(res => {
          res
        })
      }
    }
  }
}
</script>
<style lang="scss">
.applicationAuthority {
  .demonstration {
    margin-bottom: 30px;
  }

  .el-cascader {
    width: 100%;
    // height: 100px;
  }

  .noLeftLabel {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .customer-select {
    width: 100%;
  }

  .operationBtn.btn-border.mini {
    margin-bottom: 22px;
  }
}
</style>
