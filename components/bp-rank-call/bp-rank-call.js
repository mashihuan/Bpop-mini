Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    showFans: {
      type: Boolean,
      value: false
    },
    showSkeleton: {
      type: Boolean,
      value: false
    },
    showHost: {
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
  methods: {

  }
})
