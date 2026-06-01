/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { invokeAgent } from "@/api/invokeAgent";
import { getProductsByRegion } from "@/api/productsByRegion";
import { getProducts } from "@/api/products";
import { ReactNode, useEffect, useState } from "react";
import { getUser } from "@/lib/session";
import {
  ArrowDown,
  ArrowUp,
  Filter,
  Search,
  Tag,
  Check,
  Layers,
  X,
  TrendingUp,
  TrendingDown,
  Package,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
type Product = {
  sku: string;
  suggested: any;
  region: string;
  current: number;
  name: ReactNode;
  category: ReactNode;
  expectedImpact: ReactNode;
  stock_Status: string;
  stock: ReactNode;
  reason: ReactNode;
  trend: string;
  product_sku: string;
  product_name: string;
  product_category: string;
  region_name: string;
  currency: string;
  stock_status: string;
  base_price: number;
  recommended_price: number;
  dynamic_boost_pct: number;
  matched_on: string;
};

export default function PricingPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [bulkPercent, setBulkPercent] = useState<string>("5");
  const [confirmFor, setConfirmFor] = useState<Product | null>(null);
  const [agentResponse, setAgentResponse] =
  useState<any>(null);
  useEffect(() => {
  async function loadProducts() {
    try {
      const user = getUser();

      if (!user?.user_id) return;

      const response = await getProducts(
        user.user_id
      );

      setItems(
  (response.products || []).map(
    (p: any) => ({
      ...p,

      base_price:
        p.current_price_usd || 0,

      recommended_price:
        p.current_price_usd || 0,

      dynamic_boost_pct: 0,

      matched_on:
        p.trend_direction ||
        "Stable demand",
    })
  )
);
    } catch (error) {
      console.error(
        "Products Load Error:",
        error
      );
    }
  }

  loadProducts();
}, []);

 const regions = [
  "All",
  ...Array.from(
    new Set(
      items.map(
        (p) => p.region_name
      )
    )
  ),
];
const filtered = items.filter(
  (p) =>
    (region === "All" ||
      p.region_name === region) &&
    p.product_name
      .toLowerCase()
      .includes(query.toLowerCase())
);

function applySuggestion(
  productSku: string
) {
  setItems((prev) =>
    prev.map((p) =>
      p.product_sku === productSku
        ? {
            ...p,
            base_price:
              p.recommended_price,
          }
        : p,
    ),
  );
}

async function openConfirm(
  p: Product
) {
  try {
    const user = getUser();

    if (!user) return;
    setConfirmFor(p);
setAgentResponse(null);
    const agentResult =
  await invokeAgent(
    user.user_id,
    p.product_name
  );

console.log(
  "Agent Response:",
  agentResult
);

setAgentResponse(
  agentResult
);
  } catch (error) {
    console.error(error);
  }
}

function confirmApply() {
  if (!confirmFor) return;

  applySuggestion(
    confirmFor.product_sku
  );

  setConfirmFor(null);
}
function applyBulk(
  direction: "up" | "down"
) {
  const pct = Number(
    bulkPercent
  );

  if (
    Number.isNaN(pct) ||
    pct <= 0
  )
    return;

  const factor =
    direction === "up"
      ? 1 + pct / 100
      : 1 - pct / 100;

  setItems((prev) =>
    prev.map((p) =>
      region === "All" ||
      p.region_name === region
        ? {
            ...p,

            base_price:
              Math.round(
                p.base_price *
                  factor
              ),

            recommended_price:
              Math.round(
                p.recommended_price *
                  factor
              ),
          }
        : p
    )
  );
}

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-6 py-8">
      <PageHeader
        eyebrow="Pricing"
        title="Recommended Prices"
        description="Each suggestion is backed by demand trends, market price insights, and your stock status."
      />
      {/* Bulk controls */}
      <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Bulk price update</span>
            <span className="text-xs text-muted-foreground">
              {region === "All" ? "all regions" : region}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              className="h-9 w-20 rounded-md border border-border bg-card-elevated px-2 text-sm focus:border-primary focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">%</span>
            <Button size="sm" variant="outline" onClick={() => applyBulk("up")}>
              <ArrowUp className="h-3.5 w-3.5" /> Increase
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyBulk("down")}>
              <ArrowDown className="h-3.5 w-3.5" /> Decrease
            </Button>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            Use the filter below to scope changes to a single region.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="h-10 w-full rounded-lg border border-border bg-card-elevated pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {regions.map((r) => (
            <button
              key={r}
              onClick={async () => {
  try {
    setRegion(r);

    const user = getUser();

    if (!user?.user_id) return;

    if (r === "All") {
      const response =
        await getProducts(user.user_id);

      setItems(
        (response.products || []).map(
          (p: any) => ({
            ...p,
            base_price:
              p.current_price_usd || 0,
            recommended_price:
              p.current_price_usd || 0,
            dynamic_boost_pct: 0,
            matched_on:
              p.trend_direction ||
              "Stable demand",
          })
        )
      );

      return;
    }
const response =
  await getProductsByRegion(
    user.user_id,
    r
  );

    setItems(
      (response.products || []).map(
        (p: any) => ({
          ...p,
          base_price:
            p.current_price_usd || 0,
          recommended_price:
            p.current_price_usd || 0,
          dynamic_boost_pct: 0,
          matched_on:
            p.trend_direction ||
            "Stable demand",
        })
      )
    );
  } catch (error) {
    console.error(error);
  }
}}

              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                region === r
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card-elevated text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
          {region !== "All" && (
  <button
    onClick={async () => {
      setRegion("All");

      const user = getUser();

      if (!user?.user_id) return;

      const response =
        await getProducts(user.user_id);

      setItems(
        (response.products || []).map(
          (p: any) => ({
            ...p,
            base_price:
              p.current_price_usd || 0,
            recommended_price:
              p.current_price_usd || 0,
            dynamic_boost_pct: 0,
            matched_on:
              p.trend_direction ||
              "Stable demand",
          })
        )
      );
    }}
    className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
  >
    Clear
  </button>
)}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card-elevated/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Region</th>
                  <th className="px-4 py-3 text-right font-medium">Current</th>
                  <th className="px-4 py-3 text-right font-medium">Expected impact</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => {
const up =
  p.recommended_price >=
  p.base_price;

const same =
  p.recommended_price ===
  p.base_price;
                  return (
                    <tr
                      key={p.product_sku}
                      className="transition hover:bg-card-elevated/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card-elevated text-muted-foreground">
                            <Tag className="h-4 w-4" />
                          </div>
                          <div>
                           <p className="font-medium text-foreground">
  {p.product_name}
</p>
                            <p className="text-[11px] text-muted-foreground">
  {p.product_category}
</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.region_name}</td>
                      <td className="px-4 py-3 text-right text-foreground">
  ₹{p.base_price.toLocaleString("en-IN")}
</td>
                      <td className="px-4 py-3 text-right">
                        {same ? (
                          <span className="text-xs text-muted-foreground">No change</span>
                        ) : (
                          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                            {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            +{p.dynamic_boost_pct.toFixed(2)}% revenue
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          p.stock_status === "healthy"
                            ? "bg-success/15 text-success"
                            : p.stock_status === "low"
                            ? "bg-warning/15 text-warning"
                            : "bg-accent/15 text-accent"
                        }`}>
                          {p.stock_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={same}
                            onClick={(e) => { e.stopPropagation(); openConfirm(p); }}
                            className="disabled:opacity-40"
                          >
                            <Lightbulb className="h-3.5 w-3.5" /> AI Insights
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>

<ConfirmDialog
  product={confirmFor}
  agentResponse={agentResponse}
  onCancel={() => setConfirmFor(null)}
  onConfirm={confirmApply}
/>
    </div>
  );
}

function ConfirmDialog({
  product,
  agentResponse,
  onCancel,
  onConfirm,
}: {
  product: Product | null;
 agentResponse: any;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const open = !!product;
  if (!product) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
        <DialogContent />
      </Dialog>
    );
  }

const diff =
  product.recommended_price -
  product.base_price;

const pct =
  product.base_price
    ? (diff /
        product.base_price) *
      100
    : 0;
  const up = diff >= 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl border-border bg-gradient-card p-0">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm price change</DialogTitle>
            <DialogDescription>
              Review the details before updating this product's price.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6">
          {/* Top: product + price comparison */}
          <div className="rounded-xl border border-border bg-card-elevated/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Product
                </p>
                <p className="mt-0.5 text-base font-semibold text-foreground">
                  {product.product_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.region_name} · {product.product_category}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  up ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                }`}
              >
                {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {up ? "+" : ""}
                {pct.toFixed(1)}%
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 items-center gap-3">
              <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Current
                </p>
<p className="mt-1 text-2xl font-semibold text-foreground">
  ₹{product.base_price.toLocaleString("en-IN")}
</p>
              </div>
              <div className="text-center text-muted-foreground">
                {up ? (
                  <ArrowUp className="mx-auto h-6 w-6 text-success" />
                ) : (
                  <ArrowDown className="mx-auto h-6 w-6 text-warning" />
                )}
<p className="mt-1 text-xs">
  {up ? "+" : ""}
  ₹{Math.abs(diff).toLocaleString("en-IN")}
</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-primary">
                  Suggested
                </p>
<p className="mt-1 text-2xl font-semibold text-primary">
  ₹{product.recommended_price.toLocaleString("en-IN")}
</p>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Why this change
              </p>
            </div>
<p className="text-sm leading-relaxed text-foreground">
  Matched on: {product.matched_on}
</p>

{agentResponse?.agent_response && (
  <div className="mt-3 rounded-lg border border-border/60 bg-card-elevated/40 p-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
      AI Agent Analysis
    </p>

    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
      {agentResponse.agent_response
  ?.split("\n")
  .map((line: string, index: number) => (
<p
  key={index}
  className={`mb-2 rounded-md px-2 py-1 ${
    line.includes("Suggested Price")
      ? "bg-success/10 text-success"
      : line.includes("Confidence Score")
      ? "bg-primary/10 text-primary"
      : line.includes("Inventory Insight")
      ? "bg-warning/10 text-warning"
      : "text-muted-foreground"
  }`}
>
  {line}
</p>
  ))}
    </p>
  </div>
)}
          </div>

          {/* Impact */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-card-elevated/40 p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {up ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-warning" />
                )}
                <p className="text-[10px] uppercase tracking-wider">Revenue</p>
              </div>
              <p
                className={`mt-1 text-base font-semibold ${
                  up ? "text-success" : "text-warning"
                }`}
              >
                {up ? "+" : "-"}
              {product.dynamic_boost_pct}%
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card-elevated/40 p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <p className="text-[10px] uppercase tracking-wider">Demand</p>
              </div>
<p className="mt-1 text-base font-semibold text-foreground">
  Seasonal Match
</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card-elevated/40 p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                <p className="text-[10px] uppercase tracking-wider">Stock</p>
              </div>
              <p
                className={`mt-1 text-base font-semibold ${
                product.stock_status === "Healthy"
                    ? "text-success"
                    : product.stock_status === "Low"
                      ? "text-warning"
                      : "text-accent"
                }`}
              >
                {product.stock_status}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-background/40 px-6 py-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            onClick={onConfirm}
          >
            <Check className="h-4 w-4" /> Confirm & Apply Price
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
