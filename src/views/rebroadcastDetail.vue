<template>
  <div class="all-user pr">

    <el-tabs v-model="activeName" @tab-click="handleClick" v-loading="loading">
      <el-tab-pane label="基本信息" name="1">
        <basicInfo :detail="allInfo.keCheng" />
      </el-tab-pane>
      <el-tab-pane label="课件" name="course">
        <courseWareDetail type="course" :objInfo="allInfo.keCheng" :currentName="currentName" />
      </el-tab-pane>
      <el-tab-pane label="话术" name="talkingSkill">
        <courseWareDetail type="talkingSkill" :objInfo="allInfo.keCheng" :currentName="currentName" />
      </el-tab-pane>
      <el-tab-pane label="门店" name="4">
        <storeDetail :allInfo="allInfo" />
      </el-tab-pane>
      <el-tab-pane label="客服&小助手" name="5">
        <customerAssistant :dataBox="allInfo.keCheng.users" />
      </el-tab-pane>
      <el-tab-pane label="回播间" name="rebroadcastRoom">
        <rebroadcastRoom :allInfo="allInfo" :currentName="currentName"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import api from '@/servers/huibo'
  import basicInfo from '@/components/rebroadcast/basicInfo';
  import storeDetail from '@/components/rebroadcast/storeDetail';
  import courseWareDetail from '@/components/rebroadcast/courseWareDetail';
  import statisticalInformation from '@/components/rebroadcast/statisticalInformation';
  import customerAssistant from '@/components/rebroadcast/customerAssistant';
  import rebroadcastRoom from '@/components/rebroadcast/rebroadcastRoom';
  export default {
    components: {
      basicInfo,
      storeDetail,
      courseWareDetail,
      statisticalInformation,
      customerAssistant,
      rebroadcastRoom
    },
    data() {
      return {
        activeName: '1',
        currentName: "",
        allInfo: {
          keCheng: {},
          users: [],
        },
        loading: false
      }
    },
    mounted() {
      this.getDetail();
    },

    methods: {
      //
      handleClick(tab, event) {
        this.currentName=tab.name;
      },
      getDetail() {
        let params = {
          queryParam: this.$route.query.id,
        
        }
        this.loading = true;
        api.huiBoDetail(params).then(res => {
          console.log("获取到的信息：" + JSON.stringify(res));
          this.loading = false;
          if (res.code === 200) {
            this.allInfo = res.data
          }
          else {
            this.allInfo = {
              keCheng: {},
              users: []
            };
          }
        }).catch(err => {
          this.allInfo = {
            keCheng: {},
            users: []
          };
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .creat-btn {
    right: 0px;
    z-index: 5;
  }
</style>