<template>
  <div class="mt20">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageLimit.pageNumber"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageLimit.pageSize"
      layout="prev, pager, next"
      :total="pageLimit.total" small>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props:{
    pageLimit:{
      type:Object,
      default:{
        pageSize:10,
        pageNumber:1,
        total:0
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageLimit.pageSize = val
      this.$emit('change',val,this.pageLimit.pageNumber)
    },
    handleCurrentChange(val){
      this.pageLimit.pageNumber = val
      this.$emit('change',this.pageLimit.pageSize,val)
    }
  },
  mounted() {
  },
}
</script>
<style lang="less" scoped>

</style>
