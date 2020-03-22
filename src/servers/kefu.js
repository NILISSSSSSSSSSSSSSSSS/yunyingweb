import api from '../config/api'
import requestFunction from './request'

//店主列表
function kefulist(params, obj) {
  return requestFunction.Get(api.kefu, params, obj);
}
//新增店主
function addKefu (params, obj) {
  return requestFunction.Post(api.addKefu, params, obj);
}
//根据课程id编辑课程
function byIdedietKefu (params, obj) {
  return requestFunction.Put(api.byIdedietKefu, params, obj);
}
// 获取客服分组
function kefuGroup (params, obj) {
  return requestFunction.Get(api.kefuGroup, params, obj);
}
function editKefu (params, obj) {
  return requestFunction.Put(api.editKefu, params, obj);
}
function statusKefu (params, obj) {
  return requestFunction.Put(api.statusKefu, params, obj);
}
// 增加客服分组
function addKefuGroup (params, obj) {
  return requestFunction.Post(api.addKefuGroup, params, obj);
}

function editKefuGroup (params, obj) {
  return requestFunction.Put(api.editKefuGroup, params, obj);
}

function deleteKefuGroup (params, obj) {
  return requestFunction.Del(api.deleteKefuGroup, params, obj);
}
export default {
  kefulist,
  addKefu,
  byIdedietKefu,
  kefuGroup,
  editKefu,
  statusKefu,
  addKefuGroup,
  editKefuGroup,
  deleteKefuGroup
}