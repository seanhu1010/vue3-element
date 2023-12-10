<!--
 * @FilePath: \vue3-element\src\page\login\login.vue
-->

<template>
  <div id="background-cont">
    <div class="meituan-content">
      <div class="login-cont">
        <div class="meituan-title">欢迎光临</div>
        <div class="meituan-user">
          <p>账号</p>
          <el-input v-model="username" class="inputflex" placeholder="请输入账号" clearable />
        </div>
        <div class="meituan-user">
          <p>密码</p>
          <el-input v-model="password" class="inputflex" placeholder="请输入密码" show-password />
        </div>
        <!-- 登录和注册按钮的切换 -->
        <div class="reg-view" @click="regi = regi == '登录' ? '注册' : '登录'">
          <p>{{ regi }}</p>
        </div>
        <!-- 登录或注册按钮提交 -->
        <el-button v-if="regi == '注册'" type="success" @click="signin" :loading="loading" class="meituan-btn"
          >登录</el-button
        >
        <el-button v-else type="success" @click="register" :loading="loading" class="meituan-btn">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { inject, reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import tips from '/config/tips'
  export default {
    setup() {
      const user = reactive({
        username: '',
        password: '',
        regi: '注册',
        loading: false, // 登录按钮的 loading 状态
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 使用 useRouter 函数获取路由实例
      const router = useRouter()

      // 登录
      const signin = async () => {
        user.loading = true // 登录按钮的 loading 状态
        const obj = {
          username: user.username,
          password: user.password,
        }
        try {
          // 使用 Request 类的 post 方法发起请求
          const res = await new Request(urls.m().login, obj).post()
          // console.log(urls.m().login, obj)
          // console.log(res)
          localStorage.setItem('token', res.token)
          localStorage.setItem('username', user.username)
          // tips(res.msg, 'success')
          // 使用router跳转到index页面
          router.push({ name: 'index' })
        } catch (error) {
          console.error('Login request failed:', error)
        }
        user.loading = false // 登录按钮的 loading 状态
      }

      // 注册操作
      const register = async () => {
        user.loading = true // 注册按钮的 loading 状态
        const obj = {
          username: user.username,
          password: user.password,
        }

        try {
          // 使用 Request 类的 post 方法发起请求
          const res = await new Request(urls.m().register, obj).post()
          // console.log(res)
          tips(res.msg, 'success')
          user.regi = '注册' // 注册成功切换到登录
        } catch (error) {
          console.error('Register request failed:', error)
        }
        user.loading = false // 注册按钮的 loading 状态
      }

      // 使用 toRefs 将响应式对象转为普通对象
      return { ...toRefs(user), signin, register }
    },
  }
</script>

<style></style>
