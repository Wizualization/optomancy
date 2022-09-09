// applyTransforms.ts
//
// This function applies workspace and view-level transforms to a dataset and returns
// a transformed datasets object.
//
// TODO:
// - Perform dataset transforms here and return transformed datasets object

import { cloneDeep } from "lodash";
import { ConfigType } from "../types";
import { IDatasets } from "./parseDatasets";

/**
 * @name applyTransforms
 * @description Applies transforms to datasets
 * @param config An Optomancy config
 * @returns An object containing all transformed datasets
 */
const applyTransforms = (
  config: ConfigType,
  datasets: IDatasets
): IDatasets => {
  // Clone original datasets object using lodash/cloneDeep
  const transformedDatasets: IDatasets = cloneDeep(datasets);

  // TODO:
  // - Perform dataset transforms here and return transformed datasets object

  return transformedDatasets;
};

export default applyTransforms;
