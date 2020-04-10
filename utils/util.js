import {
  getUserPhone
} from './api'

function isEmpty (value) {  // 非空判断
  return value == '' && value.trim() == ''
}

function validatePhone (value) {  // 校验手机号
  let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  return reg.test(value)
}

function validateForeignPhone (value) {  // 校验国外手机号
  return value.length > 15
}

async function checkLogin (loginType) {   // 检查用户是否登录 //loginType: token:只检查token,phone:检查token和手机
  if(!wx.getStorageSync('loginToken')) {
    wx.navigateTo({   // 未授权跳转授权页
      url: '/pages/authorization/authorization'
    })
    return false
  }else {
    if(loginType != 'token') {
      let result = await getUserPhone({})
      if(result.data) {
        return true
      }
      wx.navigateTo({  // 授权过跳转登录页
        url: '/pages/login/login'
      })
      return false
    }
    return true
  }
}

export default {
  isEmpty,
  validatePhone,
  validateForeignPhone,
  checkLogin
}