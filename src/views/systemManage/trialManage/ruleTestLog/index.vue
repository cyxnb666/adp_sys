<template>
  <div class="poc-model rule-test-manage">
    <!-- <div class="app-container poc-model rule-test-manage"> -->
    <!-- <div class="title-style1">
            <i class="icon icon-1"></i><h6>测试记录</h6>
        </div>
        <el-form :inline="true" :model="form" class="rule-test-manage-form">
            <el-form-item label="类型" style="margin-right: 30px;">
                <div style="display: flex;">
                    <el-select v-model="form.type" placeholder="请选择" style="width: 125px;">
                        <el-option label="项目" value="0"></el-option>
                        <el-option label="规则" value="1"></el-option>
                        <el-option label="规则流" value="2"></el-option>
                    </el-select>
                    <el-input v-model="form.rule" placeholder="请输入名称、id"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="执行结果">
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option label="成功" value="0"></el-option>
                    <el-option label="失败" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="goTest">批量测试</el-button>
            </el-form-item>
        </el-form> -->
    <div class="mt-15" style="background: white;padding: 8px 15px;">
      <!-- <h4 class="title">测试记录列表</h4> -->
      <el-table
        :data="ruleTestList"
        style="margin-bottom: 20px;width: 100%;"
        border
        default-expand-all
        max-height="500"
        :header-cell-style="{
          background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
        }"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column prop="type" label="类型"/> -->
        <el-table-column prop="executeUser" label="执行人" />
        <el-table-column prop="executeDate" label="执行时间" />
        <el-table-column prop="pass" label="是否通过">
          <template slot-scope="{ row }">
            <span v-if="row.pass !== null" :class="['tc-red', 'tc-green'][row.pass || 0]">{{ row.pass==='1' ? '通过' : '不通过' }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="viewDetail(row.ruleSingleTestId)">查看详情</el-button>
            <!-- <el-button @click="compa" type="text">比较</el-button> -->
            <!-- <el-button @click="viewTest" type="text">查看</el-button> -->
            <!-- <el-button @click="delRuleTestLog" class="red" type="text">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      layout="total, prev, pager, next, sizes"
      :total="total"
    />
  </div>
</template>
<!-- handleSizeChange handleCurrentChange -->
<script>

import { ruleSingleTestHistoryExecuteData } from '@/api/mainPages/port'

export default {
  components: {
    // RuleTest,
  },
  props: {
    // type: String,
    // default: ''
    ruleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        type: '0',
        rule: '',
        status: ''
      },
      ruleTestList: [],
      testLogVisible: false,
      request: {},
      pageNum: 1,
      pageSize: 10,
      total: 1
    }
  },
  created() {
    this.test()
  },
  methods: {
    test() {
      const data = {
        ruleId: this.ruleId || this.$router.query.ruleId,
        applicationId: this.$store.state.app.applicationId,
        // ...this.pagination
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        total: this.total
      }
      ruleSingleTestHistoryExecuteData(data).then(res => {
        this.testLogVisible = true
        // this.request = {
        //   requestUrl: this.$store.state.settings.adp_config.baseURL + res.requestUrl,
        //   requestParam: res.requestParam.children
        // }
        // this.pagination.total = res.total
        this.total = res.total
        this.ruleTestList = res.list
      })
    },
    delRuleTestLog() {

    },
    viewTest() {

    },
    onSubmit() {

    },
    goTest() {
      this.$router.push({
        path: '/trial/ruleTesting'
      })
    },
    viewDetail(item) {
      // this.$router.push({
      //   path: '/rule/ruleTestDetail',
      //   query: {
      //     ruleSingleTestId: item
      //   }
      // })
      const url = `${location.pathname}#/rule/ruleTestDetail?ruleSingleTestId=${item}`
      window.open(url, '_blank')
    }
  }
}
</script>
<style scoped lang="scss">
.rule-test-manage {
    .rule-test-manage-form {
        padding: 20px 20px 0 20px;
        background: white;
    }
    .title {
        color: #3c3b3b;
        font-weight: initial;
    }
    .el-button--text.red {
        color: #f78989;
    }
    .tc-red {
        color: red;
    }
    .tc-green {
        color: green;
    }
}
</style>
