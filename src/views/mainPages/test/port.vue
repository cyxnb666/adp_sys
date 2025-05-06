<template>
  <div class="rule well">
    <div class="app-container">
      <el-card class="head-card version-card mt-15">
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('port.port') }}</span>
        </div>
        <div>
          <el-form ref="ValidateForm" class="demo-ruleForm">
            <el-row>
              <el-col :span="24">
                <!-- 接口说明 -->
                <h4>{{ $t('port.explain') }}：</h4>
                <span class="appParams">{{ $t('port.url') }}：{{ url }}{{ requestUrl }}</span>
                <br>
                <br>
                <span class="appParams">{{ $t('port.post') }}：POST</span>

              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <!--  请求参数 -->
                <h4>{{ $t('port.params') }}：</h4>
                <!-- <div v-for="(item,index) in requestParam" :key="index"> -->
                <el-table
                  :data="requestParam"
                  style="width: 100%;margin-bottom: 20px;"
                  row-key="fieldId"
                  border
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                >
                  <el-table-column
                    prop="label"
                    :label="$t('port.fName')"
                    width="300"
                  />
                  <el-table-column
                    prop="field"
                    :label="$t('port.field')"
                    width="300"
                  />
                  <el-table-column
                    prop="type"
                    :label="$t('port.type')"
                    width="300"
                  />
                  <el-table-column
                    prop="requiredField"
                    :label="$t('port.requiredField')"
                    width="297"
                  >
                    <template slot-scope="scope">{{ scope.row.requiredField===false?$t('port.no'):$t('port.yes') }}</template>
                  </el-table-column>
                </el-table>
                <!-- </div> -->

              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <!-- 请求示例 -->
                <h4>{{ $t('port.requestExample') }}：</h4>
                <json-viewer
                  :value="requestExample"
                  :expand-depth="5"
                  :closed="true"
                  copyable
                  boxed
                  sort
                />
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <!-- 返回参数 -->
                <h4>{{ $t('port.returnParam') }}：</h4>
                <el-table
                  :data="returnParam"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="key"
                    :label="$t('port.key')"
                    width="400"
                  />
                  <el-table-column
                    prop="value"
                    :label="$t('port.value')"
                  />
                </el-table>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <!-- 返回示例 -->
                <h4>{{ $t('port.returnExample') }}：</h4>
                <span class="appParams">{{ $t('port.success') }}：</span>
                <json-viewer
                  :value="returnExampleSuccess"
                  :expand-depth="5"
                  :closed="true"
                  copyable
                  boxed
                  sort
                />
                <br>
                <span class="appParams">{{ $t('port.fail') }}：</span>
                <json-viewer
                  :value="returnExampleFail"
                  :expand-depth="5"
                  :closed="true"
                  copyable
                  boxed
                  sort
                />
              </el-col>
            </el-row>

          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRuleExecutionDetails } from '@/api/mainPages/port'
export default {
  data() {
    return {
      url: this.$store.state.settings.adp_config.baseURL,
      requestUrl: '', // 请求路径
      requestParam: [], // 请求参数
      requestExample: [], // 请求示例
      returnParam: [], // 返回参数
      returnExampleSuccess: [],
      returnExampleFail: []
    }
  },
  created() {
    this.getRuleExecutionDetails()
  },
  methods: {
    getRuleExecutionDetails() {
      const applicationId = this.$store.state.app.applicationId
      getRuleExecutionDetails(applicationId).then(res => {
        this.requestUrl = res.requestUrl
        this.requestParam = res.requestParam.children
        this.requestExample = res.requestExample
        this.returnParam = Object.entries(res.returnParam[0]).map(([key, value]) => ({ key, value }))
        res.returnExample.map(item => {
          if (item.success === true) {
            this.returnExampleSuccess = item
          } else {
            this.returnExampleFail = item
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.appParams{
    font-size: 14px;
    color: #606266;
}
</style>
