import { useMusicStore } from "../../../stores/useMusicStore";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import FeaturedGridSkeleton from "../../../components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import type { Song } from "../../../types";

const FeaturedSection = () => {
  const { isFeaturedLoading, featuredSongs, error } = useMusicStore();
  const { currentSong, setCurrentSong, togglePlay } = usePlayerStore();

  if (isFeaturedLoading) return <FeaturedGridSkeleton />;
  if (error) return <p className="text-danger mb-4 text-lg">{error}</p>;

  const handleCardClick = (song: Song) => {
    if (currentSong?._id === song._id) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
      {featuredSongs.map((song) => (
        <div
          key={song._id}
          onClick={() => handleCardClick(song)}
          className="flex items-center bg-surface rounded-lg overflow-hidden hover:bg-surface-hover transition-colors group cursor-pointer relative border border-border"
        >
          <img src={song.imageUrl} alt={song.title} className="w-14 sm:w-20 h-14 sm:h-20 object-cover shrink-0" />
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            <p className="font-medium truncate text-text">{song.title}</p>
            <p className="text-sm text-text-muted truncate">{song.artist}</p>
          </div>
          <PlayButton song={song} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;