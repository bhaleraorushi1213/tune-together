import { useState } from "react";
import { createPortal } from "react-dom";
import { X, GripVertical, Play, Pause } from "lucide-react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { cn } from "../lib/utils";

const QueuePanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { queue, currentIndex, isPlaying, playFromQueue, togglePlay, reorderQueue, removeFromQueue } = usePlayerStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  if (!open) return null;

  return createPortal(
    <>
      {/* backdrop — click to close */}
      <div className="fixed inset-0 bg-base/60 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-surface border-l border-border z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="font-display font-semibold text-text">Queue</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {queue.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">Queue is empty</p>
          ) : (
            queue.map((song, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={`${song._id}-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null && dragIndex !== index) reorderQueue(dragIndex, index);
                    setDragIndex(null);
                  }}
                  onClick={() => (isCurrent ? togglePlay() : playFromQueue(index))}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors",
                    isCurrent ? "bg-primary/15" : "hover:bg-surface-hover"
                  )}
                >
                  <GripVertical className="size-4 text-text-faint shrink-0 cursor-grab" />

                  <div className="relative shrink-0">
                    <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-base/60 rounded flex items-center justify-center">
                        {isPlaying ? <Pause className="size-3.5 text-text" /> : <Play className="size-3.5 text-text" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate", isCurrent ? "text-primary font-medium" : "text-text")}>{song.title}</p>
                    <p className="text-xs text-text-muted truncate">{song.artist}</p>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger shrink-0 transition-opacity"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default QueuePanel;