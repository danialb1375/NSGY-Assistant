registerCalculator({
  id: "modified-fisher",
  icon: "≈",
  title: "Modified Fisher Scale",
  short: "Modified Fisher",
  description:
    "Grades subarachnoid and intraventricular blood on CT after SAH. It helps communicate hemorrhage burden and estimate relative risk of symptomatic vasospasm.",
  workflows: ["asah"],
  fields: [
    {
      key: "sah",
      label: "Subarachnoid blood",
      type: "options",
      default: "none",
      options: [
        { label: "None", value: "none", score: "0" },
        { label: "Thin", value: "thin", score: "≤1 mm" },
        { label: "Thick", value: "thick", score: ">1 mm" },
      ],
    },
    {
      key: "ivh",
      label: "Intraventricular hemorrhage",
      type: "options",
      default: 0,
      options: [
        { label: "Absent", value: 0, score: "No IVH" },
        { label: "Present", value: 1, score: "IVH" },
      ],
    },
  ],
  calculate(v) {
    const grade =
        v.sah === "none"
          ? +v.ivh
            ? 2
            : 0
          : v.sah === "thin"
            ? +v.ivh
              ? 2
              : 1
            : +v.ivh
              ? 4
              : 3,
      risk = [
        "Reference group (no SAH or IVH)",
        "Lower relative risk",
        "About 1.6× the crude odds of symptomatic vasospasm versus grades 0–1",
        "About 1.6× the crude odds of symptomatic vasospasm versus grades 0–1",
        "About 2.2× the crude odds of symptomatic vasospasm versus grades 0–1",
      ][grade];

    return {
      score: grade,
      label: `Modified Fisher Grade ${grade}`,
      interpretation: risk + " in the original validation cohort.",
      details: [
        "Uses cisternal SAH thickness and presence of IVH on admission CT.",
        "Commonly used to stratify risk for symptomatic vasospasm/delayed cerebral ischemia surveillance.",
      ],
      note: "It estimates group risk and does not diagnose vasospasm or DCI; clinical examination and institutional monitoring protocols remain essential.",
    };
  },
});
