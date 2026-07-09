import { useEffect } from "react";
import { Heart, Pause, Play } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { formatDuration } from "../../lib/utils";

const LikedSongsPage = () => {
  const { likedSongs, fetchLikedSongs, isLikedLoading, toggleLikeSong } = usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  if (isLikedLoading) return null;

  const handlePlayAll = () => {
    const isCurrentlyPlaying = likedSongs.some((s) => s._id === currentSong?._id);
    if (isCurrentlyPlaying) togglePlay();
    else playAlbum(likedSongs, 0);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-lg">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-linear-to-b from-accent/50 via-base/80 to-base pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 p-4 sm:p-6 pb-6 sm:pb-8">
              <div className="w-40 h-40 sm:w-60 sm:h-60 shadow-xl rounded-lg shrink-0 bg-linear-to-br from-accent to-primary flex items-center justify-center">
                <Heart className="size-16 sm:size-24 text-text fill-text" />
              </div>
              <div className="flex flex-col justify-end text-center sm:text-left min-w-0">
                <p className="text-sm font-medium text-text-muted">Playlist</p>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold my-2 sm:my-4 text-text">
                  Liked Songs
                </h1>
                <div className="text-sm text-text-muted">{likedSongs.length} songs</div>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start">
              <Button
                onClick={handlePlayAll}
                size="icon"
                disabled={likedSongs.length === 0}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent hover:bg-accent-hover hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying && likedSongs.some((s) => s._id === currentSong?._id) ? (
                  <Pause className="size-6 sm:size-7 text-text" />
                ) : (
                  <Play className="size-6 sm:size-7 text-text" />
                )}
              </Button>
            </div>

            <div className="bg-base/20 backdrop-blur-sm px-2 sm:px-6">
              {likedSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2 px-4">
                  <p className="text-text-muted">Songs you like will show up here.</p>
                </div>
              ) : (
                <div className="space-y-1 py-4">
                  {likedSongs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;

                    return (
                      <div
                        key={song._id}
                        onClick={() => playAlbum(likedSongs, index)}
                        className="grid grid-cols-[16px_1fr_auto] gap-3 px-2 sm:px-4 py-2 text-sm text-text-muted hover:bg-surface-hover rounded-lg group cursor-pointer items-center"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-accent">♫</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )}
                          {!isCurrentSong && <Play className="h-4 w-4 hidden group-hover:block" />}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          <img src={song.imageUrl} alt={song.title} className="size-9 sm:size-10 rounded shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-text truncate">{song.title}</div>
                            <div className="text-xs text-text-muted truncate">{song.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLikeSong(song._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart className="size-4 fill-accent text-accent" />
                          </button>
                          <span>{formatDuration(song.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LikedSongsPage;