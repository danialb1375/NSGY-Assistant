"use strict";

const STORAGE = {
  favorites: "nsgy2:favorites",
  recent: "nsgy2:recent",
  checks: "nsgy2:checks",
  contacts: "nsgy2:contacts",
  shortcut: "nsgy2:message-shortcut",
};

const WORKFLOWS = WIZARD_FLOWS;

const state = {
  route: "home",
  payload: null,
  previous: [],
  wizardTrail: [],
  favorites: read(STORAGE.favorites, []),
  recent: read(STORAGE.recent, []),
  checks: read(STORAGE.checks, {}),
  contacts: read(STORAGE.contacts, []),
  useShortcut: read(STORAGE.shortcut, false),
  communicationDrafts: {},
  activeCase: null,
};

const app = document.querySelector("#app");
const allItems = Object.entries(DATA).flatMap(([section, items]) =>
  items.map((item) => ({ ...item, section })),
);
const byId = Object.fromEntries(allItems.map((item) => [item.id, item]));

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const area = document.createElement("textarea");
  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "'",
        '"': "&quot;",
      })[c],
  );
}

function workflowPayload() {
  return typeof state.payload === "string"
    ? { id: state.payload, focus: null }
    : {
        ...state.payload,
        id: state.payload?.id,
        focus: state.payload?.focus || null,
      };
}

function fieldValue(draft, key) {
  const value = selectedValue(draft, key);
  if (!value) return "";
  const unit = COMM_FIELDS[key]?.unit;
  return unit && !String(value).toLowerCase().endsWith(unit.toLowerCase())
    ? `${value} ${unit}`
    : value;
}

function fieldInput(
  field,
  key,
  value,
  scope = "clinical",
  enabled = Boolean(value),
) {
  const attr = `data-${scope}-value="${key}"`,
    disabled = scope === "clinical" && !enabled ? "disabled" : "";
  if (field.type === "select") {
    return `<select ${attr} ${disabled}><option value="">${escapeHTML(
      field.placeholder || "Select",
    )}</option>${field.options
      .map(
        (option) =>
          `<option ${value === option ? "selected" : ""}>${escapeHTML(
            option,
          )}</option>`,
      )
      .join("")}</select>`;
  }
  return `<div class="field-input-wrap"><input ${attr} type="${
    field.type === "number" ? "number" : "text"
  }" value="${escapeHTML(value || "")}" placeholder="${escapeHTML(
    field.placeholder || "",
  )}" ${field.min !== undefined ? `min="${field.min}"` : ""} ${
    field.max !== undefined ? `max="${field.max}"` : ""
  } ${disabled}>${
    field.unit ? `<span>${escapeHTML(field.unit)}</span>` : ""
  }</div>`;
}

function searchable(item) {
  return [
    item.title,
    item.meta,
    ...(item.gather || []),
    ...(item.medmanagement || []),
    ...(item.redflags || []),
    ...(item.branches || []).flatMap((x) => [x.tag, ...x.content]),
    ...(item.triage || []).map((x) => x.text),
    item.script,
    item.source,
  ]
    .join(" ")
    .toLowerCase();
}

function navigate(route, payload = null, push = true) {
  if (push && state.route)
    state.previous.push({
      route: state.route,
      payload: state.payload,
      wizardTrail: [...state.wizardTrail],
    });
  state.route = route;
  state.payload = payload;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  app.focus({ preventScroll: true });
}

function startWizard(flowId) {
  const flow = WORKFLOWS.find((item) => item.id === flowId);
  if (!flow) return;
  state.previous.push({
    route: state.route,
    payload: state.payload,
    wizardTrail: [...state.wizardTrail],
  });
  state.wizardTrail = [{ label: flow.title, node: flow.start }];
  state.route = "wizard";
  state.payload = { flowId, nodeId: flow.start };
  render();
  window.scrollTo(0, 0);
}

function chooseWizard(choice) {
  state.previous.push({
    route: state.route,
    payload: state.payload,
    wizardTrail: [...state.wizardTrail],
  });
  state.wizardTrail.push({
    label: choice.label,
    node: choice.next,
    target: choice.target,
  });
  if (choice.next) {
    state.route = "wizard";
    state.payload = { flowId: state.payload.flowId, nodeId: choice.next };
  } else if (choice.target) {
    state.route = "detail";
    state.payload = {
      id: choice.target,
      focus: choice.focus || null,
      wizard: true,
    };
  }
  render();
  window.scrollTo(0, 0);
}

function goBack() {
  const prev = state.previous.pop();
  prev
    ? ((state.route = prev.route),
      (state.payload = prev.payload),
      (state.wizardTrail = prev.wizardTrail || []),
      render())
    : navigate("home", null, false);
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}

function conditionCard(item) {
  const favorite = state.favorites.includes(item.id);
  return `<article class="condition-card" data-open="${
    item.id
  }" style="--accent:${item.color}">
    <span class="condition-symbol"></span><div><h3>${escapeHTML(
      item.title,
    )}</h3><p>${escapeHTML(item.meta)}</p></div>
    <button class="favorite mini ${
      favorite ? "on" : ""
    }" data-favorite="${item.id}" aria-label="${
      favorite ? "Remove from" : "Add to"
    } favorites">★</button><span class="row-chevron">›</span>
  </article>`;
}

function pageHeader(kicker, title, copy = "") {
  return `<div class="page-heading"><span>${kicker}</span><h1>${title}</h1>${
    copy ? `<p>${copy}</p>` : ""
  }</div>`;
}

function renderHome() {
  const recent = state.recent
    .map((id) => byId[id])
    .filter(Boolean)
    .slice(0, 3);
  app.innerHTML = `<section class="hero">
    <div class="hero-status"><i></i>Ready offline</div><h1>What are you<br>covering?</h1><p>Fast answers for the next call, organized around the way you work.</p>
    <button class="search-launch" data-nav="search"><span>⌕</span><span>Search conditions, meds, thresholds…</span><kbd>⌘ K</kbd></button>
  </section>
  <section class="section"><div class="section-title"><span>Clinical workflows</span><small>Choose your setting</small></div>
    <div class="workflow-grid">${WORKFLOWS.map(
      (w) =>
        `<button class="workflow-card" data-workflow="${w.id}"><span class="workflow-icon">${w.icon}</span><strong>${w.title}</strong><small>${w.subtitle}</small><i>›</i></button>`,
    ).join(
      "",
    )}<button class="workflow-card calculator-entry" data-nav="calculators"><span class="workflow-icon">▦</span><strong>Clinical Calculators</strong><small>Seven bedside scoring tools</small><i>›</i></button></div>
  </section>
  ${
    recent.length
      ? `<section class="section"><div class="section-title"><span>Pick up where you left off</span><button data-nav="recent">See all</button></div><div class="condition-list">${recent
          .map(conditionCard)
          .join("")}</div></section>`
      : ""
  }
  <aside class="safety-note"><span>!</span><p><strong>Clinical reference only</strong>Always confirm local protocols and attending preferences. When in doubt, call early.</p></aside>`;
}

