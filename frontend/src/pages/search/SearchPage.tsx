import { useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchStore } from "../../stores/useSearchStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useDebounce } from "../../hooks/useDebounce";
import { ScrollArea } from "../../components/ui/scroll-area";
import Topbar from "../../components/Topbar";
import { Link } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import PlayButton from "../home/components/PlayButton";
import type { Song } from "../../types";

const SearchPage = () => {
  const { query, songResults, albumResults, isSearching, search } = useSearchStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const handleRowClick = (song: Song) => {
    if (currentSong?._id === song._id) togglePlay();
    else setCurrentSong(song);
  };

  const hasResults = songResults.length > 0 || albumResults.length > 0;

  return (
    <main className="rounded-lg overflow-hidden h-full flex flex-col bg-linear-to-b from-surface to-base">
      <Topbar />
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-6">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <SearchIcon className="size-12 text-text-faint" />
              <p className="text-text-muted">Search for songs, artists, or albums</p>
            </div>
          ) : isSearching ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-surface rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <SearchIcon className="size-12 text-text-faint" />
              <p className="text-text-muted">No results for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-8">
              {albumResults.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-text mb-4">Albums</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {albumResults.map((album) => (
                      <Link
                        key={album._id}
                        to={`/albums/${album._id}`}
                        className="bg-surface p-3 sm:p-4 rounded-lg hover:bg-surface-hover transition-all group border border-border"
                      >
                        <div className="aspect-square rounded-md overflow-hidden mb-3 shadow-lg">
                          <img
                            src={album.imageUrl}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium truncate text-sm text-text">{album.title}</h3>
                        <p className="text-xs text-text-muted truncate">{album.artist}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {songResults.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-text mb-4">Songs</h2>
                  <div className="space-y-1">
                    {songResults.map((song) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onClick={() => handleRowClick(song)}
                          className="flex items-center gap-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors group cursor-pointer relative"
                        >
                          <div className="relative shrink-0">
                            <img src={song.imageUrl} alt={song.title} className="size-10 sm:size-12 rounded object-cover" />
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(song);
                              }}
                              className="absolute inset-0 bg-base/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {isCurrentSong && isPlaying ? (
                                <Pause className="size-4 text-text" />
                              ) : (
                                <Play className="size-4 text-text" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-sm sm:text-base text-text">{song.title}</p>
                            <p className="text-xs sm:text-sm text-text-muted truncate">{song.artist}</p>
                          </div>
                          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                            <PlayButton song={song} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default SearchPage;