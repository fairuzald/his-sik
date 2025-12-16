import { H3, Small, Span } from "@/components/elements/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <H3 className="text-2xl font-bold">{value}</H3>
        {(description || trend) && (
          <Small className="text-muted-foreground">
            {trend && (
              <Span className={trendUp ? "text-green-500" : "text-red-500"}>
                {trend}
              </Span>
            )}
            {trend && description ? " " : ""}
            {description}
          </Small>
        )}
      </CardContent>
    </Card>
  );
}
