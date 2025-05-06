<template>
  <div class="pendingApproval  appContainer bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>{{ $t('authority.authority') }}</h6>
    </div>
    <el-card class="box-card">
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t('pending.pendingList') }}</span>
      </div>
      <div class="content">
        <el-table
          ref="multipleTable"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="createdDate" :label="$t('userInfo.applyTime')" />
          <el-table-column prop="userId" :label="$t('pending.applicant')" />
          <!-- <el-table-column prop="authorityStatusText" label="状态" /> -->
          <el-table-column prop="approvalDate" :label="$t('userInfo.approvalTime')" />
          <el-table-column prop="approvalStatusText" :label="$t('userInfo.approvalStatus')" />
          <el-table-column prop="role" :label="$t('userInfo.approvalOpinion')" />
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button
                class="btn-border mini"
                @click="
                  getAuthorityDetail(scope.row.userAuthorityId),
                  (dialogVisible = true)
                "
              >{{ $t('userInfo.appDetail') }}</el-button>
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

        <div v-if="tableData.length > 0" class="text-center mt-30">
          <el-form
            ref="form"
            :model="form"
            :label-width="labelWidth.labelWidth"
            style="width:500px;margin:30px auto;padding:15px"
          >
            <el-divider
              v-if="tableData.length > 0"
              class="mt-60"
            >{{ $t('pending.approval') }}</el-divider>
            <el-form-item :label="$t('userInfo.approvalOpinion')">
              <el-input v-model="form.approvalOpinion" />
            </el-form-item>

            <el-button
              type="primary"
              @click="postAuthorityApproval(2)"
            >{{ $t('pending.batchFailure') }}</el-button>
            <el-button
              type="primary"
              @click="postAuthorityApproval(1)"
            >{{ $t('pending.volumeLicense') }}</el-button>
          </el-form>
        </div>
      </div>
    </el-card>
    <!-- 弹框显示详情 -->
    <el-dialog :title="$t('common.details')" :visible.sync="dialogVisible" width="1200px">
      <div class="roles-wrap">
        <span>{{ $t('userInfo.role') }}：</span>
        <span v-for="item in dialogData.roles" :key="item.roleId">
          <span v-if="item.roleId">
            {{ item.roleId }} - {{ item.roleName }}
          </span>
        </span>
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
              <span style="color:#333;font-size:15px;width:50px">{{ $t('userInfo.applicationName') }}：</span>
              <div>{{ item.applicationName }}</div>
            </div>
            <div class="flex-wrap">
              <span style="color:#333;font-size:15px;width:50px">{{ $t('userInfo.approvalDate') }}：</span>
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
            <div class="flex-wrap">
              <span style="color:#333;font-size:15px;width:100px">决策库目录：</span>
              <!-- {{ item.dimName }} -->
              <div class="dim-wrap">
                <span
                  v-for="dim in item.drCatalogueAuthorities"
                  :key="dim.decisionRepCatalogueId"
                >
                  {{ item.drCatalogueAuthorities.length === 1 && !dim.decisionRepCatalogueName ? '根目录' : dim.decisionRepCatalogueName }}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <!-- <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AuthorityPendingApproval,
  getAuthorityDetail,
  postAuthorityApproval
} from '@/api/systemManage/authority'
import { handleAuthoritySelfPend } from './utils'
import moment from 'moment'
export default {
  data() {
    return {
      lang: this.$store.state.settings.lang,
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      pageTotal: 10,
      dialogVisible: false,
      dialogData: {},
      form: {
        approvalOpinion: null
      },
      multipleSelection: []
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? '120px' : '80px'
      }
    }
  },
  created() {
    this.AuthorityPendingApproval()
  },
  methods: {
    AuthorityPendingApproval() {
      const data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      AuthorityPendingApproval(data).then(res => {
        const list = res.list.map(item => {
          const createdDate = moment(item.createdDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          const approvalDate = item.approvalDate
            ? moment(item.approvalDate).format('YYYY-MM-DD HH:mm:ss')
            : '--'
          return {
            ...item,
            createdDate,
            approvalDate,
            approvalStatusText: handleAuthoritySelfPend(item.approvalStatus),
            authorityStatusText: item.authorityStatus === '1' ? this.$t('pending.add') : this.$t('pending.del')
          }
        })
        this.tableData = list
        this.pageTotal = res.total
      })
    },
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.AuthorityPendingApproval()
    },
    getAuthorityDetail(userAuthorityId) {
      getAuthorityDetail(userAuthorityId).then(res => {
        this.dialogData = res
        console.log(this.dialogData)
      })
    },
    postAuthorityApproval(approvalStatus) {
      const userAuthorityIdList = this.multipleSelection.map(res => {
        return res.userAuthorityId
      })
      if (userAuthorityIdList.length === 0) {
        this.$message.error(this.$t('pending.selectApp'))
        return
      }
      const data = {
        approvalOpinion: this.form.approvalOpinion,
        approvalStatus,
        userAuthorityIdList
      }
      postAuthorityApproval(data).then(res => {
        res
        this.AuthorityPendingApproval()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss">
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
  width: 90%;
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
  margin-bottom: 30px;
  span {
    margin-right: 15px;
  }
}
</style>
