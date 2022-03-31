import * as d3 from "d3";
import { OptomancyConfigType } from "../optomancy";
import { SUPPORTED_DATA_FILE_TYPES } from "../constants";

function parseDataset(config: OptomancyConfigType) {
  // Field Names
  let fieldNames: string[] = [];
  let fieldTypes: any;

  // Extracted dataset
  let data: any = [];

  // Check data sources, either (or both):
  // - config.data      [Takes precedence]
  // - config.spec.data
  if (config?.data) {
    // Dataset supplied to config.data
    if (typeof config?.data === "string") {
      // Dataset is at a URL
      // TODO: Parse dataset with d3.csv, d3.tsv etc.
    } else {
      // Dataset is a JSON array
      // - Shallow copy
      data = [...config.data];
    }
  } else if (config?.spec?.data) {
    // Dataset supplied to config.spec.data
    if (typeof config?.spec?.data === "string") {
      // Dataset is at a URL
      // TODO: Parse dataset with d3.csv, d3.tsv etc.
    } else {
      // Dataset is a JSON array
      // - Shallow copy
      data = [...config.spec.data];
    }
  }

  // Check there's data here
  if (data[0]) {
    // Get an array of field names
    fieldNames = Object.keys(data[0]);
    // Naiively set field types
    // TODO: Infer data types more rigourously
    fieldTypes = Object.keys(data[0]).map((el: string) => {
      let datum = config.data![0][el];
      if (typeof datum === "string" || typeof datum === "boolean") {
        // Naiive categorical
        return { fieldName: el, fieldType: "categorical" };
      } else {
        // Naiive continuous
        return { fieldName: el, fieldType: "continuous" };
      }
    });
  }

  return { data, fieldNames, fieldTypes };
}

export default parseDataset;
