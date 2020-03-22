<template>
  <div class="chatRoom" v-loading="loading">
    <div class="chatTop" ref="chatContainer" @scroll="onChatContainerScroll($event)">
      <div>
        <el-button type="text" v-if="isMore" style="display: block;margin: 0 auto;font-size: 13px;" @click="seeMore">
          查看更多消息</el-button>
        <!-- 每一行的聊天消息，只显示来源为IMMSG的消息 -->
        <div v-for="(item, index) in msgList" :key="index">
          <!-- {{ 如果不是回复 }} -->
          <div v-if="(item.msgSource == 'IMMSG') && (item.txImMsg.msgItem.type != 'SYSTEM')">
            <div class="messageRow mb30 self" :class="item.txImMsg.sender.senderId == userInfo.id ? 'self': 'other'">
              <!-- 来自腾讯IM的消息 -->
              <div class="messageT">
                <div class="messageL">
                  <template v-if="bigType=='user'">
                    <span @click="reply(item)" class="replyText">回复</span>
                    <span v-if="item.kecheng && bigType=='user'"
                      style="margin-left: 10px;">课程名字：{{ item.kecheng.name}}</span>
                  </template>
                  <div v-if="bigType=='store' && (item.txImMsg.sender.senderId != userInfo.id)">
                    <span @click="findHim(item)" class="color-blue mr5 ml5" style="cursor: pointer"> @TA </span>
                    <span @click="chatHim(item)" class="color-blue" style="cursor: pointer">私聊TA</span>
                  </div>
                  <span @click="collection(item.txImMsg)"
                    v-if="item.txImMsg.sender.senderId == userInfo.id && item.txImMsg.msgType=='ANSWER'"
                    class="color-blue mr5 ml5" style="cursor: pointer">收藏</span>
                  <span class="col-sucs ft12 mr5 ml5" v-if="item.txImMsg.sender.senderId == userInfo.id">全部成功</span>
                  {{item.txImMsg.sender.senderNickname}}
                  <span class="time col9 mt5">{{ item.createT.seconds | formatDate2}}</span>
                  <!-- 对于已经回答的问题，需要做标识 -->
                  <span v-if="item.answers.length!==0" class="mt5 col-sucs ft12">已回复</span>
                </div>
                <!-- 头像 -->
                <el-avatar class="avater" size="small" :src="item.txImMsg.sender.senderAvatar"></el-avatar>

              </div>
              <!-- 消息类型 -->
              <div class="con txt mt5">
                <span class="imText" v-if="item.txImMsg.msgItem.type == 'TEXT'"
                  @click="setQuestion(item.txImMsg.msgItem.content)">
                  <!-- 回复消息需要在前面加上@ -->
                  <template v-if="item.txImMsg.msgItem.isAt" class="mr5">
                    <span>@{{item.txImMsg.msgItem.atObj.nickname}}</span>
                  </template>
                  <span v-if="item.txImMsg.msgType=='QUESTION'" style="color:#c95c5c">提问:</span>
                  {{item.txImMsg.msgItem.content}}
                </span>
                <img @load="mediaLoaded()" :src="item.txImMsg.msgItem.content"
                  @click="$viewImage(item.txImMsg.msgItem.content,'picture')"
                  v-if="item.txImMsg.msgItem.type == 'IMAGE'" style="cursor: pointer;" />
                <audio @load="mediaLoaded()" class="tableAudio" :src="item.txImMsg.msgItem.content"
                  v-if="item.txImMsg.msgItem.type == 'VOICE'" controls></audio>
                <video @load="mediaLoaded()" :src="item.txImMsg.msgItem.content"
                  v-if="item.txImMsg.msgItem.type == 'VIDEO'" controls></video>
                <img v-if="emoj" :src="emojiUrl + emojiMap[emoj]" style="width:30px;height:30px" />
              </div>
              <!-- 私聊回复 -->
              <div v-if="item.status=='ANSWERED' && item.answers.length!==0 && bigType=='user'"
                style="margin-left: 40px;     background: #f6f6f6;padding: 10px">
                回复：
                <div class="selfChatAnswer" v-for="(cc,index) in item.answers"
                  v-if="cc.content && cc.content.sender && cc.content.msgItem">
                  <span>{{ cc.content.sender.senderNickname  }}:</span>
                  <div class="con txt" style="    display: inline-block; margin-left: 5px;">
                    <span class="imText" v-if="cc.content.msgItem.type == 'TEXT'"
                      @click="setQuestion(cc.content.msgItem.content)">
                      <!-- 回复消息需要在前面加上@ -->
                      <!-- <template v-if="cc.content.msgItem.isAt" class="mr5">
                            <span>@{{cc.content.msgItem.atObj.nickname}}</span>
                          </template> -->
                      <span v-if="cc.content.msgType=='QUESTION'" style="color:#c95c5c">提问:</span>
                      {{cc.content.msgItem.content}}
                    </span>
                    <img @load="mediaLoaded()" :src="cc.content.msgItem.content"
                      @click="$viewImage(cc.content.msgItem.content,'picture')"
                      v-if="cc.content.msgItem.type == 'IMAGE'" style="cursor: pointer;" />
                    <audio @load="mediaLoaded()" class="tableAudio" :src="cc.content.msgItem.content"
                      v-if="cc.content.msgItem.type == 'VOICE'" controls></audio>
                    <video @load="mediaLoaded()" :src="cc.content.msgItem.content"
                      v-if="cc.content.msgItem.type == 'VIDEO'" controls></video>
                    <img v-if="emoj" :src="emojiUrl + emojiMap[emoj]" style="width:30px;height:30px" />
                  </div>
                  <span @click="collection(cc.content)" v-if="cc.content.msgItem.content"
                    class="color-blue selfCollect mr5 ml5">收藏</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    <p class="col-red" v-if="bigType=='user'">请先点击回复按钮再发送消息</p>
   
    <!-- 发送框 -->
    <div class="chatInput mt30">
      <el-input type="textarea" :disabled="isDisabled" placeholder="请输入内容" rows="3" v-model="inputVal"></el-input>

      <div class="buttonRow">
        <!-- 表情选择弹框 -->
        <el-popover class="tbBox" placement="right" width="400" trigger="click">
          <div class="emojis">
            <div v-for="(item, index) in emojis" class="emoji" :key="index" @click="chooseEmoji(item)">
              {{item}}
            </div>
          </div>
          <i class="el-icon-picture-outline-round iconTb" slot="reference"></i>
        </el-popover>
        <!-- 文件发送 -->
        <el-upload :disabled="isDisabled" :before-upload="beforeAvatarUpload" :show-file-list="fileShow" ref="upload"
          class="uploadBox" :action="uploadUrl" :on-error='errorFun'
          :on-success="(v,res)=>handleAvatarSuccess('banner',res)">
          <i class="el-icon-folder-opened"></i>
        </el-upload>
        <el-button :disabled="isDisabled" size="small" type="primary"
          @click="sendMessage(inputVal, 'TEXT',0,()=>{inputVal=''})">发送</el-button>
      </div>
    </div>
    <!--文件预览弹框 -->
    <el-dialog title="预览" :visible.sync="fileObj.fileDia" width="30%">
      <div class="previewWrapper">
        <img :src="fileObj.url" alt="" v-if="fileObj.type=='IMAGE'">
        <video :src="fileObj.url" controls v-if="fileObj.type=='VIDEO'"></video>
        <audio :src="fileObj.url" controls v-if="fileObj.type=='VOICE'"></audio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileObj.fileDia = false">取 消</el-button>
        <el-button type="primary" @click="sendImg">发送</el-button>
      </span>
    </el-dialog>
    <!-- 添加答疑库弹框 -->
    <addNewAnswer :menuObj='menuObj' @closeMain="menuObj.isShow = false" />
  </div>
