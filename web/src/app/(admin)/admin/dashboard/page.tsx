import { apiFetch } from "@/lib/api";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = '7d' } = await searchParams;
  
  const [analytics, topProducts] = await Promise.all([
    apiFetch(`/analytics/overview?range=${range}`),
    apiFetch(`/analytics/top-products`)
  ]);

  return (
    <AnalyticsDashboardClient 
      stats={analytics.stats} 
      chartData={analytics.chartData} 
      topProducts={topProducts} 
      range={range} 
    />
  );
}
