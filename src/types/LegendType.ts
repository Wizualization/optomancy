interface Legend {
  type?: string; //can be "gradient" or "symbol"
  title?: string;
  filter?: boolean;
  face?: string; // Default: back. which face of the axis bbox to show legend. front, back, left, right, top, bottom.
  orient?: string;
  xoffset?: number;
  yoffset?: number;
  zoffset?: number;
  xrot?: number;
  yrot?: number;
  zrot?: number;
}

export default Legend;