</template>
<script>
  import addNewAnswer from '@/components/rebroadcast/addNewAnswer';

  import hbApi from "@/servers/huibo";
  import userApi from "@/servers/user";
  import { emojiMap, emojiName, emojiUrl } from "@/utils/emojiMap";
  import { emojis } from "@/utils/emojis";
  import { getObjectId, getMsgTypeFromRaw } from "@/utils/utils";
  import config from "@/config/api";
  import Vue from "vue";


  const token = Vue.cookie.get("token");
  const userInfo = JSON.parse(Vue.cookie.get("userInfo"));

  export default {
    components: {
      addNewAnswer
    },
    computed: {
      isDisabled() {
        return (this.disableSelfChat && this.bigType == 'user') 
      }
    },
    props: {
      //smallType @param search搜索；answerBank答疑库 mine我的，
      smallType: {
        default: ""
      },
      //bigType @param store门店；user用户，
      bigType: {
        default: "user"
      },
      checkVal: {
        default: ""
      },
      allInfo: {
        type: Object,
        default: () => ({})
      },
      currentName: {
        type: String,
        default: ''
      },
      //私聊切换的用户id
      senderId: {
        type: String,
        default: ''
      },
      //群聊搜素
      groupForm: {
        type: Object,
        default: () => ({
        })
      },
      //私聊搜素
      selfForm: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        isMore: false,
        isQuestion: true,
        // 选择文件相关
        fileObj: { url: "", type: "", length: '', fileDia: false },
        fileShow: false,
        loading: false,
        inputVal: "",
        emoj: "",
        messageList: [
          { name: "我", isSelf: true },
          { name: "网易", isSelf: false },
          { name: "新浪", isSelf: false },
          { name: "我", isSelf: true }
        ],
        uploadUrl: config.ossUpload || "", //文件上传
        // 表情相关
        emojiMap: emojiMap,
        emojiName: emojiName,
        emojiUrl: emojiUrl,
        emojis: emojis,
        //收藏相关
        menuObj: {
          isShow: false,
          data: {}
        },

        // websocket连接相关
        enableScrollBottom: true,
        webSocketUrl: config.wsSocketUrl,
        msgList: [],
        loadLength:10,

        userInfo: {
          // 当前登录用户信息
          id: ""
        },
        disableSelfChat: false,//能否私聊
        atWho: null, // 回复的对象
        replyMsgId: null // 回复的消息对象

      };
    },
    created() {
      // this.initWebSocket(); // 建立websocket连接
    },

    destroyed() {
      this.websock ? this.websock.close() : null; //离开路由之后断开websocket连接
    },

    mounted() {
      this.userInfo = userInfo;
    },

    methods: {
      //点击私聊回复
      reply(item) {
        this.replyMsgId = item.id;
        this.disableSelfChat = false;
      },
      //发送图片
      sendImg() {
        this.sendMessage(this.fileObj.url, this.fileObj.type, this.fileObj.length, () => {
          this.fileObj = { url: "", type: "", length: "", fileDia: false };
        });
      },
      beforeAvatarUpload(file) {
        if (!(file.type.includes('video') || file.type.includes('image') || file.type.includes('audio'))) {
          this.$message.error('请上传视频/音频/文本格式的文件');
          return false;
        }
        this.loading = true;
      },
      errorFun() {
        this.loading = false;
      },
      //收藏
      collection(row) {
        let newObj = JSON.parse(JSON.stringify(row));
        let questionId = newObj.orgId;
        for (let item of this.msgList) {
          if (item.id == questionId) {
            newObj.questionName = item.txImMsg.msgItem.content;
          }
        }
        // 如果没找到问题名字，则从接口处查找
        if (!newObj.questionName) {
          hbApi.msgDetail({ queryParam: questionId }).then(res => {
            if (res.code === 200 && res.data) {
              newObj.questionName = res.data.txImMsg.msgItem.content
            }
            else {
              newObj.questionName = "";
            }
            this.menuObj = { isShow: true, data: newObj }
          }).catch(err => {
            newObj.questionName = "";
            this.menuObj = { isShow: true, data: newObj }
          })

        }
        else {
          this.menuObj = { isShow: true, data: newObj }
        }

        console.log(JSON.parse(JSON.stringify(newObj)));

      },
      //@他
      findHim(msg) {
        this.scrollToBottom();
        this.atWho = msg.txImMsg.sender;
        this.replyMsgId = msg.id;
        this.inputVal += "@" + msg.txImMsg.sender.senderNickname + " ";
      },
      //私聊
      chatHim(him) {
        this.$emit("chatWho", him);
      },
      // 选择表情
      chooseEmoji(emoji) {
        this.inputVal += emoji;
      },
      setQuestion(txt) {
        if (!txt.length) return;
        this.$emit("getQuestion", txt);
      },
      //图片文件上传
      handleAvatarSuccess(type, res) {

        if (res.response.code === 200) {
          let fileType = getMsgTypeFromRaw(res.raw.type);
          this.fileObj = {
            url: res.response.data.url,
            type: fileType,
            fileDia: true,
            length: 0,
          }
          if (fileType.includes('VOICE')) {
            this.$utils.getAudioDuration(res.response.data.url).then(duration => {
              this.fileObj.length = duration;
              this.loading = false;
            })
          }
          else {
            this.loading = false;
          }
        }
      },
      // 通过服务发送消息
      sendMessage(content, contentType, duration, callFun) {

        if (!content) {
          this.$message.error("发送内容不能为空"); return;
        }
        // 如果是私聊
        if (this.bigType == 'user') {
          let params = {
            msgId: this.replyMsgId,
            item: {
              type: contentType,
              content: content,
              length: duration
            }
          };
          hbApi.replyMsg(params).then(res => {
            callFun();
            this.disableSelfChat = true;
            console.log("消息发送成功");
          });
        }
        // 如果是群聊
        else {
          // 回复消息
          if (content.indexOf("@") != -1 && this.atWho) {
            let atWho = this.atWho,
              regMatch = content.match(/@.*?\s+(.*)/),
              params = {
                msgId: this.replyMsgId,
                item: {
                  type: contentType,
                  content: content,
                  length: duration
                }
              };

            if (regMatch) {
              params.item.content = regMatch[1];
            }

            hbApi.replyMsg(params).then(res => {
              callFun();
              console.log("消息发送成功");
            });
          } else {
            // 广播消息
            let params = {
              id: this.allInfo.keChengId,
              item: {
                type: contentType,
                content: content,
                length: duration
              }
            };
            hbApi.sendBroadCast(params).then(res => {
              console.log("消息发送成功");
              callFun();
            });
          }
        }

      },
      // 上拉加载历史消息
      getHistoryMsgs(endId) {
        let cmd,filter;
        if(this.bigType == 'store'){
          cmd='GROUPHISTORYMSG';
          filter=this.groupForm.type=='all' ? false : true;
        }
        else{
          cmd='USERHISTORYMSG';
          filter=this.selfForm.type=='all' ? false : true;
        }
        let loadHistoryCmd = {
          id: getObjectId(),
          cmd: cmd,
          body: {
            endId: endId,
            size: this.loadLength,
            filter:filter
          }
        };
        this.websocketsend(JSON.stringify(loadHistoryCmd));
      },
      // 消息加载完毕后，聊天页面需要滚动到底部，聊天窗口滚动到底部，这个写法有时候不灵，请考虑用其他方式替换
      scrollToBottom() {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          let ele = this.$refs.chatContainer;
          ele.scrollTop = ele.scrollHeight;
          this.enableScrollBottom = false;
        }, 100);
      },
      // 媒体文件由于本身内容有高度的原因，所以加载完成时需要将容器滚动到底部
      mediaLoaded() {
        // this.scrollToBottom();
      },
      seeMore() {
        this.loading = true;
        let firstMsg = this.msgList[0];
        if (firstMsg) {
          this.getHistoryMsgs(firstMsg["id"]);
        }
      },
      // 聊天窗口滚动操作
      onChatContainerScroll(e) {
        // let ele = e.target,
        //   scrollHeight = ele["scrollHeight"],
        //   clientHeight = ele["clientHeight"],
        //   scrollTop = ele["scrollTop"];

        // // 页面处于底部
        // if (scrollTop + clientHeight == scrollHeight) {
        //   this.enableScrollBottom = false;
        // } else {
        //   this.enableScrollBottom = true;
        // }

        // //如果滚动到顶部，则加载历史消息
        // if (scrollTop == 0) {
        //   let firstMsg = this.msgList[0];
        //   if (firstMsg) {
        //     this.getHistoryMsgs(firstMsg["id"]);
        //   }
        // }
      },

      initWebSocket() {
        this.loading=true;
        if (this.websock) {
          this.websock.close();
        }
        this.msgList = [];
        this.enableScrollBottom = true;
        //初始化weosocket
        // 测试数据，等接口完成后需要替换成新的
        let url = `${this.webSocketUrl}?token=${token}`;

        this.websock = new WebSocket(url);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },

      websocketonopen() {
        let regMsgCmd;
        //连接建立之后执行send方法发送数据
        if (this.bigType == 'store') {
          regMsgCmd = {
            id: getObjectId(),
            cmd: "REGGROUP",
            body: {
              groupIds: this.groupForm.groupIds
            }
          };
        }
        else {
          regMsgCmd = {
            id: getObjectId(),
            cmd: "REGUSER",
            body: {
              userId: this.senderId
            }
          };
        }

        this.websocketsend(JSON.stringify(regMsgCmd));
      },
      websocketonerror() {
        this.loading = false;
        //连接建立失败重连
        console.log("建立连接失败");
      },
      websocketonmessage(e) {
        console.log(e);
        //数据接收
        let data = JSON.parse(e.data),
          cmd = data["cmd"];

        if (data.err) {
          this.loading = false;
          // todo 提示错误消息
        } else {
          // 根据cmd不同类型来处理消息
          //注册成功后获取历史记录
          if(['REGGROUP', 'REGUSER'].includes(cmd)){
            // 如果是第一次加载历史记录，则让滚动条滚动到底部
            Vue.cookie.set('firstLoad','true')
            this.getHistoryMsgs(getObjectId())
          }
            // 监听历史消息
          if (['GROUPHISTORYMSG', 'USERHISTORYMSG'].includes(cmd)) {
            console.log("收到的历史消息" + JSON.stringify(data.respBody));
            let msgs = data.respBody.msgs;
            if (msgs) {
              this.msgList = msgs.concat(this.msgList);
              this.isMore = msgs.length < this.loadLength ? false : true;
              // 如果是第一次加载历史记录，则让滚动条滚动到底部
              if(Vue.cookie.get('firstLoad')=='true'){
                this.scrollToBottom();
                Vue.cookie.set('firstLoad','false');
              }
            }
            else {
              this.isMore = false;
            }
            this.loading = false;
            this.$emit('tellForm', { name: this.bigType, val: false })
          }

          // 新消息
          if (['GROUPNEWMSG', 'USERNEWMSG'].includes(cmd)) {
            console.info("收到的新消息" + JSON.stringify(data.respBody.msgs));
            let msgs = data.respBody.msgs;
            if (msgs) {
              //如果是群聊里面的@回复，会推送两条消息，如果是是普通消息或者私聊里面的回复，则推松一条消息
              //如果是回复
              if (msgs.length !== 0 && msgs[0].status == 'ANSWERED') {
                this.byIdInsertCon(this.msgList, msgs);
                this.bigType=='store' ? this.scrollToBottom() : null;
              }
              // 如果是普通消息
              else {
                this.msgList = this.msgList.concat(msgs);
                this.scrollToBottom();
              }

            }
          }
        }


      },
      websocketsend(data) {
        //数据发送
        this.loading = true;
        this.websock.send(data);
      },
      websocketclose(e) {
        this.loading = false;
        //关闭
        console.log("断开连接", e);
      },
      //有新回复时，把根据新消息id插入到对应的answer里面
      byIdInsertCon(val, msgs) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].id == msgs[0].id) {
            val[i] = msgs[0];
            this.$set(val, i, msgs[0])
            console.log(JSON.stringify(val));

          }
        }
      },

    },
    watch: {
      //监听群聊条件搜索
      groupForm: {
        handler: function (val, oldVal) {
          if (val.isSearch) {
            this.initWebSocket();
          }
        },
        // 深度观察监听
        deep: true,
        immediate: true,
      },
      //监听私聊条件搜索
      selfForm(val, oldVal) {
        if (val.isSearch) {
          this.initWebSocket();
        }
      },
      checkVal(val, oldVal) {
        if (val) {
          this.inputVal = val;
        }
      },

      bigType(val) {
        this.msgList = [];

        this.inputVal = '';
        //群聊初始化
        if (val == 'store') {
          this.disableSelfChat = false;

        }
        else {
          this.disableSelfChat = true;
        }
      },

      senderId(val) {
        // 私聊初始化
        if (val) {
          this.disableSelfChat = true;
          this.initWebSocket();
        }
      },
      msgList(val) {
        if (val && val.length !== 0 && this.bigType == 'user') {
          for (let item of val) {
            if (item.answers && item.answers.length !== 0) {
              for (let cc of item.answers) {
                typeof (cc.content) == 'string' ? cc.content = JSON.parse(cc.content) : null;
              }
            }
          }
        }
      },
      // 点击回播间tab则让滚动条滚动到底部
      currentName(val) {
        if (val == 'rebroadcastRoom') {
          this.scrollToBottom();
        }
      },
    }
  };
