// @ts-nocheck
import {
  defineComponent,
  ref, markRaw,
  shallowReactive,
  watch,
  h,
  provide,
  inject,
  onMounted,
  onUnmounted,
} from 'vue'

// 按需加载  https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6
import * as echarts from 'echarts/core'

export const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const contextSymbol = String(Symbol('echartsContextSymbol'))

const series = ['Line', 'Bar', 'Pie', 'Heatmap']
const visualMap = ['VisualMap', 'Continuous', 'Piecewise']

export const useComponent = (props, name, type) => {
  const key = series.indexOf(name) > -1
    ? 'series'
    : visualMap.indexOf(name) > -1
      ? 'visualMap'
      : name.charAt(0).toLowerCase() + name.slice(1)
  const { chart, initOption } = inject(contextSymbol)
  const id = props.id || uniqueId()
  onMounted(() => {
    const options = markRaw({
      ...props,
      type: props.type || type || undefined,
      id,
    })
    // console.log('chart', chart, key, options)
    initOption(key, options)
  })
  onUnmounted(() => {
    const o = chart.getOption()[key] || []
    const option = o.filter(i => i && i.id !== id)
    chart.setOption({ [key]: option }, { replaceMerge: key })
  })
}

const xAxisProps = [
  'show', 'gridIndex', 'alignTicks', 'position', 'offset', 'type',
  'name', 'nameLocation', 'nameTextStyle', 'nameGap', 'nameRotate',
  'inverse', 'boundaryGap', 'min', 'max', 'scale',
  'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent',
  'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'splitLine', 'minorSplitLine',
  'splitArea', 'data', 'axisPointer', 'zlevel', 'z',
]

const props = {
  Title: [
    'show', 'text', 'link', 'target', 'textStyle',
    'subtext', 'sublink', 'subtarget', 'subTextStyle',
    'textAlign', 'textVerticalAlign', 'triggerEvent', 'padding', 'itemGap',
    'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'backgroundColor', 'borderColor', 'borderWidth',
    'borderRadius', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY',
  ],
  Legend: [
    'type', 'show', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height',
    'orient', 'align', 'padding', 'itemGap', 'itemWidth', 'itemHeight', 'itemStyle',
    'lineStyle', 'symbolRotate', 'formatter', 'selectedMode',
    'inactiveColor', 'inactiveBorderColor', 'inactiveBorderWidth',
    'selected', 'textStyle', 'tooltip', 'icon', 'data',
    'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'shadowBlur',
    'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'scrollDataIndex',
    'pageButtonItemGap', 'pageButtonGap', 'pageButtonPosition', 'pageFormatter',
    'pageIcons', 'pageIconColor', 'pageIconInactiveColor', 'pageIconSize', 'pageTextStyle',
    'animation', 'animationDurationUpdate', 'emphasis', 'selector', 'selectorLabel',
    'selectorPosition', 'selectorItemGap', 'selectorButtonGap',
  ],
  Grid: [
    'id', 'show', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'containLabel', 'backgroundColor', 'borderColor', 'borderWidth', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'tooltip'
  ],
  XAxis: xAxisProps,
  YAxis: xAxisProps,
  Tooltip: [
    'show', 'trigger', 'axisPointer', 'showContent', 'alwaysShowContent', 'triggerOn',
    'showDelay', 'hideDelay', 'enterable', 'renderMode', 'confine', 'appendToBody',
    'className', 'transitionDuration', 'position', 'formatter', 'valueFormatter',
    'backgroundColor', 'borderColor', 'borderWidth', 'padding', 'textStyle', 'extraCssText', 'order'
  ],

  // series
  Line: [
    'type', 'id', 'name', 'colorBy', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'showSymbol', 'showAllSymbol', 'legendHoverLink', 'stack', 'stackStrategy', 'cursor', 'connectNulls', 'clip', 'triggerLineEvent', 'step', 'label', 'endLabel', 'labelLine', 'labelLayout', 'itemStyle', 'lineStyle', 'areaStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'smooth', 'smoothMonotone', 'sampling', 'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip',
  ],
  Bar: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'coordinateSystem',
    'xAxisIndex', 'yAxisIndex', 'polarIndex', 'roundCap', 'realtimeSort',
    'showBackground', 'backgroundStyle', 'label', 'labelLine', 'itemStyle', 'labelLayout',
    'emphasis', 'blur', 'select', 'selectedMode', 'stack', 'stackStrategy',
    'sampling', 'cursor',
    'barWidth', 'barMaxWidth', 'barMinWidth', 'barMinHeight', 'barMinAngle', 'barGap', 'barCategoryGap',
    'large', 'largeThreshold', 'progressive', 'progressiveThreshold', 'progressiveChunkMode',
    'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data',
    'clip', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z',
    'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing',
    'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate',
    'animationDelayUpdate', 'universalTransition', 'tooltip',
  ],
  Pie: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'selectedMode', 'selectedOffset', 'clockwise', 'startAngle', 'minAngle', 'minShowLabelAngle', 'roseType', 'avoidLabelOverlap', 'stillShowZeroSum', 'cursor', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'showEmptyCircle', 'emptyCircleStyle', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'center', 'radius', 'seriesLayoutBy', 'datasetIndex', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'silent', 'animationType', 'animationTypeUpdate', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Heatmap: [
    'type', 'id', 'name', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'geoIndex', 'calendarIndex', 'pointSize', 'blurSize', 'minOpacity', 'maxOpacity', 'progressive', 'progressiveThreshold', 'label', 'labelLayout', 'itemStyle', 'emphasis', 'universalTransition', 'blur', 'select', 'selectedMode', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'tooltip'
  ],

  // visualMap
  VisualMap: [
    'type', 'id', 'min', 'max', 'range', 'calculable', 'realtime', 'inverse', 'precision', 'itemWidth', 'itemHeight', 'align', 'text', 'textGap', 'show', 'dimension', 'seriesIndex', 'hoverLink', 'inRange', 'outOfRange', 'controller', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'orient', 'padding', 'backgroundColor', 'borderColor', 'borderWidth', 'color', 'textStyle', 'formatter', 'handleIcon', 'handleSize', 'handleStyle', 'indicatorIcon', 'indicatorSize', 'indicatorStyle'
  ],
  Continuous: [
    'type', 'id', 'min', 'max', 'range', 'calculable', 'realtime', 'inverse', 'precision', 'itemWidth', 'itemHeight', 'align', 'text', 'textGap', 'show', 'dimension', 'seriesIndex', 'hoverLink', 'inRange', 'outOfRange', 'controller', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'orient', 'padding', 'backgroundColor', 'borderColor', 'borderWidth', 'color', 'textStyle', 'formatter', 'handleIcon', 'handleSize', 'handleStyle', 'indicatorIcon', 'indicatorSize', 'indicatorStyle'
  ],
  Piecewise: [
    'type', 'id', 'splitNumber', 'pieces', 'categories', 'min', 'max', 'minOpen', 'maxOpen', 'selectedMode', 'inverse', 'precision', 'itemWidth', 'itemHeight', 'align', 'text', 'textGap', 'showLabel', 'itemGap', 'itemSymbol', 'show', 'dimension', 'seriesIndex', 'hoverLink', 'inRange', 'outOfRange', 'controller', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'orient', 'padding', 'backgroundColor', 'borderColor', 'borderWidth', 'color', 'textStyle', 'formatter'
  ]
}

