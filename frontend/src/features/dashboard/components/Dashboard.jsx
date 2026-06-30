import { useState, useEffect } from "react";
import dashboardService from "../../../services/dashboardService";
import StatCards from "./StatCards";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import RevenueChart from "./RevenueChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, activityData, revenueData] = await Promise.all([
          dashboardService.fetchStats(),
          dashboardService.fetchRecentActivity(),
          dashboardService.fetchRevenue(period),
        ]);
        setStats(statsData);
        setActivity(activityData);
        setRevenue(revenueData);
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
            Dashboard
          </h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Vue d'ensemble de votre activité.
          </p>
        </div>
        <span className="text-[0.8125rem] text-ink-muted hidden sm:block">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <StatCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentActivity activity={activity} loading={loading} />
        <QuickActions />
      </div>

      <RevenueChart
        revenue={revenue}
        period={period}
        onPeriodChange={setPeriod}
      />
    </div>
  );
}
