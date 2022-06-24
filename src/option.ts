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
  VisualMapComponentOption,
  ContinousVisualMapOption,
  PiecewiseVisualMapOption,
  // 
  DataZoomComponentOption,
  InsideDataZoomOption,
  SliderDataZoomOption,
  // 
  TitleOption,
  LegendComponentOption,
  LegendOption,
  ScrollableLegendOption,
  GridOption,
  XAXisOption,
  YAXisOption,
  PolarOption,
  RadiusAxisOption,
  AngleAxisOption,
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

export const series = [
  'Line', 'Bar', 'Pie', 'Scatter', 'EffectScatter', 'Radar', 'Tree', 'Treemap',
  'Sunburst', 'Boxplot', 'Candlestick', 'Heatmap', 'Map', 'Parallel', 'Lines',
  'Graph', 'Sankey', 'Funnel', 'Gauge', 'PictorialBar', 'ThemeRiver', 'Custom',
]
export const visualMap = ['VisualMap', 'Continuous', 'Piecewise']
export const dataZoom = ['DataZoom', 'Inside', 'Slider']


export const componentsMap = {
  Title: keys<TitleOption>(),
  Legend: keys<LegendOption>(),
  Grid: keys<GridOption>(),
  XAxis: keys<XAXisOption>(),
  YAxis: keys<YAXisOption>(),
  Polar: keys<PolarOption>(),
  RadiusAxis: keys<RadiusAxisOption>(),
  AngleAxis: keys<AngleAxisOption>(),
  // Radar和series.radar重合
  RadarAxis: keys<RadarOption>(),
  DataZoom: keys<DataZoomComponentOption>(),
  Inside: keys<InsideDataZoomOption>(),
  Slider: keys<SliderDataZoomOption>(),

  // visualMap
  VisualMap: keys<VisualMapComponentOption>(),
  Continuous: keys<ContinousVisualMapOption>(),
  Piecewise: keys<PiecewiseVisualMapOption>(),

  Tooltip: keys<TooltipOption>(),
  AxisPointer: keys<AxisPointerOption>(),
  Toolbox: keys<ToolboxComponentOption>(),
  Brush: keys<BrushOption>(),
  Geo: keys<GeoOption>(),
  // Parallel: [], // 这个和series.parallel重合了
  // ParallelAxis: keys<ParallelAxisOption>(),
  SingleAxis: keys<SingleAxisOption>(),
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


