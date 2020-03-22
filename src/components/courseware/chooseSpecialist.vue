<template>
    <div class="formnobtm">
      <el-dialog :visible.sync='dialogData.isShow' title='选择开课专家' width='1200px'>
        <!-- 查询条件 -->
        <el-card class="mt20 mb20">
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
          </el-form>
        </el-card>
        <!-- 查询结果 -->
        <el-card>
          <el-table :data='dataList' ref='singleTable' highlight-current-row  @current-change="handleCurrentChange" border stripe>
            <el-table-column label='选择' align='center'>
              <template slot-scope='scope'>
                <i v-if='scope.row.id !== currentRow.id' class="my-icon-radio-uncheck"></i>
                <i v-if='scope.row.id === currentRow.id' class="el-icon-success col-red ft18"></i>
              </template>
            </el-table-column>
            <el-table-column label='头像昵称' align='center'>
              <template slot-scope='{row}'>
                <img class='tx-avatar' :src="row.avatar">
                <span>{{row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='phone' label='电话' align='center'></el-table-column>
            <el-table-column prop='company' label='单位' align='center'></el-table-column>
            <el-table-column prop='department' label='科室' align='center'></el-table-column>
            <el-table-column prop='title' label='职称' align='center'></el-table-column>
            <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
          </el-table>
          <pagination :pageLimit='page' @change='pageChange'/>
          <el-row class="bor-top tr">
            <el-button @click='sureSpecia' type='success' icon='el-icon-check'>确定选择</el-button>
          </el-row>
        </el-card>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import api from '@/servers/user'
    export default {
      props:{
        dialogData:{
          type:Object,
          default:{
            isShow:false
          }
        }
      },
      data() {
        return {
          searchParams:{},//查询参数
          dataList:[],
          currentRow:{},
          page:{
            pageSize:10,
            pageNumber:1,
            total:0
          }
        };
      },
      methods: {
        sureSpecia(){
          let doctor = {
            id: this.currentRow.id,
            avatar: this.currentRow.avatar,
            name: this.currentRow.name,
            phone: this.currentRow.phone,
            company: this.currentRow.company
          }
          this.$emit('saveSpecia',doctor)
          this.dialogData.isShow = false
        },
        searchList(){
          let params = {
            ...this.searchParams,
            page: this.page.pageNumber,
            size: this.page.pageSize
          }
          api.getSpecia(params).then(res => {
            if(res.code === 200){
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
          })
        },
        //关闭分组操作
        closeGroup(data){
          if(data){
            this.dialogData = {
              isShow:false
            }
          }
        },
        handleCurrentChange(val) {
          this.currentRow = val;
        },
        // 分页
        pageChange(pageSize,pageNumber){
          this.page.pageSize = pageSize
          this.page.pageNumber = pageNumber
          this.searchList() //组刷新
         
        }
      },
      mounted(){
        this.searchList()
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
    .tx-avatar{
      width:40px;
      max-height: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
  </style>