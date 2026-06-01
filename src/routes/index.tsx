/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { getDashboard } from "@/api/dashboard";
import { getUser } from "@/lib/session";
import {
  AlertTriangle,
  IndianRupee,
  Percent,
  ShoppingBag,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { UploadDatasetButton } from "@/components/UploadDatasetButton";
import { products, revenueTrend } from "@/lib/sellerData";

export default function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState({
      today_revenue: 0,
      total_orders: 0,
      profit_margin: 0,
      stock_alerts: 0,
      revenue_this_week: [],
    });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const user = getUser();

        console.log(
          "Current User:",
          user
        );

        if (!user) {
          console.error(
            "No logged in user"
          );
          return;
        }

        const result =
          await getDashboard(
            user.user_id
          );

        console.log(
          "Dashboard Data:",
          result
        );

        setDashboardData(result);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  const stockAlerts = products.filter(
    (p) =>
      p.stockStatus !== "Healthy"
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(180deg,white,transparent_60%)]" />

      <div className="relative mx-auto max-w-[1400px] space-y-8 px-6 py-8">

        <PageHeader
          eyebrow="Today"
          title="Welcome back 👋"
          description="Here's your business health at a glance."
          actions={
            <div className="flex items-center gap-2">

              <UploadDatasetButton />

              <Button
                size="sm"
                variant="outline"

                
              >
                <Zap className="h-4 w-4" />
                Run Optimization
              </Button>
            </div>
          }
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Today's Revenue"
            value={
              dashboardData.today_revenue
                ? `₹${dashboardData.today_revenue.toLocaleString(
                    "en-IN"
                  )}`
                : "N/A"
            }
            icon={IndianRupee}
            accent="success"
          />

          <StatCard
            label="Total Orders"
            value={
              dashboardData.total_orders
                ? String(
                    dashboardData.total_orders
                  )
                : "N/A"
            }
            icon={ShoppingBag}
            accent="primary"
          />

          <StatCard
            label="Profit Margin"
            value={
              dashboardData.profit_margin
                ? `${dashboardData.profit_margin}%`
                : "N/A"
            }
            icon={Percent}
            accent="accent"
          />

          <StatCard
            label="Stock Alerts"
            value={
              dashboardData.stock_alerts
                ? String(
                    dashboardData.stock_alerts
                  )
                : "N/A"
            }
            trend="down"
            icon={AlertTriangle}
            accent="warning"
          />

        </section>

        <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-soft">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h3 className="text-base font-semibold">
                Revenue this week
              </h3>

              <p className="text-xs text-muted-foreground">
                Daily revenue across all
                regions (in ₹K)
              </p>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              +18.6% WoW
            </span>

          </div>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={revenueTrend}
              >
                <defs>
                  <linearGradient
                    id="dashRev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="oklch(0.78 0.16 195)"
                      stopOpacity={0.55}
                    />

                    <stop
                      offset="100%"
                      stopColor="oklch(0.78 0.16 195)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.30 0.025 252 / 0.4)"
                />

                <XAxis
                  dataKey="day"
                  stroke="oklch(0.68 0.025 250)"
                  fontSize={12}
                />

                <YAxis
                  stroke="oklch(0.68 0.025 250)"
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "oklch(0.20 0.024 252)",
                    border:
                      "1px solid oklch(0.30 0.025 252)",
                    borderRadius: 8,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.78 0.16 195)"
                  fill="url(#dashRev)"
                  strokeWidth={2.5}
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>
    </div>
  );
}