<template>
  <div class="app-container poc-model rule-test-log">
    <div class="title-style1">
      <i class="icon icon-1" /><h6>批量测试</h6>
    </div>

    <div class="rule-test-log-context">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="批量测试" name="batchTest" />
        <el-tab-pane label="陪跑测试" name="accompanyTest" />
        <el-tab-pane label="回归测试" name="regressTest" />
        <el-tab-pane label="Debug模式" name="debugTest" />
      </el-tabs>
      <BatchTesting v-if="activeName === 'batchTest'" />
      <AccompanyTest v-if="activeName === 'accompanyTest'" />
      <RegressTest v-if="activeName === 'regressTest'" />
      <DebugTest v-if="activeName === 'debugTest'" />
    </div>
  </div>
</template>

<script>
import BatchTesting from './BatchTesting.vue'
import AccompanyTest from './AccompanyTest.vue'
import RegressTest from './RegressTest.vue'
import DebugTest from './DebugTest.vue'
export default {
  components: {
    BatchTesting,
    AccompanyTest,
    RegressTest,
    DebugTest
  },
  data() {
    return {
      activeName: 'batchTest',
      form: {
        type: '0'
      },
      request: {}
    }
  }
}
</script>

<style scoped lang="scss">
.rule-test-log {
    .rule-test-log-context {
        padding: 20px;
        background: white;
    }
}
</style>
