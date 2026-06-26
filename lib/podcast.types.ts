export interface Episode {
  id: string;
  title: string;
  guest: string | null;
  description: string;
  pubDate: string;       // ISO 8601
  pubDateLabel: string;  // "Jun 17, 2026"
  durationSeconds: number;
  durationLabel: string; // "1h 37m"
  audioUrl: string | null;
  image: string | null;
  episodeNumber: number | null;
  link: string;
}

export interface Podcast {
  title: string;
  description: string;
  coverImage: string | null;
  episodes: Episode[];
}
