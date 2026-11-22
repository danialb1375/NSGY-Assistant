import { escapeHTML } from "../utils.js";

export const CALCULATORS = [];
export const CALC_STATE = {};
export const CALC_CONTEXT = { gcs: null, volume: null };

export function registerCalculator(definition) {
  CALCULATORS.push(definition);
}

export function calcValue(id, key, fallback = null) {
  return CALC_STATE[id]?.[key] ?? fallback;
}

export function setCalcValue(id, key, value) {
  CALC_STATE[id] ??= {};
  CALC_STATE[id][key] = value;
}

export function optionField(calc, field) {
  const selected = String(
    calcValue(calc.id, field.key, field.default ?? field.options[0].value),
  );

  return `<fieldset class="calc-field"><legend>${escapeHTML(
    field.label,
  )}</legend>${
    field.help ? `<p>${escapeHTML(field.help)}</p>` : ""
  }<div class="choice-stack">${field.options
    .map(
      (option) =>
        `<button type="button" data-calc-option="${
          field.key
        }" data-value="${escapeHTML(option.value)}" class="${
          String(option.value) === selected ? "selected" : ""
        }"><span>${escapeHTML(option.label)}</span><b>${escapeHTML(
          option.score ?? option.value,
        )}</b></button>`,
    )
    .join("")}</div></fieldset>`;
}

export function numberField(calc, field) {
  const value = calcValue(calc.id, field.key, field.default ?? "");

  return `<label class="number-field"><span>${escapeHTML(field.label)}${
    field.unit ? ` <small>${escapeHTML(field.unit)}</small>` : ""
  }</span><input inputmode="decimal" type="number" min="${
    field.min ?? 0
  }" max="${field.max ?? 999}" step="${
    field.step ?? 1
  }" data-calc-number="${field.key}" value="${escapeHTML(
    value,
  )}" placeholder="${escapeHTML(field.placeholder || "")}"></label>`;
}

export function renderCalculatorForm(calc) {
  return calc.fields
    .map((field) =>
      field.type === "number"
        ? numberField(calc, field)
        : optionField(calc, field),
    )
    .join("");
}
