<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='店铺电话'>
          <el-input v-model.trim='searchParams.phone' placeholder='店铺电话' clearable></el-input>
        </el-form-item>
        <el-form-item label='店铺名'>
          <el-input v-model.trim='searchParams.name' placeholder='店铺名' clearable></el-input>
        </el-form-item>
        <el-form-item label='状态'>
          <el-select v-model='searchParams.status' clearable>
            <el-option v-for='(itm,index) in statusList' v-if="itm.value != 'DELETE'" :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='id' label='ID' align='center' width='120px'></el-table-column>
        <el-table-column prop='name' label='店铺名' align='center'></el-table-column>
        <el-table-column prop='phone' label='电话' align='center' width='120px'></el-table-column>
        <el-table-column prop='businessHours' label='营业时间' align='center'></el-table-column>
        <el-table-column prop='logo' label='logo' align='center'>
          <template slot-scope="{row}">
            <img v-if="row.logo" :src="row.logo" :alt="row.name" width="50px" height="50px">
          </template>
        </el-table-column>
        <el-table-column label='地址' align='center' width='250px'>
          <template slot-scope='{row}'>
            <span>{{row.address ? (row.address.province + row.address.city + row.address.district + row.address.addr ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop='' label='店铺状态' align='center' width='100px'>
          <template slot-scope='{row}'>
            <span :class="row.status === 'ONLINE' ? 'col-sucs':'col-danger'">{{row.status | courseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
  </div>
</template>

<script>
  import api from '@/servers/merchant'
  const config =  require('@/config/config')
  export default {
    data() {
      return {
        id:'',
        searchParams:{},//查询参数
        dataList:[],
        statusList: config.status,
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    methods: {
      searchList(){
        let params = {
          ... this.searchParams,
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        api.getShops(params).then(res => {
          if(res.code === 200){
              this.dataList = res.data.data || []
              this.page.total = res.data.total
            }
        })
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      },
      reset(){
        this.searchParams = {}
        this.page = {
          pageNumber:1,
          pageSize:10,
          total:0
        }
        this.searchList()
      },
    },
    mounted(){
      this.searchList()
      
    }
  }
</script>

<style lang="less" scoped>

</style>