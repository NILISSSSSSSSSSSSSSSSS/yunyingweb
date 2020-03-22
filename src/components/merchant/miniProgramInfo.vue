<template>
  <div style="min-height:521px">
    <el-row :class="isSuccess? 'success account-info' : 'account-info' ">
      <el-col :span='11' class="tr">
        <i class="el-icon-warning" v-if='!isSuccess'></i>
        <i class="el-icon-success" v-if='isSuccess'></i>
      </el-col>
      <el-col :span='11' class="ml10">
        <el-row>{{regStatus | merchantStatus}}</el-row>
        <!-- <el-row class="info-tips">认证通过</el-row> -->
      </el-col>
    </el-row>
    <el-form ref='formParams' :model='formParams' labelWidth='140px' class="mt20">
      <el-row class="account-title">小程序帐号信息：</el-row>
      <el-form-item prop='xiaoChengXuAccount.phone' :rules='rules' label='邮箱'>
        <el-input v-model.trim='formParams.xiaoChengXuAccount.email' placeholder='邮箱' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='xiaoChengXuAccount.passwd' :rules='rules' label='密码'>
        <el-input v-model.trim='formParams.xiaoChengXuAccount.passwd' placeholder='密码' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='xiaoChengXuAccount.qrAdmin' :rules='rules' label='管理员姓名'>
        <el-input v-model.trim='formParams.xiaoChengXuAccount.qrAdmin' placeholder='管理员姓名' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='xiaoChengXuAccount.idNo' :rules='rules' label='管理员身份证号码'>
        <el-input v-model.trim='formParams.xiaoChengXuAccount.idNo' placeholder='管理员身份证号码' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='xiaoChengXuAccount.phone' :rules='rules' label='管理员手机号'>
        <el-input v-model.trim='formParams.xiaoChengXuAccount.phone' placeholder='管理员手机号' maxLength='11' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='save' type='primary' icon='el-icon-check'>保存</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/servers/merchant'
export default {
  name: 'miniProgramInfo',
  props:{
    regStatus:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dzId:this.$route.query.id,
      isSuccess:true,
      formParams:{
        xiaoChengXuAccount:{}
      },
      rules:[
        {required:true,message:'必填',triigger:'blur'}
      ]
    }
  },
  methods: {
    save(){
      let params = {
        ...this.formParams,
        dzId:this.dzId
      }
      this.$refs['formParams'].validate(valid => {
        if(valid){
          if(!this.$utils.EMAIL_REG.test(this.formParams.xiaoChengXuAccount.email)){
            this.$message.error('邮箱格式不正确')
            return false
          }
          if(!this.$utils.PHONE_REG.test(this.formParams.xiaoChengXuAccount.phone)){
            this.$message.error('手机号格式不正确')
            return false
          }
          api.setMiniProgram(params).then(res => {
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
    getFwhXcxInfo(){
      if(this.regStatus < 2) return
      let param ={
        queryParam: this.$route.query.id
      }
      api.getFwhXcxInfo(param).then(res => {
        if(res.code === 200) {
          this.formParams = {
            xiaoChengXuAccount:res.data.xiaoChengXuAccount || {}
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
      this.getFwhXcxInfo()
      if(val === 8){
        this.isSuccess = false
      }else if(val === 5){
        this.isSuccess = true
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