function renderBreadcrumbs(includeCurrent = true) {
  const parts = [
    { label: "Home", home: true },
    ...state.wizardTrail.slice(0, includeCurrent ? undefined : -1),
  ];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts
    .map(
      (part, i) =>
        `<button ${part.home ? "data-crumb-home" : `data-crumb="${i - 1}"`}>${escapeHTML(part.label)}</button>${i < parts.length - 1 ? "<span>›</span>" : ""}`,
    )
    .join("")}</nav>`;
}

function renderWizard(payload) {
  const flow = WORKFLOWS.find((item) => item.id === payload.flowId),
    node = flow?.nodes[payload.nodeId];
  if (!node) return navigate("home", null, false);
  app.innerHTML = `<section class="wizard-page">${renderBreadcrumbs()}<div class="wizard-question"><span>${escapeHTML(
    node.eyebrow || flow.title,
  )}</span><h1>${escapeHTML(node.question)}</h1><p>Choose the best match.</p></div>
    <div class="answer-grid">${node.choices
      .map(
        (choice, index) =>
          `<button data-choice="${index}"><span>${escapeHTML(
            choice.icon || "›",
          )}</span><strong>${escapeHTML(choice.label)}</strong><i>›</i></button>`,
      )
      .join("")}</div>
    <button class="wizard-cancel" data-crumb-home>Cancel and return home</button></section>`;
}

function renderCollection(type) {
  const ids = type === "favorites" ? state.favorites : state.recent;
  const items = ids.map((id) => byId[id]).filter(Boolean);
  const labels =
    type === "favorites"
      ? ["Saved", "Favorites", "Your bookmarked clinical references."]
      : [
          "History",
          "Recently Viewed",
          "Your latest workflows, stored only on this device.",
        ];
  app.innerHTML = `${pageHeader(...labels)}${
    items.length
      ? `<div class="condition-list">${items.map(conditionCard).join("")}</div>`
      : `<div class="empty"><span>${
          type === "favorites" ? "☆" : "◷"
        }</span><h2>Nothing here yet</h2><p>${
          type === "favorites"
            ? "Tap the star on a condition to keep it close."
            : "Opened conditions will appear here."
        }</p></div>`
  }`;
}

function renderSearch() {
  app.innerHTML = `${pageHeader(
    "Find anything",
    "Search",
    "Searches every title, question, medication, threshold, red flag and reference.",
  )}
    <label class="search-field"><span>⌕</span><input id="globalSearch" type="search" placeholder="Try “Keppra” or “midline shift”" autocomplete="off" autocapitalize="none"><button id="clearSearch" aria-label="Clear">×</button></label>
    <div id="searchResults"><div class="search-hint"><span>⌕</span><p>Type any term to search the complete clinical library.</p></div></div>`;
  requestAnimationFrame(() => document.querySelector("#globalSearch").focus());
}

function calculatorCard(calc) {
  return `<button class="calculator-card" data-calculator="${calc.id}"><span>${
    calc.icon
  }</span><div><strong>${escapeHTML(calc.title)}</strong><small>${escapeHTML(
    calc.description.split(".")[0],
  )}.</small></div><i>›</i></button>`;
}

function renderCalculatorCenter() {
  app.innerHTML = `${pageHeader(
    "Bedside tools",
    "Clinical Calculators",
    "Immediate, offline scoring with no patient information retained.",
  )}<div class="calculator-list">${CALCULATORS.map(calculatorCard).join(
    "",
  )}</div><p class="calculator-safety">Scores support—not replace—clinical assessment, attending judgment, and local protocol.</p>`;
}

function currentCalcValues(calc) {
  const values = { ...(CALC_STATE[calc.id] || {}) };
  for (const field of calc.fields)
    if (values[field.key] === undefined)
      values[field.key] =
        field.default ??
        (field.type === "number" ? "" : field.options[0].value);
  calc.hydrate?.(values);
  CALC_STATE[calc.id] = values;
  return values;
}

const CALCULATOR_COMM_MAP = {
  gcs: { field: "gcs", sentence: (value) => `GCS is ${value}.` },
  abc2: {
    field: "volume",
    sentence: (value) => `Estimated hematoma volume is ${value} mL.`,
  },
  ich: { sentence: (value) => `ICH Score is ${value}.` },
  "hunt-hess": {
    field: "hunt",
    sentence: (value) => `Hunt-Hess grade ${value}.`,
  },
  "modified-fisher": {
    field: "fisher",
    sentence: (value) =>
      `Modified Fisher grade ${["0", "I", "II", "III", "IV"][+value] || value}.`,
  },
  tlics: { field: "tlics", sentence: (value) => `TLICS score is ${value}.` },
  asia: {
    field: "asia",
    sentence: (value) => `ASIA impairment grade ${value}.`,
  },
};

function syncCalculatorResult(calc) {
  const active = state.activeCase,
    result = calc.calculate(currentCalcValues(calc)),
    valid =
      result.score !== "—" && result.score !== "" && result.score !== null;
  if (!active || !calc.workflows.includes(active.id)) return;
  const draft = getCommDraft(active),
    mapping = CALCULATOR_COMM_MAP[calc.id] || {},
    value = String(result.score);
  draft.calculatorResults ??= {};
  draft.calculatorOwned ??= {};
  if (!valid) {
    delete draft.calculatorResults[calc.id];
    if (mapping.field && draft.calculatorOwned[mapping.field]) {
      draft.values[mapping.field] = "";
      draft.enabled[mapping.field] = false;
      delete draft.calculatorOwned[mapping.field];
    }
  } else {
    draft.calculatorResults[calc.id] = {
      id: calc.id,
      label: calc.short,
      value,
      unit: result.unit || "",
      sentence: mapping.sentence
        ? mapping.sentence(value)
        : `${calc.short} is ${value}${result.unit ? ` ${result.unit}` : ""}.`,
    };
    if (mapping.field && draft.keys.includes(mapping.field)) {
      draft.values[mapping.field] = value;
      draft.enabled[mapping.field] = true;
      draft.calculatorOwned[mapping.field] = true;
    }
  }
  const records = Object.values(draft.calculatorResults);
  draft.values.calculators = records
    .map(
      (entry) =>
        `${entry.label} ${entry.value}${entry.unit ? ` ${entry.unit}` : ""}`,
    )
    .join(", ");
  draft.enabled.calculators = records.length > 0;
}

function clearCalculatorResult(id) {
  const active = state.activeCase;
  if (!active?.draft) return;
  const draft = active.draft,
    mapping = CALCULATOR_COMM_MAP[id] || {};
  delete draft.calculatorResults?.[id];
  if (mapping.field && draft.calculatorOwned?.[mapping.field]) {
    draft.values[mapping.field] = "";
    draft.enabled[mapping.field] = false;
    delete draft.calculatorOwned[mapping.field];
  }
  const records = Object.values(draft.calculatorResults || {});
  draft.values.calculators = records
    .map(
      (entry) =>
        `${entry.label} ${entry.value}${entry.unit ? ` ${entry.unit}` : ""}`,
    )
    .join(", ");
  draft.enabled.calculators = records.length > 0;
}

function calcResultHTML(result) {
  return `<span>${escapeHTML(result.label || "Current result")}</span><div><strong>${escapeHTML(
    result.score,
  )}</strong>${result.unit ? `<b>${escapeHTML(result.unit)}</b>` : ""}</div><p>${escapeHTML(
    result.interpretation || "",
  )}</p>${
    result.details?.length
      ? `<ul>${result.details.map((line) => `<li>${escapeHTML(line)}</li>`).join("")}</ul>`
      : ""
  }${result.note ? `<aside>${escapeHTML(result.note)}</aside>` : ""}`;
}

function renderCalculator(id) {
  const calc = CALCULATORS.find((item) => item.id === id);
  if (!calc) return navigate("calculators", null, false);
  const values = currentCalcValues(calc),
    result = calc.calculate(values),
    active =
      state.activeCase && calc.workflows.includes(state.activeCase.id)
        ? state.activeCase
        : null;
  app.innerHTML = `<article class="calculator-page"><div class="calc-heading"><span>Clinical calculator</span><h1>${escapeHTML(
    calc.title,
  )}</h1><p>${escapeHTML(calc.description)}</p></div><div class="calc-result">${calcResultHTML(
    result,
  )}</div>${
    active
      ? `<div class="calc-comm-preview"><span>Doctor communication · active case</span><p id="calculatorCommunicationPreview">${escapeHTML(
          buildSummary(active),
        )}</p></div>`
      : ""
  }<form id="calculatorForm">${renderCalculatorForm(calc)}</form><button class="reset-calculator" data-reset-calculator="${
    calc.id
  }">Reset calculator</button><p class="calculator-safety">Clinical reference only. Confirm the examination and apply clinical judgment.</p></article>`;
}

