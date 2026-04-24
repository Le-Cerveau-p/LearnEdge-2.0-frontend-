import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Flag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api, type QuizDetailResponse, type QuizQuestion } from "../services/api";

const ANSWER_OPTIONS = ["A", "B", "C", "D"] as const;

export default function QuizPlayer() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<QuizDetailResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const answeredCount = useMemo(
    () => Object.values(selectedAnswers).filter(Boolean).length,
    [selectedAnswers],
  );
  const quizType = quiz?.quiz.question_type.trim().toLowerCase() ?? "";
  const isObjectiveQuiz = quizType === "objective" || quizType === "multiple_choice";

  useEffect(() => {
    let alive = true;

    async function loadQuiz() {
      if (!quizId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.fetchQuiz(quizId);
        if (alive) {
          setQuiz(response);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Failed to load quiz");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      alive = false;
    };
  }, [quizId]);

  const questionCount = quiz?.questions.length ?? 0;
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = questionCount ? (answeredCount / questionCount) * 100 : 0;

  const selectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    if (!quiz || !quizId) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const submission = await api.submitQuiz(quizId, {
        user_id: user?.id ?? null,
        answers: quiz.questions.map((question) => ({
          question_id: question.id,
          user_answer: selectedAnswers[question.id] ?? "",
        })),
      });

      const payload = { quiz, submission };
      localStorage.setItem(`learnedge_last_result_${quizId}`, JSON.stringify(payload));
      navigate(`/app/result/${quizId}`, { state: payload });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center text-muted-foreground dark:border-blue-900/30 dark:bg-[#1A1D2E]">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
        {error || "Quiz not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/70">
              Quiz Session
            </p>
            <h1 className="mt-2 text-3xl font-bold">{quiz.quiz.title}</h1>
            <p className="mt-2 max-w-2xl text-white/80">{quiz.quiz.prompt}</p>
          </div>

          <div className="flex items-center gap-3">
            <InfoPill icon={<Clock className="h-4 w-4" />} label={`${answeredCount}/${questionCount} answered`} />
            <InfoPill icon={<Flag className="h-4 w-4" />} label={quiz.quiz.difficulty} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {questionCount}
          </span>
          <span>{Math.round((answeredCount / questionCount) * 100)}% complete</span>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2F2FE4] to-[#162E93]"
            style={{ width: `${progress}%` } as CSSProperties}
          />
        </div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#1A1953] dark:text-white">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {isObjectiveQuiz ? (
                <div className="grid gap-3">
                  {ANSWER_OPTIONS.map((option) => {
                    const value = getQuestionOption(currentQuestion, option);
                    const isActive = selectedAnswers[currentQuestion.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(currentQuestion.id, option)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          isActive
                            ? "border-[#2F2FE4] bg-blue-50 dark:bg-blue-900/20"
                            : "border-blue-100 bg-[#F8FAFF] hover:border-[#2F2FE4] hover:bg-blue-50 dark:border-blue-900/30 dark:bg-[#111827]"
                        }`}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-bold text-[#2F2FE4] shadow-sm dark:bg-[#1A1D2E]">
                          {option}
                        </span>
                        <span className="flex-1 text-[#1A1953] dark:text-white">
                          {value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={selectedAnswers[currentQuestion.id] ?? ""}
                    onChange={(event) =>
                      selectAnswer(currentQuestion.id, event.target.value)
                    }
                    rows={6}
                    placeholder={
                      quizType === "german"
                        ? "Type the missing word or phrase here..."
                        : "Type your answer here..."
                    }
                    className="w-full rounded-xl border border-blue-100 bg-[#F8FAFF] px-4 py-3 text-[#1A1953] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2F2FE4] dark:border-blue-900/30 dark:bg-[#111827] dark:text-white"
                  />
                  <p className="text-sm text-muted-foreground">
                    {quizType === "german"
                      ? "For fill-in-the-gaps, semantic matches and acceptable alternatives can still be marked correct by AI."
                      : "Write a short answer. The grader will check for meaning, not just exact wording."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentQuestionIndex((value) => Math.max(0, value - 1))}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-5 py-3 font-medium text-[#1A1953] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900/30 dark:bg-[#1A1D2E] dark:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((question, index) => (
            <button
              key={question.id}
              type="button"
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-3 w-8 rounded-full transition-all ${
                currentQuestionIndex === index
                  ? "bg-[#2F2FE4]"
                  : selectedAnswers[question.id]
                    ? "bg-blue-300"
                    : "bg-blue-100 dark:bg-blue-900/30"
              }`}
            />
          ))}
        </div>

        {currentQuestionIndex < questionCount - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentQuestionIndex((value) => Math.min(questionCount - 1, value + 1))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-5 py-3 font-medium text-white transition-colors hover:bg-[#162E93]"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submitQuiz}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F2FE4] px-5 py-3 font-medium text-white transition-colors hover:bg-[#162E93] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle className="h-5 w-5" />
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}

function getQuestionOption(question: QuizQuestion, option: string) {
  switch (option) {
    case "A":
      return question.option_a;
    case "B":
      return question.option_b;
    case "C":
      return question.option_c;
    case "D":
      return question.option_d;
    default:
      return "";
  }
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}
