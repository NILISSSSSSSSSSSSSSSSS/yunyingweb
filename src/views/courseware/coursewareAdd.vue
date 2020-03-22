<template>
  <div>
    <el-card class="">
      <el-tabs class="my-tabs" v-model="activeName" :stretch='true'>
        <el-tab-pane label="基本信息" name="first">
          <el-form class="normal-form" :model='formParams' labelWidth='120px'>
            <el-form-item label='标题'>
              <el-input v-model.trim='formParams.title' placeholder='标题' class="w600" size='small' clearable></el-input>
            </el-form-item>
            <el-form-item label='描述'>
              <el-input v-model='formParams.subTitle' type='textarea' placeholder='描述' class="w600" size='small' clearable></el-input>
            </el-form-item>
            <el-form-item label='上传封面图片'>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                accept="image/*"
                :on-success="(v,res)=>handleAvatarSuccess('fm',res)">
                <img v-if="formParams.headImg" :src="formParams.headImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label='上传详情图片'>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                accept="image/*"
                :on-success="(v,res)=>handleAvatarSuccess('desc',res)">
                <img v-if="formParams.imgDesc" :src="formParams.imgDesc" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label='上传轮播图'>
              <el-upload
                ref='upload'
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="(v,res)=>handleAvatarSuccess('banner',res)"
                :show-file-list='true'
                accept="image/*">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div v-if='hasImgList.length'>
                <el-row class="tips">现有图片:</el-row>
                <img class="my-avatar mt10 mr10" v-for="(itm,index) in hasImgList" :src="itm" :key="index">
              </div>
            </el-form-item>
            <el-form-item label='开课专家'>
              <el-button @click='dialogSpecialData.isShow = true' type="success" size='small'>选择开课专家</el-button>
              <div v-if='doctor.id' class="tips">已选专家：</div>
              <el-card v-if='doctor.id' class="doctor" style="width: 400px;">
                <el-row :gutter='10'>
                  <el-col :span='5'>
                    <img class="tx-avatar" v-if='doctor.avatar' :src='doctor.avatar' />
                  </el-col>
                  <el-col :span='17'>
                    <div>姓名：{{doctor.name}}</div>
                    <div>医院：{{doctor.company}}</div>
                    <div>电话：{{doctor.phone}}</div>
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
          </el-form>
          <el-row class="bor-top tr">
            <el-button type='warning' @click="saveInfo">↓保存，去下一步</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="课件列表" name="second">
          <el-row class="mb20">
            <el-button @click='dialogWordData.isShow=true' type='primary' plain>上传文字</el-button>
            <el-button @click='dialogImgData.isShow=true' type='primary' plain>上传图片/音频/视频</el-button>
            <el-button @click='deleteMore' type='info' plain>删除所选</el-button>
            <span class="tips">表格可拖动排序 ↓ 排序后点击右下角保存排序</span>
          </el-row>
          <el-table :data='courseList' border stripe row-key="id" @selection-change='getNowRow'>
            <el-table-column type='selection' align='center'></el-table-column>
            <el-table-column type='index' label='编号' align='center' width='60px'></el-table-column>
            <el-table-column prop='title' label='文件名' align='center'></el-table-column>
            <el-table-column type='type' label='类型' align='center' width="100px">
              <template slot-scope='{row}'>
                <div>{{row.type | courseType}}</div>
              </template>
            </el-table-column>
            <el-table-column type='content' label='内容' align='center' min-width="300px">
              <template slot-scope='{row}'>
                <img style="max-width: 100px;max-height:50px" v-if='row.type === "IMAGE"' :src="row.content" alt="">
                <div v-else-if='row.type === "TEXT"'>{{row.content}}</div>
                <audio v-else-if='row.type === "VOICE"' :src="row.content" style="width:260px" controls></audio>
                <video v-else-if='row.type === "VIDEO"' :src="row.content" style="width:180px" controls></video>
              </template>
            </el-table-column>
            <el-table-column label='操作' align='center' width="100px">
              <template slot-scope='{$index}'>
                <el-button @click='deleteRows($index)' type='text'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="mt20 ft12">共{{courseList.length}}条</el-row>
          <el-row class="bor-top tr">
            <el-button type='warning' @click="activeName='first'">↑ 基本信息</el-button>
            <el-button @click='saveSort' type='primary'>保存排序</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <chooseSpecial :dialogData='dialogSpecialData' @saveSpecia='saveSpecia'/>
    <addWord :dialogData='dialogWordData' :itemId='courseId' @closeWord='closeWord'/>
    <addImg :dialogData='dialogImgData' :itemId='courseId' @closeImg='closeWord'/>
  </div>
</template>

<script>
  import chooseSpecial from '@/components/courseware/chooseSpecialist' //选择专家
  import addWord from '@/components/courseware/addWord' //输入文字弹框
  import addImg from '@/components/courseware/addImg' //上传图片弹框
  import Sortable from 'sortablejs'
  import api from '@/servers/course'
  import config from '@/config/api'
  export default {
    components:{
      chooseSpecial,
      addWord,
      addImg
    },
    data() {
      return {
        uploadUrl: config.ossUpload || '',//文件上传
        courseId: this.$route.query.id || '',
        formParams:{
          headImg:'',
          imgDesc:'',
          rollImgs:[]
        },//查询参数
        hasImgList:[],
        nowImgList:[],
        doctor:{},//当前医生
        activeName:'first',
        courseList: [],//课件列表
        nowCourseList:[],//更新操作时的课件列表
        selectedList:[],//已选课件列表
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        },
        dialogSpecialData:{
          isShow:false
        },//选择专家
        dialogWordData:{
          isShow:false,
          courseList:this.courseList
        },//添加文字
        dialogImgData:{
          isShow:false,
          courseList:this.courseList
        },
      };
    },
    methods: {
      //保存基本信息
      saveInfo(){
        if(!this.formParams.title || !this.doctor.id){
          this.$message.error('课件标题和专家不能为空~')
          return false
        }
        this.formParams.rollImgs = this.nowImgList.concat(this.hasImgList)
        let params = {
          ... this.formParams,
          doctorId: this.doctor.id,
        }
        if(this.courseId){
          params.queryParam = this.courseId
          api.editCourse(params).then(res => {
            if(res.code === 200){
              this.$message.success(res.msg || '保存信息成功~')
              this.getDetail()
              this.activeName='second'
            }
          })
        }else{
          api.addCourse(params).then(res => {
            if(res.code === 200){
              this.$message.success(res.msg || '保存信息成功~')
              this.courseId = res.data.id 
              this.getDetail()
              this.activeName='second'
            }
          })
        }
      },
      //批量删除课件
      deleteMore(){
        if(!this.selectedList.length){
          this.$message.error('还未选择课件无法删除')
          return false
        }
        this.updateCourse()
      },
      //删除课件
      deleteRows(index){
        this.$confirm('确定删除编号为【'+ (index + 1) +'】的课件？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.nowCourseList.splice(index,1)
          this.updateCourse()
        }).catch(()=>{
          this.$message.info('已取消')
        })
      },
      //更新课件内容列表
      updateCourse(){
        // if(!this.nowCourseList.length){
        //   this.$message.error('还未选择课件无法删除')
        //   return false
        // }
        let data = [],
            params = {}
        data = data.concat(this.nowCourseList)
        data.queryParam = this.courseId
        api.courseItem(data).then(res => {
          if(res.code === 200){
            this.$message.success(res.msg || '更新课件成功')
            this.getDetail()
          }
        })
      },
      saveSpecia(doctor){
        if(doctor){
          this.doctor = doctor
        }
      },
      //获取选中的行
      getNowRow(val){
        // _.differenceWith(array, [values], [comparator])
        //------------------原课程，选中课程，全比较 
        let list = this._.differenceWith(this.courseList,val,_.isEqual)
        this.selectedList = [...val]
        this.nowCourseList = [...list]
        
      },
      //图片文件上传
      handleAvatarSuccess(type,res) {
        if(res.response.code === 200){
          let data = res.response.data
          if(type === 'fm'){
            this.formParams.headImg = data.url
          }else if(type === 'desc'){
            this.formParams.imgDesc = data.url
          }else if(type === 'banner'){
            this.nowImgList.push(data.url)
          }
        }
      },
      //关闭文字上传弹框
      closeWord(res){
        if(res){
          this.getDetail()
        }
      },
      //保存排序
      saveSort(){
        this.nowCourseList = [...this.courseList]
        this.updateCourse()
        this.$router.push('/coursewareBase')
      },
      //拖拽
      drag() {
        const tbody = document.querySelector('.el-table__body-wrapper tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.courseList.splice(oldIndex, 1)[0]
            _this.courseList.splice(newIndex, 0, currRow)
          }
        })
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      },
      //课件详情
      getDetail(){
      if(this.courseId === '') return
        let param ={
          queryParam: this.courseId
        }
        api.courseDetail(param).then(res => {
          if(res.code === 200){
            this.courseList = []
            let data = res.data
            delete data.createT
            delete data.updateT
            this.hasImgList = data.rollImgs
            delete data.rollImgs
            this.formParams = { ... data }
            this.doctor = data.doctor
            res.data.items.map(m => {
              this.courseList.push({
                id: m.id,
                content: m.content,
                title: m.title,
                length: m.length,
                type: m.type
              })
            })
            this.dialogWordData.courseList = [...this.courseList]
            this.dialogImgData.courseList = [...this.courseList]
            this.nowCourseList = [...this.courseList]
          }
        })
      }
    },
    mounted(){
      this.drag()
      this.getDetail()
      
    },
    watch:{

    }
  }
</script>

<style lang="less" scoped>
  /deep/.doctor .el-card__body{
    padding: 10px!important;
  }
  .tx-avatar{
    width:50px;
    max-height: 50px;
    border-radius: 50%;
    vertical-align: middle;
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