function runSearch(query) {
  const target = document.querySelector("#searchResults");
  const q = query.trim().toLowerCase();
  if (!q) {
    target.innerHTML = `<div class="search-hint"><span>⌕</span><p>Type any term to search the complete clinical library.</p></div>`;
    return;
  }
  const terms = q.split(/\s+/);
  const matches = allItems.filter((item) =>
    terms.every((term) => searchable(item).includes(term)),
  );
  target.innerHTML = `<div class="result-count">${matches.length} ${
    matches.length === 1 ? "result" : "results"
  }</div>${
    matches.length
      ? `<div class="condition-list">${matches.map(conditionCard).join("")}</div>`
      : `<div class="empty"><span>∅</span><h2>No match</h2><p>Try a medication, diagnosis, symptom, or threshold.</p></div>`
  }`;
}

function renderContacts() {
  app.innerHTML = `${pageHeader(
    "Settings",
    "Contacts",
    "Saved only on this device. Contacts are used for Call and Text handoffs.",
  )}<div class="contacts-list">${
    state.contacts.length
      ? state.contacts
          .map(
            (contact, index) =>
              `<article><div><strong>${escapeHTML(contact.name)}</strong><small>${escapeHTML(
                contact.phone,
              )}</small></div><button data-edit-contact="${index}">Edit</button><button class="delete" data-delete-contact="${index}">Delete</button></article>`,
          )
          .join("")
      : `<div class="empty compact"><span>♙</span><h2>No contacts saved</h2><p>Add an attending to use one-tap Call and Text.</p></div>`
  }</div><button class="primary-action" data-add-contact>＋ Add Contact</button><details class="shortcut-setup"><summary>Optional Apple Shortcut for prefilled Messages <span>⌄</span></summary><div><p>Apple’s documented SMS link can choose a recipient but cannot include message text. For a fully prefilled handoff, create a Shortcut named <strong>NSGY Call Message</strong> that receives text, gets the dictionary from the input, and uses its <strong>phone</strong> and <strong>message</strong> values in a “Send Message” action with “Show When Run” enabled.</p><label><input type="checkbox" id="shortcutToggle" ${
    state.useShortcut ? "checked" : ""
  }><span></span>Use “NSGY Call Message” Shortcut for Text</label><button data-open-shortcuts>Open Shortcuts</button></div></details>`;
}

function renderContactEditor(index) {
  const contact =
    index === null ? { name: "", phone: "" } : state.contacts[index];
  app.innerHTML = `${pageHeader(
    "Contacts",
    index === null ? "Add Contact" : "Edit Contact",
    "This information never leaves this device.",
  )}<form class="contact-form" id="contactForm" data-index="${
    index === null ? "" : index
  }"><label>Name<input name="name" required autocomplete="name" value="${escapeHTML(
    contact?.name || "",
  )}" placeholder="Attending name"></label><label>Phone Number<input name="phone" required inputmode="tel" autocomplete="tel" value="${escapeHTML(
    contact?.phone || "",
  )}" placeholder="(555) 555-5555"></label><button type="submit">Save Contact</button></form>`;
}

function communicationDefaults(id, focus) {
  const item = byId[id],
    values = { diagnosis: focus || item.title };
  const calcParts = CALCULATORS.filter(
    (calc) => calc.workflows.includes(id) && CALC_STATE[calc.id],
  ).map((calc) => {
    const result = calc.calculate(currentCalcValues(calc));
    return `${calc.short} ${result.score}${
      result.unit ? ` ${result.unit}` : ""
    }`;
  });
  if (calcParts.length) values.calculators = calcParts.join(", ");
  const procedure = state.wizardTrail.find(
    (part, index) =>
      index > 0 &&
      [
        "ACDF",
        "TLIF",
        "PLIF",
        "Craniotomy",
        "VP Shunt",
        "Craniectomy",
      ].includes(part.label),
  );
  if (procedure) values.procedure = procedure.label;
  return values;
}

