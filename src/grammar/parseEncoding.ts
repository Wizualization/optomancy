// parseEncoding.ts

import { ViewType } from "../types";

interface IEncoding {
  [string: string]: any[];
}

/**
 * @name parseEncoding
 * @description Retrieves and parses encodings from a view
 * @param view An Optomancy view object
 * @returns An object containing all encodings associated with this view
 */
const parseEncoding = (view: ViewType): IEncoding => {
  // Encodings storage object
  const encoding: IEncoding = {};

  return encoding;
};
