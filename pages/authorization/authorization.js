import {
  wxLogin,
  register
} from '../../utils/api'

let app = getApp()

Page({
  data: {
    showBtnLoading: false
  },
  onGetUserInfoEvent (event) {   // 微信授权
    if(event.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        showBtnLoading: true
      })

      this._getWxCode(event)

    }else {
      this.setData({
        showBtnLoading: false
      })
      wx.showToast({
        title: '您拒绝了授权~',
        icon: 'none'
      })
    }
  },
  _getWxCode (event) {  // 获取微信code
    wx.login({         // 获取code
      success: (res) => {
        wx.checkSession({  // 检查登录态是否过期
          success: (r) => {
            if(r.errMsg == 'checkSession:ok') { // 没过期
              if(res.code) {
                this._wxLogin(res.code, event.detail)
              }else {
                wx.showToast({
                  title: '授权失败~',
                  icon: 'none'
                })
              }
            }else {  // 过期重新获取
              this._getWxCode(event)
            }
          }
        })
        
      }
    })
  },
  async _wxLogin (code, info) {   // 获取openId
    let result = await wxLogin({
      code: code,
      encryptedData: info.encryptedData,
      iv: info.iv
    })
    if(result.success) {
      wx.setStorageSync('openId', result.data.openId)
      let res = await register({    // 登录(也是注册)
        openId: result.data.openId,
        unionId: result.data.unionId,
        nickName: result.data.nickName,
        headimgurl: result.data.avatarUrl
      })
      if(res.success) {
        // 本地化个人信息
        wx.setStorageSync('loginToken', res.data.loginToken)
        wx.setStorageSync('tokenid', res.data.id)
        if(wx.getStorageSync('redId')) {  // 有redId则进入红包
          // wx.setStorageSync('red_loginToken', res.data.loginToken)
          // wx.setStorageSync('tokenid', res.data.id)
          wx.reLaunch({
            url: '/pages/redPacket/redPacket'
          })
        }else {                            // 否则进入绑定手机号页面（强制）
          // wx.setStorageSync('tokenid', res.data.id)
          if(!res.data.hasMobile) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }else {
            let pages = getCurrentPages()
            let page = pages[pages.length - 2]
            page.setData({
              refresh: true,
              'activeList[0].page': 0,
              'activeList[1].page': 0,
            })
            wx.navigateBack({})
          }
        }
      }
    }
    this.setData({
      showBtnLoading: false
    })
  },
  onLoad (options) {
    
  },
  onShow () {
    // wx.hideHomeButton()
  },
  onShareAppMessage: function () {

  }
})