<!--
 * @FilePath: \vue3-element\src\page\role-manage\component\el-dialog.vue
-->
<template>
  <el-dialog v-model="dialogFormVisible" title="添加员工" width="30%">
    <el-form :model="form">
      <el-form-item label="工号">
        <el-input v-model="form.employee_number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="form.position" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否离职">
        <el-radio-group v-model="form.is_resigned">
          <el-radio :label="false">在职</el-radio>
          <el-radio :label="true">已离职</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import { reactive, toRefs, inject } from 'vue'
  import tips from '/config/tips'
  export default {
    setup(_, { emit }) {
      const state = reactive({
        dialogFormVisible: false,
        form: {
          employee_number: '',
          name: '',
          gender: '男',
          position: '',
          is_resigned: false,
        },
        submitLoading: false, // 提交按钮是否正在提交中
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      //  使用 inject 函数获取 父组件提供的方法
      const refreshTabelData = inject('refreshTabelData')

      // 被父组件调用
      const add = () => {
        state.dialogFormVisible = true
      }

      // 提交
      const submit = async () => {
        state.submitLoading = true // 提交按钮正在提交中
        try {
          const res = await new Request(urls.m().employeeList, state.form).post()
          tips('添加员工成功', 'success')
          state.form = {
            // 重置表单数据
            employee_number: '',
            name: '',
            gender: '男',
            position: '',
            is_resigned: false,
          }
          state.submitLoading = false
          state.dialogFormVisible = false
          refreshTabelData()
        } catch (err) {
          console.log(err)
          state.submitLoading = false
        }
      }

      return {
        ...toRefs(state),
        add,
        submit,
      }
    },
  }
</script>

<style></style>
