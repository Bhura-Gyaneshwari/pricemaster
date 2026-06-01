/* eslint-disable prettier/prettier */
import { useMemo, useState, useEffect } from "react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trophy,
  AlertCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type RegionKey = "All" | "North" | "South" | "East" | "West";

type RegionalProduct = {
  name: string;
  region: Exclude<RegionKey, "All">;
  unitsSold: number;
  revenue: number;
  profit: number;
  margin: number;
  inventory: number;
};

const DATA: RegionalProduct[] = [
  { name: "Wireless Earbuds Pro", region: "North", unitsSold: 1240, revenue: 161200, profit: 52390, margin: 32.5, inventory: 312 },
  { name: "Smart Home Hub", region: "North", unitsSold: 188, revenue: 16732, profit: 3680, margin: 22.0, inventory: 540 },
  { name: "Noise-Canceling Headset", region: "North", unitsSold: 932, revenue: 278668, profit: 96510, margin: 34.6, inventory: 188 },
  { name: "Athletic Sneakers", region: "South", unitsSold: 1096, revenue: 81104, profit: 24330, margin: 30.0, inventory: 48 },
  { name: "Leather Backpack", region: "South", unitsSold: 178, revenue: 21182, profit: 4870, margin: 23.0, inventory: 36 },
  { name: "Air Fryer XL", region: "South", unitsSold: 416, revenue: 66144, profit: 11250, margin: 17.0, inventory: 690 },
  { name: "Espresso Machine", region: "East", unitsSold: 92, revenue: 32108, profit: 5780, margin: 18.0, inventory: 612 },
  { name: "Cold Brew Maker", region: "East", unitsSold: 768, revenue: 60672, profit: 21240, margin: 35.0, inventory: 144 },
  { name: "4K Action Cam", region: "East", unitsSold: 542, revenue: 118698, profit: 33240, margin: 28.0, inventory: 410 },
  { name: "Yoga Mat Premium", region: "West", unitsSold: 1354, revenue: 66346, profit: 24550, margin: 37.0, inventory: 220 },
  { name: "Wireless Charger Pad", region: "West", unitsSold: 86, revenue: 3354, profit: 540, margin: 16.1, inventory: 410 },
  { name: "Standing Desk Mat", region: "West", unitsSold: 612, revenue: 30600, profit: 10710, margin: 35.0, inventory: 175 },
];

const REGION_FILTERS: RegionKey[] = ["All", "North", "South", "East", "West"];

const REVENUE_TREND = [
  { month: "Jan", North: 92, South: 68, East: 74, West: 58 },
  { month: "Feb", North: 104, South: 72, East: 81, West: 64 },
  { month: "Mar", North: 118, South: 88, East: 79, West: 76 },
  { month: "Apr", North: 132, South: 96, East: 92, West: 81 },
  { month: "May", North: 145, South: 108, East: 101, West: 94 },
  { month: "Jun", North: 162, South: 121, East: 110, West: 108 },
];

function performanceTone(value: number, high: number, low: number) {
  if (value >= high) return { label: "High", cls: "bg-success/15 text-success border-success/30" };
  if (value <= low) return { label: "Low", cls: "bg-destructive/15 text-destructive border-destructive/30" };
  return { label: "Medium", cls: "bg-warning/15 text-warning border-warning/30" };
}

function stockRisk(inv: number) {
  if (inv < 80) return { label: "High Risk", cls: "bg-destructive/15 text-destructive border-destructive/30" };
  if (inv > 500) return { label: "Overstock", cls: "bg-warning/15 text-warning border-warning/30" };
  return { label: "Healthy", cls: "bg-success/15 text-success border-success/30" };
}

function fmtCurrency(n: number) {
  if (n >= 1000) {
    return `₹${(n / 1000).toFixed(1)}K`;
  }

  return `₹${n.toLocaleString("en-IN")}`;
}

