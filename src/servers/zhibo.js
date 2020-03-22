import api from '../config/api'
import requestFunction from './request'

//新增回播
function createZhibo (params, obj) {
  return requestFunction.Post(api.createZhibo, params, obj);
}

export default {
  createZhibo
}