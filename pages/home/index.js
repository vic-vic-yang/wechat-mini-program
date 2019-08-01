// pages/home/index.js
var app = getApp();
const network = require('../../utils/network.js');
import Api from "../../config/api.js";
import { timeFormat } from '../../utils/dateUtils';
import { shareContent } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArray: ["公积金贷款", "商业贷款", '组合贷款'],

    curIndex:0, //贷款类型 
    countType:0, //计算方式

    housePrice:0, //房子总价
    loanratio: 7,//贷款比例
    loantotle: 0,//贷款总额

    loantime: 30,//贷款年限

    initText:'最新基准利率',

    ggjloantotle :0,//公积金贷款总额
    rateText:'最新基准利率',
    initValue: 3.25,
    interestrate: 3.25,//贷款利率

    //curIndex==3 时  商业贷款 数字
    loantotlenew: 0,//贷款总额 
    rateTextNew: '最新基准利率',
    initValueNew: 4.9,
    interestratenew: 4.9,//贷款利率

    showChoose:false,
    curChooseIndex:1,//1 选比例  2 选贷款年限
    sureIndex:2,
    sureTimeIndex:0,
    chooseData: [],
    value: [999],

    showChooseTwo:false,
    curRateIndex: 1,//1 公积金  2 商贷
    rateData:[],
    imgalist: ['../../images/ss.png'],
    imagePath:"",

  },
  //计算利率
  sure(e){
    if (!this.data.loantotle){
      wx.showToast({
        title: '请输入贷款金额',
        icon:'none'
      })
      return
    }
    var myDate = new Date()
    app.globalData.countData ={
      "cale_type": parseInt(this.data.countType)+1,//计算方式,1=>按贷款总额 2->按房价总额
      "house_total_money": this.data.housePrice*10000,//房价总额
      "loan_rate": this.data.loanratio,//贷款比例
      "loan_type": parseInt(this.data.curIndex)+1,//贷款类型1-公积金贷款 2-商业贷款 3-组合贷款
      "loan_total_money": this.data.loantotle*10000,//贷款总额
      "paf_money": this.data.ggjloantotle * 10000,//公积金贷款
      "paf_rate": this.data.interestrate,//公积金利率
      "business_money": this.data.loantotlenew * 10000,//商业贷款
      "business_rate": this.data.interestratenew,//商贷利率
      "loan_year": this.data.loantime,//贷款年限
      "start_repayment_time": timeFormat(myDate.getTime(),'yyyy-MM-dd')
      // "repayment_type": this.data.countType,//类型 1-等额本金 2-等额本息
      // "repayment_total_month": this.data.countType,//还款总额
      // "repayment_interest": this.data.countType,//支付利息
      // "repayment_month": this.data.countType,//贷款月数
      // "repayment_per_month": this.data.countType//月均还款
    } 
    console.log(app.globalData.countData)
    wx.navigateTo({
      url: './result',
    })

  },

  inputCallBack(e){
    //console.log(e.detail)
    let inputType = e.detail.type;
    let value = e.detail.value;
    value = Number(value)
    switch (inputType){
      case 'housePrice': 
        this.data.housePrice = Number(value);
        this.data.loantotle = Math.ceil(this.data.housePrice * this.data.loanratio / 10) 
        this.setData({
          housePrice: this.data.housePrice,
          loantotle: this.data.loantotle,//贷款总额
          ggjloantotle: 0,//公积金贷款总额
          //curIndex==3 时  商业贷款 数字
          loantotlenew: this.data.loantotle,//贷款总额 
        })
     
      break;
     
      case 'loantotle': 
        this.data.loantotle = parseInt(value);
      
        this.setData({
          loantotle: this.data.loantotle,
          ggjloantotle: 0,//公积金贷款总额
          //curIndex==3 时  商业贷款 数字
          loantotlenew: this.data.loantotle,//贷款总额 
        })
        
      break;
     
      case 'ggjloantotle': 
        value = Number(value)
        let loantotle = value > this.data.loantotle ? this.data.loantotle:value

        
        this.data.ggjloantotle = parseInt(loantotle) ;
        this.data.loantotlenew = this.data.loantotle-this.data.ggjloantotle

        this.setData({
          ggjloantotle: parseInt(this.data.ggjloantotle),
          loantotlenew: parseInt(this.data.loantotlenew)
        })
        
        break;
     
      case 'loantotlenew':
       
        value = Number(value)

        let loantotlenew = value > this.data.loantotle ? this.data.loantotle : value


        this.data.loantotlenew = parseInt(loantotlenew);
        this.data.ggjloantotle = this.data.loantotle - this.data.loantotlenew
        this.setData({
          ggjloantotle: parseInt(this.data.ggjloantotle),
          loantotlenew: this.data.loantotlenew
        })
        break;
     
    }
    console.log(this.data)

   
  },
  tabClick: function (e) {
    this.data.curIndex = e.detail
    this.setData({
      curIndex: this.data.curIndex
    })
  },
  dataSure() {
    this.showModel(true)
   
    if (this.data.curChooseIndex == 1){
      this.data.loanratio = this.data.sureIndex + 1
      this.data.loantotle = Math.ceil(this.data.housePrice * this.data.loanratio / 10)


      this.setData({
        loantotle: this.data.loantotle,//贷款总额
        ggjloantotle: 0,//公积金贷款总额
        //curIndex==3 时  商业贷款 数字
        loantotlenew: this.data.loantotle,//贷款总额 
        loanratio: this.data.loanratio,
        value: [this.data.sureIndex]
      })


    }
    else{
      let year = 30 - this.data.sureTimeIndex
      console.log('======', this.data.sureTimeIndex)
      this.setData({
        loantime: year,
        value: [this.data.sureTimeIndex]
      })
    }
    


  },
  bindChange: function (e) {
    console.log('====', e.detail)
    if (this.data.curChooseIndex == 1) {
      this.data.sureIndex = Number(e.detail)
    }
    else if (this.data.curChooseIndex == 2) 
    {
      this.data.sureTimeIndex = Number(e.detail)
    }
   
  },
  dataSureTwo(e){
    console.log(e.detail)
    let data = e.detail
    this.showModelTwo()
    if (this.data.curRateIndex==1){
      this.setData({
        rateText: data.text,
        interestrate:data.value,
      })

    }
    else{
      this.setData({
        rateTextNew: data.text,
        interestratenew: data.value,
      })
    }



  },
  showChooseTwo(curIndex){
    let _this = this;
    let chooseData = []
    let init = 7;
    let initValue = this.data.initValue
    let rateText = this.data.rateText
    if (curIndex == 2){
      initValue = this.data.initValueNew
      rateText = this.data.rateTextNew
    }
    console.log(rateText)

    for (let i = 0; i < 13; i++) {
      let value = {}
      if (init==10){
          value = {
          text: this.data.initText,
          value: initValue,
          select: rateText == this.data.initText?true:false
        }
        init += 0.5
      }
      else if (init<10){
        let text = this.data.initText + init + '折'
        value = {
          text: text,
          value: Math.floor(init / 10 * initValue * 1000) / 1000,
          select: rateText == text ? true : false
        }
        init += 0.5
      }
      else{
        let text = this.data.initText + init / 10 + '倍，即上浮' + Math.round((init / 10-1)*100)+"%"
        value = {
          text: text,
          value: Math.floor(init / 10 * initValue*1000)/1000,
          select: rateText == text ? true : false
        }
        init += 0.5
      }
      chooseData.push(value)
    }
    

    //console.log(chooseData)
    this.setData({
      rateData: chooseData,
      curRateIndex:curIndex
    },()=>{
      this.showModelTwo()
    })
  },
  showModelTwo() {
    this.setData({
      showChooseTwo: !this.data.showChooseTwo,
    })
  },
  showChoose(curIndex) {
    let _this = this;
    let chooseData = []
    let vaule=[]
    console.log(curIndex)
    if (curIndex == 1){
      for(let i = 1; i<=9;i++){
        chooseData.push(i+'成')
      }
      vaule = [2]
    }
    else if (curIndex == 2) {
      
      for (let i = 0; i < 30; i++) {
        chooseData.push((30-i) + '年')
      }
      vaule = [this.data.sureTimeIndex]
    }
    
    console.log(chooseData)
    this.setData({
      curChooseIndex: curIndex,
      chooseData:chooseData,
      vauleIndex: vaule
    },()=>{
      _this.showModel()
    })
  },
  showModel(flag){
    if (flag) {

    }
    this.setData({
      showChoose: !this.data.showChoose,
    })
  },

  rowClick(e) {
    let _this = this;
    let data = e.detail
    if (data == "countType") {
      wx.showActionSheet({
        itemList: ['按贷款总额计算', '按房价总额计算'],
        success: function (res) {
          _this.setData({
            countType: res.tapIndex
          })
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
    else if (data == "loantime") {
      this.showChoose(2)
    }
    else if (data == "loanratio") {
      this.showChoose(1)
    }
    else if (data =="interestrate"){
      let curIndex = 2 
      if (this.data.curIndex == 0 || this.data.curIndex == 2){
        curIndex = 1;
      }
      //console.log(curIndex)
      this.showChooseTwo(curIndex)
    }
    else if (data == "interestratenew") {
      this.showChooseTwo(2)
    }
  },
  getcode(){
    let params = {
      page: "pages/home/index",
      width: 300,
      is_hyaline: true,
    }
    network.request(Api.carete, param, "POST").then((response) => {
    })

  },
  showImg(){
    console.log(this.data.imagePath)
    wx.previewImage({
      urls: [this.data.imagePath],
    })
  },
  draw: function (canvas, $this, ecc) {
    var that = this;

    if (!canvas) {
      console.warn('No canvas provided to draw QR code in!')
      return;
    }
    var ctx = wx.createCanvasContext(canvas, $this);
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    //ctx.draw()
    var unitX = wx.getSystemInfoSync().screenWidth / 375  //宽度比  参考iphone 6
    var unitY = wx.getSystemInfoSync().screenHeight / 666  //高度比 参考iphone 6
    var width = wx.getSystemInfoSync().screenWidth-30 * unitX;
    var height = 100 * unitX;
    var path = "../../images/ss.png"
    ctx.drawImage(path, 10 * unitX, 0, width, height)
    ctx.draw();
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {

        that.data.imagePath = res.tempFilePath;
       
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.draw("myCanvas");
    setTimeout(() => { this.canvasToTempImage(); }, 2000);
    //app.wxLogin()

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