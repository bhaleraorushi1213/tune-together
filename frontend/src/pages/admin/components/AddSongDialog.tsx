import { useRef, useState } from "react";

import { useMusicStore } from "../../../stores/useMusicStore";
import { axiosInstance } from "../../../lib/axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Input } from "../../../components/ui/input";

import toast from "react-hot-toast";

const AddSongDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSong, setNewSong] = useState<{
    title: string,
    artist: string,
    album: string | null,
    duration: string
  }>({
    title: "",
    artist: "",
    album: "",
    duration: "0"
  });

  const [files, setFiles] = useState<{ audio: File | null, image: File | null }>({
    audio: null,
    image: null
  });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { albums } = useMusicStore();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.image || !files.audio) {
        toast.error("Please upload both audio and image files");
      }

      const formData = new FormData();

      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }
      formData.append("audioFile", files.audio!);
      formData.append("imageFile", files.image!);

      await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0"
      });

      setFiles({
        audio: null,
        image: null
      });

      setIsDialogOpen(false);

      toast.success("Song added successfully");
    } catch (error: any) {
      toast.error("Failed to add song: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="bg-primary hover:bg-primary-hover text-text w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className={"bg-surface border-border max-h-[85vh] overflow-y-auto w-[95vw] sm:w-full"}>
        <DialogHeader>
          <DialogTitle className="text-text font-display">Add New Song</DialogTitle>
          <DialogDescription className="text-text-muted">Add a new song to your music library</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
          />
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
          />

          {/* IMAGE UPLOAD AREA */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer"
            onClick={() => {
              if(isLoading) return;
              imageInputRef.current?.click();
            }}
          >
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className="text-sm text-emerald-500">Image selected:</div>
                  <div className="text-xs text-emerald-400">{files.image.name.slice(0, 20)}</div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-surface-hover rounded-full inline-block mb-2">
                    <Upload className="size-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                  <Button variant={"outline"} size="sm" className={"text-xs"} disabled={isLoading}>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* AUDIO UPLOAD AREA */}
          <div className="space-y-2">
            <label className="text-sm font-medium ">Audio Files</label>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} onClick={() => audioInputRef.current?.click()} className={"w-full"} disabled={isLoading}>
                {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="bg-surface-hover border-border text-text"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              className="bg-surface-hover border-border text-text"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type="number"
              min="0"
              value={newSong.duration}
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
              className="bg-surface-hover border-border text-text"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Album (optional)</label>
            <Select
              value={newSong.album}
              onValueChange={(val) => setNewSong({ ...newSong, album: val })}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-surface-hover border-border w-full">
                <SelectValue placeholder="Select an album" />
              </SelectTrigger>
              <SelectContent className={"bg-surface-hover border-border"}>
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddSongDialog