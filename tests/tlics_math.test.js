import { describe, it, expect } from "vitest";
import { calculateTLICS } from "../calculators/tlics_math.js";

describe("TLICS scoring", () => {
  it.each([
    [0, 0, 0, 0, 0, "nonoperative"],
    //Add remaining test cases
    [1, 2, 0, 0, 3, "nonoperative"],
    [2, 2, 0, 0, 4, "borderline"],
    [2, 3, 0, 0, 5, "operative"],
    [4, 3, 3, 2, 12, "operative"],
  ])(
    "scores morphology %i, PLC %i, neuro %i, modifier %i",
    (morph, plc, neuro, modifier, expectedScore, expectedClass) => {
      //Arrange
      const inputs = { morph, plc, neuro, modifier };

      //Act
      const result = calculateTLICS(inputs);

      //Assert
      expect(result.score).toBe(expectedScore);
      expect(result.classification).toBe(expectedClass);
    },
  );
  it.each([
    {
      description: "Negative morphology",
      inputs: { morph: -1, plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "Invalid PLC",
      inputs: { morph: 2, plc: 1, neuro: 0, modifier: 0 },
    },
    {
      description: "Excessive Morphology",
      inputs: { morph: 5, plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "Invalid neurologic score",
      inputs: { morph: 2, plc: 0, neuro: 1, modifier: 0 },
    },
    {
      description: "Invalid modifier",
      inputs: { morph: 2, plc: 0, neuro: 0, modifier: 1 },
    },
    {
      description: "Incorrect data type",
      inputs: { morph: "2", plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "Missing morphology",
      inputs: { plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "Null morphology",
      inputs: { morph: null, plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "Fractional morphology",
      inputs: { morph: 2.5, plc: 0, neuro: 0, modifier: 0 },
    },
    {
      description: "NaN morphology",
      inputs: { morph: NaN, plc: 0, neuro: 0, modifier: 0 },
    },
  ])("rejects: $description", ({ inputs }) => {
    const result = calculateTLICS(inputs);

    expect(result).toBeNull();
  });
});
