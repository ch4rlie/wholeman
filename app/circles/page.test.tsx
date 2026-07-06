import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CirclesPage from "./page";
import { siteConfig } from "@/lib/site";

describe("/circles page", () => {
  it("renders call, offer, agreements, who-for, FAQ, and final CTA", () => {
    render(<CirclesPage />);
    expect(screen.getByText(siteConfig.brotherhoodCall.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.agreements.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.whoFor.forHeader)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Is this therapy\?/ })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.finalCta.header)).toBeInTheDocument();
  });

  it("links apply CTAs to /apply", () => {
    render(<CirclesPage />);
    const applyLinks = screen.getAllByRole("link", { name: /apply for a circle/i });
    expect(applyLinks.length).toBeGreaterThanOrEqual(1);
    applyLinks.forEach((l) => expect(l).toHaveAttribute("href", "/apply"));
  });
});
