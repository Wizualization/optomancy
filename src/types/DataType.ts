//type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
//type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

interface DataType {
  values?: any[]; // REQUIRED if not using url
  url?: string;
  name?: string; // REQUIRED if using workspaces (multiple datasets)
}

export default DataType;
