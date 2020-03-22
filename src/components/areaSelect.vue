<template>
  <div>
    <el-select v-model='provice' @change='setNowProvice' :size='size'>
      <el-option v-for="(item,index) in proviceList" :label='item.name' :value='item.name' :key='index'></el-option>
    </el-select>
    <el-select v-model='city' @change='setNowCity'  :size='size'>
      <el-option v-for="(item,index) in proviceList[nowProviceIdx].city" :label='item.name' :value='item.name' :key='index'></el-option>
    </el-select>
    <el-select v-model='area' @change='getAddress' :size='size'>
      <el-option v-for="(item,index) in proviceList[nowProviceIdx].city[nowCityIdx].area" :label='item' :value='item' :key='index'></el-option>
    </el-select>
  </div>
</template>

<script>
const city = require('@/config/city').default.city

export default {
  name: 'areaSelect',
  props: {
    areaData:{
      type: String,
      default: ''
    },
    size:{
      type:String,
      default:'medium'
    }
    
  },
  computed:{
    
  },
  data(){
    return {
      proviceList: city,
      nowProviceIdx:0,
      nowCityIdx:0,
      provice:'',
      city:'',
      area:'',
      optionsProps:{
        label:'name',
      }
    }
  },
  methods:{
    setNowProvice(){
      this.city = ''
      this.area = ''
      this.proviceList.map((itm,index)=>{
        if(itm.name === this.provice){
          this.nowProviceIdx = index
        }
      })
    },
    setNowCity(){
      this.area = ''
      if(!this.provice){
        this.$message.error('请先选择省份')
        this.city = ''
        return false
      }
      this.proviceList[this.nowProviceIdx].city.map((itm,index)=>{
        if(itm.name === this.city){
          this.nowCityIdx = index
        }
      })
    },
    getAddress(){
      if(this.area === ''){
        this.$message.warning('请选择地区')
        return false
      }
      if(!this.provice || !this.city){
        this.$message.error('请选择省份或市(区)')
        this.area = ''
        return false
      }
      if(this.provice && this.city && this.area )
        this.$emit('areaData',`${this.provice}/${this.city}/${this.area}`)
      }
    

  },
  mounted(){
    
    
  },
  watch:{
    areaData(val,old){
      if(val){
        let ads = val.split('/')
        this.provice = ads[0] || ''
        this.city = ads[1] || ''
        this.area = ads[2] || ''
      }else{
        this.provice = ''
        this.city = ''
        this.area = ''
      }
    }
  }
}
</script>
<style scoped>
  .el-select{
    width: 150px!important;
  }
</style>