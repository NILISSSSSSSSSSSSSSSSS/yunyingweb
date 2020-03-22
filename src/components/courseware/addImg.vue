<template>
  <div>
    <el-dialog
      :visible.sync="dialogData.isShow"
      :title="'上传' + (isVerbal ? '话术' : '课件') + '图片/音频/视频'"
      :before-close="beforeClose"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form labelWidth="120px">
        <el-form-item label="选择文件">
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            multiple
            :file-list="fileList"
            accept="image/jpeg,image/png,image/gif, audio/mpeg, video/mp4"
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
            :on-remove="removeFile"
          >
            <el-button :loading="loading" type="success" plain size="small">选择文件</el-button>
            <span class="col-gray ft12 ml10">
              仅支持<span class="col-red">jpg,png,gif,mp3,mp4</span>格式文件上传
            </span>
          </el-upload>
          <div>
            已选
            <span class="col-red">{{dataList.length}}</span>个内容
          </div>
          <div v-for="(itm,index) in dataList" :key="index">
            <div class="file-item">
              <span class="file-name">{{itm.title}}</span>
              <div class="file-set fr">
                <i @click="sortData(index,'up')" class="el-icon-top pointer"></i>
                <i @click="sortData(index,'down')" class="el-icon-bottom pointer"></i>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-row class="mt20 tr">
        <el-button @click="saveImg" :loading="loading" type="success">提交内容</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
  
  <script>
import api from "@/servers/course";
import config from "@/config/api";
export default {
  props: {
    dialogData: {
      type: Object,
      default: {
        isShow: false,
        type: "",
        courseList: []
      }
    },
    itemId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      uploadUrl: config.ossUpload || "", //文件上传
      courseId: this.$route.query.id || this.itemId,
      loading: false,
      fileList: [],
      dataList: [],
      // isComputed:false,//当前文件是否已完成上传
      isVerbal: false // true 课件库 false 话术库
    };
  },
  methods: {
    saveImg() {
      this.courseId = this.$route.query.id || this.itemId;
      if (!this.courseId) {
        this.$message.error("请先填写基本信息并保存~");
        return false;
      }
      //课件库
      if (!this.isVerbal) {
        let data = [],
          params = {};
        data = [...this.dialogData.courseList, ...this.dataList];
        data.queryParam = this.courseId;
        api.courseItem(data).then(res => {
          if (res.code === 200) {
            this.dialogData.isShow = false;
            this.fileList = [];
            this.dataList = [];
            this.$emit("closeImg", true);
          }
        });
      } else {
        //话术库
        if (!this.dataList.length) {
          this.$message.error("话术内容不能为空");
          return false;
        }
        this.dialogData.isShow = false;
        this.fileList = [];
        this.$emit("closeImg", this.dataList);
        this.dataList = [];
      }
    },
    beforeUpload(file) {
      this.loading = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      if (res.code === 200) {
        try {
          this.dataList = fileList.map(m => ({
            content: m.response.data.url,
            title: m.response.data.filename,
            length: m.response.data.voiceLength,
            type: this.formatType(m.response.data.fileExt)
          }));
        } catch (e) {}
        if (fileList.length == this.dataList.length) {
          this.loading = false;
        }
      }
    },
    //调整顺序
    sortData(idx, str) {
      if (str == "up" && idx != 0) {
        let itm = this.dataList[idx - 1];
        this.$set(this.dataList, idx - 1, this.dataList[idx]);
        this.$set(this.dataList, idx, itm);
      } else if (str == "down" && idx != this.dataList.length - 1) {
        let itm = this.dataList[idx + 1];
        this.$set(this.dataList, idx + 1, this.dataList[idx]);
        this.$set(this.dataList, idx, itm);
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
    beforeClose() {
      this.fileList = [];
      this.dataList = [];
      this.dialogData.isShow = false;
    },
    removeFile(file, fileList) {}
  },
  watch: {
    "dialogData.isShow": function(val) {
      if (val) {
        this.isVerbal = this.dialogData.type === "verbal" ? true : false;
      }
    },
    dataList: {
      handler(val, old) {
        this.dataList = val;
      },
      deep: true
    }
  }
};
</script>
  
  <style lang="less" scoped>
.file-name {
  max-width: 330px;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
  white-space: nowrap;
}
.file-item {
  height: 40px;
  width: 400px;
}
.file-item:hover {
  background: #f8f8f8;
}
.file-set {
  vertical-align: middle;
  i {
    width: 20px;
    height: 20px;
    color: #666;
  }
  i:hover {
    color: #67c23a;
  }
}
.fr {
  float: right;
}
/deep/.el-collapse,
.el-collapse-item__header,
/deep/.el-collapse-item__wrap {
  border: 0px !important;
}
/deep/.el-collapse-item__header {
  font-weight: bold !important;
}
.el-form-item {
  min-width: 200px;
}
/deep/.el-form-item__label {
  color: #909399;
}
</style>