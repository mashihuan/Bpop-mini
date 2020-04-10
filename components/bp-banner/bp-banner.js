Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    hasBanner: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    onOpenBannerDetail (event) {
      let id = event.currentTarget.dataset.id
      let link = event.currentTarget.dataset.link
      let linkType = event.currentTarget.dataset.linktype
      let list = event.currentTarget.dataset.list
      let arr = []
      list.forEach((val,index) => {
        arr.push(val.pic)
      })
      wx.previewImage({
        current: event.currentTarget.dataset.pic,
        urls: arr
      })
      // wx.navigateTo({
      //   url: '/pages/bannerDetail/bannerDetail?link=' + link
      // })
      // this.triggerEvent('onOpenBannerDetail', {id,link,linkType})
    }
  }
})
