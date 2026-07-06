import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { siteConfig } from "@/lib/site";

describe("Hero", () => {
  it("makes the brotherhood call the primary CTA", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: siteConfig.hero.primaryCta });
    expect(primary).toHaveAttribute("href", siteConfig.lumaUrl);
  });

  it("links the secondary CTA to /circles and keeps a podcast link", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "/circles");
    expect(screen.getByRole("link", { name: /listen to the podcast/i })).toBeInTheDocument();
  });
});
