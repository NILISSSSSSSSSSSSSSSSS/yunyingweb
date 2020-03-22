<template>
  <div>
    <el-radio-group v-model="searchParams.isme" class="mb20">
      <el-radio-button label="true">我的回播</el-radio-button>
      <el-radio-button label="false">所有回播</el-radio-button>
    </el-radio-group>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='标题'>
          <el-input v-model.trim='searchParams.name' placeholder='标题' clearable></el-input>
        </el-form-item>
        <el-form-item label='主讲专家'>
          <el-select v-model='searchParams.doctor' clearable>
            <el-option v-for='(item,index) in speciaList' :label='item.name' :value='item.id' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客服'>
          <el-select v-model='searchParams.kefu' clearable>
            <el-option v-for='(item,index) in serviceList' :label='item.name' :value='item.userId' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='状态'>
          <el-select v-model='searchParams.status' clearable>
            <el-option v-for='(itm,index) in statusList' :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item>
        
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='goPage' type='primary' icon='el-icon-plus'>新增回播</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 --> 
    <el-card class="tableCard">
      <el-table :data='dataList' border stripe :row-class-name="setRowGray">
        <el-table-column prop='id' label='ID' align='center' min-width="150px"></el-table-column>
        <el-table-column prop='name' label='标题' align='center'></el-table-column>
        <el-table-column prop='doctor.name' label='主讲专家' align='center'></el-table-column>
        <el-table-column prop='name' label='课件名称' align='center'></el-table-column>
        <el-table-column prop='keChengItems.length' label='课件数量' align='center'></el-table-column>
        <!-- <el-table-column prop='num' label='已预约' align='center'></el-table-column> -->
        <el-table-column prop='inviteNum' label='参与人数' align='center'></el-table-column>
        <el-table-column prop='kefuNum' label='客服' align='center'></el-table-column>
        <el-table-column prop='hudongNum' label='互动条数' align='center'></el-table-column>
        <el-table-column prop='dayiNum' label='答疑条数' align='center'></el-table-column>
        <el-table-column prop='startTime' label='开课时间' width="170px" align='center'>
          <template slot-scope="{row}">
            <span>{{row.startTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='endTime' label='结束时间' width="170px" align='center'>
          <template slot-scope="{row}">
            <span>{{row.endTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='status' label='状态' width="100px" align='center'>
          <template slot-scope='{row}'>
            <span>{{row.status | liveStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='240px' fixed="right" align='center'>
          <template slot-scope='{row}'>
            <!-- 报名中：可推送 -->
            <!-- <el-button v-if="row.status == 'BAOMING'" @click='send(row)' class="mr5" type='text' size='small'>推送</el-button> -->
            <!-- 初始化、创建中：不可查看 -->
            <span v-if="row.status != 'CREATING' && row.status != 'INIT' && row.status != 'BAOMING' && row.status != 'BAOMINGSTOP'" class="mr5">
              <el-button @click='goPage(row,1)' type='text' class="col-sucs" size='small'>查看</el-button>
            </span>
            <!-- 初始化、创建中、报名中、报名结束、已取消：可编辑 -->
            <span v-if="row.status == 'INIT' || row.status == 'CREATING' || row.status == 'BAOMING' || row.status == 'BAOMINGSTOP' || row.status == 'CANCEL'">
              <el-button @click='goPage(row,2)' type='text' size='small' class="color-blue mr5">编辑</el-button>
              <!-- 初始化、创建中、报名中、报名结束：可取消课程 -->
              <el-button v-if="row.status != 'CANCEL'" @click="changeStatus(row.id,'CANCEL','取消课程')" class="col9 fr" type='text' size='small'>取消课程</el-button>
            </span>
            <!-- 创建中：可开始报名 -->
            <el-button v-if="row.status == 'CREATING'" @click="changeStatus(row.id,'BAOMING','开始报名')" type='text' size='small'>开始报名</el-button>
            <!-- 报名中：结束报名 -->
            <el-button v-if="row.status == 'BAOMING'" @click="changeStatus(row.id,'BAOMINGSTOP','结束报名')" type='text' size='small'>结束报名</el-button>
            <!-- 报名结束：附加操作 开课、继续报名 -->
            <span v-if="row.status == 'BAOMINGSTOP'">
              <el-button @click="changeStatus(row.id,'BAOMING','继续报名')" type='text' size='small'>继续报名</el-button>
              <el-button @click="changeStatus(row.id,'START','开课')" type='text' class="col-warning" size='small'>开课</el-button>
            </span>
            <!-- 开课中：附加操作 开始答疑、结束课程、中止课程 -->
            <span v-if="row.status == 'START' || row.status == 'ANSWER'">
              <el-button v-if="row.status == 'START'" @click="changeStatus(row.id,'ANSWER','开始答疑')" class="col-warning" type='text' size='small'>开始答疑</el-button>
              <!-- 答疑中：附加操作 结束课程、中止课程 -->
              <el-button @click="changeStatus(row.id,'STOP','结束课程')" type='text' class="col-danger" size='small'>结束课程</el-button>
              <!-- 直播课无中止课程操作 回播课才有 -->
              <el-button @click="changeStatus(row.id,'ABORT','中止课程')" type='text' class="col-danger" size='small'>中止课程</el-button> 
            </span>
            <!-- <el-button @click='deleteRow(row)' type='text' size='small'>删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
  </div>
</template>
<script>
  import user from '@/servers/user'
  import api from '@/servers/huibo'
  import kefu from '@/servers/kefu'
  const config = require('@/config/config')
  
  export default {
    data() {
      return {
        statusList:config.liveStatus,
        speciaList:[],
        serviceList:[],
        searchParams:{
          isme: true,
          kctype: 'hb'
        },//查询参数
        dataList:[
          // {status:'INIT'},
          // {status:'CREATING'},
          // {status:'CANCEL'},
          // {status:'STOP'},
          // {status:'BAOMING'},
          // {status:'BAOMINGSTOP'},
          // {status:'START'},
          // {status:'ANSWER'},
          // {status:'ABORT'},
        ],
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        },
        // clientHeight: (document.body.clientHeight - 440 ) + 'px'
      };
    },
    methods: {
      searchList(){
        let params = {
          ...this.searchParams,
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        api.getClassList(params).then(res => {
          if(res.code === 200){
            this.dataList = res.data.data
            this.page.total = res.data.total
          }
        })
      },
      // send(row){
      //   this.$confirm('确定向所有店主推送这条回播消息？','提示',{
      //     type: 'warning'
      //   }).then(()=>{

      //   }).catch(()=>{
      //     this.$message.info('已取消')
      //   })
      // },
      //提交状态修改
      changeStatus(id,stu,str){
        this.$confirm('确定【'+ str +'】吗?',{
          type:'warning'
        }).then(()=>{
          let params = {
            id: id,
            status: stu
          }
          api.changeClass(params).then(res => {
            if(res.code === 200){
              this.searchList()
            }else{
              this.$message.error(res.msg || '状态更改失败')
            }
          })
        }).catch(()=>{
          this.$message.info('已取消操作')
        })
      },
      goPage(obj,type){
        if(!obj.id && !type){
          this.$router.push('/createRebroadcast')
          return
        }
        let str = type === 2 ? '/editRebroadcast' : '/rebroadcastDetail'
        this.$router.push({
          path: str,
          query: { id: obj.id }
        })
      },
      //删除课程
      deleteRow(row){
      //   this.$confirm('确定删除回播课程【'+ row.name +'】？','提示',{
      //     type: 'warning'
      //   }).then(()=>{
      //     let params = {
      //       queryParam: row.id
      //     }
      //     api.delClass(params).then(res => {
      //       if(res.code === 200){
      //         this.searchList()
      //       }
      //     })
      //   }).catch(()=>{
      //     this.$message.info('已取消')
      //   })
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
      //客服
      searchService(){
        let params = {
          page: 1,
          size: 10000000
        }
        kefu.kefulist(params).then(res => {
          if(res.code === 200){
              this.serviceList = res.data.data
            }
        })
      },
      setRowGray(row){
        if(row.row.status == 'STOP' || row.row.status == 'ABORT' || row.row.status == 'CANCEL'){
          return 'col-gray'
        } 
      },
      reset(){
        let isme = this.searchParams.isme
        this.searchParams = {
          isme: isme,
          kctype: 'hb'
        }
        this.page = {
          pageSize:10,
          pageNumber:1,
          total:0
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
    created(){

    },
    mounted(){
      this.searchList()
      this.searchSpecia()
      this.searchService()
    },
    watch:{
      'searchParams.isme':function(val,old){
        if(val != old){
          this.searchList()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  // /deep/.tableCard {
  //   position: relative !important;
  //   overflow: auto !important;
  //   height: calc(100vh - 360px)
  // }
  // /deep/.el-table{
  //   height: calc(100vh - 500px);
  //   position: absolute; width: auto; max-width: none;
  // }
  .fr{float:right}
</style>
