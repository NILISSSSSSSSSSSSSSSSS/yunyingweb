import Vue from 'vue'
//多个参数 问号链接
function Get (requestUrl ,params, obj) {
  if (params) {
    var paramsStr = '?';
    for(var i in params) {
      paramsStr = paramsStr + i + '=' + params[i] + '&';
    }
    paramsStr = paramsStr.substr(0, paramsStr.length - 1);
    if (obj && obj.loading == false) {
      return new Promise((resolve,reject) => {
        Vue.prototype.$ajax.get(requestUrl + paramsStr,{loading: false})
             .then(response => {
               resolve(response.data);
             },err => {
               reject(err)
             })
      })
    }
    else {
      return new Promise((resolve,reject) => {
        Vue.prototype.$ajax.get(requestUrl + paramsStr)
             .then(response => {
               resolve(response.data);
             },err => {
               reject(err)
             })
      })
    }
  }
  else {
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.get(requestUrl)
           .then(response => {
             resolve(response.data);
           },err => {
             reject(err)
           })
    })
  }
}
//单个id参数 非问号传参
function Get2 (requestUrl ,params, obj) {
  if (obj && obj.loading == false) {
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.get(requestUrl + params.queryParam,{params:params},{loading:false})
            .then(response => {
              resolve(response.data);
            },err => {
              reject(err)
            })
    })
  }
  else {
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.get(requestUrl + params.queryParam,{params:params})
            .then(response => {
              resolve(response.data);
            },err => {
              reject(err)
            })
    })
  }
}
function Post (requestUrl ,params, obj) {
  if (obj && obj.loading == false) {
    return new Promise((resolve, reject) => {
      Vue.prototype.$ajax.post(requestUrl, params,{loading: false})
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
    });
  }
  else {
    return new Promise((resolve, reject) => {
      Vue.prototype.$ajax.post(requestUrl, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
    });
  }
}
//路由单参数及其他body参数
function Put(requestUrl,params = {},obj){
  if (obj && obj.loading == false) {
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.put(requestUrl + params.queryParam,params)
          .then(res => {
            resolve(res.data);
          },err => {
            reject(err)
          })
    })
  }else{
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.put(requestUrl + params.queryParam,params)
          .then(res => {
            resolve(res.data);
          },err => {
            reject(err)
          })
    })
  }
}
//路由多参数
function Put2(requestUrl,params = {},obj){
  if(params){
    let paramsStr = ''
    for(var i in params) {
      paramsStr = paramsStr + params[i] + '/';
    }
    paramsStr = paramsStr.substring(0,paramsStr.length-1)
    if (obj && obj.loading == false) {
      return new Promise((resolve,reject) => {
        Vue.prototype.$ajax.put(requestUrl + paramsStr,params)
            .then(res => {
              resolve(res.data);
            },err => {
              reject(err)
            })
      })
    }else{
      return new Promise((resolve,reject) => {
        Vue.prototype.$ajax.put(requestUrl + paramsStr,params)
            .then(res => {
              resolve(res.data);
            },err => {
              reject(err)
            })
      })
    }
  }
}

function Del(requestUrl,params = {},obj){
  if (obj && obj.loading == false) {
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.delete(requestUrl + params.queryParam,{data:params})
      .then(res=>{
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
    })
  }else{
    return new Promise((resolve,reject) => {
      Vue.prototype.$ajax.delete(requestUrl + params.queryParam,{data:params})
      .then(res=>{
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
    })
  }
}

export default {
  Get,
  Get2,
  Post,
  Put,
  Put2,
  Del
}
