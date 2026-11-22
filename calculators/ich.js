import { registerCalculator, CALC_CONTEXT } from "./core.js";
import { calculateICHScore } from "./ich_math.js";

//Function logic
function toNumberOrNaN(value) {
  if (value === "" || value === null || value === undefined) {
    return NaN;
  }

  return Number(value);
};

function toBooleanOrNull(value) {
  if (value === 1 || value === "1" || value === true) {
    return true;
  }

  if (value === 0 || value === "0" || value === false) {
    return false;
  }

  return null;
}

registerCalculator({
  id: "ich",
  icon: "●",
  title: "ICH Score",
  short: "ICH Score",
  description:
    "Grades baseline intracerebral hemorrhage severity using GCS, age, volume, IVH, and origin. It supports standardized communication and risk stratification; it should not be used alone to limit treatment.",
  workflows: ["ich-spontaneous"],
  fields: [
    {
      key: "gcs",
      label: "Glasgow Coma Scale",
      type: "number",
      min: 3,
      max: 15,
      placeholder: "3–15",
    },
    {
      key: "age",
      label: "Age",
      unit: "years",
      type: "number",
      min: 0,
      max: 120,
      placeholder: "0",
    },
    {
      key: "volume",
      label: "ICH volume",
      unit: "mL",
      type: "number",
      step: 0.5,
      placeholder: "0.0",
    },
    {
      key: "ivh",
      label: "Intraventricular hemorrhage",
      type: "options",
      default: 0,
      options: [
        { label: "Absent", value: 0, score: "0" },
        { label: "Present", value: 1, score: "+1" },
      ],
    },
    {
      key: "infra",
      label: "Infratentorial origin",
      type: "options",
      default: 0,
      options: [
        { label: "No", value: 0, score: "0" },
        { label: "Yes", value: 1, score: "+1" },
      ],
    },
  ],
  hydrate(v) {
    if (!v.gcs && CALC_CONTEXT.gcs) v.gcs = CALC_CONTEXT.gcs;
    if (!v.volume && CALC_CONTEXT.volume)
      v.volume = CALC_CONTEXT.volume.toFixed(1);
  },
  
  calculate(v) {
    const age = toNumberOrNaN(v.age);
    const gcs = toNumberOrNaN(v.gcs);
    const vol = toNumberOrNaN(v.volume);

    const result = calculateICHScore(
      age,
      gcs,
      vol,
      toBooleanOrNull(v.ivh),
      toBooleanOrNull(v.infra),
    );

    const score = result?.score;

    let mortality = {
      0: "0%",
      1: "13%",
      2: "26%",
      3: "72%",
      4: "97%",
      5: "100%",
      6: "not estimated",
    }[score];

    return {
      score: result ? result.score : "—",
      label: "ICH Score · range 0–6",
      interpretation: result 
        ? `Approximate 30-day mortality in the original derivation cohort: ${mortality}.`
        : "Enter GCS and age. GCS and volume import automatically when calculated first.",
      details: result 
        ? [
            `GCS ${gcs}: ${result.components.gcs} point(s)`,
            `Age ${age}: ${result.components.age} point`,
            `Volume ${vol} mL: ${result.components.volume} point`,
            `IVH: ${result.components.ivh} point · Infratentorial: ${result.components.infratentorial} point`,
            "Used for standardized baseline severity and population-level risk stratification.",
          ]
        : [],
      note: "Mortality figures are historical population estimates—not an individual prognosis. Do not use the ICH Score alone to limit treatment or life-sustaining care.",
    };
  },
});
