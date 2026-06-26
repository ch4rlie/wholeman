import type { Episode } from "@/lib/podcast.types";

function escapeRegExp(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function FeaturedEpisode({ episode, coverImage }: { episode: Episode; coverImage: string | null }) {
  return (
    <div className="flex flex-1 overflow-hidden rounded-xl border border-cardline bg-black/40">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="hidden w-36 flex-none object-cover sm:block" />
      )}
      <div className="p-5">
        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-copperlight">
          Newest{episode.episodeNumber ? ` · Ep ${episode.episodeNumber}` : ""}
        </span>
        <h3 className="my-2 font-display text-xl text-bone">
          {episode.guest ? episode.title.replace(new RegExp(`\\s+(?:w/|with)\\s+${escapeRegExp(episode.guest)}$`, "i"), "") : episode.title}
          {episode.guest && <span className="text-copper"> w/ {episode.guest}</span>}
        </h3>
        <p className="mb-3 font-sans text-[11px] text-faint">
          {episode.pubDateLabel}{episode.durationLabel ? ` · ${episode.durationLabel}` : ""}
        </p>
        <a
          href={episode.link || "#"}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-md bg-copper px-5 py-2.5 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110"
        >
          ▶ Play episode
        </a>
      </div>
    </div>
  );
}
