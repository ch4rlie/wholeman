import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApplyForm } from "./ApplyForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("ApplyForm", () => {
  it("offers the four interest options and no payment gate", () => {
    render(<ApplyForm />);
    expect(screen.getByRole("radio", { name: /join a men's circle/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /learn more/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /chat honestly/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /1:1 coaching/i })).toBeInTheDocument();
    expect(screen.queryByText(/\$99\/month/)).not.toBeInTheDocument();
  });
});
