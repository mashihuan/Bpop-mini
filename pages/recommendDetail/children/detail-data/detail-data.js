Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {
    countDown: '',
    progressWidth: 0,
    timer: null,
  },
  options: {
    styleIsolation: "apply-shared"
  },
  pageLifetimes: {
    show () {
      this.timeFormat()
    },
    hide () {
      clearInterval(this.data.timer)
    },
  },
  methods: {
    showModal (e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    onEndRecommend () {
      this.triggerEvent('onEndRecommend')
    },
    timeFormat () {
      this.data.timer = setInterval(() => {
        let addTime = this.properties.item.addtime + ''
        let endTime = this.properties.item.endTime + ''
        let currentTimestamp = new Date().getTime()
        // 开始时间
        let addTimestamp = new Date(addTime.replace(/-/g, '/')).getTime()
        // 周期总时间
        let periodTimestamp = new Date(addTime.replace(/-/g, '/')).getTime() + this.properties.item.deadline * 1000 * 60 * 60 * 24
        // 结束时间
        let endTimestamp = new Date(endTime.replace(/-/g, '/')).getTime()
        // 荐币周期总秒数
        let totalTimeStamp = (endTimestamp - addTimestamp) / 1000
        // 距离结束时间差的秒数
        let diffTimestamp = (endTimestamp - currentTimestamp) / 1000
        let days = Math.floor(diffTimestamp / (60 * 60 * 24));
        let modulo = diffTimestamp % (60 * 60 * 24);
        let hours = Math.floor(modulo / (60 * 60));
        modulo = modulo % (60 * 60);
        let minutes = Math.floor(modulo / 60);
        let seconds = Math.floor(modulo % 60);
        this.setData({
          countDown: diffTimestamp <=0 ? endTime : "" + days + "天" + hours + "小时" + minutes + "分" + seconds + "秒",
          progressWidth: this.properties.item.status == 1 ? (100 - (diffTimestamp / totalTimeStamp) * 100) : ((endTimestamp - addTimestamp) / (periodTimestamp - addTimestamp) * 100)
        })
      }, 1000)
    },
    onPreviewImg(event) {  // 图片预览
      let urls = event.currentTarget.dataset.urls
      let index = event.currentTarget.dataset.index
      let arr = []
      urls.forEach((val,index) => {
        arr.push(val.imgUrl)
      })
      wx.previewImage({
        current: urls[index].imgUrl,
        urls: arr
      })
    }
  }
})
