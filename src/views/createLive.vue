<template>
  <div>
    
    <el-card class="box-card course-header">
      <div class="course-header-main">
        <div class="course-header-back">
          <el-button size="mini" icon="el-icon-back" circle></el-button><span> 直播/新增</span>
        </div>
        <div class="course-header-status"><span>当前状态：已结束</span></div>
      </div>
    </el-card>
    <el-card class="box-card course-main">
      <el-tabs v-model="tabName" :stretch='true'>
        <el-tab-pane label="基本信息" name="基本信息">
          <el-form labelWidth='90px' class="form-width" size="small">
            <el-form-item label='直播课名称'>
              <el-input v-model.trim='rebroadcast.name' placeholder='直播课名称' clearable/>
            </el-form-item>
            <el-form-item label='直播课描述'>
              <el-input type="textarea" v-model.trim='rebroadcast.textDesc' placeholder='直播课描述' clearable/>
            </el-form-item>
            <el-form-item label='开课时间'>
              <!-- <el-date-picker type="date" v-model.trim='rebroadcast.startTime' placeholder='开课时间' clearable style="width: 100%;"></el-date-picker>
              <el-date-picker v-model="value3" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp"></el-date-picker> -->
              <el-date-picker v-model.trim='rebroadcast.startTime' type="datetime" placeholder="开课时间" style="width: 100%;" value-format="timestamp"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="话术" name="话术">
          <div class="select-verbaltrick">
            <el-radio-group v-model="verbaltrick" size="small">
              <el-radio-button label="课前话术" ></el-radio-button>
              <el-radio-button label="课后话术" ></el-radio-button>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px;">
            <el-button type="primary" size="mini">插入文本</el-button>
            <el-button type="primary" size="mini">上传图片/语音/视频</el-button>
            <el-button type="primary" size="mini" style="float: right">从话术库选择</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" height="600">
            <el-table-column prop="date" label="文件名" width="180"></el-table-column>
            <el-table-column prop="name" label="内容">
              
              <template slot-scope="scope" >
                
                <div v-if="scope.row.type == 'text'">
                  <span>文字</span>
                </div>
                <div v-if="scope.row.type == 'img'">
                  <img src="https://airobot-test.oss-cn-beijing.aliyuncs.com/5d9e939c16d3fc213e329174.jpeg" class="course-img">
                </div>
                <div v-if="scope.row.type == 'voice'">
                  <audio src="song.ogg" controls="controls" class="course-voice"></audio>
                </div>
                <div v-if="scope.row.type == 'video'">
                  <video src="movie.ogg" controls="controls" class="course-video"></video>
                </div>
              </template>

            </el-table-column>
            <el-table-column prop="address" label="时长"></el-table-column>
            <el-table-column prop="address" label="延时"></el-table-column>
            <el-table-column prop="address" label="预计发送时间"></el-table-column>
            <el-table-column prop="address" label="发送状态"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="门店" name="门店">
          <div class="mendian">
            <div class="mendian-search">
                <el-input v-model.trim='searchMendian.name' placeholder='请输入店主姓名' size='small' clearable></el-input>
                <el-form class="small-form mt10" :model='searchMendian' labelWidth='60px'>
                  <el-form-item label='所属组' >
                    <el-select  size='small' clearable style="width: 100%;" v-model="searchMendian.group">
                      <el-option v-for='item in dataList' :label='item.id' :value='item.name'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label='地区'>
                    <el-select  size='small' clearable style="width: 100%;" v-model="searchMendian.area">
                      <el-option v-for='item in dataList' :label='item.id' :value='item.name'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-button class="w100" type='primary' size='small' style="margin-bottom: 20px">立即搜索</el-button>
                </el-form>
                <el-table :data='dataList' class="box left-table" stripe>
                  <el-table-column type='selection'></el-table-column>
                  <el-table-column prop='id' label='名称'>
                    <template slot-scope='{row}'>
                      <el-popover placement="right-start" width="200" trigger="hover">
                        <div class="ft12 pointer" slot="reference">{{row.name}} 13562656546</div>
                        <div slot class="ft12 lh22">
                          <el-row><span class="col-gray mr10">店主电话</span>13562656546</el-row>
                          <el-row><span class="col-gray mr10">　　姓名</span>张三</el-row>
                          <el-row><span class="col-gray mr10">　店铺名</span>爱亲尚府</el-row>
                          <el-row><span class="col-gray mr10">　所属组</span>华东组</el-row>
                          <el-row><span class="col-gray mr10">　　地区</span>江苏省南京市玄武区</el-row>
                        </div>
                      </el-popover>
                      <div class="ft12 col-gray">{{row.ads}}</div>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
            <div class="mendian-list">
              <h4>已选择的门店</h4>
                <el-table :data="dataList" style="width: 100%">
                  <el-table-column prop="name" label="日期" > </el-table-column>
                  <el-table-column prop="ads" label="姓名" > </el-table-column>
                </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客服小助手" name="客服小助手">
          <div class="mendian">
            <div class="mendian-search">
                <el-input v-model.trim='searchMendian.name' placeholder='请输入店主姓名' size='small' clearable></el-input>
                <el-form class="small-form mt10" :model='searchMendian' labelWidth='60px'>
                  <el-form-item label='所属组' >
                    <el-select  size='small' clearable style="width: 100%;" v-model="searchMendian.group">
                      <el-option v-for='item in dataList' :label='item.id' :value='item.name'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label='地区'>
                    <el-select  size='small' clearable style="width: 100%;" v-model="searchMendian.area">
                      <el-option v-for='item in dataList' :label='item.id' :value='item.name'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-button class="w100" type='primary' size='small' style="margin-bottom: 20px">立即搜索</el-button>
                </el-form>
                <el-table :data='dataList' class="box left-table" stripe>
                  <el-table-column type='selection'></el-table-column>
                  <el-table-column prop='id' label='名称'>
                    <template slot-scope='{row}'>
                      <el-popover placement="right-start" width="200" trigger="hover">
                        <div class="ft12 pointer" slot="reference">{{row.name}} 13562656546</div>
                        <div slot class="ft12 lh22">
                          <el-row><span class="col-gray mr10">店主电话</span>13562656546</el-row>
                          <el-row><span class="col-gray mr10">　　姓名</span>张三</el-row>
                          <el-row><span class="col-gray mr10">　店铺名</span>爱亲尚府</el-row>
                          <el-row><span class="col-gray mr10">　所属组</span>华东组</el-row>
                          <el-row><span class="col-gray mr10">　　地区</span>江苏省南京市玄武区</el-row>
                        </div>
                      </el-popover>
                      <div class="ft12 col-gray">{{row.ads}}</div>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
            <div class="mendian-list">
              <h4>已选择的门店</h4>
                <el-table :data="dataList" style="width: 100%">
                  <el-table-column prop="name" label="日期" > </el-table-column>
                  <el-table-column prop="ads" label="姓名" > </el-table-column>
                </el-table>
                <h4>已选择的门店</h4>
                <el-table :data="dataList" style="width: 100%">
                  <el-table-column prop="name" label="日期" > </el-table-column>
                  <el-table-column prop="ads" label="姓名" > </el-table-column>
                </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="bottom clearfix">
          <el-button @click="createLive" type='primary' icon='el-icon-check' size="mini" v-if="tabName == '客服小助手'">保存</el-button>
          <el-button @click="nextTab" type='primary' size="mini" v-if="tabName != '客服小助手'">下一步</el-button>
        </div>
    </el-card>
  </div>
