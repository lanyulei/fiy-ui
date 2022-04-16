<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="业务总数" icon="el-icon-s-cooperation" :total="operationData.biz_count" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="自定义模型总数" icon="el-icon-s-platform" :total="operationData.model_count" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="集群模板总数" icon="el-icon-s-order" :total="operationData.cluster_tpl_count" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="服务模板总数" icon="el-icon-s-grid" :total="operationData.svc_tpl_count" />
      </el-col>
    </el-row>

    <!-- <el-row v-for="(item, index) in operationData.series" :key="index" :gutter="12" style="margin-bottom: 12px;">
      <el-col>
        <el-card :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <LineChart :series="item" />
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import ChartCard from './components/ChartCard'
// import LineChart from './components/LineChart'

import { getOperation } from '@/api/cmdb/analysis'

export default {
  name: 'DashboardAdmin',
  components: {
    // LineChart,
    ChartCard
  },
  data() {
    return {
      operationData: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getOperation().then(res => {
        this.operationData = res.data
        this.operationData.series = [{
          title: '资源管理',
          legend: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          x_axis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          list: [
            {
              name: '邮件营销',
              type: 'line',
              data: [120, 132, 101, 134, 90, 230, 210]
            }
          ]
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

::v-deep .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}
</style>
