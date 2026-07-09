import { useParams } from "react-router-dom";
import { useMusicStore } from "../../stores/useMusicStore.ts";
import { useEffect } from "react";

import { Clock, Pause, Play, Heart } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area.tsx";
import { Button } from "../../components/ui/button.tsx";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import { usePlaylistStore } from "../../stores/usePlaylistStore.ts";
import { useUser } from "@clerk/react";
import { formatDuration, cn } from "../../lib/utils.ts";
import AddToPlaylistMenu from "../../components/AddToPlaylistMenu.tsx";

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, selectedAlbum, isAlbumLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { isSongLiked, toggleLikeSong } = usePlaylistStore();
  const { user } = useUser();

  useEffect(() => {
    fetchAlbumById(albumId!);
  }, [fetchAlbumById, albumId]);

  if (isAlbumLoading) return null;

  const handlePlayAlbum = () => {
    if (!selectedAlbum) return;

    const isCurrentAlbumPlaying = selectedAlbum?.songs.some((song) => song._id === currentSong?._id);

    if (isCurrentAlbumPlaying) togglePlay();
    else playAlbum(selectedAlbum?.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    if (!selectedAlbum) return;
    playAlbum(selectedAlbum?.songs, index);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-lg">
        <div className="relative min-h-full">
          {/* BG GRADIENT — retoned to primary instead of purple-500 literal */}
          <div
            className="absolute inset-0 bg-linear-to-b from-primary/40 via-base/80 to-base pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* HERO — stacks on mobile, side-by-side from sm up */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 p-4 sm:p-6 pb-6 sm:pb-8">
              <img
                src={selectedAlbum?.imageUrl}
                alt={selectedAlbum?.title}
                className="w-40 h-40 sm:w-60 sm:h-60 shadow-xl rounded-lg shrink-0"
              />
              <div className="flex flex-col justify-end text-center sm:text-left min-w-0">
                <p className="text-sm font-medium text-text-muted">Album</p>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold my-2 sm:my-4 text-text truncate">
                  {selectedAlbum?.title}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                  <span className="font-medium text-text">{selectedAlbum?.artist}</span>
                  <span>• {selectedAlbum?.songs.length} songs</span>
                  <span>• {selectedAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* PLAY BUTTON */}
            <div className="px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary hover:bg-primary-hover hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying && selectedAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="size-6 sm:size-7 text-text" />
                ) : (
                  <Play className="size-6 sm:size-7 text-text" />
                )}
              </Button>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-base/20 backdrop-blur-sm">
              {/* TABLE HEADER — duration column hidden on phones, date hidden below sm */}
              <div className="grid grid-cols-[16px_1fr_auto] sm:grid-cols-[16px_4fr_2fr_1fr] gap-3 sm:gap-4 px-4 sm:px-10 py-2 text-sm text-text-muted border-b border-border">
                <div>#</div>
                <div>Title</div>
                <div className="hidden sm:block">Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* SONGS LIST */}
              <div className="px-2 sm:px-6">
                <div className="space-y-1 py-4">
                  {selectedAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    const liked = isSongLiked(song._id);

                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className="grid grid-cols-[16px_1fr_auto] sm:grid-cols-[16px_4fr_2fr_1fr] gap-3 sm:gap-4 px-2 sm:px-4 py-2 text-sm text-text-muted hover:bg-surface-hover rounded-lg group cursor-pointer items-center"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-primary">♫</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )}
                          {!isCurrentSong && <Play className="h-4 w-4 hidden group-hover:block" />}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          <img src={song.imageUrl} alt={song.title} className="size-9 sm:size-10 rounded shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-text truncate">{song.title}</div>
                            <div className="truncate">{song.artist}</div>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center">{song.createdAt.split("T")[0]}</div>

                        <div className="flex items-center gap-2 shrink-0">
                          {user && (
                            <>
                              <AddToPlaylistMenu
                                song={song}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLikeSong(song._id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Heart className={cn("size-4", liked ? "fill-accent text-accent opacity-100" : "text-text-muted")} />
                              </button>
                            </>

                          )}
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;