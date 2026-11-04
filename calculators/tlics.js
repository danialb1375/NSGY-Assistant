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
    const total = +v.morph + +v.plc + +v.neuro + +v.modifier,
      meaning =
        total <= 3
          ? "Usually managed non-operatively."
          : total === 4
            ? "Borderline; operative or non-operative treatment is individualized."
            : "Operative management is generally recommended.";

    return {
      score: total,
      label: "TLICS total",
      interpretation: meaning,
      details: [
        `Morphology ${+v.morph} · PLC ${+v.plc} · Neurologic status ${+v.neuro} · Compression modifier ${+v.modifier}`,
        "Used to structure thoracolumbar injury assessment and support treatment discussion.",
      ],
      note: "TLICS complements—not replaces—the complete examination, imaging review, patient factors, and spine-surgeon judgment.",
    };
  },
});
