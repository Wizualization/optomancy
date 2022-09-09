import DomainType from "./DomainType";
import RangeType from "./RangeType";

interface ScaleType {
  domain?: DomainType; // defaults [0, max]
  range?: RangeType;
  scheme?: string | string[];
  nice?: boolean;
  zero?: boolean;
  paddingInner?: number;
  paddingOuter?: number;
}

export default ScaleType;
