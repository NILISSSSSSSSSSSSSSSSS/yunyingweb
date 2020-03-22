<template>
    <div>
      <!-- 查询条件 -->
      <el-card class="mb20">
        <el-form @submit.native.prevent :model='searchParams' inline labelWidth='80px'>
          <el-form-item label='组名称'>
            <el-input v-model.trim='searchParams.name' placeholder='组名称' clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label='创建时间'>
            <el-date-picker v-model.trim='searchParams.time' 
              type="daterange" 
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item> -->
          <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
          <el-button @click='showEdit(1)' type='primary' icon='el-icon-plus'>新增组</el-button>
        </el-form>
      </el-card>
      <!-- 查询结果 -->
      <el-card>
        <el-table :data='dataList' border stripe>
          <el-table-column prop='name' label='组名称' align='center'></el-table-column>
          <el-table-column prop='shopNum' label='门店数量' align='center'></el-table-column>
          <el-table-column prop='createT.humanTime' label='创建时间' align='center'></el-table-column>
          <el-table-column label='操作' width='350px'  align='center' fixed='right'>
            <template slot-scope='{row}'>
              <el-button type='text' @click='showEdit(0,row)' size='small'>编辑</el-button>
              <el-button type='text' @click='showShops(row)' size='small'>门店列表</el-button>
              <el-button type='text' @click='deleteRow(row)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageLimit='page' @change='pageChange'/>
        <addGroup :dialogData='dialogData' @close='closeGroup'/>
      </el-card>
      <!-- 门店列表弹框 -->
      <el-dialog :visible.sync='isShowShop' title='门店列表' width='1200px'>
        <el-table :data='shopList' border stripe>
          <el-table-column prop='phone' label='店主电话' align='center'></el-table-column>
          <el-table-column prop='userName' label='姓名' align='center'></el-table-column>
          <el-table-column prop='shopName' label='店铺名' align='center'></el-table-column>
          <el-table-column prop='group.name' label='所属组' align='center'></el-table-column>
          <el-table-column prop='id' label='地区' align='center' width='300px'>
            <template slot-scope='{row}'>
              <span>{{row.address ? (row.address.province + row.address.city + row.address.district + row.address.addr ) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop='heHuoRen.name' label='合伙人' align='center'></el-table-column>
          <el-table-column prop='createT.humanTime' label='创建时间' align='center' width='170px'></el-table-column>
        </el-table>
        <pagination :pageLimit='shopPage' @change='pageChange2'></pagination>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import addGroup from '@/components/merchant/addGroup'
    import api from '@/servers/merchant'
    export default {
      components:{
        addGroup
      },
      data() {
        return {
          searchParams:{
            name:'',
          },//查询参数
          dataList:[],
          shopList:[],
          dialogData:{
            isShow:false,
            isEdit:false,
            data:{
              id:'',
              name:''
            }
          },
          page:{
            pageSize:10,
            pageNumber:1,
            total:0
          },
          isShowShop:false,//门店列表弹框
          nowGroupId:'',
          shopPage:{
            pageSize:10,
            pageNumber:1,
            total:0
          }
        };
      },
      methods: {
        searchList(){
          let params = {
            name: this.searchParams.name,
            page: this.page.pageNumber,
            size: this.page.pageSize
          }
          api.getGroup(params,{}).then(res => {
            if(res.code === 200){
              this.dataList = []
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
          })
        },
        showEdit(type,row){
          if(!type){
            this.dialogData.isEdit = true
            this.dialogData.data = {
              id: row.id,
              name: row.name
            } 
          }
          this.dialogData.isShow = true

        },
        //关闭分组操作
        closeGroup(data){
          if(data){
            this.dialogData = {
              isShow:false,
              isEdit:false,
              data: {
                id:'',
                name:''
              }
            }
            this.searchList()
          }
        },
        //门店列表
        showShops(row){
          if(!row.shopNum){
            this.$message.warning('该组下暂无门店')
            return false
          }
          this.nowGroupId = row.id
          this.searchShops()
        },
        //查询分组门店
        searchShops(){
          let params = {
            queryParam: this.nowGroupId,
            page: this.shopPage.pageNumber,
            size: this.shopPage.pageSize
          }
          api.searchShopsByGroupId(params,{}).then(res => {
            if(res.code === 200){
              this.shopList = res.data.data
              this.shopPage.total = res.data.total
              this.isShowShop = true
            }
          })
        },
        //停用
        deleteRow(row){
          // 无门店则二次确认是否删除该组再做删除 | 有门店提示先停用店主再二次确认删除组
          let str = row.shopNum ? `该分组下有${row.shopNum}个店主，请先停用店主` : '确定删除分组？'
          let btn = row.shopNum ? '我知道了' :'确定'
          this.$confirm(str,'提示',{
            confirmButtonText:btn,
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            if(row.shopNum){
              this.$message.info('你需要先去停用该分组下的店主才可删除分组')
            }else{
              api.changeGroupStu({queryParam:row.id}).then(res => {
                if(res.code === 200){
                  this.$message.success(res.msg || '操作成功')
                  this.searchList()
                }
              })
            }
          }).catch(()=>{
            this.$message.info('已取消')
          })
        },
        // 分页
        pageChange(pageSize,pageNumber){
          this.page.pageSize = pageSize
          this.page.pageNumber = pageNumber
          this.searchList() //组刷新
        },
        // 分页
        pageChange2(pageSize,pageNumber){
          this.shopPage.pageSize = pageSize
          this.shopPage.pageNumber = pageNumber
          this.searchShops() //门店列表刷新
        }
      },
      mounted(){
        this.searchList()
      }
    }
  </script>
  
  <style lang="less" scoped>
  
  </style>