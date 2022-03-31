import Optomancy from "../optomancy";

// Undo the last casted spell
function unCast(this: Optomancy) {
  this.config.castList!.pop();
}

export default unCast;
