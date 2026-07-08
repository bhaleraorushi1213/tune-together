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
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs])

  useEffect(() => {
    if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...madeForYouSongs, ...trendingSongs, ...featuredSongs];
      initializeQueue(allSongs);
    };
  }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs])

  return (
    <main className="rounded-md overflow-hidden h-full bg-linear-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className={"h-[calc(100vh-180px)]"}>
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good afternoon</h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title={"Made For You"}
              songs={madeForYouSongs}
              isLoading={isMadeForYouLoading}
            />
            <SectionGrid
              title={"Trending"}
              songs={trendingSongs}
              isLoading={isTrendingLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  )
}

export default HomePage