</script>
<style scoped lang="less">
  /deep/ .el-card__body {
    width: 100%;
  }

  .chatRoom {
    width: 100%;
    display: flex;
    font-size: 13px;
    flex-direction: column;

    .chatTop {
      /* max-height: 400px; */
      overflow: auto;
      height: 76vh;
      padding: 5px;
      width: 100%;
      padding: 10px;
      border: 1px solid #e5e1e1;
      box-sizing: border-box;

      .messageRow {
        display: flex;
        flex-direction: column;

        .messageT {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .messageL {
            margin-right: 5px;
            justify-content: flex-end;
            display: flex;
            flex-wrap: wrap;

            .time {
              display: block;
              font-size: 12px;
              width: 100%;
            }
          }
        }

        .con {
          .imText {
            padding: 5px;
            border-radius: 5px;
            display: inline-block;
            cursor: pointer;
            text-align: left;
          }
        }

        .con {

          img,
          video {
            max-width: 240px;
            /* max-height: 150px; */
          }
        }

        .txt {
          padding: 5px;
          border-radius: 5px;
          max-width: 400px;
          word-break: break-word;
        }
      }

      .self {
        text-align: right;
        align-items: flex-end;

        .con {
          .imText {
            background: #9eea6a;
          }

        }
      }

      .other {
        text-align: left;
        align-items: baseline;

        .messageT {
          flex-direction: row-reverse;

          .messageL {
            margin-left: 10px;
            flex-direction: row-reverse;
          }
        }

        .con {
          margin-left: 30px;

          .imText {
            background: #f2f2f2;
          }

        }
      }
    }

    .chatInput {
      margin-top: 20px;

      /deep/.el-textarea__inner {
        /* padding: 5px 15px; */
      }

      .buttonRow {
        margin-top: 10px;
        text-align: right;
        /* height: 140px; */

        .iconTb,
        div {
          font-size: 21px;
          color: #d1d1d1;
          margin-right: 20px;
          cursor: pointer;

          display: inline-block;
        }
      }
    }
  }

  .emojis {
    height: 160px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;

    .emoji {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .uploadBox {
    position: relative;

    /deep/ .el-upload-list--picture {
      position: absolute;
      right: -70px;
      top: 33px;
    }
  }

  .heightSet {
    height: 140px !important;
  }

  /deep/ .el-upload-list__item {
    width: 0
  }

  .previewWrapper {
    text-align: center;

    img,
    video {
      max-width: 300px;
    }

    audio {
      width: 340px;
    }
  }

  .replyText {
    margin-left: 10px;
    cursor: pointer;
    color: #e90d0d;
  }

  .selfChatAnswer {
    display: flex;
    align-items: center;

    .selfCollect {
      cursor: pointer;
      width: 50px;
    }

    .imText {
      background: transparent !important;
    }
  }
</style>