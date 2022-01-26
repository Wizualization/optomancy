// types/index.ts
import ioConnected from './ioConnected';
import workspaceUpdate from './WorkspaceUpdate';

export { default as actionTypes } from './ActionTypes';

const actions = {
  // Socket.io events
  ioConnected, // IO_CONNECTED
  workspaceUpdate, // WORKSPACE_UPDATE
};

export default actions;