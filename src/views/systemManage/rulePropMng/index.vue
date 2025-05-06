<template>
  <div class="rulePropMng">
    <div class="app-container">
      <div class="title-style1">
        <i class="icon icon-1"/>
        <h6>规则属性管理</h6>
      </div>
      <el-card class="box-card">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="属性分组">
            <el-select v-model="queryForm.tagGroupId" placeholder="属性分组" clearable>
              <el-option v-for="(item,index) in groupList" :key="index" :label="item.tagGroupName"
                         :value="item.tagGroupId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性名称">
            <el-input v-model="queryForm.attributeName" placeholder="属性名称" style="width: 235px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="groupManagement">分组管理</el-button>
            <el-button type="success" @click="addAttributeTag">新增属性标签</el-button>
          </el-form-item>
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
          <el-table-column prop="attributeName" label="属性名称" align="center"/>
          <el-table-column prop="tagGroupName" label="分组" align="center"/>
          <el-table-column prop="attributeDesc" label="描述" align="center"/>
          <el-table-column prop="ruleRelCount" label="规则引用" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.ruleRelCount">{{ scope.row.ruleRelCount }}个规则引用</div>
              <div v-else>暂无</div>
            </template>
          </el-table-column>
          <el-table-column prop="isValid" label="是否有效" align="center">
            <template slot-scope="scope">
              {{ scope.row.isValid === '1' ? '有效' : '失效' }}
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" align="center"/>
          <el-table-column prop="createdByName" label="创建人" align="center"/>
          <el-table-column label="操作" align="center" width="220px">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editAttribute(scope.row)">编辑</el-button>
<!--              <el-button type="warning" size="small" @click="operation(scope.row, 0)">失效</el-button>-->
              <el-button type="danger" size="small" @click="operation(scope.row, 1)">删除</el-button>
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
      </el-card>
    </div>
    <el-dialog
      title="属性分组管理"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="handleClose">
      <el-button type="primary" @click="addGroup" size="mini" icon="el-icon-plus"></el-button>
      <el-table :data="groupList" border style="width: 100%"
                :empty-text="$t('common.noData')"
                max-height="680"
                class="mt-20"
                :header-cell-style="{
              background: '#EFF4F8',
              color: '#60769C',
              'font-weight': 'normal'
            }"
                :cell-style="{ color: '#435475' }">
        <el-table-column prop="group" label="分组名称" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tagGroupName" size="mini" placeholder="请输入分组名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tagGroupDesc" size="mini" placeholder="请输入描述"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220px">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="saveGroupFn(scope.row)" :loading="scope.row.loading">保存
            </el-button>
            <el-button type="danger" size="small" @click="deleteGroupFn(scope.row,scope.$index)"
                       :loading="scope.row.loading">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="attributeTagDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="attributeTagClose">
      <el-form ref="submitForm" :model="submitForm" :rules="rules" class="demo-form-inline" label-width="80px">
        <el-form-item label="属性名称" prop="attributeName">
          <el-input v-model="submitForm.attributeName" placeholder="请输入属性名称"></el-input>
        </el-form-item>
        <el-form-item label="属性描述" prop="attributeDesc">
          <el-input v-model="submitForm.attributeDesc" placeholder="请输入属性描述"></el-input>
        </el-form-item>
        <el-form-item label="属性分组" prop="tagGroupId">
          <el-select v-model="submitForm.tagGroupId" placeholder="属性分组" @change="selectedTagGroup"
                     style="width: 100%">
            <el-option v-for="(item,index) in groupList" :key="index" :label="item.tagGroupName"
                       :value="item.tagGroupId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="attributeTagDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitFn" :loading="submitLoading">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  deleteAttributeTag,
  deleteGroup,
  getAttributeTags,
  getGroupList, invalid,
  saveAttributeTag,
  saveGroup
} from "@/views/systemManage/rulePropMng/api";

export default {
  name: 'rulePropMng',
  components: {},
  props: {},
  data() {
    return {
      queryForm: {
        tagGroupId: '',
        attributeName: ''
      },
      pageNum: 1,
      pageTotal: 0,
      pageSize: 10,
      tableData: [],
      groupList: [],
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      attributeTagDialogVisible: false,
      title: '新增属性标签',
      submitForm: {
        tagGroupId: '',
        tagGroupName: '',
        attributeName: '',
        attributeDesc: ''
      },
      rules: {
        attributeName: [
          {required: true, message: '请输入属性名称'}
        ],
        attributeDesc: [
          {required: true, message: '请输入属性描述'}
        ],
        tagGroupId: [
          {required: true, message: '请选择属性分组'}
        ]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getGroupListFn()
    this.onSearch(true)
  },
  mounted() {
  },
  methods: {
    submitFn() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          saveAttributeTag(this.submitForm).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.attributeTagDialogVisible = false
            this.onSearch()
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    editAttribute(row) {
      this.submitForm = {
        ...row
      }
      this.title = '编辑属性标签'
      this.attributeTagDialogVisible = true
    },
    operation(row, type) {
      this.$confirm('删除后将无法找回，请确认是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const URL = type ? deleteAttributeTag : invalid
        URL(row.tagId).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.onSearch()
        })
      }).catch(() => {

      });

    },
    groupManagement() {
      this.getGroupListFn()
      this.dialogVisible = true
    },
    addAttributeTag() {
      this.title = '新增属性标签'
      this.attributeTagDialogVisible = true
    },
    selectedTagGroup(value) {
      if (value) this.submitForm.tagGroupName = this.groupList.find(item => item.tagGroupId === value).tagGroupName
    },
    saveGroupFn(row) {
      if (!row.tagGroupName) {
        this.$message({
          type: 'warning',
          message: '分组名称不能为空'
        })
        return
      }
      saveGroup(row).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getGroupListFn()
      }).finally(() => {
      })
    },
    addGroup() {
      this.groupList.push({
        tagGroupName: '',
        tagGroupDesc: '',
        loading: false
      })
    },
    deleteGroupFn(row, index) {
      if (row.tagGroupId) {
        row.loading = true
        deleteGroup(row.tagGroupId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getGroupListFn()
        }).finally(() => {
          row.loading = true
        })
      } else {
        this.groupList.splice(index, 1)
      }
    },
    handleClose() {
      this.groupList = this.groupList.filter(item => item.tagGroupId)
    },
    attributeTagClose() {
      this.submitForm = {
        tagGroupId: '',
        tagGroupName: '',
        attributeName: '',
        attributeDesc: ''
      }
      this.$nextTick(() => {
        this.$refs.submitForm.clearValidate()
      })
    },
    getGroupListFn() {
      getGroupList().then(res => {
        this.groupList = res.resp
        console.log(this.groupList)
      })
    },
    onSearch(type) {
      if (type) this.pageNum = 1
      this.loading = true
      const data = {
        ...this.queryForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      getAttributeTags(data).then(res => {
        this.tableData = res.resp.list
        this.pageTotal = res.resp.total
      }).finally(() => {
        this.loading = false
      })
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.onSearch()
    },
  },
}


</script>

<style lang="scss" scoped>
.formLabel {
  font-size: 14px;
  margin-bottom: 10px;
}
</style>

