<template>
  <div class="miniConversation">
    <!-- 左边内容 -->
    <el-card style="width:275px">
      <el-radio-group v-model="bigType" class="leftRadio" @change="changeBigType">
        <el-radio-button label="store">门店</el-radio-button>
        <el-radio-button label="user">用户</el-radio-button>
      </el-radio-group>

      <!-- 如果是门店 -->
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
              <el-button @click="getShop" class="w100" type='primary' size='small'>搜索门店</el-button>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <!-- 门店内容 -->

        <template>
          <el-table ref="multipleTable" :data='shopList' class="box left-table" stripe
            @selection-change="handleSelectionChange">
            <el-table-column type='selection'></el-table-column>
            <el-table-column label='名称'>
              <template slot-scope='{row}'>
                <el-popover placement="right-start" width="200" trigger="hover">
                  <div class="ft12 pointer" v-if="row.dianPu" slot="reference">{{row.dianPu.name}} {{row.dianPu.phone}}
                  </div>
                  <div slot class="ft12 lh22" v-if="row.dianPu">
                    <el-row><i class='el-icon-s-shop mr10'></i>{{row.dianPu.name}}</el-row>
                    <el-row><i class='el-icon-mobile-phone mr10'></i>{{row.dianPu.phone}}</el-row>
                    <el-row><i class='el-icon-location-information mr10'></i>{{row.dianPu.ads}}
                    </el-row>
                  </div>
                </el-popover>
                <div class="ft12 col-gray" v-if="row.dianPu">
                  {{ row.dianPu.ads}}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 门店聊天搜索 -->
          <el-form class="small-form mt10" :model='chatForm1' labelWidth='40px'>
            <el-form-item label='类型'>
              <el-select class="area-input" v-model='chatForm1.type' size='small' clearable>
                <el-option label='提问' value='ask'>
                </el-option>
                <el-option label='全部' value='all'>
                </el-option>
              </el-select>
            </el-form-item>
            <el-button class="w100" type='primary' size='small' @click="searchChatRoom">搜索聊天</el-button>
          </el-form>
        </template>

      </div>
      <!-- 如果选的是用户 -->
      <div v-else>
        <!-- 私聊搜索 -->
        <el-form class="small-form mt10 mb10" :model='chatForm2' labelWidth='40px'>
          <el-form-item label='类型'>
            <el-select class="area-input" v-model='chatForm2.type' size='small' clearable>
              <el-option label='提问' value='ask'>
              </el-option>
              <el-option label='全部' value='all'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-button class="w100" type='primary' size='small' @click="searchChatRoom">搜索聊天</el-button>
        </el-form>
        <div class="user-box box">
          <!-- unRead -->
          <el-badge v-for='(itm,index) in dataList' :key='index' class="user-item"
            :class="itm.senderId==senderId ? 'activeBg' : ''">
            <el-popover placement="left-start" width="240" trigger="hover">
              <el-avatar class="mr10 pointer" :size='35' slot="reference" :src='itm.senderAvatar'></el-avatar>
              <div slot class="ft12 lh22">
                <el-row><span class="col-gray mr10">微信昵称</span>{{itm.senderNickname}}</el-row>
                <!-- <el-row><span class="col-gray mr10">　店铺名</span></el-row>
                <el-row><span class="col-gray mr10">　推荐人</span></el-row> -->
                <el-row><span class="col-gray mr10">　　地区</span><template
                    v-if="itm.weChatAuth">{{itm.weChatAuth.province}} {{itm.weChatAuth.city}}</template></el-row>
                <el-row><span class="col-gray mr10">　　性别</span><template
                    v-if="itm.weChatAuth">{{itm.weChatAuth.sex | sexJudgment}}</template></el-row>
              </div>
            </el-popover>
            <div class="ft12">
              <el-row style="margin-top: 10px;cursor: pointer;"><span
                  @click="changeUser(itm)">{{itm.senderNickname}}</span></el-row>
            </div>
          </el-badge>
        </div>
      </div>
    </el-card>
    <!-- 中间内容 -->
    <div class="middleCon">
      <!-- 聊天框 -->
      <chatRoom ref="chat" :groupForm="chatForm3" :selfForm="chatForm4" @tellForm="tellForm" :senderId="senderId"
        :currentName="currentName" :allInfo="allInfo" :bigType="bigType" :smallType="smallType" :checkVal="checkVal"
        @chatWho='chatWho' @getQuestion="getQuestion" />
    </div>
    <!-- 右边内容 搜索模块-->
    <div class="rightCon" style="width:375px">
      <chatSearch :smallTypes='smallType' :question='question' @setCheckVal='setCheckVal' />
    </div>

  </div>
