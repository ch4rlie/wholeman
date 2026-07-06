import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Circles } from "./Circles";
import { siteConfig } from "@/lib/site";

describe("Circles section", () => {
  it("renders the headline and both offers", () => {
    render(<Circles />);
    expect(screen.getByText(/never meant to carry it alone/i)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.brotherhoodCall.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
  });

  it("links the RSVP to Luma and the detail link to /circles", () => {
    render(<Circles />);
    expect(screen.getByRole("link", { name: /rsvp/i })).toHaveAttribute("href", siteConfig.lumaUrl);
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "/circles");
  });
});
