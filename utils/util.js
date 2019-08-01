import {env} from "../config/url.js"

export function formatTime(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function setNewUrl (url)  {
  //console.log(url)
  let newUrl = "";
  let tmp = new RegExp("http[s]{0,1}://community-(\\w{1,6})\\.oss-cn-beijing\\.aliyuncs\\.com/([A-Za-z0-9/.]*)","g");
  newUrl = url.replace(tmp, "https://$1.lueek.com/$2")
  return newUrl
}

export function getLocalTime (time, format) {
  let t = new Date(parseFloat(time))
  let tf = function (i) {
    return (i < 10 ? '0' : '') + i
  }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}
export function printLog(that,data, header,flag=true){
 
  if (env == "development" || !flag){
    let name = that && that.route ? (that.route + "-") : ""
    header = header ? (header+'-'):""
    console.log("LOG:" + name +header+JSON.stringify(data))
  }
 
}
export function shareContent() {
  var num = Math.floor(Math.random() * 100%5);
  let content =[
    "这个月还完已吃土",
    "渣渣房贷毫无压力",
    "房奴的世界谁能懂",
    "我不信你的房贷有我多",
    "非常好用的房贷工具",
  ]
  return content[num]

}


