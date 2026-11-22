import { describe, it, expect } from "vitest";
import { escapeHTML, normalizeNumber } from "../utils.js";

describe("HTML escape utility", () => {
  it("escapes HTML angle brackets", () => {
    //Arrange
    const input = "<script>";
    //Act
    const result = escapeHTML(input);
    //Assert
    expect(result).toBe("&lt;script&gt;");
  });
  it("escapes double quotation marks", () => {
    const input = 'Patient said "hello"';

    const result = escapeHTML(input);

    //Assert
    expect(result).toBe("Patient said &quot;hello&quot;");
  });
});

describe("HTML parameterized testing", () => {
  it.each([
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&#39;"],
    ["&", "&amp;"],
    [
      '<div class="test">&</div>',
      "&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;",
    ],
  ])("escapes %s as %s", (input, expected) => {
    const result = escapeHTML(input);

    expect(result).toBe(expected);
  });
});

describe("NormalizeNumber function returns NaN appropriately", () => {
  it.each([
    ["", NaN],
    [" ", NaN],
    [null, NaN],
    [undefined, NaN],
    [false, NaN],
    ["abc", NaN],
    ["2", 2],
    ["0", 0],
    [3, 3],
    [" 3 ", 3],
  ])("Input: %j --> returns: %s", (input, expected) => {
    const result = normalizeNumber(input);

    expect(result).toBe(expected);
  });
});
