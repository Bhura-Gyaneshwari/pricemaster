/* eslint-disable prettier/prettier */
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BrainCircuit, CalendarDays, Filter } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
/* ─── Mock data generators ─── */

const regions = ["All", "NA-East", "NA-West", "EU-Central", "EU-North", "APAC-SEA", "APAC-IN", "LATAM"];
const categories = ["All", "Electronics", "Apparel", "Home", "Fitness"];
const horizons = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

const today = new Date();
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

function generateTrendData(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: fmtDate(d),
      demand: Math.round(120 + Math.sin(i * 0.3) * 40 + Math.random() * 20),
      forecast: Math.round(130 + Math.sin(i * 0.3) * 35 + Math.random() * 15),
      revenue: Math.round(450 + Math.sin(i * 0.25) * 150 + Math.random() * 50),
      revenueForecast: Math.round(480 + Math.sin(i * 0.25) * 140 + Math.random() * 40),
    });
  }
  return data;
}

/* ─── Page ─── */

export default function ForecastingPage() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [horizon, setHorizon] = useState(30);

  const trendData = useMemo(() => generateTrendData(horizon), [horizon]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-6 py-8">
      <PageHeader
        eyebrow="Forecasting"
        title="Demand Forecasting"
        description="Predict future demand, revenue trends, and inventory requirements."
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-gradient-card p-4 shadow-soft md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card-elevated px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Regions" : r}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card-elevated px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card-elevated p-1">
            {horizons.map((h) => (
              <button
                key={h.days}
                onClick={() => setHorizon(h.days)}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  horizon === h.days
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="h-3 w-3" />
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        {/* Demand Forecast Trend */}
        <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-soft">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <BrainCircuit className="h-4 w-4 text-primary" />
              Demand Forecast Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Actual vs forecasted demand over time
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.025 252 / 0.4)" />
                <XAxis dataKey="date" stroke="oklch(0.68 0.025 250)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.025 250)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.024 252)",
                    border: "1px solid oklch(0.30 0.025 252)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="demand"
                  name="Actual Demand"
                  stroke="oklch(0.65 0.15 195)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="oklch(0.78 0.16 150)"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
