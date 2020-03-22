<template>
    <div>
      <el-dialog :visible.sync='dialogData.isShow' title='输入文字' width='600px' :close-on-click-modal='false'>
        <el-input v-model='content' type='textarea' class="mb20" rows='10' placeholder='请输入文字内容'></el-input>
        <el-row class="mt20 mb20 tr">
            <!-- <span class="col-gray ft18 bold icon">☺</span> -->
            <el-button @click='saveWord' class="ml10" type='success'>提交内容</el-button>
          <!-- <span v-popover:iconFont class="col-gray ft18 bold icon">☺</span><el-button @click='saveWord' class="ml10" type='success'>保存</el-button> -->
        </el-row>
        <el-row></el-row>
        <!-- <el-popover ref='iconFont' placement="left-start">
          <el-row style="width:280px">
            <el-tooltip v-for="(itm,index) in iconList" :key='index' effect='light' :content="itm.name" placement="top">
              <svg class="icon" aria-hidden="true">
                <use @click='chooseIcon(itm)' :xlink:href="'#icon-'+ itm.font_class"></use>
              </svg>
            </el-tooltip>
          </el-row>
        </el-popover> -->
      </el-dialog>
    </div>
  </template>
  
  <script>
    import api from '@/servers/course'
    import iconfont from '@/assets/iconfont/iconfont.js'
    // const icons =  require('@/assets/iconfont/iconfont.json').glyphs
    
    export default {
      props:{
        dialogData:{
          type:Object,
          default:{
            isShow:false,
            type:'',
            courseList:[]
          }
        },
        itemId:{
          type: String,
          default:''
        }
      },
      data() {
        return {
          courseId: this.$route.query.id || this.itemId,
          content:'',
          type:'TEXT',
          // iconList: icons || [],
          isVerbal:false,// true 课件库 false 话术库
        };
      },
      methods: {
        saveWord(){
          this.courseId = this.$route.query.id || this.itemId
          if(!this.courseId){
            this.$message.error('请先填写基本信息并保存~')
            return false
          }
          //课件库
          if(!this.isVerbal){
            let data = [],
                params = {}
            data.push({
              content: this.content,
              type: this.type
            })
            data = [...this.dialogData.courseList,...data]
            data.queryParam = this.courseId
            api.courseItem(data).then(res => {
              if(res.code === 200){
                this.dialogData.isShow = false
                this.content = ''
                this.$emit('closeWord',true)
              }
            })
          }else{
            //话术库
            if(!this.content.length){
              this.$message.error('话术文本不能为空')
              return false
            }
            let data = [
              {
                type:"TEXT",
                content: this.content
              }
            ]
            this.dialogData.isShow = false
            this.content = ''
            this.$emit('closeWord',data)

          }
        },
        // chooseIcon(item){
        //   this.content += '['+ item.name + ']'
        // }
      },
      mounted(){
        
        
      },
      watch:{
        'dialogData.isShow':function(val){
          if(val){
            this.isVerbal = this.dialogData.type === 'verbal' ? true : false
          }
        },
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
    .icon{
      cursor: pointer;
    }
  </style>