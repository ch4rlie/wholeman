import { describe, it, expect } from "vitest";
import { validateApply } from "@/lib/apply-schema";

const valid = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true,
};

describe("validateApply", () => {
  it("accepts a valid application", () => {
    const r = validateApply(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe("Test Man");
  });

  it("rejects missing required fields with per-field errors", () => {
    const r = validateApply({ ...valid, name: "", email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBeTruthy();
      expect(r.errors.email).toBeTruthy();
      expect(r.botDetected).toBe(false);
    }
  });

  it("rejects when agreement is not accepted", () => {
    const r = validateApply({ ...valid, agreement: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.agreement).toBeTruthy();
  });

  it("flags the honeypot without field errors", () => {
    const r = validateApply({ ...valid, website: "spam.example" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });

  it("defaults optional priorExperience to empty string", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priorExperience: _omit, ...rest } = valid;
    const r = validateApply(rest);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.priorExperience).toBe("");
  });
});
