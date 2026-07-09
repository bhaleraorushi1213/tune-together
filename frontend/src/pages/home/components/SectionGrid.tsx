import SectionGridSkeleton from "../../../components/skeletons/SectionGridSkeleton";
import { Button } from "../../../components/ui/button";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import type { Song } from "../../../types";
import PlayButton from "./PlayButton";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  if (isLoading) return <SectionGridSkeleton />;

  const handleCardClick = (song: Song) => {
    if (currentSong?._id === song._id) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-text">{title}</h2>
        <Button variant="link" className="text-sm text-text-muted hover:text-primary cursor-pointer">
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            onClick={() => handleCardClick(song)}
            className="bg-surface p-3 sm:p-4 rounded-lg hover:bg-surface-hover transition-all group cursor-pointer border border-border"
          >
            <div className="relative mb-3 sm:mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-1 truncate text-sm text-text">{song.title}</h3>
            <p className="text-xs sm:text-sm text-text-muted truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;