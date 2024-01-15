/*
 * @FilePath: \vue3-element\api\request.js
 */

/*
该段代码定义了一个名为request的类，该类具有两个方法modepost
和modeget。这两个方法分别用于发送post和get请求。这两个方法都返回
一个Promise对象，该对象在请求成功时会包含响应数据，而在请求失败时
会包含错误信息。最后，该类被导出为默认输出。可以通过import语句将
该类引入到其他文件中使用。
*/

// axios请求
import instance from './header'

class Request {
  constructor(url, data) {
    this.url = url
    this.data = data
  }

  // 发送 POST 请求
  async post() {
    try {
      const response = await instance.post(this.url, this.data)
      return response.data
    } catch (error) {
      // 可以根据实际需求进行错误处理
      console.error('POST request error:', error)
      throw error
    }
  }

  // 发送 PUT 请求
  async put() {
    try {
      const response = await instance.put(this.url, this.data)
      return response.data
    } catch (error) {
      // 可以根据实际需求进行错误处理
      console.error('PUT request error:', error)
      throw error
    }
  }

  // 发送 GET 请求
  async get() {
    try {
      const response = await instance.get(this.url)
      return response.data
    } catch (error) {
      // 可以根据实际需求进行错误处理
      console.error('GET request error:', error)
      throw error
    }
  }
}

export default Request

// axios请求
// import instance from './header'

// const request = class {
//   constructor(url, arg) {
//     this.url = url
//     this.arg = arg
//   }

//   // post请求
//   modepost() {
//     return new Promise((resolve, reject) => {
//       instance
//         .post(this.url, this.arg)
//         .then((res) => {
//           resolve(res)
//         })
//         .catch((err) => {
//           reject(err)
//         })
//     })
//   }

//   // get请求
//   modeget() {
//     return new Promise((resolve, reject) => {
//       instance
//         .get(this.url)
//         .then((res) => {
//           resolve(res)
//         })
//         .catch((err) => {
//           reject(err)
//         })
//     })
//   }
// }

// export default request
