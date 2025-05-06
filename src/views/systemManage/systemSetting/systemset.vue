<template>
  <div class="systemset app-container bg-color">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('systemset.ruleSet') }}</span>
          </div>
          <div class="sys_content">
            <div class="lock">
              <el-switch
                v-model="lockValue"
                :inactive-text="$t('systemset.lockValue')"
              />
            </div>

          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="card-head-style1 clearfix">
            <span>{{ $t('systemset.ruleApproval') }}</span>
          </div>
          <div class="sys_content">
            <div class="approve">
              <span class="demonstration">{{ $t('systemset.control') }}：</span>
              <el-select v-model="value" :placeholder="$t('systemset.selectLevel')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-card>

        <div class="footer-btn-wrap app-container">
          <div />
          <div class="text-center">
            <el-button
              class="btn-border medium"
            >{{ $t('button.save') }}</el-button>
            <el-button
              class="btn-background medium"
            >{{ $t('button.cancel') }}</el-button>
          </div>
          <div />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lockValue: false,
      options: [{
        value: '1',
        label: this.$t('systemset.firstApproval')
      }, {
        value: '2',
        label: this.$t('systemset.twoApproval')
      }]
    }
  }
}
</script>
<style lang="scss" scoped>
.sys_content{
  color: #000;
  height: 200px;
  padding-left: 30px;

  .approve{
    font-size: 14px;

    .el-select{
      width: 150px;
    }
  }
}
</style>
