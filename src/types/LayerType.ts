import MarkType from "./MarkType";
import EncodingType from "./EncodingType";

interface LayerType {
  mark: MarkType;
  encoding: EncodingType;
  width?: number;
  height?: number;
  depth?: number;
  x?: number;
  y?: number;
  z?: number;
  xrot?: number;
  yrot?: number;
  zrot?: number;
}

export default LayerType;
