import { useEffect } from "react";

import { ListMusic, Music } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

import DashBoardStats from "./components/DashBoardStats";
import Header from "./components/Header";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useMusicStore } from "../../stores/useMusicStore";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin && !isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-4xl sm:text-6xl bg-base text-text px-4 text-center">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-surface via-base to-base text-text p-4 sm:p-8">
      <Header />
      <DashBoardStats />

      <Tabs defaultValue="songs" className="space-y-4 sm:space-y-6 flex flex-col">
        <TabsList className="p-1 bg-surface border border-border">
          <TabsTrigger
            value="songs"
            // className="data-[state=active]:bg-primary data-[state=active]:text-text text-text-muted"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            // className="data-[state=active]:bg-accent data-[state=active]:text-text text-text-muted"
          >
            <ListMusic className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;