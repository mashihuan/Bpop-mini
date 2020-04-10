import { 
  getrecommendDetail,
  getRecommentComment,
  getKolActiveList, 
  commentRecommend, 
  deleteComment,
  endRecommend,
  getWalletBalance,
  unlockRecommend
}from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    id: '',  // 荐币id,
    commentId: '',  // 要回复的评论id
    kolid: '', // 回复人的id
    recommendDetail: {},  // 荐币详情
    commentList: [],  // 荐币评论
    commentPage: 0,  // 评论页数
    commentCount: 0,// 总评论数量
    isShowMoreComment: false, // 是否有更多评论 默认没有
    standingsInfo: {}, // 荐币数据（战绩）
    activePage: 0,  // 相关动态页数
    activeList: [], // 相关动态列表
    loadStatus: 'loading', // 相关动态默认加载状态
    isShowMoreActive: false, // 是否有更多相关动态 默认没有
    isUnfold: false, // 二级评论展开 默认不显示
    placeholder: '说说你的想法吧',
    content: '', //评论内容
    showModal: false, //解锁弹窗,
    moneyBalance: 0,
    isShowLoadModal: false,
    showBtnLoading: false,
    shareImgUrl: 'http://app.tokenmaster.io/file/wxmini/23.png?time='+(new Date().getTime())
  },
  onLoad: function (options) {
    this.setData({
      id: options.recommentId
    })
    this._getrecommendDetail()
  },
  onShow () { // 同步关注状态
    let favoriteObj = wx.getStorageSync('favoriteObj') || {};
    let deleteObj = wx.getStorageSync('deleteObj') || {};
    let attentionObj = wx.getStorageSync('attentionObj') || {};
    this.data.activeList.forEach((val,index) => {
      let myFabulousAccount = `activeList[${index}].myFabulousAccount`
      let fabulousAccount = `activeList[${index}].fabulousAccount`
      if(val.id == favoriteObj.commentId) {
        this.setData({
          [myFabulousAccount]: favoriteObj.type > 0 ? 0 : 1,
          [fabulousAccount]: favoriteObj.num
        })
      }
      if(val.id == deleteObj.commentId) {
        this.data.activeList.splice(index, 1);
        this.setData({
          activeList: this.data.activeList
        })
      }
    })
    if(this.data.recommendDetail.kolid == attentionObj.kolid) {
      this.setData({
        'recommendDetail.isfans': attentionObj.flag ? false : true
      })
    }
  },
  onReachBottom () {  // 监听页面触底事件
    if(this.data.loadStatus != 'more') {return}
    this.setData({
      loadStatus: 'loading'
    })
    this._getKolActiveList()
  },
  async onUnlock () {  // 解锁
    let result = await getWalletBalance({})
    this.setData({
      moneyBalance: result.data.sweet,
      showModal: true
    })
  },
  async onConfirmBuy () {  // 确认解锁（购买）
    this.setData({
      showBtnLoading: true
    })
    let result = await unlockRecommend({
      recommendId: this.data.id
    })
    this.setData({
      showBtnLoading: false
    })
    if(result.success) {
      this._getrecommendDetail('buy')
      this.setData({
        showModal: false
      })
    }
  },
  onGoToRecharge () {  // 前往充值
    wx.navigateTo({
      url: '/pages/recharge/recharge'
    })
  },
  onGoToTradingRecord () {
    wx.navigateTo({
      url: '/pages/tradingRecord/tradingRecord'
    })
  },
  hideModal () {
    this.setData({
      showModal: false
    })
  },
  async onEndRecommend () {  // 结束荐币
    wx.showModal({
      title: '结束荐币',
      content: `当前价格为￥${this.data.recommendDetail.endPrice}，（去全网均价）距推荐时涨幅：${this.data.recommendDetail.rate}，是否确认结束荐币？`,
      success: async (res) => {
        if(res.confirm) {
          let result = await endRecommend({
            recommendId: this.data.id
          })
          if(result.success) {
            this._getrecommendDetail('end')
          }
        }
      }
    })
  },
  async _getrecommendDetail(type) {  // 获取荐币详情
    this.setData({
      isShowLoadModal: true
    })
    let result = await getrecommendDetail({
      recommendId: this.data.id
    })
    if(result.success) {
      this.setData({
        recommendDetail: result.data.data.recommendDetail,
        kolid: result.data.data.recommendDetail.kolid
      })
      this._getRecommentComment(type)
      this._getKolActiveList()
    }
  },
  async _getRecommentComment(type) { // 获取荐币的评论
    if(type) {
      this.setData({
        isShowLoadModal: true
      })
    }
    this.setData({
      commentPage: this.data.commentPage + 1
    })
    let result = await getRecommentComment({
      recommendId: this.data.id,
      kolid: this.data.recommendDetail.kolid,
      page: this.data.commentPage,
      isNew: 1,
    })
    let arr = this.data.commentPage == 1 ? result.data.data.resultList : this.data.commentList.concat(result.data.data.resultList)
    arr.forEach((val, index) => {
      if(val.resultList && val.resultList.length > 1) {
        val.isUnfold = true
      }
    })
    this.setData({
      commentList: arr,
      commentCount: result.data.data.commentCount
    })
    if(result.data.data.hasNextPage) {  // 判断是否有下一页
      this.setData({
        'isShowMoreComment': true
      })
    }else {
      this.setData({
        'isShowMoreComment': false
      })
    }
    this.setData({
      isShowLoadModal: false
    })
    if(type == 'del') {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
    }
    if(type == 'add') {
      wx.showToast({
        title: '评论成功',
        icon: 'none'
      })
    }
    if(type == 'end') {
      wx.showToast({
        title: '结束荐币成功',
        icon: 'none'
      })
    }
    if(type == 'buy') {
      wx.showToast({
        title: '购买成功',
      })
      app.globalData.recommendObj = {id: this.data.id, name: this.data.recommendDetail.name, ischarge: true}
    }
  },
  async _getKolActiveList () {  // 获取相关动态
    this.setData({
      activePage: this.data.activePage + 1
    })
    let result = await getKolActiveList({
      kolid: this.data.kolid,
      page: this.data.activePage,
    })
    if(this.data.activePage == 1) {
      this.setData({
        activeList: []
      })
    }
    this.setData({
      activeList: this.data.activeList.concat(result.data.data.data.resultList)
    })
    if(result.data.data.data.hasNextPage) {
      this.setData({
        loadStatus: 'more'
      })
    }else {
      this.setData({
        loadStatus: 'noMore'
      })
    }
  },
  onUnfoldComment (event) {  // 展开收起二级评论
    let isUnfold = event.detail.isUnfold
    let index = event.detail.index
    this.setData({
      [`commentList[${index}].isUnfold`]: !isUnfold
    })
  },
  onGetMoreComment () {  // 查看更多一级评论
    this._getRecommentComment()
  },
  onInputChage (event) {
    this.setData({
      content: event.detail.value
    })
  },
  onReplyComment (event) {  // 回复评论
    let commentId = event.detail.commentId
    let tapIndex = event.detail.tapIndex
    let nickName = event.detail.nickName
    let isMine = event.detail.isMine
    if(tapIndex == 0) { // 0 回复
      this.setData({
        commentId: commentId,
        placeholder: `回复${nickName}`,
        isFocus: true
      })
    }
    if(tapIndex == 1) {  // 1 删除
      this._deleteComment(commentId)
    }
  },
  async onSubmit () {  // 发表评论
    if(this.data.content == "" || this.data.content.trim() == "") {
      wx.showToast({
        title: "请输入评论内容~",
        icon: 'none'
      })
      return
    }
    this.setData({
      isShowLoadModal: true
    })
    let result = await commentRecommend({
      hostrecommendId: this.data.id,
      content: this.data.content,
      recommendId: this.data.commentId  || ''
    })
    if(result.data.success) {
      this.setData({
        content: '',
        commentPage: 0,
        commentId: '',
        placeholder: '说说你的想法吧'
      })
      this._getRecommentComment('add')
    }else {
      this.setData({
        isShowLoadModal: false
      })
    }
  },
  async _deleteComment(commentId) {  // 删除评论
    let result = await deleteComment({
      delType: 1,
      commentId: commentId,
    })
    if(result.data.success) {
      this.setData({
        commentPage: 0
      })
      this._getRecommentComment('del')
    }
  },
  onShareAppMessage () {
    return {
      // title: '',
      path: "/pages/recommendDetail/recommendDetail?recommentId=" + this.data.id,
      imageUrl: this.data.shareImgUrl
    }
  }
})