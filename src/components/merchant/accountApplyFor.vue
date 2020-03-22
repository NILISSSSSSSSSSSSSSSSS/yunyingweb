<template>
  <div>
    <el-form class="normal-form" :model='accountParams' ref='accountParams' labelWidth='160px'>
      <el-row>
        <div class="tips" style="margin-left: 0px;">* 本页所有信息必填</div>
        <span class="account-title" style='margin-right:55px'>服务号状态：</span>
        <el-radio-group v-model.number='statuValue'>
          <el-radio :label='0'>未开通</el-radio>
          <el-radio :label='1'>已开通</el-radio>
        </el-radio-group>
      </el-row>
      <el-row class="account-title">店主邮箱帐号：</el-row>
      <el-form-item prop='dzEmail.email' :rules='rules' label='邮箱地址'>
        <el-input v-model.trim='accountParams.dzEmail.email' placeholder='邮箱地址' class="w600" size='small' clearable></el-input>
      </el-form-item> 
      <el-form-item prop='dzEmail.passwd' :rules='rules' label='登录密码'>
        <el-input v-model.trim='accountParams.dzEmail.passwd' placeholder='登录密码' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-row class="account-title">微信公众平台登录信息：</el-row>
      <el-form-item prop='fuWuHaoAccount.email' :rules='rules' label='登录账号'>
        <el-input v-model.trim='accountParams.fuWuHaoAccount.email' placeholder='登录帐号' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='fuWuHaoAccount.passwd' :rules='rules' label='登录密码'>
        <el-input v-model.trim='accountParams.fuWuHaoAccount.passwd' placeholder='登录密码' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-row class="account-title">服务号注册信息：</el-row>
      <div>
        <el-form-item prop='fuWuHaoRegInfo.shopType' :rules='rules' label='企业类型'>
          <el-select v-model='accountParams.fuWuHaoRegInfo.shopType' class="w600" size='small' clearable>
            <el-option label='个体工商户' value='PERSONALITY'></el-option>
            <el-option label='企业账户' value='BUSINESS'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.shopName' :rules='rules' label='企业名称'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.shopName' placeholder='企业名称' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.uscc' :rules='rules' label='统一社会信用代码'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.uscc' placeholder='统一社会信用代码' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.legalPerson' :rules='rules' label='法人'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.legalPerson' placeholder='法人' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.lpIdNo' :rules='rules' label='法人身份证号码'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.lpIdNo' placeholder='法人身份证号码' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.phone' :rules='rules' label='法人手机号码'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.phone' placeholder='法人手机号码' maxLength='11' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.email' :rules='rules' label='法人电子邮箱'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.email' placeholder='法人电子邮箱' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.tel' :rules='rules' label='法人座机'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.tel' placeholder='法人座机' class="w600" size='small' clearable></el-input>
        </el-form-item>
      </div>
      <el-row class="account-title">运营者信息：</el-row>
      <div>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.name' :rules='rules' label='运营者身份证姓名'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.yunYingInfo.name' placeholder='运营者身份证姓名' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.adminIdNo' :rules='rules' label='运营者身份证号'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.yunYingInfo.adminIdNo' placeholder='运营者身份证号' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.phone' :rules='rules' label='运营者手机号'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.yunYingInfo.phone' placeholder='运营者手机号' maxLength='11' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.email' :rules='rules' label='运营者邮箱'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.yunYingInfo.email' placeholder='运营者邮箱' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.idImgA' :rules='rules' label='运营者身份证(正面)'>
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="(v,res)=>handleAvatarSuccess('idImgA',res)">
            <img v-if="accountParams.fuWuHaoRegInfo.yunYingInfo.idImgA" :src="accountParams.fuWuHaoRegInfo.yunYingInfo.idImgA" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.yunYingInfo.idImgB' :rules='rules' label='运营者身份证(反面)'>
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="(v,res)=>handleAvatarSuccess('idImgB',res)">
            <img v-if="accountParams.fuWuHaoRegInfo.yunYingInfo.idImgB" :src="accountParams.fuWuHaoRegInfo.yunYingInfo.idImgB" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </div>
      <el-row class="account-title">对公账户信息/法人对私账户：</el-row>
      <div>
        <el-form-item prop='fuWuHaoRegInfo.bankAccount.compName' :rules='rules' label='企业名称'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.bankAccount.compName' placeholder='企业名称' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.bankAccount.bankName' :rules='rules' label='银行名称'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.bankAccount.bankName' placeholder='银行名称' class="w600" size='small' clearable></el-input>
        </el-form-item>
        <el-form-item prop='fuWuHaoRegInfo.bankAccount.bankNo' :rules='rules' label='银行卡号'>
          <el-input v-model.trim='accountParams.fuWuHaoRegInfo.bankAccount.bankNo' placeholder='银行卡号' class="w600" size='small' clearable></el-input>
        </el-form-item>
      </div>
      <el-row class="account-title">公众号信息：</el-row>
      <el-form-item prop='fuWuHaoRegInfo.fuWuHaoName' :rules='rules' label='公众号名称'>
        <el-input v-model.trim='accountParams.fuWuHaoRegInfo.fuWuHaoName' placeholder='公众号名称' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='fuWuHaoRegInfo.fuWuHaoDesc' :rules='rules' label='公众号描述'>
        <el-input v-model='accountParams.fuWuHaoRegInfo.fuWuHaoDesc' type='textarea' placeholder='公众号描述' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-row class="account-title">文件上传：</el-row>
      <el-form-item prop='fuWuHaoRegInfo.reqFile' :rules='rules' label='申请公函'>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(v,res)=>handleAvatarSuccess('reqFile',res)">
          <img v-if="accountParams.fuWuHaoRegInfo.reqFile" :src="accountParams.fuWuHaoRegInfo.reqFile" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop='fuWuHaoRegInfo.yingYeZhiZhao' :rules='rules' label='工商营业执照'>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(v,res)=>handleAvatarSuccess('yingYeZhiZhao',res)">
          <img v-if="accountParams.fuWuHaoRegInfo.yingYeZhiZhao" :src="accountParams.fuWuHaoRegInfo.yingYeZhiZhao" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='其他证件'>
        <el-upload
          ref='upload'
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="(v,res)=>handleAvatarSuccess('otherFiles',res)"
          :show-file-list='true'
          accept="image/*">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div v-if='hasImgList.length'>
          <el-row class="tips">现有图片:</el-row>
          <img class="my-avatar mt10 mr10" v-for="(itm,index) in hasImgList" :src="itm" :key="index">
        </div>
        <!-- <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(v,res)=>handleAvatarSuccess('otherFiles',res)">
          <img v-if="accountParams.fuWuHaoRegInfo.otherFiles" :src="accountParams.fuWuHaoRegInfo.otherFiles" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </el-form-item>
      <el-row class="bor-top tr">
        <!-- <el-button v-if='isCheckAdmin' @click="checkInfo(1)" type='success' icon='el-icon-circle-check'>审核通过</el-button>
        <el-button v-if='isCheckAdmin' @click="checkInfo(0)" type='danger' icon='el-icon-circle-close'>审核不通过</el-button> -->
        <el-button @click='save' type='primary' icon='el-icon-check'>保存</el-button>
      </el-row>
    </el-form>
    <addGroup :dialogData='dialogData' @close='closeGroup'/>
  </div>
