<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='标签'>
          <el-input v-model.trim='searchParams.tags' placeholder='标签' clearable></el-input>
        </el-form-item>
        <el-form-item label='问题'>
          <el-input v-model.trim='searchParams.question' placeholder='问题' clearable></el-input>
        </el-form-item>
        <el-form-item label='贡献者'>
          <el-input v-model.trim='searchParams.creator' placeholder='贡献者' clearable></el-input>
        </el-form-item>
        <el-form-item label='创建时间'>
          <el-date-picker v-model.trim='searchParams.time' 
            type="daterange" 
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click='reset' type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='showDialog(1)' type='primary' icon='el-icon-plus'>新增答疑</el-button>
        <el-button @click="showAddShoper" type="success" icon="el-icon-plus" size="small">导入答疑信息</el-button>
        <el-button @click="downExcel" type="text" icon="el-icon-download" class="ml40" size="small">下载答疑模板</el-button>

      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList'  border stripe>
        <el-table-column prop='id' label='ID' align='center' min-width="150px"></el-table-column>
        <el-table-column label='标签' align='center' width='120px'>
          <template slot-scope="{row}">
            <el-tag type='warning' v-for='(item,index) in row.tags' :key='index' class="mr5 mb5" size='small'>{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop='question' label='问题' align='center' width="250px">
          <template class="answer" slot-scope="{row}">
            <el-popover popper-class='show-popper' effect="linght" placement="bottom" trigger='hover'>
              <div slot='reference' class="answer-col">{{row.question}}</div>
              <div slot>{{row.question}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop='answer' label='回答' align='center' width='350px'>
          <template class="answer" slot-scope="{row}">
            <el-popover popper-class='show-popper' effect="linght" placement="bottom" trigger='hover'>
              <div slot='reference' class="answer-col">{{row.answer}}</div>
              <div slot>{{row.answer}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop='useNum' label='被采纳' align='center' width='80px'></el-table-column>
        <el-table-column prop='creator.name' label='贡献者' align='center' width='100px'></el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' align='center'></el-table-column>
        <el-table-column prop='updateT.humanTime' label='更新时间' align='center'></el-table-column>
        <!-- <el-table-column prop='status' label='状态' align='center' width='70px'>
          <template slot-scope="{row}">
            <span :class="row.status == 'ONLINE' ? 'col-sucs':'col-danger'">{{row.status === 'ONLINE' ? '上线' : '未上线'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label='操作' width='90px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <el-button type='text' @click='showDialog(row)' size='small'>编辑</el-button>
            <el-button type='text' @click="changeStu(row.question,row.id)" size='small'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <!-- 导入答疑信息弹框 -->
    <el-dialog :visible.sync="isShowImport" title="导入答疑信息" width="500px" @close='clearExcel' :close-on-click-modal='false'>
      <el-form labelWidth='100px'>
        <el-form-item label="答疑信息：">
          <el-upload
            ref='uploadExcel'
            action=""
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="importShoper"
            @clearFiles='clearExcel'>
            <el-button :loading='isFinishedUpload' type='success' size='small' icon="el-icon-upload2">上传 EXCEL </el-button>
          </el-upload>
          <div class="tips">为保证上传效率，单次上传请勿超过 <span class="col-danger">100</span> 条答疑信息</div>
        </el-form-item>
        <el-form-item label='' >
          <span>获取到 <span class="col-danger ft20">{{importList.length}}</span> 条数据</span>
        </el-form-item>
        <el-row class="tc">
          <el-button :loading='isLodadingSave' @click="saveShoper" type='primary' icon="el-icon-check">确定导入</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 导入信息结果弹框 -->
    <el-dialog :visible.sync="isShowResults" title="导入结果明细" width="800px" @close="initResultsDialog" :close-on-click-modal='false'>
      <div>
        <span>此次导入 <span class="col-danger ft20">{{results.length}}</span> 条数据，</span>
        <span>成功 <span class="col-danger ft20">{{successList.length}}</span> 条，</span>
        <span>失败 <span class="col-danger ft20">{{errorList.length}}</span> 条</span>
        <div v-show='errorList.length' class="mt20">
          <el-row>导入失败明细</el-row>
          <el-table :data='errorList' class="mb20 mt5" border stripe>
            <el-table-column prop="dayi.question" label="问题" width="300px" align="center"></el-table-column>
            <el-table-column prop="dayi.answer" label="答案" align="center">
              <template slot-scope="{row}">
              <div class="answer-col">{{row.dayi.answer}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="tc mt20">
          <el-button @click="initResultsDialog" type='primary' size='small'>关闭</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog :visible.sync='isShowDialog' :title='dialogTitle' width='600px' :close-on-click-modal='false'>
      <el-form :model='formParams' ref='formParams' labelWidth='100px'>
        <el-form-item prop='question' :rules='rules' label='问题：'>
          <el-input v-model='formParams.question' type='textarea' rows='4' placeholder='问题描述' clearable/>
        </el-form-item>
        <el-form-item prop='answer' :rules='rules' label='我的回答：'>
          <el-input v-model='formParams.answer' type='textarea' rows='8' placeholder='我的回答' clearable/>          
        </el-form-item>
        <el-form-item label='标签：'>
          <el-tag class="mr10" :key="tag" v-for="tag in formParams.tags" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
          <el-button v-else class="button-new-tag" type='success' size="small" @click="showInput" plain>+ 标签</el-button>
        </el-form-item>
        <el-row class="tc">
          <el-button @click='saveQuestion' type='primary' icon='el-icon-check'>保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import api from '@/servers/course'
  import XLSX from 'xlsx'
  const userInfo = JSON.parse(Vue.cookie.get('userInfo')) || {}
  export default {
    data() {
      return {
        searchParams:{
          isme:false,
        },//查询参数
        dataList:[],
        isShowDialog:false,
        isEdit:false,
        isShowImport:false,
        importList:[],
        isLodadingSave:false,
        isFinishedUpload:false,
        isShowResults:false,
        results:[],//导入结果
        errorList:[],
        successList:[],
        dialogTitle:'新增答疑',
        formParams:{
          question:'',
          answer:'',
          tags: [],
          creator:{
            userId: userInfo.id,
            name: userInfo.name,
            avatar: userInfo.avatar
          }
        },
        inputVisible: false,
        inputValue: '',
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        },
        rules:[
          { required: true, message:'必填',triiger:'blur'}
        ]
      };
    },
    methods: {
      searchList(){
        let time = this.searchParams.time || []
        let params = {
          ... this.searchParams,
          st: time.length ? (new Date(time[0]).getTime())/1000 : '',
          et: time.length ? this.$utils.formatEndTime(time[1]) : '',
          page: this.page.pageNumber,
          size: this.page.pageSize
        }
        delete params.time
        api.getDaYi(params).then(res => {
          if(res.code === 200){
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
        })
      },
      //提交答疑
      saveQuestion(){
        this.$refs['formParams'].validate(valid => {
          if(valid){
            if(this.isEdit){
              //编辑
              let params = {
                queryParam: this.formParams.id,
                creator: this.formParams.creator,
                question: this.formParams.question,
                answer: this.formParams.answer,
                tags: this.formParams.tags
              }
              api.editDaYi(params).then(res => {
                if(res.code === 200){
                  this.$message.success(res.msg || '编辑成功')
                  this.isShowDialog = false
                  this.isEdit = false
                  this.searchList()
                  this.resetForm()
                }
              })
            }else{
              //新增
              api.addDaYi(this.formParams).then(res => {
                if(res.code === 200){
                  this.$message.success(res.msg || '新增成功')
                  this.isShowDialog = false
                  this.searchList()
                  this.resetForm()
                }
              })
            }
          }else{
            return false
          }
        })
      },
      showDialog(obj){
        this.isShowDialog = true
        if(obj === 1){
          this.dialogTitle = '新增答疑'
          this.formParams.question = ''
          this.formParams.answer = ''
          this.formParams.tags = []
        }else {
          this.dialogTitle = '编辑答疑'
          this.isEdit = true
          this.formParams = {...obj}
        }
      },
      showAddShoper(){
        this.isShowImport = true
      },
      //导入答疑信息
      saveShoper(){
        if(!this.importList.length){
          this.$message.error('未获取到数据无法导入~')
          return
        }
        let param =  [...this.importList]
        this.isLodadingSave = true
        this.isFinishedUpload = true
        api.importDaYis(param).then(res => {
          this.isLodadingSave = false
          this.isFinishedUpload = false
          if(res.code === 200) {
            this.results = res.data
            this.errorList = _.filter(this.results,['isSuccess',false])
            this.successList = _.filter(this.results,['isSuccess',true])
            this.isShowResults = true
            this.clearExcel()
            this.isShowImport = false
            this.searchList()
          }else{
            // this.$message.error()
          }
        }).catch(err => {
          this.isLodadingSave = false
          this.isFinishedUpload = false
        })
      },
      //导入表格
      importShoper(file){
        const fileReader = new FileReader();
        this.isFinishedUpload = true
        let list = []
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });
            let sheet = Object.keys(workbook.Sheets)[0];
            list = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);  //获得以第一列为键名的sheet数组对象
            if(list.length > 100){
              this.$message.error('请勿导入超过100条数据~')
              return
            }
            list.map( m => {
              if(m.问题 && m.答案){
                this.importList.push({
                  tags: [],
                  question: m.问题,
                  answer: m.答案,
                  creator: this.formParams.creator,
                })
              }
            })
            } catch (e) {
              console.log(e)
            }
          };
        this.isFinishedUpload = false
        fileReader.readAsBinaryString(file.raw);
        this.clearExcel()
      },

      //下载答疑模板
      downExcel(){
        const tHeader = ['序号', '问题', '答案'];
        const params = []; 
        // ------------------------表头 | 空字段 | 空下载列表 | 表名
        this.$utils.exportExcel(tHeader, params, params, '答疑模板请勿修改')
      },
      clearExcel(){
        this.importList = []
        this.$refs['uploadExcel'].clearFiles();
      },
       //实例化导入结果弹框
      initResultsDialog(){
        this.results = []
        this.isShowResults = false
      },

      resetForm(){
        this.formParams.question = ''
        this.formParams.answer = ''
        this.formParams.tags = []
        this.$refs['formParams'].resetFields()
      },
      handleClose(tag) {
        this.formParams.tags.splice(this.formParams.tags.indexOf(tag), 1);
      },
      changeStu(name,id){
        let params = {
          id: id,
          status: 'DELETE'
        }
        this.$confirm('确定删除答疑【'+ name +'】？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          api.changeDaYiStu(params).then(res =>{
            if(res.code === 200){
              this.$message.success(res.msg || '删除成功')
              this.searchList()
            }
          })        
        }).catch(()=>{
          this.$message.info('已取消')
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.formParams.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      reset(){
        this.searchParams = {
          tags: '',
          question: '',
          creator: '',
          isme:false,
          time: [],
        }
        this.searchList()
      },
      // 分页
      pageChange(pageSize,pageNumber){
        this.page.pageSize = pageSize
        this.page.pageNumber = pageNumber
        this.searchList()
      }
    },
    mounted(){
      this.searchList()
    }
  }
</script>

<style lang="less">
.show-popper{
  max-width: 80%;
}
.answer-col{
  line-height: 23px;
  max-height: 92px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>