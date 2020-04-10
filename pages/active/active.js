import { getActiveList, getBannerList, getEditBtnStatus } from '../../utils/api.js'
import Mock from '../../utils/mock'
Page({
  data: {
    refresh: false,
    bannerList: [],
    hasBanner: true,
    isShowEditBtn: false,
    tabList: ['热门', '最新'],
    tabTop: 0, // tab距离顶部高度
    showNotify: false,  // 显示下拉刷新消息通知
    isFixed: false,
    isShowBackToTop: false, // 是否显示回到顶部按钮
    activeList: [
      {page: 0, list: [], hasData: true, loadStatus: 'loading', swiperHeight: 0, scrollTop: 0},
      {page: 0, list: [], hasData: true, loadStatus: 'loading', swiperHeight: 0, scrollTop: 0}
    ],
    pageSize: 15,// 每页数据个数
    currentIndex: 0, // tab默认下标
    minSwiperHeight: 0, // swiepr默认高度
    scrollTop: 0,
    isShowFirstLoadingImg: true, // 是否显示首次进入时加载动画
  },
  onLoad (options) {  // 监听页面加载
    this.setData({
      'activeList[0].list': Mock.activeList,
      'activeList[1].list': Mock.activeList,
    })
    this._getBannerList()
    this._getActiveList(1)
    this._getActiveList(2)
  },
  onShow () {  //同步详情页的点赞状态,删除状态
    this._getEditBtnStatus()
    if(this.data.refresh) {
      this._getActiveList(1)
      this._getActiveList(2)
      this.setData({
        refresh: false
      })
    }
    let favoriteObj = wx.getStorageSync('favoriteObj');
    let deleteObj = wx.getStorageSync('deleteObj');
    this.data.activeList[0].list.forEach((val,index) => {
      let myFabulousAccount = `activeList[0].list[${index}].myFabulousAccount`
      let fabulousAccount = `activeList[0].list[${index}].fabulousAccount`
      let list = `activeList[0].list`
      if(val.id == favoriteObj.commentId) {
        this.setData({
          [myFabulousAccount]: favoriteObj.type > 0 ? 0 : 1,
          [fabulousAccount]: favoriteObj.num
        })
      }
      if(val.id == deleteObj.commentId) {
        this.data.activeList[0].list.splice(index, 1);
        this.setData({
          [list]: this.data.activeList[0].list
        })
      }
    })
    this.data.activeList[1].list.forEach((val,index) => {
      let myFabulousAccount = `activeList[1].list[${index}].myFabulousAccount`
      let fabulousAccount = `activeList[1].list[${index}].fabulousAccount`
      let list = `activeList[1].list`
      if(val.id == favoriteObj.commentId) {
        this.setData({
          [myFabulousAccount]: favoriteObj.type > 0 ? 0 : 1,
          [fabulousAccount]: favoriteObj.num
        })
      }
      if(val.id == deleteObj.commentId) {
        this.data.activeList[1].list.splice(index, 1);
        this.setData({
          [list]: this.data.activeList[1].list
        })
      }
    })
  },
  onPullDownRefresh () {  // 监听下拉刷新
    // wx.showNavigationBarLoading()
    let page = `activeList[${this.data.currentIndex}].page`
    this.setData({
      [page]: 0,
    })
    this._getActiveList(this.data.currentIndex + 1, 'down')
  },
  onReachBottom () {  // 监听上拉加载
    if(this.data.activeList[this.data.currentIndex].loadStatus != 'more') {return}
    let status = `activeList[${this.data.currentIndex}].loadStatus`
    this.setData({
      [status]: 'loading'
    })
    this._getActiveList(this.data.currentIndex + 1)
  },
  async _getActiveList (type, down) {  // 获取动态列表  type: 1 热门 2 最新
    wx.showNavigationBarLoading()
    let list = `activeList[${type-1}].list`;
    let page = `activeList[${type-1}].page`;
    let hasData = `activeList[${type-1}].hasData`;
    let status = `activeList[${type-1}].loadStatus`;
    this.setData({
      [page]: this.data.activeList[type-1].page + 1
    })
    let result = await getActiveList({
      type: type,
      isHot: type == 1 ? 1 : '',
      page: this.data.activeList[type-1].page,
      checkLogin: type == 2 ? false : true
    })
    if(!result.success) {return}
    if(result.data.data.resultList.length <=0) { // 判断有无数据
      this.setData({
        [hasData]: false
      })
    }
    if(this.data.activeList[type-1].page == 1) {  // 第一页清空数据
      this.setData({
        [list]: []
      })
    }
    this.setData({
      [list]: this.data.activeList[type-1].list.concat(result.data.data.resultList),
      // isShowEditBtn: true,
    })
    if(result.success) {
      wx.nextTick(() => {
        this.setData({
          isShowFirstLoadingImg: false
        })
      })
    }
    if(!result.data.data.hasNextPage) {   // 判断是否是最后一页
      this.setData({
        [status]: 'noMore'
      })
    }else {
      this.setData({
        [status]: 'more'
      })
    }
    wx.nextTick(() => {
      setTimeout(() => {
        this._getSwiperHeight(type)
      }, 1000)
    })
    if(down == 'down') { 
      this.setData({
        showNotify: true
      })
    }
    wx.stopPullDownRefresh()  // 请求完成隐藏下拉刷新
    wx.hideNavigationBarLoading()// 请求完成隐藏导航栏加载条
  },
  async _getBannerList () {  // 获取轮播图
    let result = await getBannerList({
      bannertype: 6
    })
    if(result.success) {
      if(result.data.length <= 0 ) {
        this.setData({
          hasBanner: false
        })
      }else {
        this.setData({
          bannerList: result.data
        })
      }
      wx.nextTick(() => {
        this._getTabTop()
      })
    }
  },
  _getTabTop () {
    // 获取tab的高度
    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      this.setData({
        tabTop: rect.top,
        // 'activeList[0].scrollTop': rect.top,
      })
      // 获取swiper最小高度
      wx.getSystemInfo({
        success:(res) => {
          this.setData({
            minSwiperHeight: res.windowHeight - rect.bottom
          })
        }
      })
    }).exec()
  },
  _getSwiperHeight (type) {  // 动态获取swiper高度
    let swiperHeight = `activeList[${type-1}].swiperHeight`
    if(type == 1) {
      wx.createSelectorQuery().selectAll('.item1 >>> .more').boundingClientRect((rects) => {
        wx.createSelectorQuery().selectAll('.item1').boundingClientRect((rects) => {
          let height = 0;
          rects.forEach((rect) => {
            height += rect.height
          })    
          this.setData({
            [swiperHeight]: height + 42
          })
        }).exec()
      }).exec()
    }else {
      wx.createSelectorQuery().selectAll('.item2 >>> .more').boundingClientRect((rects) => {
        wx.createSelectorQuery().selectAll('.item2').boundingClientRect((rects) => {
          let height = 0;
          rects.forEach((rect) => {
            height += rect.height
          })    
          this.setData({
            [swiperHeight]: height + 42
          })
        }).exec()
      }).exec()
    }
  },
  async _getEditBtnStatus () { // 是否显示写动态按钮（提审）
    let result = await getEditBtnStatus({
      checkLogin: false
    })
    if(result.success) {
      if(result.data == 0) {
        this.setData({
          isShowEditBtn: true
        })
      }
      if(result.data == 1) {
        this.setData({
          isShowEditBtn: false
        })
      }
    }
  },
  onSwitchTab (event) {  // tab点击切换
    if(this.data.isFixed) {
      wx.pageScrollTo({
        scrollTop: this.data.tabTop,
        duration: 0
      })
    }
    this.setData({
      currentIndex: event.detail.index,
    })
  },
  onSwiperChange (event) {
    if(this.data.isFixed) {
      wx.pageScrollTo({
        scrollTop: this.data.tabTop,
        duration: 0
      })
    }
    this.setData({
      currentIndex: event.detail.current,
    })
  },
  onBackToTop () {   // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPageScroll (event) {   // 监听页面滚动  避免重复setData,浪费性能
    let fixedFlag = event.scrollTop >= this.data.tabTop
    if(fixedFlag != this.data.isFixed) {
      this.setData({
        isFixed: fixedFlag
      })
    }
    let toTopFlag = event.scrollTop >= 1000
    if(toTopFlag != this.data.isShowBackToTop) {
      this.setData({
        isShowBackToTop: toTopFlag
      })
    }
  },
  onWriteActive () {  // 动态下载页
    wx.navigateTo({
      url: '/pages/download/download?type=active'
    })
  },
  onShareAppMessage: function () { // 用户点击右上角分享

  }
})