function getCommDraft(payload) {
  const activeMatch =
      state.activeCase?.id === payload.id &&
      state.activeCase?.focus === (payload.focus || null),
    pathKey = (
      payload.path ||
      (activeMatch ? state.activeCase.path : []) ||
      []
    ).join(">"),
    key = `${payload.id}:${payload.focus || ""}:${pathKey}`;
  let draft = activeMatch
    ? state.activeCase.draft
    : state.communicationDrafts[key];
  if (!draft) {
    const configured = COMM_WORKFLOWS[payload.id] || COMM_DEFAULT,
      keys = configured.includes("findings")
        ? configured
        : [...configured.slice(0, -1), "findings", configured.at(-1)],
      values = communicationDefaults(payload.id, payload.focus);
    draft = {
      keys,
      values,
      enabled: Object.fromEntries(keys.map((k) => [k, Boolean(values[k])])),
      calculatorResults: {},
      calculatorOwned: {},
    };
    state.communicationDrafts[key] = draft;
  }
  if (activeMatch) state.activeCase.draft = draft;
  return draft;
}

function wizardContext(payload) {
  const path = (payload.path || []).filter(Boolean),
    source = path[0] || "",
    choices = path.slice(1),
    last = choices.at(-1) || "",
    modifier = choices.includes("Traumatic")
      ? "traumatic"
      : choices.includes("Spontaneous")
        ? "spontaneous"
        : "";
  const sourceText =
    {
      "Emergency Department": "ED consult",
      ICU: "ICU call",
      "Floor Calls": "Floor call",
      "Outside Hospital Transfer": "Outside hospital transfer",
      "Post-op Patient": "Post-op call",
    }[source] || source;
  const focusText = payload.focus
    ? payload.focus.charAt(0).toLowerCase() + payload.focus.slice(1)
    : "";
  let topic = focusText ? `${modifier} ${focusText}`.trim() : last;
  const topics = {
    "EVD / ICP": "EVD/ICP concern",
    "Spine Trauma": "spine trauma",
    "Traumatic Bleed": "traumatic bleed",
    "New Change": "new neurologic concern",
  };
  topic = topics[topic] || topics[last] || topic;
  if (choices.includes("Spine") && last === "Trauma") topic = "spine trauma";
  if (!topic && payload.id) topic = byId[payload.id]?.title || "";
  return { source: sourceText, topic };
}

function demographicsPanel(payload) {
  const draft = getCommDraft(payload),
    age = String(draft.values.age || ""),
    sex = String(draft.values.sex || "").toLowerCase();
  return `<section class="demographics"><div><label for="patientAge">Age</label><input id="patientAge" data-demographic-age type="number" inputmode="numeric" min="0" max="125" value="${escapeHTML(
    age,
  )}" placeholder="—"></div><fieldset><legend>Sex</legend><button type="button" data-demographic-sex="male" class="${
    sex === "male" ? "selected" : ""
  }">M</button><button type="button" data-demographic-sex="female" class="${
    sex === "female" ? "selected" : ""
  }">F</button></fieldset></section>`;
}

function selectedValue(draft, key) {
  const readValue = (name) =>
    draft.enabled[name] && String(draft.values[name] || "").trim()
      ? String(draft.values[name]).trim()
      : "";
  let value = readValue(key);
  if (key === "imaging") {
    const additions = [
      readValue("hydrocephalus") &&
        `hydrocephalus ${readValue("hydrocephalus")}`,
      readValue("ivh") && `IVH ${readValue("ivh")}`,
    ].filter(Boolean);
    value = [value, ...additions].filter(Boolean).join("; ");
  }
  if (key === "notes")
    value = [readValue("findings"), value].filter(Boolean).join("; ");
  if (!value) return "";
  const unit = COMM_FIELDS[key]?.unit;
  return unit && !value.toLowerCase().endsWith(unit.toLowerCase())
    ? `${value} ${unit}`
    : value;
}

function buildSummary(payload) {
  const d = getCommDraft(payload),
    v = (k) => selectedValue(d, k),
    sent = [];
  let lead = "";
  if (v("age") && v("sex"))
    lead = `I’m calling about a ${v("age")}-year-old ${v("sex")}`;
  else if (v("age")) lead = `I’m calling about a ${v("age")}-year-old patient`;
  else if (v("sex")) lead = `I’m calling about a ${v("sex")} patient`;
  else lead = "I’m calling about a patient";
  if (v("diagnosis")) lead += ` with ${v("diagnosis")}`;
  if (v("procedure"))
    lead += ` after ${v("procedure")}${
      v("pod") ? ` on postoperative day ${v("pod")}` : ""
    }`;
  sent.push(lead + ".");
  if (v("mechanism")) sent.push(`The mechanism was ${v("mechanism")}.`);
  if (v("sahday")) sent.push(`This is SAH day ${v("sahday")}.`);
  if (v("symptoms")) sent.push(`The current concern is ${v("symptoms")}.`);
  if (v("seizure")) sent.push(`The seizure was described as ${v("seizure")}.`);
  if (v("fever")) sent.push(`Infectious findings include ${v("fever")}.`);
  if (v("wound")) sent.push(`The wound is ${v("wound")}.`);
  const exam = [
    v("exam"),
    v("gcs") && `GCS ${v("gcs")}`,
    v("pupils") && `pupils ${v("pupils")}`,
    v("motor") && `motor ${v("motor")}`,
    v("sensory") && `sensation ${v("sensory")}`,
    v("saddle") && `saddle sensation ${v("saddle")}`,
    v("bladder") && `bowel/bladder ${v("bladder")}`,
    v("cranial") && `cranial nerves ${v("cranial")}`,
    v("icp") && `ICP ${v("icp")}`,
    v("hunt") && `Hunt–Hess ${v("hunt")}`,
  ].filter(Boolean);
  if (exam.length) sent.push(`Neurologically, ${exam.join("; ")}.`);
  const imaging = [
    v("imaging"),
    v("thickness") && `hematoma thickness ${v("thickness")}`,
    v("shift") && `midline shift ${v("shift")}`,
    v("volume") && `hematoma volume ${v("volume")}`,
    v("fracture"),
    v("mri") && `MRI ${v("mri")}`,
    v("cord") && `cord compression ${v("cord")}`,
    v("stability") && `stability ${v("stability")}`,
    v("fisher") && `modified Fisher ${v("fisher")}`,
  ].filter(Boolean);
  if (imaging.length) sent.push(`Imaging shows ${imaging.join("; ")}.`);
  if (v("repeatct")) sent.push(`Repeat CT is ${v("repeatct")}.`);
  const management = [
    v("bloodthinner") && `antithrombotic status: ${v("bloodthinner")}`,
    v("reversal") && `reversal: ${v("reversal")}`,
    v("aneurysm") && `aneurysm: ${v("aneurysm")}`,
    v("drain") && `drain: ${v("drain")}`,
    v("calculators"),
    v("asia") && `ASIA ${v("asia")}`,
    v("tlics") && `TLICS ${v("tlics")}`,
    v("operative") && `operative criteria: ${v("operative")}`,
  ].filter(Boolean);
  if (management.length)
    sent.push(`Additional key data: ${management.join("; ")}.`);
  if (v("recommendations"))
    sent.push(`The proposed neurosurgical plan is ${v("recommendations")}.`);
  if (v("notes")) sent.push(v("notes").replace(/[.!?]$/, "") + ".");
  return sent.join(" ");
}

