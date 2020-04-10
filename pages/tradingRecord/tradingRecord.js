import {
  getTradingRecord,
  getWalletBalance
} from '../../utils/api'
Page({
  data: {
    page: 0,
    recordList: [],
    hasData: true,
    loadStatus: 'loading',
    balance: 0
  },
  onLoad: function (options) {
    this._getWalletBalance()
    this._getTradingRecord()
  },
  async _getTradingRecord() {  // 获取交易记录
    this.setData({
      page: this.data.page + 1
    })
    let result = await getTradingRecord({
      page: this.data.page
    })
    if(result.success) {
      this.setData({
        recordList: this.data.page == 1 ? result.data.recordList : this.data.recordList.concat(result.data.recordList)
      })
      if(result.data.recordList.length <= 0 && this.data.page == 1) {
        this.setData({
          hasData: false
        })
      }
      if(result.data.recordList.length < 15) {
        this.setData({
          loadStatus: 'noMore'
        })
      }else {
        this.setData({
          loadStatus: 'more'
        })
      }
      wx.stopPullDownRefresh()  // 请求完成隐藏下拉刷新
    }
  },
  async _getWalletBalance() {
    let result = await getWalletBalance({})
    if(result.success) {
      this.setData({
        balance: result.data.sweet
      })
    }
  },
  onPullDownRefresh () {
    this.setData({
      page: 0
    })
    this._getTradingRecord()
  },
  onReachBottom () {
    if(this.data.loadStatus != 'more') {return}
    this._getTradingRecord()
  },
  onShareAppMessage () {

  }
})