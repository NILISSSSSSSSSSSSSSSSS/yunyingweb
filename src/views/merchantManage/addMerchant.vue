<template>
  <div>
    <el-card class="">
      <el-tabs class="my-tabs" v-model="activeName" @tab-click="handleClick" :stretch='true'>
        <el-tab-pane label="店主信息" name="first">
          <merchantInfo :merchantParams='merchantParams' @getRegStatus='getRegStatus'/>
        </el-tab-pane>
        <!-- <el-tab-pane label="服务号申请资料" name="second" :disabled='isDisabled'>
          <accountApplyFor :regStatus='regStatus'/>
        </el-tab-pane>
        <el-tab-pane label="服务号信息" name="third" :disabled='isDisabled'>
          <accountInfo :regStatus='regStatus' @goFWInfo='goFWInfo'/>
        </el-tab-pane>
        <el-tab-pane label="小程序信息" name="fourth" :disabled='isDisabled'>
          <miniProgramInfo :regStatus='regStatus'/>
        </el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import merchantInfo from '@/components/merchant/merchantInfo' //店主信息
  import accountApplyFor from '@/components/merchant/accountApplyFor' //服务号申请
  import accountInfo from '@/components/merchant/accountInfo' //服务号信息
  import miniProgramInfo from '@/components/merchant/miniProgramInfo' //小程序信息
  export default {
    components:{
      merchantInfo,
      accountApplyFor,
      accountInfo,
      miniProgramInfo
    },
    data() {
      return {
        isDisabled: this.$route.query.id ? false : true,
        merchantParams:{
          useStatus:1,
          address:{},
          heHuoRen:{},
          roleIds:'5df87d85306b88278926bd62',//默认店主角色 不可删
        },//查询参数
        activeName:'first',
        accountApply:{
          status: 0
        },
        regStatus: null,//0 基本信息完善 1 服务号资料等待店主提交 2 服务号资料提交微信 3 服务号资料微信审核成功  4小程序资料填写 5 小程序资料申请成功 6 小程序上线 7 服务号资料微信审核失败 8 小程序资料申请失败
      };
    },
    methods: {
      searchList(){
      },
      handleClick(){},
      getRegStatus(statu){
        this.regStatus = statu
      },
      goFWInfo(res){
        if(res){
          this.activeName = 'third'
        }
      }
    },
    watch:{
      regStatus(val,old){
        this.regStatus = val
      }
    }
  }
</script>

<style lang="less" scoped>

</style>