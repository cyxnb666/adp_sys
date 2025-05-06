<template>
  <el-dialog title="测试执行" :visible.sync="dialogVisible" custom-class="rule-test-dialog" width="60%" @closed="$emit('update:dialogVisible', false)">
    <!-- <el-row>
            <el-col :span="24">
                <h4>{{ $t('port.explain') }}：</h4>
                <div style="display: flex;">
                    <el-button-group style="display: flex; width:100%;margin-right: 10px;">
                        <el-button disabled plain>POST</el-button>
                        <el-button disabled plain style="width:100%;text-align: left;">{{ request.requestUrl }}</el-button>
                        <el-button type="primary" icon="el-icon-s-promotion">发送</el-button>
                    </el-button-group>
                    <el-button type="primary" icon="el-icon-folder-opened">保存测试用例</el-button>
                    <el-button type="primary" icon="el-icon-document">生成报文</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <h4>{{ $t("port.params") }}：</h4>
                <el-table :data="request.requestParam" style="width: 100%; margin-bottom: 20px" row-key="fieldId" border default-expand-all max-height="300" :header-cell-style="{
                    background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
                }"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                    <el-table-column prop="label" :label="$t('port.fName')" show-overflow-tooltip/>
                    <el-table-column prop="field" :label="$t('port.field')" show-overflow-tooltip width="300"/>
                    <el-table-column prop="type" :label="$t('port.type')" show-overflow-tooltip width="120">
                        <template slot-scope="{ row }">
                            <div v-if="row.dataType === 'field'" class="el-input el-input--medium">{{ row.type }}</div>
                            <span v-else>{{ row.dataType }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" :label="$t('port.fieldValue')" width="300">
                        <template slot-scope="{ row }">
                            <div v-if="row.dataType === 'field'" class="el-input el-input--medium">
                                <input v-model="row.value" type="text" autocomplete="off" class="el-input__inner">
                            </div>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <h4>响应结果：</h4>
            <json-viewer :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
            <br>
            </el-col>
        </el-row> -->

    <el-form v-loading="loading" label-width="100px">
      <el-form-item label="用例名称：">
        <div style="display: flex;">
          <el-input size="small" />
          <!-- <el-button size="small" type="primary" icon="el-icon-folder-opened">保存测试用例</el-button>  style="margin-right: 10px;"
                    <el-button size="small" type="primary" icon="el-icon-document">生成报文</el-button> -->
        </div>
      </el-form-item>
      <el-form-item :label="$t('port.explain')+`：`">
        <div style="display: flex;">
          <el-button-group style="display: flex; width:100%;margin-right: 10px;">
            <el-button size="small" disabled plain>POST</el-button>
            <el-button size="small" disabled plain style="width:100%;text-align: left;">{{ request.requestUrl }}</el-button>
            <el-button size="small" type="primary" icon="el-icon-s-promotion" @click="send">发送</el-button>
          </el-button-group>
          <el-button size="small" type="primary" icon="el-icon-folder-opened">保存测试用例</el-button>
          <el-button size="small" type="primary" icon="el-icon-document">生成报文</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('port.params')+`：`">
        <!-- <div v-for="(item,index) in requestParam" :key="index"> -->
        <el-table
          :data="request.requestParam"
          row-key="fieldId"
          size="small"
          border
          default-expand-all
          max-height="300"
          :header-cell-style="{
            background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
          }"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="label" :label="$t('port.fName')" show-overflow-tooltip />
          <el-table-column prop="field" :label="$t('port.field')" show-overflow-tooltip width="300" />
          <el-table-column prop="type" :label="$t('port.type')" show-overflow-tooltip width="120">
            <template slot-scope="{ row }">
              <div v-if="row.dataType === 'field'">{{ row.type }}</div>
              <span v-else>{{ row.dataType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('port.fieldValue')" width="300">
            <template slot-scope="{ row }">
              <div v-if="row.dataType === 'field'" class="el-input el-input--small">
                <input v-model="row.value" type="text" autocomplete="off" class="el-input__inner">
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="requiredField" :label="$t('port.requiredField')" width="297">
                        <template slot-scope="scope">
                            {{ scope.row.requiredField === false ? $t("port.no") : $t("port.yes") }}
                        </template>
                    </el-table-column> -->
        </el-table>
        <!-- </div> -->
      </el-form-item>
      <el-form-item label="响应结果：">
        <!-- 返回示例 -->
        <json-viewer :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
        <!-- <span class="appParams">{{ $t('port.fail') }}：</span>
                <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort /> -->
      </el-form-item>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span> -->
  </el-dialog>
</template>

<script>

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    request: {
      type: Object,
      default: () => ({})
    }
    // ruleId: {
    //     type: String,
    //     default: ''
    // },
    // currentBomId: {
    //     type: String,
    //     required: true
    // },
  },
  data() {
    return {
      // visible: this.dialogVisible,
      returnExampleSuccess: null,
      loading: false,
      // returnExampleSuccess: {
      //     "applicationId": null,
      //     "businessKey": null,
      //     "resultCode": null,
      //     "resultName": null,
      //     "failMessageList": null,
      //     "executePathCount": 0,
      //     "executeRuleCount": 0,
      //     "filterPathCount": 0,
      //     "executeRuleSet": null,
      //     "success": true,
      //     "errMessage": null,
      //     "decisionTableResult": null,
      //     "executeRules": null,
      //     "output": null,
      //     "appExecuteResultDims": null,
      //     "executeDecisionTables": null,
      //     "executeTimes": null,
      //     "bomModelId": null
      // },
      returnExampleFail: {}
    }
  },
  methods: {
    send() {
      this.loading = true
      this.$emit('sendText', res => {
        this.loading = false
      })
      // setTimeout(() => {
      //     this.returnExampleSuccess = {
      //         "success": true,
      //         "errCode": "",
      //         "resp": {
      //             ruleId:"SINOSIG 000500",
      //             resultInfo: '成功',
      //             resultCode: 200
      //         },
      //     }
      //     this.loading = false
      // }, 500)
    }
  }
}
</script>

<style lang="scss">
.rule-test-dialog {
    .el-dialog__body .el-row{
        // max-height: 500px;
        overflow-y: auto;
    }

}
</style>
