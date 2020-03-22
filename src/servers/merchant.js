import api from '../config/api'
import requestFunction from './request'

//获取默认门店
function getDefaultShop(params, obj) {
  return requestFunction.Get(api.getDefaultShop, params, obj);
}
//店铺列表
function getShops(params, obj) {
  return requestFunction.Get(api.getShops, params, obj);
}
//店主列表
function getMerchant(params, obj) {
  return requestFunction.Get(api.getMerchant, params, obj);
}
//新增店主
function addMerchant (params, obj) {
  return requestFunction.Post(api.addMerchant, params, obj);
}
//编辑店主
function editMerchant (params, obj) {
  return requestFunction.Put(api.editMerchant, params, obj);
}
//停启用店主
function changeMerchantStu (params, obj) {
  return requestFunction.Put(api.changeMerchantStu, params, obj);
}
//店主的播课记录
function dzClass(params, obj) {
  return requestFunction.Get2(api.dzClass, params, obj);
}
//获取店主信息
function getMerchantInfo(params, obj){
  return requestFunction.Get2(api.editMerchant, params, obj);
}
//新增服务号资料
function setWxInfo(params, obj){
  return requestFunction.Post(api.addWxInfo, params, obj);
}
//编辑服务号资料
function updateWxInfo(params, obj){
  return requestFunction.Put(api.setWxInfo, params, obj);
}
//根据店主id 获取服务号，小程序申请资料
function getFwhXcxInfo(params, obj){
  return requestFunction.Get2(api.getWxInfoBydz, params, obj);
}
//获取服务号资料
function getWxInfo(params, obj){
  return requestFunction.Put(api.setWxInfo, params, obj);
}
//审核服务号资料
// function checkWxInfo(params, obj){
//   return requestFunction.Put(api.checkWxInfo, params, obj);
// }
//提交服务号key
function setWxInfoKey(params,obj){
  return requestFunction.Put(api.setWxInfoKey, params, obj);
}
//小程序资料提交
function setMiniProgram(params,obj){
  return requestFunction.Post(api.setMiniProgram, params, obj);
}

//组列表
function getGroup (params, obj) {
  return requestFunction.Get(api.getGroup, params, obj);
}
//新增组
function addGroup (params, obj) {
  return requestFunction.Post(api.addGroup, params, obj);
}
//编辑组
function editGroup (params, obj) {
  return requestFunction.Put(api.editGroup, params, obj);
}
//组id获取门店列表
function searchShopsByGroupId (params, obj) {
  return requestFunction.Get2(api.editGroup, params, obj);
}
//停启用分组
function changeGroupStu (params, obj) {
  return requestFunction.Del(api.editGroup, params, obj);
}

export default {
  getDefaultShop,
  getShops,
  getMerchant,
  addMerchant,
  editMerchant,
  changeMerchantStu,
  dzClass,
  getMerchantInfo,
  getFwhXcxInfo,
  setWxInfo,
  updateWxInfo,
  // checkWxInfo,
  setMiniProgram,
  setWxInfoKey,
  getWxInfo,
  getGroup,
  addGroup,
  editGroup,
  searchShopsByGroupId,
  changeGroupStu
}