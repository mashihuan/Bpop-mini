import regeneratorRuntime from "./libs/regenerator-runtime/runtime.js" // 使小程序支持async await

App({
  onLaunch () {
    this._getStatusBarHeight()
    this._checkUpdate()
  },
  onShow (options) {
    // 判断进入场景
    if(decodeURIComponent(options.query.scene) && decodeURIComponent(options.query.scene) != 'undefined') {
      wx.setStorageSync('redId', decodeURIComponent(options.query.scene))
      if(!wx.getStorageSync('loginToken')) {
        wx.reLaunch({
          url: '/pages/authorization/authorization'
        })
      }else {
        wx.reLaunch({
          url: '/pages/redPacket/redPacket'
        })
      }
      console.log('扫码进入', decodeURIComponent(options.query.scene))
      // wx.showToast({
      //   title: '扫码进入' + (decodeURIComponent(options.query.scene)),
      //   icon: 'none',
      //   duration: 3000
      // })
      return
    }
    if(options.query.redId && options.query.redId != 'undefined') {
      wx.setStorageSync('redId', options.query.redId)
      if(!wx.getStorageSync('loginToken')) {
        wx.reLaunch({
          url: '/pages/authorization/authorization'
        })
      }else {
        wx.reLaunch({
          url: '/pages/redPacket/redPacket'
        })
      }
      // console.log('分享进入', options.query.redId)
      // wx.showToast({
      //   title: '分享进入' + options.query.redId,
      //   icon: 'none',
      //   duration: 3000
      // })
      return
    }
    wx.removeStorageSync('redId')  // 其它进入场景清除redId
  },
  _checkUpdate () {  // 检查更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本' + res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  _getStatusBarHeight () {
    wx.getSystemInfo({  // 获取状态栏高度
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    });
  },
  globalData: {
    userInfo: null,
    statusBarHeight: 0,
  }
})