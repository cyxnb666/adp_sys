<template>
  <div class="decisionBase">
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <!-- 该管理维度下的决策路径 -->
        <span>{{ $t('ruleList.decPath') }}</span>
      </div>
      <div class="content">
        <div class="mt-15 mb-15">
          <div class="flex-wrap">
            <div class="mr-15">
              <el-button
                class="btn-border"
                @click="openDialog"
              >{{ $t('ruleList.addPath') }}</el-button>
            </div>
            <div>
              <el-input
                v-model="search"
                clearable
                class="input-background"
                :placeholder="$t('ruleList.searchEnter')"
                suffix-icon="el-input__icon el-icon-search"
                @keyup.enter.native="searchEnter()"
              />
            </div>
          </div>
        </div>
        <el-table
          ref="table"
          class="decisionTable"
          :data="tableData"
          style="width: 100%;"
          stripe
          :empty-text="$t('common.noData')"
          :header-cell-style="{
            background: '#EFF4F8',
            color: '#60769C',
            'font-weight': 'normal'
          }"
          :cell-style="{ color: '#435475' }"
        >
          <!-- 操作 -->
          <el-table-column prop="date" :label="$t('common.operation')">
            <template slot-scope="scope">
              <div class="table-btn-wrap">
                <el-button size="mini" class="btn-set" type="text" @click="toSetting(scope.row)">{{ $t('common.set') }}</el-button>
                <!-- <el-button size="mini" type="text" @click="toggleExpand(scope.row)">查看维度</el-button> -->
                <el-button v-if="scope.row.DECISION_RULES_NUM === 0 && scope.row.DECISION_TABLE_NUM === 0 && scope.row.DECISION_FLOW_NUM === 0 &&scope.row.DECISION_TREE_NUM === 0" size="mini" class="btn-set" type="text" @click="delBtnFn(scope.row)">
                  {{ $t('pending.del') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div class="table-expand-wrapper">
                维度
                <span>{{ props.row.name }}</span>
              </div>
            </template>
          </el-table-column> -->
          <!-- 决策表数量 -->
          <el-table-column prop="DECISION_TABLE_NUM" :label="$t('ruleList.decTableNum')" />
          <el-table-column
            v-for="item in tableHead"
            :key="item.decisionNodeFieldId"
            :label="item.decisionNodeFieldName"
          >
            <template slot-scope="scope">
              <!-- {{ scope.row }} -->
              <span v-if="'defaultPath' !== item.decisionNodeField">
                {{ scope.row[item.decisionNodeField.toUpperCase()] || 0 }}
              </span>
              <span v-else>
                {{ scope.row[item.decisionNodeField] || $t('common.all') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- {{ addDecisionSelectList }} -->
    <br>
    <!-- {{ decisionAddComponentList }} -->
    <!-- 表单 新增决策路径 -->
    <el-dialog :title="$t('ruleList.addPath')" :visible.sync="dialogFormVisible">
      <el-form label-position="left">
        <el-row :gutter="10">
          <el-col
            v-for="(item, index) in addDecisionSelectList"
            :key="item.decisionNodeFieldId"
            :xs="24"
            :sm="24"
            :md="grid.grid"
            :lg="grid.grid"
            :xl="6"
          >
            <el-form-item
              :label="item.decisionNodeFieldName+'：'"
              :label-width="labelWidth.labelWidth"
              class="form-label-noPadding"
            >
              <el-select
                v-model="addForm[index].option"
                :placeholder="$t('common.pleaseChoose') + item.decisionNodeFieldName"
                value-key="key"
              >
                <el-option
                  :label="$t('common.all')"
                  :value="{ key: 'ALL', label: $t('common.all') }"
                />
                <el-option
                  v-for="items in decisionAddComponentList[item.codeService]"
                  :key="items.key"
                  :label="items.key + '-' + items.label"
                  :value="items"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="btn-border medium"
          @click="dialogFormVisible = false"
        >{{ $t('button.cancel') }}</el-button>
        <el-button
          class="btn-background"
          type="primary"
          @click="PostDeciurl"
        >{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog :title="$t('common.hint')" :visible.sync="dialogDelVisible" width="30%">
      <span>{{ $t('ruleList.delIsOk') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="delPathFn">{{ $t('button.OK') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PostDeciurl, delDeciurl } from '@/api/mainPages/deci'
import Bus from '@/utils/bus'
export default {
  name: 'RuleList',
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableHead: {
      type: Array,
      default: function() {
        return []
      }
    },
    addDecisionSelectList: {
      // 新决策路径的select列表
      type: Array,
      default: function() {
        return []
      }
    },
    decisionAddComponentList: {
      // 查询新增决策路径的select值列表
      type: Object,
      default: function() {
        return {}
      }
    },
    dimSettings: {
      type: Array,
      default: function() {
        return []
      }
    },
    nodeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      lang: this.$store.state.settings.lang,
      search: '',
      changeDimSettings: [],
      dialogFormVisible: false,
      addForm: null, // 表单
      decisionNodeList: [], // 新增决策路径的select组合
      dialogDelVisible: false,
      DECISION_URL_ID: null // 决策路径ID
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? 'auto' : '100px'
      }
    },
    grid() {
      return {
        grid: this.lang === 'en' ? 24 : 12
      }
    }
  },
  watch: {
    addDecisionSelectList(newValue, oldValue) {
      this.initForm()
    }
  },
  created() {
    this.initForm()
    Bus.$on('ComponentDimensionChange', (data) => { this.changeDimSettings = data })
  },
  methods: {
    // 删除按钮
    delBtnFn(row) {
      this.dialogDelVisible = true
      this.DECISION_URL_ID = row.DECISION_URL_ID
    },
    // 删除空的路径
    async delPathFn() {
      await delDeciurl(this.DECISION_URL_ID)
      this.dialogDelVisible = false
      this.$message({
        message: this.$t('ruleManage.delSuccess'),
        type: 'success'
      })
      this.$emit('refresh')
    },
    searchEnter() {
      console.log(this.search)
    },
    initForm() {
      const arr = this.addDecisionSelectList.map(item => {
        return {
          option: { key: 'ALL', label: this.$t('common.all') },
          nodeField: item.decisionNodeField,
          nodeFieldPath: item.decisionNodeFieldPath
        }
      })
      this.addForm = arr
    },

    toggleExpand(row) {
      const $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },
    // PostDeciurl 新增决策路径
    PostDeciurl() {
      let dimSettings = []
      if (this.changeDimSettings.length) { dimSettings = this.changeDimSettings } else { dimSettings = this.dimSettings }
      const decisionNodeList = []
      this.addForm.forEach(item => {
        if (item.option) {
          const obj = {
            ...item,
            nodeFieldBusinessCode: item.option.key,
            nodeFieldValue: item.option.label
          }
          decisionNodeList.push(obj)
        }
      })
      const data = {
        dimViewModel: {
          applicationId: this.$store.state.app.applicationId,
          processNodeId: this.nodeId,
          dimSettings
        },
        decisionUrl: {
          decisionNodeList
        }
      }
      this.dialogFormVisible = false
      PostDeciurl(data).then(res => {
        Bus.$emit('searchPath') // 调用搜索
      })
    },
    // 打开新增决策路径
    openDialog() {
      this.dialogFormVisible = true
      this.initForm()
    },

    // 去规则设置组件
    toSetting(item) {
      this.$emit('toggleComponent', 'RuleDetail', item['DECISION_URL_ID'])
    },
    forceUnlock(row) {
      this.$confirm('确认执行该操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('toggleComponent', 'RuleDetail', row['DECISION_URL_ID'])
        this.$message({
          type: 'success',
          message: '成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.decisionBase {
  .el-table th.gutter:last-of-type {
    display: table-cell!important;
  }
  .el-table__expand-icon {
    opacity: 0;
  }
  .table-expand-wrapper {
    background: #e6f2ff;
    margin: 0 -5px;
    padding: 15px;
    color: #82848a;
    font-size: 12px;
  }
}
.table-btn-wrap {
  padding: 10px 0;
}
.btn-set {
  span {
    display: flex;
    align-items: center;
  }
  .set {
    width: 17px;
    height: 17px;
    margin-right: 3px;
  }
}
.form-label-noPadding label {
  padding: 0;
}
</style>
