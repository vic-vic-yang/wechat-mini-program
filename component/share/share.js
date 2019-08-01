// component/myModal/share.js
const app = getApp()
const network = require('../../utils/network.js');
import Api from "../../config/api.js"
import { downloadSaveFiles} from '../../utils/downLoad';


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object,
      value:null
    },

    title:{
      type:String,
      value:null
    },
    hidden:{
      type:Boolean,
      value: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    url:"",
    imagePath: '',
    herderUrl:"",
    codeUrl:'',
    merchantInfo:null

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent("closeEvent");
    },
    shareAll() {
      let _this = this
      wx.showModal({
        title: '操作步骤提示',
        content: '长按生成的二维码界面-->保存图片-->打开微信朋友圈-->从相册中选择保存的该图片-->发表',
        success: function (res) {
          if (res.confirm) {
            _this.makePage()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    makePage(){
      let _this = this;
      wx.showLoading({
        title: '生成中...',
        mask: true
      })
    
      let params={
        page:"pages/shopDetail/shopDetail",
        width:300,
        is_hyaline:true,
      }
      wx.showToast({
        title: '程序猿正在努力开发中...',
      })
      return;
      network.request(Api.qrcode, params, "POST", false).then((response) => {
        if (response){
          this.data.url = response
          this.setPage()
         
        }
        else{
          wx.showToast({
            title: '生成失败',
            icon:"none"
          })
        }
       
      })
    },
  
    setPage(){
      let that = this;
      let headerUrl = that.properties.data.thumbnail || that.properties.data.url + "?x-oss-process=video/snapshot,t_0,f_jpg,w_658,h_370,m_fast";
      headerUrl = headerUrl;
      let url = that.data.url;

      downloadSaveFiles({
        urls: [headerUrl,url],
        success:(res)=>{
          
          res.forEach(function (value) {
            //console.log(value)
            
            if (value.id == headerUrl){
              that.data.headerUrl = value.savedFilePath
            }
            else if (value.id == url) {
              that.data.codeUrl = value.savedFilePath
            }
          });
          //console.log("---"+that.data.headerUrl)
          that.draw("myCanvas");
          setTimeout(() => { that.canvasToTempImage(); }, 2000);
        },
        fail:(e)=>{
          wx.showToast({
            title: '生成失败',
          })
          // network.request(Api.qrcode, {key:JSON.stringify(e)}, "POST", false).then((response) => {

          // })
        }
      })
      
    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
      var that = this;
      //console.log(111)
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          that.data.imagePath = res.tempFilePath;

          wx.previewImage({
            current: that.data.imagePath, // 当前显示图片的http链接
            urls: [that.data.imagePath] // 需要预览的图片http链接列表
          })
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
   
    draw: function (canvas,$this, ecc) {
      var that = this;

      if (!canvas) {
        console.warn('No canvas provided to draw QR code in!')
        return;
      }
      var ctx = wx.createCanvasContext(canvas, $this);
      // ctx.setFillStyle('red')
      // ctx.fillRect(10, 10, 150, 75)
      //ctx.draw()
      var unitX = wx.getSystemInfoSync().screenWidth/375  //宽度比  参考iphone 6
      var unitY = wx.getSystemInfoSync().screenHeight / 666  //高度比 参考iphone 6
      var width = wx.getSystemInfoSync().screenWidth; 
      var height = wx.getSystemInfoSync().screenHeight;
      var path = "../../images/img/sharebg.jpg"
      var play = "../../images/index/play.png"
      //console.log("=========" + width + "--" + unitX + "--" + unitY)
     
      // ctx.setFillStyle("#333")
      // let data = this.properties.data;
      let text = this.properties.data.contentDesc||"我的快乐童年";
      let lineSize = 19 ;// 每行显示的文字

      var cArr = text&&text.match(/[^\x00-\xff]/ig);
      let length = text.length + (cArr == null ? 0 : cArr.length);

      let tmpLine = Math.ceil(length / lineSize);
      let maxLine = 5;
      if (tmpLine>5){
        tmpLine = maxLine;
      }

      //let contentY = (maxLine - tmpLine)*10* unitY+ 49 * unitY;
      let contentY = 74 * unitY;
      let contentX = 38 * unitX;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(path, 0, 0, width, height)
      ctx.setFillStyle("#fff")




      ctx.fillRect(contentX, contentY, 300 * unitX, (666-74-74) * unitY );
      //console.log('==22herderUrl=' + that.data.headerUrl)
      ctx.drawImage(that.data.headerUrl, contentX, contentY, 300 * unitX, 169 * unitY)
     // ctx.drawImage(play, contentX + 123 * unitX, contentY + 57 * unitY, 55 * unitX, 55 * unitX)
      contentY = contentY + 169 * unitY
      contentY = contentY + 25 * unitY

      //console.log('==33herderUrl=' + that.data.headerUrl)
      ctx.setFontSize(14)
      ctx.setFillStyle("#000")
      contentX  = contentX + 10*unitX

     
      let line=1;
      
      while (true) {
        if (text.length > 19 ) {
          if (line == 5) {
            let end = text.substring(0, 17)+"..."
            ctx.fillText(end, contentX, contentY)
            break;
          }
          else {
            ctx.fillText(text.substring(0, 19), contentX, contentY)
            text = text.substring(19)
            contentY += 18*unitY
          }
          line++;
        }
        else {
          ctx.fillText(text, contentX, contentY)
          break;
        }
      }
      contentY = (117+169+74+20) * unitY
      //console.log("==" + JSON.stringify(this.properties.data))
      let name = this.properties.data.userNickName||this.properties.data.nickName||"..."
      ctx.fillText("视频制作：" + name, contentX, contentY)



      contentY += 20 * unitY
      ctx.setFillStyle("#ccc")
      ctx.fillRect(contentX, contentY, 300 * unitX- 20 * unitX, 0.5);

      contentY += 20 * unitY

      ctx.drawImage(this.data.codeUrl, contentX, contentY, 150 * unitX, 150 * unitX)
      
     
      contentY += 75 * unitX
      contentX += 162 * unitX
      ctx.setFontSize(14)
      ctx.setFillStyle("#333")
      ctx.fillText("长按小程序码", contentX, contentY)

      contentY+=20*unitY
      ctx.fillText("查看视频", contentX, contentY)
     
      ctx.draw();
    },


  }
})
