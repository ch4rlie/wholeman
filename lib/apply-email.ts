import { Resend } from "resend";
import type { ApplyInput } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.APPLY_TO_EMAIL);
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLY_TO_EMAIL;
  if (!apiKey || !to) throw new Error("RESEND_API_KEY / APPLY_TO_EMAIL not set");
  const resend = new Resend(apiKey);
  const from = process.env.APPLY_FROM_EMAIL ?? "applications@wholeman.org";
  const { error } = await resend.emails.send({
    from,
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
  if (error) throw new Error(error.message);
}
