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
    // 订单管理
    const orderList = `${url}/order/`
    // 桌号数据
    const tableList = `${url}/table/`
    // 菜品管理
    const dishList = `${url}/dish/`
    // 菜品类目
    const categoryList = `${url}/dish-category/`
    // 菜品单位
    const unitList = `${url}/dish-unit/`
    // 菜品图片上传
    const dishImageUpload = `${url}/dish-image/`
    // 员工列表
    const employeeList = `${url}/employees/`
    // 批量删除员工
    const employeeDelete = `${url}/employees/delete-multiple/`
    // 菜品销量排行榜
    const dishSalesRank = `${url}/dish/sales-rank/`
    // 订单销售总价区间统计
    const orderStatistics = `${url}/order/total-amount-statistics/`
    // 菜品按分类销量统计
    const dishCategorySalesRank = `${url}/dish-category/sales-rank/`

    return {
      register,
      login,
      userList,
      orderList,
      tableList,
      dishList,
      categoryList,
      unitList,
      dishImageUpload,
      employeeList,
      employeeDelete,
      dishSalesRank,
      orderStatistics,
      dishCategorySalesRank,
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
