import DataType from "./DataType";
import ViewType from "./ViewType";
import TransformType from "./TransformType";

interface WorkspaceType {
  title?: string;
  data: DataType | string; //Either dataset name/url or new Data object
  views: ViewType[];
  transform?: TransformType[];
}

export default WorkspaceType;
