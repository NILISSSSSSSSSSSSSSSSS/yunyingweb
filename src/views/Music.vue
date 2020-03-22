<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-button @click="startLive">开始直播</el-button>
      <el-button>暂停直播</el-button>
      <el-button>重置直播</el-button>
      
      <el-switch v-model="live1jinyan" active-color="#13ce66" inactive-color="#ff4949" style="margin-left: 10px; margin-right:10px;">
      </el-switch>
      <span style="margin-left: 10px; margin-right:10px;">{{live1jinyan ? '开启全员禁用' : '关闭全员禁言'}}</span>
      <span>频道：123</span>
    </el-col>
    <el-col :span="16">
      <div style="height: 500px; border: 1px solid #ccc; margin-top: 10px;overflow: auto;">
        <div style="margin: 10px;">

        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div style="height: 500px; border: 1px solid #ccc;margin-top: 10px;overflow: auto;">
        <div style="margin: 10px;">
          <el-avatar :size="30" :src="circleUrl"></el-avatar>
          <span style="position: relative; top: -8px; margin-left: 10px;">123</span>
          </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import course from '../config/course'

export default {
  name: 'Music',
  data () {
    return {
        data: '',
        nim: '',
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        live1jinyan: false,
        live1Msg: [],
        channel: ''
    }
  },
  created () {
    
    let options = {
        debug: true,
        appKey: '867e66f770e5a64891adaf288b91fae5',
        account: 'testaccount1',
        token: '123456',
        // privateConf: {}, // 私有化部署方案所需的配置
        // ...
    }
    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
      // SDK 实例通常用 tim 表示
    this.init(options)
  },
  methods: {
    init (options) {
      // 监听事件，例如：
      // var SDK = require('@/config/NIM_Web_SDK_v7.0.0.js');
      this.nim = SDK.NIM.getInstance(options)
    },
    msgCtr (text, senderId, room) {
      room.push(text)
    },
    sleep (ms) {
        return new Promise((resolve) => setTimeout(resolve,ms));
    },
    async startLive () {
      // for (let i = 0; i < course.msg.length; i++) {
      //   await this.sleep(3000)
      //   this.channel.sendMessage({ text: '1' }).then(() => {
      //     console.log('发送成功')
      //     /* 频道消息发送成功的处理逻辑 */
      //   })
      // }
      // function sleep(ms){
      //   return new Promise((resolve)=>setTimeout(resolve,ms));
      // }
      // async function test(){
      //   var temple=await sleep(1000);
      //   console.log(1111)
      //   return temple
      // }
      // test();
    }
  }
}
</script>
<style lang="less" scoped>

</style>
