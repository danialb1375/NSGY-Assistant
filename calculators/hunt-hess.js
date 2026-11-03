registerCalculator({
  id: "hunt-hess",
  icon: "≈",
  title: "Hunt–Hess Grade",
  short: "Hunt–Hess",
  description:
    "Classifies clinical severity after aneurysmal subarachnoid hemorrhage. It is used at presentation to communicate neurological condition and broadly stratify prognosis.",
  workflows: ["asah"],
  fields: [
    {
      key: "grade",
      label: "Best clinical description",
      type: "options",
      default: 1,
      options: [
        {
          label: "Asymptomatic, mild headache, slight nuchal rigidity",
          value: 1,
          score: "I",
        },
        {
          label:
            "Moderate–severe headache, nuchal rigidity; no deficit except cranial nerve palsy",
          value: 2,
          score: "II",
        },
        {
          label: "Drowsiness or confusion; mild focal deficit",
          value: 3,
          score: "III",
        },
        {
          label:
            "Stupor; moderate–severe hemiparesis; early decerebration or autonomic disturbance",
          value: 4,
          score: "IV",
        },
        {
          label: "Deep coma; decerebrate rigidity; moribund",
          value: 5,
          score: "V",
        },
      ],
    },
    {
      key: "systemic",
      label: "Serious systemic disease or severe vasospasm",
      type: "options",
      default: 0,
      options: [
        { label: "Absent", value: 0, score: "No change" },
        { label: "Present", value: 1, score: "Advance 1 grade" },
      ],
    },
  ],
  calculate(v) {
    const n = Math.min(5, +v.grade + (+v.systemic || 0)),
      roman = ["", "I", "II", "III", "IV", "V"][n],
      meaning = [
        "",
        "Asymptomatic or mild headache/slight nuchal rigidity.",
        "Moderate–severe headache and nuchal rigidity without deficit other than cranial nerve palsy.",
        "Drowsiness/confusion or mild focal deficit.",
        "Stupor with moderate–severe hemiparesis or early decerebration.",
        "Deep coma, decerebrate rigidity, or moribund state.",
      ][n];

    return {
      score: roman,
      label: `Hunt–Hess Grade ${roman}`,
      interpretation: meaning,
      details: [
        "Higher grades indicate greater neurological severity and are associated with worse population outcomes.",
        "Used to communicate clinical condition at presentation in aneurysmal SAH.",
      ],
      note: "Sedation, hydrocephalus, seizures, metabolic disturbance, and inter-rater variability can confound the grade.",
    };
  },
});
