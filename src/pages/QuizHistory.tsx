import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Target, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { api, type QuizHistoryItem } from "../services/api";

export default function QuizHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadHistory() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.fetchQuizHistory(user.id);
        if (alive) {
          setHistory(response.items);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Failed to load history");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      alive = false;
    };
  }, [user]);

  const stats = useMemo(() => {
    const totalAttempts = history.length;
    const average =
      totalAttempts > 0
        ? history.reduce((sum, item) => sum + (item.score / item.total) * 100, 0) / totalAttempts
        : 0;
    const best = totalAttempts > 0 ? Math.max(...history.map((item) => (item.score / item.total) * 100)) : 0;
    return {
      totalAttempts,
      average: Math.round(average),
      best: Math.round(best),
    };
  }, [history]);

  const chartData = [...history]
    .reverse()
    .map((item) => ({
      date: new Date(item.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      score: Math.round((item.score / item.total) * 100),
    }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-8 text-white shadow-2xl"
      >
        <h1 className="text-4xl font-bold">Quiz History</h1>
        <p className="mt-3 max-w-2xl text-white/85">
          Review your past attempts, spot trends, and keep improving with real backend data.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Total Attempts" value={loading ? "..." : String(stats.totalAttempts)} icon={<Target className="h-6 w-6 text-[#2F2FE4]" />} />
        <MetricCard label="Average Score" value={loading ? "..." : `${stats.average}%`} icon={<TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />} />
        <MetricCard label="Best Score" value={loading ? "..." : `${stats.best}%`} icon={<Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />} />
        <MetricCard label="Latest Attempt" value={loading || !history[0] ? "--" : new Date(history[0].created_at).toLocaleDateString()} icon={<Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <h2 className="mb-4 text-xl font-bold text-[#1A1953] dark:text-white">
            Performance Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2F2FE4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <h2 className="mb-4 text-xl font-bold text-[#1A1953] dark:text-white">
            Recent Attempts
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-blue-200 p-6 text-center text-muted-foreground dark:border-blue-900/40">
              No attempts yet. Create your first quiz to see results here.
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 6).map((item) => {
                const accuracy = Math.round((item.score / item.total) * 100);

                return (
                  <div
                    key={item.attempt_id}
                    className="rounded-xl border border-blue-100 bg-[#F8FAFF] p-4 dark:border-blue-900/30 dark:bg-[#111827]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#1A1953] dark:text-white">
                          {item.quiz_title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()} | Attempt #{item.attempt_id}
                        </p>
                      </div>

                      <Link
                        to={`/app/result/${item.quiz_id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2F2FE4] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162E93]"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </Link>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Score {item.score}/{item.total}
                      </span>
                      <span className="font-semibold text-[#1A1953] dark:text-white">
                        {accuracy}%
                      </span>
                    </div>
                  </div>
                );
              })}
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
      className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-[#1A1953] dark:text-white">{value}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">{icon}</div>
      </div>
    </motion.div>
  );
}
