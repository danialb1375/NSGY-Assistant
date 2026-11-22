import { describe, it, expect } from "vitest";
import { calculateICHScore } from "../calculators/ich_math.js";

describe("ICH Score", () => {
  it("calculates a score of 4", () => {
    const result = calculateICHScore(80, 8, 35, true, false);

    expect(result.score).toBe(4);
  });

  it("calculates a score of 2", () => {
    const result = calculateICHScore(80, 15, 30, false, false);

    expect(result.score).toBe(2);
  });

  it("Invalid input returns null", () => {
    const result = calculateICHScore(65, 15, NaN, false, false);

    expect(result).toBeNull();
  });

  it("Non-boolean input returns null", () => {
    const result = calculateICHScore(65, 15, 30, "false", false);

    expect(result).toBeNull();
  });

  it("handles GCS 4 boundry", () => {
    const result = calculateICHScore(79, 4, 29.9, false, false);

    expect(result.score).toBe(2);
  });

  it("handles GCS 5 boundry", () => {
    const result = calculateICHScore(79, 5, 29.9, false, false);

    expect(result.score).toBe(1);
  });

  it("handles GCS 12 boundry", () => {
    const result = calculateICHScore(79, 12, 29.9, false, false);

    expect(result.score).toBe(1);
  });

  it("handles GCS 13 boundry", () => {
    const result = calculateICHScore(79, 13, 29.9, false, false);

    expect(result.score).toBe(0);
  });

  it("returns the correct component breakdown", () => {
    const result = calculateICHScore(82, 8, 35, true, false);

    expect(result.score).toBe(4);
    expect(result.components).toEqual({
      age: 1,
      gcs: 1,
      volume: 1,
      ivh: 1,
      infratentorial: 0,
    });
  });
});
