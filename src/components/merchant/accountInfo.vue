<template>
  <div style="min-height:521px">
    <el-row :class="isSuccess? 'success account-info' : 'account-info' ">
      <el-col :span='11' class="tr">
        <i class="el-icon-warning" v-if='!isSuccess'></i>
        <i class="el-icon-success" v-if='isSuccess'></i>
      </el-col>
      <el-col :span='11' class="ml10">
        <el-row>{{regStatus | merchantStatus}}</el-row>
        <!-- <el-row class="info-tips">等待店主提供服务号申请资料或等待管理员审核</el-row> -->
      </el-col>
    </el-row>
    <el-form v-if='isSuccess' ref='formParams' :model='formParams' labelWidth='100px' class="mt20">
      <el-row class="account-title">开发者信息：</el-row>
      <el-form-item prop='fuWuHaoKey.appId' :rules='rules' label='开发者ID'>
        <el-input v-model.trim='formParams.fuWuHaoKey.appId' placeholder='开发者ID（AppID）' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='fuWuHaoKey.secret' :rules='rules' label='开发者密码'>
        <el-input v-model.trim='formParams.fuWuHaoKey.secret' placeholder='开发者密码(AppSecret)' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='domain' :rules='rules' label='服务器配置'>
        <el-input v-model.trim='formParams.domain' placeholder='小程序服务器地址' class="w600" size='small' clearable></el-input>
      </el-form-item> 
      <el-form-item>
        <el-button @click='save' type='primary' icon='el-icon-check'>保存</el-button></el-form-item>
      </el-form>
    </el-form>
  </div>
</template>

<script>
  import api from '@/servers/merchant'
export default {
  name: 'accountInfo',
  props:{
    regStatus:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isSuccess:true,
      id:this.$route.query.id || '',
      formParams:{
        fuWuHaoKey:{
          appId:'',
          secret:'',
        },
        domain:''
      },
      rules:[
        {required:true ,message:'必填', triigger:'blur'}
      ],
      
    }
  },
  methods: {
    save(){
      let params = {
        ...this.formParams,
        queryParam: this.id
      }
      this.$refs['formParams'].validate(valid => {
        if(valid){
          api.setWxInfoKey(params).then(res => {
            if(res.code === 200){
              this.$message.success(res.msg || '操作成功')
            }
          })
        }else{
          return false
        }
      })
      
    },
    //获取服务号资料
    getMerchantInfo(){
      if(this.regStatus < 2) return
      let param ={
        queryParam: this.$route.query.id
      }
      api.getMerchantInfo(param).then(res => {
        if(res.code === 200) {
          this.formParams = {
            fuWuHaoKey:res.data.fuWuHaoKey || {},
            domain:res.data.domain
          }
        }
      })
    }
    
  },
  mounted() {

  },
  watch:{
    regStatus(val){
      //0 基本信息完善 1 服务号资料等待店主提交 2 服务号资料提交微信 3 服务号资料微信审核成功  
      //4小程序资料填写 5 小程序资料申请成功 6 小程序上线 7 服务号资料微信审核失败 8 小程序资料申请失败
      if(val === 7){
        this.isSuccess = false
      }else if(3 <= val <= 6){
        this.isSuccess = true
        this.getMerchantInfo()
      }else {
        this.isSuccess = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .account-info{
    font-size: 16px;
    color: #000000;
    background: #FDF6EC;
    border-radius: 5px;
    padding: 20px 0;
    border: 1px solid #F2CD97;
  }
  .info-tips{
    color: #C4BFBD;
    font-size: 12px;
    margin-top: 10px;
  }
  .account-info i{
    color: #E6A23C;
    font-size: 24px;
  }
  .success{
    color: #74C55C;
    background: #F0F9EB;
    border: 1px solid #74C55C;
  }
  .account-info.success i{
    color: #74C55C;
  }
</style>
