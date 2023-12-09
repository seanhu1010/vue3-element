<!--
 * @FilePath: \vue3-element\src\page\index\index.vue
-->
<template>
  <div>
    <!-- 顶部 -->
    <div class="sidebar-top">
      <div>后台管理</div>
      <div>退出</div>
    </div>
    <!-- 使用element-puls侧边栏 -->
    <div class="sidebar-cont">
      <el-menu :default-active="active_index" @select="Select">
        <div v-for="(item, index) in menu" :key="index">
          <el-menu-item v-if="item.Subclass.length == 0" :index="item.id">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.id">
            <!-- 一级菜单 -->
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <!-- 二级菜单 -->
            <div v-for="(subitem, subindex) in item.Subclass" :key="subindex">
              <el-menu-item :index="subitem.id">{{ subitem.title }}</el-menu-item>
            </div>
          </el-sub-menu>
        </div>
      </el-menu>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
  import { DataAnalysis, UserFilled, CreditCard, Food } from '@element-plus/icons-vue'
  import { onMounted, ref, shallowRef } from 'vue'
  export default {
    components: {
      DataAnalysis,
      UserFilled,
      CreditCard,
      Food,
    },
    setup() {
      const Array = [
        {
          id: '1',
          icon: DataAnalysis,
          title: '数据分析',
          router: '',
          Subclass: [],
        },
        {
          id: '2',
          icon: UserFilled,
          title: '用户列表',
          router: '',
          Subclass: [],
        },
        // 订单管理
        {
          id: '3',
          icon: CreditCard,
          title: '订单管理',
          router: '',
          Subclass: [],
        },
        {
          id: '4',
          icon: Food,
          title: '菜品管理',
          router: '',
          Subclass: [],
        },
        // 员工管理
        {
          id: '5',
          icon: UserFilled,
          title: '员工管理',
          router: '',
          Subclass: [
            //员工详情
            {
              id: '5-1',
              title: '员工详情',
              router: '',
            },
            //其他页面
            {
              id: '5-2',
              title: '其他页面',
              router: '',
            },
          ],
        },
      ]

      // 菜单激活回调
      const active_index = ref('1')
      function Select(index, path) {
        localStorage.setItem('menuid', JSON.stringify(index))
      }
      onMounted(() => {
        const menuid = JSON.parse(localStorage.getItem('menuid'))
        if (menuid) {
          active_index.value = menuid
        }
      })

      const menu = shallowRef(Array)
      return { menu, active_index, Select }
    },
  }
</script>

<style></style>
