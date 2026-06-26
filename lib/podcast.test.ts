import { describe, it, expect } from "vitest";
import {
  parseDurationToSeconds,
  formatDuration,
  formatDate,
  extractGuest,
  parsePodcastFeed,
} from "./podcast";

describe("parseDurationToSeconds", () => {
  it("parses HH:MM:SS", () => { expect(parseDurationToSeconds("1:37:25")).toBe(5845); });
  it("parses MM:SS", () => { expect(parseDurationToSeconds("47:10")).toBe(2830); });
  it("parses plain seconds", () => { expect(parseDurationToSeconds("3600")).toBe(3600); });
  it("returns 0 for junk", () => { expect(parseDurationToSeconds("")).toBe(0); });
});

describe("formatDuration", () => {
  it("formats hours and minutes", () => { expect(formatDuration(5845)).toBe("1h 37m"); });
  it("formats minutes only", () => { expect(formatDuration(2830)).toBe("47m"); });
  it("handles zero", () => { expect(formatDuration(0)).toBe("0m"); });
  it("does not overflow minutes to 60", () => { expect(formatDuration(3599)).toBe("59m"); });
});

describe("formatDate", () => {
  it("formats an ISO date as Mon D, YYYY (UTC)", () => {
    expect(formatDate("2026-06-17T12:00:00Z")).toBe("Jun 17, 2026");
  });
});

describe("extractGuest", () => {
  it("pulls 'w/ Name'", () => {
    expect(extractGuest("The Art of Self Delusion w/ Brent Perkins")).toBe("Brent Perkins");
  });
  it("pulls 'with Name'", () => {
    expect(extractGuest("Prioritizing our Humanity with Sean Harvey")).toBe("Sean Harvey");
  });
  it("returns null when no guest", () => {
    expect(extractGuest("Shame is not your name")).toBeNull();
  });
});

describe("parsePodcastFeed", () => {
  const xml = `<?xml version="1.0"?>
  <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel>
    <title>WholeMan Podcast</title>
    <description>A phoenix rising from despair.</description>
    <itunes:image href="https://img/cover.jpg"/>
    <item>
      <title>Prioritizing our Humanity with Sean Harvey</title>
      <description>Systems thinking and compassion.</description>
      <pubDate>Wed, 17 Jun 2026 12:00:00 GMT</pubDate>
      <itunes:duration>1:37:25</itunes:duration>
      <itunes:episode>21</itunes:episode>
      <enclosure url="https://audio/21.mp3" type="audio/mpeg"/>
      <guid>guid-21</guid>
      <link>https://show/21</link>
    </item>
    <item>
      <title>Shame is not your name</title>
      <description>On shame.</description>
      <pubDate>Wed, 01 May 2026 12:00:00 GMT</pubDate>
      <itunes:duration>2310</itunes:duration>
      <guid>guid-22</guid>
    </item>
  </channel></rss>`;

  it("parses channel metadata", () => {
    const p = parsePodcastFeed(xml);
    expect(p.title).toBe("WholeMan Podcast");
    expect(p.coverImage).toBe("https://img/cover.jpg");
  });
  it("parses episodes newest-first with derived fields", () => {
    const p = parsePodcastFeed(xml);
    expect(p.episodes).toHaveLength(2);
    const first = p.episodes[0];
    expect(first.title).toBe("Prioritizing our Humanity with Sean Harvey");
    expect(first.guest).toBe("Sean Harvey");
    expect(first.episodeNumber).toBe(21);
    expect(first.durationLabel).toBe("1h 37m");
    expect(first.pubDateLabel).toBe("Jun 17, 2026");
    expect(first.audioUrl).toBe("https://audio/21.mp3");
    expect(first.link).toBe("https://show/21");
  });
  it("tolerates missing enclosure/link", () => {
    const p = parsePodcastFeed(xml);
    expect(p.episodes[1].audioUrl).toBeNull();
  });
  it("handles a single-item feed (object, not array)", () => {
    const single = `<?xml version="1.0"?>
  <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel>
    <title>WholeMan Podcast</title>
    <item>
      <title>Solo episode</title>
      <pubDate>Wed, 01 Jan 2025 12:00:00 GMT</pubDate>
      <itunes:duration>600</itunes:duration>
      <guid>solo-1</guid>
    </item>
  </channel></rss>`;
    const p = parsePodcastFeed(single);
    expect(p.episodes).toHaveLength(1);
    expect(p.episodes[0].title).toBe("Solo episode");
    expect(p.episodes[0].durationLabel).toBe("10m");
  });
});
