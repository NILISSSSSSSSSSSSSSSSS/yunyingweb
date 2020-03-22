<template>
  <div class="chatRoom" id="chatRoom">
    <div class="chatTop" id="chatContent">
      <div v-for="(item, index) in messageList" :key='index'
        :class="(index >= (messageList.length - 1))?'divItem':'divItem mb30'">
        <div class="messageRow other">
          <div class="messageT">
            <div class="messageL">
              {{item.xcxMsg.sender.senderNickname}}
              <span class="time col-gray mt5">{{item.xcxMsg.CreateTime | formatDate2}}</span>
            </div>
            <el-avatar class="avater" size="small" :src="item.xcxMsg.sender.senderAvatar"></el-avatar>
          </div>
          <!-- 文本 -->
          <div v-if="item.xcxMsg.MsgType == 'text'" class="con txt mt5" @click="getText($event, item.xcxMsg.Content)"
            v-html="txtToImg(item.xcxMsg.Content)"></div>
          <!-- 图片 -->
          <div v-if="item.xcxMsg.MsgType == 'image'" class="con mt5">
            <a :href="item.xcxMsg.PicUrl" target="_blank" style="cursor: pointer;">
              <img :src="item.xcxMsg.PicUrl" @click="$viewImage(item.xcxMsg.PicUrl,'picture')"/>
            </a>
          </div>
        </div>
        <div :class="(subIndex >= (item.answers.length - 1))?'messageRow self':'messageRow mb30 self'"
          v-for="(subItem, subIndex) in item.answers" :key='subIndex'>
          <div class="messageT">
            <div class="messageL">
              在线客服
              <span class="time col-gray mt5">{{subItem.t.seconds | formatDate2}}</span>
            </div>
            <el-avatar class="avater" size="small"
              src="https://hbb-deploy.oss-cn-beijing.aliyuncs.com/5e53c24416d3fc6f1c1a7422.jpg"></el-avatar>
          </div>
          <!-- 文本 -->
          <div v-if="subItem.contentType == 'text'" class="con txt mt5" @click="getText($event, subItem.content)">
            {{subItem.content | getContext}}
          </div>
          <!-- 图片 -->
          <div v-if="subItem.contentType == 'image'" class="con mt5">
            <img :src="subItem.content | getAliUrl" @click="preview(subItem.content)" />
          </div>
        </div>
      </div>
      <!-- <div v-if="messageList.length > 0 && messageList.length < total" class="divMore">
        <div class="divMoreBlue" @click="showMore">加载更多</div>
      </div> -->
    </div>

    <div class="chatInput mt30">
      <el-input type="textarea" placeholder="请输入内容..." rows='5' v-model="inputVal" :disabled="disabled"></el-input>
      <div class="buttonRow">
        <el-upload ref='upload' action="" :disabled="disabled" accept="image/x-png,image/gif,image/jpeg"
          :auto-upload="false" :show-file-list="false" :on-change="selectImage">
          <i class="el-icon-folder-opened"></i>
        </el-upload>
        <el-button size="small" type="primary" @click="sendMsg" :disabled="disabled">发送</el-button>
      </div>
    </div>
  </div>


