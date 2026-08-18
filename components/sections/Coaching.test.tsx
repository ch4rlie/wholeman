import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Coaching } from "./Coaching";

describe("Coaching", () => {
  it("frames coaching as two guides, not one man", () => {
    render(<Coaching />);
    expect(screen.getByText(/Two men, one mission/)).toBeInTheDocument();
    expect(screen.queryByText(/One man, one mission/)).not.toBeInTheDocument();
  });

  it("sends the coaching CTA to /apply rather than a booking widget", () => {
    render(<Coaching />);
    expect(screen.getByRole("link", { name: /ask about coaching/i })).toHaveAttribute("href", "/apply");
    expect(screen.queryByRole("button", { name: /book/i })).not.toBeInTheDocument();
  });

  it("uses the config-driven label and caption", () => {
    render(<Coaching />);
    expect(screen.getByText("Private coaching")).toBeInTheDocument();
    expect(screen.getByText("Ccowl · co-founder")).toBeInTheDocument();
  });
});
