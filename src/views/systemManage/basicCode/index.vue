<template>
  <div class="manage app-container bg-color">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>基础数据管理</h6>
    </div>
    <el-card class="box-card mt-30">
      <div slot="header" class="card-head-style1 clearfix">
        <span>查看基础数据</span>
      </div>
      <div class="text-left flex-wrap flex-between">
        <div class="flex-1 flex-wrap">
          <el-button size="small"
                     icon="el-icon-plus"
                     class="btn-border mini"   @click="handleAdd">新增基础数据</el-button>
        </div>
        <div class="manage-search-wrap flex-1" @click.capture="hide">
          <el-select
            v-model="baseType"
            filterable
            @change="getDataList"
          >
            <el-option
              v-for="item in baseTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button type="primary" @click="getDataList">{{ $t('common.search') }}</el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width:100%"
          :empty-text="$t('common.noData')"
          height="580"
          class="mt-20"
          stripe
          border
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
        >
          <el-table-column
            prop="baseCode"
            label="数据代码"
          />
          <el-table-column
            prop="baseName"
            label="名称"
          />
          <el-table-column
            prop="baseType"
            label="类型代码"
          />
          <el-table-column
            prop="remark"
            label="备注"
          />
          <el-table-column
            :label="$t('common.operation')"
            class-name="custom-last-td"
            width="150"
          >
            <template slot-scope="scope">
              <!-- 编辑 -->
<!--              <el-button-->
<!--                size="mini"-->
<!--                class="mr-15"-->
<!--                type="warning"-->
<!--                @click="handleEdit(scope.row, scope.$index)"-->
<!--              >编辑</el-button>-->

              <!-- 删除用户 -->
              <el-popconfirm
                ref="delConfirm"
                title="确定删除数据吗？"
                :confirm-button-text="$t('common.ok')"
                :cancel-button-text="$t('common.cancel')"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                >{{ $t('button.delete') }}</el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>


    <!--  新增弹窗  -->
    <add-dialog
      ref="addDialog"
      :baseTypeList="baseTypeList"
      @handleClose="handleClose"
    />

  </div>
</template>

<script>
import {getCodeData, getCodeType, deleteCodeData} from '@/api/systemManage/basicCode'
import addDialog from './components/addDialog'
export default {
  components: {
    addDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      baseTypeList: [],
      baseType: '',
    }
  },
  created() {
    this.initData()
  },
  methods: {
    hide() {
      this.$refs.delConfirm.cancel()
    },
    /**
     * @Description: 初始化数据
     * @date 2023/10/5
     */
    initData () {
      // 获取所有的类型代码
      getCodeType().then(res => {
        this.baseTypeList = res
        this.baseType = res[0]
        setTimeout(() => this.getDataList(), 100)
      })
    },
    /**
     * @Description: 关闭弹窗
     * @date 2023/10/5
     */
    handleClose () {
      this.initData()
    },
    /**
     * @Description: 新增
     * @date 2023/10/4
     */
    handleAdd() {
      this.$refs.addDialog.showDialog({}, 'add')
    },
    /**
     * @Description: 修改
     * @date 2023/10/4
     */
    handleEdit(row, index) {
      this.$refs.addDialog.showDialog(row, 'edit')
    },
    /**
     * @Description: 删除
     * @date 2023/10/4
     */
    handleDelete(row) {
      deleteCodeData(row.baseDataId).then(res => {
        this.getDataList()
      })
    },
    /**
     * @Description: 获取数据列表
     * @date 2023/10/5
     */
    getDataList() {
      getCodeData(this.baseType).then(res => {
        this.tableData = res
      })
    },
  }
}

</script>
<style lang='scss'>
.manage {
  .custom-last-td {
    .cell {
      display: flex;
      &>span {
        margin-right: 15px;
      }
    }
  }
  .manage-search-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-input {
      max-width: 200px;
      margin-right: 15px;
    }
  }
}

</style>
