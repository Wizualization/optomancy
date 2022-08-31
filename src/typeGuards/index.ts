// Optomancy Type Guards

/*
  The isRootType and isWorkspaceType type guards can be used to
  differentiate between the 3 root config types:

  if(isRootType(config)) {
    // Root type config
  } else if(isWorkspaceType(config)) {
    // Workspace type config
  } else {
    // View type config
  }
*/
export { default as isRootType } from "./isRootType";
export { default as isWorkspaceType } from "./isWorkspaceType";
