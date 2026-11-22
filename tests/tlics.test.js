import { describe, it, expect } from "vitest";
import { CALCULATORS, renderCalculatorForm } from "../calculators/core.js";
import "../calculators/tlics.js";

const tlics = CALCULATORS.find((calc) => calc.id === "tlics");

describe("TLICS calculator testing", () => {
  it("registers the calculator", () => {
    expect(tlics).toBeDefined();
  });
  it.each([
    {
      description: "Valid operative score",
      inputs: { morph: "2", plc: "3", neuro: "0", modifier: "0" },
      expected: 5,
    },
    {
      description: "Valid nonoperative score",
      inputs: { morph: "1", plc: "0", neuro: "0", modifier: "0" },
      expected: 1,
    },
    {
      description: "Valid borderline score",
      inputs: { morph: "2", plc: "2", neuro: "0", modifier: "0" },
      expected: 4,
    },
    {
      description: "Empty string input",
      inputs: { morph: "", plc: "0", neuro: "0", modifier: "0" },
      expected: "—",
    },
    {
      description: "Null input",
      inputs: { morph: null, plc: "2", neuro: "2", modifier: "0" },
      expected: "—",
    },
    {
      description: "Missing field",
      inputs: { morph: "2", neuro: "0", modifier: "0" },
      expected: "—",
    },
    {
      description: "Invalid score input",
      inputs: { morph: "2", plc: "0", neuro: "1", modifier: "0" },
      expected: "—",
    },
  ])(
    "Parameterized testing the output to the UI",
    ({ description, inputs, expected }) => {
      const result = tlics.calculate(inputs);

      expect(result.score).toBe(expected);
      expect(result.label).toBe("TLICS total");
    },
  );
  it("renders the correct TLICS field identifiers", () => {
    // Arrange
    const expectedFields = ["morph", "plc", "neuro", "modifier"];

    // Act
    const html = renderCalculatorForm(tlics);

    // Assert
    for (const field of expectedFields) {
      expect(html).toContain(`data-calc-option="${field}"`);
    }
  });
  it("renders the correct morphology scoring options", () => {
    const html = renderCalculatorForm(tlics);

    for (const score of [0, 1, 2, 3, 4]) {
      expect(html).toContain(`data-calc-option="morph" data-value="${score}"`);
    }
  });
  it("renders the default morphology selection", () => {
    const html = renderCalculatorForm(tlics);

    expect(html).toContain(
      'data-calc-option="morph" data-value="0" class="selected"',
    );
  });
});
