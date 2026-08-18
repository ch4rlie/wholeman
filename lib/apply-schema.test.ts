import { describe, it, expect } from "vitest";
import { validateApply, INTEREST_OPTIONS } from "@/lib/apply-schema";

describe("validateApply", () => {
  const base = { name: "Sam", email: "sam@example.com", interest: "join" };

  it("accepts a valid interest submission", () => {
    const r = validateApply({ ...base, message: "hello" });
    expect(r.ok).toBe(true);
  });

  it("defaults message to empty when omitted", () => {
    const r = validateApply(base);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.message).toBe("");
  });

  it("rejects an unknown interest", () => {
    const r = validateApply({ ...base, interest: "nope" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.interest).toBeTruthy();
  });

  it("requires name and email", () => {
    const r = validateApply({ interest: "chat" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBeTruthy();
      expect(r.errors.email).toBeTruthy();
    }
  });

  it("silently drops honeypot submissions", () => {
    const r = validateApply({ ...base, website: "spam" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });

  it("exposes four interest options in order", () => {
    expect(INTEREST_OPTIONS.map((o) => o.value)).toEqual(["join", "learn", "chat", "coaching"]);
  });

  it("accepts coaching as an interest", () => {
    const r = validateApply({ name: "A", email: "a@b.com", interest: "coaching" });
    expect(r.ok).toBe(true);
  });
});
