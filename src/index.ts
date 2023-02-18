// @ts-nocheck
import * as Echarts from './Components'

// 这里将Echarts这个里面所有的组件都注册一下
const components = Object.values(Echarts).filter(i => !!i.setup)

export const install = function (Vue) {
  components.forEach(component => {
    Vue.component(`E${component.name}`, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default Echarts
export * from './Components'

