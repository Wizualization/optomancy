// TODO:
// Consider using config types here rather than redefining everything

interface DefaultsType {
  view: ViewDefaults;
  mark: MarkDefaults;
  range: RangeDefaults;
  scheme: SchemeDefaults;
  scale: ScaleDefaults;
  axis: AxisDefaults;
}

export interface ViewDefaults {
  titlePadding: number;
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
  xrot: number;
  yrot: number;
  zrot: number;
}

export interface MarkTypeDefaults {
  bar: {
    shape: string;
  };
  point: {
    shape: string;
  };
  line: {
    shape: string;
  };
}

export interface MarkDefaults {
  defaultType: string;
  types: MarkTypeDefaults;
  tooltip: {
    on: { content: string };
    off: boolean;
  };
}

export interface RangeDefaults {
  size: number[];
  length: number[];
  offset: number[];
  rotation: number[];
  color: {
    quantitative: string;
    ordinal: string;
    nominal: string;
    temporal: string;
  };
  shape: string[];
}

export interface SchemeDefaults {
  ramp: string;
  ordinal: string;
  category: string;
}

export interface ScaleDefaults {
  nice: boolean;
  zero: boolean;
  paddingInner: number;
  paddingOuter: number;
}

export interface AxisDefaults {
  titlePadding: number;
  filter: boolean;
  ticks: boolean;
  tickCount: number;
  labels: boolean;
  face: {
    x: string;
    y: string;
    z: string;
  };
  orient: {
    x: string;
    y: string;
    z: string;
  };
}

export default DefaultsType;
