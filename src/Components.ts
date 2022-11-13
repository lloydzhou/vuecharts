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
  // GraphicComponentTextOption,
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
} from 'vue'
import { throttle } from "echarts/core";
import { contextSymbol, useChartContext } from './Chart'

import { ValueAxisBaseOption, LogAxisBaseOption, CategoryAxisBaseOption, TimeAxisBaseOption, AxisBaseOptionCommon } from 'echarts/types/src/coord/axisCommonTypes'
import { TransitionOptionMixin } from 'echarts/types/src/animation/customGraphicTransition'
import { ElementKeyframeAnimationOption } from 'echarts/types/src/animation/customGraphicKeyframeAnimation';

import { TextStyleProps, TextProps } from 'zrender/lib/graphic/Text'

// merge type
type AxisBaseOption = ValueAxisBaseOption & LogAxisBaseOption & CategoryAxisBaseOption & TimeAxisBaseOption & AxisBaseOptionCommon
// copy from echarts/types/src/component/graphic/GraphicModel
interface GraphicComponentTextOption extends Omit<GraphicComponentDisplayableOption, 'textContent' | 'textConfig'>, TransitionOptionMixin<TextProps> {
  type?: 'text';
  style?: TextStyleProps & TransitionOptionMixin<TextStyleProps>;
  keyframeAnimation?: ElementKeyframeAnimationOption<TextProps> | ElementKeyframeAnimationOption<TextProps>[];
}

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


type EC<T> = DefineComponent<T & ContainerProps, () => null, {[key: string]: any}, {[key: string]: any}, {[key: string]: any}>;

