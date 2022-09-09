import { defaults } from "./defaults";
import { EncodingType, RangeType, ViewType } from "../types";

export interface IRanges {
  [string: string]: RangeType;
}

/**
 * @name getRanges
 * @description Get the ranges of each encoding channel from each view
 * @param view Calculate range for each encoding channel in this view
 * @return {object | array} Range object (or range object array)
 */
const getRanges = (view: ViewType): IRanges | IRanges[] => {
  if (view?.encoding !== undefined) {
    // This view doesn't have any layers so only has a single encoding object
    return _getRangesFromEncoding(view.encoding);
  } else if (view?.layer !== undefined) {
    // This view has layers, like onions, and ogres.
    // It has multiple encoding objects, one per layer, up to n layers.
    const viewRanges: IRanges[] = [];
    view.layer.forEach((layer) => {
      viewRanges.push(_getRangesFromEncoding(layer.encoding));
    });
    return viewRanges;
  } else {
    // FIXME: Return error:
    // Encoding is undefined
    return [];
  }

  /**
   * @name _getRangesFromEncoding
   * @description Gets ranges from an encoding object
   * @param encoding A view encoding object
   * @returns An range object or range object array
   */
  function _getRangesFromEncoding(encoding: EncodingType): IRanges {
    const ranges = {};

    Object.keys(encoding).forEach((channel) => {
      let range: RangeType = [];

      // If a range is specified...
      if (encoding[channel].scale?.range) {
        // ...use this range
        range = encoding[channel].scale.range;
      } else {
        // If the range is not specified, do a lookup
        switch (channel) {
          case "x":
          case "width":
            range = [0, view.width ?? defaults.view.width];
            break;
          case "y":
          case "height":
            range = [0, view.height ?? defaults.view.height];
            break;
          case "z":
          case "depth":
            range = [0, view.depth ?? defaults.view.depth];
            break;
          case "opacity":
            range = [0, 1];
            break;
          case "size":
            range = defaults.range.size;
            break;
          case "length":
            range = defaults.range.length;
            break;
          case "color":
            range = defaults.range.color[encoding[channel]!.type!];
            break;
          case "shape":
            range = defaults.range.shape;
            break;
          case "xrot":
          case "yrot":
          case "zrot":
            range = defaults.range.rotation;
            break;
          case "xoffset":
          case "yoffset":
          case "zoffset":
            range = defaults.range.offset;
            break;
          default:
            // FIXME: Return error
            // Invalid encoding type
            break;
        }
        ranges[channel] = range;
      }
    });
    return ranges;
  }
};

export default getRanges;
