<template>
  <div class="VersionComparisonDimension mt-30">
    <div class="title-style1">
      <i class="icon icon-1" />
      <h6>{{ $t('versionCompareDim.versionCompareDim') }}</h6>
    </div>
    <div v-if="DimensionList.length" class="Dimension-content">
      <div v-for="items in DimensionList" :key="items.dimSettingCombineId" class="mt-15">
        <div
          class="current-rule-wrapper"
        >
          <div class="flex-wrap head">
            <div class="status">
              <span>{{ $t('common.state') }}：</span>
              <el-tag type="success"> {{ items.status }} </el-tag>
            </div>
            <div class="btn">
              <el-button class="btn-border mini" @click="handleChoice(items.dimSettingCombineId)">{{ $t('versionCompareDim.seeCompase') }}</el-button>
            </div>
          </div>
          <el-row class="current-rule-content">
            <div
              v-for="(item, index) in items.dimNodeMgtCompList"
              :key="index"
              class="item"
            >
              <h4>{{ item.dimName }}</h4>
              <h6>{{ item.dimValueName }}</h6>
            </div>
          </el-row>

        </div>

      </div>

    </div>
    <div v-else>
      <NoData />
    </div>

  </div>
</template>

<script>
import { GetVersionDimComparison } from '@/api/mainPages/version-management'
export default {
  name: 'VersionComparisonDimension',
  data() {
    return {
      DimensionList: []
    }
  },
  created() {
    const { oneVersionMgtId, twoVersionMgtId } = this.$route.query
    this.compare(oneVersionMgtId, twoVersionMgtId)
  },
  methods: {
    compare(oneVersionMgtId, twoVersionMgtId) {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        oneVersionMgtId,
        twoVersionMgtId
      }
      GetVersionDimComparison(data).then(res => {
        this.DimensionList = res
      })
      // this.$router.push('/version/Comparison')
    },
    handleChoice(dimSettingCombineId) {
      const { oneVersionMgtId, twoVersionMgtId } = this.$route.query
      const data = {
        selfComponent: 'VersionComparisonDimension',
        toComponent: 'VersionComparisonPath',
        dimSettingCombineId, oneVersionMgtId, twoVersionMgtId
      }
      this.$emit('changeComponent', data)
    }
  }
}
</script>

<style lang="scss">
.VersionComparisonDimension{
  .el-tag {
    height: auto;
    line-height: inherit;
    padding: 5px 10px;
  }
  .current-rule-wrapper {
    .head {
     background: #EFF5FF;
     padding: 5px 15px;
     align-items: center;
     .status {
       color: #60769C;
       font-size: 14px;
       margin-right: 15px;
     }
     .btn {
       .el-button {
         border-radius: 50px;
         padding: 2px 15px;
       }
     }
    }
    .current-rule-content {
      background: #fff;
      padding: 35px 15px 0 15px;
    }
  }

}
</style>
