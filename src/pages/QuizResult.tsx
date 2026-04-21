import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  CheckCircle,
  Home,
  RotateCcw,
  Share2,
  Trophy,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { type QuizDetailResponse, type QuizSubmitResponse } from "../services/api";

type ResultState = {
  quiz?: QuizDetailResponse;
  submission?: QuizSubmitResponse;
};

export default function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const state = location.state as ResultState | null;
  const [storedState, setStoredState] = useState<ResultState | null>(null);

  useEffect(() => {
    if (!quizId) {
      return;
    }

    const saved = localStorage.getItem(`learnedge_last_result_${quizId}`);
    if (saved) {
      try {
        setStoredState(JSON.parse(saved) as ResultState);
      } catch {
        setStoredState(null);
      }
    }
  }, [quizId]);

  const quiz = state?.quiz ?? storedState?.quiz;
  const submission = state?.submission ?? storedState?.submission;

  const score = submission?.score ?? 0;
  const totalQuestions = submission?.total ?? quiz?.questions.length ?? 0;
  const accuracy = totalQuestions ? (score / totalQuestions) * 100 : 0;

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2F2FE4", "#162E93", "#1A1953"],
      });
    }
  }, [accuracy]);

  if (!submission) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
        <h1 className="text-2xl font-bold text-[#1A1953] dark:text-white">No quiz result found</h1>
        <p className="mt-3 text-muted-foreground">
          Complete a quiz first so we can show the attempt summary here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-5 py-3 font-medium text-white"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-8 text-white md:p-12">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#1A1953]/30 blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Trophy className="h-10 w-10" />
            </motion.div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {accuracy >= 80 ? "Excellent Work!" : accuracy >= 60 ? "Good Job!" : "Keep Practicing!"}
            </h1>
            <p className="mb-8 text-lg opacity-90">
              Here is your score breakdown for {quiz?.quiz.title ?? "this quiz"}.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <ResultStat label="Score" value={`${score}/${totalQuestions}`} />
              <ResultStat label="Accuracy" value={`${accuracy.toFixed(0)}%`} />
              <ResultStat label="Quiz" value={quiz?.quiz.difficulty ?? "n/a"} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-6 py-3 font-medium text-[#1A1953] transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:bg-[#1A1D2E] dark:text-white"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
          to={`/app/quiz/${quizId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-6 py-3 font-medium text-[#1A1953] transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:bg-[#1A1D2E] dark:text-white"
          >
            <RotateCcw className="h-5 w-5" />
            Retake Quiz
          </Link>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-6 py-3 font-medium text-white transition-colors hover:bg-[#162E93]"
          >
            <Share2 className="h-5 w-5" />
            Share Results
          </button>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 dark:border-blue-900/30 dark:bg-[#1A1D2E]">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1A1953] dark:text-white">
            <TrendingUp className="h-6 w-6 text-[#2F2FE4]" />
            Performance Insights
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InsightCard
              icon={<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
              title="Correct Answers"
              value={String(submission.correct_answers)}
              tone="green"
            />
            <InsightCard
              icon={<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
              title="Incorrect Answers"
              value={String(submission.incorrect_answers)}
              tone="red"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-[#1A1953] dark:text-white">
            Detailed Review
          </h2>

          <div className="space-y-6">
            {submission.results.map((result, index) => {
              const options = [
                result.option_a,
                result.option_b,
                result.option_c,
                result.option_d,
              ];

              return (
                <motion.div
                  key={result.question_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className="rounded-2xl border border-blue-100 bg-white p-6 dark:border-blue-900/30 dark:bg-[#1A1D2E]"
                >
                  <div className="mb-4 flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        result.is_correct ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {result.is_correct ? (
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-2 font-bold text-[#1A1953] dark:text-white">
                        Question {index + 1}: {result.question_text}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your answer: {result.user_answer || "Not answered"} | Correct answer:{" "}
                        {result.correct_answer}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {options.map((option, optionIndex) => {
                      const letter = ["A", "B", "C", "D"][optionIndex];
                      const isCorrect = result.correct_answer === letter;
                      const isChosen = result.user_answer === letter;

                      return (
                        <div
                          key={letter}
                          className={`rounded-lg border p-3 ${
                            isCorrect
                              ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20"
                              : isChosen
                                ? "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20"
                                : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30"
                          }`}
                        >
                          <span className="font-medium text-[#1A1953] dark:text-white">
                            {letter}. {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
                    <p className="mb-1 font-medium text-[#1A1953] dark:text-white">
                      Explanation
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.explanation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
      <p className="mb-2 text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
  tone,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  tone: "green" | "red";
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        tone === "green"
          ? "border-green-100 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20"
          : "border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20"
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        {icon}
        <span className="font-bold text-[#1A1953] dark:text-white">{title}</span>
      </div>
      <p className="text-2xl font-bold text-[#1A1953] dark:text-white">{value}</p>
    </div>
  );
}
