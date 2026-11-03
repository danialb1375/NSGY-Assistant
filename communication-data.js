/* Data-driven communication fields. Draft clinical data remains memory-only. */
const COMM_FIELDS = {
  age: {
    label: "Age",
    placeholder: "74",
    group: "identity",
    type: "number",
  },
  sex: {
    label: "Sex",
    placeholder: "male",
    group: "identity",
    type: "select",
    options: ["Female", "Male", "Other"],
  },
  mechanism: {
    label: "Mechanism",
    placeholder: "ground-level fall",
    group: "context",
  },
  diagnosis: {
    label: "Diagnosis",
    placeholder: "acute SDH",
    group: "identity",
  },
  procedure: {
    label: "Procedure",
    placeholder: "right craniotomy",
    group: "identity",
  },
  pod: {
    label: "Post-operative Day",
    placeholder: "2",
    group: "context",
    type: "number",
  },
  symptoms: {
    label: "Symptoms",
    placeholder: "headache and confusion",
    group: "context",
  },
  exam: {
    label: "Neurologic Examination",
    placeholder: "awake, follows commands, no drift",
    group: "exam",
  },
  gcs: {
    label: "GCS",
    placeholder: "14",
    group: "exam",
    type: "number",
    min: 3,
    max: 15,
  },
  pupils: {
    label: "Pupils",
    placeholder: "Select pupil finding",
    group: "exam",
    type: "select",
    options: ["Equal and reactive", "Anisocoric", "Fixed", "Other"],
  },
  motor: {
    label: "Motor Strength",
    placeholder: "5/5 throughout",
    group: "exam",
  },
  sensory: {
    label: "Sensory Findings",
    placeholder: "intact to light touch",
    group: "exam",
  },
  cranial: {
    label: "Cranial Nerves",
    placeholder: "no new cranial nerve deficit",
    group: "exam",
  },
  imaging: {
    label: "Imaging Findings",
    placeholder: "acute right convexity SDH",
    group: "imaging",
  },
  thickness: {
    label: "Hematoma Thickness",
    placeholder: "12",
    group: "imaging",
    type: "number",
    unit: "mm",
  },
  shift: {
    label: "Midline Shift",
    placeholder: "6",
    group: "imaging",
    type: "number",
    unit: "mm",
  },
  volume: {
    label: "Hematoma Volume",
    placeholder: "32",
    group: "imaging",
    type: "number",
    unit: "mL",
  },
  hydrocephalus: {
    label: "Hydrocephalus",
    placeholder: "Select status",
    group: "imaging",
    type: "select",
    options: ["Present", "Absent", "New", "Worsening", "Stable"],
  },
  ivh: {
    label: "Intraventricular Hemorrhage",
    placeholder: "Select status",
    group: "imaging",
    type: "select",
    options: ["Present", "Absent", "New", "Worsening", "Stable"],
  },
  repeatct: {
    label: "Repeat CT Results",
    placeholder: "stable at 6 hours",
    group: "imaging",
  },
  bloodthinner: {
    // Note: Input cut off here in your snippet
  },
};
