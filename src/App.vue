<template>
  <div id="app" class="page-component__scroll">
    <router-view/>
    <el-backtop/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style vars="{ opacity }">
.inline-block {
  display: inline-block;
}

.well {
  min-height: 100px;
  padding: 15px;
}

</style>
<style>
input[aria-hidden="true"] {
  display: none !important;
}
</style>