const defaultTypeMap = {
  Legend: 'plain',
  XAxis: 'category',
  YAxis: 'value',
  Line: 'line',
  Bar: 'bar',
  Pie: 'pie',
  Heatmap: 'heatmap'
}

export const Chart = defineComponent({
  name: 'Chart',
  props: {
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
      default : () => 800,
    },
    height: {
      type: Number,
      default : () => 300,
    },
  },
  setup(props, { emit, attrs, slots }) {

    const root = ref(null)
    const timer = ref()
    const state = shallowReactive({
      options: props.option,
      chart: {},
      initOption: (key, option) => {
        if (!state.options[key]) {
          state.options[key] = []
        }
        Object.keys(option).forEach(name => {
          if (option[name] === undefined || option[name] === null) {
            delete option[name]
          }
        })
        // 子组件里面的props第一次初始化的时候，不调用setOption，而是等子组件都加载好了再一次性的初始化
        state.options[key].push(option)
        setOption()
      }
    })
    const setOption = (option) => {
      if (timer.value) {
        clearTimeout(timer.value)
      }
      timer.value = setTimeout(() => {
        option = markRaw(option || state.options)
        // console.log('setOption', state.chart, option, state.options)
        state.chart.setOption(option, {lazyUpdate: props.lazyUpdate})
      }, 50)
    }
    provide(contextSymbol, state)

    watch(() => props.group, group => {
      state.chart.group = group
    })

    watch(() => props.option, option => {
      setOption(markRaw(option))
    })

    watch(() => ({width: props.width, height: props.height}), size => {
      state.chart.resize(size)
    })

    const rendered = () => emit('rendered')
    const finished = () => emit('finished')
    const init = () => {
      const chart = state.chart = echarts.init(root.value)
      if (props.group) {
        chart.group = props.group
      }
      // console.log('init chart', chart, state.options)
      chart.resize({ width: props.width, height: props.height })
      chart.on('rendered', rendered)
      chart.on('finished', finished)
      setOption(state.options)
    }
    onMounted(() => init())
    onUnmounted(() => {
      if (state.chart) {
        state.chart.dispose()
        state.chart = null
      }
    })

    return () => h('div', null, h('div', {
      ...attrs,
      class: attrs.class ? ['echarts'].concat(attrs.class) : 'echarts',
      ref: root,
      style: 'display:block;width:100%;height:100%;min-height:1px;',
    }), !!state.chart.getDom && slots.default && slots.default())
  },
})

const components = { Chart }
Object.keys(props).forEach(name => {
  components[name] = defineComponent({
    name,
    props: props[name],
    inject: [contextSymbol],
    setup (props) {
      return useComponent(props, name, defaultTypeMap[name])
    },
    render() {
      return null
    }
  })
})

export default components

