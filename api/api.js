/*
 * @FilePath: \vue3-element\api\api.js
 */

// 放置所有的请求接口地址

const url = 'http://10.1.1.31:8000/api'

const urls = class {
  static m() {
    // 注册接口
    const register = `${url}/user/register/`
    // 登录接口
    const login = `${url}/user/login/`
    // 用户列表
    const userList = `${url}/user/`

    return {
      register,
      login,
      userList
    }
  }
}

// const urls = {
//   // 注册接口
//   register: `${url}/user/register/`,
//   // 登录接口
//   login: `${url}/user/login/`,
//   // 退出登录接口
//   logout: `${url}/user/logout/`,
// }

export default urls
