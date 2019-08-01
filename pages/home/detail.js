// pages/home/detail.js
var app = getApp();
import { shareContent } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    curIndex:0,
    totalPay:0,
    curMonth:0,
    toView:""

  },
  countResult() {
    let _this = this;
    let mon = Number(this.data.dataInfo.loan_year) * 12;
    let rate = 0;
    let money = Number(this.data.dataInfo.loan_total_money);
    let totalPay = this.data.totalPay
    let totalPayN = this.data.totalPay

    if (this.data.dataInfo.loan_type == 1) {
      rate = Number(this.data.dataInfo.paf_rate)
    }
    else if (this.data.dataInfo.loan_type == 2) {
      rate = Number(this.data.dataInfo.business_rate)
    }
    if (this.data.curIndex == 0) {
      //等额本金
      //       等额本金还款法:
      //       每月月供额 = (贷款本金÷还款月数) + (贷款本金 - 已归还本金累计额) ×月利率
      //       每月应还本金 = 贷款本金÷还款月数
      //       每月应还利息 = 剩余本金×月利率 = (贷款本金 - 已归还本金累计额) ×月利率
      //       每月月供递减额 = 每月应还本金×月利率 = 贷款本金÷还款月数×月利率
      //        总利息 =〔(总贷款额÷还款月数 + 总贷款额×月利率) +总贷款额÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 总贷款额
      let bjsum = Math.ceil(money / mon * 100) / 100
      let low = Math.ceil(bjsum * (rate / 100 / 12) * 100) / 100;

      if (this.data.dataInfo.loan_type != 3) {
       
        for (let i = 0; i < mon; i++) {
          let yhlx = Math.ceil((money - i * bjsum) * (rate / 100 / 12) * 100) / 100;

          totalPayN = Math.ceil((totalPayN -bjsum - yhlx) * 100) / 100
          totalPay = Math.ceil(totalPayN)
          if (i == mon - 1) {
            totalPay = 0;
          }
          let data={
            month: (i + 1) + "月",
            sum: Math.round(bjsum + yhlx),
            ygbj: Math.round(bjsum),
            yhlx: Math.round(yhlx),
            syhk: totalPay
          }
          this.data.data.push(data)
          
        }

      }
      else {
        let ggjmoney = Number(this.data.dataInfo.paf_money);
        let ggjsum = Math.ceil(ggjmoney / mon * 100) / 100;
        let ggjrate = Number(this.data.dataInfo.paf_rate);
        let ggjlow = Math.ceil(ggjsum * (ggjrate / 100 / 12) * 100) / 100;

        let sdjmoney = Number(this.data.dataInfo.business_money);
        let sdsum = Math.ceil(sdjmoney / mon * 100) / 100;
        let sdjrate = Number(this.data.dataInfo.business_rate);
        let sdlow = Math.ceil(sdsum * (sdjrate / 100 / 12) * 100) / 100;

        for (let i = 0; i < mon; i++) {


          let ggjyhlx = Math.ceil((ggjmoney - i * ggjsum) * (ggjrate / 100 / 12) * 100) / 100;
          let sdyhlx = Math.ceil((sdjmoney - i * sdsum) * (sdjrate / 100 / 12) * 100) / 100;


  

          totalPayN = Math.ceil((totalPayN -ggjsum - sdsum - ggjyhlx - sdyhlx) * 100) / 100
          totalPay = Math.ceil(totalPayN)
          if (i == mon - 1) {
            totalPay = 0;
          }
          let data = {
            month: (i + 1) + "月",
            sum: Math.ceil(ggjsum + sdsum + ggjyhlx + sdyhlx),
            ygbj: Math.round(ggjsum + sdsum),
            yhlx: Math.round(ggjyhlx + sdyhlx),
            syhk: totalPay
          }
          this.data.data.push(data)
        }
      }

     
    }
    else {
      //等额本息
      //     * rate    年利率
      //     * mon     贷款期限 月
      //     * money   贷款金额
      //     *
      //     * rmsum    每月还款总额
      //     * zhklx    总还款利息
      //     * zhked    总还款金额
      //     * yhbj     应还本金
      //     * yhlx     应还利息
      //     * syhk     剩余还款
      if (this.data.dataInfo.loan_type != 3) {

        let monthRate = rate / 100 / 12

        let rmsum = Math.ceil(money * monthRate * Math.pow((1 + monthRate), mon) / (Math.pow((1 + monthRate), mon) - 1) * 100) / 100

        for (let i = 0; i < mon; i++) {


          let yhbj = (money * monthRate * Math.pow((1 + monthRate), i)) / (Math.pow((1 + monthRate), mon) - 1);
          let yhlx = rmsum - yhbj;
          // $results[i]['syhk'] = Math.round(((mon * rmsum) - (rmsum * (i + 1))), 2);
          totalPayN = Math.ceil((totalPayN - rmsum)*100)/100
          totalPay = Math.ceil(totalPayN)
          if (i == mon-1 ){
            totalPay = 0;
          }
          let data = {
            month: (i + 1) + "月",
            sum: Math.ceil(rmsum),
            ygbj: Math.round(yhbj),
            yhlx: Math.round(yhlx),
            syhk: totalPay
          }
          this.data.data.push(data)

          
        }
      }
      else {

        let ggjmoney = Number(this.data.dataInfo.paf_money);
        let ggjrate = Number(this.data.dataInfo.paf_rate);
        let sdjmoney = Number(this.data.dataInfo.business_money);
        let sdjrate = Number(this.data.dataInfo.business_rate);

        let ggjrmsum = Math.ceil(ggjmoney * (ggjrate / 100 / 12) * Math.pow((1 + (ggjrate / 100 / 12)), mon) / (Math.pow((1 + (ggjrate / 100 / 12)), mon) - 1) * 100) / 100;
        let sdrmsum = Math.ceil(sdjmoney * (sdjrate / 100 / 12) * Math.pow((1 + (sdjrate / 100 / 12)), mon) / (Math.pow((1 + (sdjrate / 100 / 12)), mon) - 1) * 100) / 100;   

        for (let i = 0; i < mon; i++) {

          let ggjyhbj = (ggjmoney * (ggjrate / 100 / 12) * Math.pow((1 + (ggjrate / 100 / 12)), i)) / (Math.pow((1 + (ggjrate / 100 / 12)), mon) - 1);
          let sdyhbj =(sdjmoney * (sdjrate / 100 / 12) * Math.pow((1 + (sdjrate / 100 / 12)), i)) / (Math.pow((1 + (sdjrate / 100 / 12)), mon) - 1);
          let yhlx = ggjrmsum + sdrmsum - ggjyhbj - sdyhbj;


          totalPayN = Math.ceil((totalPayN - ggjrmsum - sdrmsum) * 100) / 100
          totalPay = Math.ceil(totalPayN)
          if (i == mon - 1) {
            totalPay = 0;
          }
          let data = {
            month: (i + 1) + "月",
            sum: Math.ceil(ggjrmsum + sdrmsum),
            ygbj: Math.round(ggjyhbj + sdyhbj),
            yhlx: Math.round(yhlx),
            syhk: totalPay
          }
          this.data.data.push(data)

        }
      }
     

    }

    this.setData({
      data: this.data.data,
      toView: "curView" + (this.data.curMonth-1),
      //ec: { onInit: initChart} 
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.curIndex = options.curIndex
    this.data.totalPay = parseInt(options.totalPay) 
    if (this.data.curIndex == 0){
      wx.setNavigationBarTitle({
        title: '等额本金',
      })

    }
    else{
      wx.setNavigationBarTitle({
        title: '等额本息',
      })

    }
    this.data.dataInfo = app.globalData.countData;
    this.setData({
      curMonth: this.data.dataInfo.curMonth > 0 ? this.data.dataInfo.curMonth:0
    })
    this.countResult()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: shareContent(),
      path: "/pages/home/index",
      imageUrl: "",
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})