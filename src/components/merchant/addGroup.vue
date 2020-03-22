<template>
  <div>
    <el-dialog :visible.sync='dialogData.isShow'
     :title="(dialogData.isEdit ? '编辑' :'新增')+'组'" 
     :close-on-click-modal='false'
      width='500px'>
      <el-form @submit.native.prevent inline labelWidth='100px'>
        <el-form-item label='组名称'>
          <el-input v-model.trim='name' placeholder='组名称'></el-input>
        </el-form-item>
        <el-button type='primary' @click='save'>提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/servers/merchant'
export default {
  name: 'addGroup',
  props:{
    dialogData:{
      type:Object,
      default:{
        isShow:false,
        isEdit:false,
        data:{
          id:'',
          name:''
        }
      }
    }
  },
  data () {
    return {
      name:''
    }
  },
  methods: {
    save(){
      if(!this.name.length){
        this.$message.error('组名称必填！')
        return false
      }
      let params = {
        name: this.name
      }
      if(this.dialogData.data.id !==''){
        params.queryParam = this.dialogData.data.id
        api.editGroup(params).then(res => {
          if(res.code === 200){
            this.$message.success(res.msg || '编辑成功')
          }
        })
      }else{
        api.addGroup(params).then(res => {
          if(res.code === 200){
            this.$message.success(res.msg || '新增成功')

          }
        })
      }
      this.$emit('close',true)
    },
  },
  mounted() {
  },
  watch:{
    'dialogData.isShow':function(val){
      if(!val){
        this.dialogData.isEdit = false
        this.dialogData.data = {
          id:'',
          name:''
        }
      }else{
        this.dialogData.isEdit = true
        this.name = this.dialogData.data.name
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
