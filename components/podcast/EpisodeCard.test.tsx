import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EpisodeCard } from "./EpisodeCard";
import type { Episode } from "@/lib/podcast.types";

const ep: Episode = {
  id: "1", title: "The Art of Self Delusion w/ Brent Perkins", guest: "Brent Perkins",
  description: "x", pubDate: "2026-05-11T12:00:00Z", pubDateLabel: "May 11, 2026",
  durationSeconds: 5687, durationLabel: "1h 35m", audioUrl: null, episodeNumber: 20,
  link: "https://show/20",
};

describe("EpisodeCard", () => {
  it("shows episode number, title and duration", () => {
    render(<EpisodeCard episode={ep} />);
    expect(screen.getByText(/Ep 20/i)).toBeInTheDocument();
    expect(screen.getByText(/The Art of Self Delusion/i)).toBeInTheDocument();
    expect(screen.getByText(/1h 35m/)).toBeInTheDocument();
  });
});