function buildSummary(payload) {
  const d = getCommDraft(payload),
    v = (key) => selectedValue(d, key),
    sent = [],
    context = wizardContext(payload),
    calculated = d.calculatorResults || {},
    hasCalc = (id) => Boolean(calculated[id]),
    age = v("age"),
    sex = v("sex").toLowerCase(),
    diagnosis = v("diagnosis"),
    demographic =
      age && sex
        ? `a ${age}-year-old ${sex}`
        : age
          ? `a ${age}-year-old patient`
          : sex
            ? `a ${sex} patient`
            : "";
  let lead = "";

  if (context.source) {
    lead =
      context.source +
      (demographic ? ` for ${demographic}` : "") +
      (context.topic
        ? `${demographic ? " with " : " for "}${context.topic}`
        : "");
  } else if (demographic) {
    lead = demographic.charAt(0).toUpperCase() + demographic.slice(1);
  }

  if (diagnosis && !context.topic) {
    lead += lead
      ? `${demographic ? " with " : " for "}${diagnosis}`
      : `Regarding ${diagnosis}`;
  }

  if (v("procedure")) {
    lead += `${lead ? " after " : "Post-op after "}${v("procedure")}${
      v("pod") ? ` on postoperative day ${v("pod")}` : ""
    }`;
  }

  if (lead) {
    sent.push(
      lead
        .replace(/^./, (letter) => letter.toUpperCase())
        .replace(/[.!?]?$/, "."),
    );
  }

  if (v("mechanism")) sent.push(`The mechanism was ${v("mechanism")}.`);
  if (v("sahday")) sent.push(`This is SAH day ${v("sahday")}.`);
  if (v("symptoms")) sent.push(`The current concern is ${v("symptoms")}.`);
  if (v("seizure")) sent.push(`The seizure was described as ${v("seizure")}.`);
  if (v("fever")) sent.push(`Infectious findings include ${v("fever")}.`);
  if (v("wound")) sent.push(`The wound is ${v("wound")}.`);

  if (hasCalc("gcs")) {
    sent.push(calculated.gcs.sentence);
  } else if (v("gcs")) {
    sent.push(`GCS is ${v("gcs")}.`);
  }

  const exam = [
    v("exam"),
    v("pupils") && `pupils ${v("pupils")}`,
    v("motor") && `motor ${v("motor")}`,
    v("sensory") && `sensation ${v("sensory")}`,
    v("saddle") && `saddle sensation ${v("saddle")}`,
    v("bladder") && `bowel/bladder ${v("bladder")}`,
    v("cranial") && `cranial nerves ${v("cranial")}`,
    v("icp") && `ICP ${v("icp")}`,
    !hasCalc("hunt-hess") && v("hunt") && `Hunt–Hess ${v("hunt")}`,
  ].filter(Boolean);

  if (exam.length) sent.push(`Neurologically, ${exam.join("; ")}.`);

  if (hasCalc("hunt-hess")) sent.push(calculated["hunt-hess"].sentence);
  if (hasCalc("modified-fisher")) {
    sent.push(calculated["modified-fisher"].sentence);
  }

  const ct = [
    v("thickness") && `an ${v("thickness")} SDH`,
    v("shift") && `${v("shift")} of midline shift`,
  ].filter(Boolean);

  if (ct.length) sent.push(`CT demonstrates ${ct.join(" with ")}.`);

  const imaging = [
    v("imaging"),
    !hasCalc("abc2") && v("volume") && `hematoma volume ${v("volume")}`,
    v("fracture"),
    v("mri") && `MRI ${v("mri")}`,
    v("cord") && `cord compression ${v("cord")}`,
    v("stability") && `stability ${v("stability")}`,
    !hasCalc("modified-fisher") &&
      v("fisher") &&
      `modified Fisher ${v("fisher")}`,
  ].filter(Boolean);

  if (imaging.length) sent.push(`Imaging shows ${imaging.join("; ")}.`);

  if (hasCalc("abc2")) sent.push(calculated.abc2.sentence);
  if (v("repeatct")) sent.push(`Repeat CT is ${v("repeatct")}.`);
  if (hasCalc("ich")) sent.push(calculated.ich.sentence);

  if (v("bloodthinner")) {
    sent.push(
      v("bloodthinner").toLowerCase() === "none"
        ? "The patient is not taking anticoagulation or antiplatelet therapy."
        : `The patient is taking ${v("bloodthinner")}.`,
    );
  }

  if (v("reversal")) {
    sent.push(
      `${v("reversal").replace(/^./, (letter) => letter.toUpperCase())}.`,
    );
  }

  if (hasCalc("tlics")) sent.push(calculated.tlics.sentence);
  if (hasCalc("asia")) sent.push(calculated.asia.sentence);

  const management = [
    v("aneurysm") && `aneurysm: ${v("aneurysm")}`,
    v("drain") && `drain: ${v("drain")}`,
    !hasCalc("asia") && v("asia") && `ASIA ${v("asia")}`,
    !hasCalc("tlics") && v("tlics") && `TLICS ${v("tlics")}`,
    v("operative") && `operative criteria: ${v("operative")}`,
  ].filter(Boolean);

  if (management.length) {
    sent.push(`Additional key data: ${management.join("; ")}.`);
  }

  if (v("recommendations")) {
    sent.push(`The proposed neurosurgical plan is ${v("recommendations")}.`);
  }

  if (v("notes")) sent.push(v("notes").replace(/[.!?]$/, "") + ".");

  return sent.join(" ");
}

function renderCommunication(payload) {
  const item = byId[payload.id],
    draft = getCommDraft(payload),
    summary = buildSummary(payload),
    detailKeys = draft.keys.filter((key) => !["age", "sex"].includes(key));

  app.innerHTML = `<article class="communication-page">${pageHeader(
    item.title,
    "Build Communication",
    "Choose what to include. Empty fields are always omitted.",
  )}<div class="comm-preview"><span>Live preview</span><p id="summaryPreview">${escapeHTML(
    summary,
  )}</p></div>${demographicsPanel(payload)}<details class="clinical-fields communication-details"><summary><span>＋</span><div><strong>Case Details & Clinical Findings</strong><small>Tap to select additional information</small></div><i>⌄</i></summary><div class="clinical-fields-body"><div class="comm-fields">${detailKeys
    .map((key) => {
      const field = COMM_FIELDS[key];
      return `<div class="comm-field ${
        draft.enabled[key] ? "enabled" : ""
      }"><label><input type="checkbox" data-comm-check="${key}" ${
        draft.enabled[key] ? "checked" : ""
      }><span></span>${escapeHTML(field.label)}</label>${fieldInput(
        field,
        key,
        draft.values[key] || "",
        "comm",
      )}</div>`;
    })
    .join(
      "",
    )}</div></div></details><section class="comm-actions"><button data-comm-action="call"><span>☎</span>Call</button><button data-comm-action="text"><span>▣</span>Text</button><button data-copy-communication><span>▤</span>Copy Summary</button></section><p class="privacy-note">Draft details stay in memory only and are cleared when the app closes.</p></article>`;

  document
    .querySelectorAll(".comm-field:not(.enabled) [data-comm-value]")
    .forEach((control) => (control.disabled = true));
}

