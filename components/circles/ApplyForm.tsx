"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { INTEREST_OPTIONS } from "@/lib/apply-schema";

export function ApplyForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFailed(false);
    setErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      interest: form.get("interest"),
      message: form.get("message"),
      website: form.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200) {
        router.push("/thanks");
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-1 w-full rounded-md border border-cardline bg-ink2 px-3 py-2 font-sans text-[15px] text-bone focus:border-copper focus:outline-none";
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 font-sans text-sm text-copperlight">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot: visually hidden, not announced to humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="block font-sans text-sm text-bone">Your name</label>
        <input id="name" name="name" className={field} aria-describedby="name-error" required />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="block font-sans text-sm text-bone">Email</label>
        <input id="email" name="email" type="email" className={field} aria-describedby="email-error" required />
        {err("email")}
      </div>

      <fieldset>
        <legend className="block font-sans text-sm text-bone">What brings you here?</legend>
        <div className="mt-2 space-y-2">
          {INTEREST_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-start gap-3 font-sans text-sm text-muted">
              <input type="radio" name="interest" value={opt.value} className="mt-1 accent-copper" required />
              {opt.label}
            </label>
          ))}
        </div>
        {err("interest")}
      </fieldset>

      <div>
        <label htmlFor="message" className="block font-sans text-sm text-bone">Anything you want us to know? (optional)</label>
        <textarea id="message" name="message" rows={4} className={field} />
      </div>

      {failed && (
        <div role="alert" className="rounded-md border border-copper/40 bg-copper/10 p-4 font-sans text-sm text-bone">
          Something went wrong sending your note. Please{" "}
          <a className="underline" href={`mailto:${siteConfig.contactEmail}?subject=WholeMan — reaching out`}>
            email {siteConfig.contactEmail}
          </a>{" "}
          directly, so your message doesn&apos;t disappear.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
