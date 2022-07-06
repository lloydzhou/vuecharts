# vuecharts

## 项目设计
1. 官方团队[Baidu EFE team](https://github.com/ecomfe)有出一个vue封装的echarts库[vue-echarts](https://github.com/ecomfe/vue-echarts) 。但是这个库和自己在vue里面封装没有啥太大区别。仍旧摆脱不了针对一个图表写一个巨大的配置文件。
2. 参考[BizCharts](https://github.com/alibaba/BizCharts)对[G2](https://github.com/antvis/G2)这个库的封装方式，对echarts进行了封装。相对而言API更方便使用
3. 使用[ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys)，从echarts导出的XXOption自动生成vue组件props


## 安装
```
yarn add vuecharts3
```

## Components

项目定义的组件包含在下图中，每一个都是一个vue的Component。
具体的组件支持的配置信息参考：https://echarts.apache.org/zh/option.html#title （可以通过名字首字母小写后搜索到对应的配置项目）

![image](https://user-images.githubusercontent.com/1826685/175003071-61970374-aceb-4579-ac63-cb042e267c77.png)


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


## 自定义组件

1. 通过自定义组件实现官方切换图像的[example](https://echarts.apache.org/examples/zh/editor.html?c=treemap-sunburst-transition)

```
import { contextSymbol } from 'vuecharts3'

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

// template
<Chart>
  <TreemapSunburstTransition />
</Chart>

```

![](https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/treemap-sunburst-transition.webp?_v_=1655181358610)


