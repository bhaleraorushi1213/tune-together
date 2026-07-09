// frontend/src/components/AddToPlaylistMenu.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Check, ListMusic } from "lucide-react";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useUser } from "@clerk/react";
import { Button } from "./ui/button";
import type { Song } from "../types";
import { cn } from "../lib/utils";

const MENU_WIDTH = 224; // w-56
const MENU_MAX_HEIGHT = 256; // max-h-64
const VIEWPORT_MARGIN = 8;

const AddToPlaylistMenu = ({ song, className }: { song: Song; className?: string }) => {
  const { user } = useUser();
  const { playlists, fetchUserPlaylists, addSongToPlaylist, removeSongFromPlaylist } = usePlaylistStore();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [menuHeight, setMenuHeight] = useState(MENU_MAX_HEIGHT);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && user) fetchUserPlaylists();
  }, [open, user, fetchUserPlaylists]);

  // compute a fixed-position spot for the menu, clamped to the viewport so it
  // never renders off-screen regardless of which card triggered it
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const measuredHeight = menuRef.current?.offsetHeight ?? MENU_MAX_HEIGHT;
      const availableHeight = Math.max(120, window.innerHeight - VIEWPORT_MARGIN * 2);
      const safeHeight = Math.min(measuredHeight, availableHeight);
      setMenuHeight(safeHeight);

      let left = rect.right - MENU_WIDTH; // default: align right edge to button
      if (left < VIEWPORT_MARGIN) left = rect.left; // flip to left-aligned if it'd clip the left edge
      left = Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN);
      left = Math.max(left, VIEWPORT_MARGIN);

      let top = rect.bottom + 8;
      if (top + safeHeight > window.innerHeight - VIEWPORT_MARGIN) {
        top = rect.top - safeHeight - 8;
      }

      top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - safeHeight - VIEWPORT_MARGIN));
      setCoords({ top, left });
    };

    const rafId = window.requestAnimationFrame(updatePosition);
    const handleScrollOrResize = () => updatePosition();

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [open, playlists.length]);

  // close on outside click, scroll, or resize — since it's now portaled and
  // no longer moves with its trigger automatically
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScrollOrResize = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  if (!user) return null;

  const isInPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p._id === playlistId);
    return playlist?.songs.some((s) => s._id === song._id) ?? false;
  };

  const handleToggle = (playlistId: string) => {
    if (isInPlaylist(playlistId)) removeSongFromPlaylist(playlistId, song._id);
    else addSongToPlaylist(playlistId, song._id);
  };

  return (
    <>
      <Button
        ref={triggerRef}
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn("size-8 text-text-muted hover:text-text hover:bg-transparent cursor-pointer", className)}
        title="Add to playlist"
      >
        <Plus className="size-4" />
      </Button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH, maxHeight: menuHeight }}
            className="bg-surface-raised border border-border rounded-lg shadow-lg z-50 overflow-y-auto"
          >
            <div className="px-3 py-2 text-xs text-text-muted border-b border-border font-medium sticky top-0 bg-surface-raised">
              Add to playlist
            </div>
            {playlists.length === 0 ? (
              <div className="px-3 py-3 text-sm text-text-muted flex items-center gap-2">
                <ListMusic className="size-4 shrink-0" />
                No playlists yet
              </div>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleToggle(playlist._id)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors text-left"
                >
                  <span className="truncate">{playlist.title}</span>
                  {isInPlaylist(playlist._id) && <Check className="size-4 text-primary shrink-0" />}
                </button>
              ))
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default AddToPlaylistMenu;