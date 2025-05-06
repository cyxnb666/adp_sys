<template>
  <div class="user app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>{{ $t('userInfo.perInfo') }}</h6>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('bomCreat.basic_info') }}</span>
          </div>
          <div class="content">
            <el-form
              ref="ruleForm"
              disabled
              label-position="left"
              :hide-required-asterisk="true"
              :model="form"
              label-width="85px"
              class="demo-ruleForm"
            >
              <el-form-item :label="$t('userInfo.name')" prop="bomName">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item :label="$t('userInfo.IDNumber')">
                <el-input v-model="form.identityNo" />
              </el-form-item>
              <el-form-item :label="$t('common.email')">
                <el-input v-model="form.email" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('userInfo.appInfo') }}</span>
          </div>
          <div class="content">
            <el-form
              ref="ruleForm"
              label-position="right"
              :hide-required-asterisk="true"
              :model="form"
              label-width="85px"
              class="demo-ruleForm"
            >

              <el-table
                class="decisionTable"
                :data="appListInfo"
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
                <el-table-column prop="applicationName" :label="$t('userInfo.applicationName')" width="250">
                  <!-- <template slot-scope="scope">
                    <span>{{ scope.row.applicationId }}</span>
                  </template> -->
                </el-table-column>
                <el-table-column prop="approvalDate" :label="$t('userInfo.approvalDate')">
                  <template slot-scope="scope">
                    <div>
                      <el-tag v-for="(item) in scope.row.dimAuthorityList" :key="item.dimId" disable-transitions effect="light" :style="{marginRight: '4px', marginBottom: '4px'}">
                        {{ item.dimName }}
                      </el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.operation')">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-border mini"
                      @click="appDetail(scope.row.applicationId)"
                    >{{ $t('userInfo.appDetail') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('userInfo.permInfo') }}</span>
          </div>
          <div>
            <el-table
              class="decisionTable"
              :data="tableData"
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
              <el-table-column prop="role" :label="$t('userInfo.role')" width="250">
                <template slot-scope="scope">
                  <div v-if="scope.row.roles.length">
                    <el-tag v-for="(item) in scope.row.roles" :key="item.userRoleId + scope.row.userAuthorityId" disable-transitions effect="light" :style="{marginRight: '4px', marginBottom: '4px'}">
                      {{ item.roleName }}
                    </el-tag>
                  </div>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="authorityStatusText" :label="$t('common.state')" />
              <el-table-column prop="approvalDate" :label="$t('userInfo.approvalTime')" />
              <el-table-column prop="approvalStatusText" :label="$t('userInfo.approvalStatus')" />
              <el-table-column prop="approvalOpinion" :label="$t('userInfo.approvalOpinion')">
                <template slot-scope="scope">
                  <span>{{ scope.row.approvalOpinion? scope.row.approvalOpinion : '--' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createdDate"
                :label="$t('userInfo.applyTime')"
                width="150"
              />

              <el-table-column :label="$t('common.operation')" width="200">
                <template slot-scope="scope">
                  <el-popconfirm
                    :title="$t('userInfo.isDel')"
                    :confirm-button-text="$t('common.ok')"
                    :cancel-button-text="$t('common.cancel')"
                    @onConfirm="del(scope.row.userAuthorityId)"
                  >
                    <el-button
                      slot="reference"
                      class="btn-border mini mr-15"
                    >{{ $t('button.delete') }}</el-button>
                  </el-popconfirm>

                  <el-button
                    class="btn-border mini"
                    @click="detail(scope.row)"
                  >{{ $t('userInfo.appDetail') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              class="mt-20"
              background
              layout="prev, pager, next"
              :total="pageTotal"
              :page-size.sync="pageSize"
              :current-page="pageNum"
              @current-change="currentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 弹窗显示应用权限信息详情 -->
    <el-dialog :title="$t('userInfo.appPermDetail')" :visible.sync="dialogAppVisible" width="1200px">
      <el-row :gutter="15" type="flex" style="flex-wrap:wrap">
        <el-col
          style="min-width:100px"
          :span="24"
        >
          <el-card class="mt-15">
            <div class="detail-row  flex-wrap">
              <span class="spanText" :style="{width:lang==='en'?'130px':'50px'}">{{ $t('userInfo.applicationName') }}：</span>
              <div>{{ appData.applicationName }}</div>
            </div>
            <div class="flex-wrap">
              <span class="spanText" :style="{width:lang==='en'?'143px':'50px'}">{{ $t('userInfo.approvalDate') }}：</span>
              <!-- {{ item.dimName }} -->
              <div class="dim-wrap">
                <div
                  v-for="dim in appData.dimAuthorityList"
                  :key="dim.dimId"
                  class="attr-wrap"
                >
                  {{ dim.dimName }}:
                  <div>
                    <span v-for="attr in dim.attrAuthorityDTOList" :key="attr.attrCode">
                      {{ attr.attrName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 弹框显示详情 -->
    <el-dialog :title="$t('common.hint')" :visible.sync="dialogVisible" width="1200px">
      <div class="roles-wrap flex-wrap">
        <span style="color:#333;font-size:15px;min-width:50px">{{ $t('userInfo.role') }}：</span>
        <div v-if="dialogData.roles && dialogData.roles.length">
          <span v-for="item in dialogData.roles" :key="item.roleId">
            <span v-if="item.roleId">
              {{ item.roleId }} - {{ item.roleName }};
            </span>
          </span>
        </div>
        <div v-else>
          {{ $t('common.noData') }}
        </div>
      </div>
      <el-row :gutter="15" type="flex" style="flex-wrap:wrap">
        <el-col
          v-for="(item, i) in dialogData.appAuthorities"
          :key="i"
          style="min-width:100px"
          :span="24"
        >
          <el-card class="mt-15">
            <div class="detail-row  flex-wrap">
              <span :style="{width:lang==='en'?'100px':'50px'}" class="spanDialog">{{ $t('userInfo.applicationName') }}：</span>
              <div>{{ item.applicationName }}</div>
            </div>
            <div class="flex-wrap">
              <span :style="{width:lang==='en'?'100px':'50px'}" class="spanDialog">{{ $t('userInfo.approvalDate') }}：</span>
              <!-- {{ item.dimName }} -->
              <div class="dim-wrap">
                <div
                  v-for="dim in item.dims"
                  :key="dim.dimId"
                  class="attr-wrap"
                >
                  {{ dim.dimName }}:
                  <div>
                    <span v-for="attr in dim.dimAttrs" :key="attr.key">
                      {{ attr.attrName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  getUser
} from '@/api/systemManage/user-manage'
import {
  AuthoritySelf,
  deleteAuthorityPendingApproval,
  getUserAppAuthorityList
} from '@/api/systemManage/authority'
import { handleAuthoritySelf } from './utils'
import moment from 'moment'
export default {
  data() {
    return {
      lang: this.$store.state.settings.lang,
      form: {
        name: '核保人',
        identityNo: '',
        email: ''
      },
      dialogVisible: false,
      dialogAppVisible: false,
      dialogData: {},
      appListInfo: [], // 应用权限信息
      pageNum: 1, // 当前页数
      pageSize: 5, // 每页条数
      pageTotal: 0,
      tableData: [], // 表格数据
      appData: [] // 应用权限信息详情
    }
  },
  created() {
    this.getUser()
    this.AuthoritySelf()
    this.getAppList()
  },
  methods: {
    // 应用权限查看详情
    appDetail(id) {
      this.appListInfo.forEach(item => {
        if (item.applicationId === id) this.appData = item
      })
      this.dialogAppVisible = true
    },
    // 分页
    currentChange(num) {
      this.pageNum = num
      this.AuthoritySelf()
    },
    getAppList() {
      getUserAppAuthorityList().then(res => {
        this.appListInfo = res
      })
    },
    getUser() {
      getUser().then(res => {
        this.form.name = res.name
        this.form.identityNo = res.identityNo
        this.form.email = res.email
        // this.roleList = res.roleList
      })
    },
    // 获取权限信息
    AuthoritySelf() {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      AuthoritySelf(data).then(res => {
        const list = res.list.map(element => {
          // authorityStatus  状态：1-新增，2-删除
          // approvalStatus   审批状态：0-待审批，1-审批通过，2-审批不通过
          // effectiveDate  生效时间
          // invalidatedDate  失效时间
          // createdDate  发起审批时间
          const createdDate = moment(element.createdDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          const approvalDate = element.approvalDate
            ? moment(element.approvalDate).format('YYYY-MM-DD HH:mm:ss')
            : '--'
          const dateTime = `${moment(element.effectiveDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )} 至 ${moment(element.invalidatedDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )} `

          return {
            ...element,
            createdDate,
            approvalDate,
            dateTime,
            approvalStatusText: handleAuthoritySelf(element.approvalStatus),
            authorityStatusText:
              element.authorityStatus === '1' ? this.$t('pending.add') : this.$t('pending.del')
          }
        })
        this.pageTotal = res.count
        this.tableData = list
      })
    },
    detail(item) {
      this.dialogVisible = true
      this.dialogData = item
    },
    del(userAuthorityId) {
      deleteAuthorityPendingApproval(userAuthorityId).then(res => {
        res
        this.AuthoritySelf()
      })
    }
  }
}
</script>
<style lang="scss">
.user {
  .content {
    max-width: 1000px;
  }
  .detail-row {
    border-bottom: 1px solid #e5eaef;
    padding: 5px 0;
    margin-bottom: 15px;
  }
  .card {
    border: 1px solid #ccc;
    margin-bottom: 15px;
  }
  .dim-wrap {
    width: 100%;
    .attr-wrap {
      padding: 0 5px;
      font-size: 14px;
      color: #666;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      span {
        margin-left: 5px;
        font-size: 13px;
        color: #666;
      }
    }
  }
  .roles-wrap {
    padding-left: 20px;
    margin-bottom: 30px;
  }
  .spanText{
    color:#333;
    font-size:15px;
    width:50px
  }
  .spanDialog{
    color:#333;
    font-size:15px;
  }
}
</style>
