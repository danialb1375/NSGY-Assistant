import { registerCalculator } from "./core.js";
import { calculateTLICS } from "./tlics_math.js";
import { normalizeNumber } from "../utils.js";

//Register TLICS calculator and object
registerCalculator({
  id: "tlics",
  icon: "⌁",
  title: "TLICS",
  short: "TLICS",
  description:
    "Scores thoracolumbar injury morphology, posterior ligamentous complex integrity, and neurological status. It supports communication and guides operative versus non-operative consideration.",
  workflows: ["spine-trauma", "spine-postop"],
  fields: [
    {
      key: "morph",
      label: "Injury morphology",
      type: "options",
      default: 0,
      options: [
        { label: "No abnormality", value: 0 },
        { label: "Compression", value: 1 },
        { label: "Burst", value: 2 },
        { label: "Translation / rotation", value: 3 },
        { label: "Distraction", value: 4 },
      ],
    },
    {
      key: "plc",
      label: "Posterior ligamentous complex",
      type: "options",
      default: 0,
      options: [
        { label: "Intact", value: 0 },
        { label: "Suspected / indeterminate", value: 2 },
        { label: "Injured", value: 3 },
      ],
    },
    {
      key: "neuro",
      label: "Neurologic status",
      type: "options",
      default: 0,
      options: [
        { label: "Intact", value: 0 },
        { label: "Nerve root injury", value: 2 },
        { label: "Complete cord injury", value: 2 },
        { label: "Incomplete cord injury", value: 3 },
        { label: "Cauda equina syndrome", value: 3 },
      ],
    },
    {
      key: "modifier",
      label: "Ongoing cord compression with neurologic deficit",
      type: "options",
      default: 0,
      options: [
        { label: "Absent / not applicable", value: 0, score: "0" },
        { label: "Present", value: 2, score: "+2" },
      ],
    },
  ],
  calculate(v) {
    //Convert UI inputs into numerical values
    const inputs = Object.fromEntries(
      Object.entries(v).map(([key, value]) => [key, normalizeNumber(value)]),
    );

    //Call calculateTLICS
    const result = calculateTLICS(inputs);

    //Handle invalid (null) result
    if (!result) {
      return {
        score: "—",
        label: "TLICS total",
        interpretation: "Please provide valid scoring inputs.",
        details: [],
      };
    }
    //Translate classification into interpretation
    const interpretations = {
      nonoperative:
        "Managed non-operatively with bracing, pain control and activity modification",
      borderline:
        "Surgeon discretion - surgical treatment may be individualized",
      operative:
        "Operative management is recommended due to unstable fracture morphology",
    };

    const interpretation =
      interpretations[result.classification] ??
      "Unable to determine interpretation to provide recommendation";

    return {
      score: result.score,
      label: "TLICS total",
      interpretation,
      details: [
        `Morphology ${result.morph} · PLC ${result.plc} · Neurologic status ${result.neuro} · Compression modifier ${result.modifier}`,
        "Used to structure thoracolumbar injury assessment and support treatment discussion.",
      ],
      note: "TLICS complements—not replaces—the complete examination, imaging review, patient factors, and spine-surgeon judgment.",
    };
  },
});
