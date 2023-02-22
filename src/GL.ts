import { EC as EFC, Components as defineComponent } from "./Components";

interface GlobeProps {
  [key: string]: any;
}

export const Globe: EFC<GlobeProps> = defineComponent<GlobeProps>("Globe");
export const Geo3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Geo3D");
export const Mapbox3D: EFC<GlobeProps> =
  defineComponent<GlobeProps>("Mapbox3D");
export const Grid3D: EFC<GlobeProps> = defineComponent<GlobeProps>("Grid3D");
export const XAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>(
  "XAxis3D",
  "value"
);
export const YAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>(
  "YAxis3D",
  "value"
);
export const ZAxis3D: EFC<GlobeProps> = defineComponent<GlobeProps>(
  "ZAxis3D",
  "value"
);

function define3DSeries<T>(name: string) {
  return defineComponent<T>(name, "", "series");
}

export const Scatter3D: EFC<GlobeProps> =
  define3DSeries<GlobeProps>("Scatter3D");
export const Bar3D: EFC<GlobeProps> = define3DSeries<GlobeProps>("Bar3D");
export const Line3D: EFC<GlobeProps> = define3DSeries<GlobeProps>("Line3D");
export const Lines3D: EFC<GlobeProps> = define3DSeries<GlobeProps>("Lines3D");
export const Map3D: EFC<GlobeProps> = define3DSeries<GlobeProps>("Map3D");
export const Surface: EFC<GlobeProps> = define3DSeries<GlobeProps>("Surface");
export const Polygons3D: EFC<GlobeProps> =
  define3DSeries<GlobeProps>("Polygons3D");
export const ScatterGL: EFC<GlobeProps> =
  define3DSeries<GlobeProps>("ScatterGL");
export const GraphGL: EFC<GlobeProps> = define3DSeries<GlobeProps>("GraphGL");
export const FlowGL: EFC<GlobeProps> = define3DSeries<GlobeProps>("FlowGL");
