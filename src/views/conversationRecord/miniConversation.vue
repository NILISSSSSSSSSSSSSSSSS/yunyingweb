<template>
  <div class="miniConversation">
    <div class="mr10">
      <el-card style="width:315px">
        <el-radio-group v-model="bigType" class="leftRadio">
          <el-radio-button label="store">门店</el-radio-button>
          <el-radio-button label="user">用户</el-radio-button>
        </el-radio-group>
        <div v-if="bigType=='store'">
          <!-- 筛选 -->
          <el-collapse v-model="activecollapse">
            <el-collapse-item title="筛选" name="1">
              <el-input v-model.trim='searchParams.name' placeholder='请输入店铺名' size='small' clearable></el-input>
              <el-form class="small-form mt10" :model='searchParams' labelWidth='40px'>
                <el-form-item label='省份'>
                  <el-select class="area-input" v-model='searchParams.address' size='small' clearable>
                    <el-option v-for='(itm,index) in proviceList' :label='itm.name' :value='itm.name' :key='index'>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button @click="getShop" class="w100" type='primary' size='small'>立即搜索</el-button>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <!-- 内容 -->
          <el-table :data='shopList' class="box left-table" stripe>
            <el-table-column type='selection'></el-table-column>
            <el-table-column prop='name' label='名称'>
              <template slot-scope='{row}'>
                <el-popover placement="right-start" width="200" trigger="hover">
                  <div class="ft12 pointer" slot="reference">{{row.name}} {{row.phone}}</div>
                  <div slot class="ft12 lh22">
                    <el-row v-if="row.name"><i class='el-icon-s-shop mr10'></i>{{row.name}}</el-row>
                    <el-row v-if="row.phone"><i class='el-icon-mobile-phone mr10'></i>{{row.phone}}</el-row>
                    <el-row v-if="row.ads"><i class='el-icon-location-information mr10'></i>{{row.ads}}</el-row>
                  </div>
                </el-popover>
                <div class="ft12 col-gray">{{row.ads}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="user-box box">
          <el-badge v-for='(itm,index) in dataList' :key='index' :value="200" :max="99" class="user-item unRead">
            <el-popover
              placement="left-start"
              width="200"
              trigger="hover">
              <el-avatar class="mr10 pointer" :size='35' slot="reference" src='https://hbb-ads.oss-cn-beijing.aliyuncs.com/file41841547850.jpg'></el-avatar>
              <div slot class="ft12 lh22">
                  <el-row><span class="col-gray mr10">微信昵称</span>努力的小太阳</el-row>
                  <el-row><span class="col-gray mr10">店主姓名</span>张三</el-row>
                  <el-row><span class="col-gray mr10">　店铺名</span>爱亲尚府</el-row>
                  <el-row><span class="col-gray mr10">　推荐人</span>李斯</el-row>
                  <el-row><span class="col-gray mr10">　　地区</span>江苏省南京市</el-row>
                  <el-row><span class="col-gray mr10">　　性别</span>女</el-row>
                </div>
            </el-popover>
            <div class="ft12">
              <el-row>{{itm.name}}</el-row>
              <el-row class="col-gray">{{itm.ads}}</el-row>
            </div>
          </el-badge>
          <el-badge class="user-item">
            <el-avatar class="mr10" :size='35' src='https://hbb-ads.oss-cn-beijing.aliyuncs.com/file41841547850.jpg'></el-avatar>
            <div class="ft12">
              <el-row>我是已读样式</el-row>
              <el-row class="col-gray">我是已读样式</el-row>
            </div>
          </el-badge>
        </div>
      </el-card>
    </div>
    <el-card class="right-cont">
      <el-input placeholder="搜索" v-model="searchParams.phone" class="input-with-select mb20">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-row class="flex row-item" v-for='(itm,index) in dataList2' :key='index'>
        <div class="mr10" style="width:30px">
          <el-avatar :size='30' src='https://hbb-ads.oss-cn-beijing.aliyuncs.com/file41841547850.jpg'></el-avatar>
        </div>
        <div class="ft12">
          <el-row>{{itm.title}}</el-row>
          <el-row class="col-gray mt10">159****2244 刚刚</el-row>
        </div>
      </el-row>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
  </div>
</template>
<script>
  import api from '@/servers/merchant'
  import hbApi from '@/servers/huibo'
  const city =  require('@/config/city').default.city

  export default {
    data() {
      return {
        bigType:'store',//门店、用户
        activecollapse:'1',//筛选
        searchParams:{
          phone:''
        },//查询参数
        dataList:[
          {id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
        ],
        dataList2:[
          {title:'成都新世纪妇女儿童医院：纪晓虹专家空降输了送上单给乖乖怪狗送给老给我哦说送咯过来送了我来送咯我啊垃圾送哦哦哦我是尅好来送咯我啊垃圾送哦哦哦我是尅好'},
          {title:'成都新世纪妇女儿童医院：浏览历史专家空降输了送上单给乖乖怪狗送给老给哦哦我是尅好来送咯我啊垃圾送哦哦哦我是尅好'},
          {title:'成都新世纪妇女儿童医院：纪晓虹专家空降输了送上单给乖乖怪狗送给老给我哦说送咯过来送了我来送咯我啊垃圾送哦哦哦我是尅好来送咯我啊垃圾送哦哦哦我是尅好'},
          {title:'成都新世纪妇女儿童医院：浏览历史专家空降输了送上单给乖乖怪狗送给老给哦哦我是尅好来送咯我啊垃圾送哦哦哦我是尅好'}
        ],
        groupList: [],
        proviceList: city,
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    methods: {
      //获取门店
      getShop() {
        let params = {
          queryParam: this.$route.query.id,
          name: this.searchParams.name,
          address: this.searchParams.address
        }
        hbApi.kcShops(params).then(res => {
          if (res.code === 200) {
            this.shopList = res.data.data || []
            this.shopList.map( m =>{
              m.address = m.address || {}
              m.ads = m.address.hasOwnProperty('province') ? 
                          m.address.province + m.address.city + m.address.district + m.address.addr : ''
            })
          }
        })
      },
      searchList(){
      },
      //获取分组
      getGroup() {
        let params = {
          page: 1,
          size: 10000000
        }
        api.getGroup(params).then(res => {
          if (res.code === 200) {
            this.groupList = res.data.data
          }
        })
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    },
    mounted(){
      this.getShop()
    }
  }
</script>

<style lang="less" scoped>
  .miniConversation{
    display: flex;
  }
   /deep/ .leftRadio {
    width: 100%;
    margin-bottom: 10px;

    .el-radio-button {
      width: 50%;

      .el-radio-button__inner {
        width: 100%;
      }
    }
  }
  /deep/.el-collapse,.el-collapse-item__header,/deep/.el-collapse-item__wrap{
    border: 0px!important;
  }
  /deep/.el-collapse-item__header{
    height: 32px;
    line-height: 32px;
  }
  /deep/.el-tabs--card>.el-tabs__header #tab-first.el-tabs__item.is-active {
    border-bottom-color: #FFF;
    background: #F13877;
    color: #fff;
    border-top-left-radius: 5px;
  }
  /deep/.el-tabs--card>.el-tabs__header #tab-second.el-tabs__item.is-active {
    border-bottom-color: #FFF;
    background: #F13877;
    color: #fff;
    border-top-right-radius: 5px;
  }
  .left-table{
    max-height: calc(100vh - 415px);
    overflow-y: auto;
  }
  .user-box {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
  /deep/.el-table td{
    padding: 0px!important;
  }
  .user-item{
    display: flex;
    margin-bottom: 1px;
    padding: 4px 0;
  }
  .user-item.unRead{
    background: #FFF7F9;
  }
  /deep/.el-badge__content.is-fixed{
    right: 0px;
    transform: translateY(0) translateX(0);
  }
  .right-cont {
    width: calc(100% - 400px);
    margin-left: 10px;
  }
  .row-item{
    border-bottom: 1px solid #eee;
    background: #FCFCFC;
    padding: 10px 0;
  }
</style>