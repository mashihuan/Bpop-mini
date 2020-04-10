Page({
  data: {
    url: 'http://www.bpop.io',
    type: ''
  },
  onLoad (options) {
    this.setData({
      type: 'active'
    })
    wx.showLoading({})
  },
  onImgLoad (event) {
    wx.hideLoading({})
  },
  onCopyEvent () {  // 复制链接
    wx.setClipboardData({
      data: this.data.url,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: ''
        })
      }
    })
  },
  onReady: function () {

  },
  onShareAppMessage: function () {

  }
})