<template>
  <div class="expressionManagement">
    <div class="app-container">
      <div class="title-style1">
        <i class="icon icon-1"/>
        <h6>表达式管理</h6>
      </div>
      <el-card class="box-card">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="表达式名称">
            <el-input v-model="queryForm.expressionName" placeholder="表达式名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="表达式代码">
            <el-input v-model="queryForm.expressionId" placeholder="表达式代码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch(true)">查询</el-button>
            <el-button type="success" @click="addExpression" icon="el-icon-plus">新增表达式</el-button>
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
          <el-table-column prop="expressionDesc" label="表达式名称" align="center"/>
          <el-table-column prop="expressionId" label="表达式代码" align="center"/>
          <el-table-column prop="expressionFunction" label="表达式路径" align="center"/>
          <el-table-column prop="createdDate" label="创建时间" align="center" width="100px"/>
          <el-table-column prop="createdBy" label="创建人" align="center" width="80px"/>
          <el-table-column label="操作" align="center" width="210px">
            <template slot-scope="scope">
              <el-button type="warning" size="small" @click="editExpression(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="publish(scope.row)">发布</el-button>
              <el-button type="danger" size="small" @click="deleteExpression(scope.row)">删除</el-button>
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
      <el-dialog
        :title="isEdit? '编辑表达式' : '新增表达式'"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="1020px"
        @close="handleClose">
        <el-form :inline="true" :model="submitForm" ref="submitForm" :rules="rules" class="demo-form-inline">
          <el-form-item label="表达式名称" prop="expressionDesc">
            <el-input v-model="submitForm.expressionDesc" placeholder="表达式名称"></el-input>
          </el-form-item>
          <el-form-item label="表达式代码" prop="expressionId">
            <el-input v-model="submitForm.expressionId" placeholder="表达式代码"></el-input>
          </el-form-item>
          <el-form-item label="表达式方法名" prop="expressionFunction">
            <el-input v-model="submitForm.expressionFunction" placeholder="表达式方法名"></el-input>
          </el-form-item>
        </el-form>
        <editor
          ref="editor"
          v-model="submitForm.compilationSourcecode"
          theme="chrome"
          :lang="options.lang"
          :options="options"
          width="100%"
          height="560px"
          @init="initEditor"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitFn">保 存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import editor from "vue2-ace-editor";
import {
  addExpression,
  delExpression,
  editExpression,
  getExpressionList, publishExpression
} from "@/views/systemManage/expressionManagement/api";

export default {
  name: 'expressionManagement',
  components: {editor},
  props: {},
  data() {
    return {
      queryForm: {
        expressionName: '',
        expressionId: ''
      },
      submitForm: {
        expressionDesc: '',
        expressionId: '',
        expressionFunction: '',
        compilationExpress: true,
        compilationSourcecode: ''
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      isEdit: false,
      rules: {
        expressionDesc: [
          {required: true, message: '请输入表达式名称'}
        ],
        expressionId: [
          {required: true, message: '请输入表达式代码'}
        ],
        expressionFunction: [
          {required: true, message: '请输入表达式方法名'}
        ]
      },
      pageNum: 1,
      pageTotal: 0,
      pageSize: 10,
    };
  },
  computed: {
    options() {
      return {
        lang: 'java', // 语言
        // enableBasicAutocompletion: true, // 启动代码补全功能
        enableSnippets: true, // 启动代码段
        showPrintMargin: false // 显示打印边距
        // fontSize: this.config.fontSize, // 字体大小
        // enableLiveAutocompletion: true // 启用实时自动完成
        // readOnly: this.readOnly// 只读
      }
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.onSearch(true)
  },
  methods: {
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.onSearch()
    },
    editExpression(row) {
      this.submitForm = {
        ...row
      }
      this.isEdit = true
      this.dialogVisible = true
    },
    deleteExpression(row) {
      this.$confirm('是否删除该表达式?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        delExpression(row.expressionId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.onSearch()
        })
      }).catch(() => {
      });
    },
    publish(row) {
      this.$confirm('是否发布该表达式?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        publishExpression(row.expressionId).then(() => {
          this.$message({
            type: 'success',
            message: '发布成功'
          })
          this.onSearch()
        })
      }).catch(() => {
      });
    },
    onSearch(type) {
      if (type) this.pageNum = 1
      this.loading = true
      const params = {
        ...this.queryForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getExpressionList(params).then((res) => {
        this.tableData = res.resp.list
        this.pageTotal = res.resp.total
      }).finally(() => {
        this.loading = false
      })
    },
    addExpression() {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleClose() {
      this.submitForm = {
        expressionDesc: '',
        expressionId: '',
        expressionFunction: '',
        compilationExpress: true,
        compilationSourcecode: ''
      }
      this.$nextTick(() => {
        this.$refs.submitForm.clearValidate()
      })
    },
    submitFn() {
      this.$refs.submitForm.validate((valid) => {
        if (valid) {
          const URL = this.isEdit ? editExpression : addExpression
          URL(this.submitForm,this.submitForm.expressionId).then(() => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.dialogVisible = false
            this.onSearch()
          })
        } else {
          return false
        }
      })
    },
    initEditor() {
    }
  },
}


</script>

<style lang="scss" scoped>
.expressionManagement {

}
</style>

