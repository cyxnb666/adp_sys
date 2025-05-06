<template>
  <el-dialog
    :title="$t('decisionTableItem.downloadDec')"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    class="decisionTablesDownloadWrapper"
  >
    <el-form :model="form" label-position="top">
      <el-row :gutter="15">
        <el-col :span="8">
          <h5>{{ $t('ruleManage.field') }}</h5>
          <el-form-item label="">
            <el-cascader
              v-model="form.conditionalList"
              :placeholder="$t('ruleManage.search')"
              filterable
              :options="bomBaseData"
              :props="{ multiple: true, checkStrictly: true }"
              popper-class="decision-table-download-cascader"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="24" :xl="10" :lg="24">
          <ul class="draggable-ul scroll">
            <draggable v-model="form.conditionalList">
              <li v-for="(items, i) in form.conditionalList" :key="i">
                <div
                  class="flex-wrap flex-between flex-align-items-center no-mb"
                >
                  <div>
                    {{ i + 1 }}.<i class="el-icon-rank" />
                    <span v-for="(item, index) in items" :key="item.path">
                      <template v-if="index">
                        _
                      </template>
                      {{ item && item.fieldName }}
                    </span>
                  </div>
                  <div>
                    <span
                      class="btn-delete"
                      @click="deleteItems(items, i)"
                    >删除</span>
                  </div>
                </div>
              </li>
            </draggable>
          </ul>
        </el-col> -->

        <el-col :span="8">
          <h5>{{ $t('ruleManage.decField') }}</h5>
          <el-form-item label="">
            <el-cascader
              v-model="form.decisionList"
              :placeholder="$t('ruleManage.search')"
              filterable
              :options="bomBaseData"
              :props="{ multiple: true, checkStrictly: true }"
              popper-class="decision-table-download-cascader"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="24" :xl="10" :lg="24">
          <ul class="draggable-ul scroll">
            <draggable v-model="form.decisionList">
              <li v-for="(items, i) in form.decisionList" :key="i">
                <div
                  class="flex-wrap flex-between flex-align-items-center no-mb"
                >
                  <div>
                    {{ i + 1 }}.<i class="el-icon-rank" />
                    <span v-for="(item, index) in items" :key="item.path">
                      <template v-if="index">
                        _
                      </template>
                      {{ item && item.fieldName }}
                    </span>
                  </div>
                  <div>
                    <span
                      class="btn-delete"
                      @click="deleteItemsDecision(items, i)"
                    >删除</span>
                  </div>
                </div>
              </li>
            </draggable>
          </ul>
        </el-col> -->

        <el-col :span="8">
          <h5>{{ $t('ruleManage.dataField') }}</h5>
          <el-form-item label="">
            <el-cascader
              v-model="form.dataFieldsList"
              :placeholder="$t('ruleManage.search')"
              filterable
              :options="bomBaseData"
              :props="{ multiple: true, checkStrictly: true }"
              popper-class="decision-table-download-cascader"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="24" :xl="10" :lg="24">
          <ul class="draggable-ul scroll">
            <draggable v-model="form.dataFieldsList">
              <li v-for="(items, i) in form.dataFieldsList" :key="i">
                <div
                  class="flex-wrap flex-between flex-align-items-center no-mb"
                >
                  <div>
                    {{ i + 1 }}.<i class="el-icon-rank" />
                    <span v-for="(item, index) in items" :key="item.path">
                      <template v-if="index">
                        _
                      </template>
                      {{ item && item.fieldName }}
                    </span>
                  </div>
                  <div>
                    <span
                      class="btn-delete"
                      @click="deleteItemsDataFields(items, i)"
                    >删除</span>
                  </div>
                </div>
              </li>
            </draggable>
          </ul>
        </el-col> -->
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">{{ $t('button.cancel') }}</el-button>
      <el-button
        type="primary"
        @click="postDownloadDtTemplate"
      >{{ $t('button.OK') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import { postDownloadFile } from '@/utils/utils'
import { getDecisionTableField } from '@/api/systemManage/bom'
export default {
  components: {
    // draggable
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },

    bomBaseInfoId: {
      type: String,
      default: ''
    },
    decisionRepositoryId: {
      type: String,
      default: ''
    },
    currentNodePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: { 'adp-token': getToken() },
      bomBaseData: [],
      form: {
        conditionalList: [],
        decisionList: [],
        dataFieldsList: []
      }
    }
  },
  computed: {
    action() {
      // 导入决策表，并关联决策库
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/import/decisionTable'
      )
    },
    // 上传文件的额外参数
    otherData() {
      return {
        decisionRepositoryId: this.decisionRepositoryId,
        path: this.currentNodePath
      }
    }
  },
  created() {
    this.getDecisionTableField()
  },
  methods: {
    getDecisionTableField() {
      getDecisionTableField(this.bomBaseInfoId).then(res => {
        this.bomBaseData = res
      })
    },

    postDownloadDtTemplate() {
      // let list1 = this.form.conditionalList.
      const data = {
        bomBaseInfoId: this.bomBaseInfoId,
        conditionFields: this.form.conditionalList,
        dataFields: this.form.dataFieldsList,
        executionFields: this.form.decisionList
      }
      if (this.form.conditionalList.length < 1) {
        this.$message.error(this.$t('decisionTable.select'))
        return
      }
      if (this.form.decisionList.length < 1) {
        this.$message.error(this.$t('decisionTable.selectDec'))
        return
      }
      postDownloadFile('/download/dt/template', data, this.$t('decisionTable.decTable'))
        .then(() => {
          this.$message.success(this.$t('decisionTable.download'))
          this.form.conditionalList = []
          this.form.decisionList = []
          this.form.dataFieldsList = []
          this.$emit('update:dialogFormVisible', false)
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    beforeClose() {
      this.$emit('update:dialogFormVisible', false)
    },
    uploadSuccess(res, file) {
      if (res.success) {
        this.$message.success(this.$t('decisionTable.upload'))
        this.$emit(
          'getDecisionRepositoryDetail',
          this.currentNodePath + '/' + file.name
        )
        this.$emit('update:dialogFormVisible', false)
      } else {
        this.$message.error(res.errMsg)
      }
    },
    uploadError(res) {
      this.$message.error(res.errMsg)
    },

    deleteItems(item, index) {
      const list = this._.cloneDeep(this.form.conditionalList)
      list.splice(index, 1)
      this.form.conditionalList = list // 需要重新赋值
    },
    deleteItemsDecision(item, index) {
      const list = this._.cloneDeep(this.form.decisionList)
      list.splice(index, 1)
      this.form.decisionList = list // 需要重新赋值
    },
    deleteItemsDataFields(item, index) {
      const list = this._.cloneDeep(this.form.dataFieldsList)
      list.splice(index, 1)
      this.form.dataFieldsList = list // 需要重新赋值
    }
  }
}
</script>
<style lang="scss">
.decisionTablesDownloadWrapper {
  .el-dialog {
    min-height: 500px;
    display: flex;
    flex-direction: column;
    .el-dialog__footer {
      margin-top: auto;
    }
  }
}
.decision-table-download-cascader {
  .el-cascader-menu {
    max-width: 450px;
  }
}
</style>
