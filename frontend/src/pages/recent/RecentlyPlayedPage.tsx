// frontend/src/pages/recent/RecentlyPlayedPage.tsx
import { useEffect, useState } from "react";
import { History, Play, Pause } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import Topbar from "../../components/Topbar";
import type { Song } from "../../types";

interface RecentEntry {
  song: Song;
  playedAt: string;
}

const RecentlyPlayedPage = () => {
  const [history, setHistory] = useState<RecentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/users/recently-played");
        setHistory(response.data);
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleClick = (song: Song) => {
    if (currentSong?._id === song._id) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <main className="rounded-lg overflow-hidden h-full flex flex-col bg-linear-to-b from-surface to-base">
      <Topbar />
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="size-6 text-primary" />
            <h1 className="text-xl sm:text-3xl font-display font-bold text-text">Recently Played</h1>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-surface rounded-lg animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <History className="size-12 text-text-faint" />
              <p className="text-text-muted">Songs you play will show up here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((entry, i) => {
                const isCurrentSong = currentSong?._id === entry.song._id;
                return (
                  <div
                    key={`${entry.song._id}-${i}`}
                    onClick={() => handleClick(entry.song)}
                    className="flex items-center gap-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-surface-hover transition-colors group cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img src={entry.song.imageUrl} alt={entry.song.title} className="size-10 sm:size-12 rounded object-cover" />
                      <div className="absolute inset-0 bg-base/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isCurrentSong && isPlaying ? <Pause className="size-4 text-text" /> : <Play className="size-4 text-text" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base text-text">{entry.song.title}</p>
                      <p className="text-xs sm:text-sm text-text-muted truncate">{entry.song.artist}</p>
                    </div>
                    <span className="text-xs text-text-faint shrink-0 hidden sm:block">
                      {new Date(entry.playedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default RecentlyPlayedPage;