import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import StatsCard from "./StatsCard";

const DashBoardStats = () => {
  const { stats } = useMusicStore();

  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats.totalSongs.toString(),
      bgColor: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stats.totalAlbums.toString(),
      bgColor: "bg-accent/20",
      iconColor: "text-accent",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: stats.totalArtists.toString(),
      bgColor: "bg-success/20",
      iconColor: "text-success",
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      value: stats.totalUsers.toString(),
      bgColor: "bg-text-muted/20",
      iconColor: "text-text-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statsData.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

export default DashBoardStats;