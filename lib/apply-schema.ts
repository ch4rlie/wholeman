import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required."),
  email: z.string().email("Enter a valid email."),
  drawingIn: z.string().min(1, "Tell us what's drawing you in."),
  availability: z.string().min(1, "Let us know your availability."),
  priorExperience: z.string().optional().default(""),
  // Zod v4: `errorMap` is deprecated; use `error` (string shorthand) instead.
  agreement: z.literal(true, { error: "Please accept the agreement." }),
});

export type ApplyInput = z.infer<typeof applySchema>;

type Result =
  | { ok: true; value: ApplyInput }
  | { ok: false; errors: Record<string, string>; botDetected: boolean };

export function validateApply(data: Record<string, unknown>): Result {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, errors: { form: "Invalid submission." }, botDetected: false };
  }
  // Honeypot: a hidden "website" field humans never see. Filled => bot.
  if (data.website != null && String(data.website).trim() !== "") {
    return { ok: false, errors: {}, botDetected: true };
  }
  const parsed = applySchema.safeParse(data);
  if (parsed.success) return { ok: true, value: parsed.data };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors, botDetected: false };
}
