import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the peer-support disclaimer with the 988 crisis line", () => {
    render(<Footer />);
    expect(screen.getByText(/call\/text 988 \(US\)/)).toBeInTheDocument();
    expect(screen.getByText(/not therapy, counseling/)).toBeInTheDocument();
  });
});