function renderContactPicker(payload) {
  const summary = buildSummary(payload.communication),
    label = payload.action === "call" ? "Call attending" : "Text attending";

  app.innerHTML = `${pageHeader(
    "Communication",
    label,
    payload.action === "text"
      ? state.useShortcut
        ? "Select a contact to open the configured Shortcut with the recipient and summary."
        : "The summary will be copied, then Messages will open to the selected contact. Paste and review before sending."
      : "Select a saved contact to open the phone dialer.",
  )}<div class="contact-picker">${state.contacts
    .map(
      (contact, index) =>
        `<button data-contact-choice="${index}"><span>${escapeHTML(
          contact.name.slice(0, 1).toUpperCase(),
        )}</span><div><strong>${escapeHTML(
          contact.name,
        )}</strong><small>${escapeHTML(
          contact.phone,
        )}</small></div><i>›</i></button>`,
    )
    .join("")}</div>${
    !state.contacts.length
      ? `<div class="empty compact"><h2>No contacts saved</h2><p>Add an attending first.</p><button data-nav="contacts">Open Contacts</button></div>`
      : ""
  }<div class="summary-mini"><span>Message preview</span><p>${escapeHTML(
    summary,
  )}</p></div>`;
}

function clinicalFieldsPanel(payload) {
  const draft = getCommDraft(payload),
    skip = new Set([
      "age",
      "sex",
      "diagnosis",
      "findings",
      "recommendations",
      "notes",
      "calculators",
    ]),
    keys = draft.keys.filter((key) => !skip.has(key));
  if (!keys.length) return "";
  return `<details class="clinical-fields"><summary><span>＋</span><div><strong>Case Details & Clinical Findings</strong><small>Select a field to include it in Communication</small></div><i>⌄</i></summary><div class="clinical-fields-body">${keys
    .map((key) => {
      const field = COMM_FIELDS[key],
        enabled = !!draft.enabled[key];
      return `<div class="clinical-field ${
        enabled ? "enabled" : ""
      }"><label><input type="checkbox" data-clinical-field-check="${key}" ${
        enabled ? "checked" : ""
      }><span class="checkmark"></span><strong>${escapeHTML(
        field.label,
      )}</strong></label>${fieldInput(field, key, draft.values[key] || "")}</div>`;
    })
    .join("")}</div></details>`;
}

function referenceItems(items) {
  return items
    .map(
      (raw) =>
        `<li>${escapeHTML(typeof raw === "string" ? raw : raw.text)}</li>`,
    )
    .join("");
}

function listBlock(title, items, type, item) {
  if (!items?.length) return "";
  return `<details class="detail-section ${type}" open><summary><span class="section-icon">${
    type === "danger" ? "!" : type === "manage" ? "→" : "✓"
  }</span><strong>${title}</strong><span class="disclosure">⌄</span></summary><div class="section-body"><ul class="reference-list">${referenceItems(
    items,
  )}</ul></div></details>`;
}

function renderDetail(payload) {
  const id = typeof payload === "string" ? payload : payload.id,
    focus = typeof payload === "object" ? payload.focus : null;
  const item = byId[id];
  if (!item) return navigate("home", null, false);
  const path =
      typeof payload === "object" && payload.wizard
        ? state.wizardTrail.map((part) => part.label)
        : [],
    samePath =
      JSON.stringify(state.activeCase?.path || []) === JSON.stringify(path),
    sameCase =
      state.activeCase?.id === id &&
      state.activeCase?.focus === (focus || null) &&
      samePath;
  if (!sameCase)
    state.activeCase = { id, focus: focus || null, path, draft: null };
  state.recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 20);
  save(STORAGE.recent, state.recent);
  const favorite = state.favorites.includes(id);
  const visibleBranches = focus
    ? (item.branches || []).filter(
        (branch) =>
          branch.tag === focus ||
          branch.tag.toLowerCase().includes("seizure prophylaxis"),
      )
    : item.branches || [];
  const relatedCalculators = CALCULATORS.filter((calc) =>
    calc.workflows.includes(item.id),
  );
  const recommendation = RECOMMENDATIONS[item.id],
    recommendationItems = recommendation
      ? [...(recommendation.variants?.[focus] || []), ...recommendation.items]
      : [];
  app.innerHTML = `<article class="detail" style="--accent:${item.color}">
    ${typeof payload === "object" && payload.wizard ? renderBreadcrumbs() : ""}
    <div class="detail-head"><span class="detail-category">${escapeHTML(
      item.section,
    )} · clinical workflow</span><div class="title-row"><h1>${escapeHTML(
      item.title,
    )}</h1><button class="favorite ${
      favorite ? "on" : ""
    }" data-favorite="${id}" aria-label="${
      favorite ? "Remove from" : "Add to"
    } favorites">★</button></div><p>${escapeHTML(item.meta)}</p></div>
    <div class="quick-strip" aria-label="Quick actions"><button data-jump="gather">Before you call</button><button data-jump="danger">Red flags</button><button data-jump="script">Present</button></div>
    ${demographicsPanel({ id, focus })}
    ${clinicalFieldsPanel({ id, focus })}
    ${
      relatedCalculators.length
        ? `<section class="workflow-calculators"><div><span>Integrated tools</span><strong>Calculate without leaving this workflow</strong></div><div>${relatedCalculators
            .map(
              (calc) =>
                `<button data-calculator="${calc.id}"><span>${
                  calc.icon
                }</span>${escapeHTML(calc.short)}<i>›</i></button>`,
            )
            .join("")}</div></section>`
        : ""
    }
    ${
      recommendation
        ? `<details class="recommendations" open><summary><span>☎</span><div><strong>Common NSGY Recommendations</strong><small>Clinical memory aids · not standing orders</small></div><i>⌄</i></summary><div class="recommendation-body"><ul class="reference-list">${referenceItems(
            recommendationItems,
          )}</ul><p>${escapeHTML(recommendation.source)}</p></div></details>`
        : ""
    }
    <div id="gather">${listBlock("Before You Call", item.gather, "gather", item)}</div>
    ${visibleBranches
      .map(
        (b, n) =>
          `<details class="detail-section branch" open><summary><span class="section-icon">${
            n + 1
          }</span><strong>${escapeHTML(
            b.tag,
          )}</strong><span class="disclosure">⌄</span></summary><div class="section-body"><ul class="reference-list">${referenceItems(
            b.content,
          )}</ul></div></details>`,
      )
      .join("")}
    ${listBlock("Medical Management", item.medmanagement, "manage", item)}
    <div id="danger">${listBlock("Red Flags", item.redflags, "danger", item)}</div>
    ${
      item.triage?.length
        ? `<details class="detail-section triage" open><summary><span class="section-icon">↗</span><strong>Phone Triage</strong><span class="disclosure">⌄</span></summary><div class="section-body triage-body">${item.triage
            .map(
              (t) =>
                `<div class="triage-row ${t.type}"><span>${
                  t.type === "home" ? "PHONE" : "DRIVE IN"
                }</span><p>${escapeHTML(t.text)}</p></div>`,
            )
            .join("")}</div></details>`
        : ""
    }
    ${
      item.script
        ? `<section class="presentation" id="script"><div><span>Presentation Script</span><button data-copy="${id}">Copy</button></div><p>“${escapeHTML(
            item.script,
          )}”</p></section>`
        : ""
    }
    ${
      item.source
        ? `<details class="reference"><summary>Reference & source <span>⌄</span></summary><p>${escapeHTML(
            item.source,
          )}</p></details>`
        : ""
    }
    <section class="communication-card"><div><span>↗</span><p><strong>Communication</strong>Build a concise attending summary from entered findings.</p></div><div><button data-start-communication="call"><span>☎</span>Call</button><button data-start-communication="text"><span>▣</span>Text</button><button data-start-communication="copy"><span>▤</span>Copy Summary</button></div></section>
    <p class="detail-disclaimer">Reference only — not a substitute for attending judgment or local protocol.</p>
  </article>`;
}

