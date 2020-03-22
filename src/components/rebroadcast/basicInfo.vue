<template>
  <div class="infoBox">
    <div>
      <span>
        回播课名称
      </span>
      <span>
        {{ detail.name}}
      </span>
    </div>
    <div>
      <span>
        课程描述
      </span>
      <span>
        {{ detail.textDesc}}
      </span>
    </div>
    <div>
      <span>
        开课时间
      </span>
      <span>
        {{ detail.startTime | formatDate}}
      </span>
    </div>

  </div>
</template>
<style lang='less'>
  .infoBox {
    font-size: 13px;

    >div {
      padding: 10px 10px;
      color: #3d3c3c;
      display: flex;

      span:nth-child(1) {
        width: 70px;
        text-align: right;
        margin-right: 20px;
        display: inline-block;
      }
      span:nth-child(2) {
        flex: 1;
      }
    }

  }
</style>
<script>
  export default {
    props: {
      detail: {
        default: Object,
        default: () => ({})
      }
    },
    data() {
      return {

      }
    },
  }
</script>