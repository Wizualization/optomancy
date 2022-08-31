// compileConfig.ts
//
// This function converts an Optomancy config provided by the user and
// returns a config with inferred values and sensible defaults.
//
// This takes place after datasets have been loaded and transformed so
// that inference can take place based on the datasets that will be
// visualized, for example, using the correct domains.
//
// Compiled configs take the shape of RootType.
//
// TODO:
// - Perform config inference against a set of sensible defaults

import cloneDeep from "lodash/cloneDeep";
import { isRootType, isWorkspaceType } from "../typeGuards";
import { ConfigType, RootType } from "../types";
import getRanges from "./getRanges";
import { IDatasets } from "./parseDatasets";

/**
 * @name compileConfig
 * @description Infers missing config values and assigns sensible defaults
 * @param config An Optomancy config
 * @param transformedDatasets Transformed datasets
 * @returns {object} A compiled config
 */
const compileConfig = (
  config: ConfigType,
  transformedDatasets: IDatasets
): RootType => {
  let compiledConfig: RootType;

  // Convert datasets object to array of datasets for compiled config
  // This will encode datasets into compiled configs though Optomancy can instead
  // refer to datasets by name (at the view level) to its internal datasets object.
  const datasets = Object.keys(transformedDatasets).map((el) => ({
    name: el,
    values: [...transformedDatasets[el]],
  }));

  // Re-shape config into RootType config
  if (isRootType(config)) {
    // RootType config
    compiledConfig = cloneDeep(config);
  } else if (isWorkspaceType(config)) {
    // WorkspaceType config
    // Workspace configs have just one workspace and one dataset
    compiledConfig = {
      datasets: [...datasets],
      workspaces: [
        {
          ...cloneDeep(config),
          // 0th dataset (only 1 dataset for WorkspaceType configs)
          data: datasets[0].name,
        },
      ],
    };
  } else {
    // ViewType config
    compiledConfig = {
      datasets: [...datasets],
      workspaces: [
        {
          title: config.title,
          data: datasets[0].name,
          ...(config.transform && { transform: cloneDeep(config.transform) }),
          views: [{ ...cloneDeep(config) }],
        },
      ],
    };
    // Remove data property from view config (moved to level above)
    delete compiledConfig.workspaces[0].views[0].data;
    // Remove transform property from view config (moved to level above, if exists)
    delete compiledConfig.workspaces[0].views[0].transform;
  }

  // TODO:
  // - Perform config inference against a set of sensible defaults

  compiledConfig.workspaces.forEach((workspace, i) => {
    // Get name of dataset as string
    let datasetName: string;
    if (typeof workspace.data === "string") {
      datasetName = workspace.data;
    } else {
      // FIXME: Return error:
      // Dataset name does not match known dataset
      return;
    }

    // The dataset associated with this workspace
    const dataset = transformedDatasets[datasetName];

    // Loop over all workspaces...
    workspace.views.forEach((view, j) => {
      // TODO: Make view inferences here:
      // - Top level view properties:
      // - - x, y, z, xrot, yrot, zrot, width, height, depth, titlePadding
      // - Mark
      // - - type, shape, tooltip
      // Loop over all views (and layers) in each workspace...

      if (view?.encoding !== undefined) {
        // This view does not have layers so only has a single encoding object
      } else if (view?.layer !== undefined) {
        // This view has layers, like onions, and ogres.
        // It has multiple encoding objects, one per layer, up to n layers.
      }

      // Ranges
      const ranges = getRanges(view, dataset);
    });
  });

  return compiledConfig;
};

export default compileConfig;
