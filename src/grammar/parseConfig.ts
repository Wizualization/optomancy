// parseConfig.ts
//
// This function parses an Optomancy config with the following steps:
//
// 1) Validate config
// 2) Retrieve and parse datasets
// 3) Apply dataset transforms
// 4) Infer config defaults, producing compiled config and a set of scales
// 5) Export transformed datasets, scales, compiled config and meta data
//
// TODO:
// - Validate config before parsing (1)

import { ConfigType, RootType, ScalesType } from "../types";
import applyTransforms from "./applyTransforms";
import compileConfig from "./compileConfig";
import parseDatasets, { IDatasets } from "./parseDatasets";

export interface IParsedConfig {
  datasets: IDatasets;
  config: RootType;
  scales: ScalesType;
}

/**
 * @name parseConfig
 * @description Parses an Optomancy config
 * @param userConfig An Optomancy config
 * @returns {object} A compiled optomancy config, datasets and scales
 */
const parseConfig = (userConfig: ConfigType): IParsedConfig => {
  // 1) Validate config
  // TODO:
  // - Validate config before parsing
  //   Use AJV or equivalent against an Optomancy config JSON schema

  // 2) Retrieve and parse datasets
  const datasets = parseDatasets(userConfig);

  // 3) Apply dataset transforms
  const transformedDatasets = applyTransforms(userConfig, datasets);

  // 4) Infer config defaults, producing compiled config and a set of scales
  const { config, scales } = compileConfig(userConfig, transformedDatasets);

  // 5) Export transformed datasets, scales, compiled config and meta data
  return {
    datasets: transformedDatasets,
    config,
    scales,
  };
};

export default parseConfig;
