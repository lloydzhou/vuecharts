import { keys } from 'ts-transformer-keys';
import {
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
  // 
  ContinousVisualMapOption,
  PiecewiseVisualMapOption,
  // 
  InsideDataZoomOption,
  SliderDataZoomOption,
  // 
  TitleOption,
  LegendOption,
  ScrollableLegendOption,
  GridOption,
  XAXisOption,
  YAXisOption,
  RadiusAxisOption,
  AngleAxisOption,
  PolarOption,
  RadarOption,
  TooltipOption,
  AxisPointerOption,
  ToolboxComponentOption,
  AriaOption,
  // ParallelAxisOption,
  BrushOption,
  GeoOption,
  SingleAxisOption,
  TimelineOption,
  CalendarOption,
  DatasetOption,
} from 'echarts/types/dist/shared'

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


export const componentsMap = {
  Title: keys<TitleOption>(),
  Legend: keys<Spread<[LegendOption, ScrollableLegendOption]>>(),
  Grid: keys<GridOption>(),
  XAxis: keys<Spread<[XAXisOption, AxisBaseOption]>>(),
  YAxis: keys<Spread<[YAXisOption, AxisBaseOption]>>(),
  Polar: keys<PolarOption>(),
  RadiusAxis: keys<Spread<[RadiusAxisOption, AxisBaseOption]>>(),
  AngleAxis: keys<Spread<[AngleAxisOption, AxisBaseOption]>>(),
  // Radar和series.radar重合
  RadarAxis: keys<RadarOption>(),
  DataZoom: keys<Spread<[InsideDataZoomOption, SliderDataZoomOption]>>(),
  Inside: keys<InsideDataZoomOption>(),
  Slider: keys<SliderDataZoomOption>(),

  // visualMap
  VisualMap: keys<Spread<[ContinousVisualMapOption, PiecewiseVisualMapOption]>>(),
  Continuous: keys<ContinousVisualMapOption>(),
  Piecewise: keys<PiecewiseVisualMapOption>(),

  Tooltip: keys<TooltipOption>(),
  AxisPointer: keys<AxisPointerOption>(),
  Toolbox: keys<ToolboxComponentOption>(),
  Brush: keys<BrushOption>(),
  Geo: keys<GeoOption>(),
  // Parallel: [], // 这个和series.parallel重合了
  // ParallelAxis: keys<ParallelAxisOption>(),
  SingleAxis: keys<Spread<[SingleAxisOption, AxisBaseOption]>>(),
  Timeline: keys<TimelineOption>(),
  // TODO Graphic: [],
  Calendar: keys<CalendarOption>(),
  Dataset: keys<DatasetOption>(),
  Aria: keys<AriaOption>(),

  // series
  Line: keys<LineSeriesOption>(),
  Bar: keys<BarSeriesOption>(),
  Pie: keys<PieSeriesOption>(),
  Scatter: keys<ScatterSeriesOption>(),
  EffectScatter: keys<EffectScatterSeriesOption>(),
  Radar: keys<RadarSeriesOption>(),
  Tree: keys<TreeSeriesOption>(),
  Treemap: keys<TreemapSeriesOption>(),
  Sunburst: keys<SunburstSeriesOption>(),
  Boxplot: keys<BoxplotSeriesOption>(),
  Candlestick: keys<CandlestickSeriesOption>(),
  Heatmap: keys<HeatmapSeriesOption>(),
  Map: keys<MapSeriesOption>(),
  Parallel: keys<ParallelSeriesOption>(),
  Lines: keys<LinesSeriesOption>(),
  Graph: keys<GraphSeriesOption>(),
  Sankey: keys<SankeySeriesOption>(),
  Funnel: keys<FunnelSeriesOption>(),
  Gauge: keys<GaugeSeriesOption>(),
  PictorialBar: keys<PictorialBarSeriesOption>(),
  ThemeRiver: keys<ThemeRiverSeriesOption>(),
  Custom: keys<CustomSeriesOption>(),
}


