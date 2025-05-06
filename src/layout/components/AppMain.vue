<template>
  <section class="app-main" :style="{paddingLeft:lang==='en'?'64px':'0px'}">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      lang: this.$store.state.settings.lang
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: 100vh;
  width: 100%;
  position: relative;
  /* overflow: hidden; */
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.fixed-header {
    left: 0;
    width: 100% !important;
  }
</style>
