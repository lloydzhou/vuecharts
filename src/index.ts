// @ts-nocheck
import { Chart, default as Echarts } from './Chart'

const components = [
  ...Object.values(Echarts), // 这里将Echarts这个里面所有的组件都注册一下
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(`E${component.name}`, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

Echarts.install = install
Chart.install = install

export default Echarts

