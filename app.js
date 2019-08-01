//app.js
const updateManager = wx.getUpdateManager()
import Api from "./config/api.js"
const network = require('./utils/network.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    let _this = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("-----------app update=" + res.hasUpdate)
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })

        })
      }
    })
    this.initData();

    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       _this.getUserInfo()
         
    //     }
    //     else{
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //           _this.getUserInfo()
    //         }
    //       })
    //     }
    //   }
    // })
  },
  initData(){
    let _this = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log("---userId=" + res.data)
        if (res.data) {
          _this.globalData.userId = res.data;
        }
      }
    })
  },
  getUserInfo(){
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })
  },
  wxLogin: function () {
    // 登录
    let _this = this;
    wx.login({
      success: res => {
        console.log(res.code)
        _this.globalData.code = res.code
        _this.login();
      }
    })
  },
  loginCallBack: function () {
    let _this = this;
    if (_this.globalData.otherWndCallBack != null && typeof _this.globalData.otherWndCallBack === "function") {
      console.log("loginCallBack====")
      _this.globalData.otherWndCallBack(true);
    }
  },
  //和服务端获取用户信息
  login: function (loginCallBack) {
    let _this = this;
    let param = {};
    this.globalData.loginCallBack = loginCallBack
    param.api = Api.login; 
    param.code=this.globalData.code;
    
    network.request(Api.user, param, "POST").then((response) => {
      let user = response.user;
      _this.globalData.userId = user.user_id
      wx.setStorage({
        key: "userId",
        data: user.user_id
      })
      _this.loginCallBack()
    });
  },
  globalData: {
    userInfo: null,
    userId:'',
    code:'',
    token:"",
    loginCallBack:null,
    countData:{}
  }
})