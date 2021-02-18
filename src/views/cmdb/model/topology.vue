<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div id="container" style="height: calc(100vh - 112px);" />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  relatedInfo
} from '@/api/cmdb/model'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/chart/graph')

export default {
  name: 'Topology',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      relatedInfo().then(res => {
        console.log(res)

        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('container'))
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '模型关系'
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          color: '#5470c6',
          series: [
            {
              type: 'graph',
              layout: 'force',
              // symbolSize: 50, //倘若该属性不在link里，则其表示节点的大小；否则即为线两端标记的大小
              symbolSize: 60,
              roam: true, // 鼠标缩放功能
              label: {
                show: true // 是否显示标签
              },
              focusNodeAdjacency: true, // 鼠标移到节点上时突出显示结点以及邻节点和边
              edgeSymbol: ['none', 'arrow'], // 关系两边的展现形式，也即图中线两端的展现形式。arrow为箭头
              edgeSymbolSize: [4, 10],
              draggable: true,
              edgeLabel: {
                fontSize: 20 // 关系（也即线）上的标签字体大小
              },
              force: {
                repulsion: 200,
                edgeLength: 120
              },
              data: res.data.models,
              links: res.data.relateds,
              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      })
    }
  }
}
</script>
