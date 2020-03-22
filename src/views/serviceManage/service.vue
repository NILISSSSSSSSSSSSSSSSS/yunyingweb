<template>
  <div>
    <!-- 查询条件 -->
    <el-card class="mb20">
      <el-form :model='searchParams' inline labelWidth='80px'>
        <el-form-item label='姓名'>
          <el-input v-model.trim='searchParams.name' placeholder='姓名' clearable></el-input>
        </el-form-item>
        <el-form-item label='电话'>
          <el-input v-model.trim='searchParams.phone' placeholder='电话' clearable></el-input>
        </el-form-item>
        <el-button @click='searchList' type='primary' icon='el-icon-search'>搜索</el-button>
        <el-button @click="searchList('reset')" type='info' icon='el-icon-s-tools'>重置</el-button>
        <el-button @click='showDialog(1)' type='primary' icon='el-icon-plus'>新增客服</el-button>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-table :data='dataList' border stripe>
        <el-table-column prop='id' label='ID' align='center'></el-table-column>
        <el-table-column prop='name' label='姓名' align='center' width="180">
          <template slot-scope='{row}'>
            <img :src="row.avatar" style="width: 20px; vertical-align: middle; border-radius: 50%;"/>
            {{row.name}}
          </template>
        </el-table-column>
        <el-table-column prop='loginId' label='帐号' align='center'></el-table-column>
        <el-table-column prop='phone' label='电话' align='center'></el-table-column>
        <!-- <el-table-column prop='' label='参与开课' align='center'></el-table-column>
        <el-table-column prop='' label='累计答疑' align='center'></el-table-column>
        <el-table-column prop='' label='客服条数' align='center'></el-table-column>
        <el-table-column prop='' label='播课门店' align='center'></el-table-column>
        <el-table-column prop='' label='客服门店' align='center'></el-table-column> -->
        <el-table-column prop='group.name' label='用户组' align='center'></el-table-column>
        <el-table-column prop='createT.humanTime' label='创建时间' width="170px" align='center'></el-table-column>
        <el-table-column prop='useStatus' label='状态' align='center'>
          <template slot-scope='{row}'>
            {{row.useStatus == 1 ? '启用' : '停用'}}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='150px'  align='center' fixed='right'>
          <template slot-scope='{row}'>
            <!-- <el-button type='text' size='small'>查看详情</el-button> -->
            <el-button type='text' @click='showDialog(row)' size='small'>编辑</el-button>
            <el-button type='text' size='small' @click="closeStatus(row)" v-if="row.useStatus == 1">停用</el-button>
            <el-button type='text' size='small' @click="openStatus(row)" v-if="row.useStatus == 2">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageLimit='page' @change='pageChange'></pagination>
    </el-card>
    <el-dialog :visible.sync='isShowDialog' :title='dialogTitle' width='500px' :close-on-click-modal='false'>
      <el-form labelWidth='80px' :rules="rules" :model="createParams">
        <el-form-item label='登录名' prop="loginId">
          <el-input v-model.trim='createParams.loginId' placeholder='登录名' clearable/>
        </el-form-item >
        <el-form-item label='姓名' prop="name">
          <el-input v-model.trim='createParams.name' placeholder='姓名' clearable/>
        </el-form-item>
        <el-form-item label='电话' prop="phone">
          <el-input v-model.trim='createParams.phone' placeholder='电话' clearable/>
        </el-form-item>
        
        <el-form-item label='描述' prop="desc">
          <el-input v-model.trim='createParams.desc' placeholder='描述' clearable/>
        </el-form-item>
        <el-form-item label='头像' prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action = uploadUrl
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="createParams.avatar" :src="createParams.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label='权限'>
          <el-select v-model='createParams.roleIds' clearable>
            <el-option v-for='(itm,index) in roleIds' :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label='是否管理' prop="manager">
          <el-select v-model='createParams.manager' clearable>
            <el-option v-for='(itm,index) in managers' :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客服分组' prop="groupId">
          <el-select v-model='createParams.groupId' clearable>
            <el-option v-for='(itm,index) in kefuGroup' :label='itm.name' :value='itm.id' :key='index'></el-option>
          </el-select>
          <i class="el-icon-edit" style="margin-left: 15px; font-size: 20px; cursor: pointer" size="50" @click="openEditGroup()"></i>
        </el-form-item>
        <el-row class="tc">
          <el-button @click="createKefu" type='primary' icon='el-icon-check'>保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync='editDialog' :title='dialogTitle' width='500px' :close-on-click-modal='false'>
      <el-form labelWidth='80px' :rules="rules" :model="editParams">
        <!-- <el-form-item label='登录名'>
          <el-input v-model.trim='editParams.loginId' placeholder='登录名' clearable/>
        </el-form-item> -->
        <el-form-item label='姓名' prop="name">
          <el-input v-model.trim='editParams.name' placeholder='姓名' clearable/>
        </el-form-item>
        <el-form-item label='电话' prop="phone">
          <el-input v-model.trim='editParams.phone' placeholder='电话' clearable/>
        </el-form-item>
        
        <el-form-item label='描述' prop="desc">
          <el-input v-model.trim='editParams.desc' placeholder='描述' clearable/>
        </el-form-item>
        <el-form-item label='头像' prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action = uploadUrl
            :show-file-list="false"
            :on-success="handleAvatarEditSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="editParams.avatar" :src="editParams.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label='权限'>
          <el-select v-model='editParams.roleIds' clearable>
            <el-option v-for='(itm,index) in roleIds' :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label='是否管理' prop="manager">
          <el-select v-model='editParams.manager'>
            <el-option v-for='(itm,index) in managers' :label='itm.name' :value='itm.value' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客服分组' prop="groupId">
          <el-select v-model='editParams.groupId'>
            <el-option v-for='(itm,index) in kefuGroup' :label='itm.name' :value='itm.id' :key='index' v-if='!itm.adding'></el-option>
          </el-select>
          <i class="el-icon-edit" style="margin-left: 15px; font-size: 20px; cursor: pointer" size="50" @click="openEditGroup()"></i>
        </el-form-item>
        <el-row class="tc">
          <el-button @click="editKefu" type='primary' icon='el-icon-check'>保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync='editGroupDialog' title='编辑分组' width='500px' :close-on-click-modal='false'>
      <el-table :data='kefuGroup' border stripe>
        <el-table-column prop='name' label='名称' align='center' width="180">
          <template slot-scope="scope">
            <el-input v-model.trim='scope.row.name' v-if="scope.row.edit"/>
            <span v-text="scope.row.name" v-if="!scope.row.edit"></span>
          </template>
        </el-table-column>
        <el-table-column label='操作'   align='center' fixed='right'>
          <template slot-scope="scope">
            <el-button type='text' size='small' @click="editGroup(scope.$index)" v-if="!scope.row.edit">编辑</el-button>
            <el-button type='text' size='small' @click="saveGroup(scope)" v-if="scope.row.edit">保存</el-button>
            <el-button type='text' size='small' @click="deleteGroup(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-button @click="addGroup" type='primary' icon='el-icon-check'>添加</el-button> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addGroup">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '@/servers/kefu'
  import config from '@/config/api'
  import { Message } from 'element-ui';
  export default {
    data() {
      return {
        uploadUrl: config.ossUpload || '',//文件上传
        searchParams:{
          phone:'',
          name: ''
        },
        kefuGroup: [],
        createParams:{
          loginId: '',
          phone:'',
          name: '',
          groupId: '',
          desc: '',
          manager: '',
          roleIds: '',
          avatar: ''
        },
        rules: {
          loginId: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          name: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          groupId: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          desc: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          manager: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          roleIds: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          avatar: [
            { required: true, message: ' ', trigger: 'blur' },
          ]
        },
        editParams:{
          loginId: '',
          phone:'',
          name: '',
          groupId: '',
          desc: '',
          manager: '',
          roleIds: '',
          avatar: ''
        },
        dataList:[
          {
            "id":"",
            "userId":"",
            "loginId":"",
            "phone":"",
            "name":"",
            "avatar":"",
            "desc":"",
            "manager":'',
            "useStatus":'',
            createT: {seconds: '', humanTime: ""}
          },
        ],
        managers: [
          {
            name: '否',
            value: false
          },
          {
            name: '是',
            value: true
          }
        ],
        roleIds: [
          {
            name: '客服主管',
            value: '5df899ab306b88278926bdbe'
          },
          {
            name: '客服专员',
            value: '5df899b5306b88278926bdc1'
          }
        ],
        isShowDialog:false,
        editDialog:false,
        editGroupDialog: false,
        dialogTitle:'新增客服',
        imageUrl:'',
        page:{
          pageSize:10,
          pageNumber:1,
          total:0
        }
      };
    },
    mounted(){
      this.searchList();
      this.kefuGroupList()
    },
    methods: {
      deleteGroup (obj) {
          let params = {
            queryParam: obj.row.id,
          }
          api.deleteKefuGroup(params).then(res => {
            if(res.code === 200){
                this.kefuGroupList()
              }
          })
      },
      addGroup () {
        if (!this.kefuGroup[this.kefuGroup.length - 1].adding) {
          this.kefuGroup.push({
            name: "",
            edit: true,
            adding: true
          })
        }
      },
      saveGroup (obj) {
        console.log(obj.row)
        if (!obj.row.adding) {
          let params = {
            queryParam: obj.row.id,
            name: obj.row.name
          }
          api.editKefuGroup(params).then(res => {
            if(res.code === 200){
                this.kefuGroupList()
              }
          })
        }
        else {
          let params = {
            name: obj.row.name
          }
          api.addKefuGroup(params).then(res => {
            if(res.code === 200){
                this.kefuGroupList()
              }
          })
        }
        
      },
      editGroup (index) {
        this.$set(this.kefuGroup[index], 'edit', true)
        console.log(this.kefuGroup[index])
      },
      openEditGroup () {
        this.editGroupDialog = true;
      },
      closeStatus (row) {
        let params = {
          queryParam: row.id,
          userId: row.userId,
          useStatus: 2,
          force: false,
          ban: false
        }
        api.statusKefu(params).then(res => {
          if(res.code === 200){
              this.searchList();
            }
        })
      },
      openStatus (row) {
        let params = {
          queryParam: row.id,
          userId: row.userId,
          useStatus: 1,
          force: false,
          ban: false
        }
        api.statusKefu(params).then(res => {
          if(res.code === 200){
              this.searchList();
            }
        })
      },
      searchList(obj){
        
        if (obj == 'reset') {
          this.searchParams = {
            phone:'',
            name: ''
          }
        }
        let params = {
          ... this.searchParams,
          page: this.page.pageNumber,
          size: this.page.pageSize,
          isall: true
        }
        api.kefulist(params).then(res => {
          if(res.code === 200){
              this.dataList = res.data.data
              this.page.total = res.data.total
            }
        })
      },

      kefuGroupList(){
        let params = {
          page: 1,
          size: 1000000
        }
        api.kefuGroup(params).then(res => {
          if(res.code === 200){
              this.kefuGroup = res.data.data
            }
        })
      },
      showDialog(obj){
        
        if(obj === 1){
          this.isShowDialog = true
          this.dialogTitle = '新增客服'
        }else {
          this.editParams = obj;
          this.editParams.queryParam = obj.id;
          this.editDialog = true;
          this.dialogTitle = '编辑客服';
        }
      },
      handleAvatarEditSuccess (res, file) {
        this.editParams.avatar = res.data.url;
      },
      handleAvatarSuccess(res, file) {
        this.createParams.avatar = res.data.url;
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
        if (!params.loginId) {
          Message({
              message: '请输入登录名',
              type: 'error'
          });
          return false
        }
        if (!params.name) {
          Message({
              message: '请输入姓名',
              type: 'error'
          });
          return false
        }
        if (!params.phone) {
          Message({
              message: '请输入电话',
              type: 'error'
          });
          return false
        }
        if (!params.desc) {
          Message({
              message: '请输入描述',
              type: 'error'
          });
          return false
        }
        if (!params.avatar) {
          Message({
              message: '请上传头像',
              type: 'error'
          });
          return false
        }
        if (params.manager === '') {
          Message({
              message: '请选择管理',
              type: 'error'
          });
          return false
        }
        if (!params.groupId) {
          Message({
              message: '请选择组',
              type: 'error'
          });
          return false
        }
        params.roleIds = [];
        params.roleIds.push('5df899ab306b88278926bdbe');
        api.addKefu(params).then(res => {
          if(res.code === 200){
              this.isShowDialog = false;
              this.searchList();
              this.createParams = {
                loginId: '',
                phone:'',
                name: '',
                groupId: '',
                desc: '',
                manager: '',
                roleIds: '',
                avatar: ''
              }
            }
        })
      },

      editKefu () {
        var id = this.createParams.roleIds;
        let params = {
          ... this.editParams
        }
        params.roleIds = [];
        params.roleIds.push('5df899ab306b88278926bdbe');
        if (!params.loginId) {
          Message({
              message: '请输入登录名',
              type: 'error'
          });
          return false
        }
        if (!params.name) {
          Message({
              message: '请输入姓名',
              type: 'error'
          });
          return false
        }
        if (!params.phone) {
          Message({
              message: '请输入电话',
              type: 'error'
          });
          return false
        }
        if (!params.desc) {
          Message({
              message: '请输入描述',
              type: 'error'
          });
          return false
        }
        if (!params.avatar) {
          Message({
              message: '请上传头像',
              type: 'error'
          });
          return false
        }
        if (params.manager === '') {
          Message({
              message: '请选择管理',
              type: 'error'
          });
          return false
        }
        if (!params.groupId) {
          Message({
              message: '请选择组',
              type: 'error'
          });
          return false
        }
        api.editKefu(params).then(res => {
          if(res.code === 200){
              this.editDialog = false;
              this.searchList();
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

</style>