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

const series = [
  'Line', 'Bar', 'Pie', 'Scatter', 'EffectScatter', 'Radar', 'Tree', 'Treemap',
  'Sunburst', 'Boxplot', 'Candlestick', 'Heatmap', 'Map', 'Parallel', 'Lines',
  'Graph', 'Sankey', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Custom',
]
const visualMap = ['VisualMap', 'Continuous', 'Piecewise']
const dataZoom = ['DataZoom', 'Inside', 'Slider']

export const useComponent = (props, name, type) => {
  const key = series.indexOf(name) > -1
    ? 'series'
    : visualMap.indexOf(name) > -1
      ? 'visualMap'
      : dataZoom.indexOf() > -1
        ? 'dataZoom'
        : name.charAt(0).toLowerCase() + name.slice(1)
  const { chart, setOption } = inject(contextSymbol)
  const id = props.id || uniqueId()
  onMounted(() => {
    const options = markRaw({
      ...props,
      type: props.type || type || undefined,
      id,
    })
    // console.log('chart', chart, key, options)
    setOption(key, options)
  })
  onUnmounted(() => {
    const o = chart.getOption()[key] || []
    const option = o.filter(i => i && i.id !== id)
    setOption(key, option)
  })
}

const xAxisProps = [
  'id', 'show', 'gridIndex', 'alignTicks', 'position', 'offset', 'type', 'name', 'nameLocation', 'nameTextStyle', 'nameGap', 'nameRotate', 'inverse', 'boundaryGap', 'min', 'max', 'scale', 'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'splitLine', 'minorSplitLine', 'splitArea', 'data', 'axisPointer', 'zlevel', 'z'
]

const continuousProps = [
  'type', 'id', 'min', 'max', 'range', 'calculable', 'realtime', 'inverse', 'precision', 'itemWidth', 'itemHeight', 'align', 'text', 'textGap', 'show', 'dimension', 'seriesIndex', 'hoverLink', 'inRange', 'outOfRange', 'controller', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'orient', 'padding', 'backgroundColor', 'borderColor', 'borderWidth', 'color', 'textStyle', 'formatter', 'handleIcon', 'handleSize', 'handleStyle', 'indicatorIcon', 'indicatorSize', 'indicatorStyle'
]

const insideProps = [
  'type', 'id', 'disabled', 'xAxisIndex', 'yAxisIndex', 'radiusAxisIndex', 'angleAxisIndex', 'filterMode', 'start', 'end', 'startValue', 'endValue', 'minSpan', 'maxSpan', 'minValueSpan', 'maxValueSpan', 'orient', 'zoomLock', 'throttle', 'rangeMode', 'zoomOnMouseWheel', 'moveOnMouseMove', 'moveOnMouseWheel', 'preventDefaultMouseMove'
]

