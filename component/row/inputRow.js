Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    firstImg: {
      type: String,//目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    detail: {
      type: String,
      value: ''
    },
    endText: {
      type: String,
      value: ''
    },
    itemType: {
      type: String,
      value: '-1'
    },
    inputType:{
      type: String,
      value: ''
    },
    length:{
      type: Number,
      value: 50
    },
    data: {
      type: String,
      value: '-1'
    },
  },
  methods: {
    bindinput(e) {
      //触发成功回调
      //console.log(e.detail.value)
      this.triggerEvent("confirmEvent", { type: this.properties.data, value: e.detail.value});
    }
  },
})
