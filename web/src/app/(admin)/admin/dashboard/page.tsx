import { apiFetch } from "@/lib/api";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = '7d' } = await searchParams;
  
  const analytics = await apiFetch(`/analytics/overview?range=${range}`);
  const topProducts = await apiFetch(`/analytics/top-products`);

  return (
    <AnalyticsDashboardClient 
      stats={analytics.stats} 
      chartData={analytics.chartData} 
      topProducts={topProducts} 
      range={range} 
    />
  );
}