</template>

<script>
import addGroup from '@/components/merchant/addGroup'
import api from '@/servers/merchant'
import config from '@/config/api'
export default {
  name: 'accountParamsFor',
  components:{
    addGroup
  },
  props:{
    regStatus:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      statuValue:0,
      uploadUrl: config.ossUpload || '',//文件上传
      id:'',//资料id
      accountParams:{
        dzId: this.$route.query.id || '',
        dzEmail:{
          email:'912803716@qq.com',
          passwd:'123456'
        },
        fuWuHaoAccount:{
          email:'912803717@qq.com',
          passwd:'123456',
          qrAdmin:'Lily'
        },
        fuWuHaoRegInfo:{
          shopType:'PERSONALITY',
          shopName:'红豆杉绿植花卉信息技术有限公司',
          uscc:'xsg4w7g4s',
          legalPerson:'黎黎',
          email:'1245@163.com',
          lpIdNo:'123456789123456789',
          phone:'15928676485',
          tel:'6522157',
          yunYingInfo:{
            name:'lily',
            adminIdNo:'123456789123456789',
            phone:'15928676486',
            email:'912803718@qq.com',
            idImgA:'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfb254102643571c95f247a.jpeg',
            idImgB:'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfb26f202643571c95f2480.jpg',
          },
          bankAccount:{
            compName:'果壳里',
            bankName:'中国工商银行',
            bankNo:'6228486457851264258',
          },
          fuWuHaoName:'大大大兔子',
          fuWuHaoDesc:'大大大兔子的绿植花卉',
          reqFile:'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfb196b02643571c95f2466.jpg',
          yingYeZhiZhao:'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfc758602643571c95f24ce.jpg',
          otherFiles:['https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfb1b4902643571c95f246c.jpg']
        }
      },
      hasImgList:[],//已有的其他文件
      nowImgList:[],//当次上传的文件
      dialogVisible:false,
      isCheckAdmin:false,//是否资料审核员
      userRoles:[],
      dialogData:{
        isShow:false,
        isEdit:false,
        name:''
      },
      rules:[
        {required:true,message:'必填',triigger:['blur','change']}
      ],
    }
  },
  methods: {
    //提交审核资料
    save(){
      if(!this.accountParams.dzId){
        this.$message.error('未获取到店主ID无法申请服务资料')
      }
      if(!this.$utils.PHONE_REG.test(this.accountParams.fuWuHaoRegInfo.phone) ||
         !this.$utils.PHONE_REG.test(this.accountParams.fuWuHaoRegInfo.yunYingInfo.phone)){
        this.$message.error('法人手机号或运营者手机号格式不正确')
        return false
      }
      if(!this.$utils.EMAIL_REG.test(this.accountParams.dzEmail.email) || 
         !this.$utils.EMAIL_REG.test(this.accountParams.fuWuHaoAccount.email) ||
         !this.$utils.EMAIL_REG.test(this.accountParams.fuWuHaoRegInfo.yunYingInfo.email) ||
         !this.$utils.EMAIL_REG.test(this.accountParams.fuWuHaoRegInfo.email)){
        this.$message.error('某个邮箱格式不正确')
        return false
      }
      this.accountParams.fuWuHaoRegInfo.otherFiles = this.accountParams.fuWuHaoRegInfo.otherFiles.concat(this.nowImgList)
      let params = {... this.accountParams}
      this.$refs['accountParams'].validate(valid => {
        if(valid){
          if(this.id !== ''){
            params.queryParam = this.id
            api.updateWxInfo(params).then(res => {
              if(res.code === 200){
                this.$message.success(res.msg || '提交成功')
                this.$emit('goFWInfo',true)
                this.$router.push({path:'/merchantList'})
              }
            })
          }else{
            api.setWxInfo(params).then(res => {
              if(res.code === 200){
                this.$message.success(res.msg || '提交成功')
                this.$emit('goFWInfo',true)
                this.$router.push({path:'/merchantList'})
              }
            })
          }
        }else{
          return false
        }
      })
      this.$emit('close',true)
    },
    //审核操作
    // checkInfo(type){
    //   let params = {
    //     queryParam: this.id
    //   }
    //   params.regStatus = !!type ? 3 : 7 // 3 通过, 7 不通过
    //   api.checkWxInfo(params).then(res => {
    //     if(res.code === 200){
    //       this.$message.success(res.msg || '操作成功')
    //     }
    //   })
    // },
    showAddGroup(){
      this.dialogData = {
        isShow:true,
        isEdit:false,
        name:'' 
      }
    },
    //关闭分组操作
    closeGroup(data){
      if(data){
        this.dialogData = {
          isShow:false,
          isEdit:false,
          name:''
        }
      }
    },
    //图片文件上传
    handleAvatarSuccess(type,res) {
      if(res.response.code === 200){
        let data = res.response.data
        if(type === 'idImgA'){
          this.accountParams.fuWuHaoRegInfo.yunYingInfo.idImgA = data.url
        }else if(type === 'idImgB'){
          this.accountParams.fuWuHaoRegInfo.yunYingInfo.idImgB = data.url
        }else if(type === 'reqFile'){
          this.accountParams.fuWuHaoRegInfo.reqFile = data.url
        }else if(type === 'yingYeZhiZhao'){
          this.accountParams.fuWuHaoRegInfo.yingYeZhiZhao = data.url
        }else if(type === 'otherFiles'){
          this.nowImgList.push(data.url)
        }
      }
    },
    //获取服务号资料
    getFwhXcxInfo(){
      if(this.regStatus < 2) return
      let param ={
        queryParam: this.$route.query.id
      }
      api.getFwhXcxInfo(param).then(res => {
        if(res.code === 200) {
          this.id = res.data.id
          this.accountParams = res.data
          this.accountParams.dzEmail = this.accountParams.dzEmail || {}
          this.accountParams.fuWuHaoRegInfo.yunYingInfo = this.accountParams.fuWuHaoRegInfo.yunYingInfo || {}
          this.accountParams.fuWuHaoRegInfo.bankAccount = this.accountParams.fuWuHaoRegInfo.bankAccount || {}
          this.hasImgList = this.accountParams.fuWuHaoRegInfo.otherFiles || []
        }
      })
    }
  },
  mounted() {
    // this.userRoles = JSON.parse(localStorage.getItem('roles'))
    // this.userRoles.map(m => {
    //   //资料审核员
    //   if(m.id === "5e003639306b88644a48d93e"){
    //     this.isCheckAdmin = true
    //   }else{
    //     this.isCheckAdmin = false
    //   }
    // })
  },
  watch:{
    regStatus(val){
      this.getFwhXcxInfo()
      //0 基本信息完善 1 服务号资料等待店主提交 2 服务号资料提交微信 3 服务号资料微信审核成功  
      //4小程序资料填写 5 小程序资料申请成功 6 小程序上线 7 服务号资料微信审核失败 8 小程序资料申请失败
      if(val < 3 || val === 7){
        this.statuValue = 0
      }else {
        this.statuValue = 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/.el-switch__label--right.is-active{
    color: #67C23A;
  }
  /deep/.el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height: 100px;
  }
  .my-avatar{
    width: 100px;
    height: 100px;
    margin: 10px 10px 0 0;
    border-radius: 5px;
  }
</style>
