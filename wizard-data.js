/*
 * Smart Call Wizard configuration.
 * Add or edit nodes here; the navigation engine in app.js does not need changes.
 * A node either asks a question with choices, or routes to an existing content ID.
 */
const WIZARD_FLOWS = [
  {
    id: "ed",
    icon: "✚",
    title: "Emergency Department",
    subtitle: "Acute consults and transfers",
    start: "ed-problem",
    nodes: {
      "ed-problem": {
        question: "What is the problem?",
        eyebrow: "Emergency Department",
        choices: [
          { label: "Head Bleed", icon: "◉", next: "bleed-cause" },
          { label: "Spine", icon: "⌁", next: "spine-concern" },
          { label: "Shunt", icon: "⎋", target: "shunt" },
          { label: "Tumor", icon: "✣", target: "dex-taper" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          { label: "Other", icon: "…", target: "consult" },
        ],
      },
      "bleed-cause": {
        question: "What caused the bleed?",
        eyebrow: "Head Bleed",
        choices: [
          { label: "Traumatic", icon: "↯", next: "trauma-type" },
          { label: "Spontaneous", icon: "●", next: "spontaneous-type" },
        ],
      },
      "trauma-type": {
        question: "What type?",
        eyebrow: "Traumatic Head Bleed",
        choices: [
          {
            label: "SDH",
            icon: "S",
            target: "traumatic-bleed",
            focus: "Acute SDH",
          },
          {
            label: "EDH",
            icon: "E",
            target: "traumatic-bleed",
            focus: "Acute EDH",
          },
          { label: "tSAH", icon: "A", target: "traumatic-bleed" },
          { label: "Contusion", icon: "C", target: "traumatic-bleed" },
        ],
      },
      "spontaneous-type": {
        question: "What type?",
        eyebrow: "Spontaneous Head Bleed",
        choices: [
          { label: "ICH", icon: "I", target: "ich-spontaneous" },
          { label: "Aneurysmal SAH", icon: "A", target: "asah" },
        ],
      },
      "spine-concern": {
        question: "What is the concern?",
        eyebrow: "Spine",
        choices: [
          { label: "Trauma", icon: "↯", target: "spine-trauma" },
          { label: "Cauda Equina", icon: "!", target: "cauda-equina" },
          { label: "Epidural Abscess", icon: "●", target: "epidural-abscess" },
          { label: "Tumor", icon: "✣", target: "consult" },
          { label: "Post-op", icon: "✚", target: "spine-postop" },
          { label: "Degenerative", icon: "⌁", target: "consult" },
        ],
      },
    },
  },
  {
    id: "icu",
    icon: "⌁",
    title: "ICU",
    subtitle: "Critical care and drains",
    start: "icu-problem",
    nodes: {
      "icu-problem": {
        question: "What needs attention?",
        eyebrow: "ICU",
        choices: [
          { label: "EVD / ICP", icon: "↕", target: "evd" },
          { label: "Spontaneous ICH", icon: "I", target: "ich-spontaneous" },
          { label: "Traumatic Bleed", icon: "↯", target: "traumatic-bleed" },
          { label: "Aneurysmal SAH", icon: "A", target: "asah" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          { label: "New Change", icon: "!", target: "consult" },
        ],
      },
    },
  },
  {
    id: "floor",
    icon: "▤",
    title: "Floor Calls",
    subtitle: "Triage and overnight issues",
    start: "floor-problem",
    nodes: {
      "floor-problem": {
        question: "Why are they calling?",
        eyebrow: "Floor Call",
        choices: [
          { label: "Neuro Change", icon: "!", target: "floor" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          { label: "Shunt Concern", icon: "⎋", target: "shunt" },
          { label: "Steroid Question", icon: "Rx", target: "dex-taper" },
          { label: "Pain / Nausea", icon: "+", target: "floor" },
          { label: "Other", icon: "…", target: "floor" },
        ],
      },
    },
  },
  {
    id: "postop",
    icon: "✣",
    title: "Post-op Patient",
    subtitle: "Procedure-specific triage",
    start: "postop-procedure",
    nodes: {
      "postop-procedure": {
        question: "What was the procedure?",
        eyebrow: "Post-op Patient",
        choices: [
          { label: "ACDF", icon: "C", next: "spine-reason" },
          { label: "TLIF", icon: "T", next: "spine-reason" },
          { label: "PLIF", icon: "P", next: "spine-reason" },
          { label: "Craniotomy", icon: "C", next: "cranial-reason" },
          { label: "VP Shunt", icon: "S", next: "shunt-reason" },
          { label: "Craniectomy", icon: "C", next: "cranial-reason" },
          { label: "Other", icon: "…", next: "postop-other" },
        ],
      },
      "spine-reason": {
        question: "What is the reason for the call?",
        eyebrow: "Post-op Spine",
        choices: [
          { label: "New Deficit", icon: "!", target: "spine-postop" },
          { label: "Fever", icon: "●", target: "spine-postop" },
          { label: "Wound", icon: "✚", target: "spine-postop" },
          { label: "Drain", icon: "↕", target: "spine-postop" },
          { label: "Pain", icon: "+", target: "spine-postop" },
          { label: "Other", icon: "…", target: "spine-postop" },
        ],
      },
      "cranial-reason": {
        question: "What is the reason for the call?",
        eyebrow: "Post-op Cranial",
        choices: [
          { label: "New Deficit", icon: "!", target: "postop-cranial" },
          { label: "Fever", icon: "●", target: "postop-cranial" },
          { label: "Wound", icon: "✚", target: "postop-cranial" },
          { label: "Drain", icon: "↕", target: "postop-cranial" },
          { label: "Headache", icon: "+", target: "postop-cranial" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          {
            label: "Altered Mental Status",
            icon: "!",
            target: "postop-cranial",
          },
          { label: "Other", icon: "…", target: "postop-cranial" },
        ],
      },
      "shunt-reason": {
        question: "What is the reason for the call?",
        eyebrow: "Post-op VP Shunt",
        choices: [
          { label: "New Deficit", icon: "!", target: "shunt" },
          { label: "Fever", icon: "●", target: "shunt" },
          { label: "Wound", icon: "✚", target: "shunt" },
          { label: "Headache", icon: "+", target: "shunt" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          { label: "Altered Mental Status", icon: "!", target: "shunt" },
        ],
      },
      "postop-other": {
        question: "What is the reason for the call?",
        eyebrow: "Post-op Patient",
        choices: [
          { label: "New Deficit", icon: "!", target: "consult" },
          { label: "Fever", icon: "●", target: "consult" },
          { label: "Wound", icon: "✚", target: "consult" },
          { label: "Drain", icon: "↕", target: "consult" },
          { label: "Pain", icon: "+", target: "floor" },
          { label: "Seizure", icon: "⌁", target: "seizure" },
          { label: "Altered Mental Status", icon: "!", target: "consult" },
          { label: "Other", icon: "…", target: "consult" },
        ],
      },
    },
  },
  {
    id: "transfer",
    icon: "⇄",
    title: "Outside Hospital Transfer",
    subtitle: "Rapid acceptance workflow",
    start: "transfer-problem",
    nodes: {
      "transfer-problem": {
        question: "What are they transferring?",
        eyebrow: "Outside Hospital Transfer",
        choices: [
          { label: "Head Bleed", icon: "◉", next: "transfer-bleed" },
          { label: "Spine Trauma", icon: "↯", target: "spine-trauma" },
          { label: "Cauda Equina", icon: "!", target: "cauda-equina" },
          { label: "Epidural Abscess", icon: "●", target: "epidural-abscess" },
          { label: "Shunt", icon: "⎋", target: "shunt" },
          { label: "Other", icon: "…", target: "consult" },
        ],
      },
      "transfer-bleed": {
        question: "What type of bleed?",
        eyebrow: "Transfer · Head Bleed",
        choices: [
          { label: "Traumatic", icon: "↯", target: "traumatic-bleed" },
          { label: "Spontaneous ICH", icon: "I", target: "ich-spontaneous" },
          { label: "Aneurysmal SAH", icon: "A", target: "asah" },
        ],
      },
    },
  },
];
