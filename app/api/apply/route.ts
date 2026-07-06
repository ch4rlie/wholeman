import { NextResponse } from "next/server";
import { validateApply } from "@/lib/apply-schema";
import { isEmailConfigured, sendApplicationEmail } from "@/lib/apply-email";

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const result = validateApply(data);
  if (!result.ok) {
    if (result.botDetected) return NextResponse.json({ ok: true }, { status: 200 }); // silently drop
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === "production";

  if (!isEmailConfigured()) {
    if (isProd) {
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    console.warn("[apply] DEV soft-success (email not configured). Payload:", result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendApplicationEmail(result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[apply] send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