</template>
<script>
  import api from '@/servers/merchant'
  import hbApi from '@/servers/huibo'
  import courseApi from '@/servers/course'
  const city = require('@/config/city').default.city
  import chatRoom from '@/components/rebroadcast/chatRoom';
  import chatSearch from '@/components/rebroadcast/chatSearch';
  export default {
    components: {
      chatRoom,
      chatSearch
    },
    props: {
      allInfo: {
        type: Object,
        default: () => ({})
      },
      currentName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        bigType: "store", //@param store门店；user用户，
        smallType: 'search', //@param search搜索；answerBank答疑库 mine我的，
        checkVal: '',//右侧选中的答案
        shopList: [{ id: 1, name: '爱亲尚府', phone: 16892973627, address: '爱亲尚府江苏省南京市玄武区' },],//门店列表
        searchParams: {},
        activecollapse: '1',//筛选
        groupList: [],
        proviceList: city,
        dataList: [

        ],
        question: '',//聊天内容
        senderId: '',//私聊切换的用户id

        //群聊搜素
        chatForm1: {
          type: "all",
          groupIds: [],
          isSearch: false
        },
        //私聊搜素
        chatForm2: {
          type: "all",
          isSearch: false
        },


        // 拷贝 群聊搜素
        chatForm3: {
          type: "all",
          groupIds: [],
          isSearch: false
        },
        //拷贝 私聊搜素
        chatForm4: {
          type: "all",
          isSearch: false
        },
      }
    },


    methods: {
      //
      tellForm(obj) {
        if (obj.name == 'store') {
          this.chatForm3.isSearch = false;
        }
        else {
          this.chatForm4.isSearch = false;
        }
      },
      //切换用户
      changeUser(item) {
        this.senderId = item.senderId;
      },
      //获取用户列表
      getUserList() {
        let params = {
          page: 1,
          size: 20000,
        }
        hbApi.imUserList(params).then(res => {
          if (res.code == 200) {
            console.log("用户列表" + JSON.stringify(res));
            this.dataList = res.data.data;

          }
          else {
            this.dataList = [];
          }
        }).catch(err => {
          this.dataList = [];
        })
      },

      //勾选门店
      handleSelectionChange(val) {
        let idBox;
        if (val.length !== 0) {
          idBox = val.map(item => item.roomId)
        }
        this.chatForm1.groupIds = idBox;
      },
      searchChatRoom() {

        if (this.bigType == 'store') {
          if (this.chatForm1.groupIds && this.chatForm1.groupIds.length == 0) {
            this.$message.error('请选择门店'); return;
          }
          this.chatForm1.isSearch = true;
          this.chatForm3 = JSON.parse(JSON.stringify(this.chatForm1));
        }
        else {
          this.chatForm2.isSearch = true;
          this.chatForm4 = JSON.parse(JSON.stringify(this.chatForm2));
        }
      },
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
            this.shopList.map(m => {
              m.dianPu.address = m.dianPu.address || {};
              m.dianPu.ads = m.dianPu.address.hasOwnProperty('province') ?
                m.dianPu.address.province + m.dianPu.address.city + m.dianPu.address.district + m.dianPu.address.addr : ''
            });
            // 默认选中第一个店铺
            if (res.data.data.length !== 0) {
              this.selectTable(500);
            }
          }
        })
      },
      //默认选中第一个店铺
      selectTable(duration=100) {
        if (this.shopList && this.shopList.length !== 0) {
          this.chatForm3.groupIds = [this.shopList[0].roomId];
          this.chatForm3.isSearch = true;
          let timer = setTimeout(() => {
            clearTimeout(timer);
            this.$refs.multipleTable.toggleRowSelection(this.shopList[0], true);
          }, duration);
        }

      },
      //获取分组
      getGroup() {
        let params = {
          page: 1,
          size: 10000000
        }
        api.getGroup(params).then(res => {
          if (res.code === 200) {
            this.groupList = res.data.data;

          }
        })
      },
      //获取聊天内容
      getQuestion(txt) {
        this.question = txt
      },
      //右侧选中的答案
      setCheckVal(val) {
        if (val) {
          this.checkVal = val
        }
      },

      chatWho(him) {
        console.log(him);
        if (him.txImMsg) {
          this.bigType = 'user';
          this.senderId = him.txImMsg.sender.senderId;
        }

      },
      changeBigType(val) {
        if (val == 'store') {
          this.senderId = '';
          // this.chatForm3.isSearch = true;
          this.selectTable();
        }
        else {
          // 默认第一个用户加载数据
          this.senderId = this.dataList && this.dataList.length != 0 ? this.dataList[0].senderId : '';
        }
      }

    },
    mounted() {
      this.getGroup()//分组获取
      this.getShop()//课程下的店铺列表
      this.getUserList();//获取用户列表
    },
    watch: {
      // bigType(val) {
      //   this.chatForm3.isSearch=false;
      //   this.chatForm4.isSearch=false;
      // },
    }
  }
</script>
<style lang="less" scoped>
  .miniConversation {
    display: flex;
    font: 13px;

    .middleCon {
      flex: 1;
      margin-left: 10px;
      margin-right: 10px;
      max-width: 578px;
    }

    .rightCon {
      display: flex;
    }
  }

  /deep/.area-input .el-input--small {
    width: calc(100% - 42px)
  }

  /deep/.el-collapse,
  .el-collapse-item__header,
  /deep/.el-collapse-item__wrap {
    border: 0px !important;
  }

  /deep/.el-collapse-item__header {
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

  .left-table {
    max-height: calc(100vh - 455px);
    overflow-y: auto;
  }

  .user-box {
    max-height: calc(100vh - 240px);
    overflow-y: auto;
  }

  /deep/.el-table td {
    padding: 0px !important;
  }

  .user-item {
    display: flex;
    margin-bottom: 1px;
    padding: 4px 0;
  }

  .user-item.unRead {
    background: #FFF7F9;
  }

  /deep/.el-badge__content.is-fixed {
    right: 0px;
    transform: translateY(0) translateX(0);
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

  /deep/ .activeBg {
    background: #fffeef
  }
</style>