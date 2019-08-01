// pages/me/index.js
var app = getApp();
const network = require('../../utils/network.js');
import Api from "../../config/api.js";
import {
  timeFormat
} from '../../utils/dateUtils';
import {
  shareContent
} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    list: [],
    loadingStatus: 'loading'


  },
  delData(index) {
    let _this = this;
    this.data.list.splice(index,1)
    this.setData({
      list: this.data.list
    })
    wx.setStorageSync('dataInfo', this.data.list);


    // wx.showLoading({
    //   title: '处理中...',
    //   mask: true,
    // })
    // network.request(Api.app, { api: Api.deleteLoan,id:data.id}, "POST",false).then((response) => {
    //   _this.getList()
    // });
  },
  more(e) {
    console.log(e)
    let data = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let _this = this
    wx.showActionSheet({
      itemList: ['还款明细', '删除', '取消'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          _this.detail(data)
        } else if (res.tapIndex == 1) {
          wx.showModal({
            title: '温馨提示',
            content: '您确定要删除当前选择的房贷信息吗？',
            confirmColor: '#FF6347',
            success: function(res) {
              if (res.confirm) {
                _this.delData(index)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {

        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  getCurMonyh(date) {
    let index = 0;
    console.log(date)
    if (date) {
      let myDate = new Date();
      let date1 = timeFormat(myDate.getTime(), 'yyyy-MM-dd')

      date1 = date1.split('-');
      // 得到月数
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);

      // 拆分年月日
      date = date.split('-');
      // 得到月数
      date = parseInt(date[0]) * 12 + parseInt(date[1]);

      index = Math.abs(date1 - date) + 1;
    }

    return index

  },

  show(e) {
    let data = e.currentTarget.dataset.item
    app.globalData.countData = data
    //console.log(data)
    wx.navigateTo({
      url: '../home/result?curIndex=' + data.repayment_type + "&totalPay=" + (parseInt(data.loan_total_money) + parseInt(data.repayment_interest)),
    })
  },
  dengcha(n, a, s) {
    if (n == 1)
      return a;
    else
      return (s + this.dengcha(n - 1, a, s));
  },
  detail(data) {

    app.globalData.countData = data
    //console.log(data)
    wx.navigateTo({
      url: '../home/detail?curIndex=' + data.repayment_type + '&totalPay=' + (parseInt(data.loan_total_money) + parseInt(data.repayment_interest)),
    })
  },
  setResult(result) {
    //console.log(result)
    for (let i = 0; i < result.length; i++) {
      result[i]['showRate'] = Math.floor(result[i].repayment_interest / 10000 * 100) / 100
      result[i]['curMonthPay'] = result[i].repayment_per_month
      result[i]['curMonth'] = this.getCurMonyh(result[i].start_repayment_time)
      result[i]['laterPay'] = Math.floor((Number(result[i].loan_total_money) + Number(result[i].repayment_interest) - result[i]['curMonth'] * result[i]['curMonthPay']) / 10000 * 100) / 100

      if (result[i].repayment_type == 0) {
        result[i]['curMonthPay'] = Number(result[i].repayment_per_month) - Number(result[i].repayment_degression) * (result[i]['curMonth'] - 1)

        let a = result[i]['curMonthPay']
        let d = Number(result[i].repayment_degression)
        let n = result[i]['curMonth']

        let s = a + (n - 1) * d;
        console.log(result[i].repayment_type)
        result[i]['laterPay'] = Math.floor((Number(result[i].loan_total_money) + Number(result[i].repayment_interest) - this.dengcha(n, a, s)) / 10000 * 100) / 100

      }
      result[i]['totleMoney'] = Math.floor(result[i].loan_total_money / 10000 * 100) / 100
      result[i]['pepayMoney'] = Math.floor(result[i].repayment_interest / 10000 * 100) / 100
      result[i]['reMoney'] = Math.floor((result[i]['totleMoney'] + result[i]['pepayMoney']) * 100) / 100
      result[i]['percent'] = Math.ceil(result[i]['curMonth'] / result[i].repayment_month * 100)
      console.log(result[i]['percent'])
    }
    //console.log(result)
    return result

  },
  getList(e) {
    let dataInfo = wx.getStorageSync('dataInfo');
    let data = this.setResult(dataInfo)
    this.setData({
      list: data,
      loadingStatus: 'end'
    })
    return
    let _this = this;
    let param = {};
    param.api = Api.getList
    //console.log(param)

    network.request(Api.app, param, "POST", true, false).then((response) => {
      let data = _this.setResult(response.house_loan_list)
      _this.setData({
        list: data,
        loadingStatus: 'end'
      })
    }).catch(err => {
      _this.setData({
        loadingStatus: 'end'
      })
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: shareContent(),
      path: "/pages/home/index",
      imageUrl: "",
      success: function(res) {

      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})