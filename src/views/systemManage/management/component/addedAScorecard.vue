<template>
  <div class="addedAScorecard">
    <el-form label-position="top" :model="formInline" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="规则名称：">
            <el-input v-model="formInline.regularName" placeholder="规则名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="规则路径：">
            <el-input v-model="formInline.regularPaths" placeholder="规则路径"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="addALine">
          <el-button type="primary" @click="addALine">添加一行</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" border style="width: 100%;margin: 10px 0" :span-method="objectSpanMethod" size="mini">
      <el-table-column prop="attribute" label="属性" align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isAdd" v-model="scope.row.attribute" placeholder="选择变量" readonly
                    @focus="openVariable(scope.$index)"></el-input>
          <div v-else>
            {{ scope.row.attribute }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="conditions" label="条件" align="center">
        <template slot-scope="scope">
          <el-select style="width: 100%" v-if="scope.row.isAdd" v-model="scope.row.conditions" placeholder="请选择条件">
            <el-option
              v-for="item in conditions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div v-else>
            {{ scope.row.conditions }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分值" align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isAdd" v-model="scope.row.score" placeholder="输入分值"></el-input>
          <div v-else>
            {{ scope.row.score }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isAdd" type="text" @click="handleDelete(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;align-items: center">
      <div style="width: 130px">得分计算方式：</div>
      <el-select v-model="calculation" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="margin-top: 10px;display: flex;align-items: center">
      <div style="width: 130px">将得分值赋值给：</div>
      <el-select v-model="calculation" placeholder="请选择">
        <el-option
          v-for="item in assignmentOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-dialog title="选择因子" :visible.sync="bomTreeDataDialog"
               :close-on-click-modal="false" width="600px">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="bomTree"
        :default-expand-all="false"
        :default-expanded-keys="[bomTreeData && bomTreeData[0].children[0].fieldId]"
        :data="bomTreeData"
        show-checkbox
        node-key="fieldId"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @check-change="changeBom"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="bomTreeDataDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseBom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {bomClassAndField} from "@/api/systemManage/bom";

export default {
  name: 'addedAScorecard',
  components: {},
  props: {},
  data() {
    return {
      bomTreeDataDialog: false,
      bomTreeData: null,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formInline: {
        regularName: '',
        regularPaths: '',
      },
      tableData: [
        {
          attribute: '基础分',
          conditions: '',
          score: '198'
        },
        {
          attribute: '投保单的投保人的年龄',
          conditions: '小于或等于10',
          score: '0'
        },
        {
          attribute: '',
          conditions: '大于10并且小于等于20',
          score: '1'
        },
        {
          attribute: '',
          conditions: '大于20并且小于等于30',
          score: '2'
        },
        {
          attribute: '性别',
          conditions: '等于男',
          score: '3'
        },
        {
          attribute: '',
          conditions: '等于女',
          score: '4'
        },
        {
          attribute: '学历',
          conditions: '属于(硕士、博士)中一个',
          score: '10'
        },
        {
          attribute: '',
          conditions: '等于本科',
          score: '6'
        },
        {
          attribute: '',
          conditions: '等于大专',
          score: '1'
        },
        {
          attribute: '',
          conditions: '属于(中专，技校，高中}中一个',
          score: '-1'
        },
        {
          attribute: '',
          conditions: '其他',
          score: '0'
        },
        {
          attribute: '月收入',
          conditions: '大于等于3000并且小于5.000',
          score: '0'
        },
        {
          attribute: '',
          conditions: '大于等于5000并且小于8.000',
          score: '5'
        },
        {
          attribute: '',
          conditions: '大于8.000',
          score: '8'
        },
      ],
      options: [
        {
          value: '1',
          label: '求和'
        },
        {
          value: '2',
          label: '加权求和'
        },
        {
          value: '3',
          label: '自定义'
        }
      ],
      assignmentOptions: [
        {
          value: '1',
          label: '选择变量'
        },
      ],
      calculation: '',
      index: null,
      conditions: [
        {label: '等于', value: 'EQ'},
        {label: '不等于', value: 'NE'},
        {label: '小于', value: 'LT'},
        {label: '大于', value: 'GT'},
        {label: '大于等于', value: 'GE'},
        {label: '为空', value: 'IS_NULL'},
        {label: '不为空', value: 'IS_NOT_NULL'}
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    changeBom(data, isCheck) {
      if (isCheck) {
        this.$refs.bomTree.setCheckedKeys([data.fieldId])
      }
    },
    saveChooseBom() {
      const data = this.$refs.bomTree.getCheckedNodes()
      this.tableData[this.index].attribute = data[0].label
      this.bomTreeDataDialog = false
      this.index = null
    },
    addALine() {
      this.tableData.push({
        isAdd: true,
        attribute: '',
        conditions: '',
        score: ''
      })
    },
    openVariable(index) {
      const data = {
        bomBaseInfoId: this.$store.state.bom.bomBaseInfo
      }
      bomClassAndField(data).then(res => {
        this.bomTreeData = [res]
        this.index = index
        this.bomTreeDataDialog = true
      })
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    objectSpanMethod({rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex === 1) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if ([2, 3].includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if (rowIndex === 4) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else if ([5].includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if (rowIndex === 6) {
          return {
            rowspan: 5,
            colspan: 1
          };
        } else if ([7, 8, 9, 10].includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if (rowIndex === 11) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if ([12, 13].includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
      }
    }
  },
}


</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  padding-bottom: 0;
}

::v-deep .el-form-item {
  margin-bottom: 0;
}

.addALine {
  height: 72px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>

