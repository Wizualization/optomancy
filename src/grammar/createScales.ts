// createScales.ts
//
// This function creates scales for all encoding channels in a view
//
// TODO:
// - Add ordinal and temporal encodings

import * as d3 from "d3";
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scalePoint,
  scaleSequential,
} from "d3";
import { defaults } from "./defaults";
import { EncodingType, ViewType } from "../types";
import { IDomains } from "./getDomains";
import { IRanges } from "./getRanges";

export interface IScales {
  [string: string]:
    | typeof scaleLinear
    | typeof scaleBand
    | typeof scaleOrdinal
    | typeof scalePoint
    | typeof scaleSequential;
}

/**
 * @name createScales
 * @description Create scales for encoding channels in config
 * @param view Create scale for each encoding channel in this view
 * @param ranges Ranges object
 * @param domains Domains object
 * @returns An object containing all scales for all workspaces
 */
const createScales = (
  view: ViewType, // FIXME: Consider creating CompiledViewType etc.?
  ranges: IRanges | IRanges[],
  domains: IDomains | IDomains[]
): IScales | IScales[] => {
  if (view?.encoding !== undefined) {
    // This view doesn't have any layers so only has a single encoding object
    return _createScalesFromEncoding(view.encoding);
  } else if (view?.layers !== undefined) {
    // This view has layers, like onions, and ogres.
    // It has multiple encoding objects, one per layer, up to n layers.
    const viewScales: IScales[] = [];
    view.layers.forEach((layer) => {
      viewScales.push(_createScalesFromEncoding(layer.encoding));
    });
    return viewScales;
  } else {
    // FIXME: Return error:
    // Encoding is undefined
    return [];
  }

  /**
   * @name _createScalesFromEncoding
   * @description Create scales from an encoding object
   * @param encoding A view encoding object
   * @returns A scale object or scale object array
   */
  function _createScalesFromEncoding(encoding: EncodingType): IScales {
    const scales = {};

    Object.keys(encoding).forEach((channel) => {
      // This channel's scale
      let scale;
      // Create scales for each channel based on encoding type
      if (encoding[channel].value) {
        // Channel value is constant
        scale = () => encoding[channel].value;
      } else {
        switch (encoding[channel].type) {
          // Quantitative field scales
          case "quantitative":
            switch (channel) {
              // Colour channel
              case "color":
                let scheme = encoding[channel]?.scale?.scheme;
                // If a scheme is defined, use that scheme
                if (scheme !== undefined) {
                  if (typeof scheme === "string") {
                    // Scheme is a string
                    scale = d3
                      .scaleSequential()
                      .domain(domains[channel])
                      .interpolator(d3[scheme]);
                  } else {
                    // Scheme is an array
                    scale = d3
                      .scaleLinear()
                      .domain(domains[channel])
                      .range(ranges[channel]);

                    // Nice the scale
                    if (encoding[channel]!.scale?.nice === true) {
                      scale = scale.nice();
                    }
                  }
                }
                break;
              // All other quantitative channels
              default:
                // Default scale
                console.log(
                  "ranges-channel",
                  ranges[channel],
                  "channel",
                  channel,
                  "ranges",
                  ranges
                );
                scale = d3
                  .scaleLinear()
                  .domain(domains[channel])
                  .range(ranges[channel]);

                // Nice the scale
                if (encoding[channel]!.scale?.nice === true) {
                  scale = scale.nice();
                }
                break;
            }

            break;
          case "nominal":
          // TODO: Move default case here once ordinal and temporal scales are defined
          case "ordinal":
          // TODO: Add ordinal scales
          case "temporal":
          // TODO: Add temporal scales
          default:
            // Set padding inner and outer
            // Padding outer acts as padding for scalePoint
            const paddingInner = encoding[channel].scale.paddingInner;
            const paddingOuter = encoding[channel].scale.paddingOuter;

            // Get type of mark
            let markType =
              typeof view.mark !== "string"
                ? view.mark!.type
                : defaults.mark.defaultType;

            switch (channel) {
              case "x":
              case "y":
              case "z":
                switch (markType) {
                  case "bar":
                    scale = d3
                      .scaleBand()
                      .domain(domains[channel])
                      .paddingInner(paddingInner)
                      .paddingOuter(paddingOuter)
                      .range(ranges[channel]);
                    break;
                  case "point":
                    scale = d3
                      .scalePoint()
                      .domain(domains[channel])
                      .padding(paddingOuter)
                      .range(ranges[channel]);
                    break;
                  default:
                    break;
                }
                break;
              case "color":
                let scheme = encoding[channel]?.scale?.scheme;
                if (scheme !== undefined) {
                  if (typeof scheme === "string") {
                    // Scheme is a string
                    scale = d3
                      .scaleOrdinal()
                      .domain(domains[channel])
                      .range(d3[scheme]);
                  } else {
                    // Scheme is an array
                    scale = d3
                      .scaleOrdinal()
                      .domain(domains[channel])
                      .range(ranges[channel]);
                  }
                }
                break;
              case "shape":
                scale = d3
                  .scaleOrdinal()
                  .domain(domains[channel])
                  .range(ranges[channel]);
                break;
              default:
                scale = d3
                  .scaleOrdinal()
                  .domain(domains[channel])
                  .range(ranges[channel]);
                break;
            }
            break;
        }
      }
      scales[channel] = scale;
    });
    return scales;
  }
};

export default createScales;
