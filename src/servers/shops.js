import api from '../config/api'
import requestFunction from './request'

const requestUrl = api.shops;
const defaultUrl = api.defaultDianpu;
// 店铺列表

/**
 * 
 * @param {Oject} params desc  
 * @param {*} obj 
 */
function getShops (params, obj) {
  return requestFunction.Get(requestUrl, params, obj);
}

function getShopsDefault (params, obj) {
  return requestFunction.Get(defaultUrl, params, obj);
}

export default {
  getShops: getShops,
  getShopsDefault: getShopsDefault
}