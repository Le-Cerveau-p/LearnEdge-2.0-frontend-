import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Eye,
  MousePointerClick,
  Shield,
  Users,
  Workflow,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../constants/admin";
import { usePageViewAnalytics } from "../hooks/useAnalytics";
import { api, type AnalyticsStatsResponse } from "../services/api";

const RANGE_OPTIONS = [7, 30, 90] as const;

export default function AdminDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [rangeDays, setRangeDays] = useState<(typeof RANGE_OPTIONS)[number]>(30);
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageViewAnalytics("Admin Dashboard");

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let alive = true;

    async function loadStats() {
      try {
        setLoading(true);
        setError("");
        const response = await api.fetchAdminAnalytics(ADMIN_EMAIL, rangeDays);
        if (alive) {
          setStats(response);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Failed to load analytics");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      alive = false;
    };
  }, [isAdmin, rangeDays]);

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  const dailyChartData = useMemo(
    () =>
      (stats?.daily_activity ?? []).map((item) => ({
        date: new Date(item.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        pageViews: item.page_views,
        visitors: item.unique_visitors,
        events: item.events,
      })),
    [stats],
  );

  const topPageData = useMemo(
    () =>
      (stats?.top_pages ?? []).map((item) => ({
        path: item.path,
        count: item.count,
      })),
    [stats],
  );

  const totals = stats?.totals ?? {
    events: 0,
    unique_visitors: 0,
    unique_sessions: 0,
    active_users: 0,
    page_views: 0,
    quiz_generated: 0,
    quiz_started: 0,
    quiz_submitted: 0,
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1953] via-[#162E93] to-[#2F2FE4] p-8 text-white shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              Admin analytics
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">Site activity dashboard</h1>
            <p className="mt-4 text-lg text-white/85">
              Monitor how many people visit LearnEdge and what they do while they are here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <label className="text-sm font-medium text-white/80">Range</label>
            <select
              value={rangeDays}
              onChange={(event) => setRangeDays(Number(event.target.value) as (typeof RANGE_OPTIONS)[number])}
              className="rounded-xl border border-white/15 bg-white/15 px-4 py-2 text-white outline-none backdrop-blur-sm"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option} value={option} className="text-[#1A1953]">
                  Last {option} days
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Unique Visitors"
          value={loading ? "..." : String(totals.unique_visitors)}
          icon={<Users className="h-6 w-6 text-[#2F2FE4]" />}
        />
        <MetricCard
          label="Page Views"
          value={loading ? "..." : String(totals.page_views)}
          icon={<Eye className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />}
        />
        <MetricCard
          label="Total Events"
          value={loading ? "..." : String(totals.events)}
          icon={<Activity className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
        <MetricCard
          label="Active Users"
          value={loading ? "..." : String(totals.active_users)}
          icon={<Workflow className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          label="Quiz Generated"
          value={loading ? "..." : String(totals.quiz_generated)}
          icon={<BarChart3 className="h-6 w-6 text-[#2F2FE4]" />}
        />
        <MetricCard
          label="Quiz Started"
          value={loading ? "..." : String(totals.quiz_started)}
          icon={<MousePointerClick className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
        />
        <MetricCard
          label="Quiz Submitted"
          value={loading ? "..." : String(totals.quiz_submitted)}
          icon={<CalendarDays className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1A1953] dark:text-white">Activity trend</h2>
              <p className="text-sm text-muted-foreground">Page views, unique visitors, and total events over time.</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-[#2F2FE4] dark:bg-blue-900/20">
              Last {rangeDays} days
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageViews" stroke="#2F2FE4" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="visitors" stroke="#16A34A" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="events" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#1A1953] dark:text-white">Top pages</h2>
            <p className="text-sm text-muted-foreground">Where visitors spend their time.</p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="path" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2F2FE4" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <h2 className="mb-4 text-xl font-bold text-[#1A1953] dark:text-white">Event breakdown</h2>
          <div className="space-y-3">
            {(stats?.event_breakdown ?? []).map((item) => (
              <div
                key={item.event_name}
                className="flex items-center justify-between rounded-xl border border-blue-100 bg-[#F8FAFF] px-4 py-3 dark:border-blue-900/30 dark:bg-[#111827]"
              >
                <span className="font-medium text-[#1A1953] dark:text-white">{formatEventLabel(item.event_name)}</span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#2F2FE4] dark:bg-blue-900/20">
                  {item.count}
                </span>
              </div>
            ))}
            {(stats?.event_breakdown ?? []).length === 0 && !loading && (
              <div className="rounded-xl border border-dashed border-blue-200 p-6 text-center text-muted-foreground dark:border-blue-900/40">
                No events collected yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#1A1953] dark:text-white">Recent activity</h2>
            <p className="text-sm text-muted-foreground">Latest visits and product interactions.</p>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading recent events...</p>
          ) : stats?.recent_events.length ? (
            <div className="space-y-3">
              {stats.recent_events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-blue-100 bg-[#F8FAFF] p-4 dark:border-blue-900/30 dark:bg-[#111827]"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-[#1A1953] dark:text-white">
                        {formatEventLabel(event.event_name)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.user_email ?? "Anonymous"} | {event.path ?? "Unknown path"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </div>

                  {Object.keys(event.metadata ?? {}).length > 0 && (
                    <p className="mt-3 text-sm text-[#1A1953] dark:text-white">
                      {formatMetadataSummary(event.metadata)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-blue-200 p-6 text-center text-muted-foreground dark:border-blue-900/40">
              No recent activity to show.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-blue-900/30 dark:bg-[#1A1D2E]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-[#1A1953] dark:text-white">{value}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">{icon}</div>
      </div>
    </motion.div>
  );
}

function formatEventLabel(eventName: string) {
  return eventName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMetadataSummary(metadata: Record<string, unknown>) {
  const entries = Object.entries(metadata).slice(0, 4);
  return entries
    .map(([key, value]) => `${formatEventLabel(key)}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join(" | ");
}
