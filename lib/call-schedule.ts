// Brotherhood call: every other Thursday at 7pm PT.
//
// Luma creates each occurrence as an INDEPENDENT event with its own URL, and the
// host's calendar has no public page, so there is no single link that advances on
// its own. The schedule below is therefore the source of truth for both the date
// and the RSVP link. Refill it from the host's Luma calendar when it runs low —
// lib/call-schedule.test.ts fails once no future session is left.
export type CallSession = { start: string; url: string };

export const CALL_SESSIONS: CallSession[] = [
  { start: "2026-10-02T02:00:00Z", url: "https://luma.com/ukej4fhh" },
  { start: "2026-10-16T02:00:00Z", url: "https://luma.com/fdx8zavt" },
  { start: "2026-10-30T02:00:00Z", url: "https://luma.com/41p1c3xw" },
  { start: "2026-11-13T03:00:00Z", url: "https://luma.com/z859mluz" },
  { start: "2026-11-27T03:00:00Z", url: "https://luma.com/ohqsvok8" },
];

// Keep advertising a session until it is over, then roll to the next one.
const CALL_LENGTH_MS = 2 * 60 * 60 * 1000;

export function nextCall(now: Date = new Date()): CallSession {
  const t = now.getTime();
  const upcoming = CALL_SESSIONS.find((s) => Date.parse(s.start) + CALL_LENGTH_MS > t);
  // Past the end of the list, hold on the last known session rather than render nothing.
  return upcoming ?? CALL_SESSIONS[CALL_SESSIONS.length - 1];
}

// Formatted in Pacific time so the calendar date matches the advertised 7pm PT.
export function formatCallDate(session: CallSession): string {
  return new Date(session.start).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}
