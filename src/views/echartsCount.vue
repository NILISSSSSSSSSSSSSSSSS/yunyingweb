<template>
    <div class="user-profile">
      <el-card class="mb20">
        <div class="count-div flex">
          <div class="count-item pr" v-for='(itm,index) in dataList' :key='index'>
            <div>{{itm.name}}</div>
            <div class="ft30">{{itm.value}}</div>
          </div>
        </div>
        
      </el-card>
      <!-- 排行榜 -->
      <el-row class="mb20" :gutter='20'>
        <el-col :span='12'>
          <el-card>
            <el-radio-group class="time-label" v-model="shopPeriod" @change="changeShopTmie" size="small">
              <el-radio-button label="week">最近一周</el-radio-button>
              <el-radio-button label="month">最近一月</el-radio-button>
              <el-radio-button label="halfYear">近半年</el-radio-button>
            </el-radio-group>
            <div id='shopCharts' style="width:100%;height:250px;"></div>
          </el-card>
        </el-col>
        <el-col :span='12'>
          <el-card>
            <el-radio-group class="time-label" v-model="userPeriod" @change="changeUserTmie" size="small">
              <el-radio-button label="week">最近一周</el-radio-button>
              <el-radio-button label="month">最近一月</el-radio-button>
              <el-radio-button label="halfYear">近半年</el-radio-button>
            </el-radio-group>
            <div id='userCharts' style="width:100%;height:250px;"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span="12">
          <el-card>
            <div id='shopTimesCharts' style="width:100%;height:250px;"></div>
          </el-card>
        </el-col>
        <el-col :span='12'>
          <el-card>
            <div id='courseTimesCharts' style="width:100%;height:250px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
