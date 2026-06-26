import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookCall } from "./BookCall";

describe("BookCall", () => {
  it("renders its children as a button", () => {
    render(<BookCall>Book a call</BookCall>);
    expect(screen.getByRole("button", { name: "Book a call" })).toBeInTheDocument();
  });
});
