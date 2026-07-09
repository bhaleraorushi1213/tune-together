import { Library } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsTabContent = () => {
  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-text font-display">
              <Library className="size-5 text-accent" />
              Albums Library
            </CardTitle>
            <CardDescription className="text-text-muted">Manage your album collection</CardDescription>
          </div>
          <AddAlbumDialog />
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        <AlbumsTable />
      </CardContent>
    </Card>
  );
};

export default AlbumsTabContent;