function RankBadge({ rank }: { rank: number }) {
  const tones = [
    "bg-warning/20 text-warning border-warning/40",
    "bg-muted text-foreground border-border",
    "bg-accent/15 text-accent border-accent/30",
  ];
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[11px] font-semibold",
        tones[rank - 1] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      #{rank}
    </span>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Award;
  label: string;
  value: string;
  hint?: string;
  tone: "success" | "primary" | "accent" | "warning";
}) {
  const toneMap = {
    success: "text-success bg-success/10",
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    warning: "text-warning bg-warning/10",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-border",
            toneMap[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-soft transition-all hover:border-primary/30">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function RegionalPerformance() {
  const [region, setRegion] = useState<RegionKey>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => (region === "All" ? DATA : DATA.filter((d) => d.region === region)),
    [region],
  );

  const topSelling = useMemo(
    () => [...filtered].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5),
    [filtered],
  );
  const lowestSelling = useMemo(
    () => [...filtered].sort((a, b) => a.unitsSold - b.unitsSold).slice(0, 5),
    [filtered],
  );
  const highestProfit = useMemo(
    () => [...filtered].sort((a, b) => b.profit - a.profit).slice(0, 5),
    [filtered],
  );

  const regionAgg = useMemo(() => {
    const map = new Map<string, { region: string; revenue: number; profit: number; units: number }>();
    DATA.forEach((d) => {
      const cur = map.get(d.region) ?? { region: d.region, revenue: 0, profit: 0, units: 0 };
      cur.revenue += d.revenue;
      cur.profit += d.profit;
      cur.units += d.unitsSold;
      map.set(d.region, cur);
    });
    return Array.from(map.values());
  }, []);

  const bestRegion = [...regionAgg].sort((a, b) => b.units - a.units)[0];
  const highestRevenueRegion = [...regionAgg].sort((a, b) => b.revenue - a.revenue)[0];
  const highestProfitRegion = [...regionAgg].sort((a, b) => b.profit - a.profit)[0];
  const lowestRegion = [...regionAgg].sort((a, b) => a.units - b.units)[0];

  if (loading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-9 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </section>
    );
  }

  const isEmpty = filtered.length === 0;

  return (
    <section className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Analytics
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Regional Product Performance Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare product performance, revenue and profit across regions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card-elevated p-1">
          {REGION_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                region === r
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {r === "All" ? "All Regions" : r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={Trophy} label="Best Performing Region" value={bestRegion.region}hint={`${bestRegion.units.toLocaleString()} units sold`} tone="success" />
        <MiniStat icon={DollarSign} label="Highest Revenue Region" value={highestRevenueRegion.region} hint={fmtCurrency(highestRevenueRegion.revenue)} tone="primary" />
        <MiniStat icon={Award} label="Highest Profit Region" value={highestProfitRegion.region} hint={fmtCurrency(highestProfitRegion.profit)} tone="accent" />
        <MiniStat icon={AlertCircle} label="Lowest Performing Region" value={lowestRegion.region} hint={`${lowestRegion.units.toLocaleString()} units sold`} tone="warning" />
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-border bg-gradient-card p-12 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No data for this region</p>
          <p className="text-xs text-muted-foreground">Try selecting a different region filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard title="Top Selling Products" subtitle="Bar chart by units sold">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSelling.map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), units: p.unitsSold }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.025 252 / 0.4)" />
                    <XAxis dataKey="name" stroke="oklch(0.68 0.025 250)" fontSize={11} />
                    <YAxis stroke="oklch(0.68 0.025 250)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "oklch(0.20 0.024 252)", border: "1px solid oklch(0.30 0.025 252)", borderRadius: 8 }} />
                    <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                      {topSelling.map((_, i) => (
                        <Cell key={i} fill="oklch(0.78 0.16 195)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Profit Comparison by Region" subtitle="Estimated profit per region">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionAgg.map((r) => ({ region: r.region, profit: Math.round(r.profit / 1000) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.025 252 / 0.4)" />
                    <XAxis dataKey="region" stroke="oklch(0.68 0.025 250)" fontSize={11} />
                    <YAxis stroke="oklch(0.68 0.025 250)" fontSize={11} />
                    <Tooltip
                      formatter={(v: number) => [`₹${v}K`, "Profit"]}
                      contentStyle={{ background: "oklch(0.20 0.024 252)", border: "1px solid oklch(0.30 0.025 252)", borderRadius: 8 }}
                    />
                    <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="oklch(0.72 0.13 155)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Revenue Trend by Region" subtitle="Monthly revenue (in ₹K)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.025 252 / 0.4)" />
                  <XAxis dataKey="month" stroke="oklch(0.68 0.025 250)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.025 250)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.20 0.024 252)", border: "1px solid oklch(0.30 0.025 252)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="North" stroke="oklch(0.78 0.16 195)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="South" stroke="oklch(0.72 0.13 155)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="East" stroke="oklch(0.78 0.14 75)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="West" stroke="oklch(0.70 0.18 25)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard title="Top Selling Products" subtitle="Ranked by units sold">
              <div className="space-y-2">
                {topSelling.map((p, i) => {
                  const tone = performanceTone(p.margin, 32, 20);
                  return (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card-elevated/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                    >
                      <RankBadge rank={i + 1} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.region} · {p.unitsSold.toLocaleString()} units · {fmtCurrency(p.revenue)}</p>
                      </div>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", tone.cls)}>
                        {p.margin.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Lowest Selling Products" subtitle="Bottom performers by units">
              <div className="space-y-2">
                {lowestSelling.map((p) => {
                  const risk = stockRisk(p.inventory);
                  return (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card-elevated/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                        <TrendingDown className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.region} · {p.unitsSold.toLocaleString()} units · Inv {p.inventory}</p>
                      </div>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", risk.cls)}>
                        {risk.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Highest Profit Products" subtitle="Top by estimated profit">
              <div className="space-y-2">
                {highestProfit.map((p, i) => {
                  const tone = performanceTone(p.margin, 32, 20);
                  return (
                    <div
                      key={p.name}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card-elevated/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                    >
                      <RankBadge rank={i + 1} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.region} · {fmtCurrency(p.profit)} profit · {fmtCurrency(p.revenue)} rev
                        </p>
                      </div>
                      <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", tone.cls)}>
                        <TrendingUp className="h-3 w-3" />
                        {p.margin.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </section>
  );
}