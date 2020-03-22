<template>
  <div>
    <!-- 查询结果 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span style="font-size: 15px;">参与门店[{{ page.total }}家]</span>
      </div>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='dianPu.phone' label='店铺电话' align='center'></el-table-column>
        <el-table-column prop='dianPu.name' label='店铺名' align='center'></el-table-column>
        <el-table-column label='地区' align='center'>
          <template slot-scope='{row}'>
            <span v-if="row.dianPu &&  row.dianPu.address">
              {{ row.dianPu.address.province+row.dianPu.address.city+row.dianPu.address.district+row.dianPu.address.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='200px' align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button type='text' size='small' @click="obj=row.dianPu;isShowDetail=true">查看详情</el-button>
            <!-- <el-button  type='text' size='small'>取消</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <!-- 详情 -->
    <el-dialog :visible.sync='isShowDetail' title='门店详情' width='650px'>
      <el-row :gutter="20" class="storeDia_row">
        <el-col :span="12"><span>店铺电话:</span> {{obj.phone}}</el-col>
        <el-col :span="12"><span>店铺名字:</span>{{obj.name}}</el-col>
        <el-col :span="12" v-if="obj.createT"><span>创建时间:</span>{{obj.createT.humanTime}}</el-col>
        <el-col :span="12"><span>地区:</span> <span v-if="obj.address">
            {{ obj.address.province+obj.address.city+obj.address.district+obj.address.addr}}</span></el-col>
        <el-col :span="12"><span>营业时间:</span>{{obj.businessHours}}</el-col>
        <el-col :span="12"><span>营业执照号码:</span>{{obj.yingYeZhiZhao}}</el-col>
       
        <el-col :span="12"><span>状态:</span>{{obj.status | shopStatue}}</el-col>
        <el-col :span="12"><span>店铺的唯一编码:</span>{{obj.onlyId}}</el-col>
        <el-col :span="12"><span>logo:</span><img :src="obj.logo" alt="" class="imgSet"></el-col>
      </el-row>
      <el-row class="tc">
        <el-button @click='isShowDetail=false' type='primary' size='small'>关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/huibo'
  export default {
    data() {
      return {
        dataList: [],
        page: {
          pageSize: 10,
          pageNumber: 1,
          total: 0
        },
        isShowDetail: false,
        obj: {}
      };
    },
    methods: {
      searchList() {
        let params = {
          queryParam: this.$route.query.id,
          page: this.page.pageNumber,
          size: this.page.pageSize
        }

        api.kcShops(params).then(res => {
          if (res.code === 200) {
            this.dataList = res.data.data
            this.page.total = res.data.total
          }
          else {
            this.dataList = [];
          }
        }).catch(err => {
          this.dataList = [];
        })
      },
      pageChange(pageSize, pageNumber) {
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    },
    mounted() {
      this.searchList()
    }
  }
</script>

<style lang="less" scoped>
  .storeDia_row {
    .el-col {
      margin-bottom: 15px;
      span{
        margin-right:7px;
      }
      .imgSet{
        max-width: 200px;max-height: 200px;
        vertical-align: text-top;
      }
    }
  }
</style>