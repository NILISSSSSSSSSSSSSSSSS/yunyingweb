import api from '../config/api'
import requestFunction from './request'

//直播间右侧es问题查询
function esSearch(params,obj){
  return requestFunction.Post(api.esSearch, params, obj);
}
//直播间右侧es分词查询
function esWordSearch(params,obj){
  return requestFunction.Post(api.esWordSearch, params, obj);
}
//新增回播
function createHuibo (params, obj) {
  return requestFunction.Post(api.createHuibo, params, obj);
}
//回播课查看
function huiBoDetail (params, obj) {
  return requestFunction.Get2(api.huiBoDetail, params, obj);
}
//编辑回播课
function editHuiBo(params, obj){
  return requestFunction.Put(api.editHuibo, params, obj);
}

function editHuiBoKefu(params, obj){
  return requestFunction.Put(api.editHuiboKefu, params, obj);
}
//回播课详情
function huiBoInfo (params, obj) {
  return requestFunction.Get2(api.courseDetail, params, obj);
}
//课程列表 zb 直播课 | hb 回播课
function getClassList (params, obj) {
  return requestFunction.Get(api.getClassList, params, obj);
}

//删除课程
function delClass (params, obj) {
  return requestFunction.Del(api.delClass, params, obj);
}
//修改课程状态
function changeClass(params, obj){
  return requestFunction.Put2(api.changeClass, params, obj);
}
//课程下的店铺
function kcShops(params, obj){
  return requestFunction.Get2(api.kcShops, params, obj);
}

//收藏
function collection(params, obj){
  return requestFunction.Post(api.collection, params, obj);
}

//客服自己聊天记录
function customerSerChat(params, obj){
  return requestFunction.Get(api.customerSerChat, params, obj);
}
function imUserList(params, obj){
  return requestFunction.Get(api.imUserList, params, obj);
}

// 给指定课程发送广播消息
function sendBroadCast(params, obj) {
  return requestFunction.Post(api.broadcast, params, obj);
}

// 回复用户消息
function replyMsg(params, obj) {
  return requestFunction.Post(api.replyMsg, params, obj);
}
//跟据消息id查询消息详情
function msgDetail(params, obj) {
  return requestFunction.Get2(api.msgDetail, params, obj);
}
export default {
  esSearch,
  esWordSearch,
  createHuibo,
  huiBoDetail,
 
  getClassList,
  delClass,
  changeClass,
  kcShops,
  huiBoInfo,
  editHuiBo,
  collection,
  customerSerChat,
  imUserList,
  sendBroadCast,
  replyMsg,
  editHuiBoKefu,
  msgDetail
}