import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TheCall } from "@/components/sections/TheCall";
import { IsThisYou } from "@/components/sections/IsThisYou";
import { RecoveryMission } from "@/components/sections/RecoveryMission";
import { TheWork } from "@/components/sections/TheWork";
import { Manifesto } from "@/components/sections/Manifesto";
import { Vision } from "@/components/sections/Vision";
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
        <IsThisYou />
        <RecoveryMission />
        <TheWork />
        <Manifesto />
        <Vision />
        <Coaching />
        <PodcastSection podcast={podcast} />
      </main>
      <Footer />
    </>
  );
}
