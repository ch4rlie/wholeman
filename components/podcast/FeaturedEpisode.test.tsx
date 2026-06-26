import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedEpisode } from "./FeaturedEpisode";
import type { Episode } from "@/lib/podcast.types";

const baseEpisode: Episode = {
  id: "20",
  title: "The Art of Self Delusion w/ Brent Perkins",
  guest: "Brent Perkins",
  description: "x",
  pubDate: "2026-05-11T12:00:00Z",
  pubDateLabel: "May 11, 2026",
  durationSeconds: 5687,
  durationLabel: "1h 35m",
  audioUrl: null,
  episodeNumber: 20,
  link: "https://show/20",
};

describe("FeaturedEpisode", () => {
  it("shows base title and guest suffix without duplication", () => {
    render(<FeaturedEpisode episode={baseEpisode} coverImage={null} />);
    const heading = screen.getByRole("heading");
    // Base title appears once (no w/ suffix in plain text node)
    expect(heading.textContent).toContain("The Art of Self Delusion");
    // "w/ Brent Perkins" appears exactly once in the heading
    const fullText = heading.textContent ?? "";
    const matches = fullText.match(/w\/\s*Brent Perkins/gi);
    expect(matches).toHaveLength(1);
    // Full original title phrase should not appear verbatim (no duplicate suffix)
    expect(fullText).not.toMatch(/Brent Perkins.*w\/.*Brent Perkins/i);
  });

  it("renders full title without throwing when guest is null", () => {
    const noGuest: Episode = { ...baseEpisode, guest: null };
    render(<FeaturedEpisode episode={noGuest} coverImage={null} />);
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toContain("The Art of Self Delusion w/ Brent Perkins");
  });
});
