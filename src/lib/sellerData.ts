export type Product = {
  sku: string;
  name: string;
  category: string;
  region: string;
  current: number;
  suggested: number;
  stock: number;
  stockStatus: "Healthy" | "Low" | "Overstock";
  expectedImpact: number; // % revenue impact
  reason: string;
  trend: "up" | "down" | "flat";
  unitsSold: number;
};

export const products: Product[] = [
  { sku: "SKU-48201", name: "Wireless Earbuds Pro", category: "Electronics", region: "EU-Central", current: 129, suggested: 142, stock: 312, stockStatus: "Healthy", expectedImpact: 10.1, reason: "Demand up 18% this week — competitor stock is low.", trend: "up", unitsSold: 412 },
  { sku: "SKU-12940", name: "Smart Home Hub", category: "Electronics", region: "NA-West", current: 89, suggested: 84, stock: 540, stockStatus: "Overstock", expectedImpact: 6.4, reason: "Competitor lowered price by 6% — small reduction recommended.", trend: "down", unitsSold: 188 },
  { sku: "SKU-77182", name: "Athletic Sneakers", category: "Apparel", region: "APAC-SEA", current: 74, suggested: 79, stock: 48, stockStatus: "Low", expectedImpact: 8.2, reason: "Stock running low and demand is steady — increase price.", trend: "up", unitsSold: 296 },
  { sku: "SKU-30418", name: "Espresso Machine", category: "Home", region: "EU-North", current: 349, suggested: 329, stock: 612, stockStatus: "Overstock", expectedImpact: 12.5, reason: "Overstock in warehouse — drop price to clear inventory.", trend: "down", unitsSold: 92 },
  { sku: "SKU-22091", name: "Yoga Mat Premium", category: "Fitness", region: "NA-East", current: 49, suggested: 54, stock: 220, stockStatus: "Healthy", expectedImpact: 5.7, reason: "Search interest up 12% — small price lift recommended.", trend: "up", unitsSold: 354 },
  { sku: "SKU-66102", name: "4K Action Cam", category: "Electronics", region: "APAC-IN", current: 219, suggested: 199, stock: 410, stockStatus: "Healthy", expectedImpact: 9.3, reason: "Competitor markdown detected — match to stay competitive.", trend: "down", unitsSold: 142 },
  { sku: "SKU-19087", name: "Leather Backpack", category: "Apparel", region: "LATAM", current: 119, suggested: 129, stock: 36, stockStatus: "Low", expectedImpact: 7.8, reason: "Low stock + repeat buyers — increase price safely.", trend: "up", unitsSold: 178 },
  { sku: "SKU-90014", name: "Cold Brew Maker", category: "Home", region: "EU-Central", current: 79, suggested: 89, stock: 144, stockStatus: "Healthy", expectedImpact: 11.2, reason: "Trending in EU-Central — high willingness to pay.", trend: "up", unitsSold: 268 },
  { sku: "SKU-55821", name: "Noise-Canceling Headset", category: "Electronics", region: "NA-West", current: 299, suggested: 319, stock: 188, stockStatus: "Healthy", expectedImpact: 8.9, reason: "Demand surge after recent product review.", trend: "up", unitsSold: 232 },
  { sku: "SKU-44210", name: "Air Fryer XL", category: "Home", region: "APAC-SEA", current: 159, suggested: 149, stock: 690, stockStatus: "Overstock", expectedImpact: 6.0, reason: "Overstock — drop price 6% to push faster sales.", trend: "down", unitsSold: 116 },
];

export const regions = [
  { name: "NA-East", revenue: 42000, sales: 1284, share: 22 },
  { name: "NA-West", revenue: 38000, sales: 1102, share: 19 },
  { name: "EU-Central", revenue: 51000, sales: 1418, share: 25 },
  { name: "EU-North", revenue: 29000, sales: 802, share: 14 },
  { name: "APAC-SEA", revenue: 34000, sales: 988, share: 16 },
  { name: "APAC-IN", revenue: 26000, sales: 754, share: 11 },
  { name: "LATAM", revenue: 19000, sales: 540, share: 8 },
];

export const revenueTrend = [
  { day: "Mon", revenue: 142 },
  { day: "Tue", revenue: 138 },
  { day: "Wed", revenue: 158 },
  { day: "Thu", revenue: 172 },
  { day: "Fri", revenue: 195 },
  { day: "Sat", revenue: 218 },
  { day: "Sun", revenue: 231 },
];

export const insights = [
  { id: 1, kind: "down", text: "Price reduced by 5% on Espresso Machine due to overstock in EU-North.", time: "12 min ago" },
  { id: 2, kind: "up", text: "Price increased 7% on Wireless Earbuds Pro — strong demand in EU-Central.", time: "28 min ago" },
  { id: 3, kind: "down", text: "4K Action Cam matched to competitor markdown in APAC-IN.", time: "1h ago" },
  { id: 4, kind: "up", text: "Athletic Sneakers price lifted 6% — low stock, steady demand.", time: "2h ago" },
  { id: 5, kind: "info", text: "Cold Brew Maker trending in EU-Central — consider expanding listing.", time: "3h ago" },
];