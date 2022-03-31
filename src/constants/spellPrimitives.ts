// Geom
const GEOM_TYPES = ["point", "line", "column", "bar"];

// Spatial
const SPATIAL_ENCODING_TYPES = ["x", "y", "z"];

// Visual
const VISUAL_ENCODING_TYPES = ["color", "size"];

// Primitives export
const SPELL_PRIMITIVES = [
  ...GEOM_TYPES,
  ...SPATIAL_ENCODING_TYPES,
  ...VISUAL_ENCODING_TYPES,
];

export default SPELL_PRIMITIVES;
