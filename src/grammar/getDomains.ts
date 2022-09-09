import * as d3 from "d3";
import { DomainType, EncodingType, ViewType } from "../types";

export interface IDomains {
  [string: string]: DomainType;
}

/**
 * @name getDomains
 * @description Get the domains of each encoding channel from each view
 * @param view Calculate domain for each encoding channel in this view
 * @param dataset The dataset corresponding to this view
 * @return {object | array} Domain object (or domain object array)
 */
const getDomains = (view: ViewType, dataset: any[]): IDomains | IDomains[] => {
  if (view?.encoding !== undefined) {
    // This view doesn't have any layers so only has a single encoding object
    return _getDomainsFromEncoding(view.encoding, dataset);
  } else if (view?.layer !== undefined) {
    // This view has layers, like onions, and ogres.
    // It has multiple encoding objects, one per layer, up to n layers.
    const viewDomains: IDomains[] = [];
    view.layer.forEach((layer) => {
      viewDomains.push(_getDomainsFromEncoding(layer.encoding, dataset));
    });
    return viewDomains;
  } else {
    // FIXME: Return error:
    // Encoding is undefined
    return [];
  }

  /**
   * @name _getDomainsFromEncoding
   * @description Gets domains from an encoding object
   * @param encoding A view encoding object
   * @param dataset The dataset corresponding to this view
   * @returns An object or domain arrays
   */
  function _getDomainsFromEncoding(
    encoding: EncodingType,
    dataset: any[]
  ): IDomains {
    const domains = {};

    Object.keys(encoding).forEach((channel) => {
      let domain: DomainType = [];

      // If a domain is specified...
      if (encoding[channel].scale?.domain) {
        // ...use this domain
        domain = encoding[channel].scale.domain;
      } else if (encoding[channel].value) {
        // ...or use a value if specified
        domain = encoding[channel].value;
      } else {
        const values = dataset.map((row) => row[encoding[channel].field]);
        switch (encoding[channel].type) {
          case "quantitative":
            // Should the domain start from zero?
            if (encoding[channel].scale?.zero === true) {
              domain = [0, d3.max(values)];
            } else {
              domain = [...d3.extent(values)];
            }
            break;
          case "temporal":
          case "nominal":
          case "ordinal":
          default:
            // Reduce the dataset to a unique set of values
            // Hey! y u no spread?
            // - See: https://stackoverflow.com/a/20070691
            //   and: https://github.com/Microsoft/TypeScript/issues/8856
            domain = Array.from(new Set(values));
            break;
        }
        domains[channel] = domain;
      }
    });
    return domains;
  }
};

export default getDomains;
