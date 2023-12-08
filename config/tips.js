/*
 * @FilePath: \vue3-element\config\tips.js
 */
// 公用的弹窗

import { ElMessage } from 'element-plus'

function tips(msg, type = 'success') {
  ElMessage({
    message: msg,
    type: type,
    duration: 2000,
    showClose: true,
  })
}

export default tips
