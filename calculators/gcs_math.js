export function calculateGCS(eyes, verbal, motor, intubated = false) { //Validate inputs
  const valid_e = Number.isInteger(eyes) && eyes > 0 && eyes < 5;
  const valid_v = Number.isInteger(verbal) && verbal > 0 && verbal < 6;
  const valid_m = Number.isInteger(motor) && motor > 0 && motor < 7;
  //Determine verbal testable (i.e. intubated)

  let verbal_score = intubated ? 1 : verbal;

  // 2. Reject invalid inputs
  if (typeof intubated !== "boolean") {
    return null;
  }

  if (!valid_e || !valid_m || (!intubated && !valid_v)) {
    return null;
  }

  const total = eyes + verbal_score + motor;

  //generate display
  const display = intubated ? `${total}T` : `${total}`;
  //return result
  return {
    total: total,
    display: display,
    components: {
      eye: eyes,
      verbal: verbal_score,
      motor: motor,
    },
    intubated: intubated,
  };
}
