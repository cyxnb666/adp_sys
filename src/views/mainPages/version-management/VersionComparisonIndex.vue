<template>
  <div class="VersionComparisonIndex well">
    <div class="app-container">
      <div v-if="show">
        <el-row :gutter="15" type="flex">
          <el-col :span="12">
            <el-card class="head-card version-card">
              <div slot="header" class="card-head-style1 clearfix">
                <span>{{ $t('versionCompareIndex.version') }}</span>
              </div>
              <div v-if="versionInfo.oneVersionMgtId" class="content">
                <div>
                  {{ $t('bomCreat.bomVersion') }}： {{ versionInfo.oneVersionMgtId.versionNumber }}
                </div>
                <div class="mt-15">
                  {{ $t('dashboard.updateTime') }}：
                  <span v-fittertime="versionInfo.oneVersionMgtId.versionDate" />
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="head-card version-card">
              <div slot="header" class="card-head-style1 clearfix">
                <span>{{ $t('versionCompareIndex.version2') }}</span>
              </div>
              <div
                v-if="versionInfo.twoVersionMgtId"
                class="content"
              >
                <div>
                  {{ $t('bomCreat.bomVersion') }}： {{ versionInfo.twoVersionMgtId.versionNumber }}
                </div>
                <div class="mt-15">
                  {{ $t('dashboard.updateTime') }}：
                  <span v-fittertime="versionInfo.twoVersionMgtId.versionDate" />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <VersionComparisonDimension v-if="componentName === 'VersionComparisonDimension' " @changeComponent="changeComponent" />
        <VersionComparisonPath
          v-else-if="componentName === 'VersionComparisonPath'"
          :version-dimension-value="versionDimensionValue"
          @changeComponent="changeComponent"
        />
        <VersionComparisonRule v-else-if="componentName === 'VersionComparisonRule'" :version-comparison-path="versionComparisonPath" />
        <!-- {{ dimSettingCombineId }} -->
      </div>
      <div v-else>
        {{ $t('versionCompareIndex.compareVersion') }}
      </div>
    </div>
  </div>
</template>

<script>
import { GetVersionInfo, GetVersionPathComparison } from '@/api/mainPages/version-management'
import Bus from '@/utils/bus'
export default {
  name: 'VersionComparisonIndex',
  components: {
    VersionComparisonDimension: () => import('./VersionComparisonDimension.vue'),
    VersionComparisonPath: () => import('./VersionComparisonPath.vue'),
    VersionComparisonRule: () => import('./VersionComparisonRule.vue')
  },
  data() {
    return {
      show: false,
      versionInfo: {
        oneVersionMgtId: null, twoVersionMgtId: null
      },
      versionDimensionValue: null,
      versionComparisonPath: null,
      dimSettingCombineId: null,
      componentName: 'VersionComparisonDimension'

    }
  },
  created() {
    const { oneVersionMgtId, twoVersionMgtId } = this.$route.query
    if (oneVersionMgtId && twoVersionMgtId) {
      this.show = true
      this.GetVersionInfo(oneVersionMgtId, twoVersionMgtId)
    } else {
      this.$message.error(this.$t('versionCompareIndex.compareVersion'))
      this.$router.push('/version/show')
    }
    Bus.$on('changeComponentVersion', (data) => {
      this.changeComponent(data)
    })
  },
  methods: {

    // 获取顶部的版本信息
    GetVersionInfo(oneVersionMgtId, twoVersionMgtId) {
      const data = {
        oneVersionMgtId, twoVersionMgtId
      }
      GetVersionInfo(data).then(res => {
        this.versionInfo = res
      })
    },

    // 切换组件
    async changeComponent(data) {
      const { oneVersionMgtId, twoVersionMgtId } = this.$route.query
      if (data.selfComponent === 'VersionComparisonDimension') {
        this.dimSettingCombineId = data.dimSettingCombineId
      }
      if (data.selfComponent === 'VersionComparisonPath') {
        this.dimSettingCombineId === data.dimSettingCombineId
      }
      if (data.toComponent === 'VersionComparisonPath') {
        const tempData = {
          oneVersionMgtId, twoVersionMgtId,
          dimSettingCombineId: data.dimSettingCombineId || this.dimSettingCombineId
        }
        await GetVersionPathComparison(tempData).then(res => {
          data.tableData = res
          data.dimSettingCombineId = this.dimSettingCombineId || data.dimSettingCombineId

          this.versionDimensionValue = data
        })
      }
      if (data.toComponent === 'VersionComparisonRule') {
        // eslint-disable-next-line require-atomic-updates
        data.tableData = [data.row] // 把表格内容置换成行
        this.versionComparisonPath = data
        this.versionComparisonPath.hiddenOperation = true
      }
      this.componentName = data.toComponent
    },

    // 查询决策路径的列表
    GetVersionPathComparison() {
      const data = this.versionDimensionValue
      GetVersionPathComparison(data).then(res => {
        this.tableData = res
      })
    }
  }
}
</script>

<style lang="scss">
.VersionComparisonIndex{
  @import "./../decision/style.scss";
}
</style>
