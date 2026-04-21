import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Plus,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api, type QuizHistoryItem } from "../services/api";

export default function Home() {
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

  const totalAttempts = history.length;
  const averageScore = totalAttempts
    ? Math.round(
        (history.reduce((sum, item) => sum + (item.score / item.total) * 100, 0) /
          totalAttempts) *
          10,
      ) / 10
    : 0;
  const bestScore = totalAttempts
    ? Math.max(...history.map((item) => Math.round((item.score / item.total) * 100)))
    : 0;
  const recentHistory = history.slice(0, 3);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1A1953]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">
              AI-Powered Learning
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user?.name ?? "Learner"}
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Generate quizzes from any topic, take them instantly, and track your
            progress with real history from the backend.
          </p>
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 bg-white text-[#2F2FE4] px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create New Quiz
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          delay={0.1}
          label="Total Attempts"
          value={loading ? "..." : String(totalAttempts)}
          icon={<Target className="w-6 h-6 text-[#2F2FE4]" />}
        />
        <StatCard
          delay={0.2}
          label="Average Score"
          value={loading ? "..." : `${averageScore.toFixed(1)}%`}
          icon={<Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />}
        />
        <StatCard
          delay={0.3}
          label="Best Score"
          value={loading ? "..." : `${bestScore}%`}
          icon={<TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1A1953] dark:text-white">
          Recent Attempts
        </h2>
        <Link
          to="/app/history"
          className="text-[#2F2FE4] hover:text-[#162E93] font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-6 text-muted-foreground dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          Loading your attempts...
        </div>
      ) : recentHistory.length === 0 ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-8 dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <p className="mb-4 text-lg font-semibold text-[#1A1953] dark:text-white">
            You have no quiz attempts yet.
          </p>
          <p className="mb-6 text-muted-foreground">
            Create your first quiz to start building your history.
          </p>
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-5 py-3 font-medium text-white transition-colors hover:bg-[#162E93]"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentHistory.map((quiz, index) => {
            const accuracy = Math.round((quiz.score / quiz.total) * 100);
            return (
              <motion.div
                key={quiz.attempt_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group rounded-2xl border border-blue-100 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#1A1953] transition-colors group-hover:text-[#2F2FE4] dark:text-white">
                      {quiz.quiz_title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Score {quiz.score}/{quiz.total} - {accuracy}% accuracy
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-[#2F2FE4] dark:bg-blue-900/20">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Attempt #{quiz.attempt_id}</span>
                    </div>
                    <Link
                      to={`/app/result/${quiz.quiz_id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-4 py-2 font-medium text-white transition-colors hover:bg-[#162E93]"
                    >
                      Review
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-blue-100 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]"
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
