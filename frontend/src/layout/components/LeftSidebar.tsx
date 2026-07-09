import { Link } from "react-router-dom";
import { Show } from "@clerk/react";

import { cn } from "../../lib/utils.ts";
import { HomeIcon, Library, MessageCircle, ListMusic, Heart } from "lucide-react";
import { buttonVariants } from "../../components/ui/buttonVariants";
import { ScrollArea } from "../../components/ui/scroll-area";

import PlaylistSkeleton from "../../components/skeletons/PlaylistSkeleton";
import { useMusicStore } from "../../stores/useMusicStore.ts";
import { useEffect } from "react";

const navLinkClass = "w-full justify-start text-text-muted hover:text-text hover:bg-surface-hover";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full w-full flex flex-col gap-2 min-h-0 overflow-hidden">
      {/* NAVIGATION MENU */}
      <div className="rounded-lg bg-surface p-4 border border-border shrink-0">
        <div className="space-y-1">
          <Link to={"/"} className={cn(buttonVariants({ variant: "ghost", className: navLinkClass }))}>
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <Show when="signed-in">
            <Link to={"/chat"} className={cn(buttonVariants({ variant: "ghost", className: navLinkClass }))}>
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
            <Link to={"/liked"} className={cn(buttonVariants({ variant: "ghost", className: navLinkClass }))}>
              <Heart className="mr-2 size-5" />
              <span className="hidden md:inline">Liked Songs</span>
            </Link>
            <Link to={"/playlists"} className={cn(buttonVariants({ variant: "ghost", className: navLinkClass }))}>
              <ListMusic className="mr-2 size-5" />
              <span className="hidden md:inline">Your Playlists</span>
            </Link>
          </Show>
        </div>
      </div>

      {/* LIBRARY SECTION */}
      <div className="flex-1 min-h-0 rounded-lg bg-surface p-2 md:p-4 border border-border flex flex-col overflow-hidden">
        <div className="flex items-center justify-center md:justify-between mb-4 shrink-0">
          <div className="flex items-center text-text px-2 font-display font-medium">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Library</span>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-1">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className="p-2 hover:bg-surface-hover rounded-lg flex items-center gap-3 group cursor-pointer transition-colors"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-md shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate text-sm">{album.title}</p>
                    <p className="text-xs text-text-muted truncate">Album • {album.artist}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;