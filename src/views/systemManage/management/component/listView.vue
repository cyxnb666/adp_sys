<template>
  <div class="listView">
    <el-form inline :model="submitForm" class="demo-form-inline" label-position="top">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="formLabel">规则名称</div>
          <el-form-item>
            <el-input style="width: 100%" label="规则名称" v-model="submitForm.name" placeholder="规则名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">规则编号</div>
          <el-form-item>
            <el-input style="width: 100%" v-model="submitForm.id" placeholder="规则编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">创建人</div>
          <el-form-item>
            <el-input style="width: 100%" v-model="submitForm.createBy" placeholder="创建人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">最后一次修改人</div>
          <el-form-item>
            <el-input style="width: 100%" v-model="submitForm.updatedBy" placeholder="最后一次修改人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">创建时间</div>
          <el-form-item>
            <el-date-picker
              style="width: 100%"
              v-model="submitForm.createTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" @change="handleDateChange($event, 'beginCreateTime', 'endCreateTime')">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <div class="formLabel">规则生效时间</div>
          <el-form-item>
            <el-date-picker
              style="width: 100%"
              v-model="submitForm.effectiveTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" @change="handleDateChange($event, 'beginEffectiveTime', 'endEffectiveTime')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">规则更新时间</div>
          <el-form-item>
            <el-date-picker
              style="width: 100%"
              v-model="submitForm.updateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" @change="handleDateChange($event, 'beginUpdateTime', 'endUpdateTime')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">是否有效</div>
          <el-form-item>
            <el-select v-model="submitForm.valid" placeholder="请选择" style="width: 100%" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">自定义标签</div>
          <el-form-item>
            <el-cascader
              clearable
              style="width: 100%"
              v-model="submitForm.attrTag"
              :options="groupList"
              :props="{ expandTrigger: 'hover' }"></el-cascader>
