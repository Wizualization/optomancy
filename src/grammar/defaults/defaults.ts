import DefaultsType from "./DefaultsType";

const defaults: DefaultsType = {
  view: {
    titlePadding: 0.1,
    width: 1,
    height: 1,
    depth: 1,
    x: 0,
    y: 0,
    z: 0,
    xrot: 0,
    yrot: 0,
    zrot: 0,
  },
  mark: {
    defaultType: "point",
    types: {
      bar: {
        shape: "box",
      },
      point: {
        shape: "sphere",
      },
      line: {
        shape: "line",
      },
    },
    tooltip: {
      on: { content: "data" },
      off: false,
    },
  },
  range: {
    size: [0, 0.1],
    length: [0, 0.1],
    offset: [0, 0, 1],
    rotation: [0, 360],
    color: {
      quantitative: "ramp",
      ordinal: "ordinal",
      nominal: "category",
      temporal: "ramp",
    },
    shape: ["sphere", "box", "tetrahedron", "torus", "cone"],
  },
  scheme: {
    ramp: "interpolateBlues",
    ordinal: "schemeBlues",
    category: "schemeTableau10",
  },
  scale: {
    nice: true,
    zero: true,
    paddingInner: 0.25,
    paddingOuter: 0.25,
  },
  axis: {
    titlePadding: 0.1,
    filter: false,
    ticks: true,
    tickCount: 10,
    labels: true,
    face: {
      x: "front",
      y: "back",
      z: "left",
    },
    orient: {
      x: "bottom",
      y: "left",
      z: "bottom",
    },
  },
};

export default defaults;
