import {
  getRechargeType,
  recharge
} from '../../utils/api'
Page({
  data: {
    rechargeList: [],
    currentIndex: 0,
    desc: '',
    showBtnLoading: false,
  },
  onLoad (options) {
    this._getRechargeType()
  },
  async onRecharge(event) {  // 点击充值
    this.setData({
      showBtnLoading: true
    })
    let result = await recharge({
      quickPayId: this.data.rechargeList[this.data.currentIndex].id,
      money: this.data.rechargeList[this.data.currentIndex].money,
      openId: wx.getStorageSync('openId')
    })
    if(result.success) {
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: result.data.package,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: (res) => {
          if(res.errMsg == 'requestPayment:ok') {
            let pages = getCurrentPages();
            let page = pages[pages.length - 2]
            page.setData({
              showModal: false
            })
            wx.navigateBack({})
          }
        },
        complete: (res) => {
          this.setData({
            showBtnLoading: false
          })
        }
      })
    }
    this.setData({
      showBtnLoading: false
    })
  },
  onSelectMoney (event) {  // 选择充值金额
    let index = event.currentTarget.dataset.index
    this.setData({
      currentIndex: index
    })
  },
  async _getRechargeType () {   // 获取充值金额选项
    wx.showLoading({
      title: '加载中...'
    })
    let result = await getRechargeType({})
    if(result.success) {
      let arr = result.data
      if(result.data.length % 3 == 1) {
        arr.concat([{}, {}])
      }
      if(result.data.length % 3 == 2) {
        arr.concat([{}])
      }
      this.setData({
        rechargeList: arr
      })
      wx.hideLoading({})
    }
  }
})