import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMailMock = vi.fn<(payload: Record<string, unknown>) => Promise<{ messageId: string }>>(
    async () => ({ messageId: "test-id" }),
  );
  const createTransportMock = vi.fn<
    (config: Record<string, unknown>) => { sendMail: typeof sendMailMock }
  >(() => ({ sendMail: sendMailMock }));
  return { sendMailMock, createTransportMock };
});
vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

import { isEmailConfigured, sendApplicationEmail } from "@/lib/apply-email";

const input = {
  name: "Test Man",
  email: "test@example.com",
  interest: "join" as const,
  message: "Tired of doing it alone.",
};

describe("apply email", () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    createTransportMock.mockClear();
    vi.stubEnv("GMAIL_USER", "hello@wholeman.org");
    vi.stubEnv("GMAIL_APP_PASSWORD", "test-app-password");
    vi.stubEnv("EMAIL_NOTIFICATIONS", "a@example.com,b@example.com");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("is configured only when all three env vars are set", () => {
    expect(isEmailConfigured()).toBe(true);
    vi.stubEnv("EMAIL_NOTIFICATIONS", "");
    expect(isEmailConfigured()).toBe(false);
    vi.stubEnv("EMAIL_NOTIFICATIONS", "a@example.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    expect(isEmailConfigured()).toBe(false);
  });

  it("marks the subject as coaching only for coaching enquiries", async () => {
    await sendApplicationEmail({ ...input, interest: "coaching" });
    expect(sendMailMock.mock.calls[0][0].subject).toMatch(/^New coaching interest from /);
    sendMailMock.mockClear();
    await sendApplicationEmail({ ...input, interest: "join" });
    expect(sendMailMock.mock.calls[0][0].subject).toMatch(/^New circle interest from /);
  });

  it("connects to Gmail SMTP with the workspace account", async () => {
    await sendApplicationEmail(input);
    expect(createTransportMock).toHaveBeenCalledOnce();
    const cfg = createTransportMock.mock.calls[0][0] as Record<string, unknown>;
    expect(cfg.host).toBe("smtp.gmail.com");
    expect(cfg.secure).toBe(true);
    expect(cfg.auth).toEqual({ user: "hello@wholeman.org", pass: "test-app-password" });
  });

  it("sends to all recipients with reply-to set to the applicant", async () => {
    await sendApplicationEmail(input);
    expect(sendMailMock).toHaveBeenCalledOnce();
    const arg = sendMailMock.mock.calls[0][0];
    expect(arg.to).toEqual(["a@example.com", "b@example.com"]);
    expect(arg.replyTo).toBe("test@example.com");
    expect(String(arg.subject)).toContain("Test Man");
    expect(String(arg.text)).toContain("Tired of doing it alone.");
    expect(String(arg.text)).toContain("join a men's circle");
  });

  it("throws when env vars are missing", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "");
    await expect(sendApplicationEmail(input)).rejects.toThrow();
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("propagates SMTP failures", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("smtp down"));
    await expect(sendApplicationEmail(input)).rejects.toThrow("smtp down");
  });
});