function render() {
  document.querySelector("#backButton").hidden = state.route === "home";
  document
    .querySelectorAll(".tabbar button")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.route === state.route),
    );
  if (state.route === "home") renderHome();
  else if (state.route === "wizard") renderWizard(state.payload);
  else if (state.route === "detail") renderDetail(state.payload);
  else if (state.route === "search") renderSearch();
  else if (state.route === "calculators") renderCalculatorCenter();
  else if (state.route === "calculator") renderCalculator(state.payload);
  else if (state.route === "contacts") renderContacts();
  else if (state.route === "contact-edit") renderContactEditor(state.payload);
  else if (state.route === "communication") renderCommunication(state.payload);
  else if (state.route === "contact-picker") renderContactPicker(state.payload);
  else renderCollection(state.route);
}

document.addEventListener("click", (event) => {
  const demographicSex = event.target.closest("[data-demographic-sex]");
  if (demographicSex) {
    const payload = workflowPayload(),
      draft = getCommDraft(payload),
      value = demographicSex.dataset.demographicSex,
      selected =
        draft.enabled.sex && String(draft.values.sex).toLowerCase() === value;
    draft.values.sex = selected ? "" : value;
    draft.enabled.sex = !selected;
    demographicSex
      .closest("fieldset")
      .querySelectorAll("[data-demographic-sex]")
      .forEach((button) =>
        button.classList.toggle(
          "selected",
          !selected && button === demographicSex,
        ),
      );
    const preview = document.querySelector("#summaryPreview");
    if (preview) preview.textContent = buildSummary(payload);
    return;
  }
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    event.stopPropagation();
    const id = favorite.dataset.favorite;
    const adding = !state.favorites.includes(id);
    state.favorites = adding
      ? [id, ...state.favorites]
      : state.favorites.filter((x) => x !== id);
    save(STORAGE.favorites, state.favorites);
    render();
    toast(adding ? "Added to favorites" : "Removed from favorites");
    return;
  }
  const open = event.target.closest("[data-open]");
  if (open) {
    navigate("detail", open.dataset.open);
    return;
  }
  const calculator = event.target.closest("[data-calculator]");
  if (calculator) {
    navigate("calculator", calculator.dataset.calculator);
    return;
  }
  const startComm = event.target.closest("[data-start-communication]");
  if (startComm) {
    const active = state.activeCase,
      detail = active
        ? { id: active.id, focus: active.focus, path: active.path }
        : {
            id:
              typeof state.payload === "string"
                ? state.payload
                : state.payload.id,
            focus: state.payload?.focus || null,
            path: [],
          };
    navigate("communication", {
      ...detail,
      intent: startComm.dataset.startCommunication,
    });
    return;
  }
  const commAction = event.target.closest("[data-comm-action]");
  if (commAction) {
    navigate("contact-picker", {
      action: commAction.dataset.commAction,
      communication: state.payload,
    });
    return;
  }
  if (event.target.closest("[data-copy-communication]")) {
    copyText(buildSummary(state.payload)).then(() => toast("Summary copied"));
    return;
  }
  const addContact = event.target.closest("[data-add-contact]");
  if (addContact) {
    navigate("contact-edit", null);
    return;
  }
  const editContact = event.target.closest("[data-edit-contact]");
  if (editContact) {
    navigate("contact-edit", Number(editContact.dataset.editContact));
    return;
  }
  const deleteContact = event.target.closest("[data-delete-contact]");
  if (deleteContact) {
    const index = Number(deleteContact.dataset.deleteContact);
    if (confirm(`Delete ${state.contacts[index].name}?`)) {
      state.contacts.splice(index, 1);
      save(STORAGE.contacts, state.contacts);
      render();
      toast("Contact deleted");
    }
    return;
  }
  const contactChoice = event.target.closest("[data-contact-choice]");
  if (contactChoice) {
    const contact = state.contacts[Number(contactChoice.dataset.contactChoice)],
      number = contact.phone.replace(/[^\d+]/g, ""),
      summary = buildSummary(state.payload.communication);
    if (state.payload.action === "call") {
      window.location.href = `tel:${number}`;
    } else if (state.useShortcut) {
      const payload = JSON.stringify({ phone: number, message: summary });
      window.location.href = `shortcuts://run-shortcut?name=NSGY%20Call%20Message&input=text&text=${encodeURIComponent(
        payload,
      )}`;
    } else {
      copyText(summary).then(() => {
        toast("Summary copied — paste in Messages");
        setTimeout(() => {
          window.location.href = `sms:${number}`;
        }, 250);
      });
    }
    return;
  }
  if (event.target.closest("[data-open-shortcuts]")) {
    window.location.href = "shortcuts://create-shortcut";
    return;
  }
  const calcOption = event.target.closest("[data-calc-option]");
  if (calcOption) {
    setCalcValue(
      state.payload,
      calcOption.dataset.calcOption,
      calcOption.dataset.value,
    );
    const calc = CALCULATORS.find((item) => item.id === state.payload);
    syncCalculatorResult(calc);
    renderCalculator(state.payload);
    return;
  }
  const reset = event.target.closest("[data-reset-calculator]");
  if (reset) {
    delete CALC_STATE[reset.dataset.resetCalculator];
    clearCalculatorResult(reset.dataset.resetCalculator);
    if (reset.dataset.resetCalculator === "gcs") CALC_CONTEXT.gcs = null;
    if (reset.dataset.resetCalculator === "abc2") CALC_CONTEXT.volume = null;
    renderCalculator(reset.dataset.resetCalculator);
    toast("Calculator reset");
    return;
  }
  const workflow = event.target.closest("[data-workflow]");
  if (workflow) {
    startWizard(workflow.dataset.workflow);
    return;
  }
  const choice = event.target.closest("[data-choice]");
  if (choice) {
    const flow = WORKFLOWS.find((x) => x.id === state.payload.flowId),
      node = flow?.nodes[state.payload.nodeId];
    chooseWizard(node.choices[Number(choice.dataset.choice)]);
    return;
  }
  const crumbHome = event.target.closest("[data-crumb-home]");
  if (crumbHome) {
    state.wizardTrail = [];
    navigate("home");
    return;
  }
  const crumb = event.target.closest("[data-crumb]");
  if (crumb) {
    const index = Number(crumb.dataset.crumb);
    state.wizardTrail = state.wizardTrail.slice(0, index + 1);
    const target = state.wizardTrail[index];
    navigate("wizard", {
      flowId:
        state.wizardTrail[0] &&
        WORKFLOWS.find((x) => x.title === state.wizardTrail[0].label)?.id,
      nodeId: target.node,
    });
    return;
  }
  const nav = event.target.closest("[data-nav],.tabbar [data-route]");
  if (nav) {
    navigate(nav.dataset.nav || nav.dataset.route);
    return;
  }
  const jump = event.target.closest("[data-jump]");
  if (jump) {
    document
      .querySelector(`#${jump.dataset.jump}`)
      // Explicitly check and handle smooth window/element navigation layout bounds
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    navigator.clipboard
      ?.writeText(byId[copy.dataset.copy].script)
      .then(() => toast("Presentation copied"));
    return;
  }
  if (event.target.id === "clearSearch") {
    const input = document.querySelector("#globalSearch");
    input.value = "";
    runSearch("");
    input.focus();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-demographic-age]")) {
    const payload = workflowPayload(),
      draft = getCommDraft(payload);
    draft.values.age = event.target.value;
    draft.enabled.age = Boolean(event.target.value);
    const preview = document.querySelector("#summaryPreview");
    if (preview) preview.textContent = buildSummary(payload);
  }

  if (event.target.id === "globalSearch") runSearch(event.target.value);

  if (event.target.matches("[data-calc-number]")) {
    setCalcValue(
      state.payload,
      event.target.dataset.calcNumber,
      event.target.value,
    );
    const calc = CALCULATORS.find((item) => item.id === state.payload);
    syncCalculatorResult(calc);
    document.querySelector(".calc-result").innerHTML = calcResultHTML(
      calc.calculate(currentCalcValues(calc)),
    );
    const preview = document.querySelector("#calculatorCommunicationPreview");
    if (preview && state.activeCase)
      preview.textContent = buildSummary(state.activeCase);
  }

  if (event.target.matches("[data-clinical-field-check]")) {
    const payload = workflowPayload(),
      draft = getCommDraft(payload),
      key = event.target.dataset.clinicalFieldCheck,
      row = event.target.closest(".clinical-field"),
      control = row.querySelector("[data-clinical-value]");
    draft.enabled[key] = event.target.checked;
    row.classList.toggle("enabled", event.target.checked);
    control.disabled = !event.target.checked;
    if (event.target.checked) control.focus();
  }

  if (event.target.matches("[data-clinical-value]")) {
    const payload = workflowPayload(),
      draft = getCommDraft(payload),
      key = event.target.dataset.clinicalValue;
    draft.values[key] = event.target.value;
    draft.enabled[key] = event.target
      .closest(".clinical-field")
      .classList.contains("enabled");
  }

  if (event.target.matches("[data-comm-check]")) {
    const draft = getCommDraft(state.payload),
      key = event.target.dataset.commCheck;
    draft.enabled[key] = event.target.checked;
    const row = event.target.closest(".comm-field"),
      input = row.querySelector("[data-comm-value]");
    row.classList.toggle("enabled", event.target.checked);
    input.disabled = !event.target.checked;
    document.querySelector("#summaryPreview").textContent = buildSummary(
      state.payload,
    );
  }

  if (event.target.matches("[data-comm-value]")) {
    const draft = getCommDraft(state.payload);
    draft.values[event.target.dataset.commValue] = event.target.value;
    document.querySelector("#summaryPreview").textContent = buildSummary(
      state.payload,
    );
  }

  if (event.target.id === "shortcutToggle") {
    state.useShortcut = event.target.checked;
    save(STORAGE.shortcut, state.useShortcut);
  }
});

