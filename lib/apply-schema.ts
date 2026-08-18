import { z } from "zod";

export const INTEREST_OPTIONS = [
  { value: "join", label: "I'd like to join a men's circle" },
  { value: "learn", label: "I want to learn more" },
  { value: "chat", label: "I just want to chat honestly" },
  { value: "coaching", label: "I'm interested in 1:1 coaching" },
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number]["value"];

export const INTEREST_LABELS: Record<Interest, string> = Object.fromEntries(
  INTEREST_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Interest, string>;

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required.").max(200, "Please keep your name under 200 characters."),
  email: z
    .string()
    .email("Enter a valid email.")
    .max(254, "Please use a shorter email address."),
  interest: z.enum(["join", "learn", "chat", "coaching"], { error: "Let us know what brings you here." }),
  message: z.string().max(5000, "Please keep this under 5000 characters.").optional().default(""),
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
