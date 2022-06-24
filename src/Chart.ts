// @ts-nocheck
import {
  defineComponent,
  ref, markRaw, toRefs,
  shallowReactive,
  watch,
  h,
  provide,
  inject,
  onMounted,
  onUnmounted,
  Fragment,
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
  inheritAttrs: false,
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
  setup(props, { emit }) {

    const container = ref(null)
    const timer = ref()
    const state = shallowReactive({
      options: props.option,
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
    const commit = () => {
      if (timer.value) {
        clearTimeout(timer.value)
      }
      timer.value = setTimeout(() => {
        if (state.chart) {
          // 提交画布更新的时候，使用replaceMerge选项
          state.chart.setOption(markRaw(state.options), {
            lazyUpdate: props.lazyUpdate,
            replaceMerge: Array.from(state.replaceMerge),
          })
          // 提交画布更新之后，重置replaceMerge
          state.replaceMerge = new Set()
        }
      }, 50)
    }
    provide(contextSymbol, state)

    watch(() => props.group, group => {
      state.chart.group = group
    })

    watch(() => props.option, option => {
      // 需要将option全部放到state进行管理
      Object.keys(option).forEach(key => state.setOption(option[key]))
    }, { deep: true })

    watch(() => ({width: props.width, height: props.height}), size => {
      state.chart.resize(size)
    })

    const rendered = () => emit('rendered')
    const finished = () => emit('finished')
    const init = () => {
      const chart = state.chart = echarts.init(container.value)
      if (props.group) {
        chart.group = props.group
      }
      chart.resize({ width: props.width, height: props.height })
      chart.on('rendered', rendered)
      chart.on('finished', finished)
      // 使用默认的option初始化画布
      commit()
    }
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
      style: 'display:block;width:100%;height:100%;min-height:1px;' + (attrs.style || ''),
    }), chart && slots.default && slots.default())
  }
})

const components = { Chart }
/**
 * 这里是使用不同的配置生成了功能类似的组件
 * 1. 组件通过id记录自己的配置信息，并且通过id让Chart集中管理整体的配置信息。
 * 2. 监听props数据变化，更新当前组件配置
 * 3. 卸载的时候移除当前组件配置
 */
Object.keys(componentsMap).forEach(name => {
  // type为空，使用name首字母小写
  const type = defaultTypeMap[name] || (name.charAt(0).toLowerCase() + name.slice(1))
  components[name] = defineComponent({
    name,
    props: componentsMap[name],
    inject: [contextSymbol],
    setup (props) {
      const key = series.indexOf(name) > -1
        ? 'series'
        : visualMap.indexOf(name) > -1
          ? 'visualMap'
          : dataZoom.indexOf() > -1
            ? 'dataZoom'
            : name.charAt(0).toLowerCase() + name.slice(1)
      const { removeOption, setOption } = inject(contextSymbol)
      // 这里使用一个初始化的id
      const id = ref(props.id || uniqueId())
      // 如果id有变化的时候，先移除旧的，再生成新的
      watch(() => props.id, (newId) => {
        removeOption(key, id)
        id.value = newId
        update()
      })
      const update = () => {
        const options = markRaw({
          ...props,
          type: props.type || type || undefined,
          id: id.value,
        })
        // console.log('chart', chart, key, options)
        setOption(key, options)
      }
      // 监听props变化，更新配置信息
      watch(() => props, update, { deep: true })
      // 挂载组件的时候，初始化配置信息
      onMounted(update)
      onUnmounted(() => removeOption(key, id))

      return () => null
    }
  })
})

export default components

