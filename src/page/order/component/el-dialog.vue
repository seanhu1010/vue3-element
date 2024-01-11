<!--
 * @FilePath: \vue3-element\src\page\order\component\el-dialog.vue
-->
<template>
  <!-- 定义一个弹框子组件，其里面用表格的形式展示下单详情 -->
  <el-dialog v-model="dialogTableVisible" title="下单详细" width="500px" center class="hei_dialog">
    <el-table :data="dishDetails">
      <el-table-column property="name" label="菜品名称" />
      <el-table-column property="specification" label="菜品规格" />
      <el-table-column property="quantity" label="下单数量" />
      <el-table-column property="unit" label="单位" />
    </el-table>
  </el-dialog>
</template>

<script>
  import { reactive, toRefs } from 'vue'
  export default {
    setup() {
      const state = reactive({
        dialogTableVisible: false,
        dishDetails : [],
      })

      // 子组件被父组件调用，并且携带值
      const popup = (val) => {
        if (val) {
          state.dialogTableVisible = true
        }
        state.dishDetails = val
      }

      return {
        ...toRefs(state),
        popup,
      }
    },
  }
</script>

<style>
  .hei_dialog {
    height: 600px;
    overflow-y: auto;
  }
</style>
