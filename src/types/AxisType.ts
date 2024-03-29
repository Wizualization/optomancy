interface Axis {
  title?: string; //default: field name
  titlePadding?: number; //default: 0
  filter?: boolean; //default: false; enables filter tools
  face?: string; //face to orient axis. front, back, left, right, top, bottom. Default: x: front, y: back, z: left
  orient?: string; // axis position on its face
  ticks?: boolean; //default: true
  tickCount?: number; //number of tickmarks; 10 by default but different if niced
  labels?: boolean; //default: true
}

export default Axis;