const componentsMap = {
  Title: [
    'id', 'show', 'text', 'link', 'target', 'textStyle', 'subtext', 'sublink', 'subtarget', 'subtextStyle', 'textAlign', 'textVerticalAlign', 'triggerEvent', 'padding', 'itemGap', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY'
  ],
  Legend: [
    'type', 'id', 'show', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'orient', 'align', 'padding', 'itemGap', 'itemWidth', 'itemHeight', 'itemStyle', 'lineStyle', 'symbolRotate', 'formatter', 'selectedMode', 'inactiveColor', 'inactiveBorderColor', 'inactiveBorderWidth', 'selected', 'textStyle', 'tooltip', 'icon', 'data', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'scrollDataIndex', 'pageButtonItemGap', 'pageButtonGap', 'pageButtonPosition', 'pageFormatter', 'pageIcons', 'pageIconColor', 'pageIconInactiveColor', 'pageIconSize', 'pageTextStyle', 'animation', 'animationDurationUpdate', 'emphasis', 'selector', 'selectorLabel', 'selectorPosition', 'selectorItemGap', 'selectorButtonGap'
  ],
  Grid: [
    'id', 'show', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'containLabel', 'backgroundColor', 'borderColor', 'borderWidth', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'tooltip'
  ],
  XAxis: xAxisProps,
  YAxis: xAxisProps,
  Polar: ['id', 'zlevel', 'z', 'center', 'radius', 'tooltip'],
  RadiusAxis: [
    'id', 'polarIndex', 'type', 'name', 'nameLocation', 'nameTextStyle', 'nameGap', 'nameRotate', 'inverse', 'boundaryGap', 'min', 'max', 'scale', 'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'splitLine', 'minorSplitLine', 'splitArea', 'data', 'axisPointer', 'zlevel', 'z'
  ],
  AngleAxis: [
    'id', 'polarIndex', 'startAngle', 'clockwise', 'type', 'boundaryGap', 'min', 'max', 'scale', 'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'splitLine', 'minorSplitLine', 'splitArea', 'data', 'axisPointer', 'zlevel', 'z'
  ],
  Radar: [
    'id', 'zlevel', 'z', 'center', 'radius', 'startAngle', 'axisName', 'nameGap', 'splitNumber', 'shape', 'scale', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'axisLabel', 'splitLine', 'splitArea', 'indicator'
  ],
  DataZoom: insideProps,
  Inside: insideProps,
  Slider: [
    'type', 'id', 'show', 'backgroundColor', 'dataBackground', 'selectedDataBackground', 'fillerColor', 'borderColor', 'handleIcon', 'handleSize', 'handleStyle', 'moveHandleIcon', 'moveHandleSize', 'moveHandleStyle', 'labelPrecision', 'labelFormatter', 'showDetail', 'showDataShadow', 'realtime', 'textStyle', 'xAxisIndex', 'yAxisIndex', 'radiusAxisIndex', 'angleAxisIndex', 'filterMode', 'start', 'end', 'startValue', 'endValue', 'minSpan', 'maxSpan', 'minValueSpan', 'maxValueSpan', 'orient', 'zoomLock', 'throttle', 'rangeMode', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'brushSelect', 'brushStyle', 'emphasis'
  ],

  // visualMap
  VisualMap: continuousProps,
  Continuous: continuousProps,
  Piecewise: [
    'type', 'id', 'splitNumber', 'pieces', 'categories', 'min', 'max', 'minOpen', 'maxOpen', 'selectedMode', 'inverse', 'precision', 'itemWidth', 'itemHeight', 'align', 'text', 'textGap', 'showLabel', 'itemGap', 'itemSymbol', 'show', 'dimension', 'seriesIndex', 'hoverLink', 'inRange', 'outOfRange', 'controller', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'orient', 'padding', 'backgroundColor', 'borderColor', 'borderWidth', 'color', 'textStyle', 'formatter'
  ],

  Tooltip: [
    'show', 'trigger', 'axisPointer', 'showContent', 'alwaysShowContent', 'triggerOn', 'showDelay', 'hideDelay', 'enterable', 'renderMode', 'confine', 'appendToBody', 'className', 'transitionDuration', 'position', 'formatter', 'valueFormatter', 'backgroundColor', 'borderColor', 'borderWidth', 'padding', 'textStyle', 'extraCssText', 'order'
  ],
  AxisPointer: [
    'id', 'show', 'type', 'snap', 'z', 'label', 'lineStyle', 'shadowStyle', 'triggerTooltip', 'value', 'status', 'handle', 'link', 'triggerOn'
  ],
  Toolbox: [
    'id', 'show', 'orient', 'itemSize', 'itemGap', 'showTitle', 'feature', 'iconStyle', 'emphasis', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'tooltip'
  ],
  Brush: [
    'id', 'toolbox', 'brushLink', 'seriesIndex', 'geoIndex', 'xAxisIndex', 'yAxisIndex', 'brushType', 'brushMode', 'transformable', 'brushStyle', 'throttleType', 'throttleDelay', 'removeOnClick', 'inBrush', 'outOfBrush', 'z'
  ],
  Geo: [
    'id', 'show', 'map', 'roam', 'projection', 'center', 'aspectScale', 'boundingCoords', 'zoom', 'scaleLimit', 'nameMap', 'nameProperty', 'selectedMode', 'label', 'itemStyle', 'emphasis', 'select', 'blur', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'layoutCenter', 'layoutSize', 'regions', 'silent', 'tooltip'
  ],
  // Parallel: [], // 这个和series.parallel重合了
  ParallelAxis: [
    'id', 'dim', 'parallelIndex', 'realtime', 'areaSelectStyle', 'type', 'name', 'nameLocation', 'nameTextStyle', 'nameGap', 'nameRotate', 'inverse', 'boundaryGap', 'min', 'max', 'scale', 'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'data'
  ],
  SingleAxis: [
    'id', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'orient', 'type', 'name', 'nameLocation', 'nameTextStyle', 'nameGap', 'nameRotate', 'inverse', 'boundaryGap', 'min', 'max', 'scale', 'splitNumber', 'minInterval', 'maxInterval', 'interval', 'logBase', 'silent', 'triggerEvent', 'axisLine', 'axisTick', 'minorTick', 'axisLabel', 'splitLine', 'minorSplitLine', 'splitArea', 'data', 'axisPointer', 'tooltip'
  ],
  Timeline: [
    'show', 'type', 'axisType', 'currentIndex', 'autoPlay', 'rewind', 'loop', 'playInterval', 'realtime', 'replaceMerge', 'controlPosition', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'padding', 'orient', 'inverse', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'lineStyle', 'label', 'itemStyle', 'checkpointStyle', 'controlStyle', 'progress', 'emphasis', 'data'
  ],
  // TODO Graphic: [],
  Calendar: [
    'id', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'range', 'cellSize', 'orient', 'splitLine', 'itemStyle', 'dayLabel', 'monthLabel', 'yearLabel', 'silent'
  ],
  Dataset: [
    'id', 'source', 'dimensions', 'sourceHeader', 'transform', 'fromDatasetIndex', 'fromDatasetId', 'fromTransformResult'
  ],
  Aria: ['enabled', 'label', 'decal'],

  // series
  Line: [
    'type', 'id', 'name', 'colorBy', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'showSymbol', 'showAllSymbol', 'legendHoverLink', 'stack', 'stackStrategy', 'cursor', 'connectNulls', 'clip', 'triggerLineEvent', 'step', 'label', 'endLabel', 'labelLine', 'labelLayout', 'itemStyle', 'lineStyle', 'areaStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'smooth', 'smoothMonotone', 'sampling', 'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Bar: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'roundCap', 'realtimeSort', 'showBackground', 'backgroundStyle', 'label', 'labelLine', 'itemStyle', 'labelLayout', 'emphasis', 'blur', 'select', 'selectedMode', 'stack', 'stackStrategy', 'sampling', 'cursor', 'barWidth', 'barMaxWidth', 'barMinWidth', 'barMinHeight', 'barMinAngle', 'barGap', 'barCategoryGap', 'large', 'largeThreshold', 'progressive', 'progressiveThreshold', 'progressiveChunkMode', 'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'clip', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Pie: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'selectedMode', 'selectedOffset', 'clockwise', 'startAngle', 'minAngle', 'minShowLabelAngle', 'roseType', 'avoidLabelOverlap', 'stillShowZeroSum', 'cursor', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'showEmptyCircle', 'emptyCircleStyle', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'center', 'radius', 'seriesLayoutBy', 'datasetIndex', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'silent', 'animationType', 'animationTypeUpdate', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Scatter: [
    'type', 'id', 'name', 'colorBy', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'geoIndex', 'calendarIndex', 'legendHoverLink', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'large', 'largeThreshold', 'cursor', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'progressive', 'progressiveThreshold', 'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'clip', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  EffectScatter: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'effectType', 'showEffectOn', 'rippleEffect', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'geoIndex', 'calendarIndex', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'cursor', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'seriesLayoutBy', 'datasetIndex', 'dimensions', 'encode', 'data', 'markPoint', 'markLine', 'markArea', 'clip', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'tooltip'
  ],
  Radar: [
    'type', 'id', 'name', 'colorBy', 'radarIndex', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'label', 'labelLayout', 'itemStyle', 'lineStyle', 'areaStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'dataGroupId', 'data', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Tree: [
    'type', 'id', 'name', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'center', 'zoom', 'layout', 'orient', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'edgeShape', 'edgeForkPosition', 'roam', 'expandAndCollapse', 'initialTreeDepth', 'itemStyle', 'label', 'labelLayout', 'lineStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'leaves', 'data', 'tooltip'
  ],
  Treemap: [
    'type', 'id', 'name', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'squareRatio', 'leafDepth', 'drillDownIcon', 'roam', 'nodeClick', 'zoomToNodeRatio', 'visualDimension', 'visualMin', 'visualMax', 'colorAlpha', 'colorSaturation', 'colorMappingBy', 'visibleMin', 'childrenVisibleMin', 'label', 'upperLabel', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'breadcrumb', 'labelLine', 'labelLayout', 'levels', 'data', 'silent', 'animationDuration', 'animationEasing', 'animationDelay', 'tooltip'
  ],
  Sunburst: [
    'type', 'id', 'name', 'zlevel', 'z', 'center', 'radius', 'data', 'labelLayout', 'label', 'labelLine', 'itemStyle', 'nodeClick', 'sort', 'renderLabelForZeroData', 'emphasis', 'blur', 'select', 'selectedMode', 'levels', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate'
  ],
  Boxplot: [
    'type', 'id', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'name', 'colorBy', 'legendHoverLink', 'hoverAnimation', 'layout', 'boxWidth', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'animationDuration', 'animationEasing', 'animationDelay', 'universalTransition', 'tooltip'
  ],
  Candlestick: [
    'type', 'id', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'name', 'colorBy', 'legendHoverLink', 'hoverAnimation', 'layout', 'barWidth', 'barMinWidth', 'barMaxWidth', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'large', 'largeThreshold', 'progressive', 'progressiveThreshold', 'progressiveChunkMode', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'clip', 'zlevel', 'z', 'silent', 'animationDuration', 'animationEasing', 'animationDelay', 'universalTransition', 'tooltip'
  ],
  Heatmap: [
    'type', 'id', 'name', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'geoIndex', 'calendarIndex', 'pointSize', 'blurSize', 'minOpacity', 'maxOpacity', 'progressive', 'progressiveThreshold', 'label', 'labelLayout', 'itemStyle', 'emphasis', 'universalTransition', 'blur', 'select', 'selectedMode', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'tooltip'
  ],
  Map: [
    'type', 'id', 'name', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'geoIndex', 'calendarIndex', 'pointSize', 'blurSize', 'minOpacity', 'maxOpacity', 'progressive', 'progressiveThreshold', 'label', 'labelLayout', 'itemStyle', 'emphasis', 'universalTransition', 'blur', 'select', 'selectedMode', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'tooltip'
  ],
  Parallel: [
    'type', 'id', 'name', 'colorBy', 'map', 'roam', 'projection', 'center', 'aspectScale', 'boundingCoords', 'zoom', 'scaleLimit', 'nameMap', 'nameProperty', 'selectedMode', 'label', 'itemStyle', 'emphasis', 'select', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'layoutCenter', 'layoutSize', 'geoIndex', 'mapValueCalculation', 'showLegendSymbol', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'labelLayout', 'labelLine', 'data', 'markPoint', 'markLine', 'markArea', 'silent', 'universalTransition', 'tooltip'
  ],
  Lines: [
    'type', 'id', 'coordinateSystem', 'parallelIndex', 'name', 'colorBy', 'lineStyle', 'emphasis', 'inactiveOpacity', 'activeOpacity', 'realtime', 'smooth', 'progressive', 'progressiveThreshold', 'progressiveChunkMode', 'data', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate'
  ],
  Graph: [
    'type', 'id', 'name', 'legendHoverLink', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'geoIndex', 'calendarIndex', 'center', 'zoom', 'layout', 'circular', 'force', 'roam', 'scaleLimit', 'nodeScaleRatio', 'draggable', 'symbol', 'symbolSize', 'symbolRotate', 'symbolKeepAspect', 'symbolOffset', 'edgeSymbol', 'edgeSymbolSize', 'cursor', 'itemStyle', 'lineStyle', 'label', 'edgeLabel', 'labelLayout', 'emphasis', 'blur', 'select', 'selectedMode', 'categories', 'autoCurveness', 'data', 'nodes', 'links', 'edges', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'tooltip'
  ],
  Sankey: [
    'type', 'id', 'name', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'nodeWidth', 'nodeGap', 'nodeAlign', 'layoutIterations', 'orient', 'draggable', 'levels', 'label', 'labelLayout', 'itemStyle', 'lineStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'data', 'nodes', 'links', 'edges', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'tooltip'
  ],
  Funnel: [
    'type', 'id', 'name', 'colorBy', 'min', 'max', 'minSize', 'maxSize', 'orient', 'sort', 'gap', 'legendHoverLink', 'funnelAlign', 'label', 'labelLine', 'itemStyle', 'labelLayout', 'emphasis', 'blur', 'select', 'selectedMode', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'seriesLayoutBy', 'datasetIndex', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
  Gauge: [
    'type', 'id', 'name', 'colorBy', 'zlevel', 'z', 'center', 'radius', 'legendHoverLink', 'startAngle', 'endAngle', 'clockwise', 'data', 'min', 'max', 'splitNumber', 'axisLine', 'progress', 'splitLine', 'axisTick', 'axisLabel', 'pointer', 'anchor', 'itemStyle', 'emphasis', 'title', 'detail', 'markPoint', 'markLine', 'markArea', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'tooltip'
  ],
  PictorialBar: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'cursor', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'barWidth', 'barMaxWidth', 'barMinWidth', 'barMinHeight', 'barMinAngle', 'barGap', 'barCategoryGap', 'symbol', 'symbolSize', 'symbolPosition', 'symbolOffset', 'symbolRotate', 'symbolRepeat', 'symbolRepeatDirection', 'symbolMargin', 'symbolClip', 'symbolBoundingData', 'symbolPatternSize', 'hoverAnimation', 'dimensions', 'encode', 'dataGroupId', 'data', 'markPoint', 'markLine', 'markArea', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDurationUpdate', 'animationEasingUpdate', 'universalTransition', 'tooltip'
  ],
  ThemeRiver: [
    'type', 'id', 'name', 'colorBy', 'zlevel', 'z', 'left', 'top', 'right', 'bottom', 'width', 'height', 'coordinateSystem', 'boundaryGap', 'singleAxisIndex', 'label', 'labelLine', 'labelLayout', 'itemStyle', 'emphasis', 'blur', 'select', 'selectedMode', 'data', 'tooltip'
  ],
  Custom: [
    'type', 'id', 'name', 'colorBy', 'legendHoverLink', 'coordinateSystem', 'xAxisIndex', 'yAxisIndex', 'polarIndex', 'geoIndex', 'calendarIndex', 'renderItem', 'itemStyle', 'labelLine', 'labelLayout', 'selectedMode', 'dimensions', 'encode', 'seriesLayoutBy', 'datasetIndex', 'dataGroupId', 'data', 'clip', 'zlevel', 'z', 'silent', 'animation', 'animationThreshold', 'animationDuration', 'animationEasing', 'animationDelay', 'animationDurationUpdate', 'animationEasingUpdate', 'animationDelayUpdate', 'universalTransition', 'tooltip'
  ],
}

