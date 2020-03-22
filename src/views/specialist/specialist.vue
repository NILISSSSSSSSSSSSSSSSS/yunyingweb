<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='姓名'>
          <el-input v-model.trim='searchParams.name' placeholder='姓名' clearable></el-input>
        </el-form-item>
        <el-form-item label='电话'>
          <el-input v-model.trim='searchParams.phone' placeholder='电话' clearable></el-input>
        </el-form-item>
        <el-form-item label='单位'>
          <el-input v-model.trim='searchParams.company' placeholder='单位' clearable></el-input>
        </el-form-item>
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='showDialog(1)' type='primary' icon='el-icon-plus'>新增专家</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='id' label='ID' align='center' min-width="150px"></el-table-column>
        <el-table-column label='头像' align='center'>
          <template slot-scope="{row}">
            <img :src="row.avatar" v-if='row.avatar' style="max-height:55px;max-width:55px"  :alt="row.name">
          </template>
        </el-table-column>
        <el-table-column prop='name' label='姓名' align='center'></el-table-column>
        <el-table-column prop='phone' label='电话' align='center'></el-table-column>
        <el-table-column prop='company' label='单位' align='center'></el-table-column>
        <el-table-column prop='department' label='科室' align='center'></el-table-column>
        <el-table-column prop='title' label='职称' align='center'></el-table-column>
        <el-table-column prop='playNum' label='播课次数' align='center'></el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' width="170px" align='center'></el-table-column>
        <el-table-column prop='active' label='状态' align='center'>
          <template slot-scope='{row}'>
            <span :class="row.useStatus === 1 ? 'col-sucs':'col-danger'">{{row.useStatus === 1 ? '启用' : '停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='150px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button type='text' @click='showDetail(row)' size='small'>查看详情</el-button>
            <el-button type='text' @click='showDialog(row)' size='small'>编辑</el-button>
            <el-button type='text' @click='changeStatus(row)' size='small'>{{row.useStatus === 1 ? '停用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <el-dialog :visible.sync='isShowDialog' :title='dialogTitle' width='500px' :close-on-click-modal='false'>
      <el-form :model='formParams' ref='formParams' labelWidth='80px'>
        <el-form-item label='角色'>
          <el-select v-model='formParams.roleIds' disabled clearable>
            <el-option v-for='(itm,index) in rolesList' :label='itm.name' :value='itm.id' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop='name' :rules='rules' label='姓名'>
          <el-input v-model.trim='formParams.name' placeholder='姓名' clearable/>
        </el-form-item>
        <el-form-item prop='phone' :rules='rules' label='电话'>
          <el-input v-model.trim='formParams.phone' placeholder='电话' clearable/>
        </el-form-item>
        <el-form-item label='头像'>
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="formParams.avatar" :src="formParams.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="tips lh22">点击头像可重新上传您的头像</span>
        </el-form-item>
        <el-form-item label='单位'>
          <el-input v-model.trim='formParams.company' placeholder='单位' clearable/>
        </el-form-item>
        <el-form-item label='部门'>
          <el-input v-model.trim='formParams.department' placeholder='部门' clearable/>
        </el-form-item>
        <el-form-item label='职称'>
          <el-input v-model.trim='formParams.title' placeholder='职称' clearable/>
        </el-form-item>
        <el-row class="tc">
          <el-button @click='save' type='primary' icon='el-icon-check'>保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync='isShowDetail' title='专家详情' width='500px' :close-on-click-modal='false'>
      <el-form class="small-form" :model='formParams' labelWidth='80px'>
        <el-form-item label='角色：'>
          <span>专家</span>
        </el-form-item>
        <el-form-item label='姓名：'>
          <span>{{formParams.name}}</span>
        </el-form-item>
        <el-form-item label='电话：'>
          <span>{{formParams.phone}}</span>
        </el-form-item>
        <el-form-item label='头像：'>
          <img :src="formParams.avatar" class="avatar">
        </el-form-item>
        <el-form-item label='单位：'>
          <span>{{formParams.company}}</span>
        </el-form-item>
        <el-form-item label='部门：'>
          <span>{{formParams.department}}</span>
        </el-form-item>
        <el-form-item label='职称：'>
          <span>{{formParams.title}}</span>
        </el-form-item>
        <el-row class="tc">
          <el-button @click='isShowDetail=false' type='primary' icon='el-icon-close'>关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync='isShowChange' :title='statuTitle' width='500px' :close-on-click-modal='false'>
      <el-form class="small-form" :model='statuParams' labelWidth='100px'>
        <!-- <el-form-item label='状态：'>
          <el-radio-group v-model.number='statuParams.useStatus'>
            <el-radio :label='1'>启用</el-radio>
            <el-radio :label='0'>停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label='停用原因：'>
          <el-input v-model.trim='statuParams.reason' type='textarea' rows='5' />
        </el-form-item>
        <el-form-item label='截止日期：'>
          <el-date-picker v-model.trim='statuParams.t' 
          :picker-options="pickerOptions"
            type="date" 
            size='small'>
          </el-date-picker>
          <div class="tips">不传时间将默认停用一年</div>
        </el-form-item>
        <el-form-item label='强制停用：'>
          <el-radio-group v-model.number='statuParams.force'>
            <el-radio :label='0'>是</el-radio>
            <el-radio :label='1'>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='封禁账号：'>
          <el-radio-group v-model.number='statuParams.ban'>
            <el-radio :label='0'>是</el-radio>
            <el-radio :label='1'>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row class="tc">
          <el-button @click='changeStatu' type='primary' icon='el-icon-check'>提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import api from '@/servers/user'
  import apiUser from '@/servers/login'
  import config from '@/config/api'
  export default {
    data() {
      return {
        uploadUrl: config.ossUpload || '',//文件上传
        searchParams:{},//查询参数
        formParams:{
          // roleIds:'',
          avatar:'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/202002/5e4a67c502643571c95f276f.jpeg'
        },
        statuParams:{
          userId:'',
          t:'',
          useStatus:1,//更新使用状态 1：启用 2：停用
          force:1,//是否强制停用 true是   false否
          ban:1,//是否封禁账号 true 是   false 否
        },
        dataList:[],
        isShowDialog:false,
        isShowDetail:false,
        statuTitle:'',
        isShowChange:false,
        nowUserId:'',//更改状态的专家id
        id:'',
        isEdit:false,
        rolesList:[],
        dialogTitle:'新增专家',
        imageUrl:'',
        rules:[
          {required:true,message:'必填',triiger:'blur,change'}
        ],
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now() - (60000*60*24 - 1) ;
          },
        },
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    methods: {
      searchList(){
        let params = {
          ...this.searchParams,
          isall:true, //true 所有的 flse 上线的
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        api.getSpecia(params,{loading:true}).then(res => {
          if(res.code === 200){
            this.dataList = res.data.data
            this.page.total = res.data.total
          }
        })
      },
      save(){
        this.$refs['formParams'].validate(valid => {
          if(valid){
            if(!this.$utils.PHONE_REG.test(this.formParams.phone)){
              this.$message.error('手机号格式不正确')
              return false
            }
            let params = {
              roleIds: [this.formParams.roleIds],
              phone: this.formParams.phone,
              name: this.formParams.name,
              avatar: this.formParams.avatar,
              company: this.formParams.company,
              department: this.formParams.department,
              title: this.formParams.title,
            }
            if(this.isEdit){
              //编辑
              params.queryParam =  this.formParams.id
              api.editSpecia(params).then(res => {
                if(res.code === 200){
                  this.$message.success(res.msg || '编辑成功')
                  this.isShowDialog = false
                  this.resetEdit()
                  this.searchList()
                }
              })
            }else{
              //新增
              api.addSpecia(params).then(res => {
                if(res.code === 200){
                  this.$message.success(res.msg || '新增成功')
                  this.isShowDialog = false
                  this.resetEdit()
                  this.searchList()
                }
              })
            }
          }else{
            return false
          }
        })
      },
      showDialog(obj){
        this.isShowDialog = true
        this.resetEdit()
        this.getRoles()
        if(obj === 1){
          this.dialogTitle = '新增专家'
          this.isEdit = false
        }else {
          this.dialogTitle = '编辑专家'
          this.isEdit = true
          let roleIds = this.formParams.roleIds
          this.formParams = {...obj}
          this.formParams.roleIds = roleIds
        }
      },
      showDetail(row){
        this.formParams = row
        this.isShowDetail = true
      },
      changeStatus(row){
        this.nowUserId = row.userId
        this.id = row.id
        let params = {}
        //启用专家
        if(row.useStatus === 2 ){
          params = {
            queryParam: row.id,
            userId: this.nowUserId,
            useStatus: 1,
            force: false,
            ban: false
          }
          this.changeStatu(params)
        }else {//停用专家
          this.isShowChange = true
          this.statuTitle = '停用专家【' + row.name + '】'
        }
      },
      //提交状态修改
      changeStatu(params){
        if(this.isShowChange){
          let time = this.statuParams.t ? this.$utils.formatEndTime(this.statuParams.t) : null
          params = {
            queryParam: this.id,
            userId: this.nowUserId,
            reason: this.statuParams.reason,
            t: time,
            useStatus: 2,
            force: !!this.statuParams.force,
            ban: !!this.statuParams.ban
          }
        }
        api.changeSpeciaStu(params).then(res => {
          if(res.code === 200){
            this.isShowChange = false
            this.statuParams = {
              reason:'',
              t:[],
              force:1,//是否强制停用 true是   false否
              ban:1,//是否封禁账号 true 是   false 否
            }
            this.searchList()
          }
        })
      },
      reset(){
        this.searchParams = {
          name:'',
          phone:'',
          company:''
        }
        this.page = {
          pageSize:10,
          pageNumber:1,
          total:0
        }
        this.searchList()
      },  
      resetEdit(){
        this.formParams = {
          roleIds: '',
          avatar: 'https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/202002/5e4a67c502643571c95f276f.jpeg'
        }
      },
      //获取专家角色id
      getRoles(){
        apiUser.getAllRoles({size:9999}).then(res => {
          if (res.code === 200) {
            this.rolesList = res.data.data
            this.rolesList.map(m =>{
              if(m.name === '课程专家'){
                this.formParams.roleIds = m.id
              }
            })
          }
        })
      },
      handleAvatarSuccess(res, file) {
        if(res.code === 200){
          this.formParams.avatar = res.data.url
        }
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    },
    mounted(){
      this.searchList()
    }
  }
</script>

<style lang="less" scoped>

</style>