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
    redirect: '/order',
    // 二级路由
    children: [
      {
        // 数据分析 \page\data-analysis\data.vue
        path: '/data-analysis',
        name: 'data-analysis',
        component: () => import(/*webpackChunkName: "DataAnalysis"*/ '@/page/data-analysis/data.vue'),
      },
      {
        // 用户列表 \page\user-page\user.vue
        path: '/user-page',
        name: 'user-page',
        component: () => import(/*webpackChunkName: "UserPage"*/ '@/page/user-page/user.vue'),
      },
      //订单管理
      {
        // 订单管理 \page\order\order.vue
        path: '/order',
        name: 'order',
        component: () => import(/*webpackChunkName: "Order"*/ '@/page/order/order.vue'),
      },
      // 菜品管理 page\dishes\dishes.vue
      {
        path: '/dishes',
        name: 'dishes',
        component: () => import(/*webpackChunkName: "Dishes"*/ '@/page/dishes/dishes.vue'),
      },
      // 员工管理\page\role-manage\role.vue
      {
        path: '/role-manage',
        name: 'role-manage',
        component: () => import(/*webpackChunkName: "RoleManage"*/ '@/page/role-manage/role.vue'),
        children: [
          {
            // 角色列表\page\role-manage\role-list.vue
            path: '/role-list',
            name: 'role-list',
            component: () => import(/*webpackChunkName: "RoleList"*/ '@/page/role-manage/role-list.vue'),
          },
          {
            // 角色权限\page\role-manage\role-power.vue
            path: '/role-power',
            name: 'role-power',
            component: () => import(/*webpackChunkName: "RolePower"*/ '@/page/role-manage/role-power.vue'),
          },
        ]
      },
    ],
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
