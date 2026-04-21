import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsGenerating(true);

    try {
      const response = await api.generateQuiz({
        prompt,
        difficulty,
        number_of_questions: questionCount,
        question_type: questionType,
        user_id: user?.id ?? null,
        document: documentFile,
      });

      navigate(`/app/quiz/${response.quiz.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-8 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm opacity-80">AI Quiz Builder</p>
            <h1 className="text-3xl font-bold">Create a new quiz</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-white/85">
          Give LearnEdge a topic and it will generate a structured quiz using the backend AI service.
        </p>
      </motion.div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-[#1A1D2E]">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-medium text-[#1A1953] dark:text-white">
              Quiz prompt
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Example: JavaScript closures, React hooks, or CSS grid layouts"
                rows={5}
                required
                className="w-full rounded-xl border border-blue-100 bg-[#F8FAFF] py-3 pl-10 pr-4 text-[#1A1953] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2F2FE4] dark:border-blue-900/30 dark:bg-[#1F2937] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#1A1953] dark:text-white">
              Reference document
            </label>
            <div className="rounded-xl border border-dashed border-blue-200 bg-[#F8FAFF] p-4 dark:border-blue-900/40 dark:bg-[#1F2937]">
              <input
                type="file"
                accept=".txt,.md,.csv,.json,.pdf,.docx"
                onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-[#1A1953] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2F2FE4] file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-[#162E93] dark:text-white"
              />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                Upload a reference file to make the quiz more specific. Supported formats are .txt, .md, .csv, .json, .pdf, and .docx.
              </p>
              {documentFile && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-sm text-[#1A1953] dark:bg-white/10 dark:text-white">
                  <span className="truncate">{documentFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setDocumentFile(null)}
                    className="ml-3 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-medium text-[#1A1953] dark:text-white">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as "easy" | "medium" | "hard")}
                className="w-full rounded-xl border border-blue-100 bg-[#F8FAFF] px-4 py-3 text-[#1A1953] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2F2FE4] dark:border-blue-900/30 dark:bg-[#1F2937] dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#1A1953] dark:text-white">
                Question Count
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={questionCount}
                onChange={(event) => setQuestionCount(Number(event.target.value))}
                className="w-full rounded-xl border border-blue-100 bg-[#F8FAFF] px-4 py-3 text-[#1A1953] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2F2FE4] dark:border-blue-900/30 dark:bg-[#1F2937] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#1A1953] dark:text-white">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(event) => setQuestionType(event.target.value)}
                className="w-full rounded-xl border border-blue-100 bg-[#F8FAFF] px-4 py-3 text-[#1A1953] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2F2FE4] dark:border-blue-900/30 dark:bg-[#1F2937] dark:text-white"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="theory">Theory</option>
                <option value="objective">Objective</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`w-full rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 ${
              isGenerating
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-[#2F2FE4] to-[#162E93] hover:scale-[1.01] hover:shadow-xl"
            }`}
          >
            {isGenerating ? "Generating quiz..." : "Generate Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
