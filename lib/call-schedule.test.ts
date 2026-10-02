import { describe, it, expect } from "vitest";
import { CALL_SESSIONS, nextCall, formatCallDate } from "@/lib/call-schedule";

const on = (iso: string) => {
  const s = nextCall(new Date(iso));
  return { date: formatCallDate(s), url: s.url };
};

describe("call schedule", () => {
  it("picks the next session and its own RSVP link", () => {
    expect(on("2026-10-01T12:00:00Z")).toEqual({
      date: "Thu, Oct 1",
      url: "https://luma.com/ukej4fhh",
    });
  });

  it("keeps showing a session while it is running", () => {
    expect(on("2026-10-02T03:30:00Z").date).toBe("Thu, Oct 1");
  });

  it("rolls to the next session, and its link, once a call ends", () => {
    expect(on("2026-10-02T04:01:00Z")).toEqual({
      date: "Thu, Oct 15",
      url: "https://luma.com/fdx8zavt",
    });
  });

  it("stays on Thursdays across the November time change", () => {
    expect(on("2026-11-10T12:00:00Z").date).toBe("Thu, Nov 12");
  });

  it("is every other Thursday, in ascending order, all on luma.com", () => {
    const starts = CALL_SESSIONS.map((s) => Date.parse(s.start));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    const HOUR = 3600_000;
    starts.slice(1).forEach((t, i) =>
      // 14 days apart, give or take the hour daylight saving moves the UTC time.
      expect(Math.abs(t - starts[i] - 14 * 24 * HOUR)).toBeLessThanOrEqual(HOUR),
    );
    CALL_SESSIONS.forEach((s) => {
      expect(s.url).toMatch(/^https:\/\/luma\.com\/[a-z0-9]+$/);
      expect(formatCallDate(s)).toMatch(/^Thu, /);
    });
  });

  // Tripwire: fails once the schedule is exhausted, so the list gets refilled.
  it("still has an upcoming session", () => {
    const last = Date.parse(CALL_SESSIONS[CALL_SESSIONS.length - 1].start);
    expect(last).toBeGreaterThan(Date.now());
  });
});
