// Brotherhood call: a Luma series every other Thursday at 7pm PT.
// Anchor on the first session and step forward in 14-day intervals.
const FIRST_CALL_MS = Date.parse("2026-09-18T02:00:00Z"); // Thu Sept 17, 7pm PT
const INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;
// Keep advertising a session until it's over, then roll to the next one.
const CALL_LENGTH_MS = 2 * 60 * 60 * 1000;

export function nextCallStart(now: Date = new Date()): Date {
  const elapsed = now.getTime() - CALL_LENGTH_MS - FIRST_CALL_MS;
  const n = elapsed <= 0 ? 0 : Math.ceil(elapsed / INTERVAL_MS);
  return new Date(FIRST_CALL_MS + n * INTERVAL_MS);
}

// Formatted in Pacific time so the calendar date matches the advertised 7pm PT.
export function formatCallDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}
