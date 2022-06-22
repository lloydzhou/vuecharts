# vuecharts

## 项目设计
1. 官方团队[Baidu EFE team](https://github.com/ecomfe)有出一个vue封装的echarts库[vue-echarts](https://github.com/ecomfe/vue-echarts) 。但是这个库和自己在vue里面封装没有啥太大区别。仍旧摆脱不了针对一个图表写一个巨大的配置文件。
2. 参考[BizCharts](https://github.com/alibaba/BizCharts)对[G2](https://github.com/antvis/G2)这个库的封装方式，对echarts进行了封装。相对而言API更方便使用


## 安装
```
yarn add vuecharts3
```

## DEMO
```
import 'echarts'
import Echarts from 'vuecharts3'

const { Chart, Title, Tooltip, Line, Bar, Legend, Grid, XAxis, YAxis } = Echarts

export default defineComponent({

  components: {
    Chart,
    Title, Tooltip, Bar, Line, Legend, Grid, XAxis, YAxis,
  },

  setup() {
    return {}
  }
})


// template

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
    <Chart>
      <Tooltip position="top" />
      <Grid top="10%" height="50%" />
      <XAxis :data="hours" />
      <YAxis :data="days" type="category" />
      <VisualMap :calculable="true" orient='horizontal' left='center' bottom="15%" :min="0" max="10" />
      <Heatmap name="Punch Card" :data="data" :label="{show: true}" :emphasis="{itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)'}}" />
    </Chart>
  </div>
</template>


```

![image](https://user-images.githubusercontent.com/1826685/174950158-e5f8258d-b0b9-4c39-be90-7eefbb7667f0.png)




