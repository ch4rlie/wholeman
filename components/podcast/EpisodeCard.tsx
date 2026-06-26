import type { Episode } from "@/lib/podcast.types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const href = episode.link || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-3 rounded-lg border border-cardline bg-white/[0.02] p-3 transition hover:border-copper/60"
    >
      {episode.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={episode.image} alt="" className="h-14 w-14 flex-none rounded-md object-cover" />
      ) : (
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-copper text-xs text-ink">▶</span>
      )}
      <span className="min-w-0">
        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-faint">
          {episode.episodeNumber ? `Ep ${episode.episodeNumber}` : "Episode"}
        </span>
        <span className="block truncate font-display text-[15px] text-bone">{episode.title}</span>
        <span className="font-sans text-[11px] text-faint">
          {episode.pubDateLabel}{episode.durationLabel ? ` · ${episode.durationLabel}` : ""}
        </span>
      </span>
    </a>
  );
}
