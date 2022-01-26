// ioConnected.ts
import { Action, State } from '../Types';

const workspaceUpdate = (state: State, action: Action) => {
  console.log('action.workspaceUpdate: Updated workspace in VSCode');
  return {
    ...state, 
    workspaces: {
      ...state.workspaces,
      [action.payload.filename]: action.payload
    }
  };
};

export default workspaceUpdate;