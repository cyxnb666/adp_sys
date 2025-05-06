import axios from "axios";
import request from './request'
/**
 *  promise形式 登入接口success
 */
export function featchDataLogin() {
  const data = { userId: "hebao", password: "123456" };
  // 实际开发应为接口路径
  return axios.post("https://adp-demo.airongkeji.com/api/login", data);
}

/**
 *  promise形式 登入接口error
 */
export function featchDataLoginP() {
  const data = { userId: "hebao", password: "1234567" };
  // 实际开发应为接口路径
  return axios.post("https://adp-demo.airongkeji.com/api/login", data);
}

/**
 *  promise形式 登入接口success
 */
 export function featchBomInfo() {
    // 实际开发应为接口路径
    return request.get("https://adp-demo.airongkeji.com/api/bom/info");
  }

/**
 *  callback 回调函数形式 登入输入错误
 */
//  export function featchDataLoginError(fn) {
//     const data = {"userId":"hebao","password":"23456"};
//   // 实际开发应为接口路径
//   axios.post('https://adp-demo.airongkeji.com/api/login', data)
//     .then(response => {
//       fn(response.data)
//     })
// }
