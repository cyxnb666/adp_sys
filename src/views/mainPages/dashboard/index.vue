<template>
  <div class="dashboard" id="dashboardID">
    <HeaderView/>
    <SecondLine/>
    <ThirdColumn/>
  </div>
</template>

<script>

import HeaderView from "@/views/mainPages/dashboard/components/headerView.vue";
import SecondLine from "@/views/mainPages/dashboard/components/secondLine.vue";
import ThirdColumn from "@/views/mainPages/dashboard/components/thirdColumn.vue";
import FourthRow from "@/views/mainPages/dashboard/components/fourthRow.vue";
// import autofit from 'autofit.js'
export default {
  name: 'dashboard',
  components: {FourthRow, ThirdColumn, SecondLine, HeaderView},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    // autofit.init({
    //   designHeight: 1080,
    //   designWidth: 1920,
    //   renderDom:"#app",
    //   resize: true
    // },false)
  },
  methods: {},
}


</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  width: 100%;
  padding: 20px;
}
</style>

