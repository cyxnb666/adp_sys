<template>
  <div class="fourthRow" v-loading="loading">
    <div class="fourthRowHeader">
      <div class="fourthRowTitle">字段变量引用监控</div>
      <div class="more" @click="more">
        <i class="el-icon-more"></i>
      </div>
    </div>
    <div class="bomEchartsTree"></div>
    <el-dialog
      title="字段变量引用监控"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeFn"
      width="900px"
    >
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="包含规则变量/参数">
              <SelectBomLazyLoadTree ref="SelectBomLazyLoadTree" title="包含规则变量/参数" @selectedBom="selectedBom"/>
<!--              <el-cascader-->
<!--                style="width: 100%"-->
<!--                v-model="queryForm.fieldPaths"-->
<!--                :options="includeParamsOptions"-->
<!--                :props="props"-->
<!--                :show-all-levels="false"-->
<!--                collapse-tags-->
<!--                placeholder="包含规则变量/参数"-->
<!--                filterable-->
<!--                clearable-->
<!--              />-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="引用次数">
              <div class="numberOfCitations">
                <el-input-number
                  style="width: 50%"
                  v-model="queryForm.minCount"
                  :min="0"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
                <span style="margin: 0 10px">-</span>
                <el-input-number
                  style="width: 50%"
                  v-model="queryForm.maxCount"
                  :min="0"
                  :precision="0"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
          </el-col>
          <div class="onSearch">
            <el-button type="primary" @click="onSearch">查询</el-button>
          </div>
        </el-row>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="800px"
        :empty-text="$t('common.noData')"
        max-height="500"
        class="mt-20"
        :header-cell-style="{
          background: '#EFF4F8',
          color: '#60769C',
          'font-weight': 'normal',
        }"
        :cell-style="{ color: '#435475' }"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="fieldPath" label="字段路径" align="center" />
        <el-table-column
          prop="fieldLabel"
          label="字段名称(中文)"
          align="center"
        />
        <el-table-column
          prop="fieldName"
          label="字段名称(英文)"
          align="center"
        />
        <el-table-column prop="fieldType" label="数据类型" align="center" />
        <el-table-column
          prop="referenceCount"
          label="规则引用次数"
          align="center"
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
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getReferenceList,
  getReferenceTree,
} from "@/views/mainPages/dashboard/api";
import { getBomTree } from "@/views/systemManage/management/api";
import SelectBomLazyLoadTree from "@/components/SelectBomLazyLoadTree/index.vue";

export default {
  name: "fourthRow",
  components: {SelectBomLazyLoadTree},
  props: {},
  data() {
    return {
      loading: false,
      isAsync: false,
      tableLoading: false,
      dialogVisible: false,
      queryForm: {
        fieldPaths: [],
        minCount: 0,
        maxCount: 30,
      },
      pageNum: 1,
      pageTotal: 0,
      pageSize: 10,
      includeParamsOptions: [],
      tableData: [],
      props: {
        multiple: true,
        emitPath: false,
        value: "fieldPath",
        label: "name",
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.setTree();
  },
  methods: {
    selectedBom(fieldPaths) {
      this.queryForm.fieldPaths = fieldPaths;
    },
    // 分页功能
    PageCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.onSearch();
    },
    closeFn() {
      this.queryForm = {
        fieldPaths: [],
        minCount: 0,
        maxCount: 30,
      };
      this.$refs.SelectBomLazyLoadTree.dialogVisible = false
    },
    async setTree() {
      this.loading = true;
      const applicationId = this.$store.state.app.applicationId;
      const res = await getReferenceTree(applicationId);
      this.loading = false;
      const myChart = echarts.init(document.querySelector(".bomEchartsTree"));
      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",
            data: res.resp,
            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            emphasis: {
              focus: "descendant",
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        if (myChart) myChart.resize();
      });
    },
    more() {
      this.getBomTreeFn();
      this.dialogVisible = true;
      this.onSearch();
    },
    onSearch() {
      this.tableLoading = true;
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo,
        ...this.queryForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      getReferenceList(data)
        .then((res) => {
          this.tableData = res.resp.list;
          this.pageTotal = res.resp.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    getBomTreeFn() {
      getBomTree({ bomBaseInfoId: this.$store.state.bom.bomBaseInfo }).then(
        (res) => {
          this.includeParamsOptions = [res.resp];
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.fourthRow {
  padding: 20px;
  width: calc(40% - 34.8px);
  height: 430px;
  background-color: #ffffff;

  .fourthRowHeader {
    height: 18px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .fourthRowTitle {
      font-weight: 600;
      color: #3d3d3d;
      padding-left: 10px;
    }

    .more {
      cursor: pointer;
    }
  }

  .bomEchartsTree {
    width: 100%;
    height: calc(100% - 28px);
  }
}

.el-form-item {
  margin: 0;
}

.numberOfCitations {
  display: flex;
}

.onSearch {
  height: 82px;
  display: flex;
  align-items: flex-end;
}

.el-form-item {
  width: 100%;
}
</style>
