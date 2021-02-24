<template>
  <el-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false">
    <div class="chart-card-header">
      <div style="width: calc(100% - 60px);float: left;">
        <div class="meta">
          <span class="chart-card-title">
            <slot name="title">
              {{ title }}
            </slot>
          </span>
          <span class="chart-card-action">
            <slot name="action" />
          </span>
        </div>
        <div class="total">
          <slot name="total">
            <span>{{ typeof total === 'function' && total() || total }}</span>
          </slot>
        </div>
      </div>
      <div style="width: 60px;float: left;height: 66px;text-align: center;">
        <i :class="icon" style="font-size: 60px;margin-top: 5px; color: #1890FF" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    .meta {
      position: relative;
      overflow: hidden;
      width: 100%;
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
      line-height: 22px;
    }
  }
  .chart-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
  }
</style>
