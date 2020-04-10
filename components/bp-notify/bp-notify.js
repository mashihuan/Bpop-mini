
Component({
  properties: {
    showNotify: {
      type: Boolean,
      value: false,
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  observers: {
    showNotify (value) {
      clearInterval(this.data.timer)
      this.data.timer = setTimeout(() => {
        this.setData({
          showNotify: false
        })
      }, 2500)
    }
  },
  data: {
    timer: null
  },
  methods: {

  }
})
