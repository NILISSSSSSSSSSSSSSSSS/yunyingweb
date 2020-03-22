<template>
  <div>
    <el-form class="normal-form2" :rules='regForm' ref='merchantParams' :model='merchant' labelWidth='85px'>
      <el-form-item prop='roleIds' label='店主角色'>
        <el-select v-model='merchant.roleIds' class="w600" size='small' disabled clearable>
          <el-option v-for='(itm,index) in rolesList' :label='itm.name' :value='itm.id' :key='index'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop='phone' label='店主电话'>
        <el-input v-model.trim='merchant.phone' placeholder='手机号' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='userName' label='姓名'>
        <el-input v-model.trim='merchant.userName' placeholder='姓名' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='shopName' label='店铺名'>
        <el-input v-model.trim='merchant.shopName' placeholder='店铺名' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item label='微信昵称'>
        <el-input v-model.trim='merchant.wxNickname' placeholder='微信昵称' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item prop='groupId' label='所属组'>
        <el-select v-model='merchant.groupId' class="w522" size='small' clearable>
          <el-option v-for='(itm,index) in groupList' :label='itm.name' :value='itm.id' :key='index'></el-option>
        </el-select>
        <el-button class="ml10" @click='showAddGroup' type='primary' size='small' plain>新增组</el-button>
      </el-form-item>
      <el-form-item label='地区'>
        <areaSelect :areaData="address" @areaData='getAreaData' size='small' />
      </el-form-item>
      <el-form-item label='地址'>
        <el-input v-model.trim='merchant.address.addr' placeholder='店铺地址' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item label='营业时间'>
        <el-input v-model.trim='merchant.businessHours' placeholder='营业时间' class="w600" size='small' clearable></el-input>
        <!-- <el-time-select placeholder="起始时间" v-model="merchant.businessHours"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '22:30'
          }">
        </el-time-select>
        <el-time-select placeholder="结束时间" v-model="merchant.endTime"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '22:30',
            minTime: merchant.businessHours
          }"> -->
        </el-time-select>
      </el-form-item>
      <el-form-item label='合伙人'>
        <el-input v-model.trim='merchant.heHuoRen.name' placeholder='合伙人' class="w600" size='small' clearable></el-input>
      </el-form-item>
      <el-form-item label='门店logo'>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="(v,res)=>handleAvatarSuccess('logo',res)">
          <img v-if="merchant.logo" :src="merchant.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='门店相册'>
        <el-upload
          ref='upload'
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="(v,res)=>handleAvatarSuccess('albumn',res)"
          :show-file-list='true'
          accept="image/*">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div v-if='hasImgList.length'>
          <el-row class="tips">现有图片:</el-row>
          <img class="my-avatar mt10 mr10" v-for="(itm,index) in hasImgList" :src="itm" :key="index">
        </div>
      </el-form-item>
      <el-form-item label='状态'>
        <el-switch v-model='merchant.useStatus' active-text='启用' active-color='#67C23A' inactive-text="停用">
        </el-switch>
      </el-form-item>
      <el-row class="bor-top tr">
        <el-button @click="save" type='primary' icon='el-icon-check'>保存</el-button>
      </el-row>
    </el-form>
    <addGroup :dialogData='dialogData' @close='closeGroup' />
  </div>
</template>

