import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const items = [
  { id: "a", title: "First title", content: <p>First content</p> },
  { id: "b", title: "Second title", content: <p>Second content</p> },
];

describe("Accordion", () => {
  it("renders all titles with panels closed", () => {
    render(<Accordion items={items} />);
    const firstButton = screen.getByRole("button", { name: /First title/ });
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
    // Panel is in document but hidden when closed
    expect(screen.getByText("First content")).not.toBeVisible();
    // ARIA controls reference must exist in document even when collapsed
    expect(document.getElementById("accordion-panel-a")).toBeInTheDocument();
  });

  it("opens and closes a panel on click, allowing multiple open", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    // Open first panel
    await user.click(screen.getByRole("button", { name: /First title/ }));
    expect(screen.getByText("First content")).toBeVisible();

    // Open second panel while first is still open
    await user.click(screen.getByRole("button", { name: /Second title/ }));
    expect(screen.getByText("First content")).toBeVisible();
    expect(screen.getByText("Second content")).toBeVisible();

    // Close first panel, second should remain visible
    await user.click(screen.getByRole("button", { name: /First title/ }));
    expect(screen.getByText("First content")).not.toBeVisible();
    expect(screen.getByText("Second content")).toBeVisible();
  });
});
