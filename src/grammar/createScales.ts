// createScales.ts
//
// This function creates scales for all encoding channels supplied with a config.
//
// Scales are exported in a 2D array:
//   view ----------------+
//   workspace --------v  v
//              scales[0][0].channel
//
// Example:
//   [  <------ workspaces
//     [  <---- views
//       {  <-- view
//         x: () => {},
//       } || [ < -- layer
//         {
//           x: () => {},
//         }
//       ]
//     ]
//   ]
//
// TODO:
// - Perform dataset transforms here and return transformed datasets object

import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scalePoint,
  scaleSequential,
} from "d3";
import { RootType } from "../types";
import { IDatasets } from "./parseDatasets";

interface IScale {
  [string: string]:
    | typeof scaleLinear
    | typeof scaleBand
    | typeof scaleOrdinal
    | typeof scalePoint
    | typeof scaleSequential;
}

export type IScales = IScale[][];

/**
 * @name createScales
 * @description Create scales for encoding channels in config
 * @param compiledConfig A compiled Optomancy config
 * @param transformedDatasets Transformed datasets
 * @returns An object containing all scales for all workspaces
 */
const createScales = (
  compiledConfig: RootType,
  transformedDatasets: IDatasets
): IScales => {
  const scales = [[]];

  return scales;
};

export default createScales;
