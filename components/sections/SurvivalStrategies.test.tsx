import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SurvivalStrategies } from "./SurvivalStrategies";

describe("SurvivalStrategies", () => {
  it("renders the heading and all 12 archetype triggers", () => {
    render(<SurvivalStrategies />);
    expect(screen.getByText(/survival strategy\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The Nice Guy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The Avoider/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(12);
  });
});
