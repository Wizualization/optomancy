import Optomancy from "../optomancy";

// Clear the list of casted spells
function clearCasts(this: Optomancy) {
  this.config.castList = [];
}

export default clearCasts;
