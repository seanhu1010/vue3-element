/*
 * @FilePath: \vue3-element\src\router\index.js
 */
import { createRouter, createWebHashHistory } from 'vue-router'

// 定义路由,每个路由都需要映射到一个组件
const routes = [
  {
    // 登录界面
    path: '/',
    name: 'login',
    // webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中
    component: () => import(/*webpackChunkName: "Login"*/ '@/page/login/login.vue'), //路由懒加载模式
  },
  {
    // 主界面
    path: '/index',
    name: 'index',
    // webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中
    component: () => import(/*webpackChunkName: "Index"*/ '@/page/index/index.vue'), //路由懒加载模式
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
