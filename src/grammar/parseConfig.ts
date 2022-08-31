// parseConfig.ts
//
// This function parses an Optomancy config with the following steps:
//
// 1) Validate config
// 2) Retrieve and parse datasets
// 3) Apply dataset transforms
// 4) Infer config defaults, producing compiled config
// 5) Create scales for encoding channels
// 6) Export transformed datasets, scales, compiled config and meta data
//
// TODO:
// - Validate config before parsing (1)

import { ConfigType, RootType } from "../types";
import applyTransforms from "./applyTransforms";
import compileConfig from "./compileConfig";
import createScales, { IScales } from "./createScales";
import parseDatasets, { IDatasets } from "./parseDatasets";

export interface IParsedConfig {
  transformedDatasets: IDatasets;
  compiledConfig: RootType;
  scales: IScales;
}

/**
 * @name parseConfig
 * @description Parses an Optomancy config
 * @param config An Optomancy config
 * @returns {object} A compiled optomancy config, datasets and scales
 */
const parseConfig = (config: ConfigType): IParsedConfig => {
  // 1) Validate config
  // TODO:
  // - Validate config before parsing
  //   Use AJV or equivalent against an Optomancy config JSON schema

  // 2) Retrieve and parse datasets
  const datasets = parseDatasets(config);
  console.log("parseConfig.ts -> datasets", datasets);

  // 3) Apply dataset transforms
  const transformedDatasets = applyTransforms(config, datasets);
  console.log("parseConfig.ts -> transformedDatasets", transformedDatasets);

  // 4) Infer config defaults, producing compiled config
  const compiledConfig = compileConfig(config, transformedDatasets);
  console.log("parseConfig.ts -> compiledConfig", compiledConfig);

  // 5) Create scales for encoding channels
  const scales = createScales(compiledConfig, transformedDatasets);
  console.log("parseConfig.ts -> scales", scales);

  return {
    transformedDatasets,
    compiledConfig,
    scales,
  };
};

export default parseConfig;
