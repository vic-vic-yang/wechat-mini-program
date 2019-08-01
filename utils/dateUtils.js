//将指定日期转换为时间戳,传入的参数格式为："2014-05-08 00:22:11";
export function dataToStamp(currentDate) {
  let date = currentDate
  date = new Date(Date.parse(date.replace(/-/g, '/')))
  date = date.getTime()
  return date
}

 /**
* 时间戳格式化函数 
* @param  {string} format    格式 
* @param  {int}    timestamp 要格式化的时间 默认为当前时间 
* @return {string}           格式化的时间字符串 
*/
export function timeFormat(time, format){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){
          case 'yyyy':
              return tf(t.getFullYear());
          case 'MM':
              return tf(t.getMonth() + 1);
          case 'mm':
              return tf(t.getMinutes());
          case 'dd':
              return tf(t.getDate());
          case 'HH':
              return tf(t.getHours());
          case 'ss':
              return tf(t.getSeconds());
          default:return '';
      }
  })
}

export function dateDiff(pTime) {
    //用于计算多少天、多少小时、多少分钟前， pTime为int时间戳
    if (pTime && typeof pTime === 'string') {
      pTime = parseInt(pTime)
    }
    let d_minutes, d_hours, d_days, d
    let timeNow = parseInt(new Date().getTime() / 1000)
    let pTime_new = new Date(pTime).getTime() / 1000
    d = timeNow - pTime_new
    d_days = parseInt(d / 86400)
    d_hours = parseInt(d / 3600)
    d_minutes = parseInt(d / 60)
    if (d_days >= 4) {
      return getLocalTime(pTime)
    } else if (d_days > 0 && d_days < 4) {
      return d_days + '天前'
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前'
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前'
    } else if (d_minutes === 0) {
      return '刚刚'
    } else {
      return pTime
    }
  }
export function setDataWithTime(data) {
  var myDate = new Date();
  let year = myDate.getFullYear()
  //console.log('year=' + year)

  for (let i = 0; i < data.length; i++) {
    data[i].created = getLocalTime(data[i].created, "dd/MM月")
    let tmpYear = data[i].created.substr(0, 4)
    //console.log('tmpYear=' + tmpYear)
    if (tmpYear == year) {
      data[i].created = data[i].created.substring(5)
    }
    //console.log('created=' + data[i].created )

  }

  var map = {},
    dest = [];
  for (var i = 0; i < data.length; i++) {
    var ai = data[i];
    if (!map[ai.created]) {
      dest.push({
        created: ai.created,
        dt: [ai]
      });
      map[ai.created] = ai;
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j];
        if (dj.created == ai.created) {
          dj.dt.push(ai);
          break;
        }
      }
    }
  }
  //console.log("=========" + JSON.stringify(dest))
  return dest;
  
}
  function getLocalTime(date, fmt) {
    if (typeof date === 'number') {
      date = new Date(date)
    }
    if (typeof date === 'string') {
      date = new Date(parseInt(date))
    }
    if (fmt === undefined) {
      fmt = 'yyyy-MM-dd hh:mm:ss'
    }
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length),
      )
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length),
        )
    return fmt
  }

//时间戳转日期:使用方法timestampToTime(1403058804);
export function timestampToTime(timestamp) {
    let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
}