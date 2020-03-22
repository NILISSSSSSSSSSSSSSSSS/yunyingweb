<template>
  <div>
    <el-dialog :visible.sync='menuObj.isShow' title='答疑收藏' width='600px' append-to-body>
      <el-form :model='formParams' ref='formParams' labelWidth='100px'>
        <el-form-item prop='question' :rules='rules' label='问题：'>
          <el-input v-model='formParams.question' type='textarea' rows='4' placeholder='问题描述' clearable />
        </el-form-item>
        <el-form-item prop='answer' :rules='rules' label='我的回答：'>
          <el-input v-model='formParams.answer' type='textarea' rows='8' placeholder='我的回答' clearable />
        </el-form-item>
        <el-form-item label='标签：'>
          <el-tag class="mr10" :key="tag" v-for="tag in formParams.tags" closable :disable-transitions="false"
            @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
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
  import api from '@/servers/course'
  export default {
    props: {
      menuObj: {
        type: Object,
        default: () => { return {} }
      },
    },
    watch: {
      'menuObj.isShow'(val, oldVal) {
        if (val) {
          this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
          this.inputVisible = false;
          this.inputValue = "";
          let info = this.menuObj.data;
          this.formParams = {
            question: this.menuObj.data.questionName,
            answer: info.msgItem.content,
            tags: [],
            creator: {
              userId: info.sender.senderId,
              name: info.sender.senderNickname,
              avatar: info.sender.senderAvatar,
            }
          }
        }
      }
    },
    data() {
      return {
        formParams: {
          question: '',
          answer: '',
          tags: [],
          creator: {
            userId:'',
            name: '',
            avatar: ''
          }
        },
        rules: [
          { required: true, message: '必填', triiger: 'blur' }
        ],
        inputVisible: false,
        inputValue: ""
      }
    },
    methods: {
      //提交答疑
      saveQuestion() {
        this.$refs['formParams'].validate(valid => {
          if (valid) {
            if(this.formParams.tags.length==0){
              this.$message.error("标签必填");return;
            }
            api.addDaYi(this.formParams).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg || '新增成功')
                this.$emit('closeMain')
              }
            })
          } else {
            return false
          }
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
      resetForm() {
        this.formParams.question = ''
        this.formParams.answer = ''
        this.formParams.tags = []
        this.$refs['formParams'].resetFields()
      },
      handleClose(tag) {
        this.formParams.tags.splice(this.formParams.tags.indexOf(tag), 1);
      },
    },
  }

</script>