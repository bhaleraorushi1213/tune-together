import { useEffect } from "react";

import { useMusicStore } from "../../stores/useMusicStore";
import Topbar from "../../components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "../../components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";

const HomePage = () => {
  const {
    madeForYouSongs,
    trendingSongs,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isMadeForYouLoading,
    isTrendingLoading,
  } = useMusicStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs])

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