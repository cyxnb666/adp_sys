<template>
  <div class="app-container">
    <div class="title-style1">
      <i class="icon icon-1"/>
      <h6>{{ $t('bomManage.objModel') }}(BOM-Business Object Model)</h6>
    </div>
    <div class="bom-manage">
      <el-card>
        <div slot="header" class="card-head-style1 clearfix">
          <span>{{ $t('bomManage.selectModel') }}</span>
        </div>
        <div class="content">
          <span class="label" style="margin-right: 0;">{{ $t('bomManage.selectModel') }}</span>
          <el-select v-model="currentBomId" @change="getBomBaseInfo">
            <el-option
              v-for="item in BomList"
              :key="item.bomBaseInfoId"
              :value="item.bomBaseInfoId"
              :label="item.bomName"
            />
          </el-select>
        </div>
      </el-card>
      <el-form
        ref="ruleForm"
        class="mt-15"
        label-position="left"
        :hide-required-asterisk="true"
        :model="form"
        :rules="rules"
        label-width="135px"
      >
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('bomCreat.basic_info') }}</span>
          </div>
          <div class="content">
            <el-row>
              <el-col :span="16">
                <el-form-item :label="$t('bomCreat.modelName')" prop="bomName">
                  <el-input
                    v-model="form.bomName"
                    :placeholder="$t('bomCreat.enterModelName')"
                  />
                </el-form-item>
                <el-form-item :label="$t('bomCreat.bomBaseInfoId')">
                  <el-input v-model="form.bomBaseInfoId" disabled/>
                </el-form-item>
                <el-form-item :label="$t('bomCreat.bomVersion')">
                  <el-input v-model="form.bomVersion" disabled/>
                </el-form-item>
                <el-form-item :label="$t('bomCreat.remark')">
                  <el-input
                    v-model="form.remark"
                    :placeholder="$t('bomCreat.enterRemark')"
                  />
                </el-form-item>
                <div class="text-center">
                  <el-button
                    class="btn-background mini"
                    size="mini"
                    @click="saveBomBaseInfo"
                  >{{ $t('button.save') }}
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
    </div>

    <!-- 查看bom对应的决策库 -->
    <div class="mt-15">
      <div class="right-content">
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>查看bom对应的决策库</span>
          </div>
          <div class="content">
            <el-table
              class="decisionTable"
              :data="bomLibtableData"
              :empty-text="$t('common.noData')"
              style="width: 100%;margin-top:15px"
              stripe
              :header-cell-style="{
                background: '#EFF4F8',
                color: '#60769C',
                'font-weight': 'normal'
              }"
              :cell-style="{ color: '#435475' }"
            >
              <el-table-column prop="bomName" label="业务对象模型" width="550"/>
              <el-table-column prop="decisionRepBaseInfo" label="决策库">
                <template slot-scope="scope">
                  <div>
                    <span v-for="(item) in scope.row.decisionRepBaseInfo" :key="item.decisionRepositoryId"
                          disable-transitions effect="light" :style="{marginRight: '4px', marginBottom: '4px'}">
                      {{ item.repositoryName }}
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 配置Java对象 -->
    <div class="mt-15">
      <div class="right-content">
        <el-card>
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('bomCreat.javaObj') }}</span>
          </div>
          <div class="content">
            <div class="flex-wrap upload-wrap">
              <!-- <el-input v-model="uploadName" disabled /> -->
              <el-upload
                ref="upload"
                class="upload-demo"
                :headers="headers"
                :data="uploadData"
                :action="action"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
                :show-file-list="false"
                name="uploadFile"
                accept=".jar"
              >
                <el-button
                  size="small"
                  icon="el-icon-plus"
                  class="btn-border mini"
                >上传JAVA文件
                </el-button>
                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jar文件，且不超过500kb</div> -->
              </el-upload>
              <el-upload
                ref="bomUpload"
                class="upload-demo"
                :headers="headers"
                :action="actionBOM"
                :data="uploadData"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :file-list="bomFileList"
                :before-upload="beforeBOMUpload"
                :show-file-list="false"
                name="file"
                accept=".zip"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  class="btn-border mini"
                  icon="el-icon-plus"
                >上传BOM源代码
                </el-button>
              </el-upload>
            </div>
            <el-table
              class="bom-list-wrap"
              :empty-text="$t('common.noData')"
              :data="tableData"
              stripe
              style="width: 100%"
            >
              <el-table-column prop="createdDate" :label="$t('bomManage.upTime')" width="180">
                <template slot-scope="scope">
                  {{ parseTime(+new Date(scope.row.createdDate)) }}
                </template>
              </el-table-column>
              <el-table-column prop="mainBomClass" :label="$t('bomCreat.mainBomClass')"/>
              <el-table-column prop="hashValue" :label="$t('bomManage.MD5Value')"/>
              <el-table-column :label="$t('common.state')" width="220">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0" class="isUse">{{ $t('common.valid') }}</span>
                  <span v-else class="notUse"> {{ $t('common.invalid') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('bomManage.verify')">
                <template slot-scope="scope">
                  <span v-if="scope.row.checked">{{ $t('common.pass') }}</span>
                  <span v-else> {{ $t('common.pass') }}</span>
                </template>
              </el-table-column>
              <el-table-column width="180" :label="$t('common.operation')">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="downloadModelFn(scope.row.bomModelId,scope.row.bomFileContentName)"
                  >{{ $t('common.download') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="showPreview(scope.row)"
                  >{{ $t('common.ViewOnline') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="flex-wrap mt-15">
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="currentChange"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :title="$t('common.ViewOnline')"
      :visible.sync="previewDialogVisible"
      width="80%"
    >
      <div class="el-dialog-div flex-wrap mt-15">
        <el-card class="w400 mr-15" style="overflow-y: auto;">
          <div
            class="content "
            style="width:100% ;"
          >
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              class="filterText"
              suffix-icon="el-icon-search"
              clearable
              v-model="filterText">
            </el-input>

            <el-scrollbar class="filter-tree" view-style="height:100%;">
              <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                ref="tree">
                <template slot-scope="{ node, data }">
                  <div v-if="data.file">
                    <i class="el-icon-tickets"/>
                    {{ data.label }}
                  </div>
                  <div v-else>
                    <i class="el-icon-folder-opened"/>
                    {{ data.label }}
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
            <!--            <Tree-->
            <!--              id="id"-->
            <!--              :tree-data="treeData"-->
            <!--              style="min-width: 100%;"-->
            <!--              @selectField="handleNodeClick"-->
            <!--              :bom-base-info-id="form.bomBaseInfoId">-->
            <!--              &lt;!&ndash; 树结构的自定义标题插槽 &ndash;&gt;-->
            <!--              <template #customNode="{node}">-->
            <!--                <div v-if="node.file">-->
            <!--                  <i class="el-icon-tickets" />-->
            <!--                  {{ node.label }}-->
            <!--                </div>-->
            <!--                <div v-else>-->
            <!--                  <i class="el-icon-folder-opened" />-->
            <!--                  {{ node.label }}-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </Tree>-->
          </div>
        </el-card>
        <div class="relative" style="width:100%">
          <el-card class="flex-1 vh70 language-manage-fields-content">
            <div slot="header" class="card-head-style1 clearfix">
              {{ $t('zhManageObj.zhName') }}
            </div>
            <div class="content">
              <el-table
                ref="multipleTable"
                border
                :empty-text="$t('common.noData')"
                :data="preViewTableData"
                tooltip-effect="dark"
                style="width: 100%;height: 70vh;"
                class="scroll"
              >
                <el-table-column prop="field" :label="$t('common.field')"/>
                <el-table-column prop="type" :label="$t('common.type')"/>

                <el-table-column prop="label" :label="$t('zhManageObj.fieldName')" width="320">
                  <!-- <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.label"
                      :class="scope.row.ismodify ? 'modify' : ''"
                    />
                  </template> -->
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

  </div>
</template>

<script>
import {parseTime} from '@/utils/index'
import {getToken} from '@/utils/auth'
import {downloadFile} from '@/utils/utils'
import {
  getAllBomBaseInfo,
  getBomBaseInfo,
  updateBomBaseInfo,
  ClassDetail,
  getTheBomModelDetail
} from '@/api/systemManage/bom'
import {getBomdecisionLib} from '@/api/mainPages/decision'

export default {
  name: 'BomManage',
  data() {
    return {
      currentNode: {
        fields: [] // fields 原始数据
      }, // 当前选择的文件
      currentBomID: '',
      previewDialogVisible: false,
      treeData: [],
      BomList: [],
      bomFileList: [],
      currentBomId: this.$store.state.bom.bomBaseInfo,
      total: 10,
      pageSize: 10,
      pageNum: 1,
      form: {
        bomName: '',
        bomBaseInfoId: '',
        bomVersion: '',
        remark: ''
      },
      rules: {},
      uploadName: '',
      uploadData: {
        bomBaseInfoId: null
      },
      headers: {'adp-token': getToken()},
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      tableData: [],
      bomLibtableData: [],
      preViewTableData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    action() {
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/bom/xom/jar'
      )
    },
    actionBOM() {
      return (
        (this.$store.state.settings.adp_config.baseURL ||
          process.env.VUE_APP_BASE_API) + '/bom/xom/addJavaSourceFile'
      )
    },
  },
  watch: {
    'currentNode.fields': {
      handler(newName, oldName) {
        const temp = JSON.stringify(newName)
        this.preViewTableData = JSON.parse(temp)
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  created() {
    this.getAllBomBaseInfo()
    this.parseTime = parseTime
    if (this.$route.query.currentBomId) {
      this.currentBomId = this.$route.query.currentBomId || this.currentBomId
    }
    this.getBomBaseInfo()
    // this.getBomdecisionLib()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取bom对应的决策库
    getBomdecisionLib() {
      getBomdecisionLib(this.currentBomId).then(res => {
        this.bomLibtableData = res
      })
    },
    formatTreeNode(children, parent) {
      children.map((data) => {
        data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        data.fieldId = data.labelPath || 'root'
        // if (data.dataType === 'method') {
        // } else {
        //   data.labelPath = parent.labelPath ? `${parent.labelPath}${data.label}` : data.label
        // }

        if (data.children && data.children.length) {
          this.formatTreeNode(data.children || [], data)
        }
      })
    },

    getTreeData() {
      getTheBomModelDetail({bomBaseInfoId: this.currentBomID}).then(res => {
        this.formatTreeNode([res] || [], {})
        this.treeData = [res]
      })
    },
    showPreview(val) {
      this.currentBomID = val.bomBaseInfoId
      this.getTreeData()
      this.previewDialogVisible = true
    },
    handleNodeClick(current) {
      console.log(current)
      if (current.file) {
        const data = {
          bomBaseInfoId: this.currentBomID,
          filePath: current.filePath
        }
        ClassDetail(data).then(res => {
          const value = {
            ...current,
            fields: res
          }
          this.currentNode = value
        })
      } else {
        current.fields = []
        this.currentNode = current
      }
    },
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        this.BomList = res
      })
    },

    // beforeUpload
    beforeUpload(file) {
      if (!file.name.endsWith('.jar')) {
        this.$message.error(this.$t('bomCreat.onlyUploadJar'))
        return false
      }
      if (!this.currentBomId) {
        this.$message.error(this.$t('ruleManage.selectBom'))
        return false
      }
      this.$loading({
        text: this.$t('bomCreat.fileIng')
      })
    },
    beforeBOMUpload(file) {
      if (!file.name.endsWith('.zip')) {
        this.$message.error('仅支持ZIP格式文件,请重新上传')
        return false;
      }
      this.$loading({
        text: this.$t('bomCreat.fileIng')
      })
    },
    // 上传jar文件
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 本地获取file
    handleChange(file) {
      this.uploadName = file.name
    },
    // 拿到服务器返回的数据
    handleUploadSuccess(response) {
      this.$loading().close()
      if (response.success) {
        this.$message.success(this.$t('bomCreat.uploadSuccess'))
        this.getBomBaseInfo()
        localStorage.removeItem('ListByField')
      } else {
        this.uploadName = ''
        this.$message({
          showClose: true,
          message: response.errMsg,
          type: 'error',
          offset: 100
        })
      }
    },
    // 获取当前bom信息
    getBomBaseInfo() {
      if (!this.currentBomId) {
        return
      }
      const data = {
        bomBaseInfoId: this.currentBomId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getBomBaseInfo(data).then(res => {
        const {bomName, bomBaseInfoId, bomVersion, remark} = res.bomBaseInfo
        this.form.bomName = bomName
        this.form.bomBaseInfoId = bomBaseInfoId
        this.form.bomVersion = bomVersion
        this.form.remark = remark
        this.uploadData.bomBaseInfoId = bomBaseInfoId
        this.tableData = res.bomModelPageInfo.list
        this.total = res.bomModelPageInfo.total

        this.getBomdecisionLib()
      })
    },
    // 保存基本信息
    saveBomBaseInfo() {
      if (!this.currentBomId) {
        return this.$message.error(this.$t('ruleManage.selectBom'))
      }
      const data = {
        bomBaseInfoId: this.currentBomId,
        bomName: this.form.bomName,
        bomVersion: this.form.bomVersion,
        remark: this.form.remark
      }
      updateBomBaseInfo(data).then(res => {
        this.getAllBomBaseInfo()
      })
    },
    // sizeChange
    currentChange(num) {
      this.pageNum = num
      this.getBomBaseInfo()
    },

    // 下载业务对象模型
    downloadModelFn(id, name) {
      downloadFile('/downloadBomJar/' + id, null, name)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-1 {
  background-image: url(./images/icon-1.png);
}

.el-dialog-div {
  height: 80vh; //如果高度过高，可用max-height
  overflow: auto;
}

.bom-manage {
  .left-list {
    width: 400px;
    margin-right: 15px;
    // min-height: calc(100vh - 100px);
    .bomlist-wrap {
      li {
        padding: 10px;

        &.active {
          background: #eee;
        }
      }
    }
  }

  .right-content {
    flex: 1;

    .el-card {
      margin-bottom: 15px;
    }
  }
}

.card-footer {
  justify-content: flex-end;

  margin-top: 15px;
}

.upload-wrap {
  .upload-demo {
    min-width: 120px;
    margin-left: 15px;
  }
}

.bom-list-wrap {
  margin-top: 30px;
}

.label {
  display: inline-block;
  width: 135px;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
}

::v-deep .el-table {
  th {
    background-color: #eff4f8;
    font-weight: normal;
    // text-align: center;
    &:nth-child(6) {
      text-align: left;
    }
  }

  td {
    padding: 5px 0;
  }
}

.isUse {
  &::before {
    content: '';
    display: inline-block;
    border-radius: 50%;
    width: 9px;
    height: 9px;
    background: #177cff;
    margin-right: 5px;
  }
}

.notUse {
  &::before {
    content: '';
    display: inline-block;
    border-radius: 50%;
    width: 9px;
    height: 9px;
    background: #ff4d4f;
  }
}

.filterText {
  margin-bottom: 10px;
}
::v-deep .filter-tree {
  height: calc(100% - 40px);
  width: 100%;
  .el-scrollbar__wrap {
    overflow-x: auto;
    .el-scrollbar__view {
      white-space: nowrap;
      display: inline-block;
      min-width: 100%;
    }
  }
}
</style>