const defaultTypeMap = {
  Legend: 'plain',
  XAxis: 'category',
  YAxis: 'value',
  RadiusAxis: 'value',
  AngleAxis: 'category',
  DataZoom: 'inside',
  VisualMap: 'continuous',
  AxisPointer: 'line',
  ParallelAxis: 'value',
  SingleAxis: 'value',
  Timeline: 'slider',
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
      setOption: (key, option) => {
        Object.keys(option).forEach(name => {
          if (option[name] === undefined || option[name] === null) {
            delete option[name]
          }
        })
        // 如果传过来的本身是数组，那就直接覆盖
        if (option.push) {
          state.options = option
        } else {
          if (!state.options[key]) {
            state.options[key] = []
          }
          state.options[key].push(option)
        }
        // 子组件里面的props第一次初始化的时候，不调用setOption，而是等子组件都加载好了再一次性的初始化
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
        if (state.chart) {
          state.chart.setOption(option, {lazyUpdate: props.lazyUpdate, notMerge: true})
        }
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
Object.keys(componentsMap).forEach(name => {
  // type为空，使用name首字母小写
  const type = defaultTypeMap[name] || (name.charAt(0).toLowerCase() + name.slice(1))
  components[name] = defineComponent({
    name,
    props: componentsMap[name],
    inject: [contextSymbol],
    setup (props) {
      useComponent(props, name, type)
      return () => null
    }
  })
})

export default components

