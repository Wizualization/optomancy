import Optomancy from "../optomancy";

// Get the list of casted spells
function getCastList(this: Optomancy) {
  return this.config.castList!;
}

export default getCastList;
