import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Button } from "../../components/ui/button";
import { ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, VolumeX } from "lucide-react";
import { Slider } from "../../components/ui/slider";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    }

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    }

  }, [currentSong])

  const handleSeek = (value: number | readonly number[]) => {
    const seekTime = Array.isArray(value) ? value[0] : value;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }

  return (
    <footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
      <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>

        {/* CURRENTLY PLAYING SONG */}
        <div className='flex items-center gap-4 md:min-w-45 w-[10%] md:w-[30%]'>
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className='w-14 h-14 object-cover rounded-md'
              />
              <div className='hidden md:block sm:flex-1 min-w-0'>
                <div className='font-medium truncate hover:underline cursor-pointer'>
                  {currentSong.title}
                </div>
                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PLAYER CONTROLS */}
        <div className='flex flex-col justify-center items-center gap-2 flex-1 max-w-[50%] sm:max-w-[45%]'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Button
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400'
            >
              <Shuffle className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              className='bg-green-500 hover:bg-green-500/80 text-black rounded-full h-8 w-8'
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className='h-4 w-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400'
            >
              <Repeat className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-center gap-2 w-75 md:w-full'>
            <div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={handleSeek}
            />
            <div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
          </div>
        </div>

        {/* VOLUME CONTROLS */}
        <div className='flex items-center gap-4 min-w-45 w-[30%] justify-end'>
          {/* <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
            <Mic2 className='h-4 w-4' />
          </Button> */}
          <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
            <ListMusic className='size-5' />
          </Button>
          {/* <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
            <Laptop2 className='h-4 w-4' />
          </Button> */}

          <div className="flex items-center gap-2 w-32">
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
              onClick={() => {
                if(audioRef.current) {
                  setIsMuted(!audioRef.current.muted);
                  audioRef.current.muted = !audioRef.current.muted
                }
              }}
            >
              {isMuted ? <VolumeX className='size-5' /> : <Volume1 className='size-5' />}
            </Button>

            <Slider
              value={[volume]}
              max={100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value) => {
                const newVolume = Array.isArray(value) ? value[0] : value;
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume / 100;
                }
              }}
              disabled={isMuted}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PlaybackControls;