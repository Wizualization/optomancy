import { ConfigType, RootType } from "../types";

/**
 * @name isRootType
 * @description Type guard to check if the config passed in is of type RootType
 * @param config An optomancy config
 * @returns {boolean}
 */
function isRootType(config: ConfigType): config is RootType {
  let key: keyof RootType = "workspaces";
  return key in config;
}

export default isRootType;
