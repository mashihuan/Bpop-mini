import {
  getCountryList
} from '../../utils/api'
const app = getApp();
Page({
  data: {
    hidden: true,
    leftTopArr: [],
    currentIndex: 0,
    isShowLoadModal: false,
  },
  onLoad() {
    this._getCountryList()
  },
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  getListHeight () {  // 获取左边列表的高度
    wx.createSelectorQuery().selectAll('.left-letter-item').boundingClientRect((rects) => {
      let arr = []
      rects.forEach((rect,index) => {
        arr.push(rect.top)
      })
      wx.nextTick(() => {
        this.setData({
          leftTopArr: arr
        })
      })
    }).exec()
  },
  onChooseCountry (event) {   // 选择国家
    let countryName = event.currentTarget.dataset.countryname
    let countryCode = event.currentTarget.dataset.countrycode
    let isoCode = event.currentTarget.dataset.isocode
    let pages = getCurrentPages()
    let page = pages[pages.length - 2]
    page.setData({
      countryName: countryName,
      countryCode: countryCode,
      isoCode: isoCode
    })
    wx.navigateBack({
      delta: 1
    })
    // wx.redirectTo({
    //   url: '/pages/login/login'
    // })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  async _getCountryList () {  // 获取国家列表
    this.setData({
      isShowLoadModal: true
    })
    let result = await getCountryList({})
    let res = result.data.prefixData
    let arr = []
    for(let i in res) {
      var obj = {}
      obj.name = i
      obj.list = res[i]
      arr.push(obj)
    }
    this.setData({
      list: arr,
      listCur: arr[0].name
    })
    this.setData({
      isShowLoadModal: false
    })
    this.getListHeight()
  },
  onViewScroll (event) {  // 监听滚动  
    let scrollTop = event.detail.scrollTop
    let arr = this.data.leftTopArr
    for(let i=0; i<arr.length; i++) {
      if(scrollTop >= arr[i] && scrollTop < arr[i+1]) {
        this.setData({
          currentIndex: i
        })
      }
    }
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id].name,
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  }
});