<!--            <el-input style="width: 100%" v-model="submitForm.attrTag" placeholder="自定义标签"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="formLabel">包含规则变量/参数</div>
          <el-form-item>
            <treeselect style="width: 100%" v-model="submitForm.includeParams" placeholder="包含规则变量/参数" :appendToBody="true"
                        :multiple="true" :options="includeParamsOptions" :normalizer="normalizer" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="flex-end">
          <el-button type="primary" @click="onSearch(true)">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" border style="width: 100%"
              :empty-text="$t('common.noData')"
              max-height="680"
              class="mt-20"
              :header-cell-style="{
              background: '#EFF4F8',
              color: '#60769C',
              'font-weight': 'normal'
            }"
              :cell-style="{ color: '#435475' }" v-loading="loading">
      <el-table-column prop="id" label="规则编号" align="center"/>
      <el-table-column prop="name" label="规则名称" align="center"/>
      <el-table-column prop="attrTags" label="标签" align="center"/>
      <el-table-column prop="effectiveTime" label="规则生效日期" align="center"/>
      <el-table-column prop="valid" label="是否有效" align="center">
        <template slot-scope="scope">
          {{ scope.row.valid ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" label="规则更新时间" align="center"/>
      <el-table-column prop="createdBy" label="创建人" align="center"/>
      <el-table-column prop="createdDate" label="创建时间" align="center"/>
      <el-table-column prop="latestUpdatedBy" label="最后修改人" align="center"/>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="tableEdit(scope.row)" :disabled="!scope.row.valid">修改</el-button>
          <el-button :type="scope.row.valid ? 'danger' : 'success'" size="small" @click="tableDelete(scope.row)">{{scope.row.valid ? '删除' : '恢复'}}</el-button>
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
    <template v-if="editPreviewExcel">
      <el-dialog :visible.sync="editPreviewExcel" custom-class="edit-decision-table-dialog" title="修改决策表"
                 width="80%">
        <EditDecisionPreview
          ref="ruleEdit"
          v-bind="{ url, bomBaseData, decisionRepositoryId, currentNodePath, type: 'edit' }"
          :decision-table-id="decisionData.decisionTableId"
          :decision-data-label="decisionData.name"
          :decisionData="decisionData"
          :bom-base-info-id="$store.state.bom.bomBaseInfo"
          @addSuccess="editPreviewExcel = false,$emit('addSuccess')"
        />
        <div slot="footer">
          <el-button @click="editPreviewExcel = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ $t('button.OK') }}</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>

// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getBomTree, getGroupTagList, ruleDelOrRe, ruleListView} from "@/views/systemManage/management/api";
import EditDecisionPreview from "@/views/systemManage/management/component/EditDecisionPreview.vue";

export default {
  name: 'listView',
  components: {
    EditDecisionPreview,
    Treeselect
  },
  props: {
    bomBaseData: {
      type: Array,
      default: null
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    // currentNodePath: {
    //   type: String,
    //   default: ''
    // },
  },
  data() {
    return {
      submitForm: {
        name: '',
        id: '',
        createBy: '',
        createTime: [],
        beginCreateTime: '',
        endCreateTime: '',
        updatedBy: '',
        effectiveTime: [],
        beginEffectiveTime: '',
        endEffectiveTime: '',
        updateTime: [],
        beginUpdateTime: '',
        endUpdateTime: '',
        valid: '',
        attrTag: [],
        includeParams: [],
        insuredName: '',
        policyChannel: '',
      },
      pageNum: 1,
      pageTotal: 0,
      pageSize: 10,
      editPreviewExcel: false,
      includeParamsOptions: [],
      groupList: [],
      options: [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ],
      loading: false,
      tableData: [],
      decisionData: {
        decisionTableId: ''
      }, // 决策表的数据
      currentNodePath: ''
    };
  },
  computed: {
    url() {
      // return `${this.$store.state.settings.adp_config.baseURL ||
      //   process.env.VUE_APP_BASE_API}/decision/rule/getRuleDefinedByTableId`
      return `${this.$store.state.settings.adp_config.baseURL ||
      process.env.VUE_APP_BASE_API}/export/decisionTable/${this.decisionData.decisionTableId}`
    }
  },
  watch: {},
  created() {
    this.getBomTreeFn()
    this.getGroupTagListFn()
    this.onSearch(true)
  },
  mounted() {
  },
  methods: {
    getGroupTagListFn() {
      getGroupTagList().then((res) => {
        this.groupList = res.resp.map(group => ({
          label: group.tagGroupName,       // 一级选项的 label
          value: group.tagGroupId,         // 一级选项的 value
          children: group.ruleAttributeTagInfos.map(tag => ({
            label: tag.attributeName,      // 二级选项的 label
            value: tag.tagId               // 二级选项的 value
          }))
        }))
      })
    },
    handleDateChange(event, beginKey, endKey) {
      if (event) {
        this.submitForm[beginKey] = event[0]
        this.submitForm[endKey] = event[1]
      } else {
        this.submitForm[beginKey] = ''
        this.submitForm[endKey] = ''
      }
    },
    normalizer(node) {
      return {
        id: node.fieldPath || '',
        label: node.name,
        children: node.children || []
      }
    },
    getBomTreeFn() {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      getBomTree(data).then((res) => {
        console.log(res.resp)
        this.includeParamsOptions = [res.resp]
      })
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.onSearch()
    },
    onSearch(type) {
      if (type) this.pageNum = 1
      const data = {
        ...this.submitForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        applicationId: this.$store.state.app.applicationId,
        attrTag: this.submitForm.attrTag && this.submitForm.attrTag.length ? this.submitForm.attrTag.join(',') : '',
      }
      this.loading = true
      ruleListView(data).then(res => {
        this.tableData = res.resp.list
        this.pageTotal = res.resp.total
      }).finally(() => {
        this.loading = false
      })
    },
    tableEdit(row) {
      if (row.type === '0') {
        this.$emit('ruleEdit', {...row, ruleId: row.id}, 0)
      } else {
        this.decisionData = {
          ...row,
          decisionTableId: row.id
        }
        this.currentNodePath = row.path + '/' + row.name
        this.editPreviewExcel = true
      }
    },
    tableDelete(row) {
      const data = {
        ruleId: row.id,
        isDeleted: row.valid ? '1' : '0'
      }
      ruleDelOrRe(data).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.onSearch()
      })
    },
    submit() {
      this.$refs.ruleEdit.saveTable()
    }
  },
}


</script>

<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin-bottom: 0;

  ::v-deep .el-form-item__label {
    padding-bottom: 0;
  }

  ::v-deep .el-form-item__content {
    width: 100%;
  }
}

.flex-end {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.formLabel {
  font-size: 14px;
  margin: 10px 0;
}
</style>

