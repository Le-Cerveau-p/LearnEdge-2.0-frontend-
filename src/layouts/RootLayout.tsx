import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Brain, Home, Plus, History, LogOut, Moon, Sun, User, Menu, X, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LogoutModal from "../components/LogoutModal";
import { ADMIN_EMAIL } from "../constants/admin";

export default function RootLayout() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/app" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-[#2F2FE4] to-[#162E93] p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#1A1953] to-[#162E93] dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  LearnEdge 2.0
                </h1>
                <p className="text-[11px] sm:text-xs text-muted-foreground -mt-0.5">AI-Powered Learning</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
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

              {isAdmin && (
                <Link
                  to="/app/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/app/admin")
                      ? "bg-[#2F2FE4] text-white shadow-md"
                      : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}

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

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="inline-flex md:hidden items-center justify-center rounded-xl border border-blue-100 dark:border-blue-900/40 bg-white/90 dark:bg-[#1F2436] p-2.5 text-[#1A1953] dark:text-white shadow-sm"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-xl dark:border-blue-900/30 dark:bg-[#171A28]/95 md:hidden">
              <Link
                to="/app"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive("/app")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                to="/app/create"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive("/app/create")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Create Quiz</span>
              </Link>

              <Link
                to="/app/history"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive("/app/history")
                    ? "bg-[#2F2FE4] text-white shadow-md"
                    : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                >
                <History className="h-4 w-4" />
                <span className="font-medium">History</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/app/admin"
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive("/app/admin")
                      ? "bg-[#2F2FE4] text-white shadow-md"
                      : "text-[#1A1953] dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}

              <div className="flex items-center justify-between rounded-xl border border-blue-100 px-4 py-3 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2F2FE4] to-[#162E93]">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1953] dark:text-white">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="rounded-lg p-2 text-[#1A1953] dark:text-white"
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
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
