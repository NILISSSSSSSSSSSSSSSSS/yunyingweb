<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='标题'>
          <el-input v-model.trim='searchParams.title' placeholder='标题' clearable></el-input>
        </el-form-item>
        <el-form-item label='主讲专家'>
          <el-select v-model='searchParams.doctorid' clearable>
            <el-option v-for='(item,index) in speciaList' :label='item.name' :value='item.id' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='创建时间'>
          <el-date-picker v-model.trim='searchParams.time' 
            type="daterange" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-form-item label='状态'>
            <el-select v-model='searchParams.status' clearable>
              <el-option v-for='(itm,index) in statusList' :label='itm.name' :value='itm.value' :key='index'></el-option>
            </el-select>
          </el-form-item>
          <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
          <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
          <el-button @click='goAddPage(1)' type='primary' icon='el-icon-plus'>新增课件</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='id' label='ID' align='center' min-width="150px"></el-table-column>
        <el-table-column prop='title' label='标题' align='center' min-width="200px"></el-table-column>
        <el-table-column prop='subTitle' label='描述' align='center' min-width="200px"></el-table-column>
        <!-- <el-table-column prop='id' label='类别' align='center'></el-table-column> -->
        <el-table-column label='主讲专家' align='center'>
          <template slot-scope='{row}'>
            <el-tooltip content="点击查看专家详情" placement="right" effect="light">
              <el-button  @click='showDoctor(row.doctor)' type='text' size='small'>&nbsp;{{row.doctor ? row.doctor.name :''}}&nbsp;</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label='课件条数' align='center'>
          <template slot-scope='{row}'>
            <span>{{row.items ? row.items.length : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='textlength' label='文本' align='center'></el-table-column>
        <el-table-column prop='imglength' label='图片' align='center'>
          <!-- <template slot-scope='{row}'>
            <img v-if='row.headImg' :src="row.headImg" style="width:50px;max-height:80px" alt="">
          </template> -->
        </el-table-column>
        <el-table-column prop='voicelength' label='音频' align='center'></el-table-column>
        <el-table-column prop='videolength' label='视频' align='center'></el-table-column>
        <el-table-column prop='voicetime' label='音频时长' align='center'>
          <template slot-scope="{row}">
            <span :class="!row.voicetime ? 'col-gray' : ''">{{row.voicetime / 1000 | TimestampToTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
        <el-table-column prop='updateT.humanTime' label='更新时间' align='center' width='170px'></el-table-column>
        <el-table-column prop='' label='状态' align='center'>
          <template slot-scope='{row}'>
            <span :class="row.status === 'ONLINE' ? 'col-sucs':'col-danger'">{{row.status | courseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='190px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button @click='goAddPage(row.id)' type='text' size='small'>编辑</el-button>
            <el-button @click='showDetail(row)' type='text' size='small'>查看详情</el-button>
            <el-button @click='changeStop(row,row.status)' type='text'>{{row.status === 'ONLINE' ? '下线' : '上线'}}</el-button>
            <el-button @click='changeStop(row,"DELETE")' type='text' size='small'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <!-- 专家信息弹框 -->
    <el-dialog :visible.sync='isShowUser' title='专家信息' width='500px'>
      <el-form :model='doctorForm' class="small-form" labelWidth='100px'>
        <el-form-item label='姓名：'>
          <span>{{doctorForm.name}}老师</span>
        </el-form-item>
        <el-form-item label='电话：'>
          <span>{{doctorForm.phone}}</span>
        </el-form-item>
        <el-form-item label='头像：'>
          <el-avatar :size="30" :src="doctorForm.avatar"></el-avatar>
        </el-form-item>
        <el-form-item label='单位：'>
          <span>{{doctorForm.company}}</span>
        </el-form-item>
        <el-form-item label='部门：'>
          <span>{{doctorForm.department}}</span>
        </el-form-item>
        <el-form-item label='职称：'>
          <span>{{doctorForm.title}}</span>
        </el-form-item>
        <el-form-item label='创建时间：'>
          <span>{{doctorForm.createT.humanTime}}</span>
        </el-form-item>
      </el-form>
      <el-row class="tc">
        <el-button @click='isShowUser=false' type='primary' size='small'>关闭</el-button>
      </el-row>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :visible.sync='isShowDetail' title='课件详情' width='700px' :before-close="beforeCloseDetail">
      <el-form :model='detailForm' class="small-form" labelWidth='100px'>
        <el-form-item label='标题：'>
          <span>{{detailForm.title}}</span>
        </el-form-item>
        <el-form-item label='描述：'>
          <span>{{detailForm.subTitle}}</span>
        </el-form-item>
        <el-row>
          <el-col :span='12'>
            <el-form-item label='专家：'>
              <el-avatar :size="30" :src="detailForm.doctor.avatar" style="vertical-align: middle"></el-avatar>
              <span class="ml10">{{detailForm.doctor.name}}老师</span>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='状态：'>
              <span :class="detailForm.status==='ONLINE' ? 'col-sucs':'col-danger'">{{detailForm.status | courseStatus}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label='封面图：'>
              <img :src="detailForm.headImg" style="width:200px;max-height:120px">
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='轮播图：'>
              <el-carousel :interval="3000" arrow="always" width='200px'>
                <el-carousel-item v-for="(item,index) in detailForm.rollImgs" :key="index">
                  <img :src="item" class="w100">
                </el-carousel-item>
              </el-carousel>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label='创建时间：'>
          <span>{{detailForm.createT.humanTime}}</span>
        </el-form-item>
      </el-form>
      <el-table :data='detailForm.items' class="mb20" border stripe>
        <el-table-column label='类型' prop='type' width='100px' align='center'>
          <template slot-scope='{row}'>
            <span>{{row.type | courseType}}</span>
          </template>
        </el-table-column>
        <el-table-column label='内容' prop='content' align='center' min-width="300px">
          <template slot-scope='{row}'>
            <span v-if="row.type=='TEXT'">{{row.content}}</span>
            <img v-if="row.type=='IMAGE'" :src="row.content" class="tabImg">
            <audio v-else-if='row.type === "VOICE"' :src="row.content" style="width:260px" controls></audio>
            <video v-else-if='row.type === "VIDEO"' :src="row.content" style="width:180px" controls></video>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="tc">
        <el-button @click='beforeCloseDetail' type='primary' size='small'>关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/course'
  import user from '@/servers/user'
  const config = require('@/config/config')
  
  export default {
    data() {
      return {
        searchParams:{},//查询参数
        dataList:[],
        speciaList:[],
        statusList:config.status,
        isShowUser:false,
        isShowDetail:false,
        doctorForm:{
          createT:{}
        },
        detailForm:{
          createT:{},
          doctor:{}
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
        let time = this.searchParams.time || [],
        params = {
          ...this.searchParams,
          st: time.length ? (new Date(time[0]).getTime())/1000 : '',
          et: time.length ? this.$utils.formatEndTime(time[1]) : '',
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        delete params.time
        api.getCourse(params).then(res => {
          if(res.code === 200){
            this.dataList = res.data.data
            let voiceList = []
            this.dataList.map(m => {
              m.textlength = (_.filter(m.items,['type','TEXT'])).length || 0
              m.imglength = (_.filter(m.items,['type','IMAGE'])).length || 0
              m.videolength = (_.filter(m.items,['type','VIDEO'])).length || 0
              voiceList = _.filter(m.items,['type','VOICE'])
              m.voicelength = voiceList.length || 0
              m.voicetime = 0
              voiceList.map(n => {
                m.voicetime += n.length
              })
            })
            this.page.total = res.data.total
          }
        })
      },
      goAddPage(id){
        if(id !== 1){
          this.$router.push({
            path: '/coursewareAdd',
            query:{
              id: id
            }
          })
        }else{
          this.$router.push({
            path:'/coursewareAdd'
          })
        }
        
      },
      //停用
      changeStop(row,type){
        if(type === 'ONLINE'){
          type = 'OFFLINE'
        }else if(type ==='OFFLINE'){
          type = 'ONLINE'
        }else{
          type = 'DELETE'
        }
        let params = {
          queryParam:row.id,
          status:type
        }
        if(type === 'DELETE'){
          this.$confirm(`确定删除课件【${row.title}】`,'提示',{
            confirmButtonText:'删除',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            this.changeStatus(params)
          }).catch(()=>{
            this.$message.info('已取消')
          })
        }else{
          this.changeStatus(params)
        }
      },
      //状态更改请求
      changeStatus(params){
        api.changeCourseStu(params).then(res => {
          if(res.code === 200){
            this.searchList()
          }
        })
      },
      //专家信息展示
      showDoctor(doctor){
        this.isShowUser = true
        this.doctorForm = {
          createT:{}
        }
        this.doctorForm = doctor
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
      //课件详情
      showDetail(row){
        this.detailForm = row
        this.isShowDetail = true
      },
      beforeCloseDetail(){
        this.isShowDetail=false
        this.detailForm = {
          createT:{},
          doctor:{}
        }
      },
      reset(){
        this.searchParams = {
          title: '',
          doctorid: '',
          time: [],
          status: '',
        }
        this.searchList()
      },
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    },
    mounted(){
      this.searchList()
      this.searchSpecia()
    }
  }
</script>

<style lang="less" scoped>
  .headImg{
    max-width: 100px;
    max-height: 120px;
    border: 1px dashed #eee;
  }
  .el-carousel--horizontal{
    width: 200px;
    max-height: 120px;
    overflow: hidden;
    border: 1px dashed #eee;
  }
  /deep/.el-carousel__indicator--horizontal{
    padding: 0px!important;
  }
  /deep/.el-carousel__button{
    border-radius: 50%;
    width: 5px;
    height: 5px;
    margin: 2px;
    background: #F13877;
    opacity: .2;
  }
  /deep/.el-carousel__indicator--horizontal.is-active{
    opacity: 1;
  }
</style>