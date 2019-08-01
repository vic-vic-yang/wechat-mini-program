// component/row/tabRow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabArray:{
      type: Array,
      value:[]
    },
    shadow:{
      type:Boolean,
      value:false
    },
    curIndex:{
      type: Number,
      value: 0
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    curIndex: 0

  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkTab:function(e){
      let index = e.currentTarget.dataset.click;
      if (index != this.data.curIndex) {
        this.setData({
          curIndex: index
        })
        this.triggerEvent("confirmEvent", index);

      }
    }


  }
})
