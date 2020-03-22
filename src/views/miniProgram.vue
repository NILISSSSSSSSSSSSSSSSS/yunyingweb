<template>
  <div class="miniProgram">
    <iframe src="https://mpkf.weixin.qq.com/" v-if="showIframe" sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation" class="iframe"/>
    <!-- 左边内容 -->
    <el-card class="divLeft" v-if="showIframe == false" id="divLeftContent">
      <div class="divSearch">
        <el-input prefix-icon="el-icon-search" placeholder="请输入用户名..." v-model="userName" @keyup.enter.native="keyUpEnter" maxlength="15" show-word-limit></el-input>
      </div>
      <div class="divContent">
        <div class="div-emptydata" v-if="list.length <= 0">对不起，没有相关数据。</div>
        <el-popover v-if="list.length > 0" v-for="(item, index) in list" :key="index" placement="right-start" width="200" trigger="hover" >
            <div :class="(item.senderId == selectId)?'divItem divItemOver':'divItem'" slot="reference" @click="clickItem(item.senderId, item.weChatAuth.openId)">
              <el-image class="imageAvatar" :src="item.senderAvatar" fit="fit"></el-image>
              <div class="divRight" >
                <div class="divName">{{item.senderNickname}}</div>
                <div class="divInfo">{{item.weChatAuth.sex | sexJudgment}} {{item.weChatAuth.province + ' ' + item.weChatAuth.city}}</div>
              </div>
            </div>
            <div slot class="ft12 lh22">
              <el-row v-if="true"><label class="col-gray mr10 labelWidth">微信昵称</label>{{item.senderNickname}}</el-row>
              <el-row v-if="true"><label class="col-gray mr10 labelWidth">地区</label>{{item.weChatAuth.province}} {{item.weChatAuth.city}}</el-row>
              <el-row v-if="true"><label class="col-gray mr10 labelWidth">性别</label>{{item.weChatAuth.sex | sexJudgment}}</el-row>
            </div>
        </el-popover>
        <div v-if="list.length > 0 && list.length < total" class="divMore">
          <div class="divMoreBlue" @click="showMore">加载更多</div>
        </div>
      </div>
      <div style="display: flex;margin-top: 10px;" v-if="showIframe == false">
        <el-popover placement="bottom-start" trigger="hover" content="请先添加微信客服，绑定微信。" style="margin-right: 10px;">
          <el-button type="primary" slot="reference" icon="el-icon-user-solid" @click="showUserInfo(true)">添加微信客服</el-button>
        </el-popover>
        <el-popover placement="bottom-start" trigger="hover" content="客服管理列表，可删除客服。">
          <el-button type="primary" slot="reference" icon="el-icon-service" @click="showServicesList(true)">客服列表</el-button>
        </el-popover>
      </div>
    </el-card>
    <!-- 中间内容 -->
    <div class="divMiddle" v-if="showIframe == false">
      <chatRoom ref="chat" v-on:childEvent="childEvent"/>
    </div>
    <!-- 右边内容 -->
    <div class="divRight" style="width:365px">
      <chatSearch :question="question"  :smallTypes='smallType' @setCheckVal='setCheckVal'/>
      <el-button type="primary" v-if="showIframe" style="margin-top: 10px;" icon="el-icon-user-solid" @click="showUserInfo(true)">添加：微信客户</el-button>
      <div v-if="showIframe" class="divTip">重要提示：扫码登录后，网页会重定向，按浏览器返回，返回到好呗呗运营平台。</div>
    </div>
    <el-dialog
      title="添加微信客服"
      :visible.sync="addUserDialog"
      :before-close="closeUserDialog"
      width="30%">
      <el-form :model="user" :rules="rules" ref="ruleForm">
        <el-form-item label="客服账号：" prop="kf_account" label-width="120px">
          <el-input v-model="user.kf_account" autocomplete="off" placeholder="客服账号（格式：fanke@hbbclub）"></el-input>
        </el-form-item>
        <el-form-item label="微信 ID：" prop="invite_wx" label-width="120px">
          <el-input v-model="user.invite_wx" autocomplete="off" placeholder="微信 ID（你的微信 ID）"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
        <el-button @click="showUserInfo(false)">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'微信客服列表（' + servicelist.length + ' 个客服）'" :visible.sync="serversListDialog" width="30%" class="divServiceList">
      <div class="divContext">
        <div class="divItem" v-for="(item, index) in servicelist" :key="index">
          <el-image class="imageAvatar" :src="item.kf_headimgurl" fit="fit"></el-image>
          <div class="divContent">
            <div class="divName">{{item.kf_account}}</div>
            <div class="divOther">{{item.kf_nick + "（微信号：" + item.kf_wx + "）"}}</div>
          </div>
          <div class="divDelete" @click="deleteCustomer(item.kf_account)">
            <i class="el-icon-delete"></i> 删除
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showServicesList(false)">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请选择客服（必须）" :before-close="beforeClose" :visible.sync="showSelectDialog" width="30%" class="divServiceList" :close-on-click-modal="false">
      <div class="divContext">
        <el-radio-group v-model="kf_account" class="divItem" v-for="(item, index) in servicelist" :key="index">
          <el-radio :value="item.kf_account" :label="item.kf_account">{{''}}</el-radio>
          <el-image class="imageAvatar" :src="item.kf_headimgurl" fit="fit" @click="selectKFAccount(item.kf_account)"></el-image>
          <div class="divContent" @click="selectKFAccount(item.kf_account)">
            <div class="divName">{{item.kf_account}}</div>
            <div class="divOther">{{item.kf_nick + "（微信号：" + item.kf_wx + "）"}}</div>
          </div>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectKF" :disabled="(kf_account === '')?true:false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/miniProgram';
  import chatRoom from '@/components/rebroadcast/chatRoom2';
  import chatSearch from '@/components/rebroadcast/chatSearch';
  import { Loading } from 'element-ui';

  export default {
    components: {
      chatRoom,
      chatSearch
    },
    data() {
      var validateAccount = (rule, value, callback) => {
        if (value.includes('@hbbclub') != true) {
          callback(new Error('输入必须包含：@hbbclub'));
        } else {
          callback();
        }
      };
      return {
        smallType: 'search', //@param search搜索；answerBank答疑库 mine我的
        showIframe: false, showSelectDialog: false, kf_account: '',
        addUserDialog: false, serversListDialog: false,
        loading: null,
        question:'',//点击内容
        user: {
          kf_account: '',
          invite_wx: ''
        },
        userName: '', userName2: '', selectId: '', openId: '',
        rules: {
          kf_account: [
            { required: true, message: '请输入 客服账号', trigger: 'blur' },
            { min: 9, max: 18, message: '长度在 9 到 18 个字符', trigger: 'blur' },
            { validator: validateAccount, trigger: 'blur' }
          ],
          invite_wx: [
            { required: true, message: '请输入 微信 ID', trigger: 'blur' },
          ]
        },
        list: [], total: 0, pageSize: 10,
        interval: 0, servicelist: []
      };
    },
    methods: {
      showServicesList: function(val){
        if(val == true){
          this.serversListDialog = val; this.getCustomerList();
        }else if(val == false){
          this.serversListDialog = val;
        }
      },
      beforeClose: function(done){
        this.kf_account = ''; done();
      },
      selectKFAccount: function(kf_account){
        this.kf_account = kf_account;
      },
      deleteCustomer: function(kf_account){
        this.$confirm('你确定要删除账号：' + kf_account + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var that = this;
          api.deleteCustomerService({kf_account: kf_account}).then(res => {
            if(res.code == 200){
              that.$alert('账号删除成功。', '提示', {
               confirmButtonText: '确定',
               callback: action => {
                 that.getCustomerList();
                 if(sessionStorage.getItem("kf_account") == kf_account){
                   sessionStorage.removeItem("kf_account");
                   that.$refs['chat'].clearKFAccount();
                 }
               }
              });
            }
          });
        });
      },
      getCustomerList: function () {
        var that = this;
        api.getCustomerServiceList().then(res => {
          if(res.code == 200){
            that.servicelist = res.data.kf_list;
          }
        })
      },
      childEvent: function(txt){
        this.question = txt
      },
      clickItem: function(senderId, openId){
        if (sessionStorage.getItem("kf_account") === null){
          this.showSelectDialog = true; this.selectId = senderId;
          this.openId = openId; this.getCustomerList();
        }else{
          this.selectId = senderId; this.openId = openId;
          this.$refs['chat'].setSenderId(sessionStorage.getItem("kf_account"), senderId, openId);
        }
      },
      selectKF: function(){
        sessionStorage.setItem("kf_account", this.kf_account); this.showSelectDialog = false;
        this.$refs['chat'].setSenderId(sessionStorage.getItem("kf_account"), this.selectId, this.openId);
      },
      keyUpEnter: function(event){
        var that = this; this.userName2 = this.userName; this.pageSize = 10;
        this.loading = Loading.service({
            target: document.getElementById('divLeftContent'),
            lock: true, text: '加载中，请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.2)'
        });
        api.getUserList({userName: event.target.value, page: 1, size: this.pageSize}).then(res => {
          if(res.code == 200){
            that.list = res.data.data; that.total = res.data.total;
            if(that.loading != null){
              that.loading.close(); that.loading = null;
            }
          }
        })
      },
      showMore: function(){
        if(this.list.length < this.total){
          this.pageSize = this.pageSize + 10;
          this.loading = Loading.service({
              target: document.getElementById('divLeftContent'),
              lock: true, text: '加载中，请稍后...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.2)'
          });
          api.getUserList({userName: this.userName2, page: 1, size: this.pageSize}).then(res => {
            if(res.code == 200){
              that.list = res.data.data; that.total = res.data.total;
              if(that.loading != null){
                that.loading.close(); that.loading = null;
              }
            }
          })
        }
      },
      //添加微信客户
      addUserInfo: function(){
        var that = this;
        this.$refs["ruleForm"].validate((valid) => {
          if(valid){
            api.addUserClient(that.user).then(res => {
              if(res.code == 200){
                sessionStorage.setItem("kf_account", that.user.kf_account)
                that.$refs["ruleForm"].resetFields();
                that.addUserDialog = false;
                that.$alert('账号 创建成功。', '提示：', {confirmButtonText: '确定'})
              }
            });
          }
        });
      },
      //显示、关闭 微信客户
      showUserInfo: function(val){
        if(val == true){
          this.addUserDialog = val;
        }else if(val == false){
          this.$refs["ruleForm"].resetFields();
          this.addUserDialog = val;
        }
      },
      //关闭 微信客户
      closeUserDialog: function(done){
        this.$refs["ruleForm"].resetFields(); done();
      },
      //右侧选中的答案
      setCheckVal(val){
        if(val){
          this.$refs["chat"].setContent(val);
        }
      },
      refreshData(){
        var that = this;
        this.interval = setInterval(()=>{
          var params = {page: 1, size: that.pageSize}
          if(that.userName2.trim() != ''){
            params.username = that.userName2;
          }
          api.getUserList(params).then(res => {
            if(res.code == 200){
              that.list = res.data.data; that.total = res.data.total;
              if(that.loading != null){
                that.loading.close(); that.loading = null;
              }
            }
          })
        }, 3000);
      }
    },
    mounted(){
      this.loading = Loading.service({
          target: document.getElementById('divLeftContent'),
          lock: true, text: '加载中，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
      });
      this.refreshData();
    },
    beforeDestroy(){
      clearInterval(this.interval);
    }
  }
