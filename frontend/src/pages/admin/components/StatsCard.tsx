import { Card, CardContent } from "../../../components/ui/card";

type StatsCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
};

const StatsCard = ({ icon: Icon, label, value, bgColor, iconColor }: StatsCardProps) => {
  return (
    <Card className="bg-surface border-border hover:bg-surface-hover transition-colors">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`p-2.5 sm:p-3 rounded-lg shrink-0 ${bgColor}`}>
            <Icon className={`size-5 sm:size-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-text-muted truncate">{label}</p>
            <p className="text-xl sm:text-2xl font-display font-bold text-text">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;