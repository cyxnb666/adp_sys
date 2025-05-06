<template>
  <div class="manageDimension">
    <div class="content">

      <el-row :gutter="10">
        <el-col :span="19">
          <div :style="{height:(showAllSelect ? decisionHeight + 'px': '78px')}" class="decision-select-wrap">
            <el-row ref="selectContent" :gutter="10" class="decision-select-content" :class="{'showAll':showAllSelect}">
              <el-col v-for="(item,index) in decisionDimList" :key="item.dimId" :xs="10" :sm="8" :md="6" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                  <div>
                    <h4 class="label">{{ item.dimName }}</h4>
                  </div>
                  <!-- {{ decisionDimComponentList }} -->
                  <el-select v-model="form[index]" value-key="key" :placeholder="$t('common.pleaseChoose')" @change="changeSelect(item,index)">
                    <el-option :label="$t('common.all')" :value="{key:'ALL',value:$t('common.all')}" />
                    <el-option
                      v-for="items in decisionDimComponentList[item.codeService]"
                      :key="items.key"
                      :label="items.label"
                      :value="items"
                    />
                  </el-select>
                </div>
              </el-col>

            </el-row>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="decision-btn-wrap">
            <div>
              <h4 class="label" />
            </div>
            <el-button v-if="decisionHeight > 78 " class="btn-border mini" @click="showAllSelect = !showAllSelect">{{ showAllSelect ? $t('decisionPath.putAway') : $t('decisionPath.unfold') }}{{ $t('dimension.allDim') }}</el-button>
            <el-button :loading="searchLoading" class="btn-background mini" @click="search">{{ $t('dimension.searchDimPath') }}</el-button>

          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus'
import { decisionDim } from '@/api/mainPages/decision'
export default {
  name: 'ManageDimension',
  data() {
    return {
      decisionHeight: 78,
      showAllSelect: false,
      searchLoading: false, // 是否加载中
      decisionDimList: [], // 维度的字段
      decisionDimComponentList: {}, // 维度字段的select值列表
      form: [] // 选择维度值的form
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const applicationId = this.$store.state.app.applicationId
      if (!applicationId) return
      await decisionDim(applicationId).then(res => {
        this.decisionDimList = res
        this.form = res.map(item => {
          return { dimId: item.dimId, dimValue: 'ALL', key: 'ALL', value: this.$t('common.all') } // 给维度字段默认值
        })
      })

      this.decisionHeight = this.$refs.selectContent.$el.clientHeight

      // 查询接口维度值列表数据
      const codeService = this.decisionDimList.map(item => { return item.codeService })
      codeService.length && this.$store.dispatch('app/SET_CODESERVICE', codeService.toString()).then((res) => {
        this.decisionDimComponentList = res
      })
    },
    changeSelect(item, index) {
      this.form[index].dimId = item.dimId
      const dimSettings = this.form.map(item => {
        return { dimId: item.dimId,
          dimValue: item.key }
      })
      Bus.$emit('ComponentDimensionChange', dimSettings)
    },
    // 查找决策路径
    async search() {
      const dimSettings = this.form.map(item => {
        return {
          dimId: item.dimId,
          dimValue: item.key
        }
      })
      const data = {
        applicationId: this.$store.state.app.applicationId,
        dimSettings
      }
      this.$emit('search', data)
    }
  }

}

</script>
<style lang='scss'>
</style>