<script>
  import api from '@/servers/merchant'
  import apiUser from '@/servers/login'
  import addGroup from '@/components/merchant/addGroup'
  import areaSelect from '@/components/areaSelect.vue'
  import config from '@/config/api'
  
  export default {
    name: 'merchantInfo',
    components: {
      addGroup,
      areaSelect
    },
    props: {
      merchantParams: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        uploadUrl: config.ossUpload || '',//文件上传
        mearchantId: this.$route.query.id || '',
        merchant:{
          address:{},
          heHuoRen:{},
          roleIds:'',
          logo:'',
          shopImages:[],
          useStatus:0
        },
        roleIds:'',
        dialogVisible: false,
        dialogImageUrl: '',
        groupList: [],
        rolesList:[],//角色列表
        nowImgList:[],//当次选择图片
        hasImgList:[],//已有图片
        address:'',
        dialogData: {
          isShow: false,
          isEdit: false,
          data: {
            id: '',
            name: ''
          }
        },
        regForm: {
          roleIds: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          phone: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          groupId: [
            { required: true, message: '必填', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      save(merchantParams) {
        if(!this.$utils.PHONE_REG.test(this.merchant.phone)){
          this.$message.error('电话格式不正确')
          return false
        }
        this.$refs['merchantParams'].validate(valid => {
          if(valid){
            if(this.address){
              let ads = this.address.split('/')
              this.merchant.address.province = ads[0] || ''
              this.merchant.address.city = ads[1] || ''
              this.merchant.address.district = ads[2] || ''
            }
            this.merchant.shopImages = this.merchant.shopImages.concat(this.nowImgList)
            let params = {... this.merchant}
            params.roleIds = [this.roleIds]
            params.useStatus = this.merchant.useStatus ? 1 : 0
            if(this.mearchantId){
              params.queryParam = this.mearchantId
              api.editMerchant(params).then(res => {
                if(res.code === 200) {
                  this.$message.success(res.msg || '更新成功')
                  this.$router.push({path:'/merchantList'})
                }
              })
            }else{
              api.addMerchant(params).then(res => {
                if(res.code === 200) {
                  this.$message.success(res.msg || '新增成功')
                  this.$router.push({path:'/merchantList'})
                }
              })
            }
            
          }else {
            return false
          }
        })
        this.$emit('close', true)
      },
      getAreaData(ads) {
        this.address = ads
      },
      showAddGroup() {
        this.dialogData = {
          isShow: true,
          isEdit: false,
          data: {
            id: '',
            name: ''
          }
        }
      },
      //关闭分组操作
      closeGroup(data) {
        if (data) {
          this.dialogData = {
            isShow: false,
            isEdit: false,
            data: {
              id: '',
              name: ''
            }
          }
          this.getGroup()
        }
      },
      handleAvatarSuccess(type,res) {
        let data = res.response
        if(data.code === 200){
          if(type === 'logo'){
            this.merchant.logo = data.data.url
          }else if(type === 'albumn'){
            this.nowImgList.push(data.data.url)
          }
        }else{
          this.$message.error(data.msg || '上传失败')
        }
      },
      //获取分组
      getGroup() {
        let params = {
          page: 1,
          size: 10000000
        }
        api.getGroup(params).then(res => {
          if (res.code === 200) {
            this.groupList = res.data.data
          }
        })
      },
      //获取店主角色id
      getRoles(){
        apiUser.getAllRoles({size:9999}).then(res => {
          if (res.code === 200) {
            this.rolesList = res.data.data
            this.rolesList.map(m =>{
              if(m.name === '课程专家'){
                this.roleIds = m.id
                this.merchant.roleIds = this.roleIds
              }
            })
          }
        })
      },
      //获取店主信息
      getMechantInfo(){
        if(this.mearchantId === '') return
        let params = {
          queryParam: this.mearchantId
        }
        api.getMerchantInfo(params).then(res => {
          if(res.code === 200){
            this.merchant = res.data
            this.merchant.roleIds = this.roleIds
            this.merchant.address = this.merchant.address || {}
            this.merchant.heHuoRen = this.merchant.heHuoRen || {}
            this.address = res.data.address.hasOwnProperty('province') ? 
                          res.data.address.province + '/'+ res.data.address.city + '/'+res.data.address.district : ''
            this.hasImgList = this.merchant.shopImages
            this.merchant.useStatus = this.merchant.useStatus ? true : false
            this.$emit('getRegStatus',res.data.regStatus)
          }
        })
      }
    },
    mounted() {
      this.getMechantInfo()
      this.getGroup()
      this.getRoles()
    },
    watch: {
      mearchantId(val,oldVal) {
        if(val===''){
          this.merchantParams = {
            useStatus:1,
            address:{},
            heHuoRen:{},
            logo:'',
            roleIds: this.roleIds,//默认店主角色 不可删
          } 
        }else{
          this.getMechantInfo()
          this.merchantParams.logo = ''
          this.merchant = {... this.merchantParams}
          this.merchant.roleIds = this.roleIds
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-switch__label--right.is-active {
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