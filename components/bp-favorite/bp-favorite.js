import {  
  favoriteComment
} from '../../utils/api'
import Util from '../../utils/util'

Component({
  properties: {
    item: {
      type: Object,
      value: {},
      observer: function (newValue, oldValue) {
        this.setData({
          item1: newValue
        })
      }
    },
    showMessage: {
      type: Boolean,
      value: true
    },
    showFavorite: {
      type: Boolean,
      value: true
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
    item1: {},
    disabled: false
  },
  methods: {
    async onfavorite (event) {
      if(this.properties.showSkeleton) {return}
      let commentId = event.currentTarget.dataset.commentid
      let type = event.currentTarget.dataset.type // 0点赞 >0取消
      let result = await favoriteComment({
        type: 1,
        commentId: commentId
      })
      if(result.success) {
        wx.vibrateShort()
        wx.showToast({
          title: type > 0 ? '取消点赞成功' : '点赞成功',
          icon: 'none'
        })
        this.setData({
          'item1.myFabulousAccount': type > 0 ? 0 : 1,
          'item1.fabulousAccount': type > 0 ? (this.data.item1.fabulousAccount - 1) : (this.data.item1.fabulousAccount + 1)
        })
        let favoriteObj = {commentId,type,isChange:true,num: this.data.item1.fabulousAccount}
        wx.setStorageSync('favoriteObj', favoriteObj)
      }
    },
    async onComment () {
      if(this.properties.showSkeleton) {return}
      let res = await Util.checkLogin()
      if(!res) {return}
    },
  }
})
