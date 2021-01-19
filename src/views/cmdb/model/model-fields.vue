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
          <span style="color: #1890ff">
            <router-link to="/detail/one">
              1 <i class="el-icon-s-promotion" />
            </router-link>
          </span>
        </div>
        <div class="model-info-div" style="float: right;">
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-edit" type="primary">编辑</el-link>
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-remove-outline" type="primary">停用</el-link>
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-delete" type="primary">删除</el-link>
        </div>
      </el-card>

      <el-tabs v-model="activeName" type="border-card" style="margin-top: 8px" @tab-click="handleClick">
        <el-tab-pane label="模型字段" name="1">
          <div>
            <el-button plain size="mini">字段预览</el-button>
            <!-- 字段分组列表 -->
            <div style="margin-top: 15px">
              <div>
                <i class="el-icon-arrow-right" style="font-size: 12px;" />
                基础信息
              </div>
              <!-- 字段列表 -->
              <div>
                <div class="model-field-div">
                  <!-- 模型详情 -->
                  <div class="model-field-title">1sad发送到发送到发送到发送到发送到发送到发送到发送到发送到发</div>
                  <div class="model-field-remarks">1阿斯顿发围观发生的发色更发送到发噶是的发送到发送到</div>
                </div>
                <div class="model-field-div">
                  <!-- 模型详情 -->
                  <div class="model-field-title">1sad发送到发送到发送到发送到发送到发送到发送到发送到发送到发</div>
                  <div class="model-field-remarks">1阿斯顿发围观发生的发色更发送到发噶是的发送到发送到</div>
                </div>
                <div class="model-field-div">
                  <!-- 模型详情 -->
                  <div class="model-field-title">1sad发送到发送到发送到发送到发送到发送到发送到发送到发送到发</div>
                  <div class="model-field-remarks">1阿斯顿发围观发生的发色更发送到发噶是的发送到发送到</div>
                </div>
                <div class="model-field-div">
                  <!-- 模型详情 -->
                  <div class="model-field-title">1sad发送到发送到发送到发送到发送到发送到发送到发送到发送到发</div>
                  <div class="model-field-remarks">1阿斯顿发围观发生的发色更发送到发噶是的发送到发送到</div>
                </div>
                <div class="model-field-div model-field-add">
                  <div class="model-field-title" style="color: #979ba5">
                    <i class="el-icon-plus" />
                    添加
                  </div>
                  <div class="model-field-remarks">点击此处新增字段</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
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

  .model-field-div {
    width: calc(20% - 10px);
    height: 59px;
    border: 1px solid rgb(221, 228, 235);;
    border-radius: 4px;
    margin-left: 10px;
    margin-top: 12px;
    cursor: pointer;
    display: inline-block;
  }

  .model-field-title {
    margin: 11px 15px 0 15px;
    line-height: 19px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-field-remarks {
    line-height: 16px;
    font-size: 12px;
    color: #bfc7d2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 15px;
  }

  .model-field-add {
    line-height: 59px;
    text-align: center;
    font-size: 14px;
    border-style: dashed;
  }
</style>
