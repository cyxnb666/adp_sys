<template>
  <div class="custom aspect-ratio">
    <iframe id="external-frame" class="iframe" :src="src" width="100%" frameborder="0" name="external-frame" />
  </div>
</template>

<script>
export default {
  name: 'Custom',
  computed: {
    src() {
      return this.$route.meta.url
    }
  }

}
</script>

<style lang='scss' scoped>
.custom {
  iframe {
    height: calc(100vh - 55px);
  }
}
</style>
