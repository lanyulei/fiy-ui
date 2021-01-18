<template>
  <BasicLayout>
    <template #wrapper>
      <!-- 模型信息 -->
      <el-card class="box-card">
        <div style="float: left;height: 65px">
          <i
            style="font-size: 45px; margin-right: 20px; color: #3a84ff;"
            class="el-icon-info"
          />
        </div>
        <div style="font-size: 14px; float: left;" class="model-info-div">
          <span style="color: #737987;">唯一标识：</span>1
          <span style="color: #737987; margin-left: 10px;">名称：</span>1
          <span style="color: #737987; margin-left: 10px;">实例数量：</span>
          <el-link type="primary">1 <i class="el-icon-s-promotion" /></el-link>
        </div>
        <div class="model-info-div" style="float: right;">
          <el-link style="margin-left: 10px;" icon="el-icon-edit" type="primary">编辑</el-link>
          <el-link style="margin-left: 10px;" icon="el-icon-remove-outline" type="primary">停用</el-link>
          <el-link style="margin-left: 10px;" icon="el-icon-delete" type="primary">删除</el-link>
        </div>
      </el-card>

      <el-tabs v-model="activeName" type="border-card" style="margin-top: 8px" @tab-click="handleClick">
        <el-tab-pane label="模型字段" name="1">模型字段</el-tab-pane>
        <el-tab-pane label="模型关联" name="2">模型关联</el-tab-pane>
        <el-tab-pane label="唯一校验" name="3">唯一校验</el-tab-pane>
      </el-tabs>
    </template>
  </BasicLayout>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    // 获取数据
    getInfo() {

    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
  .model-info-div {
    display: inline-block;
    height: 45px;
    line-height: 45px;
  }
</style>
