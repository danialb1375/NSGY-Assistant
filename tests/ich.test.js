import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CALC_CONTEXT, CALCULATORS, renderCalculatorForm } from "../calculators/core.js";

import "../calculators/ich.js";

const ich = CALCULATORS.find((calc) => calc.id === "ich");
//Helper function for calculator selection
let calcHelper = (calcId) => { 
  const match = CALCULATORS.find((item) => item.id === calcId);
  return match;
};


describe("ICH Calculator integration", () => {
  beforeEach(() => {
    CALC_CONTEXT.volume = null;
    CALC_CONTEXT.gcs = null;
  });

  it("registers the ICH calculator", () => {
    expect(ich).toBeDefined();
  });

  it("calls the caculatore and returns ICH score 3", () => {
    const result = ich.calculate(
      {
        age: "75",
        gcs: "10",
        volume: "35",
        ivh: "1",
        infra: "0",
      }
    );

    expect(result.score).toBe(3);
  });

  it("handles missing GCS without crashing", () => {
    const result = ich.calculate({
      age: "75",
      gcs: "",
      volume: "35",
      ivh: "1",
      infra: "0",
    });

    expect(result.score).toBe("—");
  });

  it("hydrates ICH volume from shared calculator context", () => {
    //Arrange
    CALC_CONTEXT.volume = 36;

    const values = {
      age: "75",
      gcs: "10",
      volume: "",
      ivh: "1",
      infra: "0",
    };

    //Act
    ich.hydrate(values);

    //Assert
    expect(values.volume).toBe("36.0");
  });

  it("hydrates gcs from shared calculator context", () => {
    //arrange
    CALC_CONTEXT.gcs = 8;

    const values = {
      age: "75",
      gcs: "",
      volume: "35",
      ivh: "1",
      infra: "0",
    };

    //act
    ich.hydrate(values);

    //assert
    expect(values.gcs).toBe(8);
  });

  it("preserves manually entered GCS", () => {
    //Arrange
    CALC_CONTEXT.gcs = 8;

    const values = {
      age: "75",
      gcs: "4",
      volume: "35",
      ivh: "1",
      infra: "0",
    };

    //Act
    ich.hydrate(values);

    //Assert
    expect(values.gcs).toBe("4");
  });

  it("renders the ICH calculator form", () => {
    // Arrange
    const calc = calcHelper("ich");
    // Act
    const html = renderCalculatorForm(calc);
    // Assert
    expect(html).toContain("Glasgow Coma Scale");
    expect(html).toContain('data-calc-number="gcs"');
  });
});
