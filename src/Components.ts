import {
  //
  TitleOption,
  LegendOption,
  ScrollableLegendOption,
  GridOption,
  XAXisOption,
  YAXisOption,
  PolarOption,
  RadiusAxisOption,
  AngleAxisOption,
  RadarOption,
  // DataZoom
  InsideDataZoomOption,
  SliderDataZoomOption,
  // visualmap
  ContinousVisualMapOption,
  PiecewiseVisualMapOption,
  TooltipOption,
  AxisPointerOption,
  ToolboxComponentOption,
  BrushOption,
  GeoOption,
  ParallelCoordinateSystemOption,
  // ParallelAxisOption, // can not import
  SingleAxisOption,
  TimelineOption,
  // Graphic 这里只能导出一种类型
  // GraphicComponentLooseOption,
  CalendarOption,
  DatasetOption,
  AriaOption,
  // series
  LineSeriesOption,
  BarSeriesOption,
  ScatterSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  MapSeriesOption,
  TreeSeriesOption,
  TreemapSeriesOption,
  GraphSeriesOption,
  GaugeSeriesOption,
  FunnelSeriesOption,
  ParallelSeriesOption,
  SankeySeriesOption,
  BoxplotSeriesOption,
  CandlestickSeriesOption,
  EffectScatterSeriesOption,
  LinesSeriesOption,
  HeatmapSeriesOption,
  PictorialBarSeriesOption,
  ThemeRiverSeriesOption,
  SunburstSeriesOption,
  CustomSeriesOption,
} from 'echarts/types/dist/shared'
import {
  GraphicComponentElementOption,
  GraphicComponentGroupOption,
  GraphicComponentZRPathOption,
  GraphicComponentImageOption,
  GraphicComponentTextOption,
  GraphicComponentDisplayableOption
} from 'echarts/types/src/component/graphic/GraphicModel'
import { ParallelAxisOption } from 'echarts/types/src/coord/parallel/AxisModel'
import {
  DefineComponent,
  defineComponent,
  ref, markRaw,
  shallowReactive,
  watch,
  provide,
  inject,
  onMounted,
  onUnmounted,
  ComponentOptionsWithoutProps,
} from 'vue'
import { throttle } from "echarts/core";
import { contextSymbol, useChartContext } from './Chart'

import { ValueAxisBaseOption, LogAxisBaseOption, CategoryAxisBaseOption, TimeAxisBaseOption, AxisBaseOptionCommon } from 'echarts/types/src/coord/axisCommonTypes'
import { TransitionOptionMixin } from 'echarts/types/src/animation/customGraphicTransition'
import { ElementKeyframeAnimationOption } from 'echarts/types/src/animation/customGraphicKeyframeAnimation';

export const series = [
  'Line', 'Bar', 'Pie', 'Scatter', 'EffectScatter', 'Radar', 'Tree', 'Treemap',
  'Sunburst', 'Boxplot', 'Candlestick', 'Heatmap', 'Map', 'Parallel', 'Lines',
  'Graph', 'Sankey', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Custom',
]
export const visualMap = ['VisualMap', 'Continuous', 'Piecewise']
export const dataZoom = ['DataZoom', 'Inside', 'Slider']
const defaultTypeMap = {
  Legend: "plain",
  XAxis: "category",
  YAxis: "value",
  RadiusAxis: "value",
  AngleAxis: "category",
  DataZoom: "inside",
  VisualMap: "continuous",
  AxisPointer: "line",
  ParallelAxis: "value",
  SingleAxis: "value",
  Timeline: "slider",
};

// export const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
function uniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
const lower = (name: string) => name.charAt(0).toLowerCase() + name.slice(1);

function defaultType(name: string) {
  // @ts-ignore
  return defaultTypeMap[name as keyof defaultTypeMap] || lower(name);
}
function getKeyByName(name: string) {
  return series.indexOf(name) > -1
    ? "series"
    : visualMap.indexOf(name) > -1
    ? "visualMap"
    : dataZoom.indexOf(name) > -1
    ? "dataZoom"
    : lower(name);
}

export interface ContainerProps {
  id?: string;
  type?: string;
  action?: "merge" | "replace" | "remove";
}


export type EC<T> = DefineComponent<T & ContainerProps, {[key: string]: any}>;

