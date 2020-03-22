import api from '../config/api'
import requestFunction from './request'

//课件列表
function getCourse(params, obj) {
  return requestFunction.Get(api.getCourse, params, obj);
}
//新增课件信息
function addCourse (params, obj) {
  return requestFunction.Post(api.addCourse, params, obj);
}
//编辑课件
function editCourse (params, obj) {
  return requestFunction.Put(api.editCourse, params, obj);
}
//课件详情
function courseDetail (params, obj) {
  return requestFunction.Get2(api.editCourse, params, obj);
}
//新增或更新课件内容
function courseItem (params, obj) {
  return requestFunction.Put(api.courseItem, params, obj);
}
//停启用课件
function changeCourseStu (params, obj) {
  return requestFunction.Put2(api.changeCourseStu, params, obj);
}

//答疑列表
function getDaYi(params, obj) {
  return requestFunction.Get(api.getDaYi, params, obj);
}
//新增答疑信息
function addDaYi (params, obj) {
  return requestFunction.Post(api.addDaYi, params, obj);
}
//批量新增答疑
function importDaYis(params, obj) {
  return requestFunction.Post(api.getDaYi, params, obj);
}
//编辑答疑
function editDaYi (params, obj) {
  return requestFunction.Put(api.editDaYi, params, obj);
}

//编辑答疑
function useDaYi (params, obj) {
  return requestFunction.Put(api.useDaYi, params, obj);
}
//停启用答疑
function changeDaYiStu (params, obj) {
  return requestFunction.Put2(api.changeDaYiStu, params, obj);
}

//话术列表
function getVerbalTrick(params, obj) {
  return requestFunction.Get(api.getVerbalTrick, params, obj);
}
//新增话术信息
function addVerbalTrick (params, obj) {
  return requestFunction.Post(api.addVerbalTrick, params, obj);
}
//编辑话术
function editVerbalTrick (params, obj) {
  return requestFunction.Put(api.editVerbalTrick, params, obj);
}
//话术详情
function verbalTrickDetail (params, obj) {
  return requestFunction.Get2(api.editVerbalTrick, params, obj);
}
//停启用话术
function changeVBTStu (params, obj) {
  return requestFunction.Put2(api.changeVBTStu, params, obj);
}


export default {
  getCourse,
  addCourse,
  editCourse,
  courseDetail,
  courseItem,
  changeCourseStu,
  addDaYi,
  importDaYis,
  editDaYi,
  getDaYi,
  useDaYi,
  changeDaYiStu,
  getVerbalTrick,
  addVerbalTrick,
  editVerbalTrick,
  verbalTrickDetail,
  changeVBTStu
}