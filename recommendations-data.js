/* Verified clinical memory aids. Original reference content remains in data.js. */
export const RECOMMENDATIONS = {
  "ich-spontaneous": {
    items: [
      "Initiate smooth, sustained blood-pressure control; for mild–moderate ICH with presenting SBP 150–220 mmHg, targeting about 140 and maintaining 130–150 mmHg is reasonable. Avoid lowering below 130 mmHg.",
      "Stop anticoagulation and reverse promptly when indicated; do not delay reversal while arranging transfer.",
      "Use frequent neurological assessments in a stroke unit or neuro-ICU appropriate to hemorrhage severity; repeat CT urgently for neurological deterioration and consider early serial CT to assess expansion.",
      "Do not give prophylactic antiseizure medication without clinical/electrographic seizures; evaluate unexplained fluctuating mental status with continuous EEG when appropriate.",
      "Notify the attending immediately for decline, expansion, hydrocephalus, brainstem compression, or cerebellar ICH >15 mL; these may change surgical/EVD management.",
    ],
    source: "AHA/ASA 2022 Spontaneous ICH Guideline.",
  },
  "traumatic-bleed": {
    items: [
      "Elevate the head of bed when not contraindicated, perform frequent neurological checks, and obtain urgent repeat CT for any examination change; routine repeat-imaging timing varies by injury and local protocol.",
      "Review anticoagulant/antiplatelet exposure immediately and follow the institution’s trauma-reversal pathway.",
      "For hospitalized moderate–severe TBI, either prophylactic antiseizure medication or no prophylaxis may be used (weak recommendation). If used, current NCS guidance weakly favors levetiracetam over phenytoin/fosphenytoin and a short course of no more than 7 days.",
      "Discuss ICU versus monitored-unit placement based on GCS, imaging burden, anticoagulation, and trajectory.",
    ],
    variants: {
      "Acute SDH": [
        "Evacuate acute SDH >10 mm thick or with >5 mm midline shift regardless of GCS.",
        "For comatose patients below those CT thresholds, notify immediately for GCS decline ≥2 points, asymmetric/fixed pupils, or ICP >20 mmHg; these are operative indications.",
      ],
      "Acute EDH": [
        "Evacuate EDH >30 mL regardless of GCS.",
        "Non-operative observation requires EDH <30 mL, thickness <15 mm, shift <5 mm, GCS >8, no focal deficit, serial CT, and close observation in a neurosurgical center.",
        "Coma with anisocoria requires evacuation as soon as possible.",
      ],
    },
    source:
      "Brain Trauma Foundation Surgical Management of TBI; Neurocritical Care Society 2024 seizure-prophylaxis guideline.",
  },
  asah: {
    items: [
      "Arrange evaluation and treatment of the ruptured aneurysm as early as feasible, preferably within 24 hours; avoid unnecessary delays in transfer to an experienced center.",
      "Start enteral nimodipine early when not contraindicated and maintain consistent dosing; it improves neurological outcomes but is not itself a treatment for angiographic vasospasm.",
      "Maintain euvolemia; do not use prophylactic hypervolemia or routine prophylactic hemodynamic augmentation.",
      "Before aneurysm securement, use frequent BP monitoring and short-acting medication to avoid severe hypertension, hypotension, and BP variability; the exact target is individualized.",
      "Notify immediately for rebleeding concern, acute hydrocephalus, new focal deficit, or decline; symptomatic DCI after securement may prompt BP elevation and euvolemia under the treating team.",
    ],
    source: "AHA/ASA 2023 Aneurysmal SAH Guideline.",
  },
  shunt: {
    items: [
      "Compare the neurological examination and ventricular size with the patient’s own baseline; normal-sized ventricles do not by themselves exclude malfunction.",
      "Obtain CT head and shunt-series imaging according to local pathway; rapid decline requires immediate attending notification and airway/ICP stabilization.",
      "For suspected infection, obtain appropriate CSF and blood cultures when safe and start vancomycin plus an anti-pseudomonal beta-lactam based on local susceptibility patterns.",
      "Confirmed shunt infection generally requires complete hardware removal, temporary external ventricular drainage, and IV antimicrobial therapy rather than treatment with the shunt left in place.",
    ],
    source:
      "IDSA 2017 Healthcare-Associated Ventriculitis and Meningitis Guideline; diagnostic imaging details remain institution-dependent.",
  },
  evd: {
    items: [
      "Verify the prescribed drainage mode and level the system to the ordered anatomical reference after every position change; clamp during repositioning only according to the device order/local protocol.",
      "Record ICP, waveform, CSF amount, and CSF character at the ordered frequency; assess the patient and system immediately for an acute ICP rise or loss of drainage.",
      "Notify immediately for neurological decline, disconnection, accidental removal, new bloody/cloudy CSF, sustained ICP elevation, or suspected over-drainage/under-drainage.",
      "Avoid routine daily CSF cultures unless clinically indicated; minimize system manipulation and follow the institution’s sterile sampling bundle.",
      "Drain height, hourly limits, transport practice, weaning steps, and clamp-trial timing are device-, pathology-, and institution-specific—confirm the active order.",
    ],
    source:
      "Neurocritical Care Society EVD Consensus Statement; IDSA 2017 ventriculitis guideline; operational details require local policy.",
  },
  "skull-fracture": {
    items: [
      "Evaluate for associated intracranial injury, open wound, dural violation, CSF leak, cranial-nerve deficit, and frontal-sinus involvement.",
      "Open depressed fractures deeper than the adjacent skull thickness generally require early elevation and debridement; notify the attending promptly.",
      "Open depressed fractures should receive antibiotic prophylaxis; regimen and duration follow the local trauma/antimicrobial protocol.",
      "Closed simple depressed fractures may be observed when no other operative indication exists; avoid nasal instrumentation when anterior basilar fracture is suspected.",
      "Routine prophylactic antibiotics are not supported for a closed basilar skull fracture solely because of a CSF leak.",
    ],
    source:
      "Brain Trauma Foundation Surgical Management of Depressed Cranial Fractures; Cochrane review of basilar-fracture antibiotic prophylaxis.",
  },
  "cauda-equina": {
    items: [
      "Perform and document lower-extremity motor/sensory examination, perineal sensation, anal function when appropriate, and bladder function; measure post-void residual without using it to exclude CES.",
      "Obtain urgent lumbar MRI for suspected cauda equina syndrome and notify the spine attending early.",
      "MRI-confirmed compression with compatible CES requires decompression; pursue surgery as early as feasible, preferably within 24 hours and within 48 hours.",
      "Do not delay imaging or surgical coordination for empiric steroids; evidence does not establish a role for steroids in acute CES.",
    ],
    source:
      "WFNS Spine Committee recommendations for cauda equina and conus medullaris syndromes (2024).",
  },
  "epidural-abscess": {
    items: [
      "Obtain a complete motor/sensory examination, two sets of blood cultures, ESR/CRP, and contrast-enhanced spine MRI; image additional levels when symptoms or risk suggest noncontiguous disease.",
      "Neurological compromise, sepsis, or hemodynamic instability requires immediate surgical evaluation and empiric antibiotics while microbiologic diagnosis is pursued.",
      "If the patient is neurologically and hemodynamically stable, discuss timing of antibiotics versus image-guided or operative culture with spine surgery and ID.",
      "Progressive deficit, deformity, instability, persistent bacteremia, or clinical failure despite appropriate therapy supports operative intervention.",
      "Antibiotic selection and duration should be culture-directed with ID input; do not treat the app as a dosing order.",
    ],
    source:
      "IDSA 2015 Native Vertebral Osteomyelitis Guideline (including epidural extension).",
  },
  "spine-trauma": {
    items: [
      "Maintain spinal precautions appropriate to the suspected level until imaging and a reliable examination permit clearance.",
      "Document a detailed neurological examination and reassess after transfers or any change; use the ASIA/ISNCSCI exam when spinal cord injury is suspected.",
      "Review CT morphology and PLC integrity; obtain MRI when ligamentous injury, neural compression, or examination–imaging discordance remains uncertain.",
      "Use TLICS as an adjunct: ≤3 usually non-operative, 4 individualized, and ≥5 generally operative.",
      "Notify immediately for progressive deficit, instability/dislocation, cord compression, or cauda equina findings; current AO Spine guidance supports offering decompression within 24 hours for acute SCI, while specialty-society positions acknowledge evidence limitations.",
    ],
    source:
      "TLICS (Vaccaro et al.); AO Spine/Praxis 2024 Acute SCI guideline, with AANS/CNS position-statement caveat.",
  },
  "postop-cranial": {
    items: [
      "Repeat and document the complete neurological examination and compare it with the immediate postoperative baseline; confirm vital signs, medications, and drain output.",
      "New deficit, declining consciousness, anisocoria, seizure, or unexpected bloody/high drain output requires immediate attending notification and urgent imaging as directed.",
      "Inspect the wound for hematoma, dehiscence, erythema, drainage, or suspected CSF leak; avoid blind reinforcement that obscures ongoing leakage.",
      "BP goal, steroid plan, antiseizure therapy, anticoagulation/VTE prophylaxis, imaging timing, and drain management are procedure- and surgeon-specific—verify the postoperative orders.",
    ],
    source:
      "General postoperative neurosurgical safety principles; specific orders and thresholds are surgeon/institution dependent.",
  },
  "spine-postop": {
    items: [
      "Repeat and document motor, sensory, and bowel/bladder findings against the postoperative baseline; new deficit is an emergency until postoperative hematoma or compression is excluded.",
      "Notify the attending immediately for new weakness, saddle sensory change, urinary retention/incontinence, expanding wound swelling, or airway/neck swelling after cervical surgery.",
      "Urgent MRI is generally preferred for suspected neural compression when feasible; do not delay surgical escalation in a rapidly deteriorating patient.",
      "Inspect wound and drain output; fever workup, antibiotics, activity, bracing, VTE prophylaxis, and drain removal remain procedure- and institution-specific.",
    ],
    source:
      "General postoperative spine safety principles; imaging and treatment pathways are institution-specific.",
  },
  seizure: {
    items: [
      "Treat convulsive seizure lasting 5 minutes or recurrent seizures without recovery as status epilepticus; follow the institutional status pathway without delaying first-line benzodiazepine.",
      "Check glucose promptly, address reversible metabolic causes, review antiseizure medication adherence, and obtain urgent imaging for new focal findings or a new structural concern.",
      "Persistent altered mental status after convulsions warrants EEG consideration for nonconvulsive seizures.",
      "Ongoing prophylaxis depends on pathology: spontaneous ICH without seizures generally should not receive prophylaxis; traumatic moderate–severe TBI prophylaxis, when used, is short course (≤7 days).",
    ],
    source:
      "American Epilepsy Society status-epilepticus guideline; AHA/ASA ICH guideline; NCS 2024 TBI seizure-prophylaxis guideline.",
  },
  "dex-taper": {
    items: [
      "Confirm the indication, current dose, duration, and surgeon’s written taper rather than substituting a generic schedule.",
      "New headache, focal deficit, or decline during taper requires neurological reassessment and attending notification; do not simply continue the taper without review.",
      "Monitor steroid complications including hyperglycemia, infection, GI symptoms, insomnia, mood change, and adrenal suppression risk after prolonged exposure.",
    ],
    source:
      "Post-craniotomy steroid regimens vary by pathology, duration, institution, and surgeon; confirm the active plan.",
  },
  consult: {
    items: [
      "Clarify the consult question, timeline, neurological baseline, current examination, imaging, anticoagulant/antiplatelet exposure, and treatment already given.",
      "Personally review available imaging and compare with prior studies when possible; escalate discordance between the report and examination.",
      "Notify the attending immediately for unexplained new deficit, declining consciousness, hydrocephalus, mass effect, unstable fracture, or a time-sensitive transfer decision.",
    ],
    source:
      "General consultation triage principles; route to pathology-specific guidance when the diagnosis is known.",
  },
  floor: {
    items: [
      "Require a repeat neurological examination and current vital signs before treating a reported change as a routine floor issue.",
      "Review medication administration—not only active orders—including analgesics, sedatives, steroids, antiseizure drugs, anticoagulants, and last doses.",
      "Escalate any new deficit, declining consciousness, repeated call for the same unresolved issue, wound/drain change, or unexpected vital-sign trend.",
      "Pain, nausea, sleep, BP, electrolyte, and medication orders must remain consistent with the procedure-specific postoperative plan and local protocol.",
    ],
    source:
      "General neurosurgical floor-call safety principles; treatment orders remain patient- and institution-specific.",
  },
};
