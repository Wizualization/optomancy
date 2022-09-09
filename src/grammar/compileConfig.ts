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
// - - Remaining: Legend
// - Support layers

import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";
import { isRootType, isWorkspaceType } from "../typeGuards";
import { ConfigType, RootType, TooltipType } from "../types";
import getRanges from "./getRanges";
import getDomains from "./getDomains";
import { IDatasets } from "./parseDatasets";
import { defaults } from "./defaults";
import createScales, { IScales } from "./createScales";

interface ICompileConfig {
  config: RootType;
  scales: IScales[][][];
}

/**
 * @name compileConfig
 * @description Infers missing config values and assigns sensible defaults
 * @param userConfig A user supplied Optomancy config
 * @param transformedDatasets Transformed datasets
 * @returns {object} A compiled config
 */
const compileConfig = (
  config: ConfigType,
  transformedDatasets: IDatasets
): ICompileConfig => {
  let compiledConfig: RootType;
  let compiledScales: any[] = [];

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

  compiledConfig.workspaces.forEach((workspace, i) => {
    // Add workspace array to compiled scales shape
    compiledScales.push([]);

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
      // TODO: Complete all inferences:
      // - Legend

      // Add view array to compiled scales shape
      compiledScales[i].push([]);

      if (view?.encoding !== undefined) {
        // This view does not have layers so only has a single encoding object

        // --------------------
        // Top level view properties: See defaults.view
        Object.keys(defaults.view).forEach((el) => {
          if (view[el] === undefined) {
            compiledConfig.workspaces[i].views[j][el] = defaults.view[el];
          }
        });

        // --------------------
        // Mark: See defaults.mark
        // Mark type
        let markType: string;
        if (typeof view.mark === "object") {
          markType = view.mark.type;
        } else {
          markType = view.mark!;
        }

        // Mark shape
        let markShape: string;
        if (typeof view.mark === "object") {
          markShape = view.mark.shape;
        } else {
          markShape = defaults.mark.types[markType].shape;
        }

        // Mark tooltip
        let markTooltip: TooltipType | boolean;
        if (typeof view.mark === "object") {
          if (typeof view.mark.tooltip === "object") {
            markTooltip = view.mark.tooltip;
          } else if (view.mark.tooltip === true) {
            markTooltip = defaults.mark.tooltip.on;
          }
        } else {
          markTooltip = defaults.mark.tooltip.off;
        }

        // Replace existing mark config with compiled mark object
        compiledConfig.workspaces[i].views[j].mark = {
          type: markType!,
          shape: markShape!,
          tooltip: markTooltip!,
        };

        // --------------------
        // Ranges
        // Ranges are calculated here as subsequent inferences require ranges
        const ranges = getRanges(view);

        // Add channel properties
        Object.keys(view.encoding).forEach((el) => {
          let channel = view.encoding?.[el];
          // --------------------
          // Scale object
          // Add a scale object if one does not exist
          if (channel.scale === undefined) {
            compiledConfig.workspaces[i].views[j].encoding![el].scale = {};
          }

          // --------------------
          // Set scale range
          // Only add range if this encoding channel is not a constant
          if (channel.value === undefined) {
            compiledConfig.workspaces[i].views[j].encoding![el].scale.range =
              ranges[el];
          }

          // --------------------
          // Scheme
          // If this is a colour scale, it should have a scheme
          // The scheme contains a named scale range or an array of colours
          if (el === "color") {
            // If a scheme is provided, validate it
            let scheme = channel?.scale?.scheme;
            if (scheme === "string" && d3[scheme] === undefined) {
              // FIXME: Return error
              // Invalid scheme - Scheme does not exist in d3
            }

            // If the range is a string, it is a colour scale, do a lookup
            // If the range is a string but the scheme is already set, ignore range
            if (
              typeof channel?.scale?.range === "string" &&
              scheme === undefined
            ) {
              compiledConfig.workspaces[i].views[j].encoding![
                el
              ]!.scale!.scheme =
                defaults.scheme[defaults.range.color[channel.type]];
            }
          }

          // --------------------
          // Nice
          // Nice the scale, never nice non-quantitative scales
          if (
            channel.type === "quantitative" &&
            channel.scale.nice === undefined
          ) {
            compiledConfig.workspaces[i].views[j].encoding![el].scale.nice =
              defaults.scale.nice;
          }

          // --------------------
          // Zero
          // Scale starts from zero, never zero non-quantitative scales

          if (
            channel.type === "quantitative" &&
            channel.scale.zero === undefined
          ) {
            compiledConfig.workspaces[i].views[j].encoding![el].scale.zero =
              defaults.scale.zero;
          }

          // Scale padding (only x, y, or z and non-quantitative fields)
          if (["x", "y", "z"].includes(el) && channel.type !== "quantitative") {
            // --------------------
            // Padding inner
            // Sets padding inner to band scales
            if (channel?.scale?.paddingInner === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![
                el
              ].scale.paddingInner = defaults.scale.paddingInner;
            }
            // --------------------
            // Padding outer
            // Sets padding outer to band scales, sets padding to point scales
            if (channel?.scale?.paddingOuter === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![
                el
              ].scale.paddingOuter = defaults.scale.paddingOuter;
            }
          }

          // --------------------
          // Axis
          // Set axis properties
          // Only applies to x, y and z channels
          if (["x", "y", "z"].includes(el) && channel?.axis !== false) {
            // Add axis object if one does not exist
            if (channel?.axis === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis = {};
            }

            // --------------------
            // Axis title
            // Set axis title to field name if not specified
            if (channel?.axis?.title === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.title =
                channel.field;
            }

            // --------------------
            // Axis title padding
            // Set axis title padding if not specified
            if (channel?.axis?.titlePadding === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![
                el
              ].axis.titlePadding = defaults.axis.titlePadding;
            }

            // --------------------
            // Axis filter
            // Set axis filter on or off
            if (channel?.axis?.filter === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.filter =
                defaults.axis.filter;
            }

            // --------------------
            // Axis face
            // Set axis face
            if (channel?.axis?.face === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.face =
                defaults.axis.face[el];
            }

            // --------------------
            // Axis orient
            // Set axis orient
            if (channel?.axis?.orient === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.orient =
                defaults.axis.orient[el];
            }

            // --------------------
            // Axis ticks
            // Set axis tick visibility
            if (channel?.axis?.ticks === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.ticks =
                defaults.axis.ticks;
            }

            // --------------------
            // Axis tick count
            // Set axis tick count
            if (channel?.axis?.tickCount === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![
                el
              ].axis.tickCount = defaults.axis.tickCount;
            }

            // --------------------
            // Axis labels
            // Set axis label visability
            if (channel?.axis?.labels === undefined) {
              compiledConfig.workspaces[i].views[j].encoding![el].axis.labels =
                defaults.axis.labels;
            }

            // --------------------
            // Legend
            // TODO: Complete legend inference
          }
        });

        // --------------------
        // Domains
        // Get the domain from each encoding channel in this view
        const domains = getDomains(
          compiledConfig.workspaces[i].views[j],
          dataset
        );

        // --------------------
        // Scales
        // Using domains and ranges to produce scale functions
        // These scale functions are for mapping data and are not added to the config
        const scales = createScales(
          compiledConfig.workspaces[i].views[j],
          ranges,
          domains
        );

        compiledScales[i][j].push(scales);

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
        //       } || [ < -- TODO: layer
        //         {
        //           x: () => {},
        //         }
        //       ]
        //     ]
        //   ]

        // Add domain to compiled config
        // This is necessary because some domains will have been niced or zeroed
        Object.keys(view.encoding).forEach((el) => {
          let channel = view.encoding?.[el];
          // If this encoding has a field (excluding constant channels)
          if (channel.value === undefined) {
            // Add domain to compiled config
            // Indexing 0 as there is only 1 layer per view here
            compiledConfig.workspaces[i].views[j].encoding![el].scale.domain =
              compiledScales[i][j][0][el].domain();
          }
        });
      } else if (view?.layer !== undefined) {
        // This view has layers, like onions, and ogres.
        // It has multiple encoding objects, one per layer, up to n layers.
        view.layer.forEach((layer, k) => {
          // TODO: Support layer compilation
          // - This should be achieved by extracting view-level compilation
          //   into a function that accepts a layer-like object and calling
          //   it here on each layer
        });
      }
    });
  });

  return { config: compiledConfig, scales: compiledScales };
};

export default compileConfig;
