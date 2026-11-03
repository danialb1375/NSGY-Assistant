registerCalculator({
  id: "gcs",
  icon: "◉",
  title: "Glasgow Coma Scale",
  short: "GCS",
  description:
    "Assesses level of consciousness using eye opening, verbal response, and motor response. Used in head trauma, hemorrhage, and critical care to quantify and trend neurological status.",
  workflows: [
    "ich-spontaneous",
    "traumatic-bleed",
    "postop-cranial",
    "seizure",
  ],
  fields: [
    {
      key: "eye",
      label: "Eye opening",
      type: "options",
      default: 4,
      options: [
        { label: "Spontaneous", value: 4 },
        { label: "To sound", value: 3 },
        { label: "To pressure", value: 2 },
        { label: "None", value: 1 },
      ],
    },
    {
      key: "verbal",
      label: "Verbal response",
      type: "options",
      default: 5,
      options: [
        { label: "Orientated", value: 5 },
        { label: "Confused", value: 4 },
        { label: "Words", value: 3 },
        { label: "Sounds", value: 2 },
        { label: "None", value: 1 },
      ],
    },
    {
      key: "motor",
      label: "Best motor response",
      type: "options",
      default: 6,
      options: [
        { label: "Obeys commands", value: 6 },
        { label: "Localising", value: 5 },
        { label: "Normal flexion", value: 4 },
        { label: "Abnormal flexion", value: 3 },
        { label: "Extension", value: 2 },
        { label: "None", value: 1 },
      ],
    },
  ],
  calculate(v) {
    const e = +v.eye,
      m = +v.motor,
      verbal = +v.verbal,
      total = e + verbal + m,
      severity = total >= 13 ? "Mild" : total >= 9 ? "Moderate" : "Severe";

    CALC_CONTEXT.gcs = total;

    return {
      score: total,
      label: `E${e} V${verbal} M${m}`,
      interpretation: `${severity} impairment range.`,
      details: [
        `Eye ${e} · Verbal ${verbal} · Motor ${m}`,
        "Used to quantify and trend consciousness in trauma, hemorrhage, and critical illness.",
      ],
      note: "Report components as well as the total. Intubation, sedation, paralysis, language barriers, and local injury can make a component non-testable and limit interpretation.",
    };
  },
});
