<template>
  <div class="search-div">
    <div>
      <vue-particles
        :color="stypeColor"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="circle"
        :particle-size="4"
        :lines-color="stypeColor"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
        class="lizi"
      />
    </div>
    <div class="search-value">
      <el-input placeholder="请输入资源内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      stypeColor: '#999'
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .lizi {
    position:fixed;
    width: 100%;
  }

  .search-value {
    position: relative;
    top: 260px;
    border-radius: 4px;
    margin: 0 auto;
    width: 880px;
    -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  }

  /deep/ .input-with-select .el-input__inner {
    height: 46px;
  }

  .input-with-select {
    font-size: 20px;
  }
</style>
