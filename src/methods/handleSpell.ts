import * as d3 from "d3";
import { MarkType, Optomancy, SpellType } from "../optomancy";

const CHART_WIDTH = 0.5;
const CHART_HEIGHT = 0.5;
const CHART_DEPTH = 0.5;

// Handle a cast spell
function handleSpell(this: Optomancy, spell: SpellType) {
  // Spell is recognised
  this.config.castList!.push(spell);

  switch (spell.type) {
    /******************** GEOM ********************/
    // Line
    case "line":
      console.log("It's a line!");
      setMark(this, "line");
      break;

    // Point
    case "point":
      console.log("It's a point!");
      setMark(this, "point");
      break;

    // Column or bar
    case "column":
    case "bar":
      console.log("It's a bar!");
      setMark(this, "bar");
      break;

    /******************** SPATIAL ********************/
    // x
    case "x":
      console.log("It's an X!");
      setEncoding(this, "x", spell.operands);
      break;

    // y
    case "y":
      console.log("It's a Y!");
      setEncoding(this, "y", spell.operands);
      break;

    // z
    case "z":
      console.log("It's a Z!");
      setEncoding(this, "z", spell.operands);
      break;

    /******************** VISUAL ********************/
    // Color
    case "color":
      console.log("It's a color!");
      setEncoding(this, "color", spell.operands);
      break;

    // Size
    case "size":
      console.log("It's a size!");
      setEncoding(this, "size", spell.operands);
      break;

    // Default:
    default:
      console.error(`Unknown spell passed to spell handler: ${spell.type}`);
      break;
  }

  const domains = getDomains(this);
  const ranges = getRanges(this);
  const scales = getScales(this, domains!.domains, ranges);

  this.propsExport.scales = scales;

  // console.log("DOMAINS:", domains);
  // console.log("RANGES:", ranges);
  // console.log("SCALES:", scales);
}

function setMark(optomancy: Optomancy, markType: MarkType) {
  let markString;
  if (typeof markType === "string") {
    markString = markType;
    optomancy.propsExport.mark = { type: markType };
  } else {
    markString = markType.type;
    optomancy.propsExport.mark = markType;
  }
  optomancy.config.spec.mark = markString;
}

function setEncoding(optomancy: Optomancy, encodingType: any, operands: any) {
  if (!optomancy.propsExport.encoding) {
    optomancy.propsExport.encoding = {};
  }
  if (!optomancy.config.spec.encoding) {
    optomancy.config.spec.encoding = {};
  }
  optomancy.propsExport.encoding[encodingType] = operands;
  optomancy.config.spec.encoding[encodingType] = operands;
}

// Domains
function getDomains(optomancy: Optomancy) {
  if (optomancy.propsExport?.encoding) {
    let { encoding } = optomancy.propsExport;
    let domains = {};
    let domainsWithFields = {};
    let channelFields = {};
    Object.keys(encoding).forEach((channel) => {
      let domain;
      if (
        optomancy?.config?.data &&
        typeof optomancy.config.data !== "string"
      ) {
        const values = optomancy.config.data.map(
          (row: any) => row[encoding[channel].field]
        );

        switch (encoding[channel].type) {
          case "continuous":
            // FIXME:
            domain = [0, d3.max(values)];
            // domain = [0, d3.extent(values)];
            break;
          case "categorical":
            domain = [...Array.from(new Set(values))];
            // domain = [...new Set(values)]; // <- Errors with TS
            break;
          default:
            break;
        }
      }
      domains[channel] = domain;
      domainsWithFields[encoding[channel].field] = domain;
      channelFields[channel] = encoding[channel].field;
    });
    return { domains, domainsWithFields, channelFields };
  }
}

// Ranges
function getRanges(optomancy: Optomancy) {
  if (optomancy.propsExport?.encoding) {
    let { encoding } = optomancy.propsExport;
    let ranges = {};
    Object.keys(encoding).forEach((channel) => {
      let range;

      switch (channel) {
        case "x":
          range = [0, CHART_WIDTH];
          break;
        case "y":
          range = [0, CHART_HEIGHT];
          break;
        case "z":
          range = [0, CHART_DEPTH];
          break;
        case "color":
          // FIXME:
          range = "schemeSet1";
          break;
        case "size":
          range = [0, 0.2];
          break;
        default:
          break;
      }
      ranges[channel] = range;
    });
    return ranges;
  }
}

// Scales
function getScales(optomancy: Optomancy, domains: any, ranges: any) {
  if (optomancy.propsExport?.encoding) {
    let { encoding } = optomancy.propsExport;
    let scales = {};
    Object.keys(encoding).forEach((channel) => {
      let scale;
      switch (encoding[channel].type) {
        case "continuous":
          switch (channel) {
            case "color":
              scale = d3
                .scaleSequential()
                .domain(domains[channel])
                .interpolator(d3.interpolateBlues);
              break;
            default:
              scale = d3
                .scaleLinear()
                .domain(domains[channel])
                .range(ranges[channel]);
              break;
          }
          break;
        case "category":
        default:
          const paddingInner = 0.25;
          const paddingOuter = 0.25;

          switch (channel) {
            case "color":
              scale = d3
                .scaleOrdinal()
                .domain(domains[channel])
                .range(d3.schemeSet1);
              // FIXME:
              // .range(d3[ranges[channel]]);
              break;
            default:
              break;
          }
          break;
      }
      scales[channel] = scale;
    });
    return scales;
  }
}

export default handleSpell;
