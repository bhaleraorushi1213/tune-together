import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/react";
import { Clock, Pause, Play, Heart, Trash2, MoreHorizontal } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { formatDuration, cn } from "../../lib/utils";

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const { selectedPlaylist, fetchPlaylistById, isPlaylistLoading, removeSongFromPlaylist, deletePlaylist, isSongLiked, toggleLikeSong } =
    usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (playlistId) fetchPlaylistById(playlistId);
  }, [fetchPlaylistById, playlistId]);

  if (isPlaylistLoading || !selectedPlaylist) return null;

  const isOwner = selectedPlaylist.owner === user?.id;

  const handlePlayPlaylist = () => {
    const isCurrentlyPlaying = selectedPlaylist.songs.some((s) => s._id === currentSong?._id);
    if (isCurrentlyPlaying) togglePlay();
    else playAlbum(selectedPlaylist.songs, 0);
  };

  const handlePlaySong = (index: number) => playAlbum(selectedPlaylist.songs, index);

  const handleDeletePlaylist = async () => {
    await deletePlaylist(selectedPlaylist._id);
    navigate("/playlists");
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-lg">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-linear-to-b from-accent/40 via-base/80 to-base pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 p-4 sm:p-6 pb-6 sm:pb-8">
              <img
                src={selectedPlaylist.imageUrl}
                alt={selectedPlaylist.title}
                className="w-40 h-40 sm:w-60 sm:h-60 shadow-xl rounded-lg shrink-0 object-cover"
              />
              <div className="flex flex-col justify-end text-center sm:text-left min-w-0">
                <p className="text-sm font-medium text-text-muted">Playlist</p>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold my-2 sm:my-4 text-text truncate">
                  {selectedPlaylist.title}
                </h1>
                {selectedPlaylist.description && (
                  <p className="text-sm text-text-muted mb-1">{selectedPlaylist.description}</p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                  <span>{selectedPlaylist.songs.length} songs</span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start gap-4">
              <Button
                onClick={handlePlayPlaylist}
                size="icon"
                disabled={selectedPlaylist.songs.length === 0}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent hover:bg-accent-hover hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying && selectedPlaylist.songs.some((s) => s._id === currentSong?._id) ? (
                  <Pause className="size-6 sm:size-7 text-text" />
                ) : (
                  <Play className="size-6 sm:size-7 text-text" />
                )}
              </Button>

              {isOwner && (
                <Button
                  variant="ghost"
                  onClick={handleDeletePlaylist}
                  className="text-danger hover:text-danger hover:bg-danger/10"
                >
                  <Trash2 className="size-4 mr-2" />
                  <span className="hidden sm:inline">Delete Playlist</span>
                </Button>
              )}
            </div>

            <div className="bg-base/20 backdrop-blur-sm">
              {selectedPlaylist.songs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2 px-4">
                  <p className="text-text-muted">No songs yet. Add some from any album or search result.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[16px_1fr_auto] sm:grid-cols-[16px_4fr_2fr_1fr] gap-3 sm:gap-4 px-4 sm:px-10 py-2 text-sm text-text-muted border-b border-border">
                    <div>#</div>
                    <div>Title</div>
                    <div className="hidden sm:block">Artist</div>
                    <div>
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="px-2 sm:px-6">
                    <div className="space-y-1 py-4">
                      {selectedPlaylist.songs.map((song, index) => {
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
                                <div className="truncate sm:hidden">{song.artist}</div>
                              </div>
                            </div>

                            <div className="hidden sm:flex items-center truncate">{song.artist}</div>

                            <div className="flex items-center gap-2 shrink-0">
                              {user && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLikeSong(song._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Heart className={cn("size-4", liked ? "fill-accent text-accent opacity-100" : "text-text-muted")} />
                                </button>
                              )}
                              <span>{formatDuration(song.duration)}</span>
                              {isOwner && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSongFromPlaylist(selectedPlaylist._id, song._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-danger"
                                  title="Remove from playlist"
                                >
                                  <MoreHorizontal className="size-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistDetailPage;