<!--
 * @FilePath: \vue3-element\src\page\dishes\dishes.vue
-->
<template>
  <div class="ordering">
    <div class="heading">菜品管理</div>
    <!-- 添加菜品按钮 -->
    <div class="botton-view">
      <router-link :to="{ name: 'dishes-upload' }">
        <el-button type="success">添加菜品</el-button>
      </router-link>
    </div>
    <!-- 菜品表格 -->
    <div>
      <el-table :data="dishData" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="dish_category" label="类目" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="name" label="菜品名称" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="dish_url" label="菜品图片" align="center" min-width="100">
          <!-- 列表中嵌套其他元素需要使用template包裹 -->
          <template #default="{ row }">
            <!-- 参考 https://element-plus.org/zh-CN/component/image.html#图片预览 ,注意要置preview-teleported为true -->
            <el-image
              style="width: 40px; height: 40px"
              :src="row.dish_url"
              :preview-src-list="[row.dish_url]"
              fit="cover"
              lazy
              hide-on-click-modal
              preview-teleported
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="菜品价格" align="center" min-width="100"> </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="clickEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" v-if="row.is_on_sale" @click="clickDiscontinue(row.id, row)"
              >下架</el-button
            >
            <el-button size="small" v-else disabled>已下架</el-button>
          </template>
        </el-table-column>
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
  import { reactive, toRefs, onMounted, inject, toRaw } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  export default {
    setup() {
      const state = reactive({
        page: 1, //第几页
        total: 0, //总条目数
        dishData: [], // 接口请求的菜品表单数据
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 使用 useRouter 函数获取路由实例
      const router = useRouter()

      // 异步获取菜品表单数据，调用后端接口
      const getdishData = async () => {
        try {
          const res = await new Request(urls.m().dishList + '?page=' + state.page).get()
          console.log(res)
          state.dishData = res.results //获取数据
          state.total = res.count //获取总条目数
        } catch (err) {
          console.log(err)
        }
      }

      // 下架菜品提示框
      const clickDiscontinue = (id, data) => {
        ElMessageBox.confirm(`确定对 ${data.name} 下架么?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then((res) => {
            data.is_on_sale = false
            updateDish(id, data)
          })
          .catch((res) => {
            console.log('下架菜品提示框, 取消')
          })
      }

      // 编辑菜品并跳转到编辑页面
      const clickEdit = (data) => {
        router.push({ name: 'dishes-upload', state: { params: toRaw(data) } })
      }

      // 异步请求修改菜品接口
      const updateDish = async (id, data) => {
        try {
          const res = await new Request(urls.m().dishList + id + '/', data).put()
          console.log(res)
          getdishData()
        } catch (err) {
          console.log(err)
        }
      }

      //page改变时的回调函数，参数为当前页码
      const currentChange = (val) => {
        console.log('翻页，当前为第几页', val)
        state.page = val
        getdishData()
      }

      // 页面加载时调用，获取表格数据
      onMounted(() => {
        getdishData()
      })

      return { ...toRefs(state), getdishData, clickDiscontinue, clickEdit, updateDish, currentChange }
    },
  }
</script>

<style></style>
