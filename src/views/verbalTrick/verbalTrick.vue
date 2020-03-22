<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='标题'>
          <el-input v-model.trim='searchParams.name' placeholder='标题' clearable></el-input>
        </el-form-item>
        <el-form-item label='创建时间'>
          <el-date-picker v-model.trim='searchParams.cTime' 
            type="daterange" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='创建者'>
          <el-input v-model.trim='searchParams.creator' placeholder='创建者' clearable></el-input>
        </el-form-item>
        <el-form-item label='更新时间'>
          <el-date-picker v-model.trim='searchParams.uTime' 
            type="daterange" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='goAddPage(0)' type='primary' icon='el-icon-plus'>新增话术</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='id' label='ID' align='center' min-width="150px"></el-table-column>
        <el-table-column prop='name' label='标题' align='center' min-width="150px"></el-table-column>
        <el-table-column prop='desc' label='描述' align='center' min-width="200px"></el-table-column>
        <el-table-column prop='itemNum.totalNum' label='总条数' align='center' width='80px'></el-table-column>
        <el-table-column prop='itemNum.textNum' label='文本' align='center' width='80px'></el-table-column>
        <el-table-column prop='itemNum.imgNum' label='图片' align='center' width='80px'></el-table-column>
        <el-table-column prop='itemNum.voiceNum' label='音频' align='center'></el-table-column>
        <el-table-column prop='itemNum.videoNum' label='视频' align='center'></el-table-column>
        <el-table-column prop='itemNum.voiceLength' label='音频时长' align='center'>
          <template slot-scope="{row}">
            <span :class="!row.itemNum.voiceLength ? 'col-gray' : ''">{{row.itemNum.voiceLength / 1000 | TimestampToTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='creator.name' label='创建者' align='center'></el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
        <el-table-column prop='updateT.humanTime' label='更新时间' align='center' width='170px'></el-table-column>
        <el-table-column label='状态' align='center' width='80px'>
          <template slot-scope='{row}'>
            <span :class="row.status === 'ONLINE' ? 'col-sucs':'col-danger'">{{row.status | courseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='120px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button @click='goAddPage(row.id)' type='text' size='small'>编辑</el-button>
            <el-button @click="changeVtStu(row.name,row.id,'OFFLINE')" v-if="row.status === 'ONLINE'" type='text' size='small'>下线</el-button>
            <el-button @click="changeVtStu(row.name,row.id,'ONLINE')" v-else type='text' size='small'>上线</el-button>
            <el-button @click="changeVtStu(row.name,row.id,'DELETE')" type='text' size='small'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
  </div>
</template>
<script>
  import api from '@/servers/course'
  export default {
    data() {
      return {
        searchParams:{
          cTime:[],
          uTime:[]
        },//查询参数
        dataList:[],
        isShowUser:false,
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    methods: {
      searchList(){
        let cTime = this.searchParams.cTime || [],
          uTime = this.searchParams.uTime || [],
          params = {
          ...this.searchParams,
          cst: cTime.length ? (new Date(cTime[0]).getTime())/1000 : '',
          cet: cTime.length ? this.$utils.formatEndTime(cTime[1]) : '',
          ust: uTime.length ? (new Date(uTime[0]).getTime())/1000 : '',
          uet: uTime.length ? this.$utils.formatEndTime(uTime[1]) : '',
          isme: true,//他人上线的及我的话术
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        delete params.cTime
        delete params.uTime
        api.getVerbalTrick(params).then(res => {
          if(res.code === 200){
            this.dataList = res.data.data
            this.page.total = res.data.total
          }
        })
      },
      goAddPage(id){
        if(!id){
          this.$router.push({
            path:'/verbalTrickAdd'
          })
        }else{
          this.$router.push({
            path:'/verbalTrickAdd',
            query:{
              id: id
            }
          })
        }
      },
      changeVtStu(name,id,stu){
        let params = {
          id: id,
          status: stu
        }
        if(stu == 'DELETE'){
          this.$confirm('确定删除话术【'+ name +'】？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
          this.updateStu(params)            
          }).catch(()=>{
            this.$message.info('已取消')
          })
        }else{
          this.updateStu(params)
        }
      },
      updateStu(params){
        api.changeVBTStu(params).then(res =>{
          if(res.code === 200){
            this.$message.success(res.msg || '删除成功')
            this.searchList()
          }
        })
      },
      reset(){
        this.searchParams = {
          uTime:[],
          cTime:[]
        }
        this.searchList()
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