</template>
<script>
  import api from '@/servers/miniProgram';
  import { Loading } from 'element-ui';

  export default {
    data() {
      return {
        kf_account: '',
        interval: 0,
        loading: null,
        senderId: '',
        openId: '',
        inputVal: "",
        disabled: true,
        messageList: [],
      }
    },
    methods: {
      //图片预览
      preview(val) {
        let imgUrl='';
        var json = JSON.parse(val);

        if (json.aliUrl == undefined) {
          imgUrl= 'https://hbb-deploy.oss-cn-beijing.aliyuncs.com/5e53c74016d3fc6f1c1a7426.png';
        } else {
          imgUrl= json.aliUrl;
        }
        this.$viewImage(imgUrl,'picture');
      },
      getMsgId: function () {
        if (this.messageList.length > 0) {
          return this.messageList[this.messageList.length - 1].id;
        } else if (this.messageList.length <= 0) {
          return ''
        }
      },
      // showMore: function(){
      //   if(this.messageList.length < this.total){
      //     this.currentPage ++;
      //     this.callbackRefresh();
      //   }
      // },
      setContent: function (txt) {
        this.inputVal = txt;
      },
      getText: function (event, txt) {
        event.stopPropagation(); event.preventDefault();
        if (txt.includes("{\"touser\"") == true) {
          txt = JSON.parse(txt).text.content;
        }
        this.$emit("childEvent", txt);
      },
      sendMsg: function () {
        if (this.inputVal.trim() == '') {
          this.$alert('消息不能为空。', '提示：', { confirmButtonText: '确定' })
        } else {
          if (this.kf_account.trim() == '') {
            this.$alert('点击左边，重选择客服后聊天。', '重选客服：', { confirmButtonText: '确定' }); return;
          }
          var msgId = this.getMsgId();
          if (msgId != '') {
            var params = {
              "id": msgId,
              "msgInfo": {
                "touser": this.openId,
                "msgtype": "text",
                "text": {
                  "content": this.inputVal
                },
                "customservice": {
                  "kf_account": this.kf_account
                }
              }
            };
            var that = this;
            api.sendMsg(params).then(res => {
              if (res.code == 200) {
                that.inputVal = ''; that.callbackRefresh();
              }
            })
          }
        }
      },
      selectImage: function (file, fileList) {
        if (this.kf_account.trim() == '') {
          this.$alert('点击左边，重选择客服后聊天。', '重选客服：', { confirmButtonText: '确定' }); return;
        }
        var that = this; var formData = new FormData();
        formData.append('type', "image"); formData.append('file', file.raw);

        api.uploadFileImg(formData).then(res => {
          if (res.code == 200) {
            var msgId = that.getMsgId();

            var params = {
              "id": msgId,
              "msgInfo": {
                "touser": that.openId,
                "aliUrl": res.data.aliyunInfo.url,
                "msgtype": "image",
                "image": {
                  "media_id": res.data.wxInfo.media_id
                },
                "customservice": {
                  "kf_account": that.kf_account
                }
              }
            };
            api.sendMsg(params).then(res => {
              if (res.code == 200) {
                that.callbackRefresh();
              }
            })
          }
        })
      },
      setSenderId(kf_account, senderId, openId) {
        this.kf_account = kf_account;
        this.senderId = senderId; this.openId = openId; this.messageList = []; this.disabled = false;
        this.loading = Loading.service({
          target: document.getElementById('chatRoom'),
          lock: true, text: '加载中，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        });
        this.refreshData();
      },
      clearKFAccount() {
        this.kf_account = '';
      },
      refreshData: function () {
        var that = this; clearInterval(this.interval);
        this.interval = setInterval(() => {
          var params = {};
          if (that.senderId.trim() != '') {
            params.userid = that.senderId;

            api.getMsgDetails(params).then(res => {
              if (res.code == 200) {
                that.messageList = res.data.data;
                if (that.loading != null) {
                  that.loading.close(); that.loading = null;
                }
              }
            })
          }
        }, 3000);
      },
      callbackRefresh: function () {
        var that = this;
        var params = {};
        if (this.senderId.trim() != '') {
          params.userid = this.senderId;
          api.getMsgDetails(params).then(res => {
            if (res.code == 200) {
              that.messageList = res.data.data;
            }
          })
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.interval);
    },
    watch: {
      messageList(val, oldVal) {
        if (oldVal.length <= 0) {
          var timeout = setTimeout(() => {
            clearTimeout(timeout);
            document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;
          }, 300);
        } else if ((val.length != oldVal.length) || (val[val.length - 1].answers.length != oldVal[oldVal.length - 1].answers.length)) {
          var timeout = setTimeout(() => {
            clearTimeout(timeout);
            document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;
          }, 300);
        }
      }
    }
  }
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
      max-height: 400px;
      overflow: auto;
      height: 529px;
      padding: 5px;
      width: 100%;
      padding: 10px;
      border: 1px solid #ababab;
      box-sizing: border-box;

      .divItem {
        width: 100%;

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
            cursor: pointer;

            img,
            video,
            audio {
              max-width: 200px;
              max-height: 150px;
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
            background: #fafff3;
            text-align: left;
            cursor: pointer;
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
            background: #f2f2f2;
          }
        }
      }
    }

    .chatInput {
      margin-top: 20px;

      /deep/.el-textarea__inner {
        padding: 25px 15px;
        border: 1px solid #ababab;
        resize: none;
      }

      .buttonRow {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

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

  // .chatRoom .chatTop .divMore{
  //   text-align: center;
  // }
  // .chatRoom .chatTop .divMore .divMoreBlue{
  //   font-size: 14px;
  //   color: #7e7eff; cursor: pointer;
  // }
</style>