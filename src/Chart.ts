// @ts-nocheck
import {
  DefineComponent,
  defineComponent,
  ref, markRaw, toRefs,
  shallowReactive,
  watch, watchEffect,
  h,
  provide,
  inject,
  onMounted,
  onUnmounted,
  Fragment,
} from 'vue'

// 按需加载  https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6
import { init as initChart, throttle } from 'echarts/core'
import { addListener, removeListener } from "resize-detector";

export const contextSymbol = String(Symbol('echartsContextSymbol'))


const props = {
  option: {
    type: Object,
    default : () => ({})
  },
  notMerge: {
    type: Boolean,
    default : () => false,
  },
  lazyUpdate: {
    type: Boolean,
    default : () => false,
  },
  group: {
    type: String,
    default : () => '',
  },
  width: {
    type: Number,
    default : () => 600,
  },
  height: {
    type: Number,
    default : () => 300,
  },
  autoresize: {
    type: Boolean,
    default : () => true,
  },
  theme: {
    type: [Object, String],
    default : () => undefined,
  },
}
export const Chart: DefineComponent<typeof props, () => null> = defineComponent({
  name: 'Chart',
  inheritAttrs: false,
  props,
  setup(props, { emit }) {

    const container = ref(null)
    const state = shallowReactive({
      options: markRaw(props.option),
      replaceMerge: new Set(),
      chart: null,
      setOption: (key, option) => {
        // 1. 移除option中无用的key
        Object.keys(option).forEach(name => {
          if (option[name] === undefined || option[name] === null) {
            delete option[name]
          }
        })
        // 2. 往当前的state.options中合并新的组件配置
        if (!state.options[key]) {
          state.options[key] = []
        }
        // 尝试先移除一下相同的id，避免出现相同的id配置项
        state.removeOption(key, option.id)
        state.options[key].push(option)
        // 3. 增加replaceMerge
        state.replaceMerge.add(key)
        // 4. 提交更新到echarts
        commit()
      },
      removeOption: (key, id) => {
        if (state.options[key]) {
          // 1. 移除组件配置
          state.options[key] = state.options[key].filter(i => i.id !== id)
          // 2. 增加replaceMerge
          state.replaceMerge.add(key)
          // 3. 提交更新到echarts
          commit()
        }
      }
    })
    // 这里实际上形成了一个批量更改一次提交的过程
    // 避免了一个子组件有变化（例如series中的数据）
    // 提交的时候影响到另一个子组件（例如xAxis）
    const commit = throttle(() => {
      if (state.chart) {
        // 提交画布更新的时候，使用replaceMerge选项
        state.chart.setOption(markRaw(state.options), {
          lazyUpdate: props.lazyUpdate,
          replaceMerge: Array.from(state.replaceMerge),
        })
        // 提交画布更新之后，重置replaceMerge
        state.replaceMerge = new Set()
      }
    }, 50, true)
    provide(contextSymbol, state)

    watch(() => props.group, group => {
      state.chart.group = group
    })

    watch(() => props.option, option => {
      // 需要将option全部放到state进行管理
      Object.keys(option).forEach(key => state.setOption(option[key]))
    }, { deep: true })

    const rendered = () => emit('rendered')
    const finished = () => emit('finished')
    const init = () => {
      const chart = state.chart = initChart(container.value, props.theme)
      if (props.group) {
        chart.group = props.group
      }
      chart.on('rendered', rendered)
      chart.on('finished', finished)
      // 使用默认的option初始化画布
      commit()
    }
    // watch size
    watchEffect(() => {
      if (state.chart && props.width && props.height) {
        state.chart.resize({ width: props.width, height: props.height })
      }
    })
    // autoresize
    watchEffect((cleanup) => {
      const resizeListener = throttle(() => {
        state.chart && state.chart.resize()
      }, 100)
      if (container.value && state.chart && props.autoresize) {
        addListener(container.value, resizeListener)
      }
      cleanup(() => {
        if (container.value && resizeListener) {
          removeListener(container.value, resizeListener)
        }
      })
    })
    // watch theme change
    watch(() => props.theme, () => {
      if (state.chart) {
        state.chart.dispose()
      }
      init()
    })
    onMounted(() => init())
    onUnmounted(() => {
      if (state.chart) {
        state.chart.dispose()
        state.chart = null
      }
    })

    return {
      ...toRefs(state), // 父组件如果绑定ref，可以拿到chart和内部重新定义的setOption方法
      container,
    }

  },
  render() {
    const { $attrs: attrs, $slots: slots, chart } = this
    return h(Fragment, null, h('div', {
      ...attrs,
      class: attrs.class ? ['echarts'].concat(attrs.class) : 'echarts',
      ref: 'container',
      style: 'display:block;width:100%;height:100%;' + (attrs.style || ''),
    }), chart && slots.default && slots.default())
  }
})

export const useChartContext = () => inject(contextSymbol)

