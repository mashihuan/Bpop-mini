Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    currentIndex: {
      type: [Array, String],
      value: 0
    },
    showNotify: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    
  },
  methods: {
    onSwitchTab (event) {
      let index = event.currentTarget.dataset.index;
      if(this.data.currentIndex == index) {return}
      this.setData({
        currentIndex: index
      })
      this.triggerEvent('onSwitchTab', {index})
    }
  }
})
