import nodemailer from "nodemailer";
import type { ApplyInput } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.APPLY_TO_EMAIL,
  );
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.APPLY_TO_EMAIL;
  if (!user || !pass || !to) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD / APPLY_TO_EMAIL not set");
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
    subject: `New circle application from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What's drawing you in: ${input.drawingIn}`,
      `Availability: ${input.availability}`,
      `Prior men's-work experience: ${input.priorExperience || "(none given)"}`,
    ].join("\n"),
  });
}
