<template>
  <el-card class="head-card query-path">
    <div slot="header" class="card-head-style1 clearfix">
      <span>{{ $t('dimension.dim') }}{{ show }}</span>
    </div>
    <div class="content">
      <div />
      <el-row :gutter="10">
        <el-col :span="16" :md="10" :lg="16" :xl="16">
          <div
            :style="{ height: showAllSelect ? decisionHeight + 'px' : 'auto' }"
            class="decision-select-wrap"
          >
            <el-row
              ref="selectContent"
              :gutter="10"
              class="decision-select-content"
              :class="{ showAll: showAllSelect }"
            >
              <el-col
                v-for="(item, index) in decisionDimList"
                :key="item.dimId"
                :xs="10"
                :sm="8"
                :md="6"
                :lg="5"
                :xl="5"
              >
                <div class="grid-content bg-purple">
                  <div style="display: inline-block;">
                    <h4 class="label">{{ item.dimName }}</h4>
                  </div>
                  <!-- {{ decisionDimComponentList }} -->
                  <el-select
                    v-model="form[index]"
                    value-key="key"
                    filterable
                    :placeholder="$t('common.pleaseChoose')"
                    @change="changeSelect(item, index)"
                  >
                    <el-option
                      :label="$t('common.all')"
                      :value="{ key: 'ALL', value: $t('common.all') }"
                    />
                    <el-option
                      v-for="items in decisionDimComponentList[
                        index
                      ]"
                      :key="items.key"
                      :label="items.key + items.label"
                      :value="items"
                    />
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="includeAll" style="padding-top: 20px">
            <!-- 是否精确匹配 -->
            <span>{{ $t('dimension.exactMatch') }}: </span>
            <el-switch
              v-model="includeAll"
              active-value="1"
              inactive-value="0"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="decision-btn-wrap" style="padding-top: 20px">
            <el-button
              v-if="decisionHeight > 100"
              class="btn-border mini"
              @click="showAllSelect = !showAllSelect"
            >{{ showAllSelect ? $t('decisionPath.putAway'): $t('decisionPath.unfold') }}{{ $t('dimension.allDim') }}</el-button>
            <!-- 查询决策路径 -->
            <el-button
              v-show="activeName === 'RuleDetail'"
              :loading="searchLoading"
              class="btn-background mini"
              @click="search"
            >{{ $t('dimension.searchDimPath') }}</el-button>
            <el-button
              v-show="activeName === 'ruleSet'"
              :loading="searchLoading"
              class="btn-background mini"
              @click="search"
            > 查询规则流 </el-button>
            <el-button
              v-show="activeName === 'decisionTree'"
              :loading="searchLoading"
              class="btn-background mini"
              @click="search"
            > 查询决策树 </el-button>
            <!-- 导出路径规则 -->
            <el-button v-show="activeName === 'RuleDetail'" :class="decisionHeight > 78?'exportPathRuleStyle btn-background mini':styleChange" :disabled="isLock" @click="exportPathRule">{{ $t('dimension.exportPathRule') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { decisionDim } from '@/api/mainPages/decision'
import { getDimCodeData } from '@/api/base'
import { postDownloadFile } from '@/utils/utils'
import Bus from '@/utils/bus'
export default {
  name: 'ComponentDimension',
  props: {
    exportButtonShow: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    nodeId: {
      type: String,
      default: null
    },
    edgeId: {
      type: String,
      default: null
    },
    activeName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      includeAll: '0',
      decisionHeight: 78,
      showAllSelect: false,
      searchLoading: false, // 是否加载中
      decisionDimList: [], // 维度的字段
      decisionDimComponentList: [], // 维度字段的select值列表
      form: [], // 选择维度值的form
      isLock: false,
      styleChange: this.$store.state.settings.lang === 'en' ? 'exportPathRuleStyle btn-background mini' : 'btn-background mini'
    }
  },
  created() {
    this.init()
    Bus.$on('searchPath', () => {
      this.search()
    })
    this.show = this.label === null ? '' : this.showText
  },
  methods: {
    // 导出决策路径规则
    exportPathRule() {
      this.isLock = true
      const dimMap = []
      this.form.forEach(item => {
        dimMap[item.dimId] = item.key
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        isExact: this.includeAll,
        dimMap: { ...dimMap }
      }
      postDownloadFile('/downloadDimDetails', data, this.$t('dimension.exportPathRuleTable')).then(res => {
        console.log(res)
      })
      setTimeout(() => {
        this.isLock = false
      }, 20000)
    },
    async init() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return
      await decisionDim(applicationId).then((res) => {
        this.decisionDimList = res
        this.form = res.map((item) => {
          return {
            dimId: item.dimId,
            dimValue: 'ALL',
            key: 'ALL',
            value: this.$t('common.all')
          } // 给维度字段默认值
        })
      })

      this.decisionHeight = this.$refs.selectContent.$el.clientHeight
      this.search()
      // 查询接口维度值列表数据
      const codeService = this.decisionDimList.map((item) => {
        return item.codeService
      })
      codeService.length && this.getDimCodeData(codeService.toString())
    },
    changeSelect(item, index) {
      this.form[index].dimId = item.dimId
      const dimSettings = this.form.map((item) => {
        return { dimId: item.dimId, dimValue: item.key }
      })
      Bus.$emit('ComponentDimensionChange', dimSettings)
    },
    // 查找决策路径
    async search() {
      const dimSettings = this.form.map((item) => {
        return {
          dimId: item.dimId,
          dimValue: item.key
        }
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        dimSettings,
        flag: this.includeAll
      }
      this.$emit('search', data)
    },
    // 查询getDimCodeData
    getDimCodeData(codeServices) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        codeServices: codeServices
      }
      getDimCodeData(data).then((res) => {
        this.decisionDimList.forEach((item, index) => {
          if (res[item.codeService]) {
            const obj = JSON.parse(JSON.stringify(res[item.codeService]))
            this.decisionDimComponentList.push(obj)
          }
        })
      })
    },
    setFormData(data, toggleType) {
      if (toggleType) {
        return false
      }
      if (!data || !data.length) {
        this.init()
        return false
      }

      this.form = data
      const dimSettings = data.map((item) => {
        return {
          dimId: item.dimId,
          dimValue: item.key
        }
      })
      this.$emit('search', {
        applicationId: this.$store.state.app.applicationId,
        dimSettings,
        flag: this.includeAll
      })
    }
  }
}
</script>

<style lang="scss">
.query-path {
  .label {
    color: #435475;
    font-weight: normal;
    margin-bottom: 5px;
    font-size: 14px;
    height: 20px;
    text-overflow: ellipsis;
    font-family: MicrosoftYaHei;
    &:hover {
      overflow: visible;
    }
  }
  .el-input__inner {
    border: 1px solid #ced5db;
    border-radius: 0;
    height: 34px;
    line-height: 34px;
  }
  .el-select .el-input .el-select__caret {
    line-height: 34px;
  }
  .decision-btn-wrap {
    min-width: 250px;
  }
  .decision-select-wrap {
    overflow: hidden;
    transition: all 0.5s;
  }
  .decision-select-content {
    transition: all 0.5s ease;
    &.showAll {
      max-height: 1000px;
    }
  }
  .exportPathRuleStyle{
    margin-top: 10px;
    margin-left: -1px;
  }
  .btn-background.mini {
    margin-left: 5px;
  }
}
</style>
