<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='店主电话'>
          <el-input v-model.trim='searchParams.phone' placeholder='店主电话' clearable></el-input>
        </el-form-item>
        <el-form-item label='店铺名'>
          <el-input v-model.trim='searchParams.shopName' placeholder='店铺名' clearable></el-input>
        </el-form-item>
        <el-form-item label='创建时间'>
          <el-date-picker v-model.trim='searchParams.time' 
            type="daterange" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='所属组'>
          <el-select v-model='searchParams.groupId' clearable>
            <el-option v-for='(itm,index) in groupList' :label='itm.name' :value='itm.id' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='省份'>
          <el-select v-model='searchParams.address' clearable>
            <el-option v-for='(itm,index) in proviceList' :label='itm.name' :value='itm.name' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label='推荐人'>
          <el-select v-model='searchParams.user' clearable>
            <el-option v-for='n in 3' :label='n' :value='n'></el-option>
          </el-select>
        </el-form-item> -->
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='goAddPage(1)' type='primary' icon='el-icon-plus'>新增店主</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='phone' label='店主电话' align='center' width='120px'></el-table-column>
        <el-table-column prop='userName' label='姓名' align='center'></el-table-column>
        <el-table-column prop='shopName' label='店铺名' align='center'></el-table-column>
        <el-table-column prop='businessHours' label='营业时间' align='center'></el-table-column>
        <el-table-column prop='group.name' label='所属组' align='center'></el-table-column>
        <el-table-column label='地址' align='center' width='250px'>
          <template slot-scope='{row}'>
            <span>{{row.address ? (row.address.province + row.address.city + row.address.district + row.address.addr ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop='heHuoRen.name' label='合伙人' align='center'></el-table-column>
        <el-table-column prop='' label='开课次数' align='center'></el-table-column>
        <el-table-column prop='group.name' label='听课人数' align='center'></el-table-column>
        <el-table-column prop='' label='店主状态' align='center' width='80px'>
          <template slot-scope='{row}'>
            <span :class="row.useStatus === 1 ? 'col-sucs':'col-danger'">{{row.useStatus === 1 ? '启用' : '停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='xiaoChengXuKey.appId' label='小程序' align='center'></el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
        <el-table-column label='操作' width='260px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button type='text' @click='goAddPage(2,row)' size='small'>编辑</el-button>
            <el-button type='text' @click='courseList(row)' size='small'>播课记录</el-button>
            <el-button type='text' @click='userList(row)' size='small'>用户列表</el-button>
            <el-button type='text' @click='showMiniProgram(row)' size='small'>小程序</el-button>
            <!-- <el-button type='text' size='small'>去审核</el-button> 管理员操作 -->
            <el-button type='text' @click='showChange(row)'>{{row.useStatus === 1 ? '停用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <!-- 停启用 -->
    <el-dialog :visible.sync='isShowChange' :title='statuTitle' width='500px' :close-on-click-modal='false'>
      <el-form class="small-form" :model='statuParams' labelWidth='100px'>
        <!-- <el-form-item label='状态：'>
          <el-radio-group v-model.number='statuParams.useStatus'>
            <el-radio :label='1'>启用</el-radio>
            <el-radio :label='0'>停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label='停用原因：'>
          <el-input v-model='statuParams.reason' type='textarea' rows='5' />
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
    <el-dialog :visible.sync='isShowMiniProgram' title="小程序信息" width='500px'>
      <el-form class="small-form" labelWidth='100px'>
        <el-form-item label='店主姓名：'>
            <span>{{miniProgram.userName}}</span>
          </el-form-item>
        <el-form-item label='小程序名称：'>
          <span>{{miniProgram.shopName}}</span>
        </el-form-item>
        <el-form-item label='AppId：'>
          <span>{{miniProgram.appId}}</span>
        </el-form-item>
        <el-form-item label='Secret：'>
          <span>{{miniProgram.secret}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/merchant'
  const city =  require('@/config/city').default.city
  export default {
    data() {
      return {
        id:'',
        searchParams:{},//查询参数
        dataList:[],
        groupList:[],//分组列表
        proviceList: city,
        isShowMiniProgram:false,
        isShowChange:false,
        miniProgram:{},
        nowUserId:'',
        statuTitle:'',
        statuParams:{
          userId:'',
          t:'',
          useStatus:2,//更新使用状态 1：启用 2：停用
          force:1,//是否强制停用 true是   false否
          ban:1,//是否封禁账号 true 是   false 否
        },
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
        let time = this.searchParams.time || []
        let params = {
          ... this.searchParams,
          st: time.length ? (new Date(time[0]).getTime())/1000 : '',
          et: time.length ? this.$utils.formatEndTime(time[1]) : '',
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        delete params.time
        api.getMerchant(params).then(res => {
          if(res.code === 200){
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
        })
      },
      goAddPage(type,row){
        if(type === 1){
          this.$router.push({
            path:'/addMerchant'
          })
        }else{
          this.$router.push({
            path:'/addMerchant',
            query:{id:row.id}
          })
        }
      },
      courseList(row){
        this.$router.push({
          path:'/playRecord',
          query:{
            id: row.id
          }
        })
      },
      userList(row){
        this.$router.push({
          path:'/userList',
          query:{
            id: row.id
          }
        })
      },
      showMiniProgram(row){
        this.miniProgram = {}
        this.isShowMiniProgram = true
        this.miniProgram = {
          userName: row.userName,
          shopName: row.shopName,
          appId: row.xiaoChengXuKey ? row.xiaoChengXuKey[0].appId : '暂无appId',
          secret: row.xiaoChengXuKey ? row.xiaoChengXuKey[0].secret : '暂无secret'
        }
      },
      //停启用弹框控制
      showChange(row){
        let params = {}
        this.nowUserId = row.userId
        this.id = row.id
        //   console.log(row,row.userId,this.nowUserId);
        // return
        if(row.useStatus === 2){
          params = {
            queryParam: this.id,
            userId: this.nowUserId,
            useStatus: 1,
            force: false,
            ban: false
          }
          this.changeStatu(params)
        }else{
          this.isShowChange = true
          this.statuTitle = '停用店主【' + row.userName + '】'
        }
      },
      //停用启用
      changeStatu(params){
        
        //启用
        if(!this.isShowChange){
          api.changeMerchantStu(params).then(res => {
            if(res.code === 200){
              this.$message.success(res.msg || '操作成功')
              this.isShowChange = false
              this.searchList()
            }
          })
        }else{
          //停用
          this.$confirm('请先停用店主服务号及小程序后，再点击立即停用','提示',{
            confirmButtonText:'立即停用',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            let time = this.statuParams.t ? this.$utils.formatEndTime(this.statuParams.t) : null,
            p = {
              queryParam: this.id,
              userId: this.nowUserId,
              reason: this.statuParams.reason,
              t: time,
              useStatus: 2,
              force: !!this.statuParams.force,
              ban: !!this.statuParams.ban
            }
            api.changeMerchantStu(p).then(res => {
              if(res.code === 200){
                this.$message.success(res.msg || '操作成功')
                this.isShowChange = false
                this.searchList()
              }
            })
          }).catch(()=>{
            this.$message.info('已取消')
          })
        }
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      },
      reset(){
        this.searchParams = {}
        this.page = {
          pageNumber:1,
          pageSize:10,
          total:0
        }
        this.searchList()
      },
      //获取分组
      getGroup(){
        let params = {
          page:1,
          size:10000000
        }
        api.getGroup(params).then(res => {
          if(res.code === 200){
            this.groupList = res.data.data
          }
        })
      }
    },
    mounted(){
      this.getGroup()
      this.searchList()
      
    }
  }
</script>

<style lang="less" scoped>

</style>