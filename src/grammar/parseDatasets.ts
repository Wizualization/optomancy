// parseDatasets.ts
//
// This function loads datasets from data objects supplied in config
// files.
//
// Datasets are set in multiple places in a config file.
// They can be set at:
//
// ROOT  - When using workspaces
//       - config.datasets[ DATASET, ... ]
//       - Datasets linked by name at: config.workspaces[].data
//
// VIEWS - A single workspace, or when using views
//       - config.data
//
// This function is NOT responsible for applying row transformations.
// Transformations take place in applyTransforms.ts.
//
// TODO:
// - Support loading datasets from path (see _loadDatasetFromURL())

import { isRootType } from "../typeGuards";
import { ConfigType } from "../types";

// Supported dataset file types
const SUPPORTED_FILE_TYPES = ["json", "csv", "tsv", "txt", "text"];

export interface IDatasets {
  [string: string]: any[];
}

/**
 * @name parseDatasets
 * @description Retrieves and parses a datasets from config
 * @param config An Optomancy config object
 * @returns An object containing all datasets associated with this config
 */
const parseDatasets = (config: ConfigType): IDatasets => {
  // Dataset storage object
  const datasets: IDatasets = {};

  if (isRootType(config)) {
    // Using RootType config
    config.datasets.map(_parseDataConfig);
  } else {
    // Using WorkspaceType or ViewType config
    _parseDataConfig(config?.data);
  }

  /**
   * @name _parseDataConfig
   * @description Parses the data portion of config
   * @param configData Data portion of config
   * @private
   */
  function _parseDataConfig(configData: any) {
    if (typeof configData === "string") {
      // Data is a string
      // Check list of datasets to see if this is a reference first
      if (!datasets.hasOwnProperty(configData)) {
        // Dataset is a url
        _loadDatasetFromURL(configData);
      }
    } else {
      // Data object
      // If data object has a url and/or name
      if (configData?.url && configData?.name) {
        // Dataset is a url with a name
        // { url: 'something', name: 'something' }
        _loadDatasetFromURL(configData.url, configData.name);
      } else if (configData?.url) {
        // Dataset is a url
        // { url: 'something' }
        _loadDatasetFromURL(configData.url);
      } else if (configData?.values) {
        // Dataset is a JSON array
        if (configData?.name) {
          // If a name is supplied, store with this name
          // { values: [], name: 'something' }
          datasets[configData.name] = [...configData.values];
        } else {
          // If a name is not supplied, use default
          // { values: [], name: "dataset{n}" }
          let countDatasets = Object.keys(datasets).length + 1;
          datasets[`dataset${countDatasets}`] = [...configData.values];
        }
      }
    }
  }

  /**
   * @name _loadDatasetFromURL
   * @description Load a dataset from a URL
   * @param url URL of dataset to load
   * @param name {optional} Name of dataset
   * @private
   */
  function _loadDatasetFromURL(url: string, name?: string) {
    // Get file type
    const FILE_TYPE = url.split(".").pop()!.toLowerCase();

    // Check if file type is supported
    if (SUPPORTED_FILE_TYPES.includes(FILE_TYPE)) {
      // TODO: Parse dataset with d3.csv, d3.tsv etc.
      // TODO: Store in datasets object
    }

    // TODO: Set dataset (and give it a name if not supplied):
    // let countDatasets = Object.keys(datasets).length + 1;
    // datasets[`dataset${countDatasets}`] = [...];
  }

  return datasets;
};

export default parseDatasets;
