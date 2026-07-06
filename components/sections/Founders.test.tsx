import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Founders } from "./Founders";

describe("Founders", () => {
  it("renders both founders with equal billing", () => {
    render(<Founders />);
    expect(screen.getByText("Ccowl")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
    expect(screen.getAllByText("Co-founder")).toHaveLength(2);
  });

  it("renders loud placeholders for missing bio and photo", () => {
    render(<Founders />);
    expect(screen.getAllByText(/bio coming soon/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/photo coming soon/i)).toBeInTheDocument();
  });
});
