import { createBrowserRouter, redirect } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import QuizPlayer from "./pages/QuizPlayer";
import QuizResult from "./pages/QuizResult";
import QuizHistory from "./pages/QuizHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/app/signup",
    loader: () => redirect("/signup"),
  },
  {
    path: "/app",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateQuiz },
      { path: "quiz/:quizId", Component: QuizPlayer },
      { path: "result/:quizId", Component: QuizResult },
      { path: "history", Component: QuizHistory },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);
