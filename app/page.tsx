import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TheCall } from "@/components/sections/TheCall";
import { TheWork } from "@/components/sections/TheWork";
import { Coaching } from "@/components/sections/Coaching";
import { PodcastSection } from "@/components/sections/PodcastSection";
import { getPodcast } from "@/lib/podcast";

export const revalidate = 3600;

export default async function Home() {
  const podcast = await getPodcast();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TheCall />
        <TheWork />
        <Coaching />
        <PodcastSection podcast={podcast} />
      </main>
      <Footer />
    </>
  );
}
