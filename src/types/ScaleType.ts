interface ScaleType {
  domain?: number[] | string[]; // defaults [0, max]
  range?: number[] | string[] | string;
  scheme?: string;
  nice?: boolean;
  zero?: boolean;
  paddinginner?: number;
  paddingouter?: number;
}

export default ScaleType;