<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="业务总数" icon="el-icon-s-cooperation" :total="260" />
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
            <bar :list="barData" title="资源统计" />
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
            <rank-list title="操作记录" :list="rankList" />
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

const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
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
      barData,
      barData2,
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
