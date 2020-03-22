import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
const EchartsCount = () => import('./views/echartsCount.vue')
const Home = () => import('./views/Home.vue')
const Login = () => import('./views/Login.vue')
const courseware = () => import('./views/courseware/courseware.vue')
const coursewareBase = () => import('./views/courseware/coursewareBase.vue')
const coursewareAdd = () => import('./views/courseware/coursewareAdd.vue')
const merchant = () => import('./views/merchantManage/merchant.vue')
const verbal = () => import('./views/verbalTrick/verbal.vue')
const specia = () => import('./views/specialist/specia.vue')
const serviceManage = () => import('./views/serviceManage/serviceManage.vue')
const answerBase = () => import('./views/answerBase/answerBase.vue')
const conver = () => import('./views/conversationRecord/conver.vue')

Vue.use(Router)


const routes = [
    {
      path: '/',
      name: 'echartsCount',
      meta: { name: "统计信息" },
      component: EchartsCount
    },
    {
      path: '/login',
      name: 'login',
      meta: { name: "登录" },
      component: Login
    },
    {
      path: '/miniProgram',
      name: 'miniProgram',
      meta: { name: "小程序客服" },
      component: () => import('./views/miniProgram.vue')
    },
    {
      path: '/createRebroadcast',
      name: 'createRebroadcast',
      meta: { name: "创建回播课" },
      component: () => import('./views/createRebroadcast.vue')
    },
    {
      path: '/editRebroadcast',
      name: 'editRebroadcast',
      meta: { name: "编辑回播课" },
      component: () => import('./views/editRebroadcast.vue')
    },
    {
      path: '/createLive',
      name: 'createLive',
      meta: { name: "创建直播" },
      component: () => import('./views/createLive.vue')
    },
    {
      path: '/rebroadcastList',
      name: 'rebroadcastList',
      meta: { name: "回播课" },
      component: () => import('./views/rebroadcastList.vue')
    },
    {
      path: '/liveCourseList',
      name: 'liveCourseList',
      meta: { name: "直播课" },
      component: () => import('./views/liveCourseList.vue')
    },
    {
      path: '/rebroadcastDetail',
      name: 'rebroadcastDetail',
      meta: { name: "回播课详情" },
      component: () => import('./views/rebroadcastDetail.vue')
    },
    {
      path: '/coursewareBase',
      meta: { name: "课件库" },
      component: courseware,
      children:[
        {
          path: '/',
          meta: { name: "课件库" },
          component: coursewareBase
        },
        {
          path: '/coursewareAdd',
          meta: { name: "新增课件" },
          component: coursewareAdd
        },
      ]
    },
    {
      path: '/shopList',
      name: 'shopList',
      meta: { name: "店铺管理" },
      component: () => import('./views/shopList.vue')
    },
    {
      path: '/merchantList',
      meta: { name: "店主管理" },
      component: merchant,
      children:[
        {
          path: '/', //店主列表
          meta: { name: "店主列表" },
          component: ()=> import ('./views/merchantManage/merchantList.vue')
        },
        {
          path: '/addMerchant', //新增店主
          meta: { name: "新增店主" },
          component: ()=> import ('./views/merchantManage/addMerchant.vue')
        },
        {
          path: '/playRecord', //播课记录
          meta: { name: "播课记录" },
          component: ()=> import ('./views/merchantManage/playRecord.vue')
        },
        {
          path: '/userList', //用户列表
          meta: { name: "用户列表" },
          component: ()=> import ('./views/merchantManage/userList.vue')
        },
        {
          path: '/groupManage', //组管理
          meta: { name: "组管理" },
          component: ()=> import ('./views/merchantManage/groupManage.vue')
        },
      ]
    },

    {
      path: '/verbalTrick', //话术库
      meta: { name: "话术库" },
      component:verbal,
      children:[
        {
          path: '/', //话术库
          meta: { name: "话术库" },
          component: ()=> import ('./views/verbalTrick/verbalTrick.vue')
        },
        {
          path: '/verbalTrickAdd', //新增话术
          meta: { name: "新增话术" },
          component: ()=> import ('./views/verbalTrick/verbalTrickAdd.vue')
        },
      ]
    },
    {
      path: '/specialist', //专家管理
      meta: { name: "专家管理" },
      component:specia,
      children:[
        {
          path: '/', //专家管理
          meta: { name: "专家管理" },
          component: ()=> import ('./views/specialist/specialist.vue')
        }
      ]
    },
    {
      path: '/serviceManage', //客服管理
      meta: { name: "客服管理" },
      component:serviceManage,
      children:[
        {
          path: '/', //客服管理
          meta: { name: "客服管理" },
          component: ()=> import ('./views/serviceManage/service.vue')
        }
      ]
    },
    {
      path: '/answerBase', //答疑库
      meta: { name: "答疑库" },
      component:answerBase,
      children:[
        {
          path: '/', //答疑库
          meta: { name: "答疑库" },
          component: ()=> import ('./views/answerBase/answer.vue')
        }
      ]
    },
    {
      path: '/conversationRecord', //会话记录
      meta: { name: "会话记录" },
      component:conver,
      children:[
        {
          path: '/', //会话记录
          meta: { name: "会话记录" },
          component: ()=> import ('./views/conversationRecord/conversation.vue')
        },
        {
          path: '/miniConversation', //小程序会话
          meta: { name: "小程序会话" },
          component: ()=> import ('./views/conversationRecord/miniConversation.vue')
        },
        {
          path: '/serviceConversation', //客服会话
          meta: { name: "客服会话" },
          component: ()=> import ('./views/conversationRecord/serviceConversation.vue')
        }
      ]
    },
  ]
const vueRouter = new Router({
  routes
});

vueRouter.beforeEach((to, from, next) => {
  if (to.name != 'login' && !Vue.cookie.get('token')) {
    next('/login')
  }
  next()
})

export default vueRouter
export {
  routes
}
