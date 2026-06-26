import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { getPodcast } from "@/lib/podcast";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Podcast" };

export default async function PodcastIndex() {
  const podcast = await getPodcast();
  return (
    <>
      <Nav />
      <main className="bg-ink py-16 md:py-24">
        <Container>
          <h1 className="font-display text-4xl font-normal md:text-5xl">{podcast.title}</h1>
          {podcast.description && (
            <p className="mt-3 max-w-3xl font-display text-lg italic text-faint">{podcast.description}</p>
          )}
          <div className="mt-10 flex max-w-3xl flex-col gap-4">
            {podcast.episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} size="large" />
            ))}
          </div>
          {podcast.episodes.length === 0 && (
            <p className="mt-6 font-sans text-sm text-faint">Episodes are loading — check back shortly.</p>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
