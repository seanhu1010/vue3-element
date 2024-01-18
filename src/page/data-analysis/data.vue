<!--
 * @FilePath: \vue3-element\src\page\data-analysis\data.vue
-->
<template>
  <div class="ordering">
    <div class="heading">数据分析</div>
    <div>
      <First />
      <Second />
    </div>
  </div>
</template>

<script>
  import First from './component/first-floor.vue'
  import Second from './component/second-floor.vue'
  export default {
    components: {
      First,
      Second,
    },
    setup() {},
  }
</script>

<style></style>
