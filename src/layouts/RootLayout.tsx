import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Brain, Home, Plus, History, LogOut, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LogoutModal from "../components/LogoutModal";

export default function RootLayout() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isActive = (path: string) => {
    if (path === "/app" && location.pathname === "/app") return true;
    if (path !== "/app" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 dark:from-[#0F1117] dark:via-[#1A1D2E] dark:to-[#0F1117]">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-[#1A1D2E]/80 backdrop-blur-lg border-b border-blue-100 dark:border-blue-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1A1953] to-[#162E93] dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  LearnEdge 2.0
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5">AI-Powered Learning</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/app"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/app")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                to="/app/create"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/app/create")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Create Quiz</span>
              </Link>

              <Link
                to="/app/history"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/app/history")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="font-medium">History</span>
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg ml-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2F2FE4] to-[#162E93] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-[#1A1953] dark:text-white">{user?.name}</span>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A1953] dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  );
}
