<template>
  <div>
    <!-- 查询结果 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span v-if="type=='course'" style="font-size: 15px;">选择课件: {{ courseName || '无'}}</span>
        <div v-else class="talkRow">
          <el-radio-group v-model="radioAll" size="small" v-if="detail.prefixItems && detail.suffixItems">
            <el-radio-button label="1">课前话术 ({{ detail.prefixItems.length}})</el-radio-button>
            <el-radio-button label="2">课后话术 ({{ detail.suffixItems.length}})</el-radio-button>
          </el-radio-group>
          <span>首条发送时间: {{ detail.startTime | formatDate}}</span>
        </div>
      </div>

      <el-table :data='type=="course" ? detail.keChengItems : radioAll==1 ? detail.prefixItems : detail.suffixItems'
        border stripe>
        <el-table-column prop='title' label='文件名' align='center'></el-table-column>
        <el-table-column label='内容' align='center' width="460">
          <template slot-scope='{row}'>
            <span v-if="row && row.type=='TEXT'" class="con_text">{{ row.content }}</span>
            <img v-if="row && row.type=='IMAGE'" :src="row.content" class="tableImg">
            <video v-if="row && row.type=='VIDEO'" :src="row.content" class="tableVideo" controls="controls"></video>
            <audio v-if="row && row.type=='VOICE'" :src="row.content" controls="controls" class="tableAudio"></audio>
          </template>
        </el-table-column>
        <el-table-column label='时长' align='center'>
          <template slot-scope='{row}'>
            {{row.length / 1000 | TimestampToTime}}
          </template>
        </el-table-column>
        <el-table-column label='延时/s' align='center'>
          <template slot-scope='{row}'>
            {{ row.delayTime}}
          </template>
        </el-table-column>
        <el-table-column label='预计发送时间' align='center'>
          <template slot-scope='{row}'>
            <span v-if="row.realTime"> {{ row.realTime.seconds |  formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label='实际发送时间' align='center'>
          <template slot-scope='{row}'>
            <span v-if="row.sendTime"> {{ row.sendTime.humanTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label='发送状态' align='center'>
          <template slot-scope='{row}'>
            <span> {{ row.sendStatus | sendStatus }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import api from '@/servers/course'
  import api2 from '@/servers/huibo'
  export default {
    props: {
      // type : course为课件; talkingSkill为话术
      type: {
        type: String,
        default: 'course'
      },
      objInfo: {
        type: Object,
        default: () => ({})
      },
      currentName: {
        type: String,
        default: ''
      }
    },
    watch: {
      objInfo(val) {
        if (JSON.stringify(val)!=="{}") {
          this.detail=JSON.parse(JSON.stringify(val));
          if(val.keJianId ){
            api.courseDetail({ queryParam: val.keJianId }).then(res => {
            if (res.code === 200) {
              this.courseName = res.data.title;
            }
            else {
              this.courseName = "";
            }
          }).catch(err => {
            this.courseName = "";
          })
          }
        }
      },
      currentName(val) {
        clearInterval(this.Timer);
        if(['talkingSkill','course'].includes(val)) {
          // 避免重复声明，这里做一个判断
          if (this.objInfo.status=='START') {
            this.Timer = setInterval(() => {
              this.getDetail();
            }, 5000)
          }
        }
       
      }
    },
    data() {
      return {
        Timer: null,
        radioAll: "1",
        dataList: [],
        page: {
          pageSize: 10,
          pageNumber: 1,
          total: 0
        },
        courseName: "",
        detail: {

        },
        loadingAll: false,
      };
    },
    methods: {

      getDetail() {
        let params = {
          queryParam: this.$route.query.id,
        }
        api2.huiBoDetail(params).then(res => {
          console.log("获取到的信息：" + JSON.stringify(res));
          if (res.code === 200) {
            this.detail = res.data.keCheng;
          }
          else {
            this.detail = {}
          }
        }).catch(err => {
          this.detail = {}
        })
      }
    },
    mounted() {

      
    },
    destroyed() {
      clearInterval(this.Timer);
    },
  }
</script>

<style lang="less" scoped>
  .talkRow {
    text-align: center;

    >span {
      float: right;
      font-size: 13px;
      margin-top: 7px;
    }
  }

  .con_text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>