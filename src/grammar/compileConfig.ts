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

import { cloneDeep } from "lodash";
import * as d3 from "d3";
import { isRootType, isWorkspaceType } from "../typeGuards";
import {
  ConfigType,
  EncodingType,
  MarkType,
  RootType,
  TooltipType,
} from "../types";
import getRanges from "./getRanges";
import getDomains from "./getDomains";
import { IDatasets } from "./parseDatasets";
import { defaults } from "./defaults";
import createScales, { IScales } from "./createScales";
import { MarkTypeDefaults, ViewDefaults } from "./defaults/DefaultsType";

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

  compiledConfig.workspaces.forEach((workspace, w) => {
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
    workspace.views.forEach((view, v) => {
      // TODO: Complete all inferences:
      // - Legend

      // Add view array to compiled scales shape
      compiledScales[w].push([]);

      if (view?.encoding !== undefined && view?.layers === undefined) {
        // This view does not have layers so only has a single encoding object
        // Create layers object
        // FIXME: The check for layers may be redundant?

        // --------------------
        // Top level view properties: See defaults.view
        let el: keyof ViewDefaults;
        for (el in defaults.view) {
          if (view[el] === undefined) {
            compiledConfig.workspaces[w].views[v][el] = defaults.view[el];
          }
        }

        // --------------------
        // Mark: See defaults.mark
        // Mark type
        let markType: MarkType | string;
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
          markShape =
            defaults.mark.types[markType as keyof MarkTypeDefaults].shape;
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
        compiledConfig.workspaces[w].views[v].mark = {
          type: markType!,
          shape: markShape!,
          tooltip: markTooltip!,
        };

        // --------------------
        // Ranges
        // Ranges are calculated here as subsequent inferences require ranges
        const ranges = getRanges(view);

        // Add channel properties
        // Object.keys(view.encoding).forEach((el) => {
        let encoding: keyof EncodingType;
        for (encoding in view.encoding) {
          let channel = view.encoding[encoding];

          // TODO: Throw error if channel doesn't exist
          if (channel === undefined) return;

          // Config encoding object
          const enc = compiledConfig.workspaces[w].views[v].encoding![encoding];

          // --------------------
          // Scale object
          // Add a scale object if one does not exist
          if (channel.scale === undefined) {
            enc!.scale = {};
          }

          // --------------------
          // Set scale range
          // Only add range if this encoding channel is not a constant
          // No layers, so we can assert the range is at position 0
          if (channel.value === undefined) {
            // TODO:
            // I don't like this, revisit the IRange | IRange[] typing
            enc!.scale!.range = ranges[0][encoding];
          }

          // --------------------
          // Scheme
          // If this is a colour scale, it should have a scheme
          // The scheme contains a named scale range or an array of colours
          if (encoding === "color") {
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
              enc!.scale!.scheme =
                defaults.scheme[defaults.range.color[channel.type!]];
            }
          }

          // --------------------
          // Nice
          // Nice the scale, never nice non-quantitative scales
          if (
            channel!.type === "quantitative" &&
            channel!.scale!.nice === undefined
          ) {
            enc!.scale!.nice = defaults.scale.nice;
          }

          // --------------------
          // Zero
          // Scale starts from zero, never zero non-quantitative scales

          if (
            channel!.type === "quantitative" &&
            channel!.scale!.zero === undefined
          ) {
            enc!.scale!.zero = defaults.scale.zero;
          }

          // Scale padding (only x, y, or z and non-quantitative fields)
          if (
            ["x", "y", "z"].includes(encoding) &&
            channel!.type !== "quantitative"
          ) {
            // --------------------
            // Padding inner
            // Sets padding inner to band scales
            if (channel?.scale?.paddingInner === undefined) {
              enc!.scale!.paddingInner = defaults.scale.paddingInner;
            }

            // --------------------
            // Padding outer
            // Sets padding outer to band scales, sets padding to point scales
            if (channel?.scale?.paddingOuter === undefined) {
              enc!.scale!.paddingOuter = defaults.scale.paddingOuter;
            }
          }

          // --------------------
          // Axis
          // Set axis properties
          // Only applies to x, y and z channels
          if (["x", "y", "z"].includes(encoding)) {
            // Add axis object if one does not exist
            if (channel?.axis === undefined) {
              enc!.axis = {};
            }

            if (
              channel?.axis &&
              typeof channel.axis !== "boolean" &&
              typeof enc?.axis !== "boolean"
            ) {
              // --------------------
              // Axis title
              // Set axis title to field name if not specified
              if (channel.axis.title === undefined) {
                enc!.axis!.title = channel.field;
              }
              // --------------------
              // Axis title padding
              // Set axis title padding if not specified
              if (channel.axis.titlePadding === undefined) {
                enc!.axis!.titlePadding = defaults.axis.titlePadding;
              }
              // --------------------
              // Axis filter
              // Set axis filter on or off
              if (channel.axis.filter === undefined) {
                enc!.axis!.filter = defaults.axis.filter;
              }
              // --------------------
              // Axis face
              // Set axis face
              if (channel.axis.face === undefined) {
                enc!.axis!.face = defaults.axis.face[encoding];
              }
              // --------------------
              // Axis orient
              // Set axis orient
              if (channel.axis.orient === undefined) {
                enc!.axis!.orient = defaults.axis.orient[encoding];
              }
              // --------------------
              // Axis ticks
              // Set axis tick visibility
              if (channel.axis.ticks === undefined) {
                enc!.axis!.ticks = defaults.axis.ticks;
              }
              // --------------------
              // Axis tick count
              // Set axis tick count
              if (channel.axis.tickCount === undefined) {
                enc!.axis!.tickCount = defaults.axis.tickCount;
              }
              // --------------------
              // Axis labels
              // Set axis label visability
              if (channel.axis.labels === undefined) {
                enc!.axis!.labels = defaults.axis.labels;
              }
            }

            // --------------------
            // Legend
            // TODO: Complete legend inference
          }
        }
        // });

        // --------------------
        // Domains
        // Get the domain from each encoding channel in this view
        const domains = getDomains(
          compiledConfig.workspaces[w].views[v],
          dataset
        );

        // --------------------
        // Scales
        // Using domains and ranges to produce scale functions
        // These scale functions are for mapping data and are not added to the config
        const scales = createScales(
          compiledConfig.workspaces[w].views[v],
          ranges[0], // No layers: [0]
          domains
        );

        compiledScales[w][v].push(scales);

        // Scales are exported in a 3D array:
        //   view ----------------+
        //   workspace --------v  v
        //              scales[0][0].channel
        //
        // Current Example:
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
        //
        // In Progress Example:
        //   [  <-------- workspaces
        //     [  <------ views       (workspace[w])
        //       [  <---- view        (views[w])
        //         {  <-- layer       (layers[l])
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
            compiledConfig.workspaces[w].views[v].encoding![el].scale.domain =
              compiledScales[w][v][0][el].domain();
          }
        });
      } else if (view?.layers !== undefined) {
        // This view has layers, like onions, and ogres.
        // It has multiple encoding objects, one per layer, up to n layers.
        view.layers.forEach((layer, k) => {
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
