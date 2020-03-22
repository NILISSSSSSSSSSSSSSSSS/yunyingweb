import Vue from 'vue'
import api from '../config/api'
import requestFunction from './request'

//专家列表
function getSpecia(params, obj) {
  return requestFunction.Get(api.getSpecia, params, {loading:false});
}
//新增专家
function addSpecia (params, obj) {
  return requestFunction.Post(api.addSpecia, params, obj);
}
//编辑专家
function editSpecia (params, obj) {
  return requestFunction.Put(api.editSpecia, params, obj);
}
//停启用专家
function changeSpeciaStu (params, obj) {
  return requestFunction.Put(api.changeSpeciaStu, params, obj);
}

//数据统计 基本数据
function getBaseData(params, obj) {
  return requestFunction.Get(api.getBaseData, params, obj);
}
//数据统计 走势图
function getLineData(params, obj) {
  return requestFunction.Get(api.getLineData, params, obj);
}
//数据统计 门第top10
function getShopTopData(params, obj) {
  return requestFunction.Get(api.getShopTopData, params, obj);
}
//数据统计 课件top10
function getCourseTopData(params, obj) {
  return requestFunction.Get(api.getCourseTopData, params, obj);
}

// 新建im用户
function newImUser(params, header) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$ajax.post(api.newImUser, params, header)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err)
      })
  });

}

// 获取用户签名
function getUserSign(params, header) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$ajax.post(api.getUserSign, params, header)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err)
      })
  });
}


export default {
  getSpecia,
  addSpecia,
  editSpecia,
  changeSpeciaStu,
  getBaseData,
  getLineData,
  getShopTopData,
  getCourseTopData,
  newImUser,
  getUserSign
}