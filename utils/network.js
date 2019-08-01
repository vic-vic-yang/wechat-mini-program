
//const app = getApp()
import { h5Url } from "../config/url.js"
import { setNewUrl } from "../utils/util.js"

function request(api, params, requestType, modal = true, toast = true) {
  let promise = new Promise(function (resolve, reject) {
    //console.log("request=" + h5Url + api + "," + JSON.stringify(params))
    params.user_id = getApp().globalData.userId
    wx.request({
      url: h5Url + api,
      data: params,
      method: 'POST',
      async: true,
      header: {
        'content-type': requestType == 'GET' ?
          'application/x-www-form-urlencoded' : 'application/json',
        "_token": getApp().globalData.token
      }, // 设置请求的 header
      success: function (res) {
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        //console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            resolve(res.data.data);
            if (modal) {
              wx.hideLoading();
            }
          }
          else {
            //console.log("2222"+res.data.code)
            wx.showToast({
              title: res.data.message,
              mask: true,
              icon: 'none'
            })
          }
        }
        else {
          wx.showToast({
            title: res.data.message || "请求失败",
            mask: true,
            icon: 'none'
          })
        }
      },
      fail: function (e) {
        //console.log('返回结果ERROR：' + e.errMsg)
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (toast) {
          wx.showToast({
            title: '服务器繁忙',
            mask: true,
            icon: 'none'
          })
        }
        reject({});
        //wx.hideLoading()
      }
    })
  });
  return promise
}
function upLoad(api, filePath, params, modal = true) {
  let promise = new Promise(function (resolve, reject) {

    wx.uploadFile({
      url: h5Url + api,
      filePath: filePath,
      formData: params,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        "_token": getApp().globalData.token
      }, // 设置请求的 header
      success: function (res) {
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data)
          if (data.code == 200) {
            resolve(data.data);
            if (modal) {
              wx.hideLoading();
            }
          }
          else {
            wx.showToast({
              title: res.data.message,
              mask: true,
              icon: 'none'
            })
          }
        }
        else if (res.statusCode == 401) {
          wx.hideLoading();
          getApp().getLoginByApp(reLoginCallBack);
        }
        else {
          wx.showToast({
            title: res.data.message || "请求失败",
            mask: true,
            icon: 'none'
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '服务器繁忙',
          mask: true,
          icon: 'none'
        })
        //wx.hideLoading()
      }
    })
  });
  return promise
}
//重新登录后的回调
function reLoginCallBack(result) {
  if (!result) {
    wx.showToast({
      title: "请求失败，请重新操作！",
      mask: true,
      icon: 'none'
    })
  } else {
    wx.showToast({
      title: "请重新操作！",
      mask: true,
      icon: 'none'
    })
  }
}
module.exports = {
  request: request,
  upLoad: upLoad,
}