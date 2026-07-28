import { formatValue, getWeekNumber } from "../formatters";

describe("formatValue", () => {
  it("renders a dash and muted flag for null or undefined", () => {
    expect(formatValue(null)).toEqual({ text: "—", muted: true });
    expect(formatValue(undefined)).toEqual({ text: "—", muted: true });
  });

  it("marks zero-like values as muted but keeps their text", () => {
    expect(formatValue(0)).toEqual({ text: "0", muted: true });
    expect(formatValue("0 €")).toEqual({ text: "0 €", muted: true });
  });

  it("returns non-muted text for a real value", () => {
    expect(formatValue("42 €")).toEqual({ text: "42 €", muted: false });
    expect(formatValue(42)).toEqual({ text: "42", muted: false });
  });
});

describe("getWeekNumber", () => {
  it("returns week 1 for the first days of January", () => {
    expect(getWeekNumber(new Date(2026, 0, 1))).toBe(1);
  });

  it("returns a mid-year week number consistent with the calendar", () => {
    expect(getWeekNumber(new Date(2026, 6, 19))).toBe(30);
  });
});
