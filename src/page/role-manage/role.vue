<!--
 * @FilePath: \vue3-element\src\page\role-manage\role.vue
-->
<template>
  <div class="ordering">
    <div class="heading">员工详情</div>
    <!-- 按钮 -->
    <div class="query-view">
      <el-button type="success" @click="addEmployee">添加员工</el-button>
      <el-button type="danger" @click="clickDelete" :disabled="ids.length > 0 ? false : true">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="tableData" stripe style="width: 100%" @select="select" @select-all="selectAll">
        <el-table-column type="selection" />
        <el-table-column prop="created_at" label="创建时间" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="employee_number" label="工号" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="position" label="职位" align="center" min-width="100"> </el-table-column>
        <el-table-column label="是否离职" align="center" min-width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_resigned"
              style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
              @change="switchResign(row.id, $event)"
            />
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
      <!-- 弹窗，调用component/el-dialog.vue -->
      <Dialog ref="dialog" />
    </div>
  </div>
</template>

<script>
  import { reactive, onMounted, toRefs, provide, inject, ref, toRaw } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import Dialog from './component/el-dialog.vue'
  export default {
    components: {
      Dialog,
    },
    setup() {
      const state = reactive({
        page: 1, //第几页
        total: 0, //总条目数
        tableData: [], //表格绑定的数据
        ids: [], //选中的id数组,用于批量删除员工
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 父子组件传值
      const dialog = ref()

      // 异步获取员工表格数据，调用后端接口
      const getTabelData = async () => {
        try {
          const res = await new Request(urls.m().employeeList + '?page=' + state.page).get()
          console.log(res)
          state.tableData = res.results //获取数据
          state.total = res.count //获取总条目数
        } catch (err) {
          console.log(err)
        }
      }

      // 刷新表格数据，请求第一页的数据
      const refreshTabelData = () => {
        state.page = 1
        getTabelData()
      }

      // 提供给子组件的方法
      provide('refreshTabelData', refreshTabelData)

      // 异步请求修改员工离职状态
      const switchResign = async (id, flag) => {
        try {
          const res = await new Request(urls.m().employeeList + id + '/', { is_resigned: flag }).patch()
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      }

      // 异步请求删除员工，调用后端接口
      const deleteEmployee = async () => {
        try {
          const res = await new Request(urls.m().employeeDelete, { ids: state.ids }).post()
          console.log(res)
          state.ids = []
          getTabelData()
        } catch (err) {
          console.log(err)
        }
      }

      // 批量删除提示框
      const clickDelete = () => {
        ElMessageBox.confirm(`确定删除${state.ids.length}个员工么?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then((res) => {
            deleteEmployee()
          })
          .catch((res) => {
            console.log('删除员工提示框, 取消')
          })
      }

      // 单行选中或取消选中
      const select = (row) => {
        state.ids = row.map((item) => {
          return item.id
        })
      }

      // 全选或取消全选
      const selectAll = (row) => {
        state.ids = row.map((item) => {
          return item.id
        })
      }

      //page改变时的回调函数，参数为当前页码
      const currentChange = (val) => {
        console.log('翻页，当前为第几页', val)
        state.page = val
        getTabelData()
      }

      // 添加员工,调用子组件显示弹窗
      const addEmployee = () => {
        dialog.value.add()
      }

      // 页面加载时调用，获取表格数据
      onMounted(() => {
        getTabelData()
      })

      return {
        ...toRefs(state),
        dialog,
        getTabelData,
        refreshTabelData,
        switchResign,
        deleteEmployee,
        clickDelete,
        select,
        selectAll,
        currentChange,
        addEmployee,
      }
    },
  }
</script>

<style></style>
