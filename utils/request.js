import Util from './util'

export default async function request (url="", data={}, {checkLogin=false,showToast=true,red_loginToken=false}={}, method="POST",header={'content-type': 'application/x-www-form-urlencoded'}) {
  if(checkLogin) { 
    let res = await Util.checkLogin()
    if(!res) {return {}}
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: Object.assign(data, {tokenid: wx.getStorageSync('tokenid')}),
      header: Object.assign(header, {
        loginToken: wx.getStorageSync('loginToken')
      }),
      success: (res) => {
        resolve(res.data)
        if(!res.data.success && showToast) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            mask: true,
            duration: 2500,
          })
        }
        if((res.data.errorCode == 10001 || res.data.errorCode == 1004 || res.data.errorMsg == "用户登陆失效，请重新登陆") && showToast && !data.checkLogin){
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        }
      }
    })
  })
}