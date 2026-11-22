import { describe, it, expect } from "vitest";
import { calculateABC2Volume } from "../calculators/abc2_math.js";

describe("ABC/2 pure calculation function", () => {
  it("calculates volume and c for valid measurements", () => {
    expect(calculateABC2Volume(4, 3, 4, 0.5)).toEqual({ c: 2, volume: 12 })

  });
  it("rejects negative measurements", () => {
    const { c, volume: result } = calculateABC2Volume(-4, -3, 4, 0.5);

    expect(result).toBeNull();
    expect(c).toBeNull();
  });

  it("rejects fractional slice counts", () => {
    const { c, volume: result } = calculateABC2Volume(4, 3, 2.5, 0.5);

    expect(result).toBeNull();
    expect(c).toBeNull();
  });

  it("rejects non-finite measurements", () => {
    const { c, volume: result } = calculateABC2Volume(4, 3, 4, Infinity);

    expect(result).toBeNull();
    expect(c).toBeNull();
  });

  it("rejects numeric strings", () => {
    const { c, volume: result } = calculateABC2Volume("4", 3, 4, 0.5);

    expect(result).toBeNull();
    expect(c).toBeNull();
  });
});
