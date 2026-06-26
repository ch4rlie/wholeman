import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { FeaturedEpisode } from "@/components/podcast/FeaturedEpisode";
import { siteConfig } from "@/lib/site";
import type { Podcast } from "@/lib/podcast.types";

export function PodcastSection({ podcast }: { podcast: Podcast }) {
  const [featured, ...rest] = podcast.episodes;
  const recent = rest.slice(0, 3);

  return (
    <section id="podcast" className="bg-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>●</span>}>
            The WholeMan Podcast
            <span className="ml-2 normal-case tracking-normal text-faint">
              · live feed{podcast.episodes.length ? ` · ${podcast.episodes.length} episodes` : ""}
            </span>
          </SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            Conversations on becoming <span className="italic text-copperlight">whole</span>
          </h2>
          {podcast.description && (
            <p className="mt-2 max-w-3xl font-display text-[15px] italic text-faint">{podcast.description}</p>
          )}
        </Reveal>

        {featured ? (
          <div className="mt-7 flex flex-col gap-5 md:flex-row">
            <Reveal className="flex md:flex-[1.4]">
              <FeaturedEpisode episode={featured} coverImage={podcast.coverImage} />
            </Reveal>
            <div className="flex flex-1 flex-col gap-3">
              {recent.map((ep, i) => (
                <Reveal key={ep.id} delay={i * 0.08}>
                  <EpisodeCard episode={ep} />
                </Reveal>
              ))}
              <a href="/podcast" className="rounded-lg border border-cardline px-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-faint transition hover:text-bone">
                View all episodes →
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-6 font-sans text-sm text-faint">Episodes coming soon. Listen on{" "}
            <a className="text-copper" href={siteConfig.social[0].href}>Spotify</a>.
          </p>
        )}

        <div className="mt-6 font-sans text-xs text-faint">
          Listen on:{" "}
          {siteConfig.social.filter((s) => s.label !== "Instagram").map((s, i, arr) => (
            <span key={s.label}>
              <a className="text-copper hover:underline" href={s.href} target="_blank" rel="noopener">{s.label}</a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
