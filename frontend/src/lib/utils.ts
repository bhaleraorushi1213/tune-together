import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getPlaylistCover = (playlist: { imageUrl: string; songs: { imageUrl: string }[] }) => {
  if (playlist.songs.length > 0) return playlist.songs[0].imageUrl;
  return playlist.imageUrl; // falls back to the placeholder set at creation
};

// .focus-visible\:ring-3 {
//     &:focus-visible {
//         --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
//         box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
//     }
// }