export function Components<T>(name: string, props: string[], type: string = '', key: string = ''): EC<T> {
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
      const { removeOption, setOption } = useChartContext()
      // 这里使用一个初始化的id
      const id = ref((pid || uniqueId()) as string)
      // Graphic
      const state = shallowReactive({
        options: markRaw([]),
        setOption: (key: string, option: any) => {
          state.removeOption(key, option.id)
          // @ts-ignore
          state.options.push({ ...option, z: option.z || other.z })
        },
        removeOption: (key: string, id: string) => {
          // @ts-ignore
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
  }) as EC<T>
}

export const Title: EC<TitleOption> = Components<TitleOption>("Title", keys<TitleOption>());
export const Legend: EC<LegendOption | ScrollableLegendOption> = Components<LegendOption | ScrollableLegendOption>("Legend", keys<LegendOption & ScrollableLegendOption>());
export const Grid: EC<GridOption> = Components<GridOption>("Grid", keys<GridOption>());
export const XAxis: EC<XAXisOption> = Components<XAXisOption>("XAxis", keys<XAXisOption & AxisBaseOption>());
export const YAxis: EC<YAXisOption> = Components<YAXisOption>("YAxis", keys<YAXisOption & AxisBaseOption>());
export const Polar: EC<PolarOption> = Components<PolarOption>("Polar", keys<PolarOption>());
export const RadiusAxis: EC<RadiusAxisOption> = Components<RadiusAxisOption>("RadiusAxis", keys<RadiusAxisOption & AxisBaseOption>());
export const AngleAxis: EC<AngleAxisOption> = Components<AngleAxisOption>("AngleAxis", keys<AngleAxisOption & AxisBaseOption>());
// Radar和series.radar重合
export const RadarAxis: EC<RadarOption> = Components<RadarOption>("RadarAxis", keys<RadarOption>());
// // DataZoom
export const DataZoom: EC<InsideDataZoomOption | SliderDataZoomOption> = Components<InsideDataZoomOption | SliderDataZoomOption>("DataZoom", keys<InsideDataZoomOption & SliderDataZoomOption>());
export const Inside: EC<InsideDataZoomOption> = Components<InsideDataZoomOption>("Inside", keys<InsideDataZoomOption>());
export const Slider: EC<SliderDataZoomOption> = Components<SliderDataZoomOption>("Slider", keys<SliderDataZoomOption>());
// visualMap
export const VisualMap: EC<ContinousVisualMapOption | PiecewiseVisualMapOption> = Components<ContinousVisualMapOption | PiecewiseVisualMapOption>("VisualMap", keys<ContinousVisualMapOption & PiecewiseVisualMapOption>());
export const Continuous: EC<ContinousVisualMapOption> = Components<ContinousVisualMapOption>("Continuous", keys<ContinousVisualMapOption>());
export const Piecewise: EC<PiecewiseVisualMapOption> = Components<PiecewiseVisualMapOption>("Piecewise", keys<PiecewiseVisualMapOption>());

export const Tooltip: EC<TooltipOption> = Components<TooltipOption>("Tooltip", keys<TooltipOption>());
export const AxisPointer: EC<AxisPointerOption> = Components<AxisPointerOption>("AxisPointer", keys<AxisPointerOption>());
export const Toolbox: EC<ToolboxComponentOption> = Components<ToolboxComponentOption>("Toolbox", keys<ToolboxComponentOption>());
export const Brush: EC<BrushOption> = Components<BrushOption>("Brush", keys<BrushOption>());
export const Geo: EC<GeoOption> = Components<GeoOption>("Geo", keys<GeoOption>());
// Parallel: [], // 这个和series.parallel重合了  ParallelCoordinates
export const ParallelCoordinates: EC<ParallelCoordinateSystemOption> = Components<ParallelCoordinateSystemOption>("ParallelCoordinates", keys<ParallelCoordinateSystemOption>());
export const ParallelAxis: EC<ParallelAxisOption> = Components<ParallelAxisOption>("ParallelAxis", keys<ParallelAxisOption & AxisBaseOption>());
export const SingleAxis: EC<SingleAxisOption> = Components<SingleAxisOption>("SingleAxis", keys<SingleAxisOption & AxisBaseOption>());
export const Timeline: EC<TimelineOption> = Components<TimelineOption>("Timeline", keys<TimelineOption>());

// TODO Graphic: 这里可以尝试把Graphic里面的暴露出来
export const Graphic: EC<GraphicComponentElementOption> = Components<GraphicComponentElementOption>("Graphic", keys<GraphicComponentElementOption>(), "graphic", "graphic");
export const Group: EC<GraphicComponentGroupOption> = Components<GraphicComponentGroupOption>("Group", keys<GraphicComponentGroupOption & {z?: number}>(), "group", "graphic");
export const Image: EC<GraphicComponentImageOption> = Components<GraphicComponentImageOption>("Image", keys<GraphicComponentImageOption>(), "image", "graphic");
export const Text: EC<GraphicComponentTextOption> = Components<GraphicComponentTextOption>("Text", keys<GraphicComponentTextOption>(), "text", "graphic");
export const Rect: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Rect", keys<GraphicComponentZRPathOption>(), "rect", "graphic");
export const Circle: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Circle", keys<GraphicComponentZRPathOption>(), "circle", "graphic");
export const Ring: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Ring", keys<GraphicComponentZRPathOption>(), "ring", "graphic");
export const Sector: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Sector", keys<GraphicComponentZRPathOption>(), "sector", "graphic");
export const Arc: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("arc", keys<GraphicComponentZRPathOption>(), "arc", "graphic");
export const Polygon: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Polygon", keys<GraphicComponentZRPathOption>(), "polygon", "graphic");
export const Polyline: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("Polyline", keys<GraphicComponentZRPathOption>(), "polyline", "graphic");
// graphic.elements-line 不能和series.line重名
export const GraphicLine: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("GraphicLine", keys<GraphicComponentZRPathOption>(), "line", "graphic");
export const BezierCurve: EC<GraphicComponentZRPathOption> = Components<GraphicComponentZRPathOption>("BezierCurve", keys<GraphicComponentZRPathOption>(), "bezierCurve", "graphic");

export const Calendar: EC<CalendarOption> = Components<CalendarOption>("Calendar", keys<CalendarOption>());
export const Dataset: EC<DatasetOption> = Components<DatasetOption>("Dataset", keys<DatasetOption>());
export const Aria: EC<AriaOption> = Components<AriaOption>("Aria", keys<AriaOption>());

// series
export const Line: EC<LineSeriesOption> = Components<LineSeriesOption>("Line", keys<LineSeriesOption>());
export const Bar: EC<BarSeriesOption> = Components<BarSeriesOption>("Bar", keys<BarSeriesOption>());
export const Pie: EC<PieSeriesOption> = Components<PieSeriesOption>("Pie", keys<PieSeriesOption>());
export const Scatter: EC<ScatterSeriesOption> = Components<ScatterSeriesOption>("Scatter", keys<ScatterSeriesOption>());
export const EffectScatter: EC<EffectScatterSeriesOption> = Components<EffectScatterSeriesOption>("EffectScatter", keys<EffectScatterSeriesOption>());
export const Radar: EC<RadarSeriesOption> = Components<RadarSeriesOption>("Radar", keys<RadarSeriesOption>());
export const Tree: EC<TreeSeriesOption> = Components<TreeSeriesOption>("Tree", keys<TreeSeriesOption>());
export const Treemap: EC<TreemapSeriesOption> = Components<TreemapSeriesOption>("Treemap", keys<TreemapSeriesOption>());
export const Sunburst: EC<SunburstSeriesOption> = Components<SunburstSeriesOption>("Sunburst", keys<SunburstSeriesOption>());
export const Boxplot: EC<BoxplotSeriesOption> = Components<BoxplotSeriesOption>("Boxplot", keys<BoxplotSeriesOption>());
export const Candlestick: EC<CandlestickSeriesOption> = Components<CandlestickSeriesOption>("Candlestick", keys<CandlestickSeriesOption>());
export const Heatmap: EC<HeatmapSeriesOption> = Components<HeatmapSeriesOption>("Heatmap", keys<HeatmapSeriesOption>());
export const Map: EC<MapSeriesOption> = Components<MapSeriesOption>("Map", keys<MapSeriesOption>());
export const Parallel: EC<ParallelSeriesOption> = Components<ParallelSeriesOption>("Partial", keys<ParallelSeriesOption>());
export const Lines: EC<LinesSeriesOption> = Components<LinesSeriesOption>("Lines", keys<LinesSeriesOption>());
export const Graph: EC<GraphSeriesOption> = Components<GraphSeriesOption>("Graph", keys<GraphSeriesOption>());
export const Sankey: EC<SankeySeriesOption> = Components<SankeySeriesOption>("Sankey", keys<SankeySeriesOption>());
export const Funnel: EC<FunnelSeriesOption> = Components<FunnelSeriesOption>("Funnel", keys<FunnelSeriesOption>());
export const Gauge: EC<GaugeSeriesOption> = Components<GaugeSeriesOption>("Gauge", keys<GaugeSeriesOption>());
export const PictorialBar: EC<PictorialBarSeriesOption> = Components<PictorialBarSeriesOption>("PictorialBar", keys<PictorialBarSeriesOption>());
export const ThemeRiver: EC<ThemeRiverSeriesOption> = Components<ThemeRiverSeriesOption>("ThemeRiver", keys<ThemeRiverSeriesOption>());
export const Custom: EC<CustomSeriesOption> = Components<CustomSeriesOption>("Custom", keys<CustomSeriesOption>());

export * from './Chart'

