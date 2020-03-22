<template>
    <div id='app' class="home">
      <router-view v-if="$route.name =='login'"></router-view>
      <el-container v-if="$route.name !='login'">
        <el-aside width="240px" class="menu-left box">
          <h3><img :src="logoUrl" class="logo-img" alt="好呗呗">好呗呗运营平台</h3>
          <el-menu class="el-menu-vertical" background-color="#F13877" text-color="#fff" active-text-color="#FFC000" :default-active="activeMenu">
            <div v-for='(menu,index) in menuList' :key='index'>
              <el-submenu :index='menu.index' v-if='menu.subs'>
                  <template slot='title'><i :class="menu.icon"></i>{{menu.name}}</template>
                  <router-link v-for='(item,idx) in menu.subs' :to="item.index" :key='idx' style="text-decoration: none;">
                    <el-menu-item  :key='idx' :index="item.index"><span slot="title">{{item.name}}</span></el-menu-item>
                  </router-link>
                
              </el-submenu>
              <router-link v-else :to="menu.index" style="text-decoration: none;">
                <el-menu-item :index="menu.index"><i :class="menu.icon"></i><span slot="title">{{menu.name}}</span></el-menu-item>
              </router-link>
            </div>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <el-menu  class="el-menu-demo" mode="horizontal">
              <div class="breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item v-for="(item,idx) in breadcrumb" :key='idx'>{{item.name}}</el-breadcrumb-item>
                  
                </el-breadcrumb>
              </div>
              <el-dropdown style="float: right;" placement="bottom" @command="logOut()">
                <el-menu-item index="1" class="user-avatar no-hover">
                  
                    <el-avatar :size="36" :src="userInfo.avatar" ></el-avatar>
                    <span class="ml10">{{userInfo.name}}</span>
                    <i class="el-icon-arrow-down" style="color: inherit;"></i>
                </el-menu-item>
                
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu>
           
          </el-header>
          <el-main class="box">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
  </div>
    
</template>

<script>
  import Vue from 'vue'
  import {routes} from './router'

  export default {
    data () {
      return {
        logoUrl: require('@/assets/hbb2.png'),
        isCollapse: false,
        userInfo: JSON.parse(Vue.cookie.get('userInfo')) || {},
        menuList:[
          {
            icon:'el-icon-user',
            index:'/miniProgram',
            name:'小程序客服',
          },
          // {
          //   icon:'el-icon-video-play',
          //   index:'/rebroadcast',
          //   name:'回播课',
          // },
          {
            icon:'el-icon-video-play',
            index:'/rebroadcastList',
            name:'回播课',
          },
          // {
          //   icon:'el-icon-video-camera',
          //   index:'/liveCourseList',
          //   name:'直播课',
          // },
          {
            icon:'el-icon-s-shop',
            index:'/shopList',
            name:'店铺管理',
          },
          // {
          //   icon:'el-icon-user-solid',
          //   index:'/merchantList',
          //   name:'店主管理',
          //   subs:[
          //     {index:'/merchantList',name:'店主列表'},
          //     // {index:'/playRecord',name:'播课记录'},
          //     // {index:'/userList',name:'用户列表'},
          //     // {index:'/groupManage',name:'组管理'},
          //   ]
          // },
          {
            icon:'el-icon-collection',
            index:'/coursewareBase',
            name:'课件库',
          },
          {
            icon:'el-icon-reading',
            index:'/verbalTrick',
            name:'话术库',
          },
          {
            icon:'el-icon-question',
            index:'/answerBase',
            name:'答疑库',
          },
          {
            icon:'el-icon-s-custom',
            index:'/specialist',
            name:'专家管理',
          },
          {
            icon:'el-icon-service',
            index:'/serviceManage',
            name:'客服管理',
          },
          // {
          //   icon:'el-icon-chat-line-square',
          //   index:'/conversationRecord',
          //   name:'会话记录',
          // },
          {
            icon:'el-icon-s-data',
            index:'/',
            name:'统计信息',
          },
          // {
          //   icon:'el-icon-setting',
          //   index:'/setting',
          //   name:'设置',
          // },

        ]
      }
    },
    methods: {
      logOut () {
        Vue.cookie.delete('userInfo')
        Vue.cookie.set('token')
        this.$router.push({ path: '/login' })
      }
    },
    computed:{
      activeMenu () {
        return this.$route.path;
      },
      breadcrumb(){
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].children) {
            for (let k = 0; k < routes[i].children.length; k++) {
              if (this.$route.meta.name == routes[i].children[k].meta.name) {
                return [
                  {name: routes[i].meta.name},
                  {name: routes[i].children[k].meta.name}
                ]
              }else if(this.$route.path == '/coursewareAdd' && this.$route.query.id){
                return [{name:'课件库'},{name:'编辑课件'}]
              }else if(this.$route.path == '/verbalTrickAdd' && this.$route.query.id){
                return [{name:'话术库'},{name:'编辑话术'}]
              }else if(this.$route.path == '/addMerchant' && this.$route.query.id){
                return [{name:'店主管理'},{name:'编辑店主'}]
              }
            }
          }
          else {
            if (this.$route.meta.name == routes[i].meta.name) {
              return [
                {name: routes[i].meta.name}
              ]
            }
          }
        }
      }
    }
  }
</script>

<style lang='less'>
  @import "./assets/style";

  .menu-left {
    background: #F13877;
  }
  .el-menu {
    border-right: none !important;
  }
  .el-menu-item [class^="el-icon-"],.el-submenu [class^="el-icon-"]{
    color: #fff;
  }
  .el-submenu__title i{
    color:#fff !important ;
  }
  .el-menu-item:hover,.el-submenu__title:hover{
    background-color: #F2125D!important;
  }
  .el-menu-item.no-hover{
    background-color: #fff!important;
  }
  .breadcrumb{
    // background-color: #fff!important;
    display: inline-block;
    padding: 0 20px;
  }
  .el-menu--horizontal>.el-menu-item.no-hover.is-active{
    border-bottom:0px;
  }
  .logo-img{
    width: 30px;
    vertical-align: bottom;
  }
  .el-header {
    padding: 0 !important;
  }
  .el-aside {
    height: 100vh;
  }
  .el-breadcrumb{
    line-height: 60px!important;
  }
  .bread .el-breadcrumb__separator{
    color: #C0C4CC;
  }
  h3 {
    color: #fff;
    text-align: center;
  }
  .el-menu.el-menu--horizontal {
    height: 100%;
  }
  .user-avatar {
    float: right !important;
  }
  .menu-close-icon {
    font-size: 24px !important;
  }
  .el-main{
    height: calc(100vh - 60px);
  }
</style>