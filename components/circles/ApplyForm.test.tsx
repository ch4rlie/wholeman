import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { ApplyForm } from "./ApplyForm";

function fillValidForm() {
  return {
    name: screen.getByLabelText(/your name/i),
    email: screen.getByLabelText(/email/i),
    drawingIn: screen.getByLabelText(/drawing you in/i),
    availability: screen.getByLabelText(/availability/i),
    agreement: screen.getByLabelText(/\$99\/month/i),
  };
}

describe("ApplyForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    vi.restoreAllMocks();
  });

  it("renders all fields including the agreement checkbox", () => {
    render(<ApplyForm />);
    const f = fillValidForm();
    expect(f.name).toBeInTheDocument();
    expect(f.agreement).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send my application/i })).toBeInTheDocument();
  });

  it("redirects to /thanks on successful submit", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "Tired of doing it alone.");
    await user.type(f.availability, "Evenings");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(pushMock).toHaveBeenCalledWith("/thanks");
  });

  it("shows field errors from a 400 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: false, errors: { email: "Enter a valid email." } }), { status: 400 }))
    );
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "x");
    await user.type(f.availability, "x");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
  });

  it("shows the mailto fallback on server failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 502 })));
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "x");
    await user.type(f.availability, "x");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/email/i);
  });
});
