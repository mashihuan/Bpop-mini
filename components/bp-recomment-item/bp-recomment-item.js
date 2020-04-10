Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  options: {
    styleIsolation: "apply-shared"
  },
  methods: {
    onGoToDetail(event) {
      let recommentId = event.currentTarget.dataset.recommentid
      this.triggerEvent('onGoToDetail', {recommentId})
    }
  }
})
