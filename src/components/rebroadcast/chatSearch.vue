<template>
  <div class="chatRoomSearch">
    <div class="rightCon" style="width:365px">
      <div class="right-l">
        <!-- 头部搜索 -->
        <div class="searchHeader">
          <el-input placeholder="请输入搜索内容" @input="questionChange" v-model="searchVal" clearable size="small">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <template>
          <!-- 搜索内容 -->
          <div class="searchWrapper" v-if="smallType=='search'">
            <div class="aboutSearch">
              <div v-if='searchQuestionVal'>
                <div class="searchTop mt10">
                  <p>{{searchQuestionVal}}</p>
                </div>
                <div class="searchRow">
                  精确搜索
                  <div class="mt5 searchCol">
                    <el-button @click="questionChange(item.token)" type="primary" v-for="(item,index) in wordList"
                      :key='index' round size="mini" class="mb5 mr5" style="margin-left:0">{{item.token}}</el-button>
                  </div>
                </div>
                <!-- <div class="searchRow">
                    模糊搜索
                    <div class="mt5 searchCol">
                      <el-button @click="questionChange" type="primary" v-for="(item,index) in esSearchList"  :key='index' round size="mini" class="mb5 mr5" style="margin-left:0">宝宝</el-button>
                    </div>
                  </div> -->
              </div>
            </div>
            <div class="bottomText">
              <p>本地结果</p>
              <div style="max-height:calc(100vh - 450px);overflow-y:scroll">
                <div v-for="(item,index) in esSearchList" :key='index' class="">

                  <div @click="addToInput(item._source.A)" class="hoverItem colorGray pointer" v-text="item._source.A">
                  </div>
                  <div class="line mt5 mb5"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 答疑库内容 -->
          <div class="bottomText" v-if="smallType=='answerBank'">
            <p><span class="col-red">答疑库</span>最佳答案</p>
            <div v-for="(item,index) in answerList" :key='index' class="ft13">
              <div @click="addToInput(item.answer,item.id)" class="hoverItem colorBlack pointer" v-text="item.answer">
              </div>
              <div class="colorGray ft12 mt5">{{item.creator.name}} 被采纳次数：<span class="col-red">{{item.useNum}}</span>次
              </div>
              <div class="line mt5 mb5"></div>
            </div>
          </div>

          <!-- 我的内容 -->
          <div class="bottomText" v-if="smallType=='mine'">
            <!-- <p>聊天记录</p> -->
            <el-table :data="serviceCordList" style="width: 100%;margin-top:5px" height="470">
              <el-table-column label="聊天记录">
                <template slot-scope="{row}">
                  <template v-if="row.txImMsg && row.txImMsg.msgItem">
                    <span style="cursor:pointer" @click="addToInput(row.txImMsg.msgItem.content)"
                      v-if="row.txImMsg.msgItem.type=='TEXT'" v-text="row.txImMsg.msgItem.content"></span>
                    <img v-if="row.txImMsg.msgItem.type=='IMAGE'" :src="row.txImMsg.msgItem.content" class="tableImg">
                    <video v-if="['VIDEO','shortvideo'].includes(row.txImMsg.msgItem.type)"
                      :src="row.txImMsg.msgItem.content" class="tableVideo" controls="controls"></video>
                    <audio v-if="row.txImMsg.msgItem.type=='VOICE'" :src="row.txImMsg.msgItem.content"
                      controls="controls" class="tableAudio"></audio>
                    <a v-if="row.txImMsg.msgItem.type=='LINK'" :href="row.txImMsg.msgItem.content"></a>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <pagination :pageLimit='page' @change='pageChange' small></pagination>
          </div>
        </template>
      </div>
      <!-- 单选框部分 -->
      <div class="right-r">
        <el-radio-group v-model="smallType" size="mini" class="rightRadio" @change="changeType">
          <el-radio-button label="search">搜<br>索</el-radio-button>
          <el-radio-button label="answerBank">答<br>疑<br>库</el-radio-button>
          <el-radio-button label="mine">我<br>的</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
  import hbApi from '@/servers/huibo'
  import courseApi from '@/servers/course'
  import Vue from 'vue'
  export default {
    props: {
      smallTypes: {
        default: 'search',
      },
      question: {
        default: '',
        type: String
      }
    },
    data() {
      return {
        smallType: this.smallTypes, //@param search搜索；answerBank答疑库 mine我的，
        checkVal: '',//右侧选中的答案
        searchVal: "",//搜索内容
        searchQuestionVal: "",//搜索分词问题
        esSearchList: [],//es搜索结果
        wordList: [],//分词列表
        answerList: [],//答疑库结果
        page: {
          pageSize: 10,
          pageNumber: 1,
          total: 0
        },
        serviceCordList: [],
      }
    },
    methods: {
      addToInput(allVal, id) {
        if (this.$parent.$refs.chat && this.$parent.$refs.chat.inputVal) {
          this.$confirm('是否替换输入框中的内容？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (id) {
              courseApi.useDaYi({ queryParam: id }).then(res => {
                this.questionChange(this.searchVal)
              })
            }
            this.$emit('setCheckVal', allVal)
          });
        }
       else{
        if (id) {
              courseApi.useDaYi({ queryParam: id }).then(res => {
                this.questionChange(this.searchVal)
              })
            }
            this.$emit('setCheckVal', allVal)
       }
      },
      //右侧问题搜索值更改
      questionChange(val) {
        //分词赋值输入框
        if (val) {
          this.searchVal = val
        }
        //es问题查询
        if (this.smallType == 'search') {
          if (this.searchVal == '') {
            this.esSearchList = []
            return
          }
          let params = {
            "query": {
              "match_phrase": {
                "Q": this.searchVal
              }
            }
          }
          hbApi.esSearch(params).then(res => {
            // this.replaceFun(res.hits.hits, '_source', 'A')
            this.esSearchList = res.hits.hits;
          })
          //答疑库
        } else if (this.smallType == 'answerBank') {
          if (this.searchVal == '') {
            this.answerList = []
            return
          }
          let params = {
            question: this.searchVal,
            isme: false,
            page: 1,
            size: 100000
          }
          courseApi.getDaYi(params).then(res => {
            if (res.code === 200) {
              // this.replaceFun(res.data.data, 'answer');
              this.answerList = res.data.data
            }
            else {
              this.answerList = [];
            }
          }).catch(err => {
            this.answerList = [];
          })
        }
        else {
          this.page.pageSize = 10;
          this.page.pageNumber = 1;
          this.getRecordList();
        }
      },
      //字符串替换函数，用于把搜索结果中的搜索词替换成带颜色的文字
      replaceFun(arr, a1, a2) {
        for (let item of arr) {
          let val = a2 ? item[a1][a2] : item[a1];
          if (val && val.includes(this.searchVal)) {
            let newVal = this.replaceStr(val, this.searchVal, `<span style='color:red'>${this.searchVal}</span>`);
            a2 ? item[a1][a2] = `<span>${newVal}+</span>` : item[a1] = `<span>${newVal}+</span>`;
          }
        }
      },
      replaceStr(str, reallyDo, replaceWith) {
        var e = new RegExp(reallyDo, "g");
        let words = str.replace(e, replaceWith);
        return words;
      },
      //分词搜索
      wordSearch() {
        if (this.searchQuestionVal !== '') {
          let params = {
            "analyzer": "ik_smart",
            "text": this.searchQuestionVal
          }
          hbApi.esWordSearch(params).then(res => {
            this.wordList = res.tokens
          })
        }
      },
      changeType(val) {
        if (val == 'mine') {
          this.page.pageSize = 10;
          this.page.pageNumber = 1;
          this.getRecordList();
        }
      },
      getRecordList() {
        // const userInfo = JSON.parse(Vue.cookie.get('userInfo')) || {}
        let params = {
          page: this.page.pageNumber,
          size: this.page.pageSize,
          username: '',
          content: this.searchVal
        }
        hbApi.customerSerChat(params).then(res => {
          if (res.code == 200) {
            // this.searchVal ? this.replaceFun(res.data.data, 'txImMsg', 'content') : '';
            // this.replaceFun(res.data.data, 'txImMsg', 'content');
            this.serviceCordList = res.data.data;;
            this.page.total = res.data.total;
          }
          else {
            this.serviceCordList = [];
          }
        }).catch(err => {
          this.serviceCordList = [];
        })
      },
      pageChange(pageSize, pageNumber) {
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.getRecordList()
      },
    },
    mounted() {
      this.wordSearch()//分词获取
    },
    watch: {
      question(val, oldVal) {
        if (val && val !== oldVal) {
          if (this.smallType == 'mine') {
            this.searchVal = val
            this.page.pageSize = 10;
            this.page.pageNumber = 1;
            this.getRecordList();
          }
          if (this.smallType == 'search') {
            this.searchQuestionVal = val
            this.wordSearch()
          }
          else {
            this.searchVal = val
            this.questionChange(val)
          }

        }
      },
      smallType(val, oldVal) {
        if (val !== oldVal) {
          this.questionChange()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .chatRoomSearch {
    .rightCon {
      display: flex;
      font: 13px;

      .right-l {
        flex: 1;
        padding: 10px;
        border: 1px solid #c7c7c7;
        overflow: hidden;

        .searchHeader {
          background: #e2e2e2;
          padding: 5px;

          .el-input {
            width: 217px;
          }
        }

        .aboutSearch {
          background: #f2f2f2;
          padding: 8px;

          .searchTop {
            p {
              background: white;
              padding: 10px;
              color: #888888;
              font-size: 13px;
            }

            .searchRow {
              font-size: 13px;

              .searchCol {
                /* >.el-button+.el-button {
                margin-left: 0px;
              } */

              }
            }

          }
        }

        .bottomText {
          .colorGray {
            font-size: 13px;
            color: #888888;
          }
        }
      }

      /deep/ .right-r {
        .rightRadio {
          .el-radio-button {
            display: block;

            .el-radio-button__inner {
              padding: 0;
              width: 30px;
              height: 82px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1.3;
            }
          }
        }
      }
    }

    .hoverItem:hover {
      color: #F13877 !important;
    }
  }

  .cell {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>