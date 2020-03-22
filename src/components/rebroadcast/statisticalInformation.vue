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
      <el-col :span='11'>
        <el-card>
          <div id='userGender' style="width:100%;height:300px;"></div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card>
          <div id='courseTimes' style="width:100%;height:300px;"></div>
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

  // import { formatDate } from '@/utils/index'
  // import { getUserAddingInfo} from '@/api/home';

  let gender = null; let courseTimes = null;
  export default {
    name: "user-profile",
    props: {
      currentName: {
        default: "",
        type: String
      }
    },
    data() {
      return {
        dataList: [
          { name: '参与门店', value: '325' },
          { name: '参与客服', value: '1521' },
          { name: '听课人数', value: '32355' },
          { name: '互动条数', value: '36' },
          { name: '答疑条数', value: '36' },
        ],

        sexList: [
          { name: '课程专家团7号', value: 8 },
          { name: '专家团3号', value: 13 },
          { name: '课程专家团2号', value: 18 },
          { name: '专家团1号', value: 12 },
          { name: '课程专家团5号', value: 30 },

        ],//列表
      };
    },
    created() {
    },

    watch: {
      //tab中异步加载echart,echart样式会错乱，改成在点击统计信息按钮时在加载echart
      currentName(val) {
        if (val == 'echart') {
          this.drawGender()
          this.courseTimes();
        }
      }
    },
    methods: {
      changeNowType() {
      },
      //门店活跃度图表
      drawGender() {
        // 基于准备好的dom，初始化echarts实例
        gender = echarts.init(document.getElementById('userGender'), 'macarons')
        // 绘制图表
        gender.setOption({
          title: {
            text: '客服解决宝妈问题排名',
            textStyle: {
              fontWeight: 'bold'
            },
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: { show: true }
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            left: 'left',
            top: 30,
            orient: 'vertical',
            data: ['课程专家团7号', '专家团3号', '课程专家团2号', '专家团1号', '课程专家团5号']
          },
          series: [
            {
              name: '用户性别占比',
              type: 'pie',
              selectedMode: 'single',
              radius: '58%',
              label: {
                normal: {
                  position: 'outside'
                },
              },
              labelLine: {
              },
              data: this.sexList,
              itemStyle: {

                normal: {
                  color: function (params) {
                    //自定义颜色
                    var colorList = [
                      '#37a2da', '#67e0e3', '#ffdb5c', '#ff9f7f', '#e062ae',
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            },
          ]
        });
      },
      courseTimes() {
        // 基于准备好的dom，初始化echarts实例
        courseTimes = echarts.init(document.getElementById('courseTimes'), 'macarons')
        // 绘制图表
        courseTimes.setOption({
          title: {
            text: '地区群人数及活跃排名',
            textStyle: {
              color: '#008ACD',
              fontWeight: 'bold'
            },
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['群人数', '活跃度']
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['北京市', '湖南省', '安徽省', '浙江省', '四川省', '广东省', '上海市']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '群人数',
              type: 'bar',
              data: [22,12,34,12,67,12,4],
              markPoint: {
                data: [
                  { name: '最高', value: 67, xAxis: 4, yAxis: 67 },
                  { name: '最低', value: 4, xAxis: 6, yAxis: 4 }
                ]
              },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(55,162,218,1)' },
                    { offset: 0.6, color: 'rgba(55,162,218,.9)' },
                    { offset: 1, color: 'rgba(55,162,218,.1)' }
                  ]
                )
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              }
            },
            {
              name: '活跃度',
              type: 'bar',
              data: [78,23,12,4,5,66,3],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(92,198,138,1)' },
                    { offset: 0.6, color: 'rgba(92,198,138,.9)' },
                    { offset: 1, color: 'rgba(92,198,138,.1)' }
                  ]
                )
              },
              markPoint: {
                data: [
                  { name: '最高', value: 78, xAxis: 0, yAxis: 78 },
                  { name: '最低', value: 3, xAxis: 6, yAxis: 3 }
                ]
              },
              markLine: {
                data: [
                  { type: 'average', name: '平均值' }
                ]
              }
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
  .count-div {
    justify-content: space-around;
  }

  .count-item {
    margin: 10px;
    /* padding: 10px 20px;
  width: auto; */
    text-align: center;
    line-height: 40px;
    position: relative;
  }

  /* 
 #userGender{
   div{
     width: 100%;
   }
 } */
</style>