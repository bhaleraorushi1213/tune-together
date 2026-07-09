import { Heart, Pause, Play } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { usePlaylistStore } from "../../../stores/usePlaylistStore";
import { useUser } from "@clerk/react";
import type { Song } from "../../../types";
import { cn } from "../../../lib/utils";
import AddToPlaylistMenu from "../../../components/AddToPlaylistMenu";

const PlayButton = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const { isSongLiked, toggleLikeSong } = usePlaylistStore();
  const { user } = useUser();

  const isCurrentSong = currentSong?._id === song._id;
  const liked = isSongLiked(song._id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // card has its own click-to-play handler now — avoid double-toggling
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeSong(song._id);
  };

  return (
    <div className="absolute bottom-3 right-2 flex items-center gap-1">
      {user && (
        <>
          <AddToPlaylistMenu
            song={song}
            className="opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all "
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLike}
            className={cn(
              "size-8 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-transparent",
              liked && "opacity-100"
            )}
          >
            <Heart className={cn("size-4", liked ? "fill-accent text-accent" : "text-text")} />
          </Button>
        </>
      )}

      <Button
        size="icon"
        onClick={handlePlay}
        className={cn(
          "bg-primary hover:bg-primary-hover rounded-lg opacity-0 translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer",
          isCurrentSong ? "opacity-100" : "group-hover:opacity-100"
        )}
      >
        {isCurrentSong && isPlaying ? <Pause className="size-5 text-text" /> : <Play className="size-5 text-text" />}
      </Button>
    </div>
  );
};

export default PlayButton;