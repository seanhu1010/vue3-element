/*
 * @FilePath: \vue3-element\api\header.js
 */

/*
这个javascript函数主要实现了以下功能：
1.导入axios和js-base64模块
2.创建了一个axios实例，设置了响应类型为json，
请求头部的Content-Type为application/json
3.定义了一个函数baseFun，用于对token进行Base64编码
4.在axios实例的请求拦截器中，先从本地缓存中获取token，
然后根据token是否存在来决定是否添加Authorization头部
5.在axios实例的响应拦截器中，根据错误状态码进行不同的处理，
包括弹出错误消息框提示用户
6.最后，导出axios实例供其他地方使用
简单来说，这个函数的作用是创建一个带有请求拦截和响应拦截的axios
实例，并进行一些自定义处理，以实现用户身份验证和错误提示等功能。
*/

import axios from 'axios'
import { Base64 } from 'js-base64'
import { ElMessageBox } from 'element-plus'
import tips from '/config/tips'

// 创建公用axios配置，http://axios-js.com/zh-cn/docs/#axios-create-config
let instance = axios.create({
  responseType: 'json',
  headers: { 'Content-Type': 'application/json' },
})

// 对token加密
function baseFun() {
  const token = localStorage.getItem('token') // 从本地缓存里取出token
  // const base64 = Base64.encode(token + ':') // 对token加密
  return 'Bearer ' + token
}

// http拦截请求，在axios请求发出之前给每一个接口携带token去后端检验身份
instance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = baseFun()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// http拦截请求，在axios请求发出之后
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      tips('网络连接失败，请检查网络连接', 'error')
      console.error('Connection refused. Please make sure the server is running.')
      // 提示用户检查网络连接或服务端是否启动
    } else if (error.response) {
      // console.log(error.response)
      let ERRS = error.response.status
      let MSG = error.response.data.msg
      switch (ERRS) {
        case 400:
          // 客户端错误（例如，错误的请求语法、无效的请求消息帧或欺骗性的请求路由），服务器无法或不会处理请求
          tips(MSG, 'warning')
          break
        case 401:
          // 没有访问权限，token过期，没有携带token请求，token错误
          ElMessageBox.alert(error.response.data.detail, '提示', {
            confirmButtonText: '好的',
            type: 'warning',
          })
            .then(() => {
              // 跳转到登录界面
              localStorage.removeItem('token')
              window.location.href = '/'
            })
            .catch(() => {
              // 用户点击取消的处理逻辑
              localStorage.removeItem('token')
              window.location.href = '/'
            })
          break
        default:
          // 处理其他未知错误
          ElMessageBox.alert(MSG, '提示', {
            confirmButtonText: '好的',
            type: 'error',
          })
            .then(() => {
              // 跳转到登录界面
              window.location.href = '/'
            })
            .catch(() => {
              // 用户点击取消的处理逻辑
              window.location.href = '/'
            })
      }
    }
    return Promise.reject(error.response.data) // 返回错误信息
  }
)

export default instance
