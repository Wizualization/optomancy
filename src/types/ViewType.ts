import LayerType from "./LayerType";
import MarkType from "./MarkType";
import EncodingType from "./EncodingType";
import DataType from "./DataType";
import TransformType from "./TransformType";

interface ViewType {
  title: string;
  titlePadding?: number;
  data?: DataType | string; // REQUIRED if not using workspace
  transform?: TransformType[];
  layers?: LayerType[]; // REQUIRED if not using mark + encoding
  mark?: MarkType | string; // REQUIRED if not using layers
  encoding?: EncodingType; // REQUIRED if not using layers
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

export default ViewType;
