<template>
  <div>
    <div class="miniConversation">
      <el-card class="box-card" style="width:315px">
        <!-- 筛选 -->
        <el-collapse v-model="activecollapse">
          <el-collapse-item title="筛选" name="1">
            <el-input v-model.trim='searchParams.name' placeholder='请输入客服姓名' size='small' clearable></el-input>
            <el-form class="small-form mt10" :model='searchParams' labelWidth='60px'>
              <el-form-item label='手机号'>
                <el-input v-model.trim='searchParams.phone' size='small' clearable></el-input>
              </el-form-item>
              <el-button class="w100" type='primary' size='small' @click="searchList">立即搜索</el-button>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <!-- 内容 -->
        <el-table :data='dataList1' class="box left-table" stripe>
          <el-table-column prop='id' label='名称'>
            <template slot-scope='{row}'>
              <el-popover placement="right-start" width="250" trigger="hover">
                <div class="ft12 pointer mt5" slot="reference">
                  <el-avatar v-if="row.avatar" style="vertical-align: middle;" size="small" :src="row.avatar">
                  </el-avatar> {{row.name}}
                  {{row.loginId}}
                </div>
                <div slot class="ft12 lh22">
                  <el-row><span class="col-gray mr10">姓名</span>{{row.name}}</el-row>
                  <el-row><span class="col-gray mr10">电话</span>{{row.phone}}</el-row>
                  <el-row><span class="col-gray mr10">账号</span>{{row.loginId}}</el-row>
                  <!-- <el-row><span class="col-gray mr10">所属组</span>华东组</el-row> -->
                  <div class="buttonWrapper">
                    <el-button type="primary" size="mini" @click="addUser(row,1)">添加到客服</el-button>
                    <el-button type="primary" size="mini" @click="addUser(row,2)">添加到小助手</el-button>
                  </div>
                </div>
              </el-popover>
              <div class="ft12 col-gray">{{row.desc}} {{row.phone}}</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageLimit='page' @change='pageChange'></pagination>
      </el-card>
      <el-card class="box-card" style="flex: 1;margin-left: 20px;">
        <!-- 已选择的客服 -->
        <div style="margin-top:20px">
          <p>已选择的客服 [{{dataList3.length}}人]</p>
          <el-table :data='dataList3' border stripe align='center'>
            <el-table-column label='姓名' align='center'>
              <template slot-scope='{row}'>
                <el-avatar v-if="row.avatar" style="vertical-align: middle;" size="small" :src="row.avatar"></el-avatar>
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label='账号' prop='loginId' align='center'>
            </el-table-column>
            <el-table-column label='电话' prop='phone' align='center'>
            </el-table-column>
            <el-table-column label='用户组' align='center'>
              <template slot-scope='{row}'>
                <!-- {{ row.group }} -->
                <span>{{ row.groupName}}</span>
              </template>
            </el-table-column>
            <el-table-column label='创建时间' align='center'>
              <template slot-scope='{row}'>
                <span v-if="row.createT">{{ row.createT.humanTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label='操作' align='center'>
              <template slot-scope='scope'>
                <el-button type="text" @click="cancel(1,scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 已选择的小助手 -->
        <div style="margin-top:20px">
          <p>已选择的小助手 [{{dataList4.length}}人]</p>
          <el-table :data='dataList4' border stripe align='center'>
            <el-table-column label='姓名' align='center'>
              <template slot-scope='{row}'>
                <el-avatar v-if="row.avatar" style="vertical-align: middle;" size="small" :src="row.avatar"></el-avatar>
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label='账号' prop='loginId' align='center'>
            </el-table-column>
            <el-table-column label='电话' prop='phone' align='center'>
            </el-table-column>
            <el-table-column label='用户组' align='center'>
              <template slot-scope='{row}'>
                <!-- {{ row.group }} -->
                <span>{{ row.groupName}}</span>
              </template>
            </el-table-column>
            <el-table-column label='创建时间' align='center'>
              <template slot-scope='{row}'>
                <span v-if="row.createT">{{ row.createT.humanTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label='操作' align='center'>
              <template slot-scope='scope'>
                <el-button type="text" @click="cancel(2,scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div class="saveRow">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
  import api from '@/servers/kefu'
  import api2 from '@/servers/huibo'
  export default {
    props: {
      dataBox: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      dataBox(val, oldVal) {
        //  this.dataList3=val;
        if (val) {
          this.dealData(val)
        }
      },
    },
    data() {
      return {
        searchParams: {
          phone: '',
          name: ''
        },
        activecollapse: '1',//筛选
        dataList3: [],//客服
        dataList4: [],//小助手
        dataList1: [],
        page: {
          pageSize: 10,
          pageNumber: 1,
          total: 0
        },

      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      dealData(arr) {
      
        console.log(this);
        this.dataList3 = arr.filter(val => val.role == "KF");
        this.dataList4 = arr.filter(val => val.role == "ASSISTANTS");
      },
      pageChange(pageSize, pageNumber) {
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      },
      searchList() {
        let params = {
          ... this.searchParams,
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        api.kefulist(params).then(res => {
          if (res.code === 200) {
            for (let item of res.data.data) {
              // 统一两个接口的字段名字
              item.groupName = item.group ? item.group.name : "";
              // item.loginId=item.loginId
            }
            this.dataList1 = res.data.data
            this.page.total = res.data.total
          }
          else {
            this.dataList1 = [];
          }
        }).catch(err => {
          this.dataList1 = [];
        })
      },
      addUser(row, index) {
        var cc = (obj) => {
          console.log(this);
          let idBox = obj.map(val => val.loginId);
          if (idBox.includes(row.loginId)) {
            this.$message.error("不能重复添加"); return;
          }
          obj.push(row)
        }

       
        if (index == 1) {
          cc(this.dataList3)
        }
        else {
          cc(this.dataList4)
        };

      },
      cancel(sub,index) {
        if (sub == 1) {
          this.dataList3.splice(index, 1)
        }
        else {
          this.dataList4.splice(index, 1)
        };

      },
      save() {
        // let users = [];
        // for (let item of this.dataList3) {
        //   users.push({
        //     userId: item.userId,
        //     name: item.name,
        //     avatar: item.avatar,
        //     role: 'ASSISTANTS',
        //   })
        // }
        // let users=[...this.dataList3, ...this.dataList4]
       
        let copy3=JSON.parse(JSON.stringify(this.dataList3));
        let copy4=JSON.parse(JSON.stringify(this.dataList4));
        copy3.map(val=>val.role='KF');
        copy4.map(val=>val.role='ASSISTANTS');
        let users =[...copy3,...copy4];
        let params = {
          queryParam: this.$route.query.id,
          users: users
        }
        api.byIdedietKefu(params).then(res => {
          if (res.code === 200) {
            this.$message.success("保存成功");
            this.getDetail();
          }
        }).catch(err => {

        })
      },
      //重新课程获取详情接口
      getDetail() {
        let params = {
          queryParam: this.$route.query.id,
        }
        api2.huiBoDetail(params).then(res => {
          console.log("获取到的信息：" + JSON.stringify(res));
          this.loading = false;
          if (res.code === 200) {
            res.data.keCheng.users ? this.dealData(res.data.keCheng.users) : [this.dataList3, this.dataList4] = [[], []];
          }
          else {
            [this.dataList3, this.dataList4] = [[], []];
          }
        }).catch(err => {
          [this.dataList3, this.dataList4] = [[], []]
        })
      }
    },


  }
</script>
<style lang="less" scoped>
  .imgBox {
    display: flex;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    div {
      font-size: 13px;

      span {
        display: block;
      }
    }
  }

  .hoverBox {
    text-align: left;
    padding-left: 40px;
  }

  .saveRow {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .miniConversation {
    display: flex;
    height: 95%;
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

  .buttonWrapper {
    margin-top: 10px;

    .el-button {
      display: inset-block;
    }
  }
</style>