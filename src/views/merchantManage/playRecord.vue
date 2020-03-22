<template>
    <div>
      <!-- 基本信息 -->
      <el-card>
        <el-collapse v-model="isShowMore">
          <el-collapse-item :title="merchant.phone +' 【' + merchant.userName + '/' + merchant.shopName + '/'+ merchant.group.name +'】'" name="1">
            <el-form class="small-form" labelWidth='100px' inline>
              <el-form-item label='店主电话:'>{{merchant.phone}}</el-form-item>
              <el-form-item label='姓名:'>{{merchant.userName}}</el-form-item>
              <el-form-item label='店铺名:'>{{merchant.shopName}}</el-form-item>
              <el-form-item label='所属组:'>{{merchant.group.name}}</el-form-item>
              <el-form-item label='微信昵称:'>{{merchant.wxNickname}}</el-form-item>
              <el-form-item label='地区:'>{{merchant.address.province}} {{merchant.address.city}} {{merchant.address.district}}</el-form-item>
              <el-form-item label='地址:'>{{merchant.address.addr}}</el-form-item>
              <el-form-item label='合伙人:'>{{merchant.heHuoRen.name || '无'}}</el-form-item>
              <el-form-item label='状态:'>{{merchant.useStatus ? '有效' : '失效'}}</el-form-item>
              <el-form-item label='创建时间:'>{{merchant.createT.humanTime}}</el-form-item>
              <el-form-item label='停用时间:'></el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <!-- 查询条件 -->
      <el-card class="mt20 mb20">
        <el-form :model='searchParams' inline labelWidth='80px'>
          <el-form-item label='课程名称'>
            <el-input v-model.trim='searchParams.name' placeholder='课程名称' clearable></el-input>
          </el-form-item>
          <el-form-item label='主讲专家'>
            <el-select v-model='searchParams.doctorId' clearable>
              <el-option v-for='(item,index) in speciaList' :label='item.name' :value='item.id' :key='index'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='开课时间'>
            <el-date-picker v-model.trim='searchParams.time' 
              type="daterange" 
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-button type='primary' icon='el-icon-search'>搜索</el-button>
          <el-button type='info' icon='el-icon-s-tools'>重置</el-button>
        </el-form>
      </el-card>
      <!-- 查询结果 -->
      <el-card>
        <el-table :data='dataList' border stripe>
          <el-table-column prop='keCheng.name' label='课程名称' align='center'></el-table-column>
          <el-table-column prop='keCheng.textDesc' label='描述' align='center'></el-table-column>
          <el-table-column prop='keCheng.doctor.name' label='主讲专家' align='center'></el-table-column>
          <el-table-column prop='keCheng.keChengItems.length' label='课件条数' align='center'></el-table-column>
          <el-table-column prop='num' label='报名人数' align='center'>
            <template slot-scope='{row}'>
              <el-tooltip content="点击数字查看明细" placement="right" effect="light">
                <el-button  @click='isShowUser = true' type='text' size='small'>&nbsp;{{row.num}}&nbsp;</el-button>
              </el-tooltip>
              <!-- <el-link  type="success" underline>{{row.id}}</el-link> -->
            </template>
          </el-table-column>
          <el-table-column label='听课人数' align='center'>
            <template slot-scope='{row}'>
              <el-tooltip content="点击数字查看明细" placement="right" effect="light">
                <el-button  @click='isShowUser = true' type='text' size='small'>&nbsp;{{row.id}}&nbsp;</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop='id' label='互动条数' align='center'></el-table-column>
          <el-table-column label='开课时间' align='center'>
            <template slot-scope="{row}">
              <span>{{row.keCheng.startTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='status' label='状态' align='center'>
            <template slot-scope="{row}">
              <span>{{row.status | liveStatus}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageLimit='page' @change='pageChange(1)'/>
      </el-card>
      <!-- 用报名人数、听课人数列表弹框 -->
      <el-dialog :visible.sync='isShowUser' title='课程名称'>
        <el-table :data='dataList' border stripe>
          <el-table-column prop='id' label='ID' align='center'></el-table-column>
          <el-table-column prop='name' label='昵称' align='center'></el-table-column>
          <el-table-column prop='id' label='听课次数' align='center'></el-table-column>
          <el-table-column prop='name' label='累计听课时长' align='center'></el-table-column>
          <el-table-column prop='name' label='互动条数' align='center'></el-table-column>
          <el-table-column prop='name' label='首次参与时间' align='center'></el-table-column>
        </el-table>
        <pagination :pageLimit='userPage' @change='pageChange(2)'></pagination>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import user from '@/servers/user'
    import api from '@/servers/merchant'
    export default {
      components:{
      },
      data() {
        return {
          id: this.$route.query.id,//店主id
          speciaList:[],
          merchant:{
            group:{},
            address:{},
            heHuoRen:{},
            createT:{}
          },//店主基本信息
          searchParams:{
            time:[]
          },//查询参数
          dataList:[],
          isShowMore:'1',//是否展示更多信息
          page:{
            pageSize:10,
            pageNumber:1,
            total:0
          },
          isShowUser:false,//用户信息弹框
          userPage:{
            pageSize:10,
            pageNumber:1,
            total:0
          }
        };
      },
      methods: {
        searchList(){
          let time = this.searchParams.time || [],
              param = {
                queryParam: this.id,
                name: this.searchParams.name,
                doctorId: this.searchParams.doctorId,
                st: time.length ? (new Date(time[0]).getTime())/1000 : '',
                et: time.length ? this.$utils.formatEndTime(time[1]) : '',
                page: this.page.pageNumber,
                size: this.page.pageSize,
              }
          api.dzClass(param).then(res => {
            if(res.code === 200){
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
          })
        },
        //获取店主信息
        getMechantInfo(){
          if(this.id === '') return
          let params = {
            queryParam: this.id
          }
          api.getMerchantInfo(params).then(res => {
            if(res.code === 200){
              this.merchant = res.data
              this.merchant.address = this.merchant.address || {}
              this.merchant.heHuoRen = this.merchant.heHuoRen || {}
            }
          })
        },
        //专家
        searchSpecia(){
          let params = {
            page: 1,
            size: 10000000
          }
          user.getSpecia(params).then(res => {
            if(res.code === 200){
              this.speciaList = res.data.data
            }
          })
        },
        // 分页
        pageChange(type,pageSize,pageNumber){
          // type: 1 组 ,2 门店
          if(type === 1 ){ 
            this.page.pageSize = pageSize
            this.page.pageNumber = pageNumber
            this.searchList() //组刷新
          }else if(type === 2){
            this.userPage.pageSize = pageSize
            this.userPage.pageNumber = pageNumber
            this.searchList() //门店列表刷新
          }
        }
      },
      mounted(){
        this.getMechantInfo()
        this.searchList()
        this.searchSpecia()
      }
    }
  </script>
  
  <style lang="less" scoped>
    /deep/.el-collapse,.el-collapse-item__header,/deep/.el-collapse-item__wrap{
      border: 0px!important;
    }
    /deep/.el-collapse-item__header{
      font-weight: bold!important;
    }
    .el-form-item{
      min-width: 200px;
    }
    /deep/.el-form-item__label{
      color: #909399;
    }
  </style>