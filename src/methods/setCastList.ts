import Optomancy, { SpellType } from "../optomancy";

// Manually set a list of casted spells
// - Must use full spell type object array definition
function setCastList(this: Optomancy, castList: SpellType[]) {
  this.config.castList = castList;
}

export default setCastList;
