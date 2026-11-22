import { describe, it, expect, beforeEach } from "vitest";
import { CALCULATORS, CALC_CONTEXT } from "../calculators/core.js";

//importing this module registers the GCS calculator
import "../calculators/gcs.js";

const gcs = CALCULATORS.find(calc => calc.id === "gcs");

describe("GCS calculator integration", () => {
  beforeEach(() => {
    CALC_CONTEXT.gcs = null;
  });
  
  it("registers the GCS calculator", () => {
    expect(gcs).toBeDefined();
  });

  it("stores a valid GCS in shared context", () => {
    const result = gcs.calculate({
      eye: 4,
      verbal: 5,
      motor: 6,
      intubated: "no",
    });

    expect(result.score).toBe("15");
    expect(CALC_CONTEXT.gcs).toBe(15);
  });

  it("Nullifies value with an out of bounds input", () => {
    const result = gcs.calculate({
      eye: 5,
      verbal: 5,
      motor: 6,
      intubated: "no",
    });

    expect(CALC_CONTEXT.gcs).toBeNull();
  });
});




