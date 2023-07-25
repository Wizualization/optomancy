import { parseConfig } from "./grammar";
import { IDatasets } from "./grammar/parseDatasets";
import { ConfigType, RootType, ScalesType } from "./types";
import * as d3 from "d3";

export class Optomancy {
  userConfig: ConfigType;
  datasets: IDatasets;
  config: RootType;
  scales: ScalesType;

  constructor(userConfig: ConfigType) {
    window.d3 = d3;
    console.log("\n*_.-'Optomancy Started'-._*\n\n");
    console.log(`Started at: ${new Date()}`);
    this.userConfig = userConfig;
    const { datasets, config, scales } = parseConfig(this.userConfig);
    this.datasets = datasets;
    this.config = config;
    this.scales = scales;
  }
}

// Optomancy Config Types
export * as Config from "./types/ConfigType";
export * as Root from "./types/RootType";
export * as Workspace from "./types/WorkspaceType";
export * as Data from "./types/DataType";
export * as View from "./types/ViewType";
export * as Layer from "./types/LayerType";
export * as Axis from "./types/AxisType";
export * as Channel from "./types/ChannelType";
export * as Encoding from "./types/EncodingType";
export * as Legend from "./types/LegendType";
export * as Mark from "./types/MarkType";
export * as Scale from "./types/ScaleType";
export * as Tooltip from "./types/TooltipType";
export * as Transform from "./types/TransformType";
