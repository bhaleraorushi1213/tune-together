import { useEffect } from "react";

import { useMusicStore } from "../../stores/useMusicStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import { usePlayerStore } from "../../stores/usePlayerStore";

import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import Topbar from "../../components/Topbar";

const HomePage = () => {
  const {
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isMadeForYouLoading,
    isTrendingLoading,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...madeForYouSongs, ...trendingSongs, ...featuredSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);

  return (
    <main className="rounded-lg overflow-hidden h-full flex flex-col bg-linear-to-b from-surface to-base">
      <Topbar />
      {/* flex-1 + min-h-0 lets ScrollArea own its own height — no more calc() guessing */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-6">
          <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-6 text-text">Good afternoon</h1>
          <FeaturedSection />

          <div className="space-y-6 sm:space-y-8">
            <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isMadeForYouLoading} />
            <SectionGrid title="Trending" songs={trendingSongs} isLoading={isTrendingLoading} />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;