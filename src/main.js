/*
 * @FilePath: \vue3-element\src\main.js
 */

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router/index'

// 全局引入css
import '../style/headmark.css'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)

// 请求地址
import urls from '../api/api.js'
// app.config.globalProperties.$urls = urls
app.provide('$urls', urls)
// 请求方法
import Request from '../api/request.js'
// app.config.globalProperties.$request = request
app.provide('$Request', Request)

app.mount('#app')
