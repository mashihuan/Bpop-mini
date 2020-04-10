Component({
  properties: {
    // activeDetail: {
    //   type: Object,
    //   value: {}
    // },
    commentList: {
      type: Array,
      value: []
    },
    isShowMoreComment: {
      type: Boolean,
      value: false
    },
    commentCount: {
      type: Number,
      value: 0
    },
    kolid: {
      type: [Number, String],
      value: ''
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {

  },
  methods: {
    onReplyComment(event) {  // 点击评论 
      let commentId = event.currentTarget.dataset.commentid
      let isMine = event.currentTarget.dataset.ismine
      let nickName = event.currentTarget.dataset.nickname
      wx.showActionSheet({
        itemList: isMine ? ['回复', '删除'] : ['回复'],
        itemColor: '#000',
        success: (e) => {
          let tapIndex = e.tapIndex
          this.triggerEvent('onReplyComment', {commentId, tapIndex, nickName, isMine})
        }
      })
    },
    onUnfoldComment (event) { // 展开收起二级评论
      let isUnfold = event.currentTarget.dataset.isunfold
      let index = event.currentTarget.dataset.index
      this.triggerEvent('onUnfoldComment', {isUnfold, index})
    },
    onGetMoreComment () {  // 查看更多一级评论
      this.triggerEvent('onGetMoreComment')
    }
  }
})
