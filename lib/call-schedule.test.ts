import { describe, it, expect } from "vitest";
import { nextCallStart, formatCallDate } from "@/lib/call-schedule";

const next = (iso: string) => formatCallDate(nextCallStart(new Date(iso)));

describe("call schedule", () => {
  it("shows the first session before the series starts", () => {
    expect(next("2026-09-14T12:00:00Z")).toBe("Thu, Sep 17");
  });

  it("keeps showing a session while it is running", () => {
    expect(next("2026-09-18T03:30:00Z")).toBe("Thu, Sep 17");
  });

  it("rolls to the session two weeks later once a call ends", () => {
    expect(next("2026-09-18T04:01:00Z")).toBe("Thu, Oct 1");
  });

  it("stays on Thursdays across the November DST change", () => {
    expect(next("2026-11-10T12:00:00Z")).toBe("Thu, Nov 12");
    expect(next("2027-03-20T12:00:00Z")).toBe("Thu, Apr 1");
  });
});
