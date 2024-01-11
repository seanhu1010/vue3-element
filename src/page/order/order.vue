<!--
 * @FilePath: \vue3-element\src\page\order\order.vue
-->
<template>
  <div class="ordering">
    <div class="heading">订单管理</div>
    <div class="query-view">
      <!-- 日期选择器 -->
      <div class="quotation-query">
        <div class="quotation-title">交易时间</div>
        <div>
          <el-date-picker
            v-model="time"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :size="size"
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
      <!-- 下拉列表 -->
      <div class="quotation-query">
        <div class="quotation-title">桌号</div>
        <div>
          <el-select v-model="selectedTable" placeholder="请选择桌号" clearable>
            <el-option v-for="item in tables" :key="item.id" :label="item.table_number" :value="item.table_number" />
          </el-select>
        </div>
      </div>
      <!-- 查询按钮 -->
      <div class="quotation-query">
        <el-button type="success" @click="query">查询</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="orderData" stripe style="width: 100%">
        <el-table-column prop="transaction_time" label="交易时间" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="table" label="桌号" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="number_of_people" label="用餐人数" align="center" min-width="100"> </el-table-column>
        <el-table-column label="菜单详情" align="center" min-width="100">
          <template #default="{ row }">
            <el-button size="small" @click="detailed(row.dish_details)">详细菜单</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="交易金额" align="center" min-width="100"> </el-table-column>
        <el-table-column label="交易状态" align="center" min-width="100">
          <template #default="{ row }">
            <el-button size="small" v-if="row.transaction_status === '关闭'" type="danger" disabled>已结账</el-button>
            <el-button size="small" v-else type="danger">未结账</el-button>
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
      <!-- 弹窗，向component/el-dialog.vue传值 -->
      <Dialog ref="val" />
    </div>
  </div>
</template>

<script>
  import { reactive, toRefs, onMounted, inject, ref } from 'vue'
  import qs from 'qs'
  import Dialog from './component/el-dialog.vue'
  export default {
    components: {
      Dialog,
    },
    setup() {
      const state = reactive({
        size: 'default', // 日期选择器大小
        time: '', // 选中的时间
        selectedTable: '', // 选中的桌号
        tables: [], // 接口请求的桌号数据
        page: 1, //第几页
        total: 0, //总条目数
        orderData: [], // 接口请求的订单表单数据
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 父子组件传值
      const val = ref()

      // 异步桌号数据，调用后端接口
      const getTabels = async () => {
        try {
          const res = await new Request(urls.m().tableList).get()
          console.log(res)
          state.tables = res //获取数据
        } catch (err) {
          console.log(err)
        }
      }

      // 异步获取订单表单数据，调用后端接口
      const getOrderData = async () => {
        // 构建参数对象
        const params = {};

        // 添加日期范围参数
        if (state.time !== null && state.time.length === 2) {
          params.start_time = state.time[0];
          params.end_time = state.time[1];
        }

        // 添加桌号参数
        if (state.selectedTable) {
          params.table_number = state.selectedTable;
        }

        // 添加页码参数
        if (state.page) {
          params.page = state.page;
        }

        try {
          // const res = await new Request(urls.m().orderList + '?page=' + state.page).get()
          const res = await new Request(urls.m().orderList + '?' + qs.stringify(params)).get()
          console.log(res)
          state.orderData = res.results //获取数据
          state.total = res.count //获取总条目数
        } catch (err) {
          console.log(err)
        }
      }

      // 点击查询按钮，调用后端接口
      const query = () => {
        getOrderData()
      }

      //page改变时的回调函数，参数为当前页码
      const currentChange = (val) => {
        console.log('翻页，当前为第几页', val)
        state.page = val
        getOrderData()
      }

      // 点击详情按钮，传值给子组件，弹出详情弹窗
      const detailed = (dishDetails) => {
        val.value.popup(dishDetails)
      }

      // 页面加载时调用，获取表格数据
      onMounted(() => {
        getTabels()
        getOrderData()
      })

      return { ...toRefs(state), getTabels, getOrderData, query, currentChange , detailed, val}
    },
  }
</script>

<style></style>
