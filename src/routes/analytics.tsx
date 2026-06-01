/* eslint-disable prettier/prettier */
import { RegionalPerformance } from "@/components/RegionalPerformance";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Analytics
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          Regional Product Performance Analytics
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Compare product performance,
          revenue and profit across
          regions.
        </p>
        <RegionalPerformance />
      </div>
    </div>
  );
}