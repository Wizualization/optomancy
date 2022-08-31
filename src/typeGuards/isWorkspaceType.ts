import { ConfigType, WorkspaceType } from "../types";

/**
 * @name isWorkspaceType
 * @description Type guard to check if the config passed in is of type WorkspaceType
 * @param config An optomancy config
 * @returns {boolean}
 */
function isWorkspaceType(config: ConfigType): config is WorkspaceType {
  let key: keyof WorkspaceType = "views";
  return key in config;
}

export default isWorkspaceType;
