<template>
  <div class="VersionComparisonPath mt-30">
    <ComponentCurrentDimension :dim-setting-combine-id="versionDimensionValue.dimSettingCombineId" />
    <el-card class="mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span class="mr-15">{{ $t('versionComparePath.decisionPath') }}</span>
        <slot name="btn" />
      </div>
      <el-table
        class="decisionTable"
        :data="versionDimensionValue.tableData"
        width="500px"
        style="width: 100%;"
        :empty-text="$t('common.noData')"
        stripe
        :header-cell-style="{
          background: '#EFF4F8',
          color: '#60769C',
          'font-weight': 'normal'
        }"
        :cell-style="{ color: '#435475' }"
        @row-dblclick="handleChoice"
      >
        <el-table-column v-if="!versionDimensionValue.hiddenOperation" :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button class="mini" size="mini" type="text" @click="handleChoice(scope.row)">{{ $t('common.see') }}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in tableHead"
          :key="item.decisionNodeFieldId"
          :label="item.decisionNodeFieldName"
        >
          <template slot-scope="scope">
            <span v-if="'DECISION_RULES_NUM' === item.decisionNodeField">
              {{ scope.row[item.decisionNodeField.toUpperCase()] || 0 }}
            </span>
            <span v-else>
              {{ scope.row[item.decisionNodeField ] || $t('common.all') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { deciurlField } from '@/api/mainPages/deci'
import ComponentCurrentDimension from './components/ComponentCurrentDimension'
export default {
  name: 'VersionComparisonPath',
  components: {
    ComponentCurrentDimension
  },
  props: {
    versionDimensionValue: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tableData: [],
      tableHead: []
    }
  },
  created() {
    this.getDeciurlField()
    // this.init()
  },
  methods: {
    // 获取表头
    getDeciurlField() {
      const data = { applicationId: this.$store.state.app.applicationId }
      deciurlField(data).then(res => {
        this.tableHead = res
      })
    },

    // 双击了表格某行
    handleChoice(row, column, event) {
      this.tableData = row
      const data = {
        ...this.versionDimensionValue,
        selfComponent: 'VersionComparisonPath',
        toComponent: 'VersionComparisonRule',
        decisionUrlId: row['DECISION_URL_ID'],
        row: row
      }
      this.$emit('changeComponent', data)
    }
  }
}
</script>

<style lang="scss">
</style>
