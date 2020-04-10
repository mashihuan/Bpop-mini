import {
  getKolRecommentList
} from '../../utils/api.js'

import Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    kolid: '',
    page: 0,
    recommentList: [],
    hasData: true,
    loadStatus: 'loading',
    isShowLoadModal: false,
    shareImgUrl: 'http://app.tokenmaster.io/file/wxmini/23.png?time='+(new Date().getTime())
  },
  onLoad: function (options) {
    this.setData({
      kolid: options.kolid
    })
    this._getKolRecommentList()
  },
  onShow() { // 同步购买（解锁）状态
    let recommendObj = app.globalData.recommendObj || {}
    this.data.recommentList.forEach((val,index) => {
      if(val.id == recommendObj.id) {
        let ischarge = `recommentList[${index}].ischarge`
        let name = `recommentList[${index}].name`
        this.setData({
          [ischarge]: true,
          [name]: recommendObj.name,
        })
      }
    })
  },
  async _getKolRecommentList (type) {   // 获取kol荐币列表
    if(!type) {
      this.setData({
        isShowLoadModal: true
      })
    }
    this.setData({
      page: this.data.page + 1,
    })
    let result = await getKolRecommentList({
      kolid: this.data.kolid,
      page: this.data.page,
      type: 2
    })
    if(result.success) {
      this.setData({
        recommentList: this.data.page == 1 ? (result.data.allCurrencyInfo.resultList) : (this.data.recommentList.concat(result.data.allCurrencyInfo.resultList))
      })
      this.setData({
        isShowLoadModal: false
      })
      if(this.data.page == 1 && result.data.allCurrencyInfo.resultList.length <= 0) {
        this.setData({
          hasData: false
        })
      }
      if(result.data.allCurrencyInfo.hasNextPage) {
        this.setData({
          loadStatus: 'more'
        })
      }else {
        this.setData({
          loadStatus: 'noMore'
        })
      }
      wx.stopPullDownRefresh()
    }
  }, 
  onPullDownRefresh () {  // 下拉刷新
    this.setData({
      page: 0
    })
    this._getKolRecommentList('pull')
  },
  onReachBottom () {  // 页面触底
    if(this.data.loadStatus != 'more') {return}
    this.setData({
      loadStatus: 'loading'
    })
    this._getKolRecommentList('down')
  },
  async onGoToDetail (event) {  // 跳转荐币详情
    let res = await Util.checkLogin('token')
    if(!res) {return {}}
    wx.navigateTo({
      url: '/pages/recommendDetail/recommendDetail?recommentId=' + event.detail.recommentId
    })
  },
  onShareAppMessage: function () {
    return {
      // title: '',
      path: "/pages/recommentList/recommentList?kolid=" + this.data.kolid,
      imageUrl: this.data.shareImgUrl
    }
  }
})