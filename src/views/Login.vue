<template>
  <div>
    <div class="login-bg"></div>
    <el-card class="box-card">
      <h3 class="login-title">
        <img :src="logoUrl" class="logo-img" alt="好呗呗">
        好呗呗运营平台
      </h3>
      <el-form :rules="rules" ref="loginForm" :model="loginForm" label-width="80px" size="small">
        <el-form-item prop='loginId' label="登录名">
          <el-input v-model.trim="loginForm.loginId" clearable></el-input>
        </el-form-item>
        <el-form-item prop='passwd' label="密码">
          <el-input v-model.trim="loginForm.passwd" type="password" clearable></el-input>
        </el-form-item>
        <el-row class="tc">
          <el-button type="primary" :loading='isLoading' @click="onSubmit" size="small">立即登录</el-button>
        </el-row>
      </el-form>
    </el-card>
    <el-dialog :visible='showChangePwd' title='修改密码' :show-close='false' width='400px' style="margin-top:13vh;">
      <el-form inline :model="pwdForm" label-width="65px">
        <el-form-item label="新密码">
          <el-input v-model.trim="pwdForm.passwd" type="password" clearable></el-input>
        </el-form-item>
        <el-row class="tc mt20">
          <el-button class="mt20" type="primary" :loading='isPwdLoading' @click="changePwd" size="small">确定修改</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/login'
  import Vue from 'vue'
  export default {
    data() {
      return {
        loginForm: {
          loginId: '',
          passwd: '',
          platform:'PC'
        },
        logoUrl: require('@/assets/hbb.png'),
        isLoading:false,
        isPwdLoading:false,
        showChangePwd:false,//修改密码弹框
        pwdForm:{
          passwd:''
        },
        rules: {
          loginId: [
            { required: true, message: '请输入帐号', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
      };
    },
    methods: {
      //登录
      onSubmit() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.isLoading = true
            api.pwdLogin(this.loginForm,{}).then(res => {
              this.isLoading = false
              if(res.code === 200){
                let userInfo = {
                  avatar: res.data.user.avatar,
                  id: res.data.user.id,
                  name: res.data.user.name,
                }
                Vue.cookie.set('userInfo',JSON.stringify(userInfo),60*60*24*365)
                Vue.cookie.set('token',res.data.token,60*60*24*365)
                //强制修改密码
                if(res.data.user.idPasswd.init){
                  this.showChangePwd = true
                }else {
                  this.$router.push({ path: '/' })
                }
              }
            }).catch(err => {
              this.isLoading = false
              // this.$message.error(err.msg || '帐号或密码错误')
            })
          }else{
            return false
          }
        })
      },
      //修改密码
      changePwd(){
        if(this.pwdForm.passwd.length < 6){
          this.$message.error('密码必填且不小于6位~')
          return false
        }
        this.isPwdLoading = true
        api.changePwd({passwd:this.pwdForm.passwd}).then(res => {
          this.isPwdLoading = false
          if(res.code === 200){
            this.showChangePwd = false
            this.$notify.warning('请重新登录~')
            this.$router.push({ path: '/login' })
            this.loginForm.passwd = ''
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  html{
    width: 100%;
    height: 100%;
  }
  .login-bg{
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: url('../assets/bg.jpg');
    background-size: cover;
    filter: blur(3px);
  }
  .logo-img{
    width: 30px;
    vertical-align: bottom;
  }
  .box-card {
    width: 380px;
    position: absolute;
    left: 50%;
    top: 0;
    margin-left: -190px;
    margin-top: 260px;
  }
  .login-title {
    text-align: center;
    color: #F13877;
  }
  /deep/.el-card {
    border: 1px solid #eee;
    background-color: rgba(255,255,255,0.7) !important;
  }
</style>