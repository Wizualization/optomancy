import ScaleType from "./ScaleType";
import AxisType from "./AxisType";
import LegendType from "./LegendType";

interface ChannelType {
  field?: string; // REQUIRED if value not specified
  type?: string; // REQUIRED if value not specified
  value?: number | string; // REQUIRED if field+type not specified
  timeUnit?: string; // REQUIRED if using temporal field type
  numberFormat?: string;
  scale?: ScaleType;
  axis?: AxisType;
  legend?: LegendType;
}

export default ChannelType;
