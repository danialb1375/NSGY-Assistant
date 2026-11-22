export function calculateTLICS({ morph, plc, neuro, modifier }) {
  //Establish Valid scoring values
  const validPLCneuro = new Set([0, 2, 3]);
  const validModifier = new Set([0, 2]);

  const validMorph = Number.isInteger(morph) && morph >= 0 && morph <= 4;
  const validPLC = Number.isInteger(plc) && validPLCneuro.has(plc);
  const validNeuro = Number.isInteger(neuro) && validPLCneuro.has(neuro);
  const validMod = Number.isInteger(modifier) && validModifier.has(modifier);
  //Validate each input -- return null if invalid
  const validationRules = [
    [morph, validMorph],
    [plc, validPLC],
    [neuro, validNeuro],
    [modifier, validMod],
  ];
  const inputs = [morph, plc, neuro, modifier];

 //test against vallid matrix
  const allValid = validationRules.every(([value, allowed]) => allowed);

  //calculate the total score
	if (!allValid) {
		return null;
	};

  const score = inputs.reduce(
    (accumulator, current) => accumulator + current,
    0
  );

  //determine classification
  const meaning =
    score <= 3 ? "nonoperative" : score === 4 ? "borderline" : "operative";

  //return object of score and classification
  return {
    score,
    classification: meaning,
    morph,
    plc,
    neuro,
    modifier,
  };
}
