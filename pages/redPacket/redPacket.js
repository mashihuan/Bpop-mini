import {
  initRedPacket,
  openRed,
  getRedRecord,
  getUserPhone,
  checkUserRecord
} from '../../utils/api'
import Util from '../../utils/util'

let app = getApp()

Page({
  data: {
    redId: '', // 红包id 
    redInfo: '',   // 红包信息
    userInfo: '',  // 用户信息
    recordList: [], // 领取记录
    hasData: true, // 是否有人领取
    is_temp: false, // 是否新用户
    amount: 0.00,  // 红包数量
    currencyName: '', // 红包币种名称
    rmb: '',   // 红包价值金额
    phone: '',  // 用户账号（手机）
    redStatus: 1, // 红包状态 1未打开  2抢红包成功  3红包被领完 4新手红包,
    isShowLoadModal: false,
    shareImgUrl: 'http://app.tokenmaster.io/file/wxmini/19.jpeg?time='+(new Date().getTime()),
  },
  onLoad (options) {
    
  },
  onShow () {
    this._initRedPacket()
  },
  async onOpenRed (event) {  // 打开红包
    if(!wx.getStorageSync('tokenid')) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
    }
    if(event && event.currentTarget.dataset.type == 'hand') {
      this.setData({
        isShowLoadModal: true
      })
    }
    this._getUserPhone()
    let result = await openRed({
      redId : wx.getStorageSync('redId')
    })
    this.setData({
      isShowLoadModal: false
    })
    if(result.data == -1) {  // 该红包为新手红包，老用户不能领取
      this.setData({
        redStatus: 4,
      })
    }else if(result.data == -2) {  // 新手红包先绑定手机
      wx.showToast({
        title: '该红包为新手红包，需先绑定手机号',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }, 1300)
    }else {  // 红包打开
      if(result.data.amount <= 0) {  // 红包已领完
        this.setData({
          redStatus: 3,
        })
        this._getRedRecord()
      }else {     // 红包领取成功
        this._getRedRecord()
        this.setData({
          redStatus: 2,
          amount: result.data.amount,
          redInfo: result.data.redInfo,
          currencyName: result.data.redInfo.currencyName,
        })
        if(result.data.rmb > 0) {
          this.setData({
            rmb: result.data.rmb
          })
        }
      }
    }
  },
  async _initRedPacket () {   // 获取红包信息
    if(this.data.redStatus == 1) {
      this.setData({
        isShowLoadModal: true
      })
    }
    let result = await initRedPacket({
      redId: wx.getStorageSync('redId')
    })
    if(result.success) {
      this.setData({
        redInfo: result.data
      })
      this._checkUserRecord()
      this._getUserPhone()
    }
  },
  async _checkUserRecord () {  // 查询用户是否领取过红包
    let result = await checkUserRecord({
      redId: wx.getStorageSync('redId')
    })
    if(result.success) {
      if(result.data == 1) {  // 0未抢过，1已抢过--如已抢过则打开红包
        if(this.data.redStatus == 1) {
          this.onOpenRed()
        }
      }else {
        this.setData({
          isShowLoadModal: false
        })
      }
    }
  },
  async _getRedRecord () {  // 获取红包领取记录
    let result = await getRedRecord({
      redId: wx.getStorageSync('redId')
    })
    if(result.success) {
      this.setData({
        recordList: result.data
      })
    }
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  async _getUserPhone () {  // 查询用户手机号
    let result = await getUserPhone({})
    if(result.success && result.data) {
      this.setData({
        phone: result.data.substr(0,3) + '****' + result.data.substr(7, 11)
      })
    }
  },
  onWithDraw () {   // 立即提现（绑定手机）
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  onDownload () {  // 前去下载
    wx.navigateTo({
      url: '/pages/download/download'
    })
  },
  onReady () {

  },
  onHide () {
    
  },
  onUnload () {

  },
  onPullDownRefresh () { // 下拉刷新
    wx.showNavigationBarLoading()
    this._getRedRecord()
  },
  onReachBottom () {

  },
  onShareAppMessage () {
    return {
      title: '在吗？币泡泡送你空投红包啦!',
      path: "/pages/redPacket/redPacket?redId=" + wx.getStorageSync('redId'),
      imageUrl: this.data.shareImgUrl
    }
  }
})