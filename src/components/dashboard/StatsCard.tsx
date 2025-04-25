
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  description: string;
  value: number;
  limit?: number;
}

export function StatsCard({ title, description, value, limit }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {limit && (
          <p className="text-muted-foreground text-sm mt-1">
            {value}/{limit} limit reached
          </p>
        )}
      </CardContent>
    </Card>
  );
}
