<template>
  <div class="ComponentCurrentDimension">
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span class="mr-15">{{ $t('userInfo.approvalDate') }}</span>
        <el-button class="btn-border mini" @click="toComponent">{{ $t('versionCompareDim.seleceApproval') }}</el-button>
      </div>
      <div class="current-rule-wrapper">

        <div class="Dimension-content">
          <el-row class="current-rule-content">
            <div
              v-for="(item, index) in dimNodeMgtCompList"
              :key="index"
              class="item"
            >
              <h4>{{ item.dimName }}</h4>
              <h6>{{ item.dimValueName }}</h6>
            </div>
          </el-row>

        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
import { GetVersionDims } from '@/api/mainPages/version-management'
import Bus from '@/utils/bus'
export default {
  name: 'ComponentCurrentDimension',
  props: {
    dimSettingCombineId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dimNodeMgtCompList: []
    }
  },
  created() {
    this.dimSettingCombineId && this.getDimension()
  },
  methods: {
    toComponent() {
      Bus.$emit('changeComponentVersion', { toComponent: 'VersionComparisonDimension', dimSettingCombineId: this.dimSettingCombineId })
    },
    getDimension() {
      const data = {
        dimSettingCombineId: this.dimSettingCombineId,
        applicationId: this.$store.state.app.applicationId
      }
      GetVersionDims(data).then(res => {
        this.dimNodeMgtCompList = res
      })
    }
  }
}
</script>

<style lang="scss">
</style>
