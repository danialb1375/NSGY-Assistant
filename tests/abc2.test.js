import { describe, it, expect, beforeEach } from "vitest"; 
import { CALCULATORS, CALC_CONTEXT } from "../calculators/core.js"; 
import "../calculators/abc2.js";

const abc2 = CALCULATORS.find((calc) => calc.id === "abc2");

beforeEach(() => {
  CALC_CONTEXT.volume = null;
});

describe("ABC/2 hematoma volume calculator", () => {
  it("Asserts the calculator was loaded", () => {
    expect(abc2).toBeDefined();
  });

  it("calculates a typical hematoma volume", () => {
    const result = abc2.calculate({
      a: 4,
      b: 3,
      slices: 4,
      thickness: 0.5,
    });

    expect(result.score).toBe("12.0");
    expect(result.unit).toBe("mL");
    expect(CALC_CONTEXT.volume).toBe(12);
  });

  it("returns a placeholder for incomplete measurements", () => {
    const result = abc2.calculate({
      a: "",
      b: 3,
      slices: 4,
      thickness: 0.5,
    });

    expect(result.score).toBe("—");
    expect(CALC_CONTEXT.volume).toBeNull();
  });

  it("calculates a smaller hematoma volume", () => {
    const result = abc2.calculate({
      a: 2, 
      b: 2,
      slices: 3,
      thickness: 0.5,
    });

    expect(result.score).toBe("3.0");
    expect(CALC_CONTEXT.volume).toBe(3);
  });

  it("clears the previous value when measurement is incomplete", () => {
    // First calculation: valid measurements
    abc2.calculate({
      a: 4,
      b: 3,
      slices: 4,
      thickness: 0.5,
    });

    expect(CALC_CONTEXT.volume).toBe(12);

    //Second Calculation: clinician clears 'a'
    const result = abc2.calculate({
      a: "",
      b: 3,
      slices: 4,
      thickness: 0.5,
    });

    expect(result.score).toBe("—");

    expect(CALC_CONTEXT.volume).toBeNull();
  });

  it("Rejects a negative input value", () => {
    const result = abc2.calculate({
      a: -4,
      b: 3,
      slices: 4,
      thickness: 0.5
    });

    expect(result.score).toBe("—");
    expect(CALC_CONTEXT.volume).toBeNull(); 
  });
  
  it("rejects two negative measurements", () => {
    const result = abc2.calculate({
      a: -4,
      b: -3,
      slices: 4,
      thickness: 0.5,
    });

    expect(result.score).toBe("—");
    expect(CALC_CONTEXT.volume).toBeNull();
  });
  
  it("converts valid numeric strings from HTML inputs", () => {
    const result = abc2.calculate({
      a: "4",
      b: "3",
      slices: "4",
      thickness: "0.5",
    });

    expect(result.score).toBe("12.0");
    expect(CALC_CONTEXT.volume).toBe(12);
  });
});
