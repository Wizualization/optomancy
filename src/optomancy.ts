// TODO:
// - Break out methods
//
// - Consume data and infer data types                        [y]
// - - Export list of field names and inferred data types     [y]
// - Create spell functions to build up full spec including:
// - - Mark Type (geom)
// - - Scales (scales)
// - - - x?, y?, z?
// - - Mark positions (geomPositions)
// - - Guide positions?
// - - Labels / headings?
// - - Legends??
// - Export props for renderer
// - - Mark type
// - - Scales
// - - Guides
// - - Mark positions
// - -
// - Export compressed spec

// NOTE: PRIVATE METHODS
// - We do not use private methods, because that prevents us from calling them from external files
// - Private methods are denoted with an undersctore (_).

// NOTE: GETTERS AND SETTERS
// - We do not use getters and setters, because that prevents us from calling them from external files

import { parseConfig, parseDataset } from "./lib";
import {
  cast,
  handleSpell,
  getCastList,
  setCastList,
  unCast,
  clearCastList,
  data,
} from "./methods";

// The resulting spell object shape for:
// - Spell handler
// - Cast list
export type SpellType = {
  type: string;
  operands?: any[];
};

// Accepted shapes of cast spells and operands
export type SpellCastType = string | string[];
// export type SpellOperandType = any[] | any[][]; // FIXME:
export type SpellOperandType = any;

// Optomancy constructor parameter type
// export type DataType = any[] | string;
export type DataType = any;
export type OptomancyConfigType = {
  data?: DataType;
  spec?: any;
  castList?: SpellType[];
};

// Optomancy export props type for renderer
// Encoding type
export type MarkType = { type: string } | string;
export type OptomancyExportEncodingType = {
  fieldName?: string;
  scale?: any; // FIXME: Type this!
};
// Encodings type
export type OptomancyExportEncodingsType = {
  x?: OptomancyExportEncodingType;
  y?: OptomancyExportEncodingType;
  z?: OptomancyExportEncodingType;
  color?: OptomancyExportEncodingType;
  size?: OptomancyExportEncodingType;
};
// View type
export type OptomancyExportViewType = {
  title?: string;
  encoding?: OptomancyExportEncodingsType[];
};
// Props export type
export type OptomancyExportPropsType = {
  title?: string;
  views?: OptomancyExportViewType[];
  mark?: MarkType;
  encoding?: OptomancyExportEncodingsType;
  scales?: any; // FIXME: Type this!
};

// Grammar of Graphics for Wizualization
export class Optomancy {
  config: OptomancyConfigType;
  propsExport: OptomancyExportPropsType = {};

  constructor(config: OptomancyConfigType) {
    console.log("*_.-'Optomancy Started'-._*");

    // TODO: Implement config parser
    // - Takes a config and populates it with defaults
    // - Removes need to have optional properties in type
    this.config = parseConfig(config);
  }

  // Sets the dataset
  public data = data;

  // *_.-' Spell Casting '-._*

  // Get the list of casted spells
  public getCastList = getCastList;

  // Manually set a list of casted spells
  // - Must use full spell type object array definition
  public setCastList = setCastList;

  // Cast a spell or spells
  // - Each spell definition has a spell type (string) and an optional an array of operands
  // - Multiple spells can be cast at once using an array of spell types and an array of operands
  public cast = cast;

  // Undo the last casted spell
  public unCast = unCast;

  // Clear the list of casted spells
  public clearCastList = clearCastList;

  // Handle a cast spell
  _handleSpell = handleSpell;
}

export default Optomancy;
