import { Calendar, Loader2, Trash2 } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";

const SongsTable = () => {
  const { songs, isSongsLoading, error, deleteSong } = useMusicStore();

  if (isSongsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-10 animate-spin text-text-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (

    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table className="min-w-150">
        <TableHeader>
          <TableRow className="hover:bg-surface-hover border-border">
            <TableHead className="w-12.5"></TableHead>
            <TableHead className="text-text-muted">Title</TableHead>
            <TableHead className="text-text-muted">Artists</TableHead>
            <TableHead className="text-text-muted">Release Date</TableHead>
            <TableHead className="text-right text-text-muted">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song._id} className="hover:bg-surface-hover border-border">
              <TableCell>
                <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium text-text">{song.title}</TableCell>
              <TableCell className="text-text-muted">{song.artist}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Calendar className="size-4" />
                  {song.createdAt.split("T")[0]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:text-danger hover:bg-danger/10"
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
    </div>
  );
};

export default SongsTable;