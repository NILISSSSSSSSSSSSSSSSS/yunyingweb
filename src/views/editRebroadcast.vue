<template>
  <div>
    
    <el-card class="box-card course-header">
      <div class="course-header-main">
        <div class="course-header-back">
          <el-button size="mini" icon="el-icon-back" circle @click="$router.back(-1)"></el-button><span> 回播/编辑</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-card course-main">
      <el-tabs v-model="tabName" :stretch='true'>
        <el-tab-pane label="基本信息" name="基本信息">
          <el-form labelWidth='90px' class="form-width" size="small">
            <el-form-item label='回播课名称'>
              <el-input v-model.trim='rebroadcast.name' placeholder='回播课名称' clearable/>
            </el-form-item>
            <el-form-item label='回播课描述'>
              <el-input type="textarea" v-model='rebroadcast.textDesc' placeholder='回播课描述' maxlength="200" clearable/>
            </el-form-item>
            <el-form-item label='课程图片'>
              <el-upload
                
                class="avatar-uploader"
                :action = uploadUrl
                :show-file-list="false"
                :on-success="handleSuccess">
                <img v-if="rebroadcast.imgDesc" :src="rebroadcast.imgDesc" class="avatar" style="max-width: 100% !important; width: auto !important; height: auto !important">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 160px !important; height: 103px !important"></i>
              </el-upload>
              <p style="margin: 0;line-height: 1;color: #ff9494;">图片建议规格宽160px*高103px</p>
            </el-form-item>
            <el-form-item label='开课时间'>
              <el-date-picker v-model.trim='rebroadcast.startTime' type="datetime" placeholder="开课时间" style="width: 100%;" value-format="timestamp"></el-date-picker>
            </el-form-item>
            <el-form-item label='结束时间'>
              <el-date-picker v-model.trim='rebroadcast.endTime' type="datetime" placeholder="课程结束时间" style="width: 100%;" value-format="timestamp"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="课件" name="课件">
          <div class="choose-course">
            <el-button type="primary" size="mini" class="choose-btn" @click="openKejianDialog">选择课程</el-button>
            <div class="course-name">
              <span>课件名称：</span>{{keJianDetail.title ? keJianDetail.title : '请选择'}}
              <span>主讲专家：</span>{{keJianDetail.doctor.name ? keJianDetail.doctor.name : '请选择'}}
            </div>
          </div>
          <el-divider ></el-divider>
          <el-table :data="rebroadcast.keChengItems" style="width: 100%" max-height="500"  row-key="id" id="id" >
            <el-table-column prop='id' label='ID' align='center' width="180"></el-table-column>
            <el-table-column prop="title" label="文件名" width="180"></el-table-column>
            <el-table-column prop="content" label="内容" >
              
              <template slot-scope="scope" >
                
                <div v-if="scope.row.type == 'TEXT'">
                  <span v-text="scope.row.content"></span>
                </div>
                <div v-if="scope.row.type == 'IMAGE'">
                  <img :src="scope.row.content" class="course-img" style="width: 180px">
                </div>
                <div v-if="scope.row.type == 'VOICE'">
                  <audio :src="scope.row.content" controls="controls" class="course-voice" style="width: 300px"></audio>
                </div>
                <div v-if="scope.row.type == 'VIDEO'">
                  <video :src="scope.row.content" controls="controls" class="course-video" style="width: 180px"></video>
                </div>
              </template>

            </el-table-column>
            <el-table-column prop="length" label="时长" width="150">
              <template slot-scope="scope" >
                <span v-if="scope.row.type == 'VOICE' || scope.row.type == 'VIDEO'">{{(scope.row.length / 1000) | TimestampToTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="话术" name="话术">
          <div class="select-verbaltrick">
            <el-radio-group v-model="verbaltrick" size="small">
              <el-radio-button label="课前话术" ></el-radio-button>
              <el-radio-button label="课后话术" ></el-radio-button>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 20px;">
            <el-button type="primary" size="mini" @click='dialogWordData.isShow=true'>插入文本</el-button>
            <el-button type="primary" size="mini" @click='dialogImageData.isShow=true'>上传图片/语音/视频</el-button>
            <el-button type="info" size="mini" @click="deleteSelection">删除所选</el-button>
            <el-button type="primary" size="mini" style="float: right" @click='openVerbalDialog'>从话术库选择</el-button>
          </div>
          <el-table :data="verbaltrick == '课前话术' ? rebroadcast.prefixItems : rebroadcast.suffixItems" style="width: 100%" height="500" row-key="content" id="prefixItems"  @selection-change="selectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop='id' label='ID' align='center' width="180"></el-table-column>
            <el-table-column prop="title" label="文件名" width="180"></el-table-column>
            <el-table-column prop="name" label="内容" >
              
              <template slot-scope="scope" >
                
                <div v-if="scope.row.type == 'TEXT'">
                  <span v-text="scope.row.content"></span>
                </div>
                <div v-if="scope.row.type == 'IMAGE'">
                  <img :src="scope.row.content" class="course-img" style="width: 180px">
                </div>
                <div v-if="scope.row.type == 'VOICE'">
                  <audio :src="scope.row.content" controls="controls" class="course-voice" style="width: 300px"></audio>
                </div>
                <div v-if="scope.row.type == 'VIDEO'">
                  <video :src="scope.row.content" controls="controls" class="course-video" style="width: 180px"></video>
                </div>
              </template>

            </el-table-column>
            <el-table-column prop="length" label="延时/s" width="120">
              <template slot-scope="scope" >
                <el-input min="0" type="number" v-model.trim='scope.row.delayTime'/>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="时长" width="100">
              <template slot-scope="scope" >
                <span v-if="scope.row.type == 'VOICE' || scope.row.type == 'VIDEO'">{{(scope.row.length / 1000) | TimestampToTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="操作" width="100">
              <template slot-scope="scope" >
                <el-button type='text' size='small' @click="deleteVerbal(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="门店" name="门店">
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
        </el-tab-pane> -->
        <el-tab-pane label="客服小助手" name="客服小助手">
          <div class="mendian">
            <div class="mendian-search">
                
                <el-form class="small-form mt10" :model='kefuParams' labelWidth='60px'>
                  <el-input v-model.trim='kefuParams.name' placeholder='请输入客服姓名' size='small' clearable></el-input>
                  <el-button class="w100" type='primary' size='small' style="margin-bottom: 20px; margin-top: 20px" @click="searchKefu">立即搜索</el-button>
                </el-form>
                <el-table :data='kefuList.data' class="box left-table" stripe>
                  <el-table-column prop='name' label='名称'>
                    <template slot-scope="scope">
                      <el-popover placement="right-start" width="200" trigger="hover">
                        <div class="ft12 pointer" slot="reference">{{scope.row.name}} {{scope.row.phone}}</div>
                        <div slot class="ft12 lh22">
                          <el-row><span class="col-gray mr10">电话</span>{{scope.row.phone}}</el-row>
                          <el-row><span class="col-gray mr10">姓名</span>{{scope.row.name}}</el-row>
                          <el-row><span class="col-gray mr10">账号</span>{{scope.row.loginId}}</el-row>
                          <div style="text-align: center">
                            <el-button type='text' size='small' @click="addKefu(scope.$index)">添加到客服</el-button>
                            <el-button type='text' size='small' @click="addXiao(scope.$index)">添加到小助手</el-button>
                          </div>
                          
                        </div>
                      </el-popover>
                      <div class="ft12 col-gray">{{scope.row.desc}}</div>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
            <div class="mendian-list">
              <h4>已选择的客服 <span>({{chooseKefuList.length}} 人)</span></h4>
                <el-table :data="chooseKefuList" style="width: 100%">
                  <el-table-column prop="loginId" label="账号" > </el-table-column>
                  <el-table-column prop="name" label="姓名" > </el-table-column>
                  <el-table-column prop="phone" label="手机" > </el-table-column>
                  <el-table-column prop="desc" label="详情" > </el-table-column>
                  <el-table-column prop="length" label="操作" width="100">
                    <template slot-scope="scope" >
                      <el-button type='text' size='small' @click="deleteKefu(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <h4 style="margin-top: 20px;">已选择的小助手 <span>({{chooseXiaoList.length}} 人)</span></h4>
                <el-table :data="chooseXiaoList" style="width: 100%">
                  <el-table-column prop="loginId" label="账号" > </el-table-column>
                  <el-table-column prop="name" label="姓名" > </el-table-column>
                  <el-table-column prop="phone" label="手机" > </el-table-column>
                  <el-table-column prop="desc" label="详情" > </el-table-column>
                  <el-table-column prop="length" label="操作" width="100">
                    <template slot-scope="scope" >
                      <el-button type='text' size='small' @click="deleteXiao(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="bottom clearfix">
        <el-button @click="createRebroad" type='primary' icon='el-icon-check' size="mini" v-if="tabName == '客服小助手'">保存修改</el-button>
        <el-button @click="nextTab" type='primary' size="mini" v-if="tabName != '客服小助手'">下一步</el-button>
      </div>
      
    </el-card>
    <el-dialog title="选择课件" :visible.sync="kejianDialog" width="70%">
      <div class="mendian" style="display: flex;">
        <div class="mendian-search">
            <el-form class="small-form mt10" :model='courseParams' labelWidth='70px'>
              <el-form-item label='课件名称' >
                <el-input v-model.trim='courseParams.title' placeholder='请输入课件名称' size='small' clearable></el-input>

              </el-form-item>
              <el-button class="w100" type='primary' size='small' style="margin-bottom: 20px" @click="searchCourseList">立即搜索</el-button>
            </el-form>
            <el-table :data='courseList.data' class="box left-table" stripe @row-click="selectCourse">
              <el-table-column prop='title' label='名称'></el-table-column>
              <el-table-column prop='doctor.name' label='主讲专家'></el-table-column>
            </el-table>
            <paginationsmall :pageLimit='courseParams' @change='pageChange'></paginationsmall>
        </div>
        <div class="mendian-list course-main">
          <h4>课件预览 <span style="color: #bbb; font-size: 14px;">({{keJian.title}})</span></h4>
            <el-table :data="keJian.items" style="width: 100%;" max-height="420">
              <el-table-column prop='id' label='ID' align='center' width="180"></el-table-column>
              <el-table-column prop="title" label="文件名" width="150"></el-table-column>
              <el-table-column prop="content" label="内容">
              
                <template slot-scope="scope" >
                  
                  <div v-if="scope.row.type == 'TEXT'">
                    <span v-text="scope.row.content"></span>
                  </div>
                  <div v-if="scope.row.type == 'IMAGE'">
                    <img :src="scope.row.content" class="course-img" style="width: 180px">
                  </div>
                  <div v-if="scope.row.type == 'VOICE'">
                    <audio :src="scope.row.content" controls="controls" class="course-voice" style="width: 180px"></audio>
                  </div>
                  <div v-if="scope.row.type == 'VIDEO'">
                    <video :src="scope.row.content" controls="controls" class="course-video" style="width: 180px"></video>
                  </div>

                </template>

              </el-table-column>
              <el-table-column prop="length" label="时长" width="100">
                <template slot-scope="scope" >
                  <span v-if="scope.row.type == 'VOICE' || scope.row.type == 'VIDEO'">{{(scope.row.length / 1000) | TimestampToTime}}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseKejian">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync='dialogWordData.isShow' title='输入文字' width='600px' :close-on-click-modal='false'>
      <el-input v-model.trim='dialogWordData.content' type='textarea' class="mb20" rows='10' placeholder='请输入文字内容'></el-input>
      <el-row class="mt20 mb20 tr">
          <el-button @click='saveWord' class="ml10" type='success'>保存</el-button>
      </el-row>
      <el-row></el-row>
    </el-dialog>

    <el-dialog :visible.sync='dialogImageData.isShow' :title="'上传图片'" width='600px' :close-on-click-modal='false'>
      <el-form labelWidth='120px'>
        <!-- <el-form-item label="类型">
          <el-radio-group v-model='dialogImageData.type'>
            <el-radio label="IMAGE" >图片</el-radio>
            <el-radio label="VOICE" >音频</el-radio>
            <el-radio label="VIDEO" >视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='上传图片' v-if="dialogImageData.type=='IMAGE'">
          <div v-if='dialogImageData.content'>{{dialogImageData.contentName}}</div>
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" accept="image/*" :on-success="handlePrefixItemsImgSuccess">
            
            <img v-if="dialogImageData.content" :src="dialogImageData.content" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label='上传音频' v-if="dialogImageData.type=='VOICE'">
          <el-upload :action="uploadUrl" :show-file-list="false" accept="audio/*" :before-upload="beforeUpload" :on-success="handlePrefixItemsImgSuccess">
            <el-button :loading="loading" type="success" plain size="small">选择音频</el-button>
          </el-upload>
          <div v-if='dialogImageData.content'>{{dialogImageData.contentName}}</div>
          <audio v-if="dialogImageData.content" :src="dialogImageData.content" class="mt10" controls></audio>
        </el-form-item> -->
        <!-- 视频 -->
        <el-form-item label='上传视频' >
          <el-upload :action="uploadUrl" :show-file-list="false" :before-upload="beforeUpload" :on-success="handlePrefixItemsImgSuccess" accept="image/jpeg,image/png,image/gif, audio/mpeg, video/mp4">
            <el-button :loading="loading" type="success" plain size="small">选择视频</el-button>
          </el-upload>
          <div v-for='item in dialogImageData.files'>{{item.title}}</div>
        </el-form-item>
      </el-form>
      <el-row class="mt20 tr">
        <el-button @click='saveImg' type='success'>保存</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="选择话术" :visible.sync="huashuDialog" width="70%">
      <div class="mendian" style="display: flex;">
        <div class="mendian-search">
            <el-form class="small-form mt10" :model='huashuParams' labelWidth='70px'>
              <el-form-item label='名称' >
                <el-input v-model.trim='huashuParams.title' placeholder='请输入话术名称' size='small' clearable></el-input>

              </el-form-item>
              <el-button class="w100" type='primary' size='small' style="margin-bottom: 20px" @click="searchVerbalList">立即搜索</el-button>
            </el-form>
            <el-table :data='verbalTrickList.data' class="box left-table" stripe @row-click="selectVerbalTrick">
              <el-table-column prop='name' label='名称'></el-table-column>
              <el-table-column prop='creator.name' label='创建者'></el-table-column>
            </el-table>
            <paginationsmall :pageLimit='huashuParams' @change='pageChange'></paginationsmall>
        </div>
        <div class="mendian-list course-main">
          <h4>话术预览</h4>
            <el-table :data="verbalTrickDetail.items" style="width: 100%;">
              <el-table-column prop='id' label='ID' align='center' width="180"></el-table-column>
              <el-table-column prop="title" label="文件名" width="150"></el-table-column>
              <el-table-column prop="content" label="内容">
              
                <template slot-scope="scope" >
                  
                  <div v-if="scope.row.type == 'TEXT'">
                    <span v-text="scope.row.content"></span>
                  </div>
                  <div v-if="scope.row.type == 'IMAGE'">
                    <img :src="scope.row.content" class="course-img" style="width: 180px">
                  </div>
                  <div v-if="scope.row.type == 'VOICE'">
                    <audio :src="scope.row.content" controls="controls" class="course-voice" style="width: 180px"></audio>
                  </div>
                  <div v-if="scope.row.type == 'VIDEO'">
                    <video :src="scope.row.content" controls="controls" class="course-video" style="width: 180px"></video>
                  </div>

                </template>

              </el-table-column>
              <el-table-column prop="length" label="时长" width="100">
                <template slot-scope="scope" >
                  <span v-if="scope.row.type == 'VOICE' || scope.row.type == 'VIDEO'">{{(scope.row.length / 1000) | TimestampToTime}}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseVerbal">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import api from '@/servers/huibo'
  import course from '@/servers/course'
  import config from '@/config/api'
  import Sortable from 'sortablejs'
  import kefu from '@/servers/kefu'
  import shops from '@/servers/shops'
  export default {
    data() {
      return {
        loading:false,
        dialogImageData: {
          uploadUrl: config.ossUpload || '',//文件上传
          
          
          isShow:false,
          
          files: []
        },
        dialogWordData:{
          isShow:false,
          content: '',
        },
        courseParams: {
          status: "ONLINE",
          title: '',
          pageSize:10,
          pageNumber:1,
          total:0
        },
        kefuParams: {
          name: '',
          size:10000,
          page:1,
          total:0
        },
        huashuParams: {
          title: '',
          pageSize:10,
          pageNumber:1,
          total:0
        },
        kefuList: {
          data: []
        },
        courseList: {
          data: []
        },
        verbalTrickList: {
          data: []
        },
        keJian: {
          items: []
        },
        verbalTrickDetail: {
          items: []
        },
        keJianDetail: {
          title: '',
          doctor: {
            name: ''
          }
        },
        rebroadcast: {
          name: '',
          textDesc: '',
          startTime: '',
          imgDesc: '',
          endTime: '',
          doctorId: '',
          keJianId: '',
          keChengItems: [],
          prefixItems: [],
          suffixItems: [],
          creator: {
            userId: '',
            name: '',
            avatar: ''
          },
          users: [],
          dianpuId: ''
        },
        searchMendian: {
          name: '',
          area: '',
          group: ''
        },
        chooseKefuList:[],
        chooseXiaoList:[],
        verbaltrick: '课前话术',
        tableData: [],
        tabName: '基本信息',
        uploadUrl: config.ossUpload || '',//文件上传
        imageUrl:'',
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        },
        kejianDialog: false,
        huashuDialog: false,
        keqian: [],
        kehou: []
      };
    },
    // mounted(){
    //   this.searchList()
    // },
    mounted(){
      
      this.searchKefu();
      this.shopsDefault();
      this.getCourseinfo();
      this.drag();
      this.prefixItemsDrag();
    },
    methods: {
      handleSuccess (res, file) {
        this.rebroadcast.imgDesc = res.data.url;
      },
      deleteSelection () {
        if (this.verbaltrick == '课前话术') {
          for (let i = 0; i < this.keqian.length; i++) {
            for (let k = 0; k < this.rebroadcast.prefixItems.length; k++) {
              if (this.keqian[i].id == this.rebroadcast.prefixItems[k].id) {
                this.rebroadcast.prefixItems.splice(k, 1)
              }
            }
          }
        }
        else {
          for (let i = 0; i < this.kehou.length; i++) {
            for (let k = 0; k < this.rebroadcast.suffixItems.length; k++) {
              if (this.kehou[i].id == this.rebroadcast.suffixItems[k].id) {
                this.rebroadcast.suffixItems.splice(k, 1)
              }
            }
          }
        }
      }, 
      selectionChange (selection) {
        if (this.verbaltrick == '课前话术') {
          this.keqian = selection;
        }
        else {
          this.kehou = selection;
        }
      },
      beforeUpload(){
        this.loading = true
      },
      deleteKefu (index) {
        this.chooseKefuList.splice(index, 1)
      },
      deleteXiao (index) {
        this.chooseXiaoList.splice(index, 1)
      },
      addKefu (index) {
        console.log(index)
        this.chooseKefuList.push(this.kefuList.data[index]);
      },
      addXiao (index) {
        this.chooseXiaoList.push(this.kefuList.data[index]);
      },
      deleteVerbal (index) {
        if (this.verbaltrick == '课前话术') {
          this.rebroadcast.prefixItems.splice(index, 1)
        }
        else {
          this.rebroadcast.suffixItems.splice(index, 1)
        }
        
      },
      saveImg () {
        var _this = this;
        if (this.verbaltrick == '课前话术') {
          for (let i = 0; i < this.dialogImageData.files.length; i++) {
            console.log(this.dialogImageData.files[i])
            this.rebroadcast.prefixItems.push(this.dialogImageData.files[i])
          }
          console.log(this.rebroadcast.prefixItems)
        }
        else {
          for (let i = 0; i < this.dialogImageData.files.length; i++) {
            delete this.dialogImageData.files[i].delayTime;
            this.rebroadcast.suffixItems.push(this.dialogImageData.files[i])
          }
          // this.rebroadcast.suffixItems.push({
          //   id: "",
          //   type: this.dialogImageData.type,
          //   content: this.dialogImageData.content,
          //   length: this.dialogImageData.fileLength,
          //   title: this.dialogImageData.contentName,
          //   addInfo: ""
          // })
        }
        // this.dialogImageData.content = '';
        // this.dialogImageData.fileLength = '';
        this.dialogImageData.isShow = false;
        this.dialogImageData.files = [];
      },
      handlePrefixItemsImgSuccess(res, file) {
        this.loading = false
        if(res.code === 200){
          var obj = {
            id: "",
            type: this.formatType(res.data.fileExt),
            content: res.data.url,
            title: res.data.filename,
            length: res.data.voiceLength,
            addInfo: "",
            delayTime: 0
          }
          this.dialogImageData.files.push(obj);
          console.log(this.dialogImageData.files)
          // if (this.dialogImageData.type == 'VIDEO') {
          //   var url = URL.createObjectURL(file);
          //   var audioElement = new Audio(url);
          //   var duration;
          //   audioElement.addEventListener("loadedmetadata", function(_event) {
          //     duration = audioElement.duration; //时长为秒，小数，182.36
          //     // this.$parent.$data.wDuration = parseInt(duration);
          //     console.log(duration);
          //   });
          // }
          
        }
      },
      formatType(str) {
        if (str == "jpg" || str == "png" || str == "jpeg"  || str == "gif" ) {
          return "IMAGE";
        } else if (str == "mp3") {
          return "VOICE";
        } else if (str == "mp4") {
          return "VIDEO";
        }
      },
      saveWord(){
        console.log(this.verbaltrick)
        if (this.verbaltrick == '课前话术') {
          this.rebroadcast.prefixItems.push({
            id: "",
            type: "TEXT",
            content: this.dialogWordData.content,
            length: 0,
            title: "",
            addInfo: "",
            delayTime: 0
          })
        }
        else{
          this.rebroadcast.suffixItems.push({
            id: "",
            type: "TEXT",
            content: this.dialogWordData.content,
            length: 0,
            title: "",
            addInfo: ""
          })
          
        }
        this.dialogWordData.content = '';
        this.dialogWordData.isShow = false;
        
      },
      openKejianDialog () {
        this.searchCourseList();
        this.kejianDialog = true; 
      },
      openVerbalDialog () {
        this.searchVerbalList();
        this.huashuDialog = true; 
      },
      chooseKejian () {
        this.keJianDetail = this.keJian;
        this.rebroadcast.keChengItems = this.keJian.items;
        this.rebroadcast.keJianId = this.keJian.id;
        this.rebroadcast.doctorId = this.keJian.doctorId;
        this.kejianDialog = false;
        console.log(this.rebroadcast.keChengItems);
      },
      chooseVerbal () {
        if (this.verbaltrick == '课前话术') {
          this.rebroadcast.prefixItems = this.verbalTrickDetail.items.concat(this.rebroadcast.prefixItems);
        }
        else {
          this.rebroadcast.suffixItems = this.verbalTrickDetail.items.concat(this.rebroadcast.suffixItems);
        }
        
        this.huashuDialog = false; 
      },
      selectCourse (row, column, event) {
        this.keJian = row;
        console.log(this.keJian)
      },
      selectVerbalTrick (row, column, event) {
        this.verbalTrickDetail = row;
        console.log(this.verbalTrickDetail)
      },
      nextTab () {
        console.log(this.rebroadcast)
        if (this.tabName == '基本信息') {
           this.tabName = '课件';
           return false;
        }
        if (this.tabName == '课件') {
           this.tabName = '话术';
           return false;
        }
        if (this.tabName == '话术') {
           this.tabName = '客服小助手';
           return false;
        }
        // if (this.tabName == '门店') {
        //    this.tabName = '客服小助手';
        //    return false;
        // }
      },
      getCourseinfo(){
        var _this = this;

        var params = {
          queryParam: _this.$route.query.id
        }
        api.huiBoInfo(params).then(res => {
          if(res.code === 200){
            _this.rebroadcast = res.data;
            _this.keJianDetail = res.data.keJian;
            for (let i = 0; i < res.data.users.length; i++) {
              if (res.data.users[i].role == "KF") {
                this.chooseKefuList.push(res.data.users[i])
              }
              if (res.data.users[i].role == "ASSISTANTS") {
                this.chooseXiaoList.push(res.data.users[i])
              }
 
            }
          }
        })
          
        
      },
      createRebroad () {
        if (this.rebroadcast.prefixItems.length > 0) {
          this.rebroadcast.prefixItems[0].realTime = {};
          this.rebroadcast.prefixItems[0].realTime.seconds = this.rebroadcast.startTime;
          this.rebroadcast.prefixItems[0].delayTime = 0;
        }

        for (let i = 1; i < this.rebroadcast.prefixItems.length; i++) {
          this.rebroadcast.prefixItems[i].delayTime = Number(this.rebroadcast.prefixItems[i].delayTime);
        }

        this.rebroadcast.users = [];
        for (let i = 0; i < this.chooseKefuList.length; i++) {
          this.rebroadcast.users.push({
            avatar: this.chooseKefuList[i].avatar,
            groupName: this.chooseKefuList[i].group ? this.chooseKefuList[i].group.name : '',
            phone: this.chooseKefuList[i].phone,
            loginId: this.chooseKefuList[i].loginId,
            createT: this.chooseKefuList[i].createT,
            userId: this.chooseKefuList[i].userId,
            name: this.chooseKefuList[i].name,
            role: "KF"
          })
        }

        for (let i = 0; i < this.chooseXiaoList.length; i++) {
          this.rebroadcast.users.push({
            avatar: this.chooseXiaoList[i].avatar,
            groupName: this.chooseXiaoList[i].group ? this.chooseXiaoList[i].group.name : '',
            phone: this.chooseXiaoList[i].phone,
            loginId: this.chooseXiaoList[i].loginId,
            createT: this.chooseXiaoList[i].createT,
            userId: this.chooseXiaoList[i].userId,
            name: this.chooseXiaoList[i].name,
            role: "ASSISTANTS"
          })
        }
        var _this = this;
        this.rebroadcast.queryParam = this.rebroadcast.id;
        var rebroadcastKefu = {};
        rebroadcastKefu.queryParam = this.rebroadcast.queryParam;
        rebroadcastKefu.users = this.rebroadcast.users;
        console.log(this.rebroadcast)
        api.editHuiBo(this.rebroadcast).then(res => {
          if(res.code === 200){
            this.isShowDialog = false;
            _this.$router.replace('/rebroadcastList')
          }
        })

        api.editHuiBoKefu(rebroadcastKefu).then(res => {
          if(res.code === 200){
            this.isShowDialog = false;
            _this.$router.replace('/rebroadcastList')
          }
        })
      },
      searchCourseList(){
        var params = {
          page: this.courseParams.pageNumber,
          size: this.courseParams.pageSize,
          ...this.courseParams
        }
        delete params.total;
        var _this = this;
        course.getCourse(params).then(res => {
          if(res.code === 200){
            _this.courseList.data = res.data.data
            _this.courseParams.total = res.data.total
          }
        })
      },
      searchVerbalList(){
        var params = {
          ...this.huashuParams
        }
        if (!params.title) {
          delete params.title;
        }
        delete params.total;
        var _this = this;
        course.getVerbalTrick(params).then(res => {
          if(res.code === 200){
            _this.verbalTrickList.data = res.data.data
            _this.huashuParams.total = res.data.total
          }
        })
      },
      searchKefu(){
        var params = {
          ...this.kefuParams
        }
        delete params.total;
        var _this = this;
        kefu.kefulist(params).then(res => {
          if(res.code === 200){
            _this.kefuList.data = res.data.data
            _this.kefuParams.total = res.data.total
          }
        })
      },

      shopsDefault(){
        var _this = this;
        shops.getShopsDefault().then(res => {
          if(res.code === 200){
            _this.rebroadcast.dianpuId = res.data.id
            console.log(res.data.id)
          }
        })
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
        this.courseParams.pageSize = pageSize
        this.courseParams.pageNumber = pageNumber
        this.searchCourseList()
      },
      verbalPageChange(pageSize,pageNumber){
        this.huashuParams.pageSize = pageSize
        this.huashuParams.pageNumber = pageNumber
        this.searchCourseList()
      },
      drag() {
        const tbody = document.querySelector('#id .el-table__body-wrapper tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.rebroadcast.keChengItems.splice(oldIndex, 1)[0]
            _this.rebroadcast.keChengItems.splice(newIndex, 0, currRow)
          }
        })
      },

      prefixItemsDrag() {
        const tbody = document.querySelector('#prefixItems .el-table__body-wrapper tbody')
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            if (_this.verbaltrick == '课前话术') {
              const currRow = _this.rebroadcast.prefixItems.splice(oldIndex, 1)[0]
              _this.rebroadcast.prefixItems.splice(newIndex, 0, currRow)
            }
            else {
              const currRow = _this.rebroadcast.suffixItems.splice(oldIndex, 1)[0]
              _this.rebroadcast.suffixItems.splice(newIndex, 0, currRow)
            }
            
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  /deep/.avatar-uploader {
    /deep/.el-upload {
      width: 160px;
      height: 103px;
      overflow: hidden;
      background: #bfbfbf;
    }
  }
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
  /deep/ .el-dialog {
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
    max-height: 300px;
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