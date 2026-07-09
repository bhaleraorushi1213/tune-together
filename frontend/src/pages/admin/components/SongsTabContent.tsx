import { Music } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";

const SongsTabContent = () => {
  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-text font-display">
              <Music className="size-5 text-primary" />
              Songs Library
            </CardTitle>
            <CardDescription className="text-text-muted">Manage your music tracks</CardDescription>
          </div>
          <AddSongDialog />
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto">
        <SongsTable />
      </CardContent>
    </Card>
  );
};

export default SongsTabContent;