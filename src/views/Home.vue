<template>
  
</template>

<script>

import { routes } from "@/router";
  export default {
    // data () {
    //   return {
    //     isCollapse: false,
    //     activeMenu: this.$route.path,
    //     breadcrumb:[],
    //     userInfo:JSON.parse(sessionStorage.getItem('userInfo')) || {},
    //     routerAlive:true,
    //     menuList:[
    //       {
    //         icon:'el-icon-user',
    //         index:'/miniProgram',
    //         name:'小程序客服',
    //       },
    //       {
    //         icon:'el-icon-video-play',
    //         index:'',
    //         name:'回播课',
    //       },
    //       {
    //         icon:'el-icon-video-camera',
    //         index:'',
    //         name:'直播',
    //       },
    //       {
    //         icon:'el-icon-collection',
    //         index:'/coursewareBase',
    //         name:'课件库',
    //       },
    //       {
    //         icon:'el-icon-s-shop',
    //         index:'/merchantList',
    //         name:'店主管理',
    //         subs:[
    //           {index:'/merchantList',name:'店主列表'},
    //           {index:'/playRecord',name:'播课记录'},
    //           {index:'/userList',name:'用户列表'},
    //           {index:'/groupManage',name:'组管理'},
    //         ]
    //       },
    //       {
    //         icon:'el-icon-reading',
    //         index:'/verbalTrick',
    //         name:'话术库',
    //       },
    //       {
    //         icon:'el-icon-question',
    //         index:'/answerBase',
    //         name:'答疑库',
    //       },
    //       {
    //         icon:'el-icon-s-custom',
    //         index:'/specialist',
    //         name:'专家管理',
    //       },
    //       {
    //         icon:'el-icon-service',
    //         index:'/serviceManage',
    //         name:'客服管理',
    //       },
    //       {
    //         icon:'el-icon-chat-line-square',
    //         index:'/conversationRecord',
    //         name:'会话记录',
    //       },
    //       {
    //         icon:'el-icon-s-data',
    //         index:'/',
    //         name:'统计信息',
    //       },
    //       {
    //         icon:'el-icon-setting',
    //         index:'',
    //         name:'设置',
    //       },

    //     ]
    //   }
    // },

    // methods: {
    //   handleSelect(e) {
		// 		this.$router.push({ path: e });
    //   },
    //   //递归获取菜单名
    //   findAllIdsById(id, arr, path = []) {
    //     for (let i = 0, l = arr.length; i < l; i++) {
    //       let _tpath = path.concat();
    //       _tpath.push(arr[i].meta.name);
    //       if (id === arr[i].meta.name) {
    //         return _tpath;
    //       }
    //       if ("children" in arr[i]) {
    //         let res = this.findAllIdsById(id, arr[i].children, _tpath);
    //         if (res) {
    //           return res;
    //         }
    //       }
    //     }
    //   }
    // },
    // mounted(){
    //   let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {}
    // },
    // computed:{
     
    // },
    // watch: {
    //   $route: {
    //     handler: function (val, oldVal) {
    //       this.activeMenu = val.path
    //       if(val.path ==='/addMerchant' && val.query.id){
    //         this.breadcrumb = ['店主管理','编辑店主']
    //         return
    //       }else if(val.path ==='/addMerchant'){
    //         this.breadcrumb = ['店主管理','新增店主']
    //         return
    //       }
    //       this.breadcrumb = this.findAllIdsById(val.meta.name, routes).filter(item => item);
    //     },
    //     // 深度观察监听
    //     deep: true,
    //     immediate: true,
    //   },
    // },
  }

</script>
