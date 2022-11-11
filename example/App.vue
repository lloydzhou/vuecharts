<template>
  <div class="container">
    <Chart>
      <Grid :top="100" />
      <Legend :data="['data1', 'data2']" :top="65" />
      <Title text="顶部标题" subtext="顶部小标题" left="center" :top="10" />
      <Title text="底部标题" top="bottom" left="center" />
      <Bar name="data1" :data="[0.32, 0.45, 0.2]" />
      <Bar name="data2" :data="[0.2, 0.5, 0.3]" />
      <Line name="data2" :data="[0.2, 0.5, 0.3]" />
      <YAxis />
      <XAxis :data="['x1', 'x2', 'x3']" />
      <Tooltip trigger="axis" />
    </Chart>
    <h2>Heatmap必须搭配VisualMap</h2>
    <e-chart>
      <e-tooltip position="top" />
      <e-grid top="10%" height="50%" />
      <e-x-axis :data="hours" />
      <e-y-axis :data="days" type="category" />
      <e-visual-map :calculable="true" orient='horizontal' left='center' bottom="15%" :min="0" max="10" />
      <e-heatmap name="Punch Card" :data="data" :label="{show: true}" :emphasis="{itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)'}}" />
    </e-chart>
    <h2>切换图形</h2>
    <Chart ref="chart3">
      <TreemapSunburstTransition />
    </Chart>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, inject, ref, onUnmounted, onMounted, h, reactive } from 'vue'
// 这里是引用全部的echarts，可以自己参照文档做按需加载
import 'echarts'
import Echarts, { contextSymbol } from '../lib/index'
// import Echarts from 'vuecharts3'

console.log('Echarts', Echarts)

const { Chart, Title, Tooltip, Line, Bar, Legend, Grid, XAxis, YAxis, Heatmap, VisualMap } = Echarts
const { Treemap, Sunburst } = Echarts

const TreemapSunburstTransition = defineComponent({
  name: 'TreemapSunburstTransition',
  inject: [contextSymbol],
  setup() {
    const { chart } = inject(contextSymbol)
    const interval = ref()
    const state = reactive({
      data: null,
      type: '',
    })

    const url = "https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/echarts-package-size.json"
    fetch(url).then(res => res.json()).then(data => {
      state.data = data.children
      console.log('data.value', data.children)
      interval.value = setInterval(function () {
        state.type = state.type == 'treemap' ? 'sunburst' : 'treemap'
        console.log('state.type', state.type)
      }, 3000);
    })
    onUnmounted(() => clearInterval(interval.value))
    return () => state.type == 'treemap' ?
      h(Treemap, {
        id: 'echarts-package-size',
        animationDurationUpdate: 1000,
        roam: false,
        nodeClick: undefined,
        data: state.data,
        universalTransition: true,
        label: {
          show: true
        },
        breadcrumb: {
          show: false
        }
      }) : h(Sunburst, {
        id: 'echarts-package-size',
        radius: ['20%', '90%'],
        animationDurationUpdate: 1000,
        nodeClick: undefined,
        data: state.data,
        universalTransition: true,
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,.5)'
        },
        label: {
          show: false
        }
      })
  }
})

export default defineComponent({

  components: {
    Chart,
    Title, Tooltip, Bar, Line, Legend, Grid, XAxis, YAxis,
    // Heatmap, VisualMap,
    TreemapSunburstTransition,
  },

  setup() {
    const hours = [
      '12a', '1a', '2a', '3a', '4a', '5a', '6a',
      '7a', '8a', '9a', '10a', '11a',
      '12p', '1p', '2p', '3p', '4p', '5p',
      '6p', '7p', '8p', '9p', '10p', '11p'
    ]

    const days = [
      'Saturday', 'Friday', 'Thursday',
      'Wednesday', 'Tuesday', 'Monday', 'Sunday'
    ]

    const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]].map(function (item) {
      return [item[1], item[0], item[2] || '-'];
    })

    const chart3 = ref()
    onMounted(() => {
      console.log('chart3', chart3.value)
    })

    return {
      hours,
      days,
      data,
      chart3,
    }
  }
})
</script>
<style lang="less">
.echarts {
  min-height: 300px;
}
</style>

