import ChannelType from "./ChannelType";

interface EncodingType {
  // At least one required
  x?: ChannelType;
  y?: ChannelType;
  z?: ChannelType;
  xoffset?: ChannelType;
  yoffset?: ChannelType;
  zoffset?: ChannelType;
  xrot?: ChannelType;
  yrot?: ChannelType;
  zrot?: ChannelType;
  width?: ChannelType;
  height?: ChannelType;
  depth?: ChannelType;
  size?: ChannelType;
  color?: ChannelType;
  opacity?: ChannelType;
  length?: ChannelType;
  shape?: ChannelType;
}

export default EncodingType;
