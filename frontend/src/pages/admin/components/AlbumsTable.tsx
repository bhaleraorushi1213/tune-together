import { Calendar, Loader2, Music, Trash2 } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";

const AlbumsTable = () => {
  const { albums, isLoading, error, deleteAlbum } = useMusicStore();

  if (isLoading) {
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
            <TableHead className="text-text-muted">Artist</TableHead>
            <TableHead className="text-text-muted">Release Year</TableHead>
            <TableHead className="text-text-muted">Songs</TableHead>
            <TableHead className="text-right text-text-muted">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {albums.map((album) => (
            <TableRow key={album._id} className="hover:bg-surface-hover border-border">
              <TableCell>
                <img src={album.imageUrl} alt={album.title} className="w-10 h-10 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium text-text">{album.title}</TableCell>
              <TableCell className="text-text-muted">{album.artist}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Calendar className="h-4 w-4" />
                  {album.releaseYear}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Music className="h-4 w-4" />
                  {album.songs.length} songs
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlbum(album._id)}
                    className="text-danger hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default AlbumsTable;