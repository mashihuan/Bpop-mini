import { 
  getPicCode,
  getSmsCode,
  phoneLogin
} from '../../utils/api'
import Util from '../../utils/util.js'

let app = getApp()

Page({
  data: {
    picUrl: '',
    countryName: '中国大陆',
    countryCode: 'CHN',
    isoCode: '86',
    phoneNum: '',
    picCode: '',
    smsCode: '',
    countDown: 0,
    captchaToken: '',
    timer: null,
    showBtnLoading: false,
    statusBarHeight: 0,
  },
  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight
    })
    this._getPicCode()
  },
  onChooseCountry () {
    wx.navigateTo({
      url: '/pages/chooseCountry/chooseCountry'
    })
  },
  async getSmsCode () {  // 获取短信验证码
    if(Util.isEmpty(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if(!Util.validatePhone(this.data.phoneNum) && this.data.isoCode == 86) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if(!Util.validateForeignPhone(this.data.phoneNum) && this.data.isoCode != 86) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if(Util.isEmpty(this.data.picCode)) {
      wx.showToast({
        title: '请输入计算结果',
        icon: 'none'
      })
      return
    }
    let result = await getSmsCode({
      mobilenum: this.data.phoneNum,
      captchaNo: this.data.picCode,
      captchaToken: this.data.captchaToken,
      countryCode: this.data.countryCode,
      codetype: 'loginBind',
    })
    if(result.success) {
      this.setData({
        countDown: 120
      })
      wx.showToast({
        title: '验证码已发送'
      })
      this.data.timer = setInterval(() => {
        this.setData({
          countDown: this.data.countDown - 1
        })
        if(this.data.countDown <= 0) {
          this.setData({
            countDown: 0
          })
          clearInterval(this.timer)
        }
      }, 1000)
    }
  },
  async onLoginEvent () {  // 绑定手机号
    if(Util.isEmpty(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if(!Util.validatePhone(this.data.phoneNum) && this.data.isoCode == 86) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if(!Util.validateForeignPhone(this.data.phoneNum) && this.data.isoCode != 86) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if(Util.isEmpty(this.data.picCode)) {
      wx.showToast({
        title: '请输入计算结果',
        icon: 'none'
      })
      return
    }
    if(Util.isEmpty(this.data.smsCode)) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none'
      })
      return
    }
    this.setData({
      showBtnLoading: true
    })
    let result = await phoneLogin({
      phone: this.data.phoneNum,
      code: this.data.smsCode,
      captchaNo: this.data.picCode,
    })
    this.setData({
      showBtnLoading: false
    })
    if(result.success) {   // 绑定成功
      wx.setStorageSync('loginToken', result.data.loginToken)
      // wx.setStorageSync('red_loginToken', result.data.loginToken)
      wx.setStorageSync('tokenid', result.data.id)
      wx.navigateBack()
    }else {
      this._getPicCode()
    }
  },
  async _getPicCode () {  // 获取图形验证码
    let timeStamp = Date.now()
    let random = timeStamp + "-" + Math.floor(Math.random() * 1000);
    let result = await getPicCode({random})
    this.setData({
      picUrl: result,
      captchaToken: random
    })
  },
  onInputChange (event) {  // 获取输入框内容
    let value = event.currentTarget.dataset.value
    this.setData({
      [value]: event.detail.value
    })
  },
  onBackClick () {
    wx.navigateBack({})
  }
})