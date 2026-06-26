import { XMLParser } from "fast-xml-parser";
import type { Episode, Podcast } from "./podcast.types";

const FEED_URL = "https://anchor.fm/s/10bb68134/podcast/rss";

export function parseDurationToSeconds(raw: string): number {
  if (!raw) return 0;
  const parts = raw.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(d);
}

export function extractGuest(title: string): string | null {
  const m = title.match(/\s+(?:w\/|with)\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]);
  }
  return String(v);
}

export function parsePodcastFeed(xml: string): Podcast {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const data = parser.parse(xml);
  const channel = data?.rss?.channel ?? {};
  const rawItems = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];

  const episodes: Episode[] = rawItems.map((it: Record<string, unknown>, i: number) => {
    const title = text(it.title);
    const durationSeconds = parseDurationToSeconds(text(it["itunes:duration"]));
    const pubRaw = text(it.pubDate);
    const pubDate = pubRaw ? new Date(pubRaw).toISOString() : "";
    const enclosure = it.enclosure as Record<string, string> | undefined;
    const epNum = text(it["itunes:episode"]);
    return {
      id: text(it.guid) || `${i}`,
      title,
      guest: extractGuest(title),
      description: text(it.description) || text(it["itunes:summary"]),
      pubDate,
      pubDateLabel: pubDate ? formatDate(pubDate) : "",
      durationSeconds,
      durationLabel: formatDuration(durationSeconds),
      audioUrl: enclosure?.["@_url"] ?? null,
      episodeNumber: epNum ? parseInt(epNum, 10) : null,
      link: text(it.link),
    };
  });

  episodes.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));

  const coverImg = channel["itunes:image"] as Record<string, string> | undefined;
  return {
    title: text(channel.title) || "WholeMan Podcast",
    description: text(channel.description),
    coverImage: coverImg?.["@_href"] ?? null,
    episodes,
  };
}

export async function getPodcast(): Promise<Podcast> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    return parsePodcastFeed(await res.text());
  } catch (err) {
    console.error("[podcast] failed to load feed:", err);
    return { title: "WholeMan Podcast", description: "", coverImage: null, episodes: [] };
  }
}
