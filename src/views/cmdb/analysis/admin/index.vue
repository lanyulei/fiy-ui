<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="业务总数" icon="el-icon-s-cooperation" :total="300" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="自定义模型总数" icon="el-icon-s-platform" :total="88" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="集群模板总数" icon="el-icon-s-order" :total="65" />
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="服务模板总数" icon="el-icon-s-grid" :total="78" />
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-bottom: 12px;">
      <el-col>
        <el-card :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <bar :list="barData" title="资源统计" :padding="['auto', 'auto', '30', '40']" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="12" :xl="12" :lg="12">
        <el-card :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <bar :list="barData" title="云资源统计" :padding="['auto', 'auto', '30', '50']" />
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="12" :xl="12" :lg="12">
        <el-card :bordered="false" :body-style="{padding: '0'}">
          <div class="salesCard">
            <rank-list title="最近操作记录" :list="rankList" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChartCard from './components/ChartCard'
import RankList from './components/RankList/index'
import Bar from './components/Bar.vue'

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: `新建模型 "主机 - ${i}"`,
    total: '2021-02-27 12:25'
  })
}

export default {
  name: 'DashboardAdmin',
  components: {
    ChartCard,
    RankList,
    Bar
  },
  data() {
    return {
      barData: [{
        type: '主机',
        value: 560,
        percent: 0.02
      }, {
        type: '业务',
        value: 300,
        percent: 0.02
      }, {
        type: '集群',
        value: 60,
        percent: 0.2
      }, {
        type: '模型',
        value: 88,
        percent: 0.24
      }],
      rankList
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

/deep/ .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}
</style>
