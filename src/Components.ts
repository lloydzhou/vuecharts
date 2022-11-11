import { keys } from 'ts-transformer-keys';
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
  GraphicComponentLooseOption,
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
import { throttle } from "echarts/core";
import { contextSymbol } from './Chart'

import { ValueAxisBaseOption, LogAxisBaseOption, CategoryAxisBaseOption, TimeAxisBaseOption, AxisBaseOptionCommon } from 'echarts/types/src/coord/axisCommonTypes'

import type { Spread } from './spread'

type AxisBaseOption = Spread<[ValueAxisBaseOption, LogAxisBaseOption, CategoryAxisBaseOption, TimeAxisBaseOption, AxisBaseOptionCommon]>

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


type EFC<T> = {[K in keyof T] : T[K]}


export function Components<T>(name: string, props: string[], type: string = '', key: string = '') {
  type = type || defaultType(name)
  key = key || getKeyByName(name)
  return defineComponent<T & ContainerProps>({
    name,
    // @ts-ignore
    props: props as any,  // 使用ts-transformer-keys自动生成字段
    inject: [contextSymbol],
    // @ts-ignore
    setup(props, { slots }) {
      // @ts-ignore
      const { id: pid, type: ptype, children, action, ...other } = props;
      // @ts-ignore
      const { removeOption, setOption } = inject(contextSymbol)
      // 这里使用一个初始化的id
      const id = ref<string>((pid || uniqueId()) as string)
      // Graphic
      const state = shallowReactive({
        options: markRaw([]),
        setOption: (key: string, option: any) => {
          state.removeOption(key, option.id)
          // @ts-ignore
          state.options.push({ ...option, z: option.z || other.z })
        },
        removeOption: (key: string, id: string) => {
          state.options = state.options.filter((i: any) => i.id !== id.value)
        }
      })
      provide(contextSymbol, state)
      // 如果id有变化的时候，先移除旧的，再生成新的
      watch(() => props.id, (newId) => {
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
      // 监听props变化，更新配置信息
      watch(() => props, update, { deep: true })
      // 挂载组件的时候，初始化配置信息
      onMounted(update)
      onUnmounted(() => removeOption(key, id))

      return () => key === "graphic" && type === "group" ? slots.default && slots.default() : null
    }
  }) 
}

export const Title = Components<TitleOption>("Title", keys<TitleOption>());
export const Legend = Components<LegendOption & ScrollableLegendOption>("Legend", keys<Spread<[LegendOption, ScrollableLegendOption]>>());
export const Grid = Components<GridOption>("Grid", keys<GridOption>());
export const XAxis = Components<XAXisOption>("XAxis", keys<Spread<[XAXisOption, AxisBaseOption]>>());
export const YAxis = Components<YAXisOption>("YAxis", keys<Spread<[YAXisOption, AxisBaseOption]>>());
export const Polar = Components<PolarOption>("Polar", keys<PolarOption>());
export const RadiusAxis = Components<RadiusAxisOption>("RadiusAxis", keys<RadiusAxisOption>());
export const AngleAxis = Components<AngleAxisOption>("AngleAxis", keys<AngleAxisOption>());
// Radar和series.radar重合
export const RadarAxis = Components<RadarOption>("RadarAxis", keys<Spread<[RadarOption, AxisBaseOption]>>());
// DataZoom
export const DataZoom = Components<InsideDataZoomOption & SliderDataZoomOption>("DataZoom", keys<Spread<[InsideDataZoomOption, SliderDataZoomOption]>>());
export const Inside = Components<InsideDataZoomOption>("Inside", keys<InsideDataZoomOption>());
export const Slider = Components<SliderDataZoomOption>("Slider", keys<SliderDataZoomOption>());
// visualMap
export const VisualMap = Components<ContinousVisualMapOption & PiecewiseVisualMapOption>("VisualMap", keys<Spread<[ContinousVisualMapOption, PiecewiseVisualMapOption]>>());
export const Continuous = Components<ContinousVisualMapOption>("Continuous", keys<ContinousVisualMapOption>());
export const Piecewise = Components<PiecewiseVisualMapOption>("Piecewise", keys<PiecewiseVisualMapOption>());

export const Tooltip = Components<TooltipOption>("Tooltip", keys<TooltipOption>());
export const AxisPointer = Components<AxisPointerOption>("AxisPointer", keys<AxisPointerOption>());
export const Toolbox = Components<ToolboxComponentOption>("Toolbox", keys<ToolboxComponentOption>());
export const Brush = Components<BrushOption>("Brush", keys<BrushOption>());
export const Geo = Components<GeoOption>("Geo", keys<GeoOption>());
// Parallel: [], // 这个和series.parallel重合了  ParallelCoordinates
export const ParallelCoordinates = Components<ParallelCoordinateSystemOption>("ParallelCoordinates", keys<ParallelCoordinateSystemOption>());
// can not import ParallelAxisOption
export const ParallelAxis = Components<ParallelSeriesOption["parallelAxisDefault"]>("ParallelAxis", keys<Spread<[ParallelSeriesOption["parallelAxisDefault"], AxisBaseOption]>>());
export const SingleAxis = Components<SingleAxisOption>("SingleAxis", keys<Spread<[SingleAxisOption, AxisBaseOption]>>());
export const Timeline = Components<TimelineOption>("Timeline", keys<TimelineOption>());

// TODO Graphic: 这里可以尝试把Graphic里面的暴露出来
const GraphicComponent = (name: string) => Components<GraphicComponentLooseOption>(name, keys<AxisBaseOption>().concat(['right', 'children', 'bottom', 'bounding', 'rotation', 'shape', 'style']), lower(name), "graphic");

export const Graphic = GraphicComponent("Graphic");
export const Group = GraphicComponent("Group");
export const Image = GraphicComponent("Image");
export const Text = GraphicComponent("Text");
export const Rect = GraphicComponent("Rect");
export const Circle = GraphicComponent("Circle");
export const Ring = GraphicComponent("Ring");
export const Sector = GraphicComponent("Sector");
export const Arc = GraphicComponent("Arc");
export const Polygon = GraphicComponent("Polygon");
export const Polyline = GraphicComponent("Polyline");
// graphic.elements-line 不能和series.line重名
export const GraphicLine = GraphicComponent("line");
export const BezierCurve = GraphicComponent("bezierCurve");

export const Calendar = Components<CalendarOption>("Calendar", keys<CalendarOption>());
export const Dataset = Components<DatasetOption>("Dataset", keys<DatasetOption>());
export const Aria = Components<AriaOption>("Aria", keys<AriaOption>());

// series
export const Line = Components<LineSeriesOption>("Line", keys<LineSeriesOption>());
export const Bar = Components<BarSeriesOption>("Bar", keys<BarSeriesOption>());
export const Pie = Components<PieSeriesOption>("Pie", keys<PieSeriesOption>());
export const Scatter = Components<ScatterSeriesOption>("Scatter", keys<ScatterSeriesOption>());
export const EffectScatter = Components<EffectScatterSeriesOption>("EffectScatter", keys<EffectScatterSeriesOption>());
export const Radar = Components<RadarSeriesOption>("Radar", keys<RadarSeriesOption>());
export const Tree = Components<TreeSeriesOption>("Tree", keys<TreeSeriesOption>());
export const Treemap = Components<TreemapSeriesOption>("Treemap", keys<TreemapSeriesOption>());
export const Sunburst = Components<SunburstSeriesOption>("Sunburst", keys<SunburstSeriesOption>());
export const Boxplot = Components<BoxplotSeriesOption>("Boxplot", keys<BoxplotSeriesOption>());
export const Candlestick = Components<CandlestickSeriesOption>("Candlestick", keys<CandlestickSeriesOption>());
export const Heatmap = Components<HeatmapSeriesOption>("Heatmap", keys<HeatmapSeriesOption>());
export const Map = Components<MapSeriesOption>("Map", keys<MapSeriesOption>());
export const Parallel = Components<ParallelSeriesOption>("Partial", keys<ParallelSeriesOption>());
export const Lines = Components<LinesSeriesOption>("Lines", keys<LinesSeriesOption>());
export const Graph = Components<GraphSeriesOption>("Graph", keys<GraphSeriesOption>());
export const Sankey = Components<SankeySeriesOption>("Sankey", keys<SankeySeriesOption>());
export const Funnel = Components<FunnelSeriesOption>("Funnel", keys<FunnelSeriesOption>());
export const Gauge = Components<GaugeSeriesOption>("Gauge", keys<GaugeSeriesOption>());
export const PictorialBar = Components<PictorialBarSeriesOption>("PictorialBar", keys<PictorialBarSeriesOption>());
export const ThemeRiver = Components<ThemeRiverSeriesOption>("ThemeRiver", keys<ThemeRiverSeriesOption>());
export const Custom = Components<CustomSeriesOption>("Custom", keys<CustomSeriesOption>());

export * from './Chart'

