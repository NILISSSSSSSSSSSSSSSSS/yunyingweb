import api from '../config/api'
import requestFunction from './request'

// 帐号密码登录
/**
 * 
 * @param {Oject} params desc  
 * @param {*} obj 
 */
function pwdLogin (params, obj) {
  return requestFunction.Post(api.loginByPwd, params, obj);
}
//修改密码
function changePwd (params, obj) {
  return requestFunction.Post(api.changePwd, params, obj);
}
//用户读取自己的信息（包含登录信息和角色信息）
function getUserRoles (params,obj){
  return requestFunction.Get(api.getUserRoles,params, obj);
}
//获取所有角色
function getAllRoles (params, obj){
  return requestFunction.Get(api.getAllRoles,params,obj)
}

export default {
  pwdLogin,
  getUserRoles,
  changePwd,
  getAllRoles
}