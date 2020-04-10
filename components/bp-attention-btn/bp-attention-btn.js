import {
  takeAttention,
  deleteComment
} from '../../utils/api'
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
    }
  },
  data: {
    item1: {}
  },
  options: {
    styleIsolation: "apply-shared"
  },
  methods: {
    async onTakeAttention (event) {  // 关注
      let type = event.currentTarget.dataset.type // true 取消  false关注
      let result = await takeAttention({
        robotid: this.data.item1.kolid,
        type: type ? 0 : 1,
      })
      if(result.success) {
        wx.vibrateShort()
        wx.showToast({
          title: result.errorMsg,
          icon: 'none'
        })
        this.setData({
          'item1.isfans': !type
        })
        let attentionObj = {kolid: this.data.item1.kolid, flag: type, type: true}
        wx.setStorageSync('attentionObj', attentionObj)
      }
    },
    async onDeleteActive (event) {  // 删除
      let commentId = event.currentTarget.dataset.id
      wx.showModal({
        content: "删除后内容不可回复,是否继续删除?",
        success: async (res) => {
          if(res.confirm) {
            let result = await deleteComment({
              delType: 0,
              commentId: commentId
            })
            if(result.data.success) {
              wx.navigateBack()
              let deleteObj = {commentId, type: true}
              wx.setStorageSync('deleteObj', deleteObj)


              return
              let pages = getCurrentPages()
              let activePage = pages[pages.length - 2]
              activePage.data.activeList.forEach((value,index) => {
                let arr = []
                value.list.forEach((val, ind) => {
                  if(val.id != commentId) {
                    arr.push(val)
                  }
                })
                if(index == 0) {
                  activePage.setData({
                    'activeList[0].list': arr
                  })
                }
                if(index == 1) {
                  activePage.setData({
                    'activeList[1].list': arr
                  })
                }
              })  
              setTimeout(() => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
              }, 300)           
            }
          }
        }
      })
      
    }
  }
})