document.querySelector("#backButton").addEventListener("click", goBack);
document
  .querySelector("#homeButton")
  .addEventListener("click", () => navigate("home"));
document
  .querySelector("#searchButton")
  .addEventListener("click", () => navigate("search"));
document
  .querySelector("#contactsButton")
  .addEventListener("click", () => navigate("contacts"));

document.addEventListener("submit", (event) => {
  if (event.target.id !== "contactForm") return;
  event.preventDefault();
  const form = new FormData(event.target),
    contact = {
      name: String(form.get("name")).trim(),
      phone: String(form.get("phone")).trim(),
    },
    raw = event.target.dataset.index;

  if (!contact.name || !contact.phone) return;

  if (raw === "") state.contacts.push(contact);
  else state.contacts[Number(raw)] = contact;

  save(STORAGE.contacts, state.contacts);
  navigate("contacts");
  toast("Contact saved");
});

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    navigate("search");
  }
  if (e.key === "Escape" && state.route !== "home") goBack();
});

for (const gestureEvent of ["gesturestart", "gesturechange", "gestureend"]) {
  document.addEventListener(gestureEvent, (event) => event.preventDefault(), {
    passive: false,
  });
}

document.addEventListener(
  "touchmove",
  (event) => {
    if (event.touches.length > 1) event.preventDefault();
  },
  { passive: false },
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js"),
  );
}

render();
