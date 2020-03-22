<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='姓名'>
          <el-input v-model.trim='searchParams.phone' placeholder='姓名、昵称、ID' clearable></el-input>
        </el-form-item>
        <el-form-item label='用户类型'>
          <el-select v-model='searchParams.user' clearable>
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
        <el-table-column prop='id' label='姓名' align='center'></el-table-column>
        <el-table-column prop='id' label='账号' align='center'></el-table-column>
        <el-table-column prop='name' label='电话' align='center'></el-table-column>
        <el-table-column prop='id' label='参与开课' align='center'></el-table-column>
        <el-table-column prop='name' label='互动条数' align='center'></el-table-column>
        <el-table-column prop='name' label='客服条数' align='center'></el-table-column>
        <el-table-column prop='name' label='用户类型' align='center'></el-table-column>
        <el-table-column prop='name' label='创建时间' align='center'></el-table-column>
        <el-table-column label='操作' width='150px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button type='text' @click='goMini(row.id)' size='small'>小程序会话</el-button>
            <el-button type='text' @click='goService(row.id)' size='small'>客服会话</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchParams:{
          phone:''
        },//查询参数
        dataList:[
          {id:1,name:'张三'},
          {id:2,name:'王宝器'},
        ],
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    methods: {
      searchList(){
      },
      goMini(id){
        this.$router.push({
          path:'/miniConversation'
        })
      },
      goService(id){
        this.$router.push({
          path:'/serviceConversation'
        })
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>