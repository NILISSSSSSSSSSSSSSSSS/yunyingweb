<template>
  <div>
    <el-card class="mb20">
      <el-row class="mb20 ft12">话术信息</el-row>
      <el-form :model='formParams' class="normal-form" labelWidth='80px'>
      <el-form-item label='标题'>
        <el-input v-model.trim='formParams.name' placeholder='标题' class="" clearable></el-input>
      </el-form-item>
      <el-form-item label='描述'>
        <el-input v-model='formParams.desc' type='textarea' placeholder='描述' rows='3' clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label='状态'>
        <el-switch v-model='formParams.status' active-text='启用' active-color='#67C23A' inactive-text="停用"></el-switch>
      </el-form-item> -->
    </el-form>
    <div v-show="id">
      <el-row class="mb20 ft12">
        话术内容
        <!-- <span class="tips">本次已上传待提交内容 {{unSaveVerbalList.length}} 条</span> -->
      </el-row> 
      <el-row class="mb20">
        <el-button @click='dialogWordData.isShow=true' type='primary' size='small' plain>上传文字</el-button>
        <el-button @click='dialogImgData.isShow=true' type='primary' size='small' plain>上传图片/音频/视频</el-button>
        <el-button @click='deleteMore' type='info' size='small' plain>删除所选</el-button>
        <span class="tips">表格可拖动排序 ↓ 排序后点击下方保存排序</span>
      </el-row>
      <el-table :data='formParams.items' border stripe row-key="id" @selection-change='getNowRow'>
        <el-table-column type='selection' align='center'></el-table-column>
          <el-table-column type='index' label='编号' align='center' width='60px'></el-table-column>
          <el-table-column prop='title' label='文件名' align='center' width="200px"></el-table-column>
          <el-table-column type='type' label='类型' align='center' width="100px">
            <template slot-scope='{row}'>
              <div>{{row.type | courseType}}</div>
            </template>
          </el-table-column>
          <el-table-column type='content' label='内容' align='center' min-width="300px">
            <template slot-scope='{row}'>
              <img style="max-width: 100px;max-height:50px" v-if='row.type === "IMAGE"' :src="row.content" alt="">
              <div v-else-if='row.type === "TEXT"'>
                {{row.content}}
              </div>
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
      <el-row class="mt20 ft12">共{{formParams.items.length}}条</el-row>
    </div>
    <el-row class="tc mt20">
      <el-button @click='save' type='primary' icon='el-icon-check'>保存信息/排序</el-button>
    </el-row>
  </el-card>
  <chooseSpecial :dialogData='dialogSpecialData'/>
  <addWord :dialogData='dialogWordData' :itemId='id' @closeWord='closeWord'/>
  <addImg :dialogData='dialogImgData' :itemId='id' @closeImg='closeWord'/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import chooseSpecial from '@/components/courseware/chooseSpecialist' //选择专家
  import addWord from '@/components/courseware/addWord' //输入文字弹框
  import addImg from '@/components/courseware/addImg' //上传图片弹框
  import Sortable from 'sortablejs'
  import api from '@/servers/course'
  // const icons =  require('@/assets/iconfont/iconfont.json').glyphs
  const userInfo = JSON.parse(Vue.cookie.get('userInfo')) || {}

  export default {
    components:{
      chooseSpecial,
      addWord,
      addImg
    },
    data() {
      return {
        id: this.$route.query.id ||  '',
        formParams:{
          name:'',
          desc:'',
          items:[],
          creator:{
            userId: userInfo.id,
            name: userInfo.name,
            avatar: userInfo.avatar
          }
        },
        // iconList: icons || [],
        activeName:'first',
        nowCourseList:[],//更新操作时的话术列表
        selectedList:[],//已选话术列表
        unSaveVerbalList:[],//未保存的话术列表
        dialogSpecialData:{
          isShow:false
        },//选择专家
        dialogWordData:{
          isShow:false,
          type:'verbal'
        },//添加文字
        dialogImgData:{
          isShow:false,
          type:'verbal'
        }
      };
    },
    methods: {
      save(){
        if(!this.formParams.name.length || !this.formParams.desc.length){
          this.$message.error('标题及描述必填~')
          return false
        }
        let items = this.nowCourseList.concat(this.unSaveVerbalList),
            params = {
              ... this.formParams,
              items: items,
            }
        if(this.id === ''){
          //新增
          api.addVerbalTrick(params).then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg || '新增话术成功')
              this.unSaveVerbalList = []
              this.id = res.data.id 
              if(items.length){
                this.$router.push('/verbalTrick')
              }
            }
          })
        }else{
          //编辑
          params.queryParam = this.id
          api.editVerbalTrick(params).then(res=>{
            if(res.code === 200){
              this.$message.success(res.msg || '编辑话术成功')
              this.unSaveVerbalList = []
              this.getVerbalDetail()
              this.$router.push('/verbalTrick')
            }
          })
        }
      },
      //话术详情
      getVerbalDetail(){
        let params = {
          queryParam: this.id
        }
        api.verbalTrickDetail(params).then(res => {
          if(res.code === 200){
            this.formParams = {
              name: res.data.name,
              desc: res.data.desc,
              items: res.data.items,
              id: res.data.id,
              creator: res.data.creator
            }
            this.nowCourseList = [...res.data.items]
          }
        })
      },
      //删除话术
      deleteRows(index){
        this.$confirm('确定删除编号为【'+ (index + 1) +'】的话术？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.formParams.items.splice(index,1)
          this.save()
        }).catch(()=>{
          this.$message.info('已取消')
        })
      },
      //关闭文字上传弹框
      closeWord(data){
        if(data.length){
          this.unSaveVerbalList = [...this.unSaveVerbalList,...data]
          this.save()
        }
      },
      //获取选中的行
      getNowRow(val){
        // _.differenceWith(array, [values], [comparator])
        //------------------原话术，选中话术，全比较 
        let list = this._.differenceWith(this.formParams.items,val,_.isEqual)
        this.selectedList = [...val]
        this.nowCourseList = [...list]
      },
      //批量删除课件
      deleteMore(){
        if(!this.selectedList.length){
          this.$message.error('还未选择话术无法删除')
          return false
        }
        this.save()
      },
      //删除课件
      deleteRows(index){
        this.$confirm('确定删除编号为【'+ (index + 1) +'】的课件？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.nowCourseList.splice(index,1)
          this.save()
        }).catch(()=>{
          this.$message.info('已取消')
        })
      },
      //拖拽
      drag() {
        const tbody = document.querySelector('.el-table__body-wrapper tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.formParams.items.splice(oldIndex, 1)[0]
            _this.formParams.items.splice(newIndex, 0, currRow)
            _this.nowCourseList = [..._this.formParams.items]
          }
        })
      },
    },
    mounted(){
      this.drag()
      if(this.id){
        this.getVerbalDetail()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>