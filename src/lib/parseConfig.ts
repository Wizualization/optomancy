import parseDataset from "./parseDataset";
import { OptomancyConfigType } from "../optomancy";

const defaultConfig = {
  data: [],
  spec: {
    title: "Untitled",
  },
  castList: [],
};

function parseConfig(config: OptomancyConfigType) {
  let dataset = parseDataset(config);

  // Config initialisation
  // if(!config?.spec) {
  //   config.spec = { ...defaultConfig.spec }
  //   if(!config?.spec?.views) {

  //   }
  // }

  return {
    userConfig: { ...config },
    ...defaultConfig,
    ...config,
    ...dataset,
  };
}

export default parseConfig;
