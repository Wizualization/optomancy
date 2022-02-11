// ioConnected.ts
import { Action, State } from '../Types';

const spellUpdate = (state: State, action: Action) => {
  console.log('action.spellUpdate: Updated spell in VSCode');
  return {
    ...state, 
    spells: {
      ...state.spells,
      [action.payload.spellname]: action.payload
    }
  };
};

export default spellUpdate;