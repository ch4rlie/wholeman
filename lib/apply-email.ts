import nodemailer from "nodemailer";
import type { ApplyInput } from "@/lib/apply-schema";
import { INTEREST_LABELS } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.EMAIL_NOTIFICATIONS,
  );
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.EMAIL_NOTIFICATIONS;
  if (!user || !pass || !to) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD / EMAIL_NOTIFICATIONS not set");
  }
  // Google Workspace SMTP; auth via an app password on the sending account.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `"WholeMan" <${user}>`,
    to: to.split(",").map((s) => s.trim()).filter(Boolean),
    replyTo: input.email,
    subject: `New circle interest from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What brings them here: ${INTEREST_LABELS[input.interest]}`,
      `Message: ${input.message || "(none given)"}`,
    ].join("\n"),
  });
}
