// component/picker/one.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showChoose:{
      type: Boolean,
      value: false
    },
    vauleIndex:{
      type: Array,
      value: [0]
    },
    showData:{
      type: Array,
      value: []
    
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {

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
    showModel:function(e){
      this.triggerEvent("showModel");
    },
    dataSure: function(){
      this.triggerEvent("dataSure");
    }
  }
})
