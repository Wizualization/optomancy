import { SPELL_PRIMITIVES } from "../constants";
import { Optomancy, SpellCastType, SpellOperandType } from "../optomancy";

// Cast a spell or spells
// - Each spell definition has a spell type (string) and an optional an array of operands
// - Multiple spells can be cast at once using an array of spell types and an array of operands
function cast(
  this: Optomancy,
  spells: SpellCastType,
  operands?: SpellOperandType
) {
  // If one spell is cast, add it to an array for iteration
  if (typeof spells === "string") {
    spells = [spells];
    // Also mutate the operands array into a 2D array, if it exists
    // - This is safe to assume because only one spell has been cast
    if (operands) operands = [operands];
    console.log(operands, spells);
  }

  // Iterate over each recognised spell
  spells.forEach((spell, i) => {
    // Check this is a valid spell...
    if (SPELL_PRIMITIVES.includes(spell)) {
      let spellObj = {
        type: spell,
        ...(operands && { operands: operands[i] }),
      };
      console.log(spellObj);
      // Send this spell to the spell handler.
      this._handleSpell(spellObj);
    } else {
      // Spell is not recognised, do nothing.
      console.error(`Spell not recognised: ${spell}`);
    }
  });
}

export default cast;
