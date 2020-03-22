import ObjectID from 'bson-objectid';

export const PHONE_REG = /^1\d{10}$/; //手机号正则
export const LOGISTICS_REG = /\d/; //运单号正则
export const EMAIL_REG = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/; //邮箱正则

export const checkInteger = /^[1-9]\d*$/;//只能输入正整数
//只能输入正整数或者最多两位小数
export const limitNumber = /(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/;

/**
 * 日期格式化
 * @param {*} date 数据
 * @param {*} format 要转换的格式
 */
export function formatDate(date, format) {
  if (!date) return
  date = new Date(date)
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let min = date.getMinutes();
  let s = date.getSeconds();
  let result = "";
  if (format == undefined || "yyyy-MM-dd hh:mm:ss") {
      result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
          h < 10 ? "0" + h : h
          }:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
  }
  if (format == "yyyy-MM-dd hh:mm") {
      result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
          h < 10 ? "0" + h : h
          }:${min < 10 ? "0" + min : min}`;
  }
  if (format == "yyyy-MM-dd") {
      result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
  }
  if (format == "yyyy-MM") {
      result = `${y}-${m < 10 ? "0" + m : m}`;
  }
  if (format == "hh:mm:ss") {
      result = ` ${h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
  }
  if (format == "yyyy") {
      result = `${y}`;
  }
  return result;
}

/**
 * 结束时间统一加23:59:59 时间戳
 * @param {*} time 要处理为结束时间的数据
 */
export function formatEndTime(time) {
  time = (new Date(time).getTime() + 1000 * 3600 * 24 - 1000)/1000
  return time
}

/**
 *秒转时分秒
 * 
 */
export function TimestampToTime(_seconds) {
  const PadZero = str => {
      return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
  }
  if (_seconds) {
      _seconds = parseInt(_seconds);
      let hours, mins, seconds;
      let result = '';
      seconds = parseInt(_seconds % 60);
      mins = parseInt(_seconds % 3600 / 60)
      hours = parseInt(_seconds / 3600);
      result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
      return result;

  } else if (_seconds == 0) {
      return "00:00:00"
  }
}

// 通过创建音视频，获取音频或者视频的时长
export function getAudioDuration(src) {
  return new Promise((resolve, reject) => {

      let audioE = document.createElement("audio"); // 获取时长
      audioE.src = src;
      audioE.load();
      audioE.oncanplay = function () {
          setTimeout(() => {
              console.log(audioE.duration);
              resolve(parseInt(audioE.duration)*1000);//返回毫秒
          }, 1000);

      }
  })
}

// 获取objectid
export function getObjectId() {
    return ObjectID.generate();
}

// 根据原始文件类型获得发送消息时服务端对应的消息类型, 如audio/mp3
export function getMsgTypeFromRaw(rawType) {
    var rtType;

    if (rawType.indexOf('audio') != -1) {
        rtType = "VOICE"
    } else if (rawType.indexOf('image') != -1) {
        rtType = "IMAGE";
    } else if (rawType.indexOf('video') != -1) {
        rtType = 'VIDEO'
    }

    return rtType;
}

/**
 * 
 * @param {Array} tHeader 表头
 * @param {Array} params 列表字段
 * @param {Array} list 列表数据
 * @param {String} title 表格标题
 */
export function exportExcel(tHeader,params,list,title){
    require.ensure([], () => {
        const {
            export_json_to_excel
        } = require('@/vendor/Export2Excel');
        const data = formatJson(params, list);
        export_json_to_excel(tHeader, data, title + '列表');
    })
}
// 参数过滤
const formatJson = (params, jsonData)=> {
    return jsonData.map(v => params.map(j => v[j]))
}
