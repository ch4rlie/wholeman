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
    expect(screen.getByRole("button", { name: /First title/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText("First content")).not.toBeInTheDocument();
  });

  it("opens and closes a panel on click, allowing multiple open", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByRole("button", { name: /First title/ }));
    await user.click(screen.getByRole("button", { name: /Second title/ }));
    expect(screen.getByText("First content")).toBeInTheDocument();
    expect(screen.getByText("Second content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /First title/ }));
    expect(screen.queryByText("First content")).not.toBeInTheDocument();
  });
});
