import axios from 'axios'
import Vue from 'vue'
import store from './store'
import router from './router'
import { Loading } from 'element-ui';
import { Message } from 'element-ui';
import api from './config/api';

// var URL = process.env.URL;
// axios 配置
// axios.defaults.timeout = 100000000000000000000000000000000000;

// http request 拦截器

var Load;

axios.interceptors.request.use(
    config => {
        config.headers.common['token'] = Vue.cookie.get('token') || '';
        if (config.loading != false && !config.url.includes('kecheng/detail/') && !config.url.includes('/parsedmsg/im/msg/')) {
            Load = Loading.service({
                lock: true,
                text: '加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(

    response => {
        // store.commit('offLoading');
        if(Load != undefined){ Load.close() }
        return response;
    },
    error => {
        // store.commit('openAlert', {message: error.response.data.msg, type: 'warning'});
        Load.close();
        Message.closeAll();
        if(error.response.data.msg.includes('custom service account exists hint') == true){
          Message({
              message: '微信客户帐户已经存在。',
              type: 'error'
          });
        }else if(error.response.data.msg.includes('wechat account invalid hint') == true){
          Message({
              message: '微信帐号，无效提示。',
              type: 'error'
          });
        }else if(error.response.data.msg.includes('the wechat user have been one of your workers hint') == true){
          Message({
              message: '微信用户已成为您的工作人员。',
              type: 'error'
          });
        }else if(error.response.data.msg.includes('out of response count limit hint') == true){
          Message({
              message: '对方无应答，微信条数限制。',
              type: 'error'
          });
        }else if(error.response.data.msg.includes('response out of time limit or subscription is canceled hint') == true){
          Message({
              message: '响应超出时间限制 或 订阅已取消提示。',
              type: 'error'
          });
        }else if(error.response.data.msg.includes('system error hint') == true){
          Message({
              message: '微信系统繁忙。',
              type: 'error'
          });
        }else {
          Message({
              message: error.response.data.msg,
              type: 'error'
          });
        }

        if (error.response.status == 401) {
            let url = error.config.url;

            if (url !== api.newImUser) { // api.newImUser在已经存在用户的情况下也返回了401，所以需要特殊处理
                Vue.cookie.delete('token');
                sessionStorage.removeItem('userInfo')
                router.replace('/login')
            }
            
        }
        
        return Promise.reject(error);
    });

export default axios;
