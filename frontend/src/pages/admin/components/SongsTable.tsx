import { Calendar, Loader2, Trash2 } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";

const SongsTable = () => {
  const { songs, isSongsLoading, error, deleteSong } = useMusicStore();

  if (isSongsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400"><Loader2 className="size-10 animate-spin" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">{error}</div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-12.5"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artists</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song) => (
          <TableRow key={song._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
            </TableCell>
            <TableCell className="font-medium">{song.title}</TableCell>
            <TableCell>{song.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="size-4" />
                {song.createdAt.split("T")[0]}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant={"ghost"}
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => deleteSong(song._id)}
                >
                  <Trash2 className="size-4" /> 
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SongsTable;