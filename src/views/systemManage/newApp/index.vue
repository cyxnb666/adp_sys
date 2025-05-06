<template>
  <div class="new-app app-container mt-30">
    <el-card class="card">
      <div class="content">
        <div class="step-wrap">
          <div :class="active === 1 ? 'active' : ''" class="step-item">
            <div class="step-title">
              <i class="icon">1</i>
              <span>{{ $t('newapp.baseInfo') }}</span>
            </div>
          </div>
          <div :class="active === 2 ? 'active' : ''" class="step-item">
            <div class="step-title">
              <i class="icon">2</i>
              <span>{{ $t('newapp.choiceDecDim') }}</span>
            </div>
          </div>
          <div :class="active === 3 ? 'active' : ''" class="step-item">
            <div class="step-title">
              <i class="icon">3</i>
              <span>{{ $t('newapp.setOutput') }}</span>
            </div>
          </div>
        </div>
        <div v-show="active === 1" class="steps-wrap">
          <div class="steps-title">
            {{ $t('newapp.onestep') }}：
            <br>{{ $t('newapp.enterBaseInfo') }}
          </div>
          <el-form
            ref="ruleForm1"
            :hide-required-asterisk="true"
            :model="Form1"
            :rules="rulesForm1"
            class="ruleForm1"
            label-position="left"
            :label-width="lang==='en'?'130px':'110px'"
          >
            <el-form-item :label="$t('bomCreat.appName')" prop="name">
              <el-input v-model="Form1.name" />
            </el-form-item>
            <el-form-item :label="$t('common.id')" prop="nameId">
              <el-input v-model="Form1.nameId" placeholder="请输入字母或数字编号" />
            </el-form-item>
            <el-form-item :label="$t('newapp.descriptor')" prop="info">
              <el-input v-model="Form1.info" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('newapp.selectOkisNo')" prop="ruleForward" :label-width="lang==='en'?'230px':'110px'">
              <el-radio-group v-model="Form1.ruleForward">
                <el-radio label="0">{{ $t('common.all') }}</el-radio>
                <el-radio label="1">{{ $t('newapp.forward') }}</el-radio>
                <el-radio label="2">{{ $t('newapp.reverseDirection') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('bomManage.objModel')" prop="currentBomId" :label-width="lang==='en'?'170px':'110px'">
              <el-select v-model="Form1.currentBomId">
                <el-option
                  v-for="item in BomList"
                  :key="item.bomBaseInfoId"
                  :label="item.bomName"
                  :value="item.bomBaseInfoId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建新决策库" :label-width="lang==='en'?'230px':'110px'">
              <el-radio-group v-model="creatNewLib">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
              <el-form-item v-if="creatNewLib==='0'" prop="decisionRepositoryName">
                <el-input v-model="Form1.decisionRepositoryName" placeholder="请输入决策库名称" />
              </el-form-item>

              <el-form-item v-if="creatNewLib==='1'" style="display:block;" prop="selectdecisionLib">
                <el-select v-model="Form1.selectdecisionLib" placeholder="请选择决策库">
                  <el-option
                    v-for="item in selectdecisionLibList"
                    :key="item.decisionRepositoryId"
                    :label="item.repositoryName"
                    :value="item.decisionRepositoryId"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
            <div class="text-center">
              <el-button type="primary" @click="nextStep()">{{ $t('newapp.nextStep') }}</el-button>
            </div>
          </el-form>
        </div>
        <div v-show="active === 2" class="steps-wrap">
          <div class="steps-title">
            {{ $t('newapp.twoStep') }}：
            <br>{{ $t('newapp.twoStepInfo') }}
          </div>
          <transfer v-model="targetList" :source="transferList" />
          <div class="text-center mt-30">
            <el-button class="btn-border medium" @click="preStep()">{{ $t('newapp.preStep') }}</el-button>
            <el-button class="btn-background medium" @click="nextStep()">{{ $t('newapp.nextStep') }}</el-button>
          </div>
        </div>
        <div v-show="active === 3" class="steps-wrap steps-3">
          <div class="steps-title">
            {{ $t('newapp.lastStep') }}：
            <br>{{ $t('newapp.lastStepInfo') }}
          </div>
          <div>
            <div class="text-right">
              <el-button class="btn-border mini" icon="el-icon-plus" @click="addRow">{{ $t('newapp.addRow') }}</el-button>
            </div>
            <el-form ref="outputForm" :model="outputForm" :rules="outputForm.rules" class="mt-15">
              <el-table
                ref="multipleTable"
                :data="outputForm.tableData"
                :empty-text="$t('common.noData')"
                class="table-step3"
                stripe
                style="width:100%"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column :index="indexMethod" :label="$t('common.num')" type="index" width="80" />
                <el-table-column :label="$t('newapp.describe')" prop="name" width="220">
                  <template slot-scope="scope">
                    <el-form-item
                      v-if="scope.row.edit"
                      :prop="'tableData.' + scope.$index + '.resultName'"
                      :rules="outputForm.rules.resultName"
                    >
                      <el-input
                        v-model="scope.row.resultName"
                        @blur="() => {scope.row.resultName ? scope.row.edit = false : ''}"
                      />
                    </el-form-item>
                    <span v-else>{{ scope.row.resultName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :index="indexMethod"
                  :label="$t('newapp.sequence')"
                  prop="address"
                  type="index"
                  width="90"
                />
                <el-table-column :label="$t('common.operation')" prop="address">
                  <template slot-scope="scope">
                    <div class="flex-wrap align-item-center">
                      <el-button class="btn-handle" type="text" size="mini" :disabled="scope.row.resultOrder === 1" @click="scope.row.edit = true">
                        <div class="flex-wrap align-item-center">
                          <img class="icon-img" src="./images/icon-edit.png" alt=""> {{ $t('button.redact') }}
                        </div>
                      </el-button>
                      <span class="line-colmn">|</span>
                      <el-button class="btn-handle" type="text" size="mini" :disabled="scope.row.resultOrder === 1" @click="handleDelete(scope.$index, scope.row)">
                        <div class="flex-wrap align-item-center">
                          <img alt class="icon-img" src="./images/icon-delete.png">{{ $t('button.delete') }}
                        </div>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
            <div class="text-center mt-30">
              <el-button class="btn-border medium" @click="preStep">{{ $t('newapp.preStep') }}</el-button>
              <el-button class="btn-background medium" type="primary" :disabled="outputForm.tableData.length < 2" @click="submit">{{ $t('newapp.complete') }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { BASE } from '@/utils/regular'
import { createDecisionApplication, getDecisionApplication, getBomModelDimList, getBomdecisionLib } from '@/api/mainPages/decision'
import { getAllBomBaseInfo } from '@/api/systemManage/bom'
import transfer from './component/transfer'
import i18n from '@/languages/index'
export default {
  name: 'NewApp',
  components: {
    transfer
  },
  data() {
    const validateId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.t('newapp.enterId')))
      } else {
        this.getDecisionApplication().then(res => {
          if (res) {
            callback(new Error(i18n.t('newapp.newEnter')))
          } else {
            callback()
          }
        })
      }
    }
    return {
      active: 1,
      lang: this.$store.state.settings.lang,
      Form1: {
        name,
        currentBomId: this.$store.state.bom.bomBaseInfo,
        ruleForward: '0', // 正反向设置
        decisionRepositoryName: '', // 决策库名称
        selectdecisionLib: '' // 选择的决策库
      },
      creatNewLib: '0', // 是否新建决策库
      hasNameId: false,
      BomList: [], // 选择业务对象模型的列表
      transferList: [], // 维度信息来源列表
      targetList: [], // 维度最终值
      outputForm: {
        rules: {
          resultName: { type: 'string', required: true, message: this.$t('newapp.required'), trigger: 'blur' }
        },
        tableData: [
          {
            resultOrder: 1, // 顺序
            resultCode: 1, // 序号
            resultName: this.$t('common.pass'), // 描述
            checked: 0, // 是否选中
            edit: false // 是否编辑状态
          }
        ]
      },
      rulesForm1: {
        name: [{ required: true, message: i18n.t('bomCreat.enterAppName'), trigger: 'blur' }],
        nameId: [{ required: true, message: i18n.t('newapp.enterId'), trigger: 'blur' }, { validator: validateId, trigger: 'blur' }],
        info: [{ message: i18n.t('newapp.descriptor'), trigger: 'blur' }],
        currentBomId: [{ required: true, message: i18n.t('newapp.selectObjModel'), trigger: 'blur' }],
        decisionRepositoryName: [{ required: true, message: '请输入决策库名称', trigger: 'blur' }],
        selectdecisionLib: [{ required: true, message: '请选择决策库', trigger: 'blur' }]
      },
      selectdecisionLibList: []
    }
  },
  watch: {
    // 业务对象模型选项改变时，第二步的维度随之改变
    'Form1.currentBomId': {
      handler(newValue, oldValue) {
        if (!newValue) return
        this.getBomModelDimList()
        getBomdecisionLib(this.Form1.currentBomId).then(res => {
          this.selectdecisionLibList = res[0].decisionRepBaseInfo
          this.Form1.selectdecisionLib = this.selectdecisionLibList[0].decisionRepositoryId
        })
      },
      deep: true
    }
  },
  created() {
    this.getAllBomBaseInfo()
  },
  methods: {
    // 获取bom列表
    getAllBomBaseInfo() {
      getAllBomBaseInfo().then(res => {
        this.BomList = res
      })
    },
    // 获取决策应用列表
    getBomModelDimList() {
      getBomModelDimList(this.Form1.currentBomId).then(res => {
        this.transferList = res
      })
    },
    preStep() {
      this.active = this.active - 1
    },
    checkForm() {
      return new Promise((resolve, reject) => {
        let temp = null
        this.$refs.ruleForm1.validate(vaild => {
          if (vaild) {
            temp = true
          } else {
            reject(1)
            return
          }
          if (this.targetList.length > 0) {
            temp = true
          } else {
            reject(2)
            return
          }
          if (this.outputForm.tableData.length > 0) {
            this.$refs.outputForm.validate(vaild => {
              if (vaild) {
                temp = true
              } else {
                reject(3)
                return
              }
            })
            temp = true
          } else {
            reject(3)
            return
          }

          resolve(temp)
        })
      })
    },
    // 下一步
    nextStep() {
      // this.checkForm().then(res => {
      //   // 我成功了,把获取到的数据传出去
      // })
      this.checkForm().then((res) => {
        this.active = this.active + 1
      }).catch((err) => {
        if (err > this.active) {
          this.active = err
        } else {
          this.active !== 1 && this.$message.error({ message: this.$t('newapp.fullInfo') })
        }
        return
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const tempArray = []
      this.multipleSelection.forEach((item, index) => {
        this.outputForm.tableData.forEach((tableItem, i) => {
          if (item.resultCode === tableItem.resultCode) {
            tempArray.push(i)
          }
        })
      })
      tempArray.forEach(item => {
        this.$set(this.outputForm.tableData[item], 'checked', 1)
      })
    },
    indexMethod(index) {
      return index + 1
    },
    addRow() {
      let id = 1
      if (this.outputForm.tableData.length > 0) {
        const temp = this.outputForm.tableData[this.outputForm.tableData.length - 1].resultCode
        id = temp + 1
      }
      const obj = {
        resultOrder: id, // 顺序
        resultCode: id, // 序号
        resultName: null, // 描述
        checked: 0, // 是否选中
        edit: true // 是否编辑状态
      }
      this.outputForm.tableData.push(obj)
    },
    handleDelete(index, row) {
      this.outputForm.tableData.splice(index, 1)
    },
    submit() {
      this.checkForm().then(res => {
        this.createDecisionApplication()
      }).catch(res => {
        this.$message.error({ message: this.$t('newapp.fullInfo') })
        this.active = res
      })
      // this.createDecisionApplication()
    },
    createDecisionApplication() {
      const applicationDimDefinedModels = this.targetList.map((item, index) => {
        return {
          ...item,
          dimOrder: index + 1
        }
      })
      let selectdecisionLib = {}
      selectdecisionLib = this.selectdecisionLibList.find(item => {
        if (item.decisionRepositoryId === this.Form1.selectdecisionLib) {
          return item
        }
      })
      let libName = this.Form1.decisionRepositoryName
      if (this.creatNewLib === '0') {
        selectdecisionLib = {}
      } else {
        libName = ''
      }
      const data = {
        applicationDimDefinedModels: applicationDimDefinedModels,
        applicationName: this.Form1.name,
        applicationId: this.Form1.nameId,
        bomBaseInfoId: this.Form1.currentBomId,
        ruleForward: this.Form1.ruleForward,
        applicationResultModels: this.outputForm.tableData,
        remark: this.Form1.info,
        decisionRepositoryName: libName,
        selectdecisionLib: selectdecisionLib || {}
      }

      createDecisionApplication(data).then(res => {
        setTimeout(() => {
          // this.$router.push('/getApplicationList')
          window.location.reload()
        }, 2000)
      })
    },
    async getDecisionApplication() {
      const temp = await getDecisionApplication(this.Form1.nameId).then(res => {
        return res
      })
      return temp
    }
  }
}
</script>

<style lang="scss" scoped>
.new-app {
  .icon {
    display: block;
    width: 45px;
    height: 45px;
  }
  .content {
    padding: 45px 100px;
  }
}
.step-wrap {
  display: flex;
  justify-content: space-between;
  .step-item {
    display: flex;
    align-items: center;
    &.active {
      i {
        color: #fff;
        background-color: #0079ff;
        border: none;
        line-height: 45px;
      }
    }
    &:not(:last-child) {
      flex: 1;
      margin: 0 15px;
    }
    &:not(:last-child)::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e9e9e9;
    }
    .step-title {
      display: flex;
      align-items: center;
    }
    i {
      width: 45px;
      height: 45px;
      text-align: center;
      line-height: 41px;
      font-style: normal;
      margin-right: 12px;
      border-radius: 50%;
      color: rgba(0, 0, 0, 0.25);
      border: 2px solid rgba(0, 0, 0, 0.15);
      font-size: 20px;
    }
  }
}
.steps-wrap {
  // width: 1000px;
  margin: 30px 150px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #29344f;
  line-height: 34px;
  .steps-title {
    font-size: 20px;
    margin-bottom: 50px;
  }
}
.icon-img {
  width: 15px;
  height: 15px;
  margin-right: 3px;
}
::v-deep .table-step3 {
  text-align: center;
  th {
    background-color: #eff4f8;
    text-align: center;
    font-weight: normal;
  }
  td {
    font-weight: normal;
    text-align: center;
    color: #435475;
  }
  tr.el-table__row--striped td {
    background-color: #f9fdff;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
.btn-handle {
  width: auto;
  margin: 0 10px;
  &~.line-colmn {
    color: #eee;;
  }
}
</style>
