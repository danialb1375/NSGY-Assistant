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
      step: 0.1,
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
    const g = +v.gcs,
      age = +v.age,
      vol = +v.volume;

    let score =
      (g >= 3 && g <= 4 ? 2 : g >= 5 && g <= 12 ? 1 : 0) +
      (age >= 80 ? 1 : 0) +
      (vol >= 30 ? 1 : 0) +
      (+v.ivh || 0) +
      (+v.infra || 0);

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
      score: g && age !== 0 ? score : "—",
      label: "ICH Score · range 0–6",
      interpretation: g
        ? `Approximate 30-day mortality in the original derivation cohort: ${mortality}.`
        : "Enter GCS and age. GCS and volume import automatically when calculated first.",
      details: g
        ? [
            `GCS ${g}: ${g <= 4 ? 2 : g <= 12 ? 1 : 0} point(s)`,
            `Age ${age}: ${age >= 80 ? 1 : 0} point`,
            `Volume ${vol || 0} mL: ${vol >= 30 ? 1 : 0} point`,
            `IVH: ${+v.ivh ? 1 : 0} point · Infratentorial: ${+v.infra ? 1 : 0} point`,
            "Used for standardized baseline severity and population-level risk stratification.",
          ]
        : [],
      note: "Mortality figures are historical population estimates—not an individual prognosis. Do not use the ICH Score alone to limit treatment or life-sustaining care.",
    };
  },
});
