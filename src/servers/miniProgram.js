import api from '../config/api'
import requestFunction from './request'

//获取 Access Token
function getAccessToken() {
  return requestFunction.Get(api.getAccessToken);
}
//添加微信客户
function addUserClient(params) {
  return requestFunction.Post(api.addUserClient, params, {});
}
//发送消息
function sendMsg(params) {
  return requestFunction.Post(api.sendMsg, params);
}
//上传文件到微信服务器
function uploadFileImg(formData) {
  return requestFunction.Post(api.uploadFileImg, formData);
}
//获取用户列表
function getUserList(params) {
  return requestFunction.Get(api.getUserList, params, {loading: false});
}
//获取消息列表
function getMsgDetails(params) {
  return requestFunction.Get(api.getMsgDetails, params, {loading: false});
}
//获取客服列表
function getCustomerServiceList() {
  return requestFunction.Get(api.getCustomerServiceList);
}
//获取客服列表
function deleteCustomerService(params) {
  return requestFunction.Post(api.deleteCustomerService, params);
}
export default {
  getAccessToken,
  addUserClient,
  sendMsg,
  uploadFileImg,
  getUserList,
  getMsgDetails,
  getCustomerServiceList,
  deleteCustomerService
}
