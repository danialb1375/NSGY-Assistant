import { registerCalculator, CALC_CONTEXT } from "./core.js";
import { calculateGCS } from "./gcs_math.js";

registerCalculator(
  {
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
      key: "intubated",
      label: "Intubated?",
      type: "options",
      default: "no",
      options: [
        { label: "Not intubated", value: "no" },
        { label: "Intubated", value: "yes" },
      ],
    },
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
    const eyes = Number(v.eye);
    const verbal = Number(v.verbal);
    const motor = Number(v.motor);
    const intubated = v.intubated === "yes";
    
    const result = calculateGCS(eyes, verbal, motor, intubated);

    if (result === null) {
      CALC_CONTEXT.gcs = null;

      return {
        score: "—",
        label: "Enter valid GCS components",
        interpretation: "Unable to calculate GCS.",
        details: [],
        note: "Verify the eye, verbal, and motor responses.",
          }
    }

    const severity = 
      result.total >= 13 ? "Mild" : result.total >= 9 ? "Moderate" : "Severe";

    const verbalDisplay = result.intubated ? `${result.components.verbal}T` : `${result.components.verbal}`

    CALC_CONTEXT.gcs = result.total;

    return {
      score: result.display,
      label: `E${result.components.eye} V${verbalDisplay} M${result.components.motor}`,
      interpretation: `${severity} impairment range.`,
      details: [
        `Eye ${eyes} · Verbal ${verbalDisplay} · Motor ${motor}`,
        "Used to quantify and trend consciousness in trauma, hemorrhage, and critical illness.",
      ],
      note: "Report components as well as the total. Intubation, sedation, paralysis, language barriers, and local injury can make a component non-testable and limit interpretation. For intubated patients, V1T is a reporting convention representing an untestable verbal response. The substituted total should not be interpreted as a fully assessed GCS."
    };
  },
});
