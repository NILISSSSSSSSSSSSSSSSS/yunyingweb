import Vue from 'vue'
//店主帐号状态
Vue.filter('merchantStatus',val => {
  let list = {0: '基本信息完善', 1: '服务号资料等待店主提交', 2: '服务号资料待审核', 3: '服务号资料微信审核成功',4: '小程序资料填写', 5: '小程序资料申请成功', 6: '小程序上线', 7: '服务号资料微信审核失败', 8: '小程序资料申请失败'}
    return list[val] ? list[val] : ''
})
//课件类型
Vue.filter('courseType',val => {
  let list = {'TEXT': '文本', 'IMAGE': '图片', 'VOICE': '音频', 'VIDEO': '视频','URL': '链接'}
    return list[val] ? list[val] : ''
})
//发送状态
Vue.filter('sendStatus',val => {
  let list = {'INIT': '等待发送', 'SENDING': '正在发送中', 'DONE': '发送完毕'}
    return list[val] ? list[val] : '等待发送'
})
//课件状态
Vue.filter('courseStatus',val => {
  let list = {'ONLINE': '上线', 'OFFLINE': '下线', 'DELETE': '删除', 'EDIT': '编辑中'}
    return list[val] ? list[val] : ''
})
//课程状态
Vue.filter('liveStatus',val => {
  let list = {'INIT': '初始化', 'CREATING': '创建中', 'BAOMING': '正在报名', 'BAOMINGSTOP': '报名结束','CANCEL': '已取消','START': '开课中','ANSWER': '答疑中','STOP': '课程结束','ABORT': '课程已中止'}
    return list[val] ? list[val] : ''
})
//店铺状态
Vue.filter('shopStatue',val => {
  let list = {'EDIT': '编辑中', 'ONLINE': '已上线', 'OFFLINE': '已下线 ', 'DELETED': '已删除'}
    return list[val] ? list[val] : ''
})
//微信 性别判断
Vue.filter('sexJudgment',val => {
  if(val == 0){
    return '未知';
  }else if(val == 1){
    return '男';
  }else if(val == 2){
    return '女';
  }
})
//解析获取文本信息
Vue.filter('getContext',val => {
  var json = JSON.parse(val);
  return json.text.content;
})
//解析获取文本信息
Vue.filter('getAliUrl',val => {
  var json = JSON.parse(val);

  if(json.aliUrl == undefined){
    return 'https://hbb-deploy.oss-cn-beijing.aliyuncs.com/5e53c74016d3fc6f1c1a7426.png';
  }else {
    return json.aliUrl;
  }
})
//解析获取文本信息
Vue.prototype.txtToImg= function (val) {
  var strVal = val;
  if(val.includes("/::)") == true){
    strVal = strVal.replace(new RegExp("(/::\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/0.gif'/>");
  }
  if(val.includes("/::~") == true){
    strVal = strVal.replace(new RegExp("(/::~)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/1.gif'/>");
  }
  if(val.includes("/::B") == true){
    strVal = strVal.replace(new RegExp("(/::B)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/2.gif'/>");
  }
  if(val.includes("/::|") == true){
    strVal = strVal.replace(new RegExp("(/::\\|)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/3.gif'/>");
  }
  if(val.includes("/:8-)") == true){
    strVal = strVal.replace(new RegExp("(/:8-\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/4.gif'/>");
  }
  if(val.includes("/::<") == true){
    strVal = strVal.replace(new RegExp("(/::<)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/5.gif'/>");
  }
  if(val.includes("/::$") == true){
    strVal = strVal.replace(new RegExp("(/::\\$)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/6.gif'/>");
  }
  if(val.includes("/::X") == true){
    strVal = strVal.replace(new RegExp("(/::X)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/7.gif'/>");
  }
  if(val.includes("/::Z") == true){
    strVal = strVal.replace(new RegExp("(/::Z)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/8.gif'/>");
  }
  if(val.includes("/::'(") == true){
    strVal = strVal.replace(new RegExp("(/::'\\()","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/9.gif'/>");
  }
  if(val.includes("/::-|") == true){
    strVal = strVal.replace(new RegExp("(/::-\\|)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/10.gif'/>");
  }
  if(val.includes("/::@") == true){
    strVal = strVal.replace(new RegExp("(/::@)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/11.gif'/>");
  }
  if(val.includes("/::P") == true){
    strVal = strVal.replace(new RegExp("(/::P)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/12.gif'/>");
  }
  if(val.includes("/::D") == true){
    strVal = strVal.replace(new RegExp("(/::D)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/13.gif'/>");
  }
  if(val.includes("/::O") == true){
    strVal = strVal.replace(new RegExp("(/::O)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/14.gif'/>");
  }
  if(val.includes("/::(") == true){
    strVal = strVal.replace(new RegExp("(/::\\()","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/15.gif'/>");
  }
  if(val.includes("[囧]") == true){
    strVal = strVal.replace(new RegExp("(\\[囧\\])","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/17.gif'/>");
  }
  if(val.includes("/::Q") == true){
    strVal = strVal.replace(new RegExp("(/::Q)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/18.gif'/>");
  }
  if(val.includes("/::T") == true){
    strVal = strVal.replace(new RegExp("(/::T)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/19.gif'/>");
  }
  if(val.includes("/:,@P") == true){
    strVal = strVal.replace(new RegExp("(/:,@P)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/20.gif'/>");
  }
  if(val.includes("/:,@-D") == true){
    strVal = strVal.replace(new RegExp("(/:,@-D)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/21.gif'/>");
  }
  if(val.includes("/::d") == true){
    strVal = strVal.replace(new RegExp("(/::d)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/22.gif'/>");
  }
  if(val.includes("/:,@o") == true){
    strVal = strVal.replace(new RegExp("(/:,@o)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/23.gif'/>");
  }
  if(val.includes("/:|-)") == true){
    strVal = strVal.replace(new RegExp("(/:\\|\\-\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/25.gif'/>");
  }
  if(val.includes("/::!") == true){
    strVal = strVal.replace(new RegExp("(/::!)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/26.gif'/>");
  }
  if(val.includes("/::L") == true){
    strVal = strVal.replace(new RegExp("(/::L)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/27.gif'/>");
  }
  if(val.includes("/::>") == true){
    strVal = strVal.replace(new RegExp("(/::>)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/28.gif'/>");
  }
  if(val.includes("/::,@") == true){
    strVal = strVal.replace(new RegExp("(/::,@)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/29.gif'/>");
  }
  if(val.includes("/:,@f") == true){
    strVal = strVal.replace(new RegExp("(/:,@f)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/30.gif'/>");
  }
  if(val.includes("/::-S") == true){
    strVal = strVal.replace(new RegExp("(/::\\-S)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/31.gif'/>");
  }
  if(val.includes("/:?") == true){
    strVal = strVal.replace(new RegExp("(/:\\?)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/32.gif'/>");
  }
  if(val.includes("/:,@x") == true){
    strVal = strVal.replace(new RegExp("(/:,@x)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/33.gif'/>");
  }
  if(val.includes("/:,@@") == true){
    strVal = strVal.replace(new RegExp("(/:,@@)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/34.gif'/>");
  }
  if(val.includes("/:,@!") == true){
    strVal = strVal.replace(new RegExp("(/:,@!)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/36.gif'/>");
  }
  if(val.includes("/:!!!") == true){
    strVal = strVal.replace(new RegExp("(/:!!!)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/37.gif'/>");
  }
  if(val.includes("/:xx") == true){
    strVal = strVal.replace(new RegExp("(/:xx)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/38.gif'/>");
  }
  if(val.includes("/:bye") == true){
    strVal = strVal.replace(new RegExp("(/:bye)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/39.gif'/>");
  }
  if(val.includes("/:wipe") == true){
    strVal = strVal.replace(new RegExp("(/:wipe)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/40.gif'/>");
  }
  if(val.includes("/:dig") == true){
    strVal = strVal.replace(new RegExp("(/:dig)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/41.gif'/>");
  }
  if(val.includes("/:handclap") == true){
    strVal = strVal.replace(new RegExp("(/:handclap)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/42.gif'/>");
  }
  if(val.includes("/:B-)") == true){
    strVal = strVal.replace(new RegExp("(/:B\\-\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/44.gif'/>");
  }
  if(val.includes("/:<@") == true){
    strVal = strVal.replace(new RegExp("(/:<@)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/45.gif'/>");
  }
  if(val.includes("/:@>") == true){
    strVal = strVal.replace(new RegExp("(/:@>)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/46.gif'/>");
  }
  if(val.includes("/::-O") == true){
    strVal = strVal.replace(new RegExp("(/::\\-O)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/47.gif'/>");
  }
  if(val.includes("/:>-|") == true){
    strVal = strVal.replace(new RegExp("(/:>\\-\\|)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/48.gif'/>");
  }
  if(val.includes("/:P-(") == true){
    strVal = strVal.replace(new RegExp("(/:P\\-\\()","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/49.gif'/>");
  }
  if(val.includes("/::'|") == true){
    strVal = strVal.replace(new RegExp("(/::'\\|)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/50.gif'/>");
  }
  if(val.includes("/:X-)") == true){
    strVal = strVal.replace(new RegExp("(/:X\\-\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/51.gif'/>");
  }
  if(val.includes("/::*") == true){
    strVal = strVal.replace(new RegExp("(/::\\*)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/52.gif'/>");
  }
  if(val.includes("/:8*") == true){
    strVal = strVal.replace(new RegExp("(/:8\\*)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/54.gif'/>");
  }
  if(val.includes("/:pd") == true){
    strVal = strVal.replace(new RegExp("(/:pd)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/55.gif'/>");
  }

  if(val.includes("/:beer") == true){
    strVal = strVal.replace(new RegExp("(/:beer)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/57.gif'/>");
  }
  if(val.includes("/:coffee") == true){
    strVal = strVal.replace(new RegExp("(/:coffee)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/60.gif'/>");
  }
  if(val.includes("/:pig") == true){
    strVal = strVal.replace(new RegExp("(/:pig)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/62.gif'/>");
  }
  if(val.includes("/:rose") == true){
    strVal = strVal.replace(new RegExp("(/:rose)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/63.gif'/>");
  }
  if(val.includes("/:fade") == true){
    strVal = strVal.replace(new RegExp("(/:fade)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/64.gif'/>");
  }
  if(val.includes("/:showlove") == true){
    strVal = strVal.replace(new RegExp("(/:showlove)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/65.gif'/>");
  }
  if(val.includes("/:heart") == true){
    strVal = strVal.replace(new RegExp("(/:heart)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/66.gif'/>");
  }
  if(val.includes("/:break") == true){
    strVal = strVal.replace(new RegExp("(/:break)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/67.gif'/>");
  }
  if(val.includes("/:cake") == true){
    strVal = strVal.replace(new RegExp("(/:cake)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/68.gif'/>");
  }
  if(val.includes("/:bome") == true){
    strVal = strVal.replace(new RegExp("(/:bome)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/70.gif'/>");
  }
  if(val.includes("/:shit") == true){
    strVal = strVal.replace(new RegExp("(/:shit)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/74.gif'/>");
  }
  if(val.includes("/:moon") == true){
    strVal = strVal.replace(new RegExp("(/:moon)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/75.gif'/>");
  }
  if(val.includes("/:sun") == true){
    strVal = strVal.replace(new RegExp("(/:sun)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/76.gif'/>");
  }
  if(val.includes("/:hug") == true){
    strVal = strVal.replace(new RegExp("(/:hug)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/78.gif'/>");
  }
  if(val.includes("/:strong") == true){
    strVal = strVal.replace(new RegExp("(/:strong)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/79.gif'/>");
  }
  if(val.includes("/:weak") == true){
    strVal = strVal.replace(new RegExp("(/:weak)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/80.gif'/>");
  }
  if(val.includes("/:share") == true){
    strVal = strVal.replace(new RegExp("(/:share)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/81.gif'/>");
  }
  if(val.includes("/:v") == true){
    strVal = strVal.replace(new RegExp("(/:v)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/82.gif'/>");
  }
  if(val.includes("/:@)") == true){
    strVal = strVal.replace(new RegExp("(/:@\\))","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/83.gif'/>");
  }
  if(val.includes("/:jj") == true){
    strVal = strVal.replace(new RegExp("(/:jj)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/84.gif'/>");
  }
  if(val.includes("/:@@") == true){
    strVal = strVal.replace(new RegExp("(/:@@)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/85.gif'/>");
  }
  if(val.includes("/:ok") == true){
    strVal = strVal.replace(new RegExp("(/:ok)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/89.gif'/>");
  }
  if(val.includes("/:jump") == true){
    strVal = strVal.replace(new RegExp("(/:jump)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/92.gif'/>");
  }
  if(val.includes("/:shake") == true){
    strVal = strVal.replace(new RegExp("(/:shake)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/93.gif'/>");
  }
  if(val.includes("/:circle") == true){
    strVal = strVal.replace(new RegExp("(/:circle)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/95.gif'/>");
  }
  if(val.includes("/:<W>") == true){
    strVal = strVal.replace(new RegExp("(/:<W>)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/56.gif'/>");
  }
  if(val.includes("/:<O>") == true){
    strVal = strVal.replace(new RegExp("(/:<O>)","gm"), "<img src='https://res.wx.qq.com/mpkf/zh_CN/images/icon/emotion/94.gif'/>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f604'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f637'></span>");
  }



  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f639'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f61d'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f633'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f631'></span>");
  }

  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f64d'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f612'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f47b'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f64f'></span>");
  }
  if(val.includes("") == true){
    strVal = strVal.replace(new RegExp("()","gm"), "<span class='emoji emoji1f4aa'></span>");
  }
  return strVal;
};
//日期格式化（1分钟前）
Vue.filter('formatDate2',val => {
    var dateTimeStamp = val * 1000; var result = "";
    var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();   //获取当前时间毫秒
    var diffValue = now - dateTimeStamp;//时间差

    if(diffValue < 0){ return '刚刚'; }
    var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
    var hourC = diffValue/hour;
    var dayC = diffValue/day;
    var weekC = diffValue/week;
    var monthC = diffValue/month;
    if(monthC >= 1 && monthC <= 3){
        result = "" + parseInt(monthC) + " 月前"
    }else if(weekC >= 1 && weekC <= 3){
        result = "" + parseInt(weekC) + " 周前"
    }else if(dayC >= 1 && dayC <= 6){
        result = "" + parseInt(dayC) + " 天前"
    }else if(hourC >= 1 && hourC <= 23){
        result = "" + parseInt(hourC) + " 小时前"
    }else if(minC >= 1 && minC <= 59){
        result ="" + parseInt(minC) + " 分钟前"
    }else if(diffValue >= 0 && diffValue <= minute){
        result = "刚刚"
    }else {
        var datetime = new Date();
        datetime.setTime(dateTimeStamp);
        var Nyear = datetime.getFullYear();
        var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result;
})
