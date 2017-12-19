let option = {
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    firstDay: 1, // First day of the week, Monday
    weekendDays: [0, 6], // Sunday and Saturday
    dateFormat: 'yyyy-mm-dd',
  }
  function formatDate(now, tyle) {
    function fixZero(num, length) {
        var str = "" + num;
        var len = str.length;
        var s = "";
        for (var i = length; i-- > len;) { s += "0" }
        return s + str
    }
    var now = new Date(now * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var week = now.getDay();
    if (tyle == 1) {
        return year + "-" + fixZero(month, 2) + "-" + fixZero(date, 2) + "    " + "" + fixZero(hour, 2) + ":" + fixZero(minute, 2)
    } else if (tyle == 2) {
        return '剩余' + fixZero(minute, 2) + '分' + fixZero(second, 2) + '秒'
    } else if (tyle == 3) {
        return fixZero(month, 2) + '月' + fixZero(date, 2) + '日'
    } else if (tyle == 4) {
        return year + "-" + fixZero(month, 2) + "-" + fixZero(date, 2)
    } else if (tyle == 5) {
        if (week == 1) {
            return "周一"
        } else if (week == 2) {
            return "周二"
        } else if (week == 3) {
            return "周三"
        } else if (week == 4) {
            return "周四"
        } else if (week == 5) {
            return "周五"
        } else if (week == 6) {
            return "周六"
        } else if (week == 0) {
            return "周日"
        }
    } else if (tyle == 6) {
        return fixZero(month, 2) + "-" + fixZero(date, 2) + "    " + "" + fixZero(hour, 2) + ":" + fixZero(minute, 2)
    } else if (tyle == 7) {
        return fixZero(hour, 2) + ":" + fixZero(minute, 2)
    } else if (tyle == 8) {
        return fixZero(month, 2) + '-' + fixZero(date, 2)
    }
  }
    /**
     * 日期格式化
     * @param date, eg, "2017-10-7" 
     * @param format, eg "yyyy-mm-dd"
     */
  function formatTime(date, format) {
    if(format) {
      option.dateFormat = format;
    }
    date = new Date(date)
    const options = option;
    const year = date.getFullYear()
    const month = date.getMonth()
    const month1 = month + 1
    const day = date.getDate()
    const weekDay = date.getDay()
    var hour = date.getHours()
    var minute = date.getMinutes()
  
    return {
        timeStamp:date.getTime(), 
  
        displayedDate:options.dateFormat
        .replace(/yyyy/g, year)
        .replace(/yy/g, (year + '').substring(2))
        .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
        .replace(/m/g, month1)
        .replace(/MM/g, options.monthNames[month])
        .replace(/M/g, options.monthNamesShort[month])
        .replace(/dd/g, day < 10 ? '0' + day : day)
        .replace(/d/g, day)
          .replace(/hh/g, hour < 10 ? '0' + hour : hour)
          .replace(/nn/g, minute < 10 ? '0' + minute : minute)
        .replace(/DD/g, options.dayNames[weekDay])
        .replace(/D/g, options.dayNamesShort[weekDay]), 
        
        originalDate:date
      }
  }
  
  //日期转时间戳
  function getLocalTime(nS) {
    return new Date(parseInt(nS))
  } 
  
  module.exports = {
    formatTime: formatTime,
    getLocalTime: getLocalTime,
    formatDate:formatDate
  }
  