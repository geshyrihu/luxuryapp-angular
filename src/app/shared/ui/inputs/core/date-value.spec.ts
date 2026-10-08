import {
  isValidDateInputValue,
  normalizeDateInputValue,
  parseDateInputValue,
} from "./date-value";

describe("date input value contract", () => {
  it("normalizes day/month/year input to ISO DateOnly", () => {
    expect(normalizeDateInputValue("31/12/2026")).toBe("2026-12-31");
  });

  it("rejects impossible calendar dates", () => {
    expect(parseDateInputValue("31/02/2026")).toBeNull();
    expect(isValidDateInputValue("31/02/2026")).toBe(false);
  });

  it("keeps empty values for required/optional consumer validation", () => {
    expect(normalizeDateInputValue("")).toBe("");
    expect(isValidDateInputValue("")).toBe(true);
  });
});
