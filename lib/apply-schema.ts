import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required.").max(200, "Please keep your name under 200 characters."),
  email: z
    .string()
    .email("Enter a valid email.")
    .max(254, "Please use a shorter email address."),
  drawingIn: z
    .string()
    .min(1, "Tell us what's drawing you in.")
    .max(5000, "Please keep this under 5000 characters."),
  availability: z
    .string()
    .min(1, "Let us know your availability.")
    .max(1000, "Please keep this under 1000 characters."),
  priorExperience: z.string().max(5000, "Please keep this under 5000 characters.").optional().default(""),
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
