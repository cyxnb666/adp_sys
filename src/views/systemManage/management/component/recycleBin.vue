<template>
  <div class="recycleBin">
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
      <el-table-column prop="ruleNumber" label="规则编号" align="center"/>
      <el-table-column prop="regularName" label="规则名称" align="center"/>
      <el-table-column prop="label" label="标签" align="center"/>
      <el-table-column prop="ruleDeleteTime" label="规则删除时间" align="center"/>
      <el-table-column prop="createdBy" label="操作人" align="center"/>
      <el-table-column prop="deleteReason" label="删除原因" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="tableDelete(scope.$index)">还原</el-button>
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
  </div>
</template>

<script>

export default {
  name: 'recycleBin',
  components: {},
  props: {},
  data() {
    return {
      tableData: [
        {
          ruleNumber: 'RULE_010728',
          regularName: '福禄康瑞2018特殊产品...',
          label: '核保',
          ruleDeleteTime: '2024.09.02',
          whetherItWorks: '是',
          ruleUpdateTime: '2024.09.02',
          createdBy: '核保人',
          deleteReason: '删除原因',
        },
        {
          ruleNumber: 'RULE_010729',
          regularName: '福禄康瑞2018特殊产品...',
          label: '核保',
          ruleDeleteTime: '2024.09.02',
          whetherItWorks: '是',
          ruleUpdateTime: '2024.09.02',
          createdBy: '核保人',
          deleteReason: '删除原因',
        },
      ],
      loading: false,
      pageNum: 1,
      pageTotal: 10,
      pageSize: 10,
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    tableDelete(index){
      this.tableData.splice(index, 1)
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum
    },
  },
}


</script>

<style lang="scss" scoped>
.recycleBin {

}
</style>

