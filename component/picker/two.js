// component/picker/two.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showChoose: {
      type: Boolean,
      value: false
    },
    showData: {
      type: Array,
      value: []
    },
    inputValue:{
      type: Number,
      value: ""
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    value:null


  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      const val = e.detail.value
      console.log(val)

      this.triggerEvent("bindChange", val[0]);
    },
    showModel: function (e) {
      this.triggerEvent("showModel");
    },
    dataSure: function (e) {
      console.log(1111)
      let _this = this;
      let item = e.currentTarget.dataset.item
      this.setData({
        value: item.value
      },()=>{
        _this.triggerEvent("dataSure", item);
      })
      
    },
    dataSureNew: function () {
      console.log(this.data.value)
      if (Number(this.data.value) > 100) {
        wx.showToast({
          title: '利率不能大于100',
          icon:'none'
        })
        return;
      }
      else if (Number(this.data.value) == 0) {
        wx.showToast({
          title: '请输入利率',
          icon: 'none'
        })
        return;
      }
      this.triggerEvent("dataSure", { text: '自定义利率', value: this.data.value});
    },
    bindinput(e) {
      //触发成功回调
      console.log(e.detail.value)
      this.setData({
        value: e.detail.value
      })
      if (Number(e.detail.value)>100){
        wx.showToast({
          title: '利率不能大于100',
          icon: 'none'
        })
      }
     
    }
  }
})
