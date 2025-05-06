<template>
  <div class="inform app-container bg-color">
    <!-- <div class="title-style1">
      <i class="icon icon-1" />
      <h6>通知管理</h6>
    </div> -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('inform.inform') }}</span>
          </div>
          <el-tabs v-model="inform.functionType" type="border-card" @tab-click="tabClick">
            <el-tab-pane v-for="item in paneList" :key="item.label" :label="item.label" :name="item.name" />
            <div class="content">
              <el-form
                ref="ruleForm"
                :label-position="labelPosition"
                :hide-required-asterisk="true"
                :model="inform"
                :label-width="labelWidth.labelWidth"
                class="demo-ruleForm"
              >
                <!-- <el-form-item label="通知类型" prop="bomName"> -->
                <!-- <el-select v-model="inform.type" placeholder="请选择">
                      <el-option label="一级审核通过" value="1" />
                      <el-option label="二级审核通过" value="2" />
                    </el-select> -->
                <!-- </el-form-item> -->

                <el-form-item
                  :label="$t('inform.recAddress')"
                  prop="recipientMailbox"
                  :rules="emailRule"
                >
                  <!-- <el-input v-model="inform.addressee" /> -->
                  <el-select
                    v-model="inform.recipientMailbox"
                    multiple
                    filterable
                    remote
                    allow-create
                    default-first-option
                    :remote-method="remoteMethod"
                    :loading="loading"
                    :placeholder="$t('inform.enterEmail')"
                    @keydown.enter.native="getDataByKeywords"
                    @change="handleChangeSelect(inform.recipientMailbox)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="收件人邮箱">
                  <el-input v-model="inform.recipientMailbox">
                    <el-tooltip slot="suffix" class="item" effect="dark" content="多人以分号分割" placement="top-start">
                      <i class="el-icon-question table-msg" />
                    </el-tooltip>
                  </el-input>

                </el-form-item> -->
                <el-form-item
                  :label="$t('inform.bccMailbox')"
                  prop="bccMailbox"
                  :rules="bccMailboxRule"
                >
                  <!-- <el-input v-model="inform.addressee" /> -->
                  <el-select
                    v-model="inform.bccMailbox"
                    multiple
                    filterable
                    remote
                    allow-create
                    default-first-option
                    :remote-method="remoteMethod"
                    :loading="loading"
                    :placeholder="$t('inform.enterEmail')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('inform.theme')">
                  <el-input v-model="inform.mailboxMotif" />
                </el-form-item>
                <el-form-item :label="$t('inform.text')">
                  <el-input v-model="inform.mailboxText" :autosize="{minRows: 5}" type="textarea" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">{{ $t('button.submit') }}</el-button>
                </el-form-item>

              </el-form>
            </div>
          </el-tabs>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMailboxQuery, mailboxSave } from '@/api/systemManage/inform'
import i18n from '@/languages/index'
export default {
  data() {
    var validateEmail = (rule, val, callback) => {
      const temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
      const value = val[val.length - 1]
      if (!temp.test(value)) {
        callback(new Error(i18n.t('inform.enterEmailFormat')))
        this.inform.recipientMailbox.pop()
      } else {
        callback()
      }
    }
    var validateBccMailbox = (rule, val, callback) => {
      const temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
      const value = val[val.length - 1]
      if (!temp.test(value)) {
        callback(new Error(i18n.t('inform.enterEmailFormat')))
        this.inform.bccMailbox.pop()
      } else {
        callback()
      }
    }
    return {
      value: '',
      options: [],
      loading: false,
      inform: {
        functionType: 'stairLevel',
        id: '',
        mailboxMotif: '',
        recipientMailbox: [],
        bccMailbox: [],
        mailboxText: ''
      },
      labelPosition: 'right',
      emailList: [
        '@qq.com',
        '@163.com',
        '@126.com'
      ],
      paneList: [
        {
          label: i18n.t('inform.stairLevel'),
          name: 'stairLevel'
        },
        {
          label: i18n.t('inform.secondLevel'),
          name: 'secondLevel'
        },
        {
          label: i18n.t('inform.approve'),
          name: 'approve'
        }
      ],
      emailRule: [
        { required: true, message: i18n.t('inform.enterRecEmail'), trigger: ['blur', 'change'], type: 'array' },
        { validator: validateEmail, trigger: ['blur', 'change'] }
      ],
      bccMailboxRule: [
        { required: true, message: i18n.t('inform.enterCCEmail'), trigger: ['blur', 'change'], type: 'array' },
        { validator: validateBccMailbox, trigger: ['blur', 'change'] }
      ],
      lang: this.$store.state.settings.lang
    }
  },
  computed: {
    labelWidth() {
      return {
        labelWidth: this.lang === 'en' ? '125px' : '85px'
      }
    }
  },
  mounted() {
    this.getTabsInfo()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.emailList.map(item => {
            return (query + item)
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    handleChangeSelect(val) {
      const temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
      const value = val[val.length - 1]
      if (!temp.test(value)) {
        window.console.log('校验不通过')
        // this.inform.recipientMailbox.pop()
      } else {
        window.console.log('通过')
      }
    },
    getDataByKeywords() {
      console.log(1213)
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        console.log(valid)
        if (valid) {
          // eslint-disable-next-line prefer-const
          let data = JSON.parse(JSON.stringify(this.inform))
          data.recipientMailbox = data.recipientMailbox.join(';')
          data.bccMailbox = data.bccMailbox.join(';')
          await mailboxSave(data)
        }
      })
    },
    tabClick(tab, ev) {
      this.getTabsInfo()
    },
    getTabsInfo() {
      getMailboxQuery(this.inform.functionType)
        .then(res => {
          this.inform.id = res.id
          this.inform.mailboxMotif = res.mailboxMotif || ''
          this.inform.recipientMailbox = res.recipientMailbox && res.recipientMailbox.split(';') || ''
          this.inform.mailboxText = res.mailboxText || ''
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.inform {
  .content {
    max-width: 1000px;
    padding: 20px;
    .demo-ruleForm {
      .el-select {
        width: 500px;
      }
    }
  }
  .card {
    border: 1px solid #ccc;
    margin-bottom: 15px;
  }
}

::v-deep .el-tabs--border-card>.el-tabs__content {
  padding: 20px !important;
}
</style>
