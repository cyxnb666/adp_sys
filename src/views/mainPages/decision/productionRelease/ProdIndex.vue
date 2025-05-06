<template>
  <div class="prodIndex app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>生产发布管理</h6>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix titleStyle">
            <div class="titleLeft">待发布</div>
            <div class="titleRight">
              <el-input
                v-model="search1"
                clearable
                size="small"
                width="200"
                placeholder="请输入规则名称、编号搜索"
                suffix-icon="el-input__icon el-icon-search"
              />
            </div>
          </div>
          <div class="content">
            <el-table
              :data="tableData"
              style="width:100%"
              :empty-text="$t('common.noData')"
              stripe
              border
              :header-cell-style="{
                background: '#EFF4F8',
                color: '#60769C',
                'font-weight': 'normal'
              }"
              :cell-style="{ color: '#435475' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="ruleId"
                label="规则编号"
                width="145"
              />
              <el-table-column
                prop="ruleName"
                label="规则名称"
                width="145"
              />
              <el-table-column
                prop="path"
                label="决策库路径"
                width="230"
              />
              <el-table-column
                prop="type"
                label="分类"
              />
              <el-table-column
                prop="status"
                label="发布类型"
              />
              <el-table-column
                prop="createdPerson"
                label="创建者"
              />
              <el-table-column
                prop="updataPerson"
                label="更改者"
              />
              <el-table-column
                prop="time"
                label="更改时间"
                width="120"
              />
              <el-table-column
                prop="runStatus"
                label="运行状态"
                width="210"
              >
                <template>
                  <el-radio v-model="radio" label="0" style="display: inline;">试运行</el-radio>
                  <el-radio v-model="radio" label="1" style="display: inline;">正式运行</el-radio>
                </template>
              </el-table-column>
            </el-table>
            <div class="text-left" style="margin-top: 45px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total1"
                :page-size="pageSize1"
                :current-page="pageNum1"
                @current-change="PageCurrentChange"
              />
            </div>
          </div>
          <div class="footer">
            <el-button
              type="primary"
            >发布</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix titleStyle">
            <div class="titleLeft">已发布</div>
            <div class="titleRight">
              <el-input
                v-model="search2"
                clearable
                size="small"
                width="200"
                placeholder="请输入规则名称、编号搜索"
                suffix-icon="el-input__icon el-icon-search"
              />
            </div>
          </div>
          <div class="content">
            <el-table
              :data="tableData"
              style="width:100%"
              :empty-text="$t('common.noData')"
              stripe
              border
              :header-cell-style="{
                background: '#EFF4F8',
                color: '#60769C',
                'font-weight': 'normal'
              }"
              :cell-style="{ color: '#435475' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="ruleId"
                label="规则编号"
                width="145"
              />
              <el-table-column
                prop="ruleName"
                label="规则名称"
                width="145"
              />
              <el-table-column
                prop="path"
                label="决策库路径"
                width="230"
              />
              <el-table-column
                prop="type"
                label="分类"
              />
              <el-table-column
                prop="status"
                label="发布类型"
              />
              <el-table-column
                prop="createdPerson"
                label="创建者"
              />
              <el-table-column
                prop="updataPerson"
                label="更改者"
              />
              <el-table-column
                prop="time"
                label="更改时间"
                width="120"
              />
              <el-table-column
                prop="runStatus"
                label="运行状态"
                width="210"
              >
                <template>
                  <el-radio v-model="radio" label="0" style="display: inline;">试运行</el-radio>
                  <el-radio v-model="radio" label="1" style="display: inline;">正式运行</el-radio>
                </template>
              </el-table-column>
            </el-table>
            <div class="text-left" style="margin-top: 45px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total2"
                :page-size="pageSize2"
                :current-page="pageNum2"
                @current-change="PageCurrentChange"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search1: '',
      search2: '',
      radio: '0',
      pageNum1: 1,
      pageSize1: 5,
      total1: 0,
      pageNum2: 1,
      pageSize2: 5,
      total2: 0,
      multipleSelection: [],
      tableData: [
        {
          ruleId: '7fb80_EW1451',
          ruleName: '09-体检规则集A',
          path: '48945体检规则集A/EW1451/09-体检规则集A',
          type: '规则',
          status: '更新',
          createdPerson: '张三',
          updataPerson: '李四',
          time: '2023.09.20',
          runStatus: '0'
        },
        {
          ruleId: '7fb80_EW1451',
          ruleName: '09-体检规则集A',
          path: '48945体检规则集A/EW1451/09-体检规则集A',
          type: '规则',
          status: '更新',
          createdPerson: '张三',
          updataPerson: '李四',
          time: '2023.09.20',
          runStatus: '0'
        }, {
          ruleId: '7fb80_EW1451',
          ruleName: '09-体检规则集A',
          path: '48945体检规则集A/EW1451/09-体检规则集A',
          type: '规则',
          status: '更新',
          createdPerson: '张三',
          updataPerson: '李四',
          time: '2023.09.20',
          runStatus: '0'
        },
        {
          ruleId: '7fb80_EW1451',
          ruleName: '09-体检规则集A',
          path: '48945体检规则集A/EW1451/09-体检规则集A',
          type: '规则',
          status: '更新',
          createdPerson: '张三',
          updataPerson: '李四',
          time: '2023.09.20',
          runStatus: '0'
        },
        {
          ruleId: '7fb80_EW1451',
          ruleName: '09-体检规则集A',
          path: '48945体检规则集A/EW1451/09-体检规则集A',
          type: '规则',
          status: '更新',
          createdPerson: '张三',
          updataPerson: '李四',
          time: '2023.09.20',
          runStatus: '0'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum1 = pageNum
    }
  }
}
</script>
<style lang="scss">
.prodIndex {
  .content {
    max-width: 1400px;
  }
  .titleStyle{
    display: flex;
    width: 100%;
    .titleLeft{
      flex: 1;
      display: flex;
      justify-content: flex-start;
    }
    .titleRight{
      width: 220px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .footer{
    text-align: center;
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
