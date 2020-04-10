Component({
  properties: {
    standingsInfo: {
      type: Object,
      value: {}
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {

  },
  methods: {
    onGoToRecommend () {
      this.triggerEvent('onGoToRecommend')
    }
  }
})
