import { EncodingType, ViewType } from "../types";

interface IRanges {
  [string: string]: number[];
}

/**
 * @name getRanges
 * @description Get the ranges of each encoding channel from each view
 * @param view Calculate range for each encoding channel
 * @param dataset Dataset to get ranges from
 * @return {array} Array of range objects
 */
const getRanges = (view: ViewType, dataset: any[]): IRanges | IRanges[] => {
  if (view?.encoding !== undefined) {
    // This view doesn't have any layers so only has a single encoding object
    return getRangesFromEncoding(view.encoding, dataset);
  } else if (view?.layer !== undefined) {
    // This view has layers, like onions, and ogres.
    // It has multiple encoding objects, one per layer, up to n layers.
    const viewRanges: IRanges[] = [];
    view.layer.forEach((layer) => {
      viewRanges.push(getRangesFromEncoding(layer.encoding, dataset));
    });
    return viewRanges;
  } else {
    // FIXME: Return error:
    // Encoding is undefined
    return [];
  }

  function getRangesFromEncoding(
    encoding: EncodingType,
    dataset: any[]
  ): IRanges {
    const ranges = {};
    Object.keys(encoding).forEach((channel) => {
      let range: number[];

      switch (channel) {
      }
    });
    return ranges;
  }
};

export default getRanges;