// https://github.com/vuejs/vue/blob/main/types/v3-define-component.d.ts#L71
// ComponentOptionsWithoutProps
// 使用attrs替代props（可以不用再依赖ts-transformer-keys转换配置项key列表)
export function Components<T>(name: string, type: string = '', key: string = ''): EC<T> {
  type = type || defaultType(name)
  key = key || getKeyByName(name)
  return defineComponent({
    name,
    // 移除：使用ts-transformer-keys自动生成字段
    // props: props as any,
    inject: [contextSymbol],
    // @ts-ignore
    setup(props, { slots, attrs }) {
      // @ts-ignore
      const { id: pid, type: ptype, action, ...other } = attrs;
      // @ts-ignore
      const { removeOption, setOption } = useChartContext()
      // 这里使用一个初始化的id
      const id = ref((pid || uniqueId()) as string)
      // Graphic
      const state = shallowReactive({
        options: markRaw([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOption: (key: string, option: {[key: string]: any}) => {
          state.removeOption(key, option.id)
          // @ts-ignore
          state.options.push({ ...option, z: option.z || other.z })
        },
        removeOption: (key: string, id: string) => {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state.options = state.options.filter((i: any) => i.id !== id.value)
        }
      })
      provide(contextSymbol, state)
      // 如果id有变化的时候，先移除旧的，再生成新的
      watch(() => attrs.id, (newId) => {
        removeOption(key, id)
        id.value = newId as string
        update()
      })
      const update = throttle(() => {
        const options = markRaw({
          ...other,
          type: ptype || type || undefined,
          id: id.value,
        })
        if (key === "graphic") {
          if (type == "group") {
            // @ts-ignore
            options["children"] = state.options
          }
          // @ts-ignore
          options["@action"] = action || "merge"
        }
        setOption(key, options)
      }, 40, true)
      // 监听attrs变化，更新配置信息
      watch(() => attrs, update, { deep: true })
      // 挂载组件的时候，初始化配置信息
      onMounted(update)
      onUnmounted(() => removeOption(key, id))

      return () => key === "graphic" && type === "group" ? slots.default && slots.default() : null
    }
  }) as EC<T>
}

export const Title: EC<TitleOption> = Components<TitleOption>("Title");
export const Legend: EC<LegendOption | ScrollableLegendOption> = Components<LegendOption | ScrollableLegendOption>("Legend");
export const Grid: EC<GridOption> = Components<GridOption>("Grid");
export const XAxis: EC<XAXisOption> = Components<XAXisOption>("XAxis");
export const YAxis: EC<YAXisOption> = Components<YAXisOption>("YAxis");
export const Polar: EC<PolarOption> = Components<PolarOption>("Polar");
export const RadiusAxis: EC<RadiusAxisOption> = Components<RadiusAxisOption>("RadiusAxis");
export const AngleAxis: EC<AngleAxisOption> = Components<AngleAxisOption>("AngleAxis");
// Radar和series.radar重合
export const RadarAxis: EC<RadarOption> = Components<RadarOption>("RadarAxis");
// // DataZoom
export const DataZoom: EC<InsideDataZoomOption | SliderDataZoomOption> = Components<InsideDataZoomOption | SliderDataZoomOption>("DataZoom");
export const Inside: EC<InsideDataZoomOption> = Components<InsideDataZoomOption>("Inside");
export const Slider: EC<SliderDataZoomOption> = Components<SliderDataZoomOption>("Slider");
// visualMap
export const VisualMap: EC<ContinousVisualMapOption | PiecewiseVisualMapOption> = Components<ContinousVisualMapOption | PiecewiseVisualMapOption>("VisualMap");
export const Continuous: EC<ContinousVisualMapOption> = Components<ContinousVisualMapOption>("Continuous");
export const Piecewise: EC<PiecewiseVisualMapOption> = Components<PiecewiseVisualMapOption>("Piecewise");

export const Tooltip: EC<TooltipOption> = Components<TooltipOption>("Tooltip");
export const AxisPointer: EC<AxisPointerOption> = Components<AxisPointerOption>("AxisPointer");
export const Toolbox: EC<ToolboxComponentOption> = Components<ToolboxComponentOption>("Toolbox");
export const Brush: EC<BrushOption> = Components<BrushOption>("Brush");
export const Geo: EC<GeoOption> = Components<GeoOption>("Geo");
// Parallel: [], // 这个和series.parallel重合了  ParallelCoordinates
export const ParallelCoordinates: EC<ParallelCoordinateSystemOption> = Components<ParallelCoordinateSystemOption>("ParallelCoordinates");
export const ParallelAxis: EC<ParallelAxisOption> = Components<ParallelAxisOption>("ParallelAxis");
export const SingleAxis: EC<SingleAxisOption> = Components<SingleAxisOption>("SingleAxis");
export const Timeline: EC<TimelineOption> = Components<TimelineOption>("Timeline");

// TODO Graphic: 这里可以尝试把Graphic里面的暴露出来
export const Graphic: EC<GraphicComponentElementOption> = Components<GraphicComponentElementOption>("Graphic", "graphic", "graphic");
export const Group: EC<GraphicComponentGroupOption & {z?: number}> = Components<GraphicComponentGroupOption & {z?: number}>("Group", "group", "graphic");
export const Image: EC<GraphicComponentImageOption> = Components<GraphicComponentImageOption>("Image", "image", "graphic");
export const Text: EC<GraphicComponentTextOption> = Components<GraphicComponentTextOption>("Text", "text", "graphic");
export const Rect: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Rect", "rect", "graphic");
export const Circle: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Circle", "circle", "graphic");
export const Ring: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Ring", "ring", "graphic");
export const Sector: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Sector", "sector", "graphic");
export const Arc: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Arc", "arc", "graphic");
export const Polygon: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Polygon", "polygon", "graphic");
export const Polyline: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Polyline", "polyline", "graphic");
// graphic.elements-line 不能和series.line重名
export const GraphicLine: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("GraphicLine", "line", "graphic");
export const BezierCurve: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("BezierCurve", "bezierCurve", "graphic");

export const Calendar: EC<CalendarOption> = Components<CalendarOption>("Calendar");
export const Dataset: EC<DatasetOption> = Components<DatasetOption>("Dataset");
export const Aria: EC<AriaOption> = Components<AriaOption>("Aria");

// series
export const Line: EC<LineSeriesOption> = Components<LineSeriesOption>("Line");
export const Bar: EC<BarSeriesOption> = Components<BarSeriesOption>("Bar");
export const Pie: EC<PieSeriesOption> = Components<PieSeriesOption>("Pie");
export const Scatter: EC<ScatterSeriesOption> = Components<ScatterSeriesOption>("Scatter");
export const EffectScatter: EC<EffectScatterSeriesOption> = Components<EffectScatterSeriesOption>("EffectScatter");
export const Radar: EC<RadarSeriesOption> = Components<RadarSeriesOption>("Radar");
export const Tree: EC<TreeSeriesOption> = Components<TreeSeriesOption>("Tree");
export const Treemap: EC<TreemapSeriesOption> = Components<TreemapSeriesOption>("Treemap");
export const Sunburst: EC<SunburstSeriesOption> = Components<SunburstSeriesOption>("Sunburst");
export const Boxplot: EC<BoxplotSeriesOption> = Components<BoxplotSeriesOption>("Boxplot");
export const Candlestick: EC<CandlestickSeriesOption> = Components<CandlestickSeriesOption>("Candlestick");
export const Heatmap: EC<HeatmapSeriesOption> = Components<HeatmapSeriesOption>("Heatmap");
export const Map: EC<MapSeriesOption> = Components<MapSeriesOption>("Map");
export const Parallel: EC<ParallelSeriesOption> = Components<ParallelSeriesOption>("Partial");
export const Lines: EC<LinesSeriesOption> = Components<LinesSeriesOption>("Lines");
export const Graph: EC<GraphSeriesOption> = Components<GraphSeriesOption>("Graph");
export const Sankey: EC<SankeySeriesOption> = Components<SankeySeriesOption>("Sankey");
export const Funnel: EC<FunnelSeriesOption> = Components<FunnelSeriesOption>("Funnel");
export const Gauge: EC<GaugeSeriesOption> = Components<GaugeSeriesOption>("Gauge");
export const PictorialBar: EC<PictorialBarSeriesOption> = Components<PictorialBarSeriesOption>("PictorialBar");
export const ThemeRiver: EC<ThemeRiverSeriesOption> = Components<ThemeRiverSeriesOption>("ThemeRiver");
export const Custom: EC<CustomSeriesOption> = Components<CustomSeriesOption>("Custom");

export * from './Chart'