</script>
<style lang="less" scoped>
  .miniProgram {
    display: flex;
    font: 13px;
  }
  .iframe{
    width: 100%;
    height: 800px;
    border: 0; margin-right: 10px;
    box-shadow: '0 0 6px #b1b1b1';
  }
  .miniProgram .divLeft{
    width: 315px; height: 100%;
  }
  .miniProgram .divLeft .divSearch{
    display: flex; flex-direction: row;
  }
  .miniProgram .divLeft .divSearch .divExpand{
    width: 30px; display: flex; cursor: pointer;
    align-items: center; justify-content: center; margin-left: 5px;
  }
  .miniProgram .divLeft .divContent{
    padding-top: 20px; height: 480px;
    overflow-x: hidden; overflow-y: auto;
  }
  .miniProgram .divLeft .divContent .divItem{
    display: flex; flex-direction: row; align-items: center;
    margin-bottom: 10px; cursor: pointer; padding: 5px; outline: none;
  }
  .miniProgram .divLeft .divContent .divItemOver{
    background-color: #fffeef;
  }
  .miniProgram .divLeft .divContent .divItem .imageAvatar{
    width: 40px; height: 40px; min-width: 40px;
    border-radius: 50%; margin-right: 10px;
  }
  .miniProgram .divLeft .divContent .divItem .divRight{
    width: 224px;
  }
  .miniProgram .divLeft .divContent .divItem .divRight .divName{
    font-size: 14px; font-family: 'Microsoft Yahei';
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .miniProgram .divLeft .divContent .divItem .divRight .divInfo{
    font-size: 14px; font-family: 'Microsoft Yahei'; color: #999;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .labelWidth{
    min-width: 50px; display: inline-block;
    text-align: right;
  }
  .miniProgram .divMiddle{
    flex: 1;
    margin-left:10px;margin-right:10px;
  }
  .miniProgram .divRight{

  }
  .miniProgram .divRight .divTip{
    font-size: 14px; color: rgb(241,59,119); margin-top: 10px;
  }
  .miniProgram .div-emptydata{
    font-size: 14px;
    border: 1px dashed #cccccc;
    text-align: center;
    line-height: 27px;
    color: #999;
  }
  .miniProgram .divMore{
    text-align: center;
  }
  .miniProgram .divMore .divMoreBlue{
    font-size: 14px;
    color: #7e7eff; cursor: pointer;
  }
  .miniProgram .divServiceList .divContext{
    width: 100%; height: auto; max-height: 500px;
    overflow-x: hidden; overflow-y: auto;
  }
  .miniProgram .divServiceList .divContext .divItem:nth-child(even){
    display: flex; flex-direction: row; align-items: center; justify-content: center;
    margin-bottom: 15px; padding: 5px; background-color: #f7f7ff;
  }
  .miniProgram .divServiceList .divContext .divItem:nth-child(odd){
    display: flex; flex-direction: row; align-items: center; justify-content: center;
    margin-bottom: 15px; padding: 5px; background-color: #fffeef;
  }
  .miniProgram .divServiceList .divContext .divItem .el-radio{
    margin-right: 10px;
  }
  .miniProgram .divServiceList .divContext .divItem .imageAvatar{
    width: 40px; height: 40px; border-radius: 50%; overflow: hidden;
    margin-right: 10px; cursor: pointer;
  }
  .miniProgram .divServiceList .divContext .divItem .divContent{
    flex: 1; width: 0; cursor: pointer;
  }
  .miniProgram .divServiceList .divContext .divItem .divContent .divName{
    font-size: 14px; color: #333; overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; line-height: 18px;
  }
  .miniProgram .divServiceList .divContext .divItem .divContent .divOther{
    font-size: 14px; color: #999; overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; line-height: 18px;
  }
  .miniProgram .divServiceList .divContext .divItem .divDelete{
    font-size: 14px; color: #ff4e4e; cursor: pointer;
  }
</style>