<script>
  import echarts from 'echarts' // 引入基本模板
  require('echarts/lib/chart/pie') // 引入饼图组件
  require('echarts/lib/chart/bar') // 引入柱状图组件
  require('echarts/map/js/china')
  
  import api from '@/servers/user';
  
  export default {
    name: "user-profile",
    data() {
      return {
        shopPeriod:'week',
        userPeriod:'week',
        dataList: [
          {name:'店铺总数',value:0},
          {name:'用户参与总数',value:0},
          {name:'消息总数',value:0},
          {name:'课程总数',value:0},
          {name:'问题总数',value:0}
        ],
        dianpuLine: [],//店铺折线图
        userLine: [],//用户折线图
        dianpuTop:[],
        courseTop:[],
      };
    },
    created(){
    },
    mounted(){
      this.getBase()
      this.changeShopTmie()
      this.changeUserTmie()
      this.getShopTop()
      this.getCourseTop()
    },
    methods: {
      //获取基本数据
      getBase(){
        api.getBaseData({}).then(res => {
          if(res.code === 200){
            let data = res.data
            this.dataList = [
              {name:'店铺总数',value:data.dianpuTotal || 0},
              {name:'用户参与总数',value:data.memberTotal || 0},
              {name:'消息总数',value:data.msgTotal || 0},
              {name:'课程总数',value:data.kechengTotal || 0},
              {name:'问题总数',value:data.questionTotal || 0}
            ]
          }
        })
      },
      //获取走势图
      getLine(param){
        api.getLineData(param).then(res => {
          if(res.code === 200){
            if(param.periodFor == 'dianpu'){
              this.dianpuLine = res.data
              let time = _.map(this.dianpuLine,'key')
              let data = _.map(this.dianpuLine,'value')
              this.drawShopCharts(time,data)
            }else {
              this.userLine = res.data
              let time = _.map(this.userLine,'key')
              let data = _.map(this.userLine,'value')
              this.drawUserCharts(time,data)
            }
          }
        })
      },
      //获取门店top10
      getShopTop(){
        api.getShopTopData({}).then(res => {
          if(res.code === 200){
            this.dianpuTop = res.data.data
            let nameList = _.map(this.dianpuTop,'dianpuName')
            let dataList = _.map(this.dianpuTop,'joinNum')
            this.drawShopTimesCharts(nameList,dataList)
          }
        })
      },
      //获取课程top10
      getCourseTop(){
        api.getCourseTopData({}).then(res => {
          if(res.code === 200){
            this.courseTop = res.data
            let nameList = _.map(this.courseTop,'title')
            let dataList = _.map(this.courseTop,'times')
            this.drawCourseTimesCharts(nameList,dataList)
          }
        })
      },
      changeShopTmie(){
        let param = {
          periodFor: 'dianpu',
          period: this.shopPeriod
        }
        this.getLine(param)
      },
      changeUserTmie(){
        let param = {
          periodFor: 'user',
          period: this.userPeriod
        }
        this.getLine(param)
      },
      //门店参与走势折线图
      drawShopCharts(time,data){
        // 基于准备好的dom，初始化echarts实例
        let shopCharts = echarts.init(document.getElementById('shopCharts'))
        // 绘制图表
        shopCharts.setOption({
          color:'#11C2EE',
          title: { 
            text: '门店参与走势',
            // subtext: '参与店铺(家)',
            textStyle:{
              // color: '#008ACD',
              // fontWeight: 'bold'
            },
            x: 'left'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: time
        },
        yAxis: {
            type: 'value',
            name: '参与门店(家)'
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,
            name:'参与门店数'
        }]
        });
      },
      //用户参与走势折线图
      drawUserCharts(time,data){
        // 基于准备好的dom，初始化echarts实例
        let userCharts = echarts.init(document.getElementById('userCharts'))
        // 绘制图表
        userCharts.setOption({
          color:'#11C2EE',
          title: { 
            text: '用户参与走势',
            textStyle:{
              // color: '#008ACD',
              // fontWeight: 'bold'
            },
            x: 'left'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: time
        },
        yAxis: {
            type: 'value',
            color:'#333',
            name: '参与用户(人)'
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,
            name:'参与用户数'
        }]
        });
      },
      //门店上课次数柱状图
      drawShopTimesCharts(nameList,dataList){
         // 基于准备好的dom，初始化echarts实例
         let shopTimesCharts = echarts.init(document.getElementById('shopTimesCharts'))
         shopTimesCharts.setOption({
           color:'#11C2EE',
           title: {
            text: '门店上课次数TOP10【近一个月】'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            show:false,
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            show:true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            boundaryGap: false,
            type: 'category',
            data: nameList
          },
          series: [
            {
              name: '上课次数',
              type: 'bar',
              barMaxWidth:15,
              label:{
                show: true,
                color:'#333',
                position: 'right'
              },
              data: dataList
            }
          ]
        })
      },
      //课件播放次数柱状图
      drawCourseTimesCharts(nameList,dataList){
         // 基于准备好的dom，初始化echarts实例
         let courseTimesCharts = echarts.init(document.getElementById('courseTimesCharts'))
         courseTimesCharts.setOption({
          title: {
            text: '课件播放次数TOP10【近一个月】'
          },
          color:'#11C2EE',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            show:false,
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            show:true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            boundaryGap: false,
            type: 'category',
            data: nameList
          },
          series: [
            {
              name: '播放次数',
              type: 'bar',
              barMaxWidth:15,
              label:{
                show: true,
                color:'#333',
                position: 'right'
              },
              data: dataList
            }
          ]
         })
      }
    },
    components: {
    },
  };
  </script>
  
<style lang="less" scoped>
  /deep/.el-card__body{
    padding: 10px
  }
  /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner{
    background-color:#11C2EE !important;
    border-color:#11C2EE !important;
    box-shadow: -1px 0 0 0 #11C2EE
  }
  /deep/.el-radio-button__inner:hover{
    color: #11C2EE
  }
  /deep/.el-radio-button.is-active .el-radio-button__inner:hover{
    color: #fff !important;
  }
  .count-div{
    justify-content: space-around;
  }
  .count-item{
    margin: 10px 0;
    width: 20%;
    text-align: center;
    line-height: 40px;
    position: relative;
  }
   .count-item::after{
    content: '';
    position: absolute;
    right: 0px;
    top: 10px;
    width: 1px;
    height: 60px;
    z-index: 2;
    background: #eee;
  }
  .count-item:last-child::after{
    width: 0px;
  } 
  /deep/ .time-label{
    float: right;
    margin-bottom: 5px;
    position: relative;
    z-index: 5;
  }
  </style>
  