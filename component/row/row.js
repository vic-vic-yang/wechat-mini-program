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
    endImg: {
      type: String,
      value: '../../images/right.png'
    },
    data: {
      type: String,
      value: '-1'
    },
    styles: {
      type: String,
      value: ''
    }

  },
  methods: {
    _confirmEvent() {
      //触发成功回调

      this.triggerEvent("confirmEvent", this.properties.data);
    }
  },
})
