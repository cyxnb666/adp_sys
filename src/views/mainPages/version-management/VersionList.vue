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
                    :label="$t('versionList.versionTime')"
                    prop="datetime"
                    :rules="[
                      {
                        required: true,
                        message: $t('versionList.pleaseTime'),
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-date-picker
                      v-model="form.datetime"
                      type="datetime"
                      :placeholder="$t('versionList.pleaseTime')"
                    />
                  </el-form-item>
                </el-col>
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
                    {{ $store.state.app.applicationName }}</span>
                </div>
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> {{ $t('versionList.applicationId') }}：</span>
                  <span class="val"> {{ $store.state.app.applicationId }}</span>
                </div>
                <div class="item">
                  <span :class="lang==='en'?'enWidth':'name'"> {{ $t('newapp.descriptor') }}：</span>
                  <span class="val" style="min-height: 100px">
                    {{ $store.state.app.remark }}</span>
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
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" :label="$t('bomCreat.bomVersion')" width="120" />
                <el-table-column :label="$t('dashboard.updateTime')" width="200">
                  <template slot-scope="scope">
                    <div v-fittertime="scope.row.datetime" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="desc"
                  :label="$t('versionList.imprint')"
                  show-overflow-tooltip
                />
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
          <div class="text-center">
            <el-button class="btn-background mini mt-15" @click="compare">{{ $t('versionList.compare') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  PostVersion,
  GetVersionList
} from '@/api/mainPages/version-management'
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
      multipleSelection: []
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
  },
  methods: {
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
    GetVersionList(versionNumber) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        versionNumber: this.search
      }
      GetVersionList(data).then(res => {
        this.pageTotal = res.total
        const tableData = res.list.map(item => {
          return {
            name: item.versionNumber,
            datetime: item.versionDate,
            desc: item.editionStatement,
            versionMgtId: item.versionMgtId
          }
        })
        this.tableData = tableData
        this.$forceUpdate()
      })
    },
    createVersion() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            versionNumber: this.form.name,
            versionDate: this.form.datetime,
            applicationId: this.$store.state.app.applicationId,
            editionStatement: this.form.desc
          }
          PostVersion(data).then(() => {
            // 新增完成后查询版本
            this.pageNum = 1
            this.GetVersionList()
          })
        } else {
          return false
        }
      })
    },
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.GetVersionList()
    },
    getFormatVersionID() {
      const oDate1 = new Date(this.multipleSelection[0].datetime)
      const oDate2 = new Date(this.multipleSelection[1].datetime)
      const obj = {
        oneVersionMgtId: null,
        twoVersionMgtId: null
      }
      if (oDate1.getTime() > oDate2.getTime()) {
        obj.oneVersionMgtId = this.multipleSelection[1].versionMgtId
        obj.twoVersionMgtId = this.multipleSelection[0].versionMgtId
      } else {
        obj.oneVersionMgtId = this.multipleSelection[0].versionMgtId
        obj.twoVersionMgtId = this.multipleSelection[1].versionMgtId
      }

      return obj
    },
    compare() {
      if (this.multipleSelection.length !== 2) {
        return this.$message.error(this.$t('versionList.versionNum'))
      }
      const { oneVersionMgtId, twoVersionMgtId } = this.getFormatVersionID()

      this.$router.push({
        path: '/version/Comparison',
        query: {
          oneVersionMgtId,
          twoVersionMgtId
        }
      })
    },
    handleSearch() {
      this.GetVersionList()
    }
  }
}
</script>

<style lang="scss">
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
</style>
