import request from './request.js'

// const BASE_URL = 'http://app.u-ico.com/';  //测试
const BASE_URL = 'https://app.bpop.vip/';  //线上

export {
  BASE_URL
}

/* 获取图形验证码 */
export const getPicCode = (data) => (BASE_URL + 'login/getcaptchaNo?time=' + data.random)

/* 获取短信验证码 */
export const getSmsCode = (data) => request(BASE_URL + 'login/checkCode', data)

/* 获取国家和地区 */
export const getCountryList = (data) => request(BASE_URL + 'login/countryPrefix', data)

/* 手机号绑定 */
export const phoneLogin = (data) => request(BASE_URL + 'userBindingPhoneSmallProgram', data)

/* 微信授权获取openid */
export const wxLogin = (data) => request(BASE_URL + 'login/getWeChatInfo', data)

/* 授完权默认注册 */
export const register = (data) => request(BASE_URL + 'login/loginByWechat', data, {}, 'POST', {'content-type': 'application/json'})

/* 获取轮播图 */
export const getBannerList = (data) => request(BASE_URL + 'login/getBannerlist', data)

/* 是否展示下载页 */
export const getEditBtnStatus = (data) => request(BASE_URL + 'wechatRedPacket/queryIsShow', data)

/* 获取动态列表 */
export const getActiveList = (data) => request(BASE_URL + 'comment/homeComments', data)

/* 对动态点赞 */
export const favoriteComment = (data) => request(BASE_URL + 'comment/userFabulous', data, {checkLogin:true})

/* 获取动态详情 */
export const getActiveDetail = (data) => request(BASE_URL + 'comment/getCommentDetail', data)

/* 关注kol */
export const takeAttention = (data) => request(BASE_URL + 'fans/takeAttention', data, {checkLogin:true})

/* 获取动态的评论 */
export const getActiveComment = (data) => request(BASE_URL + 'recommendCurrency/getCommentlistByRecommend', data)

/* 获取kol的荐币数据（战绩） */
export const getKolStandings = (data) => request(BASE_URL + 'recommendCurrency/getShareDetailSmallProgram', data)

/* 获取kol的动态列表 */
export const getKolActiveList = (data) => request(BASE_URL + 'comment/getKolDetailCommentlist', data)

/* 评论动态 */
export const commentActive = (data) => request(BASE_URL + 'comment/userComment', data, {checkLogin:true})

/* 删除评论 */
export const deleteComment = (data) => request(BASE_URL + 'comment/delMyComment', data)

/* 获取kol的荐币列表 */
export const getKolRecommentList = (data) => request(BASE_URL + 'recommendCurrency/allRecommendInfo', data, {}, 'POST', {'content-type': 'application/json'})

/* 获取荐币详情 */
export const getrecommendDetail = (data) => request(BASE_URL + 'recommendCurrency/getRecommendCurrencyDetail', data)

/* 获取荐币的评论 */
export const getRecommentComment = (data) => request(BASE_URL + 'recommendCurrency/getCommentlistByRecommend', data)

/* 评论荐币 */
export const commentRecommend = (data) => request(BASE_URL + 'recommendCurrency/userCommentRecommend', data, {checkLogin:true})

/* 结束荐币 */
export const endRecommend = (data) => request(BASE_URL + 'recommendCurrency/endRecommendInfo', data)

/* 获取泡泡糖余额 */
export const getWalletBalance = (data) => request(BASE_URL + 'wallet/getMyWallet', data)

/* 解锁荐币 */
export const unlockRecommend = (data) => request(BASE_URL + 'recommendCurrency/takeRecommendInfo', data)

/* 获取充值金额的选项 */
export const getRechargeType = (data) => request(BASE_URL + 'unifiedPay/quickPay', data)

/* 点击充值 */
export const recharge = (data) => request(BASE_URL + '/unifiedPay/smallprogramRecharge', data)

/* 获取泡泡糖交易记录 */
export const getTradingRecord = (data) => request(BASE_URL + 'point/getSweetRecordList', data)

/* 初始化红包 */
export const initRedPacket = (data) => request(BASE_URL + 'wechatRedPacket/init', data, {}, 'GET')

/* 检查用户是否领取过红包 */
export const checkUserRecord = (data) => request(BASE_URL + 'wechatRedPacket/queryRed', data, {})

/* 查询用户手机（用于展示红包放入的账号）*/
export const getUserPhone = (data) => request(BASE_URL + '/app/getUserMobile', data, {}, 'GET')

/* 打开红包 */
export const openRed = (data) => request(BASE_URL + 'wechatRedPacket/saveRed', data,{})

/* 获取红包领取记录 */
export const getRedRecord = (data) => request(BASE_URL + 'wechatRedPacket/list', data, {})

