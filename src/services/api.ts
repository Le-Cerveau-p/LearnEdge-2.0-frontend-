const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "https://learnedge-backend-workers.learnedge-2.workers.dev";

// const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    body = isFormData
      ? (options.body as BodyInit)
      : JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: isFormData
      ? {
          ...(options.headers ?? {}),
        }
      : {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
    body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.detail ?? data?.message ?? "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: ApiUser;
}

export interface QuizSummary {
  id: number;
  title: string;
  prompt: string;
  difficulty: string;
  question_type: string;
  created_at: string;
}

export interface GeneratedQuestion {
  id: number | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
}

export interface QuizCreateResponse {
  quiz: QuizSummary;
  questions: GeneratedQuestion[];
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface QuizDetailResponse {
  quiz: QuizSummary;
  questions: QuizQuestion[];
}

export interface QuizAnswerReview {
  question_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
}

export interface QuizSubmitResponse {
  attempt_id: number;
  quiz_id: number;
  user_id: number | null;
  score: number;
  total: number;
  correct_answers: number;
  incorrect_answers: number;
  results: QuizAnswerReview[];
}

export interface QuizHistoryItem {
  attempt_id: number;
  quiz_id: number;
  quiz_title: string;
  user_id: number | null;
  score: number;
  total: number;
  created_at: string;
}

export interface QuizHistoryResponse {
  items: QuizHistoryItem[];
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface QuizGeneratePayload {
  prompt: string;
  difficulty: string;
  number_of_questions: number;
  question_type: string;
  user_id?: number | null;
  document?: File | null;
}

export interface QuizSubmitPayload {
  user_id?: number | null;
  answers: Array<{
    question_id: number;
    user_answer: string;
  }>;
}

export const api = {
  baseUrl: API_BASE_URL,
  signup: (payload: SignupPayload) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: payload,
    }),
  login: (payload: LoginPayload) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),
  generateQuiz: (payload: QuizGeneratePayload) =>
    payload.document
      ? request<QuizCreateResponse>("/quiz/generate", {
          method: "POST",
          body: (() => {
            const formData = new FormData();
            formData.append("prompt", payload.prompt);
            formData.append("difficulty", payload.difficulty);
            formData.append(
              "number_of_questions",
              String(payload.number_of_questions),
            );
            formData.append("question_type", payload.question_type);
            if (payload.user_id !== undefined && payload.user_id !== null) {
              formData.append("user_id", String(payload.user_id));
            }
            formData.append("document", payload.document);
            return formData;
          })(),
        })
      : request<QuizCreateResponse>("/quiz/generate", {
          method: "POST",
          body: {
            prompt: payload.prompt,
            difficulty: payload.difficulty,
            number_of_questions: payload.number_of_questions,
            question_type: payload.question_type,
            user_id: payload.user_id ?? null,
          },
        }),
  fetchQuiz: (quizId: string | number) =>
    request<QuizDetailResponse>(`/quiz/${quizId}`),
  submitQuiz: (quizId: string | number, payload: QuizSubmitPayload) =>
    request<QuizSubmitResponse>(`/quiz/${quizId}/submit`, {
      method: "POST",
      body: payload,
    }),
  fetchQuizHistory: (userId?: number | null) => {
    const query = userId
      ? `?user_id=${encodeURIComponent(String(userId))}`
      : "";
    return request<QuizHistoryResponse>(`/quiz/history${query}`);
  },
};
