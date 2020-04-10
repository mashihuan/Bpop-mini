Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
    isDetail: {
      type: [Boolean, String],
      value: false
    },
    showSkeleton: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  externalClasses: ['skeleton-class'],
  data: {
    
  },
  lifetimes: {
    ready () {
      this._getTextHeight()
    }
  },
  methods: {
    onGoToDetail (event) { // 跳转详情页面
      if(this.properties.isDetail || this.properties.showSkeleton) {return}
      wx.navigateTo({
        url: '/pages/activeDetail/activeDetail?id=' + this.properties.item.id,
      })
    },
    onPreviewImage (event) {  // 预览图片
      let arr = event.currentTarget.dataset.imglist
      let urls = []
      arr.forEach((val,index) => {
        urls.push(val.imgUrl)
      })
      wx.previewImage({
        current: event.currentTarget.dataset.current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
      return
    },
    _getTextHeight () {  // 获取文本内容高度，判断是否显示查看全部
      this.createSelectorQuery().select('.item-text').boundingClientRect((rect) => {
        if(rect.height > 66) {
          this.setData({
            [`item1.isShowMore`]: true
          })
        }
      }).exec()
    },
  }
})
