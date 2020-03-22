<template>
    <div>
      <!-- 基本信息 -->
      <el-card>
        <el-collapse v-model="isShowMore">
          <el-collapse-item title="13525635623 【张三/爱亲尚府/华东爱亲组】" name="1">
            <el-form class="small-form" labelWidth='100px' inline>
              <el-form-item label='店主电话:'>13525635623</el-form-item>
              <el-form-item label='姓名:'>张三</el-form-item>
              <el-form-item label='店铺名:'>爱亲尚</el-form-item>
              <el-form-item label='所属组:'>华东爱亲组</el-form-item>
              <el-form-item label='微信号:'>wxid_1111555</el-form-item>
              <el-form-item label='微信昵称:'>努力的小太阳</el-form-item>
              <el-form-item label='地区:'>江苏省 南京市 玄武区</el-form-item>
              <el-form-item label='地址:'>小北街35号</el-form-item>
              <el-form-item label='合伙人:'>李斯</el-form-item>
              <el-form-item label='状态:'>有效</el-form-item>
              <el-form-item label='创建时间:'>2019-01-01</el-form-item>
              <el-form-item label='停用时间:'>无</el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <!-- 查询条件 -->
      <el-card class="mt20 mb20">
        <el-form :model='searchParams' inline labelWidth='80px'>
          <el-form-item label='用户昵称'>
            <el-input v-model.trim='searchParams.phone' placeholder='用户昵称' clearable></el-input>
          </el-form-item>
          <el-form-item label='状态'>
            <el-select v-model='searchParams.group' clearable>
              <el-option v-for='n in 3' :label='n' :value='n'></el-option>
            </el-select>
          </el-form-item>
          <el-button type='primary' icon='el-icon-search'>搜索</el-button>
          <el-button type='info' icon='el-icon-s-tools'>重置</el-button>
        </el-form>
      </el-card>
      <!-- 查询结果 -->
      <el-card>
        <el-table :data='dataList' border stripe>
          <el-table-column prop='id' label='ID' align='center'></el-table-column>
          <el-table-column prop='name' label='头像昵称' align='center'></el-table-column>
          <el-table-column prop='id' label='地区' align='center'></el-table-column>
          <el-table-column prop='id' label='性别' align='center'></el-table-column>
          <el-table-column prop='name' label='推荐人' align='center'></el-table-column>
          <el-table-column label='听课次数' align='center'>
            <template slot-scope='{row}'>
              <el-tooltip content="点击数字查看明细" placement="right" effect="light">
                <el-button  @click='isShowUser = true' type='text' size='small'>&nbsp;{{row.id}}&nbsp;</el-button>
              </el-tooltip>
              <!-- <el-link  type="success" underline>{{row.id}}</el-link> -->
            </template>
          </el-table-column>
          <el-table-column prop='id' label='累计听课时长' align='center'></el-table-column>
          <el-table-column prop='id' label='互动条数' align='center'></el-table-column>
          <el-table-column prop='id' label='客服条数' align='center'></el-table-column>
          <el-table-column prop='name' label='首次参与时间' align='center'></el-table-column>
        </el-table>
        <pagination :pageLimit='page' @change='pageChange(1)'/>
        <addGroup :dialogData='dialogData' @close='closeGroup'/>
      </el-card>
      <!-- 用户信息弹框 -->
      <el-dialog :visible.sync='isShowUser' title='用户昵称'>
        <el-table :data='dataList' border stripe>
          <el-table-column prop='id' label='课程名称' align='center'></el-table-column>
          <el-table-column prop='name' label='主讲专家' align='center'></el-table-column>
          <el-table-column prop='id' label='听课时长' align='center'></el-table-column>
          <el-table-column prop='name' label='互动条数' align='center'></el-table-column>
          <el-table-column prop='name' label='开课时间' align='center'></el-table-column>
        </el-table>
        <pagination :pageLimit='userPage' @change='pageChange(2)'></pagination>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import addGroup from '@/components/merchant/addGroup'
    export default {
      components:{
        addGroup
      },
      data() {
        return {
          searchParams:{
            phone:''
          },//查询参数
          dataList:[
            {id:1,name:'张三'},
            {id:2,name:'王宝器'},
          ],
          isShowMore:'1',//是否展示更多信息
          dialogData:{
            isShow:false,
            isEdit:false,
            name:''
          },
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
        },
        showEdit(type,row){
          console.log(row);
          if(!type){
            this.dialogData.isEdit = true
            this.dialogData.name = row.name
          }
          this.dialogData.isShow = true

        },
        //关闭分组操作
        closeGroup(data){
          if(data){
            this.dialogData = {
              isShow:false,
              isEdit:false,
              name:''
            }
          }
        },
        //停用
        deleteRow(row){
          // 无门店则二次确认是否删除该组再做删除 | 有门店提示先停用店主再二次确认删除组
          this.$confirm(`该分组有${row.id}个店主，请先停用店主`,'提示',{
            confirmButtonText:'确定删除',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            this.$message.success('删除')
          }).catch(()=>{
            this.$message.info('已取消')
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