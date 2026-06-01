/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { getOverstock } from "@/api/overstock";
import { getLowStock } from "@/api/lowStock";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { getInventory } from "@/api/inventory";

import {
  Boxes,
  AlertTriangle,
  PackageCheck,
  PackageX,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

import {
  products,
} from "@/lib/sellerData";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  const [region, setRegion] =
    useState("All");
const [inventoryData, setInventoryData] =
  useState<any[]>([]);
  const [lowStockData, setLowStockData] =
  useState<any>(null);
  const [overstockData, setOverstockData] =
  useState<any>(null);

const [inventorySummary, setInventorySummary] =
  useState({
    total_products: 0,
    low_stock_count: 0,
    overstock_count: 0,
    healthy_count: 0,
  });

useEffect(() => {
  const loadInventory = async () => {
    try {
      const user = getUser();
      console.log("Current User:", user);

      if (!user?.email) {
        console.error("No logged in user found");
        return;
      }

      const result = await getInventory(
        user.user_id
      );
      const lowStockResult =
  await getLowStock(
    user.user_id
  );

console.log(
  "Low Stock:",
  lowStockResult
);

setLowStockData(
  lowStockResult
);
const overstockResult =
  await getOverstock(
    user.user_id
  );

console.log(
  "Overstock:",
  overstockResult
);

setOverstockData(
  overstockResult
);

      setInventoryData(
        result.products || []
      );
      setInventorySummary({
  total_products:
    result.total_products || 0,
  low_stock_count:
    result.low_stock_count || 0,
  overstock_count:
    result.overstock_count || 0,
  healthy_count:
    result.healthy_count || 0,
});

      console.log(
        "Inventory Data:",
        result
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadInventory();
}, []);

const low =
  lowStockData?.items || [];

const over =
  overstockData?.items || [];

const healthy = inventoryData.filter(
  (p) => p.stock_status === "healthy"
);

const total = inventoryData.reduce(
  (sum, p) => sum + p.units_on_hand,
  0
);

  const regions = [
    "All",
    ...new Set(
      products.map((p) => p.region)
    ),
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-6 py-8">
      <PageHeader
        eyebrow="Stock Status"
        title="Inventory"
        description="Keep an eye on stock levels — low stock can trigger price increases, overstock can trigger markdowns."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Products"
          value={total.toLocaleString()}
          icon={Boxes}
          accent="primary"
        />
        <StatCard
          label="Healthy SKUs"
          value={String(
  inventorySummary.healthy_count
)}
          icon={PackageCheck}
          accent="success"
        />

<StatCard
  label="Low Stock"
  value={String(
    lowStockData?.total || 0
  )}
  delta="needs restock"
  trend="down"
  icon={AlertTriangle}
  accent="warning"
/>

<StatCard
  label="Overstock"
  value={String(
    overstockData?.total || 0
  )}
  delta="consider markdown"
  trend="down"
  icon={PackageX}
  accent="accent"
/>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          title="Low stock"
          tone="warning"
          items={low}
        />

        <Section
          title="Overstock"
          tone="accent"
          items={over}
        />
      </div>

      <div className="rounded-xl border border-border bg-gradient-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border/60 p-5">
          <h3 className="text-base font-semibold">
            All inventory
          </h3>

          <select
            value={region}
            onChange={(e) =>
              setRegion(
                e.target.value
              )
            }
            className="h-10 rounded-lg border border-border bg-card-elevated px-3 text-sm"
          >
            {regions.map((r) => (
              <option
                key={r}
                value={r}
              >
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card-elevated/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Product
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Stock
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Suggestion
                </th>
              </tr>
            </thead>

<tbody className="divide-y divide-border/60">
  {inventoryData.map((p, index) => (
    <tr
      key={`${p.product_name}-${index}`}
      className="hover:bg-card-elevated/40"
    >
      <td className="px-4 py-3 font-medium">
        {p.product_name}
      </td>

      <td className="px-4 py-3 text-right">
        {p.units_on_hand}
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            p.stock_status === "healthy"
              ? "bg-success/15 text-success"
              : p.stock_status === "low"
              ? "bg-warning/15 text-warning"
              : "bg-accent/15 text-accent"
          }`}
        >
          {p.stock_status}
        </span>
      </td>

      <td className="px-4 py-3 text-xs text-muted-foreground">
        {p.suggestion}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  tone,
  items,
}: {
  title: string;

  tone: "warning" | "accent";

  items: {
  product_name: string;
  units_on_hand: number;
  stock_status: string;
  suggestion: string;
}[];
}) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-soft">
      <h3 className="mb-4 text-base font-semibold">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing to worry about
          right now.
        </p>
      ) : (
        <div className="space-y-2">
{items.map((p, index) => (
  <div
    key={`${p.product_name}-${index}`}
    className="flex items-center gap-3 rounded-lg border border-border/60 bg-card-elevated/40 p-3"
  >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md ${
                  tone === "warning"
                    ? "bg-warning/15 text-warning"
                    : "bg-accent/15 text-accent"
                }`}
              >
                {tone ===
                "warning" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <PackageX className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {p.product_name}
                </p>

                <p className="text-xs text-muted-foreground">
{p.units_on_hand} units
                </p>
              </div>

<span
  className={`text-xs font-semibold ${
    tone === "warning"
      ? "text-warning"
      : "text-accent"
  }`}
>
  {tone === "warning"
    ? "Restock Soon"
    : "Consider Markdown"}
</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}