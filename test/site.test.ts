import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site";

describe("siteConfig circles content", () => {
  it("has 12 survival strategies", () => {
    expect(siteConfig.survival.strategies).toHaveLength(12);
    expect(siteConfig.survival.strategies[0].name).toBe("The Nice Guy");
    expect(siteConfig.survival.strategies[11].name).toBe("The Avoider");
  });

  it("keeps the 988 guardrails verbatim", () => {
    expect(siteConfig.disclaimer).toContain("call/text 988 (US)");
    const faq988 = siteConfig.circlesFaq.filter((f) => f.a.includes("988 (US)"));
    expect(faq988).toHaveLength(2);
  });

  it("has six agreements", () => {
    expect(siteConfig.agreements.items).toHaveLength(6);
    expect(siteConfig.agreements.items[0][0]).toBe("Confidentiality.");
  });

  it("lists both founders with equal billing", () => {
    const names = siteConfig.founders.people.map((p) => p.name);
    expect(names).toEqual(["Ccowl", "Charlie Grove"]);
    expect(siteConfig.founders.people.every((p) => p.role === "Co-founder")).toBe(true);
  });

  it("navigates to circles, coaching, about, podcast", () => {
    expect(siteConfig.nav.map((n) => n.href)).toEqual([
      "/circles",
      "/coaching",
      "/about",
      "/podcast",
    ]);
  });

  it("has the brotherhood call config", () => {
    expect(siteConfig.lumaUrl).toMatch(/^https:\/\/luma\.com\//);
    expect(siteConfig.nextCall.date).toBeTruthy();
    expect(siteConfig.brotherhoodCall.cost).toBe("Free");
  });
});
