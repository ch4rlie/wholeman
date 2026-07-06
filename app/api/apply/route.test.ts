import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/apply-email", () => ({
  sendApplicationEmail: vi.fn(async () => undefined),
  isEmailConfigured: vi.fn(() => true),
}));

import { POST } from "@/app/api/apply/route";
import { sendApplicationEmail, isEmailConfigured } from "@/lib/apply-email";

const sendMock = vi.mocked(sendApplicationEmail);
const configuredMock = vi.mocked(isEmailConfigured);

const valid = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true,
};

function req(body: unknown) {
  return new Request("http://localhost/api/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/apply", () => {
  beforeEach(() => {
    sendMock.mockClear();
    configuredMock.mockReturnValue(true);
  });

  it("returns 200 and sends email for a valid application", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await POST(req({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors.email).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently drops bots with a 200", async () => {
    const res = await POST(req({ ...valid, website: "spam" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on malformed JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/apply", { method: "POST", body: "{nope" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 502 when the email send fails", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
  });
});
