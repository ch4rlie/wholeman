import type { Episode } from "@/lib/podcast.types";

export function EpisodeCard({
  episode,
  size = "default",
}: {
  episode: Episode;
  size?: "default" | "large";
}) {
  const href = episode.link || "#";
  const large = size === "large";
  const thumb = large ? "h-24 w-24" : "h-14 w-14";
  const wrap = large ? "gap-5 p-4" : "gap-3 p-3";
  const title = large ? "text-lg md:text-xl" : "text-[15px]";
  const meta = large ? "text-sm" : "text-xs";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center ${wrap} rounded-lg border border-cardline bg-white/[0.02] transition hover:border-copper/60`}
    >
      {episode.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={episode.image} alt="" className={`${thumb} flex-none rounded-md object-cover`} />
      ) : (
        <span className={`flex ${thumb} flex-none items-center justify-center rounded-md bg-copper text-base text-ink`}>
          ▶
        </span>
      )}
      <span className="min-w-0">
        <span className={`block font-display ${title} leading-snug text-bone line-clamp-2`}>
          {episode.title}
        </span>
        <span className={`mt-1 block font-sans ${meta} text-muted`}>
          {episode.pubDateLabel}
          {episode.durationLabel ? ` · ${episode.durationLabel}` : ""}
        </span>
      </span>
    </a>
  );
}
