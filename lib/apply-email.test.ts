import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn<(payload: Record<string, unknown>) => Promise<{ error: null }>>(
  async () => ({ error: null }),
);
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}));

import { isEmailConfigured, sendApplicationEmail } from "@/lib/apply-email";

const input = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true as const,
};

describe("apply email", () => {
  beforeEach(() => {
    sendMock.mockClear();
    vi.stubEnv("RESEND_API_KEY", "re_test_123");
    vi.stubEnv("APPLY_TO_EMAIL", "a@example.com,b@example.com");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("is configured only when both env vars are set", () => {
    expect(isEmailConfigured()).toBe(true);
    vi.stubEnv("APPLY_TO_EMAIL", "");
    expect(isEmailConfigured()).toBe(false);
  });

  it("sends to all recipients with reply-to set to the applicant", async () => {
    await sendApplicationEmail(input);
    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.to).toEqual(["a@example.com", "b@example.com"]);
    expect(arg.replyTo).toBe("test@example.com");
    expect(String(arg.subject)).toContain("Test Man");
    expect(String(arg.text)).toContain("Weekday evenings");
  });

  it("throws when env vars are missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendApplicationEmail(input)).rejects.toThrow();
  });
});
