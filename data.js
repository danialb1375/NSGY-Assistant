const DATA = {
  cranial: [
    {
      id: "ich-spontaneous",
      color: "#d5473e",
      title: "Spontaneous ICH",
      meta: "Non-traumatic bleed — supratentorial, cerebellar, or anticoagulated",
      gather: [
        "Time last known well vs. time of CT",
        "Hematoma volume/location, IVH extension, hydrocephalus",
        "Anticoagulation status — this changes everything below",
        "Baseline functional status (relevant to goals-of-care conversations)",
        "Repeat CT if any interval decline, to check for expansion",
      ],
      branches: [
        {
          tag: "Supratentorial, not anticoagulated",
          content: [
            "SBP target 130–140 mmHg — not lower. Going under 130 has been associated with harm, this isn't 'as low as possible.'",
            "If starting treatment within 2h of onset, reach target within 1h. Use nicardipine or labetalol drip, not oral agents.",
            "No AED prophylaxis unless a clinical or confirmed electrographic seizure occurs — spontaneous ICH is NOT the same rule as trauma.",
            "No prophylactic steroids or hyperosmolar therapy — guideline states these confer no benefit.",
            "Monitor glucose; treat hypoglycemia <60.",
          ],
        },
        {
          tag: "Cerebellar",
          content: [
            "Lower threshold for surgery regardless of GCS — brainstem compression or 4th ventricle effacement changes management fast.",
            "Watch closely for hydrocephalus — these patients can decompensate from obstruction, not just mass effect.",
            "This branch has the lowest threshold to call and lowest threshold to go in.",
          ],
        },
        {
          tag: "Anticoagulated",
          content: [
            "Warfarin: 4-factor PCC (not just FFP/vitamin K alone for acute reversal)",
            "Dabigatran: idarucizumab",
            "Apixaban/rivaroxaban/edoxaban (factor Xa inhibitors): andexanet alfa, or 4F-PCC if andexanet unavailable",
            "Reverse first, image second only if reversal would delay it — don't wait on imaging to start reversal in a clear clinical picture.",
          ],
        },
      ],
      redflags: [
        "Cerebellar bleed with any brainstem compression or hydrocephalus",
        "Hematoma expansion on repeat imaging",
        "GCS drop of 2+ points",
        "Anticoagulated and bleed is expanding",
      ],
      triage: [
        {
          type: "home",
          text: "Small, stable, supratentorial, non-anticoagulated, exam unchanged — phone discussion with attending re: BP goal and repeat imaging timing is often sufficient.",
        },
        {
          type: "drive",
          text: "Cerebellar location, any hydrocephalus, GCS drop, anticoagulated, or expansion on repeat imaging — go in.",
        },
      ],
      script:
        "74M, spontaneous [location] ICH, [volume]cc, GCS [X], [anticoagulated/not]. SBP currently [X], goal 130-140. [Reversal given/not indicated]. Repeat CT [time]. Calling to [confirm plan / report change].",
      source:
        "Source: 2022 AHA/ASA Guideline for the Management of Spontaneous Intracerebral Hemorrhage (Circulation).",
    },
    {
      id: "traumatic-bleed",
      color: "#e8a33d",
      title: "Traumatic bleed (SDH / EDH)",
      meta: "Fall, MVC, assault — new extra-axial bleed on CT",
      gather: [
        "Mechanism, GCS at scene vs. now, any lucid interval (classic for EDH)",
        "Thickness and midline shift on CT — these are the actual decision numbers",
        "Anticoagulation/antiplatelet status",
        "Associated injuries, other services already involved",
      ],
      branches: [
        {
          tag: "Acute SDH",
          content: [
            "Evacuate if thickness >10mm OR midline shift >5mm — regardless of GCS. This is the hard threshold, not a judgment call.",
            "If below that threshold but patient is comatose (GCS <9): still operate if GCS dropped ≥2 points from injury to arrival, pupils become asymmetric/fixed, or ICP >20.",
            "Below threshold + stable exam = nonoperative candidate: admit, repeat CT ~6h, neurochecks.",
          ],
        },
        {
          tag: "Acute EDH",
          content: [
            "Can be managed nonoperatively if: <30cc volume, <15mm thickness, <5mm shift, GCS >8, no focal deficit — with serial CT and close observation.",
            "Comatose (GCS <9) with anisocoria: evacuate urgently, don't wait.",
          ],
        },
        {
          tag: "Seizure prophylaxis — trauma rule",
          content: [
            "AED IS given here: 7 days of levetiracetam (20mg/kg IV load, then maintenance BID) or phenytoin. This is standard of care for early post-traumatic seizure prophylaxis in moderate-severe TBI.",
            "Stop at day 7 — evidence doesn't support continuing beyond that to prevent late seizures.",
            "This is the OPPOSITE of the spontaneous ICH rule — trauma gets prophylaxis, spontaneous bleeds don't unless they actually seize.",
          ],
        },
      ],
      redflags: [
        "Thickness >10mm or shift >5mm on any traumatic SDH — evacuate regardless of exam",
        "Lucid interval followed by rapid decline (classic EDH)",
        "GCS drop of 2+ points from injury to arrival",
        "Anisocoria or fixed/dilated pupil",
      ],
      triage: [
        {
          type: "home",
          text: "Small SDH/EDH below surgical threshold, stable exam, no anticoagulation — phone discussion, repeat CT at 6h, neurochecks.",
        },
        {
          type: "drive",
          text: "Meets thickness/shift threshold, anticoagulated, or any exam change — go in, don't manage this remotely.",
        },
      ],
      script:
        "[Age/sex], [mechanism], [X]mm SDH/EDH, [X]mm shift, GCS [X] [stable/changed since arrival]. [Meets/doesn't meet] operative criteria. Started Keppra load for seizure ppx. Calling to [confirm OR / confirm admit plan].",
      source:
        "Source: Brain Trauma Foundation Guidelines for the Surgical Management of TBI (2006, in active use); seizure ppx per AAN/BTF standard, McGovern Medical School CPG.",
    },
    {
      id: "asah",
      color: "#d5473e",
      title: "Aneurysmal SAH",
      meta: "Worst headache of life, thunderclap, confirmed aneurysm",
      gather: [
        "Hunt-Hess and modified Fisher grade",
        "Is the aneurysm secured yet (coiled/clipped) — this changes the whole management phase",
        "Any rebleed signs — sudden decline, new headache spike",
        "Hydrocephalus on imaging, EVD status if placed",
        "Vasospasm timing — classically days 3–14, ask what day post-bleed this is",
      ],
      branches: [
        {
          tag: "Before aneurysm secured",
          content: [
            "Focus is preventing rebleed: BP control (no single universal number in the guideline — this is center/attending-dependent, confirm the target your team uses).",
            "Nimodipine should already be started (enteral, ~21 days) — it improves outcomes but does NOT treat vasospasm itself.",
            "Avoid hypervolemia and induced hypertension at this stage — that's for after the aneurysm is secured, if vasospasm develops.",
          ],
        },
        {
          tag: "After secured, watching for vasospasm/DCI",
          content: [
            "Target euvolemia — prophylactic hypervolemia is specifically NOT recommended, it increases complications without improving outcomes.",
            "If symptomatic delayed cerebral ischemia develops, elevating BP and maintaining euvolemia can help — but that's reactive, not prophylactic.",
            "TCDs or CTA/CTP used to monitor for vasospasm, especially days 3-14 post-bleed.",
          ],
        },
      ],
      redflags: [
        "Sudden new headache spike or decline — think rebleed until proven otherwise",
        "New focal deficit in the classic vasospasm window (days 3-14)",
        "Any decline before aneurysm is secured — highest-stakes phase",
      ],
      triage: [
        {
          type: "home",
          text: "Stable, aneurysm already secured, no new symptoms, within expected post-op course — phone check-in is reasonable.",
        },
        {
          type: "drive",
          text: "Any decline before securing, suspected rebleed, or new deficit in the vasospasm window — go in, these patients can crash fast.",
        },
      ],
      script:
        "[Age/sex], aSAH day [X], Hunt-Hess [X], aneurysm [secured/not]. [New symptom]. Nimodipine running. Calling to [discuss rebleed concern / vasospasm workup].",
      source:
        "Source: 2023 AHA/ASA Guideline for the Management of Aneurysmal Subarachnoid Hemorrhage (Stroke).",
    },
    {
      id: "shunt",
      color: "#3fa89a",
      title: "Shunt malfunction / infection",
      meta: "Headache, vomiting, lethargy, fever, wound changes",
      gather: [
        "Shunt type, valve setting if programmable",
        "Timing relative to any recent trauma, valve adjustment, or procedure",
        "Fever curve, wound/tract appearance (erythema, tenderness, drainage)",
        "Exam: mental status, pupils, sunsetting gaze, peds irritability/fontanelle",
        "Shunt series + CT head compared to prior films",
      ],
      branches: [
        {
          tag: "Suspected malfunction (mechanical)",
          content: [
            "Compare current ventricle size to prior imaging — this is the key comparison, not an isolated read.",
            "Rapid mental status decline = acute obstruction until proven otherwise.",
          ],
        },
        {
          tag: "Suspected infection",
          content: [
            "Empiric: vancomycin + an anti-pseudomonal beta-lactam (cefepime, ceftazidime, or meropenem) — this is the standard combination, not vancomycin alone.",
            "Infected hardware needs to come OUT — guideline recommends complete shunt removal with external ventricular drain placement plus IV antibiotics, not treating in place.",
            "Vancomycin trough target 15–20 mcg/mL in seriously ill patients.",
          ],
        },
      ],
      redflags: [
        "Rapidly declining mental status — think acute obstruction",
        "Fever + tenderness/erythema along the shunt tract — think infection",
        "Peds: bulging fontanelle, sunsetting eyes, high-pitched cry",
      ],
      triage: [
        {
          type: "home",
          text: "Mild headache/vomiting, alert and interactive, no exam change — order CT/shunt series, manage nausea, reassess by phone once imaging is read.",
        },
        {
          type: "drive",
          text: "Any mental status drop, sunsetting, peds lethargy/irritability, or signs of infection — go in.",
        },
      ],
      script:
        "Shunt patient, [age], presenting with [symptoms]. Shunt series/CT [shows/pending]. [Comparing to prior films]. Concern for [malfunction/infection]. Calling to discuss [imaging plan / antibiotics / OR].",
      source:
        "Source: IDSA 2017 Clinical Practice Guidelines for Healthcare-Associated Ventriculitis and Meningitis.",
    },
    {
      id: "evd",
      color: "#4c8bf5",
      title: "EVD management",
      meta: "ICP concerns, output changes, weaning questions",
      gather: [
        "Current drain height setting and ICP trend",
        "CSF output over last 24h — quantity and quality (clear vs. bloody vs. cloudy)",
        "Reason EVD was placed and whether that indication has resolved",
        "Any recent bed/HOB change without clamping — a common source of erroneous readings",
      ],
      branches: [
        {
          tag: "General settings (context-dependent)",
          content: [
            "Low setting (~5 cmH2O): encourages drainage — used for hydrocephalus or clearing blood/debris.",
            "Moderate (~10 cmH2O): primarily ICP monitoring with some drainage.",
            "High (15–20 cmH2O): pre-aneurysm-securing, weaning phase, or posterior fossa mass (to avoid upward herniation).",
            "NEVER adjust head-of-bed without clamping the drain first — this is a common nursing error that causes false ICP readings or CSF over-drainage.",
          ],
        },
        {
          tag: "Weaning",
          content: [
            "General criteria to start weaning: indication resolving, CSF output <250mL/24h, non-bloody CSF, normal ICP, neurologically stable.",
            "One common approach: raise chamber height in increments (institution-specific step size) until reaching a clamp-trial threshold, then clamp with close monitoring and repeat CT before discontinuing.",
            "VERIFY LOCALLY — exact step sizes, timing intervals, and clamp-trial duration vary significantly by institution and even by attending. Confirm your unit's specific protocol before acting on this.",
          ],
        },
      ],
      redflags: [
        "Sudden increase in ICP after any drain height/bed change — check clamping first before assuming pathology",
        "Change in CSF character (new blood, cloudiness) — think infection or new bleed",
        "Failed clamp trial with symptomatic hydrocephalus",
      ],
      triage: [
        {
          type: "home",
          text: "Routine output/ICP question, no acute change — often manageable with a phone order adjustment.",
        },
        {
          type: "drive",
          text: "New ICP spike, change in CSF character, or any concern for malfunction — go in and assess the drain yourself.",
        },
      ],
      script:
        "EVD patient, day [X], current setting [X]. ICP trend [X]. Output [X]mL over 24h, [character]. Calling to discuss [weaning / troubleshooting / concerning change].",
      source:
        "Source: Neurocritical Care Society EVD management review; institutional protocols vary — confirm locally.",
    },
    {
      id: "postop-cranial",
      color: "#4c8bf5",
      title: "Post-op cranial complication",
      meta: "New deficit, AMS, wound issue, fever — your own patient",
      gather: [
        "Baseline exam vs. now — what changed, and since when",
        "Vitals trend, not just current snapshot",
        "Wound: dry vs. leaking vs. CSF-clear, erythema, fluctuance",
        "Steroid/AED/anticoagulation status and recent doses given",
        "Most recent imaging/labs, or note if none since baseline",
      ],
      redflags: [
        "New focal deficit or rapidly declining GCS",
        "Anisocoria or blown pupil",
        "Suspected CSF leak from wound, nose, or ear",
        "Uncontrolled hypertension in a fresh post-craniotomy patient",
      ],
      triage: [
        {
          type: "home",
          text: "Full neuro exam and vitals repeated by nursing, compared to last documented exam — if unchanged and stable, often manageable by phone order plus recheck in 1-2h.",
        },
        {
          type: "drive",
          text: "Any exam change, new asymmetry, GCS drop, or drain output that's suddenly way up or turned bloody — go in.",
        },
      ],
      script:
        "Post-op day [X] from [procedure]. New [symptom] since [time]. Baseline exam was [X], now [X]. Vitals [X]. Calling to [report change / discuss workup].",
      source:
        "General post-craniotomy monitoring principles — pair with the specific complication category above if it fits (bleed, seizure, infection).",
    },
    {
      id: "dex-taper",
      color: "#9b7fd4",
      title: "Dexamethasone taper (post-craniotomy tumor)",
      meta: "Peritumoral edema management",
      gather: [
        "Current dose, day of taper, indication (tumor type, extent of resection)",
        "Any new symptoms suggesting edema is undertreated (headache, new deficit, decline)",
        "Steroid side effects already present (hyperglycemia, GI upset, insomnia, mood changes)",
      ],
      branches: [
        {
          tag: "Common regimen",
          content: [
            "A frequently used starting point: dexamethasone 4mg IV/PO q6h initially, tapering over roughly 10–15 days depending on institutional practice and symptom response.",
            "Some protocols taper faster (as short as 4 days) with reduced total steroid exposure and similar edema control — this is genuinely variable across the literature, not one fixed number.",
            "VERIFY LOCALLY — your attendings and institution will have a specific preferred schedule. Don't treat any single taper schedule here as fixed; confirm before recommending changes to a nurse or ED provider.",
          ],
        },
      ],
      redflags: [
        "New or worsening neuro symptoms during a taper — may mean edema is outpacing the taper speed, not a reason to just push through",
        "Signs of adrenal insufficiency if tapered too fast in a patient on prolonged high-dose steroids (fatigue, hypotension, nausea)",
      ],
      triage: [
        {
          type: "home",
          text: "Routine taper question, no new symptoms — usually a phone-order adjustment.",
        },
        {
          type: "drive",
          text: "New neuro symptoms during taper, or signs of adrenal insufficiency — worth an in-person look.",
        },
      ],
      script:
        "Post-op tumor patient, POD [X], currently on dex [dose], day [X] of taper. [Symptom change / none]. Calling to confirm taper plan.",
      source:
        "Source: general dosing patterns reported across post-craniotomy steroid literature (e.g. REST/PODS trial protocols) — schedule varies by institution, confirm locally.",
    },
    {
      id: "skull-fracture",
      color: "#e8a33d",
      title: "Skull fracture",
      meta: "Depressed, basilar, or linear — trauma consult",
      gather: [
        "Location and pattern: depressed vs. linear vs. basilar",
        "Open (compound, overlying scalp laceration) vs. closed",
        "Signs of basilar fracture: raccoon eyes, Battle sign, hemotympanum, CSF rhinorrhea/otorrhea",
        "Depth of depression relative to skull thickness on CT",
        "Any underlying hematoma, dural tear, or pneumocephalus",
      ],
      branches: [
        {
          tag: "Depressed fracture",
          content: [
            "Surgical indication: depression greater than the thickness of the skull (roughly 8-10mm as a general reference), OR any open/compound fracture with dural laceration, CSF leak, significant intracranial hematoma, or gross contamination.",
            "Closed, nondisplaced, or minimally depressed fractures without the above features are frequently managed nonoperatively — they remodel over time.",
            "Open depressed fractures generally need debridement and elevation regardless of depth, due to infection risk.",
          ],
        },
        {
          tag: "Basilar skull fracture",
          content: [
            "Diagnosed clinically (raccoon eyes, Battle sign, hemotympanum, CSF leak) and confirmed on CT — dedicated bone windows help delineate the fracture line.",
            "Prophylactic antibiotics are NOT recommended, even with a documented CSF leak — this is a common point of confusion. Multiple meta-analyses (including Cochrane) failed to show reduced meningitis risk with prophylaxis, and current guidance recommends against it.",
            "Note: this remains debated in some circles — a subset of authors argue the evidence isn't strong enough to justify a strong 'against' recommendation, particularly with active CSF leak. If your attending wants prophylaxis in this setting, that's a reasonable clinical judgment call, not a violation of guidelines — just don't assume it's automatically indicated.",
            "Most CSF leaks resolve spontaneously with conservative management (HOB elevation, avoid Valsalva/straining). Persistent leak beyond ~7 days is when surgical repair starts being considered.",
            "Avoid nasogastric tubes or nasotracheal intubation in suspected anterior basilar fractures — risk of intracranial passage.",
          ],
        },
        {
          tag: "Linear, nondisplaced fracture",
          content: [
            "Usually just observation — no surgical indication if no depression, no significant underlying hematoma, and patient is neurologically intact.",
            "Still worth a repeat exam/short observation given the mechanism, but this is generally the lowest-acuity fracture pattern.",
          ],
        },
      ],
      redflags: [
        "Any depression greater than skull thickness",
        "Open fracture with dural tear, CSF leak, or gross contamination",
        "New or worsening cranial nerve deficit (especially facial nerve with basilar fractures)",
        "Persistent CSF leak beyond about a week",
      ],
      triage: [
        {
          type: "home",
          text: "Linear, nondisplaced, closed fracture, neurologically intact, no CSF leak — phone discussion and admit for observation is often reasonable.",
        },
        {
          type: "drive",
          text: "Any significant depression, open fracture, active CSF leak, or new cranial nerve finding — go in.",
        },
      ],
      script:
        "[Age/sex], [mechanism], skull fracture [type/location] on CT, depth [X]mm. [Open/closed]. [CSF leak present/absent]. Neuro exam [intact/deficit]. Calling to discuss [OR / observation plan].",
      source:
        "Source: Guidelines for the Surgical Management of Depressed Cranial Fractures (Bullock et al., Neurosurgery 2006); Cochrane Database review on antibiotic prophylaxis for basilar skull fractures (2015).",
    },
  ],
  spine: [
    {
      id: "cauda-equina",
      color: "#d5473e",
      title: "Cauda equina syndrome",
      meta: "Bowel/bladder changes, saddle anesthesia, motor deficit",
      gather: [
        "Bowel/bladder function — retention (check post-void residual) or incontinence, saddle anesthesia",
        "Motor exam by myotome, sensory level",
        "Onset timeline — this determines urgency of the surgical window",
        "MRI already obtained? If not, this is the immediate next step",
      ],
      medmanagement: [
        "The real evidence-based window is closer to 48 hours than 24 — surgery within 24h doesn't consistently outperform surgery at 24-48h in recent meta-analysis.",
        "That said, earlier is still generally better and this is NOT a reason to delay — get the MRI and surgical team involved immediately regardless of exact hour count.",
        "Long-term outcome is driven more by pre-op bladder function than by the exact hour of surgery — but that doesn't change the urgency of getting there fast.",
      ],
      redflags: [
        "New saddle anesthesia or urinary retention — cauda equina until proven otherwise",
        "Any progressive motor deficit",
        "Bilateral leg symptoms with bowel/bladder change",
      ],
      triage: [
        {
          type: "home",
          text: "Chronic/stable back pain, no new bowel/bladder change, no motor deficit — manage with phone pain control orders.",
        },
        {
          type: "drive",
          text: "Any new saddle anesthesia, retention, incontinence, or motor deficit — go in, this is a call-now, MRI-now situation.",
        },
      ],
      script:
        "[Age/sex], acute back pain with [bowel/bladder symptom], onset [X hours ago]. Saddle sensation [intact/diminished]. MRI [obtained/ordering STAT]. Calling to mobilize OR.",
      source:
        "Source: Reassessing the clock in cauda equina syndrome — systematic review/meta-analysis of surgical timing (2026); consistent with longstanding recommendation to operate within 48h.",
    },
    {
      id: "epidural-abscess",
      color: "#d5473e",
      title: "Spinal epidural abscess",
      meta: "Fever + back pain + neuro deficit, IVDU risk",
      gather: [
        "Fever curve, IVDU history, recent spine procedure or other infection source",
        "Motor/sensory exam, any deficit progression",
        "MRI whole spine with contrast — the diagnostic study of choice",
        "Blood cultures drawn before antibiotics if patient is stable enough to allow it",
      ],
      medmanagement: [
        "Empiric antibiotics: vancomycin PLUS a 3rd-gen cephalosporin (ceftriaxone 2g q12h) for gram-negative coverage — or cefepime/meropenem if post-procedural/Pseudomonas risk.",
        "Don't delay empiric antibiotics for a stable patient awaiting biopsy for too long — but if biopsy/aspiration is imminent and patient is stable, holding briefly can preserve culture yield. This is a judgment call to discuss with your attending, not a rigid rule.",
        "Surgical decompression is indicated for any patient with a neurologic deficit — antibiotics alone are not sufficient once deficit is present.",
        "Total antibiotic duration is typically prolonged (weeks), guided by ID.",
      ],
      redflags: [
        "Fever + back pain + neuro deficit — epidural abscess until proven otherwise",
        "Any progressive motor or sensory deficit — this means surgery, not just antibiotics",
        "IVDU history with new back pain and fever — low threshold for MRI",
      ],
      triage: [
        {
          type: "home",
          text: "Back pain with fever but no neuro deficit and hemodynamically stable — can often coordinate MRI and antibiotics by phone, but keep a very low threshold to escalate.",
        },
        {
          type: "drive",
          text: "Any neuro deficit present — go in, this needs a surgical decision made in person.",
        },
      ],
      script:
        "[Age/sex], fever + back pain, [neuro deficit present/absent]. MRI whole spine [findings]. Started vanc + ceftriaxone. Calling to discuss [OR / continued medical management].",
      source:
        "Source: IDSA-aligned empiric regimens per Merck Manual, CoreEM, and Spinal Epidural Abscess review literature; MRI-first diagnostic approach is standard of care.",
    },
    {
      id: "spine-trauma",
      color: "#e8a33d",
      title: "Spine trauma / compression fracture",
      meta: "Fall or MVC with back pain — compression, burst, or C-spine injury",
      gather: [
        "Mechanism, level(s) involved, whether it's a compression, burst, translation/rotation, or distraction injury pattern",
        "Neuro exam — any deficit changes everything about urgency",
        "MRI needed if PLC (posterior ligamentous complex) integrity is unclear on CT — this affects stability determination",
        "For C-spine: is the patient a candidate for clinical clearance, or does mechanism/exam mandate imaging",
      ],
      branches: [
        {
          tag: "C-spine clearance (ED consult calls)",
          content: [
            "NEXUS criteria (all must be met to skip imaging): no midline cervical tenderness, no focal neuro deficit, normal alertness, no intoxication, no painful distracting injury.",
            "Canadian C-Spine Rule is more selective (higher specificity) but only applies to alert, stable patients — checks for high-risk factors (age 65+, dangerous mechanism, paresthesias) and low-risk factors before allowing range-of-motion testing.",
            "If imaging is obtained and CT is negative but patient remains symptomatic or is intoxicated/uncooperative for exam, don't feel pressured to clear immediately — a normal CT alone doesn't always end the conversation if exam is unreliable.",
          ],
        },
        {
          tag: "Thoracolumbar compression/burst fracture — TLICS scoring",
          content: [
            "TLICS score = morphology + posterior ligamentous complex (PLC) status + neuro status. Score ≤3: nonoperative. Score 4: surgeon judgment (gray zone). Score ≥5: operative.",
            "A simple wedge compression fracture alone scores low and is usually braced, not operated.",
            "A burst fracture with PLC disruption can score high (5) even in a neurologically intact patient — 'intact exam' does NOT automatically mean nonoperative here, unlike some other bleed scenarios. This is a common source of confusion.",
            "MRI (T2 sagittal) is the most sensitive way to assess PLC integrity when it's unclear on CT — high signal through the interspinous ligament/ligamentum flavum/facet capsules suggests disruption.",
            "Other classic operative triggers regardless of TLICS: >15° kyphosis, >50% loss of anterior vertebral body height, >25% canal compromise from retropulsed fragment with correlating deficit.",
          ],
        },
        {
          tag: "Osteoporotic (non-traumatic or low-energy) compression fracture",
          content: [
            "Different pathway from high-energy trauma — first-line is pain control, bracing (TLSO), and activity modification, not surgery.",
            "Vertebroplasty is NOT recommended for neurologically intact patients per AAOS guideline — evidence doesn't show benefit over conservative care.",
            "Kyphoplasty is a reasonable option (weak recommendation) if pain persists despite conservative management, generally after about 3 weeks of failed conservative treatment — it has better height restoration and lower cement leak rates than vertebroplasty.",
            "This is a very different conversation from an acute high-energy burst fracture — don't apply TLICS operative thresholds to a frail osteoporotic compression fracture without any acute trauma mechanism.",
          ],
        },
      ],
      redflags: [
        "Any progressive neurologic deficit regardless of TLICS score",
        "Burst fracture with PLC disruption, even if neurologically intact — this is a common 'looks stable but isn't' trap",
        "Bowel/bladder changes — treat as cauda equina until proven otherwise",
        "High-risk C-spine mechanism with any exam abnormality — don't clinically clear these",
      ],
      triage: [
        {
          type: "home",
          text: "Simple compression fracture, TLICS ≤3, intact exam, pain controlled — phone discussion re: bracing and outpatient follow-up is often reasonable.",
        },
        {
          type: "drive",
          text: "TLICS ≥4, any neuro deficit, burst morphology with PLC concern, or C-spine injury with abnormal exam — go in.",
        },
      ],
      script:
        "[Age/sex], [mechanism], [level] fracture, [morphology]. TLICS approx [X] ([PLC status], [neuro status]). Exam [intact/deficit]. Calling to discuss [bracing vs. OR / MRI for PLC].",
      source:
        "Source: TLICS system (Vaccaro et al., Spine 2005; Radiology Assistant summary); NEXUS (Hoffman et al., NEJM 2000) and Canadian C-Spine Rule (Stiell et al., NEJM 2003); AAOS Clinical Practice Guideline on Osteoporotic Spinal Compression Fractures.",
    },
    {
      id: "spine-postop",
      color: "#3fa89a",
      title: "Post-op spine complication",
      meta: "New deficit, wound issue, hematoma concern",
      gather: [
        "Baseline post-op exam vs. now",
        "Wound: drainage character, hematoma bulging, erythema",
        "Level(s) operated and expected recovery trajectory",
        "Any new bowel/bladder change — treat with same urgency as primary cauda equina",
      ],
      redflags: [
        "New or worsening motor deficit post-op — think epidural hematoma until proven otherwise",
        "Rapidly expanding wound swelling/hematoma with neuro change — this can be a surgical emergency",
        "New bowel/bladder dysfunction post-op",
      ],
      triage: [
        {
          type: "home",
          text: "Stable wound, expected post-op pain, no new deficit — phone order for pain control is reasonable.",
        },
        {
          type: "drive",
          text: "Any new or worsening deficit, or rapidly expanding wound hematoma — go in immediately, post-op epidural hematoma is time-sensitive.",
        },
      ],
      script:
        "POD [X] from [level(s)/procedure]. New [symptom] since [time]. Wound [appearance]. Calling to report [change / discuss return to OR].",
      source: "General post-operative spine monitoring principles.",
    },
  ],
  general: [
    {
      id: "seizure",
      color: "#e8a33d",
      title: "Seizure / status epilepticus",
      meta: "New seizure, prolonged seizure, altered mental status",
      gather: [
        "Duration of seizure activity, single vs. recurrent without recovery",
        "Known seizure history/AEDs already on board vs. new-onset",
        "Trauma vs. spontaneous bleed vs. tumor vs. metabolic — changes the AED approach",
        "Glucose, electrolytes if not already checked",
      ],
      medmanagement: [
        "First line (0-5-20min): benzodiazepine — IM midazolam, IV lorazepam, or IV diazepam. IM midazolam is actually preferred if there's no IV access yet.",
        "Second line (20-40min if ongoing): IV fosphenytoin, valproic acid, or levetiracetam — roughly equivalent efficacy per the ESETT trial, pick based on patient factors (levetiracetam often favored for fewer interactions/no level monitoring).",
        "Refractory (40min+): anesthetic-dose infusion (propofol, midazolam, pentobarbital) — this is ICU-level management, not floor management.",
        "Remember the trauma vs. spontaneous distinction from the bleed categories when deciding whether ongoing prophylaxis (not just acute treatment) is indicated.",
      ],
      redflags: [
        "Seizure lasting >5 minutes or recurrent without return to baseline — this is status epilepticus, treat urgently",
        "New seizure in a patient without prior seizure history — think new structural/metabolic cause",
        "Post-ictal state that isn't improving as expected",
      ],
      triage: [
        {
          type: "home",
          text: "Single brief seizure, quickly returned to baseline, known seizure history, no new deficit — phone management with dose adjustment is often reasonable.",
        },
        {
          type: "drive",
          text: "New-onset seizure, prolonged/recurrent activity, or any new deficit after — go in.",
        },
      ],
      script:
        "[Age/sex], [known/new] seizure, duration [X]min, [treated with X]. Currently [post-ictal/returned to baseline]. Calling to discuss [AED loading / workup].",
      source:
        "Source: American Epilepsy Society 2016 Evidence-Based Guideline for Treatment of Convulsive Status Epilepticus; ESETT trial for second-line agent equivalence.",
    },
    {
      id: "consult",
      color: "#4c8bf5",
      title: "New consult from ED / other service",
      meta: "Triage: does this need to be seen tonight",
      gather: [
        "Chief complaint, exam findings, imaging already available",
        "Referring team's specific question — what decision are they waiting on",
        "Anticoagulation status if any bleed is involved",
        "Patient's baseline — new problem or chronic finding",
      ],
      redflags: [
        "Any new deficit not yet explained",
        "Imaging findings the referring team may be underselling",
      ],
      triage: [
        {
          type: "home",
          text: "Stable exam, incidental/chronic finding, no acute question needing an in-person look — phone recommendation and morning follow-up.",
        },
        {
          type: "drive",
          text: "Any new deficit, unclear imaging, or a referring team pushing for an urgent decision — go see the patient yourself.",
        },
      ],
      script:
        "New consult from [service]. [One-line summary]. Their question is [X]. My assessment is [X]. Calling to [confirm plan / request OK to manage by phone].",
      source:
        "General triage framework — route to the specific scenario category above once you know what you're dealing with.",
    },
    {
      id: "floor",
      color: "#3fa89a",
      title: "Nursing floor calls",
      meta: "Pain, meds, minor status changes",
      gather: [
        "What specifically prompted the call — vitals, exam, or a patient complaint",
        "Current med orders and last doses (steroids/AEDs/pain meds)",
        "Is this a pattern (recurring) or a one-off",
        "Does it change your exam baseline for this patient",
      ],
      redflags: [
        "Anything framed as 'minor' that involves a neuro exam change",
        "Repeated calls about the same issue — may signal something building",
      ],
      triage: [
        {
          type: "home",
          text: "Pain, nausea, sleep, minor med questions — almost always a phone order.",
        },
        {
          type: "drive",
          text: "Any neuro exam change, or a second call about the same patient within an hour — go in and look yourself.",
        },
      ],
      script:
        "Floor call re: [patient]. [Complaint]. Exam [unchanged/changed]. Requesting order for [X].",
      source: "General floor-call triage principles.",
    },
  ],
};

Object.freeze(DATA);
