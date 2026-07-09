import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Button } from "../../components/ui/button";
import { ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, VolumeX, Repeat1 } from "lucide-react";
import { Slider } from "../../components/ui/slider";
import { cn } from "../../lib/utils";
import QueuePanel from "../../components/QueuePanel";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffled, repeatMode, toggleShuffle, cycleRepeatMode } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileVolume, setShowMobileVolume] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumePopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => usePlayerStore.setState({ isPlaying: false });

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  // close mobile volume popover on outside tap
  useEffect(() => {
    if (!showMobileVolume) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(e.target as Node)) {
        setShowMobileVolume(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileVolume]);

  const handleSeek = (value: number | readonly number[]) => {
    const seekTime = Array.isArray(value) ? value[0] : value;
    if (audioRef.current) audioRef.current.currentTime = seekTime;
  };

  const handleVolumeChange = (value: number | readonly number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume / 100;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!audioRef.current.muted);
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <footer className="bg-surface border-t border-border shrink-0">
        {/* MOBILE: thin progress strip above the compact bar */}
        <div className="sm:hidden h-0.5 bg-surface-hover">
          <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        {/* MOBILE: compact single-row controls */}
        <div className="sm:hidden flex items-center gap-1.5 px-2 py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {currentSong ? (
              <>
                <img src={currentSong.imageUrl} alt={currentSong.title} className="w-9 h-9 object-cover rounded-md shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate text-text leading-tight">{currentSong.title}</div>
                  <div className="text-xs text-text-muted truncate leading-tight">{currentSong.artist}</div>
                </div>
              </>
            ) : (
              <div className="text-sm text-text-muted">No song playing</div>
            )}
          </div>

          <Button size="icon" variant="ghost" className="text-text-muted shrink-0 size-8" onClick={playPrevious} disabled={!currentSong}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-primary hover:bg-primary-hover text-text rounded-lg h-8 w-8 shrink-0"
            onClick={togglePlay}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="ghost" className="text-text-muted shrink-0 size-8" onClick={playNext} disabled={!currentSong}>
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button size="icon" variant="ghost" className="hover:text-text text-text-muted" onClick={() => setQueueOpen(true)}>
            <ListMusic className="size-5" />
          </Button>

          {/* volume — icon toggles a floating slider popover, since a full-width slider won't fit this row */}
          <div className="relative shrink-0" ref={volumePopoverRef}>
            <Button
              size="icon"
              variant="ghost"
              className="text-text-muted size-8"
              onClick={() => setShowMobileVolume((v) => !v)}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume1 className="size-4" />}
            </Button>

            {showMobileVolume && (
              <div className="absolute bottom-full right-0 mb-2 bg-surface-raised border border-border rounded-lg p-3 shadow-lg w-40 flex items-center gap-2 z-20">
                <Button size="icon" variant="ghost" className="size-6 shrink-0 text-text-muted" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="size-4" /> : <Volume1 className="size-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleVolumeChange}
                  disabled={isMuted}
                />
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP/TABLET */}
        <div className="hidden sm:flex justify-between items-center h-24 px-4 max-w-[1800px] mx-auto">

          {/* CURRENTLY PLAYING SONG */}
          <div className="flex items-center gap-4 min-w-0 w-[30%]">
            {currentSong && (
              <>
                <img src={currentSong.imageUrl} alt={currentSong.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate hover:underline cursor-pointer text-text">{currentSong.title}</div>
                  <div className="text-sm text-text-muted truncate hover:underline cursor-pointer">{currentSong.artist}</div>
                </div>
              </>
            )}
          </div>

          {/* PLAYER CONTROLS */}
          <div className="flex flex-col justify-center items-center gap-2 flex-1 max-w-150 px-4">
            <div className="flex items-center gap-4 md:gap-6">
              <Button
                size="icon"
                variant="ghost"
                className={cn("hidden md:inline-flex hover:text-text", isShuffled ? "text-primary" : "text-text-muted")}
                onClick={toggleShuffle}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:text-text text-text-muted" onClick={playPrevious} disabled={!currentSong}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary-hover text-text rounded-lg h-9 w-9"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button size="icon" variant="ghost" className="hover:text-text text-text-muted" onClick={playNext} disabled={!currentSong}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn("hidden md:inline-flex hover:text-text", repeatMode !== "off" ? "text-primary" : "text-text-muted")}
                onClick={cycleRepeatMode}
              >
                {repeatMode === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <div className="text-xs text-text-muted w-8 text-right shrink-0">{formatTime(currentTime)}</div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                className="w-full hover:cursor-grab active:cursor-grabbing"
                onValueChange={handleSeek}
              />
              <div className="text-xs text-text-muted w-8 shrink-0">{formatTime(duration)}</div>
            </div>
          </div>

          {/* VOLUME CONTROLS*/}
          <div className="flex items-center gap-2 md:gap-4 w-[30%] justify-end">
            <Button size="icon" variant="ghost" className="hidden md:inline-flex hover:text-text text-text-muted">
              <ListMusic className="size-5" />
            </Button>

            <div className="flex items-center gap-2 w-20 md:w-32">
              <Button size="icon" variant="ghost" className="hover:text-text text-text-muted shrink-0" onClick={toggleMute}>
                {isMuted ? <VolumeX className="size-5" /> : <Volume1 className="size-5" />}
              </Button>

              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-full hover:cursor-grab active:cursor-grabbing"
                onValueChange={handleVolumeChange}
                disabled={isMuted}
              />
            </div>
          </div>
        </div>
      </footer>
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  );
};

export default PlaybackControls;