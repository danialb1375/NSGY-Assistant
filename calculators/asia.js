import { registerCalculator } from "./core.js";

registerCalculator({
  id: "asia",
  icon: "✦",
  title: "ASIA Impairment Scale",
  short: "ASIA",
  description:
    "Classifies spinal cord injury completeness using sensory, motor, and sacral-sparing findings. It standardizes neurological documentation and communicates injury severity over time.",
  workflows: ["spine-trauma", "cauda-equina", "spine-postop"],
  fields: [
    {
      key: "normal",
      label: "Are sensory and motor findings normal in all segments?",
      type: "options",
      default: 0,
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      key: "s4sensory",
      label:
        "S4–5 sensory sparing (light touch, pin prick, or deep anal pressure)",
      type: "options",
      default: 0,
      options: [
        { label: "Absent", value: 0 },
        { label: "Present", value: 1 },
      ],
    },
    {
      key: "vac",
      label: "Voluntary anal contraction",
      type: "options",
      default: 0,
      options: [
        { label: "Absent", value: 0 },
        { label: "Present", value: 1 },
      ],
    },
    {
      key: "motor3",
      label:
        "Motor function preserved more than 3 levels below the motor level on either side",
      type: "options",
      default: 0,
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
    {
      key: "half",
      label: "At least half of key muscles below the NLI have grade ≥3",
      type: "options",
      default: 0,
      options: [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
      ],
    },
  ],
  calculate(v) {
    let grade, interpretation;

    if (+v.normal) {
      grade = "E";
      interpretation =
        "Normal sensory and motor examination after a prior SCI deficit.";
    } else if (!+v.s4sensory && !+v.vac) {
      grade = "A";
      interpretation =
        "Complete: no sensory or motor function preserved in S4–5.";
    } else if (!+v.vac && !+v.motor3) {
      grade = "B";
      interpretation =
        "Sensory incomplete: sacral sensory sparing without qualifying motor sparing.";
    } else if (+v.half) {
      grade = "D";
      interpretation =
        "Motor incomplete: at least half of key muscles below the NLI have strength grade ≥3.";
    } else {
      grade = "C";
      interpretation =
        "Motor incomplete: more than half of key muscles below the NLI have strength grade <3.";
    }

    return {
      score: grade,
      label: `AIS ${grade}`,
      interpretation,
      details: [
        "A · complete",
        "B · sensory incomplete",
        "C · motor incomplete; >50% of key muscles below NLI are <3",
        "D · motor incomplete; ≥50% of key muscles below NLI are ≥3",
        "E · normal after prior deficit",
      ],
      note: "A valid AIS grade requires the complete ISNCSCI examination, accurate sensory/motor levels, sacral testing, and handling of non-testable findings. This focused tool is a bedside aid, not a replacement for the official worksheet.",
    };
  },
});
