import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './http'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/element-variables.scss'
import * as utils from '@/utils/utils'
var VueCookie = require('vue-cookie');
import pagination from '@/components/pagination'
import paginationsmall from '@/components/paginationsmall'

import '@/utils/filiter.js'
import lodash from 'lodash'
import { initIm } from './config/tim'
/**图片,视频，音频预览 */
import viewImage from "@/components/viewImage/ViewImage";

require('echarts/theme/macarons');

Vue.use(ElementUI);
Vue.use(VueCookie);

//全局过滤
Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})
Vue.prototype.$viewImage = viewImage;
Vue.prototype.$ajax = axios;
Vue.prototype.$utils = utils
Vue.prototype._ = lodash
Vue.config.productionTip = false
Vue.component('pagination',pagination)
Vue.component('paginationsmall',paginationsmall)

initIm(); // 腾讯im初始化

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