</template>
<script>
  import Vue from 'vue'
  import api from '@/servers/zhibo'
  import config from '@/config/api'
  export default {
    data() {
      return {
        rebroadcast: {
          name: '',
          textDesc: '',
          startTime: '',
          endTime: 1679104000000,
          doctorId: '5e01e2a2306b886059453955',
          keChengItems: [{
            "id": "5e13f891306b884626918b56",
            "type": "TEXT",
            "content": "1月7日",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e06f88b8511f20ec4c8621a",
            "type": "TEXT",
            "content": "6666",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e070e118511f20ec4c862b5",
            "type": "IMAGE",
            "content": "https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5dfb254102643571c95f247a.jpeg",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e06f87c8511f20ec4c8620a",
            "type": "TEXT",
            "content": "222",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e06f8738511f20ec4c86205",
            "type": "TEXT",
            "content": "请认真听老师讲课 不要说话",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e06ce038511f20ec4c861d8",
            "type": "IMAGE",
            "content": "https://xiaochengxu-dev.oss-cn-beijing.aliyuncs.com/201912/5e05c25602643571c95f25c8.jpg",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e05cf578511f2af96a686a2",
            "type": "TEXT",
            "content": "请准备好今天八点开始直播哦",
            "length": 0,
            "title": "",
            "addInfo": ""
          }, {
            "id": "5e05cbac8511f2af96a68663",
            "type": "TEXT",
            "content": "课程开始后不要说话",
            "length": 0,
            "title": "",
            "addInfo": ""
          }],
          prefixItems: [
            {
              id: "5e16e25b306b8846269190d2",
              type: "TEXT",
              content: "就好",
              length: 0,
              title: "",
              addInfo: ""
            }
          ],
          creator: {
            userId: '',
            name: '',
            avatar: ''
          },
          users: [
            {
              userId: '5e39469a02643522e497d7bf',
              name: '黎雪影',
              avatar: '',
              role: '客服'
            }
          ]
        },
        searchMendian: {
          name: '',
          area: '',
          group: ''
        },
        dataList:[
          {id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
          {id:2,name:'王宝器',ads:'爱亲尚府四川省成都市武侯区'},{id:1,name:'张三',ads:'爱亲尚府江苏省南京市玄武区'},
        ],
        verbaltrick: '课前话术',
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '123',
            type: 'text'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '123',
            type: 'img'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '123',
            type: 'voice'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '123',
            type: 'video'
          }],
        tabName: '基本信息',
        uploadUrl: config.ossUpload || '',//文件上传
        imageUrl:'',
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    mounted(){
      this.searchList()
    },
    methods: {
      nextTab () {
        console.log(this.rebroadcast)
        if (this.tabName == '基本信息') {
           this.tabName = '话术';
           return false;
        }
        if (this.tabName == '话术') {
           this.tabName = '门店';
           return false;
        }
        if (this.tabName == '门店') {
           this.tabName = '客服小助手';
           return false;
        }
      },
      createLive () {
        this.rebroadcast.creator.userId = JSON.parse(Vue.cookie.get('userInfo')).id;
        this.rebroadcast.creator.name = JSON.parse(Vue.cookie.get('userInfo')).name;
        this.rebroadcast.creator.avatar = JSON.parse(Vue.cookie.get('userInfo')).avatar;
        console.log(this.rebroadcast)
        api.createZhibo(this.rebroadcast).then(res => {
          if(res.code === 200){
              this.isShowDialog = false;
            }
        })
      },
      searchList(){
        // let params = {
        //   ... this.searchParams,
        //   page: this.page.pageNumber,
        //   size: this.page.pageSize
        // }
        // api.kefulist(params).then(res => {
        //   if(res.code === 200){
        //       this.dataList = res.data.data
        //       this.page.total = res.data.total
        //     }
        // })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      createKefu () {
        var id = this.createParams.roleIds;
        let params = {
          ... this.createParams
        }
        params.roleIds = [];
        params.roleIds.push(id);
        api.addKefu(params).then(res => {
          if(res.code === 200){
              this.isShowDialog = false;
            }
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
  /deep/.course-header {
    /deep/.el-card__body {
      // padding: 12px;
      /deep/.course-header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        /deep/.course-header-back {
          flex:1;
          display: inline-block;
          font-size: 15px;
          /deep/span {
            margin-left: 8px;
          }
        }
        /deep/.course-header-status {
          flex:1;
          display: inline-block;
          font-size: 15px;
          /deep/span {
            float: right;
          }
        }
      }
    }
    
    
  }
  .course-main {
    margin-top: 20px;
    /deep/ .form-width {
      width: 600px;
    }
    /deep/ .bottom {
      margin: -20px;
      border-top: 1px solid #e4e4e4;
      margin-top: 20px;
      padding: 12px;
      text-align: right;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 26px;
    }
    /deep/ .choose-course {
      display: flex;
      /deep/ .course-name {
        flex: 1;
        margin-left: 20px;
        font-size: 14px;
        background: #eee;
        border-radius: 50px;
        line-height: 28px;
        padding-left: 12px;
        /deep/ span {
          color: #bbb;
          
        }
        /deep/ span:last-child{
          margin-left: 20px;
        }
      }
    }
    /deep/.course-img {
      width: 50px;
    }
    /deep/ .course-voice {
      height: 46px;
      width:300px;
    }
    /deep/.select-verbaltrick {
      text-align: center;
      margin-bottom: 20px;
    }
    /deep/.mendian {
      display: flex;
      /deep/.mendian-search {
        width: 300px;
        border-radius: 6px;
        border: 1px solid #ddd;
        padding: 12px;
      }
      /deep/.mendian-list {
        flex: 1;
        margin-left: 20px;
        /deep/ h4 {
          margin-top: 0;
        }
      }
    }
  }
  
  .miniConversation{
    display: flex;
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
  .user-item{
    display: flex;
    margin-bottom: 1px;
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