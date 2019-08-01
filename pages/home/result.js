// pages/home/result.js
var app = getApp();
const network = require('../../utils/network.js');
import Api from "../../config/api.js";
import * as echarts from '../../ec-canvas/echarts';
import { timeFormat } from '../../utils/dateUtils';
import { shareContent } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex:0,
    tabArray: ["等额本金", "等额本息"],
    showSave:true,
    dataInfo:{},
    loantotle:0,
    loantotlenew: 0,
    rate:0,
    ratenew: 0,
    month:0,
    totlePay:0,
    monthPay:0,
    low:0,
    results:[],
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isDisposed: false,
    date: '2016-09-01',
    animationData: {},

  },
  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.dataInfo.start_repayment_time = e.detail.value
    this.setData({
      date: e.detail.value
    })
  },
  setOption(chart) {
    let totle = this.data.loantotle + this.data.rate
    let totleR = Math.round(this.data.loantotle / totle * 100) ;
    let rateR = 100 - totleR;
    //console.log(totleR)
    //console.log(rateR)


    var option = {
      backgroundColor: "#ffffff",
      color: ["#FFB6C1", "#63B8FF"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: [{
          value: totleR,

        }, 
        {
          value: rateR,

        },
        

        ],
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 0,
            length2: 0
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)'
          }
        }
      }]
    };
    chart.setOption(option);
  },
  // 点击按钮后初始化图表
  init() {
    let _this = this
    //console.log(22)
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      _this.setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      //console.log(this.chart)

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  sure(e){
    // wx.showLoading({
    //   title: '保存中...',
    //   mask:true
    // })
  
    let _this = this;
    let param = this.data.dataInfo;
    param.repayment_type = this.data.curIndex;
    param.repayment_total_money = this.data.totlePay;
    param.repayment_interest = this.data.rate;
    param.repayment_month = this.data.month;
    param.repayment_per_month = this.data.monthPay;
    param.repayment_degression = this.data.low;
    param.start_repayment_time = this.data.date;
    param.api = Api.save
    //console.log(param)
    let dataInfo = wx.getStorageSync('dataInfo');
    console.log(dataInfo)
    let newData = [];
    if (dataInfo){
      newData = dataInfo
    }
   
    newData.unshift(param)
    wx.setStorageSync('dataInfo', newData);
    wx.showModal({
      title: '温馨提示',

      content: '房贷信息已保存成功，进入个人中心查看！',
      confirmText: '我知道了',
      confirmColor: '#FF6347',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    return;

    network.request(Api.app, param, "POST").then((response) => {
     
     
      wx.showModal({
        title: '温馨提示',
        
        content: '房贷信息已保存成功，进入个人中心查看！',
        confirmText: '我知道了',
        confirmColor: '#FF6347',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
           
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
       
      })
     
    });
    
  },
  tabClick: function (e) {
    this.data.curIndex = e.detail
    
    this.setData({
      curIndex: this.data.curIndex,
      loantotle: 0,
      loantotlenew: 0,
      rate: 0,
      ratenew: 0,
      month: 0,
      totlePay: 0,
      monthPay: 0,
      low: 0,
      results: [],
    },()=>{
      this.countResult();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    console.log('onLoad')
    this.data.dataInfo = app.globalData.countData;
    if (this.data.dataInfo.repayment_type) {
      this.data.curIndex = this.data.dataInfo.repayment_type
      this.setData({
        showSave: false,
        curIndex: this.data.curIndex
      })
    }
  },
  countResult(){
    let _this = this;
    let mon = Number(this.data.dataInfo.loan_year) * 12;
    let rate = 0;
    let money = Number(this.data.dataInfo.loan_total_money);
    this.data.loantotle = money;
    if (this.data.dataInfo.loan_type == 1) {
      rate = Number(this.data.dataInfo.paf_rate)
    }
    else if (this.data.dataInfo.loan_type == 2) {
      rate = Number(this.data.dataInfo.business_rate)
    }
    if (this.data.curIndex  == 0){
      //等额本金
      //       等额本金还款法:
      //       每月月供额 = (贷款本金÷还款月数) + (贷款本金 - 已归还本金累计额) ×月利率
      //       每月应还本金 = 贷款本金÷还款月数
      //       每月应还利息 = 剩余本金×月利率 = (贷款本金 - 已归还本金累计额) ×月利率
      //       每月月供递减额 = 每月应还本金×月利率 = 贷款本金÷还款月数×月利率
      //        总利息 =〔(总贷款额÷还款月数 + 总贷款额×月利率) +总贷款额÷还款月数×(1 + 月利率) 〕÷2×还款月数 - 总贷款额
      let bjsum = Math.ceil(money / mon*100)/100
      let low = Math.ceil(bjsum * (rate / 100 / 12)*100)/100;
      
      if (this.data.dataInfo.loan_type != 3) {
        for (let i = 0; i < mon; i++) {
          
          let yhlx = Math.ceil((money - i * bjsum) * (rate / 100 / 12)*100)/100;

          this.data.totlePay += bjsum + yhlx
          this.data.rate += yhlx
          if(i==0){
            this.data.monthPay = bjsum + yhlx
          }
         
        }
       
      }
      else{
        let ggjmoney =Number(this.data.dataInfo.paf_money);
        let ggjsum = Math.ceil(ggjmoney / mon*100)/100;
        let ggjrate = Number(this.data.dataInfo.paf_rate);
        let ggjlow = Math.ceil(ggjsum * (ggjrate / 100 / 12) * 100) / 100;

        let sdjmoney = Number(this.data.dataInfo.business_money);
        let sdsum = Math.ceil(sdjmoney / mon*100)/100;
        let sdjrate = Number(this.data.dataInfo.business_rate);
        let sdlow = Math.ceil(sdsum * (sdjrate / 100 / 12) * 100) / 100;

        for (let i = 0; i < mon; i++) {
         

          let ggjyhlx = Math.ceil((ggjmoney - i * ggjsum) * (ggjrate / 100 / 12)*100)/100;
          let sdyhlx = Math.ceil((sdjmoney - i * sdsum) * (sdjrate / 100 / 12)*100)/100;
          this.data.totlePay += ggjsum + sdsum + ggjyhlx + sdyhlx
          this.data.rate += ggjyhlx + sdyhlx
          if (i == 0) {
            this.data.monthPay = ggjsum + sdsum + ggjyhlx + sdyhlx
          }
        }
        low=ggjlow + sdlow
      
      }
     
      this.setData({
        totlePay: Math.ceil(this.data.totlePay / 10000 * 100) / 100,

        monthPay: Math.ceil(this.data.monthPay*100)/100 ,
        loantotle: this.data.loantotle,
        loantotlenew: Math.ceil(this.data.loantotle / 10000 * 100) / 100,
        rate: Math.ceil(this.data.rate * 100) / 100,
        ratenew: Math.ceil(this.data.rate / 10000 * 100) / 100,
        low: Math.ceil(low * 100) / 100,
        month: mon,
        //ec: { onInit: initChart} 
      },()=>{
        _this.init()
      })
    }
    else{
      //等额本息
//       每月月供额 =〔贷款本金×月利率×(1＋月利率) ＾还款月数〕÷〔(1＋月利率) ＾还款月数 - 1〕
// 每月应还利息 = 贷款本金×月利率×〔(1 + 月利率) ^ 还款月数 - (1 + 月利率) ^ (还款月序号 - 1) 〕÷〔(1 + 月利率) ^ 还款月数 - 1〕
// 每月应还本金 = 贷款本金×月利率×(1 + 月利率) ^ (还款月序号 - 1) ÷〔(1 + 月利率) ^ 还款月数 - 1〕
// 总利息 = 还款月数×每月月供额 - 贷款本金
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
      if (this.data.dataInfo.loan_type != 3){
        let monthRate = rate / 100 / 12
 
        let rmsum = Math.ceil(money * monthRate * Math.pow((1 + monthRate), mon) / (Math.pow((1 + monthRate), mon) - 1)*100)/100
        //console.log(rmsum)
       
        
        for (let i = 0; i < mon; i++) {
          let yhbj = (money * monthRate * Math.pow((1 + monthRate), i)) / (Math.pow((1 + monthRate), mon) - 1);
          let yhlx = rmsum - yhbj;

          this.data.rate += yhlx
          
          }  
        this.data.totlePay = rmsum * mon
        this.data.monthPay = rmsum
      }
      else{

        let ggjmoney = Number(this.data.dataInfo.paf_money) ;
        let ggjrate = Number(this.data.dataInfo.paf_rate);
        let sdjmoney = Number(this.data.dataInfo.business_money);
        let sdjrate = Number(this.data.dataInfo.business_rate);
        let ggjrmsum = Math.ceil(ggjmoney * (ggjrate / 100 / 12) * Math.pow((1 + (ggjrate / 100 / 12)), mon) / (Math.pow((1 + (ggjrate / 100 / 12)), mon) - 1)*100)/100;
        let sdrmsum = Math.ceil(sdjmoney * (sdjrate / 100 / 12) * Math.pow((1 + (sdjrate / 100 / 12)), mon) / (Math.pow((1 + (sdjrate / 100 / 12)), mon) - 1) * 100) / 100;   
        for (let i = 0; i < mon; i++) {
            
            // $results[$i]['zhklx'] = round((mon * results[i]['rmsum']) - money, 2);
            // $results[i]['zhked'] = round((mon * results[i]['rmsum']), 2);
            let ggjyhbj = (ggjmoney * (ggjrate / 100 / 12) * Math.pow((1 + (ggjrate / 100 / 12)), i)) / (Math.pow((1 + (ggjrate / 100 / 12)), mon) - 1);
            let sdyhbj = (sdjmoney * (sdjrate / 100 / 12) * Math.pow((1 + (sdjrate / 100 / 12)), i)) / (Math.pow((1 + (sdjrate / 100 / 12)), mon) - 1);
            let yhlx = ggjrmsum + sdrmsum - ggjyhbj - sdyhbj;
            // $results[i]['syhk'] = Math.round(((mon * rmsum) - (rmsum * (i + 1))), 2);
            
            this.data.rate += yhlx
              
        }
        this.data.monthPay = ggjrmsum + sdrmsum
        this.data.totlePay = (ggjrmsum + sdrmsum) * mon
      }
     
      this.setData({
        totlePay: Math.floor(this.data.totlePay / 10000 * 100) / 100,

        monthPay: this.data.monthPay,
        loantotle: this.data.loantotle,
        loantotlenew: Math.ceil(this.data.loantotle / 10000 * 100) / 100,
        rate: Math.ceil(this.data.rate * 100)/100,
        ratenew: Math.ceil(this.data.rate / 10000*100)/100,
       
        month: mon,
        //ec: { onInit: initChart } 
      }, () => {
        _this.init()
      })

    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    console.log('onReady')
    
   

    if (this.data.dataInfo.start_repayment_time) {
      this.setData({
        date: this.data.dataInfo.start_repayment_time
      })
    }
    this.countResult()
  },
  getCurMonth(date) {
    let index = 0;
    //console.log(date)
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
    //console.log(index)
    return index

  },

  detail(){
    if (!this.data.dataInfo.curMonth){
      this.data.dataInfo.curMonth= this.getCurMonth(this.data.dataInfo.start_repayment_time)
    }
    //console.log(this.data.dataInfo.curMonth)
    
    app.globalData.countData=this.data.dataInfo ;

    wx.navigateTo({
      url: './detail?curIndex=' + this.data.curIndex + '&totalPay=' + (this.data.loantotle + this.data.rate),
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.showSave)
    if (this.data.showSave){

    
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })

      this.animation = animation

      

      this.setData({
        animationData: animation.export()
      })

      setTimeout(function () {
        animation.translate(100).step()
        animation.scale(2, 2).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 1000)
    }
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