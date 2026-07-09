import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ListMusic } from "lucide-react";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import Topbar from "../../components/Topbar";
import { getPlaylistCover } from "../../lib/utils";

const PlaylistsPage = () => {
  const { playlists, fetchUserPlaylists, createPlaylist, isLoading } = usePlaylistStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchUserPlaylists();
  }, [fetchUserPlaylists]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setIsCreating(true);
    const playlist = await createPlaylist(title.trim());
    setIsCreating(false);
    if (playlist) {
      setTitle("");
      setDialogOpen(false);
    }
  };

  return (
    <main className="rounded-lg overflow-hidden h-full flex flex-col bg-liner-to-b from-surface to-base">
      <Topbar />
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-3xl font-display font-bold text-text">Your Playlists</h1>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button className="bg-primary hover:bg-primary-hover text-text rounded-lg">
                  <Plus className="size-4 mr-2" />
                  New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface border-border w-[95vw] sm:w-full">
                <DialogHeader>
                  <DialogTitle className="text-text font-display">Create Playlist</DialogTitle>
                  <DialogDescription className="text-text-muted">Give it a name to get started</DialogDescription>
                </DialogHeader>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Playlist"
                  className="bg-surface-hover border-border text-text placeholder:text-text-muted"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={isCreating || !title.trim()}
                    className="bg-primary hover:bg-primary-hover text-text"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface rounded-lg animate-pulse" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <ListMusic className="size-12 text-text-faint" />
              <p className="text-text-muted">No playlists yet — create your first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {playlists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlists/${playlist._id}`}
                  className="bg-surface p-3 sm:p-4 rounded-lg hover:bg-surface-hover transition-all group border border-border"
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-3 sm:mb-4 shadow-lg">
                    <img
                      src={getPlaylistCover(playlist) || playlist.imageUrl}
                      alt={playlist.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium truncate text-sm sm:text-base text-text">{playlist.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted truncate">{playlist.songs.length} songs</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default PlaylistsPage;