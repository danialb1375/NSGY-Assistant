import { describe, it, expect } from "vitest";
import { calculateGCS } from "../calculators/gcs_math.js";

describe("calculateGCS functionality", () => {
  it("calculates a normal maximum GCS", () => {
    const result = calculateGCS(4, 5, 6, false);

    expect(result.total).toBe(15);
    expect(result.display).toBe("15");
    expect(result.intubated).toBe(false);
  });

  it("calculates a normal minimum GCS", () => {
    const result = calculateGCS(1, 1, 1, false);

    expect(result.total).toBe(3);
    expect(result.display).toBe("3");
    expect(result.intubated).toBe(false);
  });

  it("displays appropriately when intubated", () => {
    const result = calculateGCS(2, null, 4, true);

    expect(result.total).toBe(7);
    expect(result.display).toBe("7T");
    expect(result.components.verbal).toBe(1);
    expect(result.intubated).toBe(true);
  });

  it("returns null because eye score invalid", () => {
    const result = calculateGCS(5, 5, 6, false);

    expect(result).toBeNull();
    expect(result).toBeNull();
  });

  it("return null because verbal is missing for non-intubated pt", () => {
    const result = calculateGCS(4, null, 6, false);

    expect(result).toBeNull();
    expect(result).toBeNull();
  });

  it("rejects an invalid motor score", () => {
    const result = calculateGCS(4, 5, 7, false);

    expect(result).toBeNull();
  });
});
