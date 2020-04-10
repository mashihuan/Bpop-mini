Component({
  properties: {
    item: {  // 点赞信息
      type: Object,
      value: {}
    },
    placeholder: {
      type: String,
      value: '说说你的想法吧'
    },
    content: {
      type: String,
      value: ''
    },
    isFocus: {
      type: Boolean,
      value: false
    },
    isShowFavorite: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isFocus1: false
  },
  observers: {
    isFocus(newVal) {
      this.setData({
        isFocus1: newVal
      })
    }
  },
  options: {
    styleIsolation: "apply-shared"
  },
  methods: {
    onInputFocus () {
      this.setData({
        isFocus1: true
      })
    },
    onInputBlur () {
      setTimeout(() => {
        this.setData({
          isFocus1: false
        })
      }, 300)
    },
    onInputChage (e) {
      this.triggerEvent('onInputChage', {value:e.detail.value})
    },
    onSubmit () {
      this.triggerEvent('onSubmit', {})
    }
  }
})
