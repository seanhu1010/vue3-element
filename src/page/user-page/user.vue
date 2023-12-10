<!--
 * @FilePath: \vue3-element\src\page\user-page\user.vue
-->
<template>
  <div class="ordering">
    <div class="heading">用户列表</div>
    <div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date_joined" label="注册时间" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="username" label="姓名" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" min-width="100">
          <!-- 列表中嵌套其他元素需要使用template包裹 -->
          <template #default="{ row }">
            <!-- 参考 https://element-plus.org/zh-CN/component/image.html#图片预览 ,注意要置preview-teleported为true -->
            <el-image
              style="width: 40px; height: 40px"
              :src="row.avatar"
              :preview-src-list="[row.avatar]"
              fit="cover"
              lazy
              hide-on-click-modal
              preview-teleported
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="occupation" label="职业" align="center" min-width="100"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- 参考 https://element-plus.org/zh-CN/component/pagination.html#小型分页 传入了 current-page，必须监听 current-page 变更的事件 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        @current-change="currentChange"
        :current-page="page"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { reactive, onMounted, toRefs, inject } from 'vue'
  export default {
    setup() {
      const state = reactive({
        page: 1, //第几页
        total: 0, //总条目数
        tableData: [], //表格绑定的数据
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 异步获取表格数据，调用后端接口
      const getTabelData = async () => {
        try {
          const res = await new Request(urls.m().userList + '?page=' + state.page).get()
          console.log(res)
          state.tableData = res.results //获取数据
          state.total = res.count //获取总条目数
        } catch (err) {
          console.log(err)
        }
      }

      //page改变时的回调函数，参数为当前页码
      const currentChange = (val) => {
        console.log('翻页，当前为第几页', val)
        state.page = val
        getTabelData()
      }

      // 页面加载时调用，获取表格数据
      onMounted(() => {
        getTabelData()
      })

      return {
        ...toRefs(state),
        getTabelData,
        currentChange,
      }
    },
  }
</script>

<style scoped>
  /* 强制修改分页颜色 */
  /* :deep(.el-pagination.is-background .el-pager li.is-active) {
    background-color: #00be06;
    color: #fff;
  